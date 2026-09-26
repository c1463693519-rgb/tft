import { defaultClientConditions, defaultServerConditions } from 'vite';
import type { UserConfig } from 'vite';

/**
 * Workspace packages expose `@tft/source` → `src/index.ts` in their `exports`.
 * Enabling that condition lets tests resolve sibling packages from source,
 * so `pnpm test` does not depend on a prior `pnpm build`.
 */
export const workspaceSourceResolve: Pick<UserConfig, 'resolve' | 'ssr'> = {
  resolve: { conditions: ['@tft/source', ...defaultClientConditions] },
  ssr: { resolve: { conditions: ['@tft/source', ...defaultServerConditions] } },
};
