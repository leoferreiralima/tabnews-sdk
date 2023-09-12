import { TabNewsConfig } from './interfaces';

export class TabNews {
  constructor(readonly config?: TabNewsConfig) {
    if (!!config && !config.credentials) {
      throw new Error(
        `Missing Credentials. Pass it to the constructor like the example below:
        \`new TabNews({
            credential: {
              email: 'your@email.com'
              password: 'your_password'
            }
          );\``,
      );
    }

    this.config = config;
  }
}
