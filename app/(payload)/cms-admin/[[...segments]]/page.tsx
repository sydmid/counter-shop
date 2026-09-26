/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@/payload.config';
import { RootPage } from '@payloadcms/next/views';
import { importMap } from '@/app/(payload)/cms-admin/importMap';

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

const Page = async ({ params, searchParams }: Args) => {
  return RootPage({ config, params, searchParams, importMap })
}

export default Page
