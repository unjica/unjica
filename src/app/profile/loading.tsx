export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* User Profile Header Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 animate-pulse">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            </div>
            <div className="ml-6 flex-grow">
              <div className="h-6 w-48 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
              <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
              <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
              <div className="h-6 w-12 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-2"></div>
              <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
              <div className="h-6 w-12 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-2"></div>
              <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
              <div className="h-6 w-12 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-2"></div>
              <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
            </div>
          </div>
        </div>
        
        {/* Activity Tabs Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex px-6 py-3 space-x-6">
              <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between mb-4">
                    <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"></div>
                  <div className="h-4 w-48 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 