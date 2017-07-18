## Stencil Router

A simple router, inspired by React Router v4, for Stencil apps and vanilla Web Component apps.

Note: for apps using Ionic, we recommend using the Ionic navigation system and router for more native-style navigation.

### Basic Usage

```html
<stencil-router id="router">

  <stencil-route url="/" router="#router" component="landing-page" />
  <stencil-route url="/docs" router="#router" component="docs-page" />
  <stencil-route url="/demos" router="#router" component="demos-page" />

</stencil-router>
```
