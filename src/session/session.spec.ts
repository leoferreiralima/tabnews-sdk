import 'vitest-fetch-mock';

import { expect, describe, it, afterEach, beforeEach, vi } from 'vitest';
import { TabNews } from '@/tabnews';
import {
  DEFAULT_TABNEWS_CONFIG,
  createTabNews,
  expectRequest,
  mockOnceApiError,
  mockOnceResponse,
  mockOnceSession,
  mockedRequest,
  resetMocks,
} from '@test/utils';

let tabNews: TabNews;

describe('Session', () => {
  const mockDestroySession = () =>
    mockOnceResponse('/sessions', {
      id: '123',
      expires_at: '2023-10-12T11:56:13.378Z',
      created_at: '2023-09-12T11:56:13.379Z',
      updated_at: '2023-09-12T11:56:13.379Z',
    });

  beforeEach(() => {
    tabNews = createTabNews();
  });

  afterEach(() => {
    resetMocks();
  });

  describe('create', () => {
    it('should create a session', async () => {
      mockOnceSession();

      const session = await tabNews.session.create();

      expect(session).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).body.toBe({
        email: DEFAULT_TABNEWS_CONFIG.credentials?.email,
        password: DEFAULT_TABNEWS_CONFIG.credentials?.password,
      });

      expectRequest(request).method.toBePost();
    });

    it('should throw a tabnews error when api return error', async () => {
      mockOnceApiError('/sessions', {
        name: 'UnauthorizedError',
        message: 'Dados não conferem.',
        action: 'Verifique se os dados enviados estão corretos.',
        status_code: 401,
        error_id: '69b34554-7c09-4772-b0cc-497fcb03222b',
        request_id: '6efd0399-622b-4ba9-8703-0d80f58308c2',
        error_location_code: 'CONTROLLER:SESSIONS:POST_HANDLER:DATA_MISMATCH',
      });

      expect(() =>
        tabNews.session.create(),
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe('destroy', () => {
    it('should destroy a session', async () => {
      mockOnceSession();

      const session = await tabNews.session.create();

      mockDestroySession();

      const destroyedSession = await tabNews.session.destroy();

      expect(destroyedSession).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBeDelete();
      expectRequest(request)
        .header('Cookie')
        .toBe(`session_id=${session.token}`);
    });

    it('should throw an error when has no session', async () => {
      mockOnceApiError('/sessions', {
        name: 'ForbiddenError',
        message: 'Usuário não pode executar esta operação.',
        action: 'Verifique se este usuário possui a feature "read:session".',
        status_code: 403,
        error_id: 'b42a2fd9-d3c5-4aaa-bd3a-b92ee15904b2',
        request_id: 'cd96640c-9ac2-4976-ae2d-154a29c967a2',
        error_location_code:
          'MODEL:AUTHORIZATION:CAN_REQUEST:FEATURE_NOT_FOUND',
      });

      expect(() =>
        tabNews.session.destroy(),
      ).rejects.toThrowErrorMatchingSnapshot();

      const request = mockedRequest();

      expectRequest(request).header('Cookie').toBeNull();
    });
  });

  describe('session', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return that session is expired', () => {
      expect(tabNews.session.isExpired()).toBe(true);
    });

    it('should return that no has session', () => {
      expect(tabNews.session.hasSession()).toBe(false);
    });

    it('should return that no has session when it is destroyed', () => {
      expect(tabNews.session.hasSession()).toBe(false);
    });

    it('should return that has session', async () => {
      fetchMock.mockResponse(
        JSON.stringify({
          id: '123',
          token: 'token123',
          expires_at: '2023-10-12T11:56:13.378Z',
          created_at: '2023-09-12T11:56:13.379Z',
          updated_at: '2023-09-12T11:56:13.379Z',
        }),
      );

      await tabNews.session.create();
      await tabNews.session.destroy();

      expect(tabNews.session.hasSession()).toBe(false);
    });

    it('should return false if current date is least than expires_at', async () => {
      fetchMock.mockOnce(
        JSON.stringify({
          id: '123',
          token: 'token123',
          expires_at: '2023-10-12T11:56:13.378Z',
          created_at: '2023-09-12T11:56:13.379Z',
          updated_at: '2023-09-12T11:56:13.379Z',
        }),
      );

      vi.setSystemTime(new Date(2023, 8, 12));

      await tabNews.session.create();

      expect(tabNews.session.isExpired()).toBe(false);
    });

    it('should return true if current date is greater than expires_at', async () => {
      fetchMock.mockOnce(
        JSON.stringify({
          id: '123',
          token: 'token123',
          expires_at: '2023-10-12T11:56:13.378Z',
          created_at: '2023-09-12T11:56:13.379Z',
          updated_at: '2023-09-12T11:56:13.379Z',
        }),
      );

      vi.setSystemTime(new Date(2023, 9, 13));

      await tabNews.session.create();

      expect(tabNews.session.isExpired()).toBe(true);
    });
  });
});
