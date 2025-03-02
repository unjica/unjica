import { PrismaClient } from '@prisma/client';
import { slugify, ensureUniqueSlug } from '@/lib/utils/slugify';

const prisma = new PrismaClient();

async function updateArticleSlugs() {
  try {
    console.log('Starting slug update process...');
    
    // Get all articles without slugs
    const articles = await prisma.generatedArticle.findMany({
      where: {
        slug: null
      } as any
    });
    
    console.log(`Found ${articles.length} articles without slugs`);
    
    if (articles.length === 0) {
      console.log('No articles need updating. Exiting.');
      return;
    }
    
    // Get all existing slugs to ensure uniqueness
    const existingSlugs = (await prisma.generatedArticle.findMany({
      where: {
        slug: {
          not: null
        }
      } as any,
      select: {
        slug: true
      } as any
    })).map(a => a.slug as string);
    
    console.log(`Found ${existingSlugs.length} existing slugs`);
    
    // Update each article with a unique slug
    for (const article of articles) {
      const baseSlug = slugify(article.title);
      const uniqueSlug = ensureUniqueSlug(baseSlug, existingSlugs);
      
      // Add the new slug to our tracking array to ensure uniqueness for subsequent articles
      existingSlugs.push(uniqueSlug);
      
      // Update the article with the new slug
      await prisma.generatedArticle.update({
        where: {
          id: article.id
        },
        data: {
          slug: uniqueSlug
        } as any
      });
      
      console.log(`Updated article ${article.id} with slug: ${uniqueSlug}`);
    }
    
    console.log('Slug update process completed successfully!');
  } catch (error) {
    console.error('Error updating slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
updateArticleSlugs()
  .then(() => console.log('Script execution completed'))
  .catch(e => console.error('Script execution failed:', e)); 