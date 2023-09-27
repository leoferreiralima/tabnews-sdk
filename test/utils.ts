import { expect } from 'vitest';
import { MockParams } from 'vitest-fetch-mock';

import { TABNEWS_ENDPOINTS, TABNEWS_HEADERS } from '@/commons';
import { TabNewsApiError } from '@/commons/interfaces';
import { TabNewsConfig } from '@/interfaces';
import { TabNews } from '@/tabnews';

export const DEFAULT_TABNEWS_CONFIG: Partial<TabNewsConfig> = {
  credentials: {
    email: 'any@email.com',
    password: 'any',
  },
};
export function createTabNews(
  config: Partial<TabNewsConfig> = DEFAULT_TABNEWS_CONFIG,
) {
  return new TabNews(config);
}

export function resetMocks() {
  fetchMock.resetMocks();
}

export function mockOnceResponse(
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
  mockParams?: MockParams,
) {
  fetchMock.doMockOnceIf(
    (response) => new URL(response.url).pathname.endsWith(path),
    JSON.stringify(body),
    mockParams,
  );
}

export function mockOnceApiError(path: string, apiError: TabNewsApiError) {
  mockOnceResponse(path, apiError, {
    status: apiError.status_code,
  });
}

export const DEFAULT_SESSION = {
  id: '123',
  token: 'token123',
  expires_at: '2023-10-12T11:56:13.378Z',
  created_at: '2023-09-12T11:56:13.379Z',
  updated_at: '2023-09-12T11:56:13.379Z',
};

export const DEFAULT_USER = {
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

export function mockOnceSession(
  session: typeof DEFAULT_SESSION = DEFAULT_SESSION,
) {
  mockOnceResponse(TABNEWS_ENDPOINTS.session, session);
}

export function mockOnceCurrentUser(user: typeof DEFAULT_USER = DEFAULT_USER) {
  mockOnceResponse(TABNEWS_ENDPOINTS.user, user);
}

export function mockedRequests() {
  return fetchMock.requests();
}

export function mockedRequest() {
  const [request] = mockedRequests().reverse();
  return request;
}

const parseCookie = (cookie: string | null) =>
  !cookie
    ? {}
    : cookie
        .split(';')
        .map((v) => v.split('='))
        .reduce(
          (acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(
              v[1].trim(),
            );
            return acc;
          },
          {} as Record<string, string>,
        );

export function expectRequest(request: Request) {
  expect(request, 'request must be called').toBeDefined();

  const url = new URL(request.url);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toBodyBe = <T extends object>(body: T) => {
    expect(request.json()).resolves.toMatchObject(body);
  };

  const toBePost = () => request.method === 'POST';
  const toBeGet = () => request.method === 'GET';
  const toBeDelete = () => request.method === 'DELETE';

  const header = (headerName: string) => ({
    toBe: (headerValue: string) =>
      expect(request.headers.get(headerName)).toBe(headerValue),
    toBeNull: () => expect(request.headers.get(headerName)).toBeNull(),
  });

  const query = (parameter: string) => ({
    toBe: (parameterValue: string) =>
      expect(url.searchParams.get(parameter)).toBe(parameterValue),
    toBeNull: () => expect(url.searchParams.get(parameter)).toBeNull(),
  });

  const cookie = (cookieName: string) => {
    const cookies = parseCookie(request.headers.get(TABNEWS_HEADERS.cookie));

    return {
      toBe: (cookieValue: string) =>
        expect(cookies[cookieName]).toBe(cookieValue),
      toBeDefined: () => expect(cookies[cookieName]).toBeDefined(),
      toBeUndefined: () => expect(cookies[cookieName]).toBeUndefined,
    };
  };

  return {
    body: {
      toBe: toBodyBe,
    },
    method: {
      toBePost,
      toBeGet,
      toBeDelete,
    },
    header,
    query,
    cookie,
  };
}

export async function createSession(tabNews: TabNews) {
  return await tabNews.session.create();
}
