export type RequestConfig = Omit<RequestInit, 'method' | 'headers' | 'body'> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  path: string;
};
