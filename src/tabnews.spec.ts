import { expect, describe, it } from 'vitest';
import { TabNews } from './tabnews';

describe('TabNews', () => {
  it('should instantiate without config', () => {
    expect(new TabNews()).toBeDefined();
  });

  it('should instantiate with config', () => {
    expect(
      new TabNews({
        credentials: {
          email: 'test@email.com',
          password: 'dummy_password',
        },
      }),
    ).toBeDefined();
  });

  it('should not instantiate without credentials', () => {
    expect(() => new TabNews({})).toThrowErrorMatchingSnapshot();
  });
});
