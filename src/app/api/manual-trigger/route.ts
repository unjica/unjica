import { NextResponse } from 'next/server';
import { generateDailyArtDigest } from '@/lib/actions/artDigestActions';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    console.log('Manual trigger: Generating art digest...');
    
    // Generate the article
    const article = await generateDailyArtDigest();
    
    // Save the article to the database
    console.log('Manual trigger: Article generated, saving to database');
    try {
      await prisma.generatedArticle.create({
        data: {
          id: article.id,
          title: article.title,
          content: article.content,
          primaryTopic: article.primaryTopic,
          summary: article.summary,
          tags: JSON.stringify(article.tags),
          publishedAt: new Date(article.publishedAt),
          sourceNewsIds: JSON.stringify(article.sourceNewsIds),
          lastUpdated: new Date(article.lastUpdated),
          // Type assertions to handle optional fields
          ...(article.imageUrl ? { imageUrl: article.imageUrl } : {}),
          ...(article.slug ? { slug: article.slug } : {})
        } as Prisma.GeneratedArticleCreateInput
      });
      
      console.log('Manual trigger: Article saved successfully');
      return NextResponse.json({ 
        success: true, 
        message: 'Art digest generated and saved successfully',
        article: {
          id: article.id,
          title: article.title,
          primaryTopic: article.primaryTopic,
          summary: article.summary
        }
      });
    } catch (dbError) {
      console.error('Manual trigger: Database error when saving article:', dbError);
      return NextResponse.json(
        { error: 'Database error when saving article', details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Manual trigger: Error generating art digest:', error);
    return NextResponse.json(
      { error: 'Failed to generate art digest', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Make this route dynamic to avoid caching
export const dynamic = 'force-dynamic'; 