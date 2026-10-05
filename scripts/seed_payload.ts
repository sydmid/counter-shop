import { getPayload } from 'payload';
import configPromise from '../payload.config';

async function seed() {
  console.log('--- START SEED SCRIPT ---');
  console.log('Seeding Payload CMS...');

  if (!process.env.PAYLOAD_SECRET || !process.env.CMS_DATABASE_URL) {
    console.error('Error: PAYLOAD_SECRET and CMS_DATABASE_URL environment variables must be set.');
    process.exit(1);
  }
  console.log('Environment variables present.');

  try {
    console.log('Calling getPayload()...');
    const payload = await getPayload({ config: configPromise });
    console.log('getPayload() successfully returned.');

    // 1. Create admin user if not exists
    console.log('Checking for existing admin user...');
    const users = await payload.find({
      collection: 'cms-users',
      where: {
        email: { equals: 'admin@counter-shop.com' },
      },
    });

    let adminUserId: string | number;
    if (users.totalDocs === 0) {
      console.log('Creating admin user...');
      const admin = await payload.create({
        collection: 'cms-users',
        data: {
          email: 'admin@counter-shop.com',
          password: 'adminpassword123',
          role: 'admin',
        },
      });
      adminUserId = admin.id;
      console.log('Admin user created with ID:', adminUserId);
    } else {
      console.log('Admin user already exists.');
      adminUserId = users.docs[0].id;
    }

    // 2. Create category
    console.log('Checking for existing category...');
    const categories = await payload.find({
      collection: 'categories',
      where: {
        title: { equals: 'Market Updates' },
      },
    });

    let categoryId: string | number;
    if (categories.totalDocs === 0) {
      console.log('Creating category...');
      const category = await payload.create({
        collection: 'categories',
        data: {
          title: 'Market Updates',
        },
      });
      categoryId = category.id;
      console.log('Category created with ID:', categoryId);
    } else {
      console.log('Category already exists.');
      categoryId = categories.docs[0].id;
    }

    // 3. Create published article
    console.log('Checking for existing published article...');
    const publishedArticles = await payload.find({
      collection: 'articles',
      where: {
        slug: { equals: 'hello-world' },
      },
    });

    if (publishedArticles.totalDocs === 0) {
      console.log('Creating published article...');
      await payload.create({
        collection: 'articles',
        data: {
          title: 'Hello World! Welcome to Counter-Shop Blog',
          slug: 'hello-world',
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
                      text: 'This is the first published article on the Counter-Shop blog.',
                      type: 'text',
                      version: 1,
                    }
                  ]
                }
              ],
              direction: 'ltr'
            }
          },
          status: 'published',
          author: adminUserId as string,
          categories: [categoryId as string],
          publishedAt: new Date().toISOString(),
        },
      });
      console.log('Published article created.');
    } else {
      console.log('Published article already exists.');
    }

    // 4. Create draft article
    console.log('Checking for existing draft article...');
    const draftArticles = await payload.find({
      collection: 'articles',
      where: {
        slug: { equals: 'upcoming-features' },
      },
    });

    if (draftArticles.totalDocs === 0) {
      console.log('Creating draft article...');
      await payload.create({
        collection: 'articles',
        data: {
          title: 'Draft: Upcoming Features for 2026',
          slug: 'upcoming-features',
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
                      text: 'This is a draft article about upcoming features. It should not be visible to the public.',
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
          author: adminUserId as string,
          categories: [categoryId as string],
        },
      });
      console.log('Draft article created.');
    } else {
      console.log('Draft article already exists.');
    }

    console.log('Payload CMS seeding completed successfully.');
    console.log('Done.'); process.exit(0);
  } catch (error) {
    console.error('ERROR SEEDING PAYLOAD CMS:');
    console.error(error);
    if (error instanceof Error) {
        console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

seed();
