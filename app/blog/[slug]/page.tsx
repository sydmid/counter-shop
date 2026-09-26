import React from 'react';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { RichText } from '@payloadcms/richtext-lexical/react';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const payload = await getPayload({ config: configPromise });
    const { docs: articles } = await payload.find({
      collection: 'articles',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      limit: 1,
    });

    if (!articles || articles.length === 0) {
      return { title: 'Not Found' };
    }

    return { title: `${articles[0].title} | Counter-Shop Blog` };
  } catch(e) {
    return { title: 'Blog | Counter-Shop' };
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  let article: any = null;

  try {
    const payload = await getPayload({ config: configPromise });
    const { docs: articles } = await payload.find({
      collection: 'articles',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      limit: 1,
    });

    if (!articles || articles.length === 0) {
      notFound();
    }
    article = articles[0];
  } catch (e) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-white mb-4">{article.title}</h1>
      {article.publishedAt && (
         <p className="text-sm text-zinc-500 mb-8">{new Date(article.publishedAt).toLocaleDateString()}</p>
      )}
      <div className="prose prose-invert max-w-none">
        <RichText data={article.content} />
      </div>
    </div>
  );
}
