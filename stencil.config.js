exports.config = {
  enableCache: false,
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
