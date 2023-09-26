import { TabNews } from '../tabnews';
import { parseLink } from '../utils';
import {
  ContentPagination,
  ContentResponse,
  ContentStrategy,
  CreateContent,
  CreateContentResponse,
  GetContentParams,
} from './interfaces';

export class Content {
  constructor(private readonly tabNews: TabNews) {}

  async create(contentBody: CreateContent) {
    const { body: content } = await this.tabNews.post<CreateContentResponse>({
      path: '/contents',
      body: contentBody,
    });

    return content;
  }

  async getAll(params: GetContentParams = {}) {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        urlParams.set(key, value.toString());
      }
    });

    const { body: contents, headers } = await this.tabNews.get<
      ContentResponse[]
    >({
      path:
        urlParams.size > 0 ? `/contents?${urlParams.toString()}` : '/contents',
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
}
