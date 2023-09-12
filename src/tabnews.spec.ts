import { expect, describe, it, vi } from 'vitest';
import { TabNews } from './tabnews';

describe('TabNews', () => {
  it('should instantiate without and without env', () => {
    const tabNews = new TabNews();

    expect(tabNews.config.credentials?.email).toBeUndefined();
    expect(tabNews.config.credentials?.password).toBeUndefined();
  });

  it('should instantiate without config', () => {
    vi.stubEnv('TABNEWS_CREDENTIALS_EMAIL', 'env_test@email.com');
    vi.stubEnv('TABNEWS_CREDENTIALS_PASSWORD', 'env_dummy_password');

    const tabNews = new TabNews();

    expect(tabNews.config.credentials?.email).toBe('env_test@email.com');
    expect(tabNews.config.credentials?.password).toBe('env_dummy_password');

    vi.unstubAllEnvs();
  });

  it('should instantiate with config', () => {
    const tabNews = new TabNews({
      credentials: {
        email: 'test@email.com',
        password: 'dummy_password',
      },
    });
    expect(tabNews.config.credentials?.email).toBe('test@email.com');
    expect(tabNews.config.credentials?.password).toBe('dummy_password');
  });

  it('should instantiate with config', () => {
    const tabNews = new TabNews({
      credentials: {
        email: 'test@email.com',
        password: 'dummy_password',
      },
    });

    expect(tabNews.config.credentials?.email).toBe('test@email.com');
    expect(tabNews.config.credentials?.password).toBe('dummy_password');
  });
});
