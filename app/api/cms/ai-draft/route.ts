import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { headers } from 'next/headers';
import { z } from 'zod';
import { redis } from '@/lib/redis';

const aiDraftSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  language: z.string().optional(),
  category: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise });
    const reqHeaders = await headers();
    const { user } = await payload.auth({ headers: reqHeaders });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (user.collection !== 'cms-users') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    if (user.role !== 'admin' && user.role !== 'editor') {
      return NextResponse.json({ success: false, error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const validation = aiDraftSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Invalid request', details: validation.error.format() }, { status: 400 });
    }

    // Rate Limiting: Max 5 requests per minute per user
    const rateLimitKey = `rate_limit:ai_draft:${user.id}`;
    const currentRequests = await redis.incr(rateLimitKey);
    if (currentRequests === 1) {
      await redis.expire(rateLimitKey, 60);
    }

    if (currentRequests > 5) {
      return NextResponse.json({ success: false, error: 'Too Many Requests' }, { status: 429 });
    }

    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const aiGeneratedTitle = `Market Update - ${new Date().toLocaleDateString()} ${Date.now()}`;
    const aiGeneratedSlug = `market-update-${Date.now()}`;

    const draftArticle = await payload.create({
      collection: 'articles',
      data: {
        title: aiGeneratedTitle,
        slug: aiGeneratedSlug,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'This is an AI-generated draft detailing the recent market movements. Please review and edit before publishing.',
                    type: 'text',
                    version: 1,
                  }
                ]
              }
            ],
            direction: 'ltr'
          }
        },
        status: 'draft',
      },
    });

    return NextResponse.json({ success: true, article: draftArticle });
  } catch (error) {
    console.error('Error generating AI Draft:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
