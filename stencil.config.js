exports.config = {
  namespace: 'stencilrouter',
  generateDistribution: true,
  generateWWW: true,
  bundles: [
    { components: ['test-app', 'test-demo-three', 'test-demo-four'] },
    { components: ['stencil-router', 'stencil-route', 'stencil-route-link', 'stencil-route-title', 'stencil-router-redirect', 'stencil-async-content'] }
  ],
  global: 'src/global/router.ts'
};
