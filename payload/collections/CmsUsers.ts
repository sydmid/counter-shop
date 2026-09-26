import { CollectionConfig } from 'payload';

const isAdmin = ({ req: { user } }: any) => {
  return user && user.role === 'admin';
};

const isAdminOrSelf = ({ req: { user } }: any) => {
  if (user?.role === 'admin') return true;
  if (user) {
    return {
      id: {
        equals: user.id,
      },
    };
  }
  return false;
};

export const CmsUsers: CollectionConfig = {
  slug: 'cms-users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Author', value: 'author' },
        { label: 'Moderator', value: 'moderator' },
        { label: 'Analyst', value: 'analyst' },
      ],
      required: true,
      defaultValue: 'author',
    },
  ],
};
