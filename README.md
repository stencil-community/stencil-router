[![npm][npm-badge]][npm-badge-url]
## Stencil Router

## ☎️ Call for Maintainers ☎️

In the past, we’ve created packages under the Stencil name to keep them out of the core compiler. Looking to this year and beyond, we’re going to focus on Stencil as a compiler for web components and begin to move away from creating full-blown web applications using packages maintained by Ionic.

We're excited to share that we have a [Stencil community org on GitHub](https://github.com/stencil-community). This will be a central place for projects driven by our community of Stencil developers.

We recognize and appreciate that folks may want to continue building applications with Stencil. With this Stencil community organization, we’re going to be moving this package to the community org so that folks who want to continue to develop applications in Stencil can do so and take a more active role in its development

We’re looking for community members to take ownership of this project. **If you are interested in becoming a maintainer, feel free to send Anthony Giuliano a direct message in the [Stencil Slack](https://stencil-worldwide.slack.com/archives/D03EU2YMN0P) or on Twitter ([@a__giuliano](https://twitter.com/a__giuliano))**. Even if you are unsure about becoming a maintainer, please feel free to reach out. We’re more than happy to discuss what this would look like. We’re really excited about giving the Stencil community greater ownership and all the amazing projects that we know will come from it.

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
