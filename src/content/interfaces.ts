export type ContentStatus = 'published' | 'deleted' | 'draft';
export type CreateContentStatus = Exclude<ContentStatus, 'deleted'>;
export type ContentStrategy = 'new' | 'old' | 'relevant';

export interface ContentResponse {
  id: string;
  owner_id: string;
  owner_username: string;
  parent_id?: string;
  slug: string;
  title?: string;
  status: ContentStatus;
  source_url?: string;
  created_at: Date;
  updated_at: Date;
  published_at: Date;
  deleted_at?: Date;
  tabcoins: number;
  children_deep_count: number;
}

export interface GetContentListParams {
  username?: string;
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

export interface CreateContent {
  parent_id?: string;
  slug?: string;
  title?: string;
  body: string;
  status: CreateContentStatus;
  source_url?: string;
}

export interface GetContentParams {
  slug: string;
  username?: string;
}

export interface ContentDetailResponse extends ContentResponse {
  body: string;
}

export type UpdateContent = Partial<
  Omit<CreateContent, 'parent_id' | 'slug' | 'status'>
> & {
  slug: string;
  status?: ContentStatus;
  username?: string;
};

export interface ContentChildrenResponse extends ContentDetailResponse {
  children: ContentChildrenResponse[];
}

export interface ContentTabcoinsParams extends GetContentParams {
  transaction_type: 'credit' | 'debit';
}

export interface ContentTabcoinsResponse {
  tabcoins: number;
}
