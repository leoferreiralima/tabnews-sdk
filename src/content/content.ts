import { TabNews } from '../tabnews';
import { ContentResponse } from './interfaces';

export class Content {
  constructor(private readonly tabNews: TabNews) {}

  async getAll() {
    const response = await this.tabNews.get<ContentResponse[]>({
      path: '/contents',
    });

    return {
      contents: response,
    };
  }
}
