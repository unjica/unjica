'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { GradientText } from '@/components/ui/GradientText';
import { Button } from '@/components/ui/Button';
import { DigestArticleCard } from '@/components/ui/art-news/digest/DigestArticleCard';
import { type GeneratedArticle } from '@/lib/agents/models/generatedArticle';
import { useSession } from 'next-auth/react';
import { AdminControls } from '@/components/ui/AdminControls';

const ARTICLES_PER_PAGE = 5;

export default function Home() {
  const [articles, setArticles] = useState<GeneratedArticle[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastGenTime, setLastGenTime] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const { data: session } = useSession();
  
  // Check if user is admin
  const isAdmin = session?.user?.role === 'ADMIN';
  
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);
  
  // Load saved articles from API
  useEffect(() => {
    async function loadArticles() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/art-digest');
        if (!response.ok) {
          throw new Error('Failed to load articles');
        }
        
        const data = await response.json();
        const fetchedArticles = data.articles || [];
        
        setArticles(fetchedArticles.slice(0, ARTICLES_PER_PAGE));
        setTotalArticles(fetchedArticles.length);
        
        // Set the last generation time if we have articles
        if (fetchedArticles.length > 0) {
          setLastGenTime(new Date(fetchedArticles[0].publishedAt));
        }
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadArticles();
    
    // Set up polling for new articles
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/art-digest');
        if (!response.ok) {
          throw new Error('Failed to poll for new articles');
        }
        
        const data = await response.json();
        const fetchedArticles = data.articles || [];
        
        if (fetchedArticles.length !== totalArticles) {
          // If we're on the first page, update the displayed articles
          if (currentPage === 1) {
            setArticles(fetchedArticles.slice(0, ARTICLES_PER_PAGE));
          }
          setTotalArticles(fetchedArticles.length);
          
          // Update last generation time
          if (fetchedArticles.length > 0) {
            setLastGenTime(new Date(fetchedArticles[0].publishedAt));
          }
        }
      } catch (error) {
        console.error('Error polling for articles:', error);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [currentPage, totalArticles]);
  
  // Handle page change
  useEffect(() => {
    async function fetchPageData() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/art-digest');
        if (!response.ok) {
          throw new Error('Failed to fetch page data');
        }
        
        const data = await response.json();
        const fetchedArticles = data.articles || [];
        
        const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
        const endIndex = startIndex + ARTICLES_PER_PAGE;
        
        setArticles(fetchedArticles.slice(startIndex, endIndex));
        setTotalArticles(fetchedArticles.length);
      } catch (error) {
        console.error('Failed to fetch page data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPageData();
  }, [currentPage]);
  
  // Function to manually generate a new digest
  const handleGenerateDigest = async () => {
    setIsGenerating(true);
    
    try {
      // Use the POST endpoint to generate a new article
      const response = await fetch('/api/art-digest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate digest');
      }
      
      const data = await response.json();
      
      // Go to the first page to show the new article
      setCurrentPage(1);
      
      // Refresh articles from the API
      const articlesResponse = await fetch('/api/art-digest');
      if (!articlesResponse.ok) {
        throw new Error('Failed to refresh articles');
      }
      
      const articlesData = await articlesResponse.json();
      const fetchedArticles = articlesData.articles || [];
      
      setArticles(fetchedArticles.slice(0, ARTICLES_PER_PAGE));
      setTotalArticles(fetchedArticles.length);
      
      // Set the last generation time
      setLastGenTime(new Date());
    } catch (error) {
      console.error('Failed to generate digest:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Calculate time until next automatic generation
  const getTimeUntilNextGen = () => {
    if (!lastGenTime) return 'Unknown';
    
    const now = new Date();
    const nextGen = new Date(lastGenTime);
    nextGen.setHours(nextGen.getHours() + 1);
    
    // Ensure we're not showing times in the future due to timezone issues
    if (nextGen > new Date(now.getTime() + 24 * 60 * 60 * 1000)) {
      // If next gen time is more than a day in the future, it's likely a date error
      return 'Due now';
    }
    
    const diffMs = nextGen.getTime() - now.getTime();
    if (diffMs <= 0) return 'Due now';
    
    const diffMins = Math.floor(diffMs / 60000);
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
  };
  
  // Format date consistently with a safer approach
  const formatDate = (date: Date | null) => {
    if (!date) return 'Unknown';
    
    try {
      // Use a more explicit date formatting to avoid ambiguity
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };
  
  return (
    <main className="py-16">
      <Container>
        {/* Admin Controls - only visible to admins */}
        {isAdmin && <AdminControls onGenerateDigest={handleGenerateDigest} />}
        
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <GradientText>Art News Digest</GradientText>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Stay updated with the latest trends and developments in the contemporary art world.
          </p>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {lastGenTime ? (
              <>
                <span>Last digest generated: {formatDate(lastGenTime)}</span>
                <br />
                <span>Next digest due in: {getTimeUntilNextGen()}</span>
              </>
            ) : (
              <span>No digests generated yet</span>
            )}
          </div>
          
          {isAdmin && (
            <div className="flex justify-center">
              <Button 
                onClick={handleGenerateDigest} 
                disabled={isGenerating}
                className="px-6"
              >
                {isGenerating ? (
                  <>
                    <span className="mr-2">Generating</span>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  'Generate New Digest Now'
                )}
              </Button>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No digest articles have been generated yet.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Click the button above to generate your first AI art digest.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-10">
              {articles.map((article) => (
                <DigestArticleCard 
                  key={article.id} 
                  article={article} 
                  isExpanded={articles.length === 1}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <nav className="flex items-center space-x-2" aria-label="Pagination">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(current => Math.max(current - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "gradient" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 rounded-md p-0"
                      >
                        <span className="mx-auto">{page}</span>
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(current => Math.min(current + 1, totalPages))}
                    disabled={currentPage === totalPages}
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
