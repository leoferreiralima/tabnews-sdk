import 'vitest-fetch-mock';

import { expect, describe, it, vi } from 'vitest';

import { TABNEWS_HEADERS } from './commons';
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

  it('should not create a new session id when dont has session', async () => {
    fetchMock.mockOnce(
      JSON.stringify({
        id: 'c569430f-d424-48f0-8c6e-6ad74c45743d',
        expires_at: '2023-09-18T10:11:49.519Z',
        created_at: '2023-09-19T10:11:49.519Z',
        updated_at: '2023-09-19T10:16:36.987Z',
      }),
    );

    const tabNews = new TabNews();

    await tabNews.fetchRequest('/any_route');

    expect(tabNews.headers.get(TABNEWS_HEADERS.cookie)).toBeNull();
  });

  it('should not create a new session id when dont has configuration', async () => {
    fetchMock.mockOnce(
      JSON.stringify({
        id: 'c569430f-d424-48f0-8c6e-6ad74c45743d',
        expires_at: '2023-09-18T10:11:49.519Z',
        created_at: '2023-09-19T10:11:49.519Z',
        updated_at: '2023-09-19T10:16:36.987Z',
      }),
    );

    const tabNews = new TabNews();

    await tabNews.fetchRequest('/any_route');

    expect(tabNews.headers.get(TABNEWS_HEADERS.cookie)).toBeNull();
  });

  it('should not create a new session id when dont has session', async () => {
    fetchMock.mockOnce(
      JSON.stringify({
        id: 'c569430f-d424-48f0-8c6e-6ad74c45743d',
        expires_at: '2023-09-18T10:11:49.519Z',
        created_at: '2023-09-19T10:11:49.519Z',
        updated_at: '2023-09-19T10:16:36.987Z',
      }),
    );

    const tabNews = new TabNews({
      credentials: {
        email: 'test@email.com',
        password: 'dummy_password',
      },
    });

    await tabNews.fetchRequest('/any_route');

    expect(tabNews.headers.get(TABNEWS_HEADERS.cookie)).toBeNull();
  });

  it('should not create a new session id when session in not expired', async () => {
    fetchMock.mockOnce(
      JSON.stringify({
        id: 'c569430f-d424-48f0-8c6e-6ad74c45743d',
        expires_at: '2023-09-18T10:11:49.519Z',
        created_at: '2023-09-19T10:11:49.519Z',
        updated_at: '2023-09-19T10:16:36.987Z',
      }),
    );

    const tabNews = new TabNews({
      credentials: {
        email: 'test@email.com',
        password: 'dummy_password',
      },
    });

    vi.spyOn(tabNews.session, 'hasSession').mockReturnValueOnce(true);
    vi.spyOn(tabNews.session, 'isExpired').mockReturnValueOnce(false);

    await tabNews.fetchRequest('/any_route');

    expect(tabNews.headers.get(TABNEWS_HEADERS.cookie)).toBeNull();
  });

  it('should not create a new session id when session in not expired', async () => {
    fetchMock.mockOnce(
      JSON.stringify({
        id: 'c569430f-d424-48f0-8c6e-6ad74c45743d',
        expires_at: '2023-09-18T10:11:49.519Z',
        created_at: '2023-09-19T10:11:49.519Z',
        updated_at: '2023-09-19T10:16:36.987Z',
      }),
    );

    const tabNews = new TabNews({
      credentials: {
        email: 'test@email.com',
        password: 'dummy_password',
      },
    });

    vi.spyOn(tabNews.session, 'hasSession').mockReturnValueOnce(true);
    vi.spyOn(tabNews.session, 'isExpired').mockReturnValueOnce(false);

    await tabNews.fetchRequest('/any_route');

    expect(tabNews.headers.get(TABNEWS_HEADERS.cookie)).toBeNull();
  });

  it('should not create a new session id when call session.create()', async () => {
    fetchMock.mockOnce(
      JSON.stringify({
        id: 'c569430f-d424-48f0-8c6e-6ad74c45743d',
        expires_at: '2023-09-18T10:11:49.519Z',
        created_at: '2023-09-19T10:11:49.519Z',
        updated_at: '2023-09-19T10:16:36.987Z',
      }),
    );

    const tabNews = new TabNews({
      credentials: {
        email: 'test@email.com',
        password: 'dummy_password',
      },
    });

    vi.spyOn(tabNews.session, 'hasSession').mockReturnValueOnce(true);
    vi.spyOn(tabNews.session, 'isExpired').mockReturnValueOnce(true);

    await tabNews.session.create();

    expect(tabNews.headers.get(TABNEWS_HEADERS.cookie)).toBeNull();
  });

  it('should create a new session id when session is expired', async () => {
    fetchMock.mockOnce(
      JSON.stringify({
        id: 'c569430f-d424-48f0-8c6e-6ad74c45743d',
        expires_at: '2023-09-18T10:11:49.519Z',
        created_at: '2023-09-19T10:11:49.519Z',
        updated_at: '2023-09-19T10:16:36.987Z',
      }),
    );

    const tabNews = new TabNews({
      credentials: {
        email: 'test@email.com',
        password: 'dummy_password',
      },
    });

    vi.spyOn(tabNews.session, 'hasSession').mockReturnValueOnce(true);
    vi.spyOn(tabNews.session, 'isExpired').mockReturnValueOnce(true);
    vi.spyOn(tabNews.session, 'create').mockResolvedValueOnce({
      id: '123',
      token: 'token123',
      expires_at: new Date('2023-10-12T11:56:13.378Z'),
      created_at: new Date('2023-09-12T11:56:13.379Z'),
      updated_at: new Date('2023-09-12T11:56:13.379Z'),
    });

    await tabNews.fetchRequest('/any_route');

    expect(tabNews.headers.get(TABNEWS_HEADERS.cookie)).toBe(
      `${TABNEWS_HEADERS.sessionId}=token123`,
    );
  });
});
