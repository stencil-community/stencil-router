import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'stencil-store-tests',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      prerenderConfig: "./prerendering.config.ts",
      baseUrl: "https://example.com"
    }
  ]
};
