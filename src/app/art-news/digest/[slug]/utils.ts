/**
 * Helper function to fetch article data by slug
 */
export async function getArticleData(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://unjica.com'}/api/art-digest?slug=${slug}`, { 
      next: { revalidate: 60 } 
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch article');
    }
    
    const data = await response.json();
    return data.article;
  } catch (error) {
    console.error('Error fetching article data:', error);
    return null;
  }
} 