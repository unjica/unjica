import { generateHashtags } from '@/lib/utils/hashtags';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const postToFacebook = async (latestArticle: any, hashtags: string, imageUrl: string) => {
  try {
    if (!process.env.FACEBOOK_PAGE_ID || !process.env.FACEBOOK_ACCESS_TOKEN) {
      throw new Error('Missing Facebook credentials');
    }

    console.log('Posting to Facebook...');
    
    // First, verify page access token
    const pageTokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.FACEBOOK_PAGE_ID}?fields=access_token&access_token=${encodeURIComponent(process.env.FACEBOOK_ACCESS_TOKEN)}`
    );

    if (!pageTokenResponse.ok) {
      const errorText = await pageTokenResponse.text();
      console.error('Failed to get page access token:', errorText);
      throw new Error(`Facebook: Failed to get page access token - ${errorText}`);
    } else {
      const pageTokenResult = await pageTokenResponse.json();
      const pageAccessToken = pageTokenResult.access_token;

      // Post to Facebook using page access token
      const facebookResponse = await fetch(
        `https://graph.facebook.com/v18.0/${process.env.FACEBOOK_PAGE_ID}/photos?access_token=${encodeURIComponent(pageAccessToken)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: imageUrl,
            message: `🎨 ${latestArticle.title}\n\n${latestArticle.summary}\n\nRead more: ${process.env.NEXT_PUBLIC_BASE_URL}/art/${latestArticle.slug}\n\n${hashtags}`
          }),
        }
      );

      if (!facebookResponse.ok) {
        const errorText = await facebookResponse.text();
        console.error('Facebook post failed:', errorText);
        throw new Error(`Facebook: ${errorText}`);
      } else {
        const facebookResult = await facebookResponse.json();
        console.log('Facebook API Response:', facebookResult);
        return facebookResult;
      }
    }
  } catch (error: any) {
    console.error('Error posting to Facebook:', error);
    throw new Error(`Facebook: ${error.message}`);
  }
}

const postToInstagram = async (latestArticle: any, hashtags: string, imageUrl: string) => {
  try {
    if (!process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || !process.env.INSTAGRAM_ACCESS_TOKEN) {
      throw new Error('Missing Instagram credentials');
    }

    console.log('Creating Instagram media container...');
    
    // Log the request details (without sensitive data)
    console.log('Instagram API Request:', {
      accountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
      imageUrl: imageUrl,
      hasAccessToken: !!process.env.INSTAGRAM_ACCESS_TOKEN
    });

    const mediaResponse = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID}/media?access_token=${encodeURIComponent(process.env.INSTAGRAM_ACCESS_TOKEN)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: `🎨 ${latestArticle.title}\n\n${latestArticle.summary}\n\nRead more: ${process.env.NEXT_PUBLIC_BASE_URL}/art/${latestArticle.slug}\n\n${hashtags}`
        }),
      }
    );

    // Log the raw response for debugging
    const responseText = await mediaResponse.text();
    console.log('Instagram API Raw Response:', responseText);

    if (!mediaResponse.ok) {
      console.error('Instagram media container creation failed:', {
        status: mediaResponse.status,
        statusText: mediaResponse.statusText,
        response: responseText
      });
      throw new Error(`Instagram: ${responseText}`);
    }

    let mediaResult;
    try {
      mediaResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Instagram API response:', parseError);
      throw new Error(`Instagram: Invalid JSON response - ${responseText}`);
    }

    if (!mediaResult.id) {
      throw new Error('Instagram: Failed to create media container');
    }

    // Wait for 2 seconds before publishing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Publish the media
    console.log('Publishing Instagram media...');
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish?access_token=${encodeURIComponent(process.env.INSTAGRAM_ACCESS_TOKEN)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: mediaResult.id
        }),
      }
    );

    // Log the raw publish response
    const publishResponseText = await publishResponse.text();
    console.log('Instagram Publish Raw Response:', publishResponseText);

    if (!publishResponse.ok) {
      console.error('Instagram publish failed:', {
        status: publishResponse.status,
        statusText: publishResponse.statusText,
        response: publishResponseText
      });
      throw new Error(`Instagram publish: ${publishResponseText}`);
    }

    let publishResult;
    try {
      publishResult = JSON.parse(publishResponseText);
    } catch (parseError) {
      console.error('Failed to parse Instagram publish response:', parseError);
      throw new Error(`Instagram publish: Invalid JSON response - ${publishResponseText}`);
    }

    console.log('Instagram publish complete:', publishResult);
    return publishResult;
  } catch (error: any) {
    console.error('Error posting to Instagram:', error);
    throw new Error(`Instagram: ${error.message}`);
  }
}

const postArticle = async () => {
  try {
    // Debug environment variables
    console.log('Environment variables:', {
      hasFacebookToken: !!process.env.FACEBOOK_ACCESS_TOKEN,
      facebookTokenLength: process.env.FACEBOOK_ACCESS_TOKEN?.length,
      hasInstagramToken: !!process.env.INSTAGRAM_ACCESS_TOKEN,
      instagramTokenLength: process.env.INSTAGRAM_ACCESS_TOKEN?.length,
      hasInstagramAccountId: !!process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
      hasFacebookPageId: !!process.env.FACEBOOK_PAGE_ID,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL
    });

    // Verify credentials
    if (!process.env.FACEBOOK_ACCESS_TOKEN || !process.env.FACEBOOK_PAGE_ID) {
      return NextResponse.json({ 
        error: 'Missing Facebook credentials',
        details: {
          hasAccessToken: !!process.env.FACEBOOK_ACCESS_TOKEN,
          hasPageId: !!process.env.FACEBOOK_PAGE_ID
        }
      }, { status: 500 });
    }

    if (!process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || !process.env.INSTAGRAM_ACCESS_TOKEN) {
      return NextResponse.json({ 
        error: 'Missing Instagram credentials',
        details: {
          hasAccountId: !!process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
          hasAccessToken: !!process.env.INSTAGRAM_ACCESS_TOKEN
        }
      }, { status: 500 });
    }

    // Find the most recent article
    const latestArticle = await prisma.generatedArticle.findFirst({
      orderBy: {
        publishedAt: 'desc'
      }
    });

    if (!latestArticle) {
      return NextResponse.json({ error: 'No articles found' }, { status: 404 });
    }

    const hashtags = generateHashtags(latestArticle);

    // Get the image URL from the article
    const imageUrl = latestArticle.imageUrl;
    if (!imageUrl) {
      return NextResponse.json({ error: 'Article has no image' }, { status: 400 });
    }

    const results = {
      facebook: null as any,
      instagram: null as any,
      errors: [] as string[]
    };

    // Post to Facebook
    try {
      results.facebook = await postToFacebook(latestArticle, hashtags, imageUrl);
    } catch (error: any) {
      results.errors.push(error.message);
    }

    // Post to Instagram
    try {
      results.instagram = await postToInstagram(latestArticle, hashtags, imageUrl);
    } catch (error: any) {
      results.errors.push(error.message);
    }

    // Return results
    if (results.errors.length > 0) {
      return NextResponse.json({
        success: false,
        errors: results.errors,
        results: {
          facebook: results.facebook,
          instagram: results.instagram
        }
      }, { status: results.facebook || results.instagram ? 207 : 500 });
    }

    return NextResponse.json({
      success: true,
      results: {
        facebook: results.facebook,
        instagram: results.instagram
      }
    });
  } catch (error: any) {
    console.error('Error in social media posting:', error);
    return NextResponse.json(
      { error: 'Failed to post to social media', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return postArticle();
}

export async function POST() {
  return postArticle();
}

export const dynamic = 'force-dynamic'; 