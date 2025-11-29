// components/map/DistrictMarkers.tsx
import { Subdistrict } from '@/types';
import { RiskMarker } from './RiskMarker';

interface DistrictMarkersProps {
  subdistricts: Subdistrict[];
  visible: boolean;
  onMarkerClick?: (subdistrict: Subdistrict) => void;
}

export function DistrictMarkers({ subdistricts, visible, onMarkerClick }: DistrictMarkersProps) {
  if (!visible || subdistricts.length === 0) return null;

  return (
    <>
      {subdistricts.map((subdistrict) => (
        <RiskMarker
          key={subdistrict.id}
          position={subdistrict.position}
          riskData={subdistrict.riskData}
          onClose={() => onMarkerClick?.(subdistrict)}
        />
      ))}
    </>
  );
}