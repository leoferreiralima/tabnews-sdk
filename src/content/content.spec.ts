import { expect, describe, it, afterEach, beforeEach } from 'vitest';

import { TABNEWS_ENDPOINTS, TABNEWS_HEADERS } from '@/commons';
import { TabNews } from '@/tabnews';
import {
  DEFAULT_USER,
  createTabNews,
  expectRequest,
  mockOnceApiError,
  mockOnceCurrentUser,
  mockOnceResponse,
  mockOnceSession,
  mockedRequest,
  mockedRequests,
  resetMocks,
} from '@test/utils';

import { GetContentListParams, UpdateContent } from './interfaces';

let tabNews: TabNews;

const linkHeader =
  '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=1&per_page=30>; rel="first", ' +
  '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=2&per_page=30>; rel="next", ' +
  '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=6&per_page=30>; rel="last"';

const lastPageLinkHeader =
  '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=1&per_page=30>; rel="first", ' +
  '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=5&per_page=30>; rel="prev", ' +
  '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=6&per_page=30>; rel="last"';

const username = DEFAULT_USER.username;

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
  owner_username: username,
  children_deep_count: 2,
};

const contentDetail = {
  ...content,
  body: 'body',
};

const contentChildren = [
  {
    id: 'id',
    parent_id: 'parent_id',
    owner_id: 'owner_id',
    slug: 'slug',
    title: null,
    body: 'body',
    status: 'published',
    source_url: null,
    published_at: '2023-04-02T12:25:34.865Z',
    created_at: '2023-04-02T12:25:34.810Z',
    updated_at: '2023-04-02T12:25:34.810Z',
    deleted_at: null,
    owner_username: 'username',
    tabcoins: 0,
    children: [
      {
        id: 'id',
        parent_id: 'parent_id',
        owner_id: 'owner_id',
        slug: 'slug',
        title: null,
        body: 'body',
        status: 'published',
        source_url: null,
        published_at: '2023-04-02T12:25:34.865Z',
        created_at: '2023-04-02T12:25:34.810Z',
        updated_at: '2023-04-02T12:25:34.810Z',
        deleted_at: null,
        owner_username: 'username',
        tabcoins: 1,
        children: [],
        children_deep_count: 0,
      },
    ],
    children_deep_count: 1,
  },
];

describe('Content', () => {
  const mockContent = (slug: string, user: string = username) => {
    mockOnceResponse(
      `${TABNEWS_ENDPOINTS.content}/${user}/${slug}`,
      contentDetail,
    );
  };

  beforeEach(() => {
    tabNews = createTabNews();
  });

  afterEach(() => {
    resetMocks();
  });

  describe('get', () => {
    const mockContents = (link: string, username?: string) => {
      mockOnceResponse(
        username
          ? `${TABNEWS_ENDPOINTS.content}/${username}`
          : TABNEWS_ENDPOINTS.content,
        [content],
        {
          headers: {
            [TABNEWS_HEADERS.link]: link,
            [TABNEWS_HEADERS.paginationTotalRows]: '175',
          },
        },
      );
    };

    const mockContentChildren = (slug: string, user: string = username) => {
      mockOnceResponse(
        `${TABNEWS_ENDPOINTS.content}/${user}/${slug}/children`,
        contentChildren,
      );
    };

    const mockParentContent = (slug: string, user: string = username) => {
      mockOnceResponse(
        `${TABNEWS_ENDPOINTS.content}/${user}/${slug}/parent`,
        contentDetail,
      );
    };

    const mockRootContent = (slug: string, user: string = username) => {
      mockOnceResponse(
        `${TABNEWS_ENDPOINTS.content}/${user}/${slug}/root`,
        contentDetail,
      );
    };

    const mockTabCoins = (slug: string, user: string = username) => {
      mockOnceResponse(
        `${TABNEWS_ENDPOINTS.content}/${user}/${slug}/tabcoins`,
        {
          tabcoins: 13,
        },
      );
    };

    it('should get all contents and pagination', async () => {
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

    it('should send all content params correctly', async () => {
      const paramsList: GetContentListParams[] = [
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

      for (const params of paramsList) {
        mockContents(linkHeader);

        await tabNews.content.getAll(params);
      }
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

    it('should get all contents for a specific user', async () => {
      const username = 'username';
      mockContents(linkHeader, username);

      const response = await tabNews.content.getAll({
        username,
      });

      expect(response.pagination).toMatchSnapshot();
      expect(response.contents).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBeGet();
    });

    it('should get all contents for current user', async () => {
      mockOnceCurrentUser();

      mockContents(linkHeader, username);

      const response = await tabNews.content.getMy();

      expect(response.pagination).toMatchSnapshot();
      expect(response.contents).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBeGet();
    });

    it('should throw an error when parameter is invalid', () => {
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

    it('should get content by slug', async () => {
      const slug = 'slug';

      mockContent(slug);

      const content = await tabNews.content.getBySlug({
        slug,
        username,
      });

      expect(content).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBeGet();
    });

    it('should get content by slug for current user', async () => {
      const slug = 'slug';

      mockOnceCurrentUser();

      mockContent(slug);

      const content = await tabNews.content.getBySlug({
        slug,
      });

      expect(content).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBeGet();
    });

    it('should throw an error when content not found', () => {
      const slug = 'slug';

      mockOnceApiError(`${TABNEWS_ENDPOINTS.content}/${username}/${slug}`, {
        name: 'NotFoundError',
        message: 'O conteúdo informado não foi encontrado no sistema.',
        action: 'Verifique se o "slug" está digitado corretamente.',
        status_code: 404,
        error_id: '3ea15e67-97c8-4671-916f-0344934c8300',
        request_id: '11815650-d56e-4b90-97dd-dcdf23df8412',
        error_location_code: 'CONTROLLER:CONTENT:GET_HANDLER:SLUG_NOT_FOUND',
        key: 'slug',
      });

      expect(() =>
        tabNews.content.getBySlug({
          slug,
          username,
        }),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should get content children', async () => {
      const slug = 'slug';

      mockContentChildren(slug);

      const content = await tabNews.content.getChildren({
        slug,
        username,
      });

      expect(content).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBeGet();
    });

    it('should get content children for current user', async () => {
      const slug = 'slug';

      mockOnceCurrentUser();

      mockContentChildren(slug);

      const content = await tabNews.content.getChildren({
        slug,
      });

      expect(content).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBeGet();
    });

    it('should throw an error when content of content children not found', () => {
      const slug = 'slug';

      mockOnceApiError(
        `${TABNEWS_ENDPOINTS.content}/${username}/${slug}/children`,
        {
          name: 'NotFoundError',
          message: 'O conteúdo informado não foi encontrado no sistema.',
          action: 'Verifique se o "slug" está digitado corretamente.',
          status_code: 404,
          error_id: '3ea15e67-97c8-4671-916f-0344934c8300',
          request_id: '11815650-d56e-4b90-97dd-dcdf23df8412',
          error_location_code: 'CONTROLLER:CONTENT:GET_HANDLER:SLUG_NOT_FOUND',
          key: 'slug',
        },
      );

      expect(() =>
        tabNews.content.getChildren({
          slug,
          username,
        }),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should get parent content', async () => {
      const slug = 'slug';

      mockParentContent(slug);

      const content = await tabNews.content.getParent({
        slug,
        username,
      });

      expect(content).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBeGet();
    });

    it('should get parent content for current user', async () => {
      const slug = 'slug';

      mockOnceCurrentUser();

      mockParentContent(slug);

      const content = await tabNews.content.getParent({
        slug,
      });

      expect(content).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBeGet();
    });

    it('should throw an error when content of parent not found', () => {
      const slug = 'slug';

      mockOnceApiError(
        `${TABNEWS_ENDPOINTS.content}/${username}/${slug}/parent`,
        {
          name: 'NotFoundError',
          message: 'O conteúdo informado não foi encontrado no sistema.',
          action: 'Verifique se o "slug" está digitado corretamente.',
          status_code: 404,
          error_id: '3ea15e67-97c8-4671-916f-0344934c8300',
          request_id: '11815650-d56e-4b90-97dd-dcdf23df8412',
          error_location_code: 'CONTROLLER:CONTENT:GET_HANDLER:SLUG_NOT_FOUND',
          key: 'slug',
        },
      );

      expect(() =>
        tabNews.content.getParent({
          slug,
          username,
        }),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should get root content', async () => {
      const slug = 'slug';

      mockRootContent(slug);

      const content = await tabNews.content.getRoot({
        slug,
        username,
      });

      expect(content).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBeGet();
    });

    it('should get root content for current user', async () => {
      const slug = 'slug';

      mockOnceCurrentUser();

      mockRootContent(slug);

      const content = await tabNews.content.getRoot({
        slug,
      });

      expect(content).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBeGet();
    });

    it('should throw an error when content of root not found', () => {
      const slug = 'slug';

      mockOnceApiError(
        `${TABNEWS_ENDPOINTS.content}/${username}/${slug}/root`,
        {
          name: 'NotFoundError',
          message: 'O conteúdo informado não foi encontrado no sistema.',
          action: 'Verifique se o "slug" está digitado corretamente.',
          status_code: 404,
          error_id: '3ea15e67-97c8-4671-916f-0344934c8300',
          request_id: '11815650-d56e-4b90-97dd-dcdf23df8412',
          error_location_code: 'CONTROLLER:CONTENT:GET_HANDLER:SLUG_NOT_FOUND',
          key: 'slug',
        },
      );

      expect(() =>
        tabNews.content.getRoot({
          slug,
          username,
        }),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should update tabcoins', async () => {
      const slug = 'slug';

      mockTabCoins(slug);

      const tabcoins = await tabNews.content.tabcoins({
        slug,
        username,
        transaction_type: 'credit',
      });

      expect(tabcoins).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBePost();
    });

    it('should update tabcoins for current user', async () => {
      const slug = 'slug';

      mockOnceCurrentUser();

      mockTabCoins(slug);

      const tabcoins = await tabNews.content.tabcoins({
        slug,
        transaction_type: 'credit',
      });

      expect(tabcoins).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBePost();
    });

    it('should throw an error when content of tabcoins not found', () => {
      const slug = 'slug';

      mockOnceApiError(
        `${TABNEWS_ENDPOINTS.content}/${username}/${slug}/tabcoins`,
        {
          name: 'NotFoundError',
          message: 'O conteúdo informado não foi encontrado no sistema.',
          action: 'Verifique se o "slug" está digitado corretamente.',
          status_code: 404,
          error_id: '3ea15e67-97c8-4671-916f-0344934c8300',
          request_id: '11815650-d56e-4b90-97dd-dcdf23df8412',
          error_location_code: 'CONTROLLER:CONTENT:GET_HANDLER:SLUG_NOT_FOUND',
          key: 'slug',
        },
      );

      expect(() =>
        tabNews.content.tabcoins({
          slug,
          username,
          transaction_type: 'credit',
        }),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should up vote tabcoins', async () => {
      const slug = 'slug';

      mockTabCoins(slug);

      const tabcoins = await tabNews.content.upVote({
        slug,
        username,
      });

      expect(tabcoins).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBePost();
    });

    it('should up vote tabcoins for current user', async () => {
      const slug = 'slug';

      mockOnceCurrentUser();

      mockTabCoins(slug);

      const tabcoins = await tabNews.content.upVote({
        slug,
      });

      expect(tabcoins).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBePost();
    });

    it('should down vote tabcoins', async () => {
      const slug = 'slug';

      mockTabCoins(slug);

      const tabcoins = await tabNews.content.downVote({
        slug,
        username,
      });

      expect(tabcoins).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBePost();
    });

    it('should down vote tabcoins for current user', async () => {
      const slug = 'slug';

      mockOnceCurrentUser();

      mockTabCoins(slug);

      const tabcoins = await tabNews.content.downVote({
        slug,
      });

      expect(tabcoins).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBePost();
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
      mockOnceSession();

      mockCreateContent();

      await tabNews.session.create();

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

      expectRequest(request).cookie(TABNEWS_HEADERS.sessionId).toBeDefined();
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

  describe('update', () => {
    it('should update content', async () => {
      const slug = 'slug';

      mockContent(slug);

      const updateContent: UpdateContent = {
        slug,
        title: 'title',
        body: 'body',
        status: 'published',
        source_url: 'https://google.com',
      };

      const content = await tabNews.content.update({
        username,
        ...updateContent,
      });

      expect(content).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBePatch();
      expectRequest(request).body.toBe(updateContent);
    });

    it('should update content for current user', async () => {
      const slug = 'slug';

      mockOnceCurrentUser();

      mockContent(slug);

      const updateContent: UpdateContent = {
        slug,
        title: 'title',
        body: 'body',
        status: 'published',
        source_url: 'https://google.com',
      };

      const content = await tabNews.content.update(updateContent);

      expect(content).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBePatch();
      expectRequest(request).body.toBe(updateContent);
    });

    it('should throw a api erro when content not found', () => {
      const slug = 'slug';

      mockOnceApiError(`${TABNEWS_ENDPOINTS.content}/${username}/${slug}`, {
        name: 'NotFoundError',
        message: 'O conteúdo informado não foi encontrado no sistema.',
        action: 'Verifique se o "slug" está digitado corretamente.',
        status_code: 404,
        error_id: '4504533d-6dda-43c1-854d-2d7ddd49ab31',
        request_id: '1345cace-8cdf-4200-ad4d-5c0975d35fb8',
        error_location_code: 'CONTROLLER:CONTENT:PATCH_HANDLER:SLUG_NOT_FOUND',
        key: 'slug',
      });

      expect(() =>
        tabNews.content.update({
          slug,
          username,
        }),
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe('delete', () => {
    it('should delete content', async () => {
      const slug = 'slug';

      mockContent(slug);

      const content = await tabNews.content.delete({
        slug,
        username,
      });

      expect(content).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBePatch();
      expectRequest(request).body.toBe({
        status: 'deleted',
      });
    });

    it('should delete content for current user', async () => {
      const slug = 'slug';

      mockOnceCurrentUser();

      mockContent(slug);

      const content = await tabNews.content.delete({ slug });

      expect(content).toMatchSnapshot();

      const request = mockedRequest();

      expectRequest(request).method.toBePatch();
      expectRequest(request).body.toBe({
        status: 'deleted',
      });
    });

    it('should throw a api erro when content not found', () => {
      const slug = 'slug';

      mockOnceApiError(`${TABNEWS_ENDPOINTS.content}/${username}/${slug}`, {
        name: 'NotFoundError',
        message: 'O conteúdo informado não foi encontrado no sistema.',
        action: 'Verifique se o "slug" está digitado corretamente.',
        status_code: 404,
        error_id: '4504533d-6dda-43c1-854d-2d7ddd49ab31',
        request_id: '1345cace-8cdf-4200-ad4d-5c0975d35fb8',
        error_location_code: 'CONTROLLER:CONTENT:PATCH_HANDLER:SLUG_NOT_FOUND',
        key: 'slug',
      });

      expect(() =>
        tabNews.content.delete({
          slug,
          username,
        }),
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
