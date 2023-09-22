type LinkRel = 'first' | 'next' | 'prev' | 'last';

interface LinkParameters {
  page: number;
  per_page: number;
  strategy: string;
}

export function parseLink(link: string) {
  const parsedLink = new Map<LinkRel, LinkParameters>();

  link
    .split(',')
    .map((value) => value.trim())
    .map((value) => value.split(';'))
    .map(([url, rel]) => {
      return [url.replace(/<|>/gm, ''), rel.trim().replace(/(rel=)|"/gm, '')];
    })
    .forEach(([url, rel]) => {
      const urlParams = getUrlSearchParams(url);

      parsedLink.set(rel as LinkRel, {
        page: parseInt(urlParams.get('page')!),
        per_page: parseInt(urlParams.get('per_page')!),
        strategy: urlParams.get('strategy')!,
      });
    });

  return {
    first: parsedLink.get('first')!,
    next: parsedLink.get('next'),
    prev: parsedLink.get('prev'),
    last: parsedLink.get('last')!,
  };
}

function getUrlSearchParams(url: string) {
  return new URLSearchParams(url.split('?')[1]);
}
