export interface ContentResponse {
  id: string;
  owner_id: string;
  owner_username: string;
  parent_id?: string;
  slug: string;
  title?: string;
  status: 'published' | 'deleted' | 'draft';
  source_url?: string;
  created_at: Date;
  updated_at: Date;
  published_at: Date;
  deleted_at?: Date;
  tabcoins: number;
  children_deep_count: number;
}

export type ContentStrategy = 'new' | 'old' | 'relevant';

export interface GetContentParams {
  page?: number;
  per_page?: number;
  strategy?: ContentStrategy;
}

export interface ContentPagination {
  strategy: ContentStrategy;
  page: number;
  per_page: number;
  first_page: number;
  last_page: number;
  next_page?: number;
  previous_page?: number;
  total_rows: number;
}
