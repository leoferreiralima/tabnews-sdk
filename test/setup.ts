import { vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

vi.mock('cross-fetch', async (importOriginal) => {
  const actual = (await importOriginal()) as unknown as typeof fetch;
  return { ...actual, default: fetchMocker };
});
