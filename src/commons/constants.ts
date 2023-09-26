export const TABNEWS_BASE_URL =
  process.env.TABNEWS_BASE_URL || 'https://www.tabnews.com.br/api/v1';

export const TABNEWS_ENDPOINTS = Object.freeze({
  session: '/sessions',
  user: '/user',
  content: '/contents',
});
