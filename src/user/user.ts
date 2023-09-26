import { TabNews } from '@/tabnews';
import { UserResponse } from './interfaces';

export class User {
  constructor(private readonly tabNews: TabNews) {}

  async me() {
    const { body: user } = await this.tabNews.get<UserResponse>({
      path: '/user',
    });

    return user;
  }
}
