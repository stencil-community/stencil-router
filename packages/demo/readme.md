# demo

A Stencil app that exercises `@stencil-community/router`. It is built with
prerendering and covered by the Playwright tests in `e2e/`.

```bash
pnpm build   # stencil build --prerender
pnpm test    # playwright browser tests against www/
pnpm start   # dev server
```