import crossFetch from 'cross-fetch';

export const fetch: typeof crossFetch = async (input, init) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const response = await crossFetch(input, init);

  return {
    ...response,
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
