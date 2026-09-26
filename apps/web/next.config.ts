import path from 'node:path';
import type { NextConfig } from 'next';

// Scripts run from apps/web, so the monorepo root is two levels up.
const workspaceRoot = path.resolve(process.cwd(), '../..');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: workspaceRoot,
  turbopack: { root: workspaceRoot },
};

export default nextConfig;
