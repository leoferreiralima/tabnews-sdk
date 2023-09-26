import 'vitest-fetch-mock';

import { expect, describe, it, afterEach, beforeEach, vi } from 'vitest';
import { TabNews } from '@/tabnews';

let tabNews: TabNews;

describe('Session', () => {
  beforeEach(() => {
    tabNews = new TabNews({
      credentials: {
        email: 'test@email.com',
        password: 'dummy_password',
      },
    });
  });
  afterEach(() => {
    fetchMock.resetMocks();
  });

  describe('create', () => {
    it('should create a session', async () => {
      fetchMock.mockOnce(
        JSON.stringify({
          id: '123',
          token: 'token123',
          expires_at: '2023-10-12T11:56:13.378Z',
          created_at: '2023-09-12T11:56:13.379Z',
          updated_at: '2023-09-12T11:56:13.379Z',
        }),
      );

      const data = await tabNews.session.create();

      expect(data).toMatchObject({
        id: '123',
        token: 'token123',
        expires_at: new Date('2023-10-12T11:56:13.378Z'),
        created_at: new Date('2023-09-12T11:56:13.379Z'),
        updated_at: new Date('2023-09-12T11:56:13.379Z'),
      });
    });

    it('should throw a tabnews error when api return error', async () => {
      fetchMock.mockOnce(
        JSON.stringify({
          message: `"user" não possui "features" ou não é um array.`,
          action: `Contate o suporte informado o campo "errorId".`,
        }),
        {
          status: 400,
        },
      );

      expect(() =>
        tabNews.session.create(),
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe('destroy', () => {
    it('should destroy a session', async () => {
      fetchMock.mockOnce(
        JSON.stringify({
          id: '123',
          token: 'token123',
          expires_at: '2023-10-12T11:56:13.378Z',
          created_at: '2023-09-12T11:56:13.379Z',
          updated_at: '2023-09-12T11:56:13.379Z',
        }),
      );

      await tabNews.session.create();

      fetchMock.mockOnce(
        JSON.stringify({
          id: '123',
          expires_at: '2023-10-12T11:56:13.378Z',
          created_at: '2023-09-12T11:56:13.379Z',
          updated_at: '2023-09-12T11:56:13.379Z',
        }),
      );

      const data = await tabNews.session.destroy();

      expect(data).toMatchObject({
        id: '123',
        expires_at: new Date('2023-10-12T11:56:13.378Z'),
        created_at: new Date('2023-09-12T11:56:13.379Z'),
        updated_at: new Date('2023-09-12T11:56:13.379Z'),
      });
    });
  });

  describe('session', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return that session is expired', () => {
      expect(tabNews.session.isExpired()).toBe(true);
    });

    it('should return that no has session', () => {
      expect(tabNews.session.hasSession()).toBe(false);
    });

    it('should return that no has session when it is destroyed', () => {
      expect(tabNews.session.hasSession()).toBe(false);
    });

    it('should return that has session', async () => {
      fetchMock.mockResponse(
        JSON.stringify({
          id: '123',
          token: 'token123',
          expires_at: '2023-10-12T11:56:13.378Z',
          created_at: '2023-09-12T11:56:13.379Z',
          updated_at: '2023-09-12T11:56:13.379Z',
        }),
      );

      await tabNews.session.create();
      await tabNews.session.destroy();

      expect(tabNews.session.hasSession()).toBe(false);
    });

    it('should return false if current date is least than expires_at', async () => {
      fetchMock.mockOnce(
        JSON.stringify({
          id: '123',
          token: 'token123',
          expires_at: '2023-10-12T11:56:13.378Z',
          created_at: '2023-09-12T11:56:13.379Z',
          updated_at: '2023-09-12T11:56:13.379Z',
        }),
      );

      vi.setSystemTime(new Date(2023, 8, 12));

      await tabNews.session.create();

      expect(tabNews.session.isExpired()).toBe(false);
    });

    it('should return true if current date is greater than expires_at', async () => {
      fetchMock.mockOnce(
        JSON.stringify({
          id: '123',
          token: 'token123',
          expires_at: '2023-10-12T11:56:13.378Z',
          created_at: '2023-09-12T11:56:13.379Z',
          updated_at: '2023-09-12T11:56:13.379Z',
        }),
      );

      vi.setSystemTime(new Date(2023, 9, 13));

      await tabNews.session.create();

      expect(tabNews.session.isExpired()).toBe(true);
    });
  });
});
