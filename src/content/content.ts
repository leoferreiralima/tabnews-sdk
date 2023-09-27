import { TABNEWS_ENDPOINTS } from '@/commons';
import { TabNews } from '@/tabnews';
import { parseLink } from '@/utils';

import {
  ContentDetailResponse,
  ContentPagination,
  ContentResponse,
  ContentStrategy,
  ContentTabcoinsParams,
  ContentTabcoinsResponse,
  CreateContent,
  GetContentListParams,
  GetContentParams,
  UpdateContent,
} from './interfaces';

export class Content {
  constructor(private readonly tabNews: TabNews) {}

  async create(contentBody: CreateContent) {
    const { body: content } = await this.tabNews.post<ContentDetailResponse>({
      path: TABNEWS_ENDPOINTS.content,
      body: contentBody,
    });

    return content;
  }

  async update({ username, ...contentUpdate }: UpdateContent) {
    const { body: content } = await this.tabNews.patch<ContentDetailResponse>({
      path: await this.getUrlForSlugAndUsername({
        slug: contentUpdate.slug,
        username,
      }),
      body: contentUpdate,
    });

    return content;
  }

  async delete({ username, slug }: GetContentParams) {
    const { body: content } = await this.tabNews.patch<ContentDetailResponse>({
      path: await this.getUrlForSlugAndUsername({
        slug,
        username,
      }),
      body: {
        status: 'deleted',
      },
    });

    return content;
  }

  async tabcoins({ username, slug, transaction_type }: ContentTabcoinsParams) {
    const url = await this.getUrlForSlugAndUsername({
      slug,
      username,
    });

    const { body: tabcoins } = await this.tabNews.post<ContentTabcoinsResponse>(
      {
        path: `${url}/tabcoins`,
        body: {
          transaction_type,
        },
      },
    );

    return tabcoins;
  }

  async upVote({
    username,
    slug,
  }: Omit<ContentTabcoinsParams, 'transaction_type'>) {
    return await this.tabcoins({
      username,
      slug,
      transaction_type: 'credit',
    });
  }

  async downVote({
    username,
    slug,
  }: Omit<ContentTabcoinsParams, 'transaction_type'>) {
    return await this.tabcoins({
      username,
      slug,
      transaction_type: 'debit',
    });
  }

  async getAll({ username, ...params }: GetContentListParams = {}) {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        urlParams.set(key, value.toString());
      }
    });

    const url = username
      ? `${TABNEWS_ENDPOINTS.content}/${username}`
      : TABNEWS_ENDPOINTS.content;

    const { body: contents, headers } = await this.tabNews.get<
      ContentResponse[]
    >({
      path: urlParams.size > 0 ? `${url}?${urlParams.toString()}` : url,
    });

    const links = parseLink(headers.get('link')!);
    const totalRows = parseInt(headers.get('x-pagination-total-rows')!);

    const pagination: ContentPagination = {
      strategy: links.first.strategy as ContentStrategy,
      first_page: links.first.page,
      last_page: links.last.page,
      next_page: links.next?.page,
      previous_page: links.prev?.page,
      per_page: links.first.per_page,
      page: links.next ? links.next.page - 1 : links.last.page,
      total_rows: totalRows,
    };

    return {
      contents,
      pagination,
    };
  }

  async getMy(params: Omit<GetContentListParams, 'username'> = {}) {
    const { username } = await this.tabNews.user.me();

    return await this.getAll({ username, ...params });
  }

  async getBySlug(params: GetContentParams) {
    const { body: content } = await this.tabNews.get<ContentDetailResponse>({
      path: await this.getUrlForSlugAndUsername(params),
    });

    return content;
  }

  async getChildren(params: GetContentParams) {
    const url = await this.getUrlForSlugAndUsername(params);

    const { body: contentChildren } =
      await this.tabNews.get<ContentDetailResponse>({
        path: `${url}/children`,
      });

    return contentChildren;
  }

  async getParent(params: GetContentParams) {
    const url = await this.getUrlForSlugAndUsername(params);

    const { body: parentContent } =
      await this.tabNews.get<ContentDetailResponse>({
        path: `${url}/parent`,
      });

    return parentContent;
  }

  async getRoot(params: GetContentParams) {
    const url = await this.getUrlForSlugAndUsername(params);

    const { body: rootContent } = await this.tabNews.get<ContentDetailResponse>(
      {
        path: `${url}/root`,
      },
    );

    return rootContent;
  }

  private async getUrlForSlugAndUsername({ slug, username }: GetContentParams) {
    if (username) {
      return `${TABNEWS_ENDPOINTS.content}/${username}/${slug}`;
    }
    const { username: currentUser } = await this.tabNews.user.me();

    return `${TABNEWS_ENDPOINTS.content}/${currentUser}/${slug}`;
  }
}
