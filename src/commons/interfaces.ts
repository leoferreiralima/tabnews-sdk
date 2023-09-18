export interface TabNewsApiError {
  name: string;
  message: string;
  action: string;
  statusCode: number;
  stack?: string;
  errorId?: string;
  requestId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any;
  errorLocationCode?: string;
  key?: string;
  type?: string;
  databaseErrorCode?: string;
}
