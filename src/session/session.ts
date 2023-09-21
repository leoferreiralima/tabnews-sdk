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
    const response = await this.tabNews.delete<Omit<SessionResponse, 'token'>>({
      path: '/sessions',
    });

    this.session = undefined;

    return response;
  }

  hasSession() {
    return !!this.session;
  }

  isExpired() {
    if (!this.session) {
      return true;
    }

    const expiresAtTimestamp = this.session?.expires_at.getTime();

    if (expiresAtTimestamp >= Date.now()) {
      return false;
    }

    return true;
  }
}
