import { useEffect } from "react";
import { useMap, Polygon } from "react-leaflet";
import L from "leaflet";

const DIY_FALLBACK_BOUNDS = {
  southWest: [-8.2, 110.1] as [number, number],
  northEast: [-7.5, 110.7] as [number, number],
};

// Koordinat polygon untuk DIY (fallback sederhana)
const DIY_POLYGON_COORDINATES: L.LatLngExpression[] = [
  [-7.5, 110.1],
  [-7.5, 110.7],
  [-8.2, 110.7],
  [-8.2, 110.1],
  [-7.5, 110.1],
];

export function DIYBoundaryFallback() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const bounds = L.latLngBounds(
      L.latLng(
        DIY_FALLBACK_BOUNDS.southWest[0],
        DIY_FALLBACK_BOUNDS.southWest[1]
      ),
      L.latLng(
        DIY_FALLBACK_BOUNDS.northEast[0],
        DIY_FALLBACK_BOUNDS.northEast[1]
      )
    );

    // Set bounds
    map.setMaxBounds(bounds);

    // Force pan inside bounds
    map.on("drag", () => {
      map.panInsideBounds(bounds, { animate: false });
    });

    // Set zoom limits
    map.setMinZoom(9);
    map.setMaxZoom(16);

    // Set initial view
    map.setView([-7.7972, 110.3688], 10);

    return () => {
      map.off("drag");
    };
  }, [map]);

  return (
    <Polygon
      positions={DIY_POLYGON_COORDINATES}
      pathOptions={{
        color: "#10b981",
        weight: 3,
        opacity: 0.8,
        fillColor: "rgba(16, 185, 129, 0.2)", // Lebih terang
        fillOpacity: 0.2, // Lebih terang
        dashArray: "10, 5",
      }}
      eventHandlers={{
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 4,
            opacity: 1,
            fillOpacity: 0.15,
          });
        },
        mouseout: (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 3,
            opacity: 0.8,
            fillOpacity: 0.1,
          });
        },
        click: (e) => {
          const latlng = e.latlng;
          map.fire("click", { latlng });
        },
      }}
    />
  );
}
