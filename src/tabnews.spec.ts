import 'vitest-fetch-mock';

import { expect, describe, it, vi, afterEach } from 'vitest';
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

  describe('Fetch with credentials', () => {
    afterEach(() => {
      fetchMock.resetMocks();
    });

    it('should throw error when credentials is not configured', () => {
      const tabNews = new TabNews({
        credentials: {
          email: undefined,
          password: undefined,
        },
      });

      expect(() =>
        tabNews.fetchWithCredentials('/error'),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should create a new token when is expired', async () => {
      fetchMock.mockOnceIf(
        (request) => request.url.endsWith('/sessions'),
        JSON.stringify({
          id: '123',
          token: 'token123',
          expires_at: '2023-10-12T11:56:13.378Z',
          created_at: '2023-09-12T11:56:13.379Z',
          updated_at: '2023-09-12T11:56:13.379Z',
        }),
      );

      fetchMock.mockOnceIf(
        (request) => request.url.endsWith('/expired'),
        JSON.stringify({
          id: '123',
        }),
      );

      vi.stubEnv('TABNEWS_CREDENTIALS_EMAIL', 'env_test@email.com');
      vi.stubEnv('TABNEWS_CREDENTIALS_PASSWORD', 'env_dummy_password');

      const tabNews = new TabNews();

      vi.spyOn(tabNews.session, 'isExpired').mockReturnValue(true);

      await tabNews.fetchWithCredentials('/expired');

      expect(tabNews.headers.get('Cookie')).toBe('session_id=token123');
    });
  });
});
