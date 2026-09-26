/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Link from 'next/link';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

export const revalidate = 60; // Cache invalidation every 60 seconds
export const dynamic = 'force-dynamic';

export default async function BlogIndex() {
  let articles: any[] = [];
  try {
    const payload = await getPayload({ config: configPromise });
    const { docs } = await payload.find({
      collection: 'articles',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
    });
    articles = docs;
  } catch (e) {
    console.error("Payload not available at build time for blog page");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-white mb-8">Market Guides & Announcements</h1>
      {articles.length === 0 ? (
        <p className="text-zinc-400">No published articles yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: any) => (
            <div key={article.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-indigo-500/50 transition-colors">
              <Link href={`/blog/${article.slug}`}>
                <h2 className="text-xl font-bold text-white mb-2 cursor-pointer hover:text-indigo-400">{article.title}</h2>
              </Link>
              {article.publishedAt && (
                <p className="text-xs text-zinc-500">{new Date(article.publishedAt).toLocaleDateString()}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
