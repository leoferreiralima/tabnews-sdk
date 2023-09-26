export interface TabNewsApiError {
  name: string;
  message: string;
  action: string;
  status_code: number;
  stack?: string;
  error_id?: string;
  request_id?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any;
  error_location_code?: string;
  key?: string;
  type?: string;
  database_error_code?: string;
}
