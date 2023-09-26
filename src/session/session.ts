import { TABNEWS_ENDPOINTS } from '@/commons';
import { TabNews } from '@/tabnews';

import { SessionResponse } from './interfaces';

export class Session {
  session?: SessionResponse;

  constructor(private readonly tabNews: TabNews) {}

  async create() {
    const { body } = await this.tabNews.post<SessionResponse>({
      path: TABNEWS_ENDPOINTS.session,
      body: {
        email: this.tabNews.config.credentials?.email,
        password: this.tabNews.config.credentials?.password,
      },
    });

    this.session = body;

    return this.session;
  }

  async destroy() {
    const { body } = await this.tabNews.delete<Omit<SessionResponse, 'token'>>({
      path: TABNEWS_ENDPOINTS.session,
    });

    this.session = undefined;

    return body;
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
