exports.config = {
  generateCollection: true,
  bundles: [
    { components: ['test-app', 'test-page']},
    { components: ['stencil-router', 'stencil-route', 'stencil-route-link', 'stencil-router-redirect'] }
  ],
  global: 'src/global/router.ts'
};
