import 'vitest-fetch-mock';

import { expect, describe, it, beforeEach, afterEach } from 'vitest';

import { TABNEWS_ENDPOINTS, TABNEWS_HEADERS } from '@/commons';
import { TabNews } from '@/tabnews';
import {
  createTabNews,
  expectRequest,
  mockOnceApiError,
  mockOnceResponse,
  mockOnceSession,
  mockedRequest,
  resetMocks,
} from '@test/utils';

let tabNews: TabNews;

const user = {
  id: 'id',
  username: 'username',
  email: 'my@email.com',
  description: 'description',
  notifications: true,
  features: [
    'create:session',
    'read:session',
    'create:content',
    'create:content:text_root',
    'create:content:text_child',
    'update:content',
    'update:user',
  ],
  tabcoins: 9,
  tabcash: 10,
  created_at: '2022-04-05T23:50:19.920Z',
  updated_at: '2022-04-05T23:50:56.545Z',
};

describe('User', () => {
  beforeEach(() => {
    tabNews = createTabNews();
  });

  afterEach(() => {
    resetMocks();
  });

  describe('me', () => {
    it('should get me', async () => {
      mockOnceSession();

      mockOnceResponse(TABNEWS_ENDPOINTS.user, user);

      await tabNews.session.create();

      const me = await tabNews.user.me();

      expect(me).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBeGet();

      expectRequest(request).cookie(TABNEWS_HEADERS.sessionId).toBeDefined();
    });

    it('should throw an error when has no session', async () => {
      mockOnceApiError(TABNEWS_ENDPOINTS.user, {
        name: 'ForbiddenError',
        message: 'Usuário não pode executar esta operação.',
        action: 'Verifique se este usuário possui a feature "read:session".',
        status_code: 403,
        error_id: '1ca4236b-1a68-4573-acb8-40b220b2fd76',
        request_id: 'c17c3107-8cce-4b35-b510-0c1b5b92e3b6',
        error_location_code:
          'MODEL:AUTHORIZATION:CAN_REQUEST:FEATURE_NOT_FOUND',
      });

      expect(() => tabNews.user.me()).rejects.toThrowErrorMatchingSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBeGet();

      expectRequest(request).cookie(TABNEWS_HEADERS.sessionId).toBeUndefined();
    });
  });
});
