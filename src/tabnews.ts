import { TabNewsConfig } from './interfaces';

export class TabNews {
  constructor(readonly config: TabNewsConfig = {}) {
    if (!config.credentials) {
      config.credentials = {};
    }

    config.credentials.email =
      config.credentials.email || process.env.TABNEWS_CREDENTIALS_EMAIL;
    config.credentials.password =
      config.credentials.password || process.env.TABNEWS_CREDENTIALS_PASSWORD;

    this.config = config;
  }
}
