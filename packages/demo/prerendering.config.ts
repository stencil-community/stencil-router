import { PrerenderConfig } from '@stencil/core';
import { afterHydrate } from 'stencil-router-v2/static';

export const config: PrerenderConfig = {
  async afterHydrate(doc, url, results) {
    await afterHydrate(doc, url, results);
  }
};
