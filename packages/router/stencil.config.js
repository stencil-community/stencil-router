exports.config = {
  namespace: 'stencilrouter',
  outputTargets:[
    {
      type: 'dist'
    }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
