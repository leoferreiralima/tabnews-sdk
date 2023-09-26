import { TabNewsApiError } from './interfaces';

export class TabNewsError extends Error implements TabNewsApiError {
  action: string;
  status_code: number;
  error_id?: string;
  request_id?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any;
  error_location_code?: string;
  key?: string;
  type?: string;
  database_error_code?: string;

  constructor(tabNewsError: TabNewsApiError) {
    super(tabNewsError.message);
    this.name = tabNewsError.name;
    this.action = tabNewsError.action;
    this.status_code = tabNewsError.status_code;
    this.error_id = tabNewsError.error_id;
    this.request_id = tabNewsError.request_id;
    this.context = tabNewsError.context;
    this.stack = tabNewsError.stack;
    this.error_location_code = tabNewsError.error_location_code;
    this.key = tabNewsError.key;
    this.type = tabNewsError.type;
    this.database_error_code = tabNewsError.database_error_code;
  }
}
