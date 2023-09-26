import { expect, describe, it, afterEach, beforeEach } from 'vitest';

import { TABNEWS_ENDPOINTS, TABNEWS_HEADERS } from '@/commons';
import { TabNews } from '@/tabnews';
import {
  createTabNews,
  expectRequest,
  mockOnceApiError,
  mockOnceResponse,
  mockedRequest,
  mockedRequests,
  resetMocks,
} from '@test/utils';

import { GetContentParams } from './interfaces';

let tabNews: TabNews;

const linkHeader =
  '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=1&per_page=30>; rel="first", ' +
  '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=2&per_page=30>; rel="next", ' +
  '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=6&per_page=30>; rel="last"';

const lastPageLinkHeader =
  '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=1&per_page=30>; rel="first", ' +
  '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=5&per_page=30>; rel="prev", ' +
  '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=6&per_page=30>; rel="last"';

const content = {
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
};

describe('Content', () => {
  beforeEach(() => {
    tabNews = createTabNews();
  });

  afterEach(() => {
    resetMocks();
  });

  describe('get', () => {
    const mockContents = (link: string) => {
      mockOnceResponse(TABNEWS_ENDPOINTS.content, [content], {
        headers: {
          [TABNEWS_HEADERS.link]: link,
          [TABNEWS_HEADERS.paginationTotalRows]: '175',
        },
      });
    };

    it('should return all contents and pagination', async () => {
      mockContents(linkHeader);

      const response = await tabNews.content.getAll();

      expect(response.pagination).toMatchSnapshot();
      expect(response.contents).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBeGet();
    });

    it('should return correct page when is last page', async () => {
      mockContents(lastPageLinkHeader);

      const response = await tabNews.content.getAll();

      expect(response.pagination).toMatchSnapshot();

      expect(response.contents).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBeGet();
    });

    it('should send all content params correctly', () => {
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
        mockContents(linkHeader);

        await tabNews.content.getAll(params);
      });

      const [first, second, third] = mockedRequests();

      expectRequest(first).query('page').toBe('2');
      expectRequest(first).query('per_page').toBe('10');
      expectRequest(first).query('strategy').toBe('new');

      expectRequest(second).query('page').toBeNull();
      expectRequest(second).query('per_page').toBe('20');
      expectRequest(second).query('strategy').toBe('new');

      expectRequest(third).query('page').toBeNull();
      expectRequest(third).query('per_page').toBeNull();
      expectRequest(third).query('strategy').toBe('old');
    });

    it('should return error when parameter is invalid', () => {
      mockOnceApiError(TABNEWS_ENDPOINTS.content, {
        name: 'ValidationError',
        message: '"page" deve possuir um valor mínimo de 1.',
        action: 'Ajuste os dados enviados e tente novamente.',
        status_code: 400,
        error_id: 'd2ae3240-21db-45fe-9985-814aa317dfa1',
        request_id: '4b0a7574-9b89-41f8-8e52-97b972958a67',
        error_location_code: 'MODEL:VALIDATOR:FINAL_SCHEMA',
        key: 'page',
        type: 'number.min',
      });

      expect(() =>
        tabNews.content.getAll({
          page: 0,
        }),
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe('create', () => {
    const mockCreateContent = () => {
      mockOnceResponse(TABNEWS_ENDPOINTS.content, {
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
      });
    };

    it('should create content', async () => {
      mockCreateContent();

      const response = await tabNews.content.create({
        slug: 'e-opcional',
        title: 'test',
        body: 'test',
        status: 'draft',
        source_url: 'https://google.com',
      });

      expect(response).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBePost();
      expectRequest(request).body.toBe({
        slug: 'e-opcional',
        title: 'test',
        body: 'test',
        status: 'draft',
        source_url: 'https://google.com',
      });
    });

    it('should throw an error when create content with invalid parameters', () => {
      mockOnceApiError(TABNEWS_ENDPOINTS.content, {
        name: 'ValidationError',
        message: '"body" possui o valor inválido "null".',
        action: 'Ajuste os dados enviados e tente novamente.',
        status_code: 400,
        error_id: '68a48842-e7ec-4aa8-9549-eb69588cbfe2',
        request_id: '6d4278ca-f9e9-4187-a977-f5aab3f11200',
        error_location_code: 'MODEL:VALIDATOR:FINAL_SCHEMA',
        key: 'body',
        type: 'any.invalid',
      });

      expect(() =>
        tabNews.content.create({
          slug: 'e-opcional',
          title: 'test',
          body: 'invalid',
          status: 'draft',
          source_url: 'https://google.com',
        }),
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
