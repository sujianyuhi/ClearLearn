export default function LoadingCard() {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-full mb-3" />
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-4/5" />
    </div>
  );
}

export function LoadingText() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-4 bg-gray-200 rounded w-4/5" />
    </div>
  );
}
