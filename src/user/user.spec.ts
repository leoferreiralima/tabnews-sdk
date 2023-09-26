import 'vitest-fetch-mock';

import { expect, describe, it, beforeEach } from 'vitest';

import { TabNews } from '@/tabnews';
import { createTabNews } from '@test/utils';

let tabNews: TabNews;

describe('User', () => {
  beforeEach(() => {
    tabNews = createTabNews();
  });

  describe('me', () => {
    it('should get me', async () => {
      fetchMock.mockOnceIf(
        (request) => request.url.endsWith('/user'),
        JSON.stringify({
          id: 'id',
          username: 'username',
          email: 'my@email.com',
          description: 'description',
          notifications: true,
          features: [
            'create:session',
            'read:session',
            'create:content',
            'create:content:text_root',
            'create:content:text_child',
            'update:content',
            'update:user',
          ],
          tabcoins: 9,
          tabcash: 10,
          created_at: '2022-04-05T23:50:19.920Z',
          updated_at: '2022-04-05T23:50:56.545Z',
        }),
      );

      const user = await tabNews.user.me();

      expect(user).toMatchObject({
        id: 'id',
        username: 'username',
        email: 'my@email.com',
        description: 'description',
        notifications: true,
        features: [
          'create:session',
          'read:session',
          'create:content',
          'create:content:text_root',
          'create:content:text_child',
          'update:content',
          'update:user',
        ],
        tabcoins: 9,
        tabcash: 10,
        created_at: new Date('2022-04-05T23:50:19.920Z'),
        updated_at: new Date('2022-04-05T23:50:56.545Z'),
      });
    });
  });
});
