import { TabNews } from '@/tabnews';
import { UserResponse } from './interfaces';
import { TABNEWS_ENDPOINTS } from '@/commons';

export class User {
  constructor(private readonly tabNews: TabNews) {}

  async me() {
    const { body: user } = await this.tabNews.get<UserResponse>({
      path: TABNEWS_ENDPOINTS.user,
    });

    return user;
  }
}
