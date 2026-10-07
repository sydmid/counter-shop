import { CollectionConfig } from 'payload';
import { logger } from '../../lib/logger';
import crypto from 'crypto';

const isAdminOrEditor = ({ req: { user } }: any) => {
  return user && (user.role === 'admin' || user.role === 'editor');
};

const isAuthorOrHigher = ({ req: { user } }: any) => {
  return user && ['admin', 'editor', 'author'].includes(user.role);
};

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (user && ['admin', 'editor', 'author'].includes(user.role)) {
        return true;
      }
      return {
        and: [
          { status: { equals: 'published' } },
          { publishedAt: { less_than_equal: new Date().toISOString() } },
        ]
      } as any;
    },
    create: isAuthorOrHigher,
    update: isAuthorOrHigher, // Authors can update. We could restrict them to their own articles only.
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation }) => {
        if (operation === 'update') {
          const requestId = crypto.randomUUID();

          if (doc.status === 'published' && previousDoc.status !== 'published') {
            logger.info('article_published', 'success', { requestId, articleId: doc.id, slug: doc.slug });
          }

          if (doc.publishedAt && doc.publishedAt !== previousDoc.publishedAt) {
            logger.info('article_scheduled', 'success', { requestId, articleId: doc.id, slug: doc.slug, publishedAt: doc.publishedAt });
          }
        }
      }
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Review', value: 'in_review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'cms-users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
};
