exports.config = {
  namespace: 'stencilrouter',
  generateDistribution: true,
  generateWWW: false,
  bundles: [
    { components: ['test-app', 'test-demo-three', 'test-demo-four'] },
    { components: ['stencil-router', 'stencil-route', 'stencil-route-link', 'stencil-router-redirect', 'stencil-async-content'] }
  ],
  global: 'src/global/router.ts'
};
