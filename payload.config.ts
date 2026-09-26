import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

import { CmsUsers } from './payload/collections/CmsUsers';
import { Media } from './payload/collections/Media';
import { Categories } from './payload/collections/Categories';
import { Articles } from './payload/collections/Articles';

export default buildConfig({
  admin: {
    user: CmsUsers.slug,
    components: {
      views: {
        Dashboard: {
          Component: '@/payload/components/CustomDashboard#CustomDashboard',
        },
      }
    },
  },
  editor: lexicalEditor({}),
  collections: [
    CmsUsers,
    Media,
    Categories,
    Articles,
  ],
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.CMS_DATABASE_URL || 'postgres://postgres:postgrespassword@localhost:5432/counter_shop?schema=cms',
    },
  }),
});
