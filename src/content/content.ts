import { TabNews } from '../tabnews';
import { ContentResponse } from './interfaces';

export class Content {
  constructor(private readonly tabNews: TabNews) {}

  async getAll() {
    const { body: contents } = await this.tabNews.get<ContentResponse[]>({
      path: '/contents',
    });

    return {
      contents,
    };
  }
}
