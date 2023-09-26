export const TABNEWS_BASE_URL =
  process.env.TABNEWS_BASE_URL || 'https://www.tabnews.com.br/api/v1';

export const TABNEWS_ENDPOINTS = Object.freeze({
  session: '/sessions',
  user: '/user',
  content: '/contents',
});

export const TABNEWS_HEADERS = Object.freeze({
  cookie: 'Cookie',
  link: 'link',
  paginationTotalRows: 'x-pagination-total-rows',
  sessionId: 'session_id',
});
