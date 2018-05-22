exports.config = {
  enableCache: false,
  serviceWorker: false,
  namespace: 'stencilrouter',
  outputTargets:[
    {
      type: 'dist'
    },
    {
      type: 'www'
    }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
