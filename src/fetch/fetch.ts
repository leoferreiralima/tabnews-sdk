import crossFetch from 'cross-fetch';

export const fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const response = await crossFetch(input, init);

  return {
    ok: response.ok,
    status: response.status,
    headers: response.headers,
    json: async () => {
      const body = await response.text();

      return JSON.parse(body, dateReviver);
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dateReviver(_: string, value: any) {
  if (typeof value === 'string' && isValidDate(value)) {
    return new Date(value);
  }
  return value;
}

function isValidDate(dateString: string) {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return false;
  }

  return date.toISOString() === dateString;
}
