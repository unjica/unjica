import { PrismaClient } from '@prisma/client';
import { GeneratedArticle } from '@/lib/agents/models/generatedArticle';

const prisma = new PrismaClient();
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

async function fetchInstagramPosts() {
  try {
    console.log('Fetching Instagram posts...');
    console.log('Using Business Account ID:', INSTAGRAM_BUSINESS_ACCOUNT_ID);
    
    // First, get the media container ID
    const containerUrl = `https://graph.facebook.com/v18.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
    console.log('Fetching from URL:', containerUrl);
    
    const containerResponse = await fetch(containerUrl);
    
    if (!containerResponse.ok) {
      const errorText = await containerResponse.text();
      throw new Error(`Instagram API error: ${containerResponse.statusText}\nResponse: ${errorText}`);
    }
    
    const containerData = await containerResponse.json();
    console.log('Raw Instagram response:', JSON.stringify(containerData, null, 2));
    
    const mediaItems = containerData.data || [];
    console.log(`Found ${mediaItems.length} total media items`);
    
    // Filter out reels and get only image posts
    const imagePosts = mediaItems.filter((item: any) => 
      item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM'
    );
    
    console.log(`Filtered to ${imagePosts.length} image posts`);
    return imagePosts;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return [];
  }
}

type ArticleDataWithoutId = Omit<GeneratedArticle, 'tags' | 'sourceNewsIds' | 'id'> & { 
  tags: string; 
  sourceNewsIds: string; 
};

function extractArticleData(post: any): ArticleDataWithoutId {
  console.log('Processing post:', post.id);
  
  // Extract title (first line of caption)
  const titleMatch = post.caption?.match(/^([^\n]+)/);
  const title = titleMatch ? titleMatch[1].trim() : '';
  console.log('Extracted title:', title);

  // Extract summary (rest of the caption)
  const summaryMatch = post.caption?.match(/\n\n([\s\S]+)/);
  const summary = summaryMatch ? summaryMatch[1].trim() : '';
  console.log('Extracted summary length:', summary.length);

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();                  // Remove leading/trailing spaces
  console.log('Generated slug:', slug);

  // Extract hashtags
  const hashtagsMatch = post.caption?.match(/#[^\s]+/g);
  const tags = hashtagsMatch ? hashtagsMatch.map((tag: string) => tag.replace('#', '')) : [];
  console.log('Extracted tags:', tags);

  // Determine primary topic from hashtags (use the first non-generic hashtag)
  const primaryTopic = tags.find((tag: string) => 
    !['art', 'artwork', 'modernart', 'contemporaryart', 'abstractart', 'popart', 'artists'].includes(tag.toLowerCase())
  ) || 'Modern Art';
  console.log('Determined primary topic:', primaryTopic);

  return {
    title,
    summary,
    slug,
    primaryTopic,
    tags: JSON.stringify(tags),
    publishedAt: new Date(post.timestamp).toISOString(),
    lastUpdated: new Date().toISOString(),
    sourceNewsIds: JSON.stringify([]), // We don't have the original news sources
    content: `# ${title}\n\n${summary}\n\n*This article was reconstructed from Instagram posts.*`,
  };
}

async function reconstructArticles() {
  try {
    console.log('Starting article reconstruction...');
    const posts = await fetchInstagramPosts();
    console.log(`Found ${posts.length} posts to process`);

    for (const post of posts) {
      const articleData = extractArticleData(post);
      
      if (articleData.title && articleData.slug) {
        console.log(`Attempting to upsert article: ${articleData.title}`);
        
        try {
          const result = await prisma.generatedArticle.upsert({
            where: { slug: articleData.slug },
            update: articleData,
            create: {
              ...articleData,
              id: `reconstructed-${Date.now()}`,
            }
          });
          console.log('Successfully upserted article:', result.id);
        } catch (dbError) {
          console.error('Database error while upserting article:', dbError);
        }
      } else {
        console.log('Skipping post - missing title or slug:', post.id);
      }
    }

    // Verify the data was inserted
    const count = await prisma.generatedArticle.count();
    console.log(`Total articles in database: ${count}`);

    console.log('Article reconstruction completed!');
  } catch (error) {
    console.error('Error during article reconstruction:', error);
  } finally {
    await prisma.$disconnect();
  }
}

reconstructArticles(); 