import 'vitest-fetch-mock';

import { TabNews } from '@/tabnews';
import { MockParams } from 'vitest-fetch-mock';
import { TabNewsApiError } from '@/commons/interfaces';
import { TabNewsConfig } from '@/interfaces';
import { expect } from 'vitest';
import { TABNEWS_ENDPOINTS } from '@/commons';

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
    (response) => response.url.endsWith(path),
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
  };
}

export async function createSession(tabNews: TabNews) {
  return await tabNews.session.create();
}
