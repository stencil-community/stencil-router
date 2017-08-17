import { Component } from '@stencil/core';

@Component({
  tag: 'stencil-site',
  styleUrl: 'stencil-site.scss'
})
export class App {
  constructor() {
  }
  render() {
    return (
      <div class="app">
        <site-header />
        <div class="wrapper">
          <div class="pull-left">
            <site-menu />
          </div>
          <div class="pull-right">
            <stencil-router>
              <stencil-route url="/" component="landing-page" exact={true} />
              <stencil-route url="/demos" component="demos-page" />
              <stencil-route url="/docs/getting-started" component="getting-started" />
              <stencil-route url="/docs/intro" component="what-is" />
              <stencil-route url="/components" component="basics-components" />
              <stencil-route url="/routing" component="basics-routing" />
              <stencil-route url="/config" component="compiler-config" />
              <stencil-route url="/server-side-rendering" component="stencil-ssr" />
            </stencil-router>
          </div>
        </div>
      </div>
    );
  }
}
