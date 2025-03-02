'use client';

import { useState, useEffect, useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { GradientText } from '@/components/ui/GradientText';
import { Button } from '@/components/ui/Button';
import { type ArtNewsItem } from '@/lib/agents/artNewsAgent';

export default function ArtNewsPage() {
  const [news, setNews] = useState<ArtNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // Approximately 8-9 items per page (25/3)
  const initialLoadDone = useRef(false);
  
  // Use a ref to track if we're in the middle of a page redirect to avoid loops
  const isRedirecting = useRef(false);
  
  // Main data fetching effect
  useEffect(() => {
    let isMounted = true;
    
    async function fetchNews() {
      try {
        setLoading(true);
        const apiUrl = `/api/art-news?page=${currentPage}&pageSize=${pageSize}`;
        console.log(`Fetching news from: ${apiUrl}`);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch art news: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        console.log('API response:', data);
        
        if (isMounted) {
          setNews(data.news || []);
          
          // We're fixing the total pages at 3, so we don't need to update it from the API
          // but we'll update the pageSize if it comes back different from what we expect
          if (data.pageSize !== pageSize) {
            setPageSize(data.pageSize);
          }
          
          // Mark initial load as complete
          if (!initialLoadDone.current) {
            initialLoadDone.current = true;
          }
          
          // If we're requesting a page that doesn't exist or is empty
          if (currentPage > 3) {
            if (!isRedirecting.current) {
              console.log(`Page ${currentPage} is beyond our limit of 3, redirecting to page 3`);
              
              // Prevent redirect loops
              isRedirecting.current = true;
              setCurrentPage(3); // Always max of 3 pages
              
              // Reset the redirecting flag after a short delay
              setTimeout(() => {
                isRedirecting.current = false;
              }, 100);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching art news:', err);
        if (isMounted) {
          setError(`Failed to load art news. ${err instanceof Error ? err.message : 'Please try again later.'}`);
          setNews([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    if (!isRedirecting.current) {
      fetchNews();
    }
    
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize]); 
  
  const handlePageChange = (newPage: number) => {
    // Always limit to 3 pages max
    const targetPage = Math.min(newPage, 3);
    
    if (targetPage !== newPage) {
      console.log(`Requested page ${newPage} exceeds our limit of 3 pages, using ${targetPage} instead`);
    }
    
    // Prevent setting the same page (avoids unnecessary re-fetches)
    if (targetPage === currentPage) return;
    
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Set the new page
    setCurrentPage(targetPage);
  };
  
  // Always display exactly 3 pages
  const actualPageCount = 3;
  
  return (
    <main className="py-16">
      <Container>
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <GradientText>Modern Art News</GradientText>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Stay updated with the latest news from the modern art world. Our AI regularly collects
            and analyzes news from various sources.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-red-500">{error}</p>
            <Button
              onClick={() => {
                setError(null);
                setCurrentPage(1);
              }}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {currentPage > 1 
                ? `No articles found on page ${currentPage}. This may be due to API limitations.` 
                : 'No art news articles are available at the moment.'}
            </p>
            {currentPage > 1 && (
              <Button
                onClick={() => setCurrentPage(1)}
                className="mt-2"
              >
                Go to First Page
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {news.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  {item.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Replace broken images with a placeholder
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Art+News';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {item.description.substring(0, 120)}
                      {item.description.length > 120 ? '...' : ''}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(item.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {item.source}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag} 
                          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination indicators */}
            <div className="text-center text-sm text-gray-500 mt-6">
              Page {currentPage} of {actualPageCount} • Showing {news.length} items
            </div>
            
            {/* Pagination */}
            {actualPageCount > 1 && (
              <div className="flex justify-center mt-4">
                <nav className="flex items-center space-x-2" aria-label="Pagination">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1 || loading}
                    className="px-2 py-1"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {/* Always show simple pagination for 3 or fewer pages */}
                    {Array.from({ length: actualPageCount }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "gradient" : "outline"}
                        onClick={() => handlePageChange(page)}
                        disabled={loading}
                        className="w-8 h-8 rounded-md p-0"
                      >
                        <span className="mx-auto">{page}</span>
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(Math.min(currentPage + 1, actualPageCount))}
                    disabled={currentPage === actualPageCount || loading}
                    className="px-2 py-1"
                  >
                    Next
                  </Button>
                </nav>
              </div>
            )}
          </>
        )}
      </Container>
    </main>
  );
} 