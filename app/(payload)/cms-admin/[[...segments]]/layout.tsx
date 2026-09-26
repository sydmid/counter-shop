/* eslint-disable @typescript-eslint/no-explicit-any */
import configPromise from '@/payload.config'
import '@payloadcms/next/css'
import { RootLayout } from '@payloadcms/next/layouts'
import React from 'react'
import { importMap } from '../importMap'

type Args = {
  children: React.ReactNode
}

// Minimal implementation to fix the type, handleServerFunctions was removed/moved in latest payload
const serverFunction = async function (args: any) {
  'use server'
  const { handleServerFunctions } = await import('@payloadcms/next/utilities').catch(() => ({
    handleServerFunctions: async () => ({})
  })) as any;
  return handleServerFunctions ? handleServerFunctions({
    ...args,
    config: configPromise,
  }) : {}
}

const Layout = ({ children }: Args) => (
  <RootLayout config={configPromise} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
