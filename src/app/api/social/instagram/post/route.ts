import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { articleId } = await request.json();

    if (!articleId) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    // Log environment variables (without exposing the full token)
    console.log('Instagram Business Account ID:', process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID);
    console.log('Access Token length:', process.env.INSTAGRAM_ACCESS_TOKEN?.length);
    console.log('Base URL:', process.env.NEXT_PUBLIC_BASE_URL);

    if (!process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || !process.env.INSTAGRAM_ACCESS_TOKEN) {
      return NextResponse.json({ 
        error: 'Missing Instagram credentials',
        details: {
          hasAccountId: !!process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
          hasAccessToken: !!process.env.INSTAGRAM_ACCESS_TOKEN
        }
      }, { status: 500 });
    }

    // Get the article from the database
    const article = await prisma.generatedArticle.findUnique({
      where: { id: articleId }
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Get the image URL from the article
    const imageUrl = article.imageUrl;
    if (!imageUrl) {
      return NextResponse.json({ error: 'Article has no image' }, { status: 400 });
    }

    console.log('Creating media container with image URL:', imageUrl);

    // Create Instagram post using Graph API
    const mediaUrl = `https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID}/media?access_token=${encodeURIComponent(process.env.INSTAGRAM_ACCESS_TOKEN)}`;
    console.log('Media URL:', mediaUrl);

    const mediaResponse = await fetch(mediaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: `🎨 ${article.summary}\n\nRead more: ${process.env.NEXT_PUBLIC_BASE_URL}/art/${article.slug}`
      }),
    });

    if (!mediaResponse.ok) {
      const errorText = await mediaResponse.text();
      console.error('Media container creation failed:', {
        status: mediaResponse.status,
        statusText: mediaResponse.statusText,
        error: errorText
      });
      return NextResponse.json({ 
        error: 'Media container creation failed',
        details: errorText
      }, { status: mediaResponse.status });
    }

    const result = await mediaResponse.json();
    console.log('Instagram API Response:', result);

    if (!result.id) {
      if (result.error) {
        console.error('Instagram API Error:', result.error);
        return NextResponse.json({ 
          error: 'Instagram API Error', 
          details: result.error 
        }, { status: 500 });
      }
      throw new Error('Failed to create Instagram media container');
    }

    console.log('Publishing media container with ID:', result.id);

    // Wait a bit for the container to be ready
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Publish the media container
    const publishUrl = `https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish?access_token=${encodeURIComponent(process.env.INSTAGRAM_ACCESS_TOKEN)}`;
    console.log('Publish URL:', publishUrl);

    const publishResponse = await fetch(publishUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        creation_id: result.id
      }),
    });

    if (!publishResponse.ok) {
      const errorText = await publishResponse.text();
      console.error('Media publish failed:', {
        status: publishResponse.status,
        statusText: publishResponse.statusText,
        error: errorText
      });
      return NextResponse.json({ 
        error: 'Media publish failed',
        details: errorText
      }, { status: publishResponse.status });
    }

    const publishResult = await publishResponse.json();
    console.log('Instagram Publish Response:', publishResult);

    if (!publishResult.id) {
      if (publishResult.error) {
        console.error('Instagram Publish Error:', publishResult.error);
        return NextResponse.json({ 
          error: 'Instagram Publish Error', 
          details: publishResult.error 
        }, { status: 500 });
      }
      throw new Error('Failed to publish Instagram post');
    }

    return NextResponse.json({ 
      success: true, 
      postId: publishResult.id 
    });
  } catch (error: any) {
    console.error('Error posting to Instagram:', error);
    return NextResponse.json(
      { error: 'Failed to post to Instagram', details: error.message },
      { status: 500 }
    );
  }
} 