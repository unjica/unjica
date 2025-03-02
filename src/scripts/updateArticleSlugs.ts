import { PrismaClient } from '@prisma/client';
import { slugify, ensureUniqueSlug } from '../lib/utils/slugify';

const prisma = new PrismaClient();

async function updateArticleSlugs() {
  try {
    // Get all articles
    const articles = await prisma.generatedArticle.findMany();
    console.log(`Found ${articles.length} articles to update.`);
    
    // Generate and collect all slugs to check for uniqueness
    const generatedSlugs: string[] = [];
    
    // Update each article with a slug
    for (const article of articles) {
      const baseSlug = slugify(article.title);
      const uniqueSlug = ensureUniqueSlug(baseSlug, generatedSlugs);
      generatedSlugs.push(uniqueSlug);
      
      // Update the article with the slug
      await prisma.$executeRaw`UPDATE generated_articles SET slug = ${uniqueSlug} WHERE id = ${article.id}`;
      
      console.log(`Updated article "${article.title}" with slug "${uniqueSlug}"`);
    }
    
    console.log('All articles successfully updated with slugs.');
  } catch (error) {
    console.error('Error updating article slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update function
updateArticleSlugs(); 