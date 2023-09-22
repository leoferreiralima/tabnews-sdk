import { describe, expect, it } from 'vitest';

import { parseLink } from './link-header';

describe('Link Header', () => {
  it('should parse link header with firt, next, prev and last rels', () => {
    const linkHeader =
      '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=1&per_page=30>; rel="first", ' +
      '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=3&per_page=30>; rel="prev", ' +
      '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=5&per_page=30>; rel="next", ' +
      '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=6&per_page=30>; rel="last"';

    const linkParsed = parseLink(linkHeader);

    expect(linkParsed).toMatchObject({
      first: {
        page: 1,
        per_page: 30,
        strategy: 'relevant',
      },
      prev: {
        page: 3,
        per_page: 30,
        strategy: 'relevant',
      },
      next: {
        page: 5,
        per_page: 30,
        strategy: 'relevant',
      },
      last: {
        page: 6,
        per_page: 30,
        strategy: 'relevant',
      },
    });
  });

  it('should parse link header with firt, next and last rels', () => {
    const linkHeader =
      '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=1&per_page=30>; rel="first", ' +
      '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=2&per_page=30>; rel="next", ' +
      '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=6&per_page=30>; rel="last"';

    const linkParsed = parseLink(linkHeader);

    expect(linkParsed).toMatchObject({
      first: {
        page: 1,
        per_page: 30,
        strategy: 'relevant',
      },
      prev: undefined,
      next: {
        page: 2,
        per_page: 30,
        strategy: 'relevant',
      },
      last: {
        page: 6,
        per_page: 30,
        strategy: 'relevant',
      },
    });
  });

  it('should parse link header with firt, prev and last rels', () => {
    const linkHeader =
      '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=1&per_page=30>; rel="first", ' +
      '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=5&per_page=30>; rel="prev", ' +
      '<https://www.tabnews.com.br/api/v1/contents?strategy=relevant&page=6&per_page=30>; rel="last"';

    const linkParsed = parseLink(linkHeader);

    expect(linkParsed).toMatchObject({
      first: {
        page: 1,
        per_page: 30,
        strategy: 'relevant',
      },
      prev: {
        page: 5,
        per_page: 30,
        strategy: 'relevant',
      },
      next: undefined,
      last: {
        page: 6,
        per_page: 30,
        strategy: 'relevant',
      },
    });
  });
});
