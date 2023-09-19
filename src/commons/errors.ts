import { TabNewsApiError } from './interfaces';

export class TabNewsError extends Error implements TabNewsApiError {
  action: string;
  statusCode: number;
  errorId?: string;
  requestId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any;
  errorLocationCode?: string;
  key?: string;
  type?: string;
  databaseErrorCode?: string;

  constructor(readonly tabNewsError: TabNewsApiError) {
    super(tabNewsError.message);
    this.name = tabNewsError.name;
    this.action = tabNewsError.action;
    this.statusCode = tabNewsError.statusCode;
    this.errorId = tabNewsError.errorId;
    this.requestId = tabNewsError.requestId;
    this.context = tabNewsError.context;
    this.stack = tabNewsError.stack;
    this.errorLocationCode = tabNewsError.errorLocationCode;
    this.key = tabNewsError.key;
    this.type = tabNewsError.type;
    this.databaseErrorCode = tabNewsError.databaseErrorCode;
  }
}
