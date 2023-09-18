import { TabNews } from '../tabnews';
import { SessionResponse } from './interfaces';

export class Session {
  private session?: SessionResponse;

  constructor(private readonly tabNews: TabNews) {}

  async create() {
    const response = await this.tabNews.post<SessionResponse>({
      path: '/sessions',
      body: {
        email: this.tabNews.config.credentials?.email,
        password: this.tabNews.config.credentials?.password,
      },
    });

    this.session = response;

    return this.session;
  }

  async destroy() {
    this.session = undefined;
  }

  isExpired() {
    if (!this.session) {
      return true;
    }

    const expiresAtTimestamp = Date.parse(this.session?.expires_at);

    if (expiresAtTimestamp >= Date.now()) {
      return false;
    }

    return true;
  }
}
