import { expect } from 'vitest';
import { MockParams } from 'vitest-fetch-mock';

import { TABNEWS_ENDPOINTS } from '@/commons';
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

export function mockOnceSession(
  session: typeof DEFAULT_SESSION = DEFAULT_SESSION,
) {
  mockOnceResponse(TABNEWS_ENDPOINTS.session, session);
}

export function mockedRequests() {
  return fetchMock.requests();
}

export function mockedRequest() {
  const [request] = mockedRequests().reverse();
  return request;
}

export function expectRequest(request: Request) {
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
  };
}

export async function createSession(tabNews: TabNews) {
  return await tabNews.session.create();
}
