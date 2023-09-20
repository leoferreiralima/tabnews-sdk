export type RequestConfig = Omit<RequestInit, 'headers' | 'body'> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  path: string;
};
