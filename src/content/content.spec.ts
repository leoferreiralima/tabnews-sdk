import 'vitest-fetch-mock';

import { expect, describe, it, afterEach, beforeEach } from 'vitest';
import { TabNews } from '../tabnews';

let tabNews: TabNews;

describe('Content', () => {
  beforeEach(() => {
    tabNews = new TabNews({
      credentials: {
        email: 'test@email.com',
        password: 'dummy_password',
      },
    });
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  describe('get', () => {
    it('should return all contents and paginagiton', async () => {
      fetchMock.mockOnce(
        JSON.stringify([
          {
            id: 'id',
            owner_id: 'owner_id',
            parent_id: null,
            slug: 'slug',
            title: 'title',
            status: 'published',
            source_url: 'https://source.url.com/source',
            created_at: '2023-09-19T12:16:04.812Z',
            updated_at: '2023-09-19T12:16:04.812Z',
            published_at: '2023-09-19T12:16:04.837Z',
            deleted_at: null,
            tabcoins: 1,
            owner_username: 'username',
            children_deep_count: 2,
          },
        ]),
      );

      const response = await tabNews.content.getAll();

      expect(response.contents).toMatchObject([
        {
          id: 'id',
          owner_id: 'owner_id',
          parent_id: null,
          slug: 'slug',
          title: 'title',
          status: 'published',
          source_url: 'https://source.url.com/source',
          created_at: new Date('2023-09-19T12:16:04.812Z'),
          updated_at: new Date('2023-09-19T12:16:04.812Z'),
          published_at: new Date('2023-09-19T12:16:04.837Z'),
          deleted_at: null,
          tabcoins: 1,
          owner_username: 'username',
          children_deep_count: 2,
        },
      ]);
    });
  });
});
