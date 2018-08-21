import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'stencilrouter',
  outputTargets:[
    {
      type: 'dist'
    }
  ]
};

export const devServer = {
  root: 'www',
  watchGlob: '**/**'
}
