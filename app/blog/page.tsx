/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Link from 'next/link';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { logger } from '@/lib/logger';

export const revalidate = 60; // Cache invalidation every 60 seconds
export const dynamic = 'force-dynamic';

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const limit = parseInt(resolvedSearchParams.limit || '12', 10);

  let articles: any[] = [];
  let totalPages = 0;
  let hasNextPage = false;
  let hasPrevPage = false;
  let prevPage: number | null | undefined = null;
  let nextPage: number | null | undefined = null;

  try {
    const payload = await getPayload({ config: configPromise });
    logger.info('payload_init', 'success', { route: '/blog' });
    const response = await payload.find({
      collection: 'articles',
      where: {
        and: [
          { status: { equals: 'published' } },
          { publishedAt: { less_than_equal: new Date().toISOString() } }
        ]
      },
      sort: '-publishedAt',
      overrideAccess: false,
      page,
      limit,
    });

    articles = response.docs;
    totalPages = response.totalPages;
    hasNextPage = response.hasNextPage;
    hasPrevPage = response.hasPrevPage;
    prevPage = response.prevPage;
    nextPage = response.nextPage;

  } catch (e: any) {
    logger.error('payload_init', 'failure', { route: '/blog', error: e.message || String(e) });
    console.error("Payload not available at build time for blog page");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-white mb-8">Market Guides & Announcements</h1>
      {articles.length === 0 ? (
        <p className="text-zinc-400">No published articles yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              {hasPrevPage ? (
                <Link
                  href={`/blog?page=${prevPage}${limit !== 12 ? `&limit=${limit}` : ''}`}
                  className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
                >
                  Previous
                </Link>
              ) : (
                <button disabled className="px-4 py-2 bg-zinc-800/50 text-zinc-500 rounded cursor-not-allowed">
                  Previous
                </button>
              )}

              <span className="text-zinc-400">
                Page {page} of {totalPages}
              </span>

              {hasNextPage ? (
                <Link
                  href={`/blog?page=${nextPage}${limit !== 12 ? `&limit=${limit}` : ''}`}
                  className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
                >
                  Next
                </Link>
              ) : (
                <button disabled className="px-4 py-2 bg-zinc-800/50 text-zinc-500 rounded cursor-not-allowed">
                  Next
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
