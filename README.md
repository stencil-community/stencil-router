[![npm][npm-badge]][npm-badge-url]
## Stencil Router

A simple router, inspired by React Router v4, for Stencil apps and vanilla Web Component apps.

```html
<stencil-router>
  <stencil-route url="/" component="landing-page" exact={true}></stencil-route>
  <stencil-route url="/docs" component="docs-page"></stencil-route>
  <stencil-route url="/demos" component="demos-page"></stencil-route>
</stencil-router>
```

### Included components

- **stencil-router**

  You should have one single stencil-router component in your project.  This component controls all interactions with the browser history and it aggregates updates through an event system.

- **stencil-route**
  
  This component renders based on whether the supplied url matches the current location.

  *properties*:
  - **url** (*string*): the pathname to match on.  Accepts paths similar to expressjs.  So that you can define parameters in the url `/foo/:bar` where bar would be available in incoming props.
  - **component** (*string*): the component name that you would like the route to render
  - **componentProps** (*key/value Object*): a key value object(`{ 'red': true, 'blue': 'white'}`) containing props that should be passed to the defined component when rendered.
  - **routeRender** (*function*): function that accepts props as an argument. If this exists it will be used in place of the component defined.
  - **exact** (*boolean*): If true then only render this route when the url matches exactly to the location, if false it will render if the current url 'matches' the url defined.

- **stencil-route-link**

  This component is used to render links to defined routes.  It applys a specific style based on whether the link matches the current location.

  *properties*:
  - **url** (*string*): the pathname to link to.
  - **exact** (*boolean*): If true then only apply the active class when the url matches exactly to the location.
  - **activeClass** (*string*): The class to apply if the link matches the current location. This defaults to 'link-active'.

- **stencil-route-redirect**

  This component redirects the current location.

  *properties*:
  - **url** (*string*): the url to redirect to.


Note: for apps using Ionic, we recommend using the Ionic navigation system and router for more native-style navigation.

[npm-badge]: https://img.shields.io/npm/v/@stencil/router.svg
[npm-badge-url]: https://www.npmjs.com/package/@stencil/router
