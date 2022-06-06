[![npm][npm-badge]][npm-badge-url]
## Stencil Router

⚠️ 📦 This project has moved to the Stencil Community 📦 ⚠️

This project has been moved to the Stencil Community. Going forward, it will be maintained by members of the Stencil community, rather than Ionic. Please see the [new repository](https://github.com/stencil-community/stencil-router) for updates to this project going forward.

This repository has been kept in readonly/archive mode for historical purposes.

---

A simple router, inspired by React Router v4, for Stencil apps and vanilla Web Component apps.

```jsx
<stencil-router>
  <stencil-route-switch scrollTopOffset={0}>
    <stencil-route url="/" component="landing-page" exact={true} />
    <stencil-route url="/demos" component="demos-page" />
    <stencil-route url="/other" component="other-page" />
    <stencil-route component="page-not-found" />
  </stencil-route-switch>
</stencil-router>
```

Included components and all other information can be found in our [wiki].

[wiki]: https://github.com/ionic-team/stencil-router/wiki

[npm-badge]: https://img.shields.io/npm/v/@stencil-community/router.svg
[npm-badge-url]: https://www.npmjs.com/package/@stencil-community/router
