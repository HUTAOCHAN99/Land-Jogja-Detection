// components/map/HistoryMarkers.tsx
import { AnalyzedPoint } from '@/types';
import { RiskMarker } from './RiskMarker';

interface HistoryMarkersProps {
  points: AnalyzedPoint[];
  visible: boolean;
  onMarkerClick?: (point: AnalyzedPoint) => void;
}

export function HistoryMarkers({ points, visible, onMarkerClick }: HistoryMarkersProps) {
  if (!visible || points.length === 0) return null;

  return (
    <>
      {points.map((point) => (
        <RiskMarker
          key={point.id}
          position={point.position}
          riskData={point.riskData}
          onClose={() => onMarkerClick?.(point)}
        />
      ))}
    </>
  );
}