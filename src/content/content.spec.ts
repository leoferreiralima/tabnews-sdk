import 'vitest-fetch-mock';

import { expect, describe, it, afterEach, beforeEach } from 'vitest';
import { TabNews } from '@/tabnews';
import { GetContentParams } from './interfaces';
import { createTabNews } from '@test/utils';

let tabNews: TabNews;

const linkHeader =
  '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=1&per_page=30>; rel="first", ' +
  '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=2&per_page=30>; rel="next", ' +
  '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=6&per_page=30>; rel="last"';

const lastPageLinkHeader =
  '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=1&per_page=30>; rel="first", ' +
  '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=5&per_page=30>; rel="prev", ' +
  '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=6&per_page=30>; rel="last"';

describe('Content', () => {
  beforeEach(() => {
    tabNews = createTabNews();
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
        {
          headers: {
            link: linkHeader,
            'x-pagination-total-rows': '175',
          },
        },
      );

      const response = await tabNews.content.getAll();

      expect(response.pagination).toMatchObject({
        strategy: 'relevant',
        page: 1,
        per_page: 30,
        first_page: 1,
        last_page: 6,
        next_page: 2,
        previous_page: undefined,
        total_rows: 175,
      });

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

    it('should return correct page when is last page', async () => {
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
        {
          headers: {
            link: lastPageLinkHeader,
            'x-pagination-total-rows': '175',
          },
        },
      );

      const response = await tabNews.content.getAll();

      expect(response.pagination).toMatchObject({
        strategy: 'relevant',
        page: 6,
        per_page: 30,
        first_page: 1,
        last_page: 6,
        next_page: undefined,
        previous_page: 5,
        total_rows: 175,
      });

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

    it('should send all conteny params correctly', () => {
      const paramsList: GetContentParams[] = [
        {
          page: 2,
          per_page: 10,
          strategy: 'new',
        },
        {
          per_page: 20,
          strategy: 'new',
        },
        {
          strategy: 'old',
        },
      ];

      paramsList.forEach(async (params) => {
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
          {
            headers: {
              link: linkHeader,
              'x-pagination-total-rows': '175',
            },
          },
        );

        await tabNews.content.getAll(params);
      });

      const requests = fetchMock.requests();

      expect(
        requests[0].url.endsWith('page=2&per_page=10&strategy=new'),
      ).toBeTruthy();

      expect(requests[1].url.endsWith('per_page=20&strategy=new')).toBeTruthy();
      expect(requests[2].url.endsWith('strategy=old')).toBeTruthy();
    });
  });

  describe('create', () => {
    it('should create content', async () => {
      fetchMock.mockOnce(
        JSON.stringify({
          id: '502d02a1-2e38-4cc6-9e41-55c978e34c67',
          owner_id: '605144ec-9f0d-437b-96ee-1b5f4e54f5f9',
          parent_id: null,
          slug: 'e-opcional',
          title: 'test',
          body: 'test',
          status: 'draft',
          source_url: null,
          created_at: '2023-09-19T10:29:20.967Z',
          updated_at: '2023-09-19T10:29:20.967Z',
          published_at: null,
          deleted_at: null,
          owner_username: 'leoferreiralima',
          tabcoins: 0,
        }),
      );

      const response = await tabNews.content.create({
        parent_id: undefined,
        slug: 'e-opcional',
        title: 'test',
        body: 'test',
        status: 'draft',
        source_url: 'https://google.com',
      });

      expect(response).toMatchObject({
        id: '502d02a1-2e38-4cc6-9e41-55c978e34c67',
        owner_id: '605144ec-9f0d-437b-96ee-1b5f4e54f5f9',
        parent_id: null,
        slug: 'e-opcional',
        title: 'test',
        body: 'test',
        status: 'draft',
        source_url: null,
        created_at: new Date('2023-09-19T10:29:20.967Z'),
        updated_at: new Date('2023-09-19T10:29:20.967Z'),
        published_at: null,
        deleted_at: null,
        owner_username: 'leoferreiralima',
        tabcoins: 0,
      });
    });
  });
});
