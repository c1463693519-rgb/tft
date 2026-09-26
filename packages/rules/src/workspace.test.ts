import { ENGINE_VERSION } from '@tft/mechanics';
import { describe, expect, it } from 'vitest';

describe('workspace wiring', () => {
  it('resolves sibling packages from source without a prior build', () => {
    expect(ENGINE_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});
