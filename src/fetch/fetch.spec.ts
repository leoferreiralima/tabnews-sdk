import 'vitest-fetch-mock';

import { expect, describe, it } from 'vitest';
import { fetch } from './fetch';

describe('fetch', () => {
  it('should convert utc date string to date object', async () => {
    const date = new Date();

    fetchMock.mockOnce(
      JSON.stringify({
        string: 'text',
        stringWithNumbers: '123',
        number: 23,
        boolean: true,
        dateUtc: date.toISOString(),
        dateNonUtc: `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDay()}`,
        innerObject: {
          string: 'text',
          stringWithNumbers: '123',
          number: 23,
          boolean: true,
          dateUtc: date.toISOString(),
          dateNonUtc: `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDay()}`,
        },
        innerArray: [
          {
            string: 'text',
            stringWithNumbers: '123',
            number: 23,
            boolean: true,
            dateUtc: date.toISOString(),
            dateNonUtc: `${date.getFullYear()}-${
              date.getMonth() + 1
            }-${date.getDay()}`,
          },
        ],
      }),
      {
        status: 200,
      },
    );

    const response = await fetch('/test');

    expect(response.json()).resolves.toMatchObject({
      string: 'text',
      stringWithNumbers: '123',
      number: 23,
      boolean: true,
      dateUtc: date,
      dateNonUtc: `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDay()}`,
      innerObject: {
        string: 'text',
        stringWithNumbers: '123',
        number: 23,
        boolean: true,
        dateUtc: date,
        dateNonUtc: `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDay()}`,
      },
      innerArray: [
        {
          string: 'text',
          stringWithNumbers: '123',
          number: 23,
          boolean: true,
          dateUtc: date,
          dateNonUtc: `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDay()}`,
        },
      ],
    });
  });
});
