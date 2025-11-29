interface LoadingIndicatorProps {
  loading: boolean;
}

export function LoadingIndicator({ loading }: LoadingIndicatorProps) {
  if (!loading) return null;

  return (
    <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-1000">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
        <div>
          <span className="text-sm font-medium text-gray-800">Menganalisis risiko...</span>
          <div className="text-xs text-gray-500">Memproses data geospasial</div>
        </div>
      </div>
    </div>
  );
}