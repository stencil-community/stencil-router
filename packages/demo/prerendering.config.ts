import { PrerenderConfig } from '@stencil/core';
import { afterHydrate } from '@stencil-community/router/static';

export const config: PrerenderConfig = {
  async afterHydrate(doc, url, results) {
    await afterHydrate(doc, url, results);
  }
};
