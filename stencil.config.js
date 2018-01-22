exports.config = {
  namespace: 'stencilrouter',
  generateDistribution: true,
  generateWWW: true,
  serviceWorker: false,
  bundles: [
    { components: ['stencil-router', 'stencil-route', 'stencil-route-link', 'stencil-route-title', 'stencil-router-redirect', 'stencil-async-content'] }
  ],
  globalScript: 'src/global/router.ts'
};
