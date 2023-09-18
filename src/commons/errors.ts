import { TabNewsApiError } from './interfaces';

export class TabNewsError extends Error implements TabNewsApiError {
  action: string;
  statusCode: number;
  errorId?: string | undefined;
  requestId?: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any;
  errorLocationCode?: string | undefined;
  key?: string | undefined;
  type?: string | undefined;
  databaseErrorCode?: string | undefined;

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
