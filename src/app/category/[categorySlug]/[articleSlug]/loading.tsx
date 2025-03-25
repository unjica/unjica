export default function Loading() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-[60vh] min-h-[400px] bg-gray-700 rounded-xl mb-8" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-700 rounded w-1/2" />
            <div className="h-4 bg-gray-700 rounded w-2/3" />
            <div className="h-4 bg-gray-700 rounded w-1/3" />
          </div>
        </div>
      </div>
    </div>
  );
} 