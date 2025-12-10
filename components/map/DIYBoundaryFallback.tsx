// components/map/DIYBoundaryFallback.tsx
import { useEffect } from "react"
import { useMap, Polygon } from "react-leaflet"
import L from "leaflet"

const DIY_FALLBACK_BOUNDS = {
  southWest: [-8.2, 110.1] as [number, number],
  northEast: [-7.5, 110.7] as [number, number],
}

// Koordinat polygon untuk DIY
const DIY_POLYGON_COORDINATES: L.LatLngExpression[] = [
  [-7.5, 110.1],
  [-7.5, 110.7],
  [-8.2, 110.7],
  [-8.2, 110.1],
  [-7.5, 110.1],
]

// Koordinat untuk area gelap di luar DIY (whole world minus DIY)
const createOutsideDIYPolygon = (): L.LatLngExpression[] => {
  // Create a polygon that covers the entire world with a hole for DIY
  return [
    [-90, -180], // Bottom left
    [-90, 180],  // Bottom right  
    [90, 180],   // Top right
    [90, -180],  // Top left
    [-90, -180], // Back to start
    ...DIY_POLYGON_COORDINATES.slice().reverse() // Cut out DIY area
  ]
}

export function DIYBoundaryFallback() {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const bounds = L.latLngBounds(
      L.latLng(
        DIY_FALLBACK_BOUNDS.southWest[0],
        DIY_FALLBACK_BOUNDS.southWest[1]
      ),
      L.latLng(
        DIY_FALLBACK_BOUNDS.northEast[0],
        DIY_FALLBACK_BOUNDS.northEast[1]
      )
    )

    // Set bounds
    map.setMaxBounds(bounds)

    // Force pan inside bounds
    const handleDrag = () => {
      map.panInsideBounds(bounds, { animate: false })
    }
    
    map.on("drag", handleDrag)

    // Set zoom limits
    map.setMinZoom(9)
    map.setMaxZoom(16)

    // Set initial view
    map.setView([-7.7972, 110.3688], 10)

    // Handler untuk klik di luar DIY
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      
      if (!bounds.contains(e.latlng)) {
        const warningPopup = L.popup()
          .setLatLng(e.latlng)
          .setContent(`
            <div style="padding: 12px; min-width: 240px; font-family: system-ui, -apple-system, sans-serif;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="background: #f59e0b; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">
                  ⚠️
                </span>
                <div>
                  <strong style="color: #d97706; font-size: 15px;">Area di Luar DIY</strong>
                  <div style="font-size: 12px; color: #9ca3af; margin-top: 2px;">Luar Daerah Istimewa Yogyakarta</div>
                </div>
              </div>
              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 10px;">
                Sistem hanya mendukung analisis risiko untuk wilayah Daerah Istimewa Yogyakarta.
                <br><br>
                <small style="color: #9ca3af;">Klik area hijau untuk melakukan analisis risiko.</small>
              </p>
              <div style="background: #f3f4f6; padding: 8px; border-radius: 4px; font-size: 12px; color: #6b7280;">
                📍 Koordinat: ${lat.toFixed(4)}, ${lng.toFixed(4)}
              </div>
            </div>
          `)
        
        // Add a temporary warning marker
        const warningMarker = L.marker([lat, lng], {
          icon: L.divIcon({
            html: '<div style="background: #f59e0b; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; font-size: 14px; color: white; font-weight: bold;">⛔</div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          }),
          zIndexOffset: 1000
        })
          .addTo(map)
          .bindPopup(warningPopup)
          .openPopup()
        
        // Remove marker after 5 seconds
        setTimeout(() => {
          if (map && warningMarker) {
            map.removeLayer(warningMarker)
          }
        }, 5000)
      }
    }

    map.on('click', handleMapClick)

    // Add legend control menggunakan L.Control.extend
    const InfoControl = L.Control.extend({
      onAdd: function() {
        const div = L.DomUtil.create('div', 'info-control')
        div.innerHTML = `
          <div style="background: rgba(255, 255, 255, 0.95); padding: 10px 14px; border-radius: 6px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.1); font-size: 12px; backdrop-filter: blur(4px);">
            <div style="font-weight: 600; color: #374151; margin-bottom: 8px; display: flex; align-items: center;">
              <span style="margin-right: 6px;">🗺️</span> Legenda Area
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 6px;">
              <div style="width: 12px; height: 12px; background: #10b981; border-radius: 50%; margin-right: 8px; border: 1px solid white; box-shadow: 0 1px 2px rgba(0,0,0,0.1);"></div>
              <span style="color: #374151;">Wilayah DIY</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 6px;">
              <div style="width: 12px; height: 12px; background: #1e293b; border-radius: 50%; margin-right: 8px; border: 1px solid white; box-shadow: 0 1px 2px rgba(0,0,0,0.1);"></div>
              <span style="color: #374151;">Luar DIY</span>
            </div>
            <div style="border-top: 1px solid #e5e7eb; margin-top: 8px; padding-top: 8px; font-size: 11px; color: #6b7280;">
              <span style="color: #10b981;">●</span> Klik area hijau untuk analisis
            </div>
          </div>
        `
        return div
      }
    })

    const infoControl = new InfoControl({ position: 'bottomleft' })
    infoControl.addTo(map)

    return () => {
      if (infoControl && map) {
        map.removeControl(infoControl)
      }
      map.off("drag", handleDrag)
      map.off('click', handleMapClick)
    }
  }, [map])

  // Event handlers untuk area gelap - FIXED: tambahkan parameter e
  const handleOutsideDIYMouseOver = (e: L.LeafletEvent) => {
    const layer = e.target as L.Path
    layer.setStyle({
      fillOpacity: 0.75
    })
  }

  const handleOutsideDIYMouseOut = (e: L.LeafletEvent) => {
    const layer = e.target as L.Path
    layer.setStyle({
      fillOpacity: 0.7
    })
  }

  return (
    <>
      {/* Area gelap di luar DIY */}
      <Polygon
        positions={createOutsideDIYPolygon()}
        pathOptions={{
          fillColor: "rgba(15, 23, 42, 0.7)",
          fillOpacity: 0.7,
          weight: 0,
          color: "transparent",
          fillRule: "evenodd"
        }}
        eventHandlers={{
          click: (e: L.LeafletMouseEvent) => {
            map.fire("click", { latlng: e.latlng })
          },
          mouseover: handleOutsideDIYMouseOver,
          mouseout: handleOutsideDIYMouseOut
        }}
      />
      
      {/* Batas DIY */}
      <Polygon
        positions={DIY_POLYGON_COORDINATES}
        pathOptions={{
          color: "#10b981",
          weight: 3,
          opacity: 0.8,
          fillColor: "rgba(16, 185, 129, 0.2)",
          fillOpacity: 0.2,
          dashArray: "10, 5",
        }}
        eventHandlers={{
          mouseover: (e: L.LeafletEvent) => {
            const layer = e.target as L.Path
            layer.setStyle({
              weight: 4,
              opacity: 1,
              fillOpacity: 0.15,
              color: "#059669"
            })
          },
          mouseout: (e: L.LeafletEvent) => {
            const layer = e.target as L.Path
            layer.setStyle({
              weight: 3,
              opacity: 0.8,
              fillOpacity: 0.1,
              color: "#10b981"
            })
          },
          click: (e: L.LeafletMouseEvent) => {
            const latlng = e.latlng
            map.fire("click", { latlng })
          },
        }}
      />

      {/* Corner indicators for DIY bounds */}
      <Polygon
        positions={[
          [DIY_FALLBACK_BOUNDS.southWest[0], DIY_FALLBACK_BOUNDS.southWest[1]],
          [DIY_FALLBACK_BOUNDS.southWest[0] + 0.01, DIY_FALLBACK_BOUNDS.southWest[1]],
          [DIY_FALLBACK_BOUNDS.southWest[0] + 0.01, DIY_FALLBACK_BOUNDS.southWest[1] + 0.01],
          [DIY_FALLBACK_BOUNDS.southWest[0], DIY_FALLBACK_BOUNDS.southWest[1] + 0.01]
        ]}
        pathOptions={{
          fillColor: "#10b981",
          fillOpacity: 0.3,
          weight: 1,
          color: "#10b981",
          opacity: 0.5
        }}
      />
    </>
  )
}