import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

export async function POST() {
  try {
    const payload = await getPayload({ config: configPromise });

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
