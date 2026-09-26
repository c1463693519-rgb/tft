import { describe, expect, it } from 'vitest';
import pkg from '../package.json' with { type: 'json' };
import { ENGINE_VERSION } from '../src/index.js';

describe('ENGINE_VERSION', () => {
  it('matches the package version so results can be traced to an engine build', () => {
    expect(ENGINE_VERSION).toBe(pkg.version);
  });
});
