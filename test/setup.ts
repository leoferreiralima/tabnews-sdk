import createFetchMock from 'vitest-fetch-mock';
import { vi } from 'vitest';

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

vi.mock('cross-fetch', async (importOriginal) => {
  const actual = (await importOriginal()) as unknown as Promise<typeof fetch>;
  return { ...actual, default: fetchMocker };
});
