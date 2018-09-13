import { Component } from '@stencil/core';

const PrivateRoute = ({ component, ...props}: { [key: string]: any}) => (
  <stencil-route {...props} routeRender={
    (props: { [key: string]: any}) => {
      if ((window as any).userAuthenticated) {
        const Component = component;
        return <Component {...props} {...props.componentProps}></Component>;
      }
      return <stencil-router-redirect url="/"></stencil-router-redirect>
    }
  }/>
)


@Component({
  tag: 'router-demo-app'
})
export class RouterDemoApp {

  render() {
    return (
      <stencil-router title-suffix=" - Stencil Router Demos">
        <ul>
          <li><stencil-route-link url="/" exact={true}>Exact Base Link</stencil-route-link></li>
          <li><stencil-route-link url="/">Base Link</stencil-route-link></li>
          <li><stencil-route-link url="/demo" urlMatch={['/demo', '/demox']} exact={true}>Demo Link</stencil-route-link></li>
          <li><stencil-route-link url="/demo2">Demo2 Link</stencil-route-link></li>
          <li><stencil-route-link url="/demo3">Demo3 Link</stencil-route-link></li>
          <li><stencil-route-link url="/demo3/page1">Demo3 Page1 Link</stencil-route-link></li>
          <li><stencil-route-link url="/demo3/page2">Demo3 Page2 Link</stencil-route-link></li>
          <li><stencil-route-link url="/demo4">Demo4 Link</stencil-route-link></li>
          <li><stencil-route-link anchorClass="what" url="/demo6/">Demo6 Link</stencil-route-link></li>
          <li><stencil-route-link anchorTabIndex="1" url="/demo7/">Demo7 Link</stencil-route-link></li>
          <stencil-route-link custom="li" url="/demo8/">Demo8 Link</stencil-route-link>
        </ul>
        <div class="hold-routes">
          <stencil-route-switch>
            <stencil-route url="/" exact={true} routeRender={() =>
              <div class="content-holder">
                <span>rendering /</span>;
              </div>
            }></stencil-route>

            <stencil-route url={['/demo', '/demox']} routeRender={() =>
              <div class="content-holder">
                <stencil-route-title title="DEMO"></stencil-route-title>
                <span>rendering /demo</span>
                <li><stencil-route-link url="/demo3">Demo3 Link</stencil-route-link></li>
              </div>
            }></stencil-route>

            <stencil-route url="/demo2" routeRender={() =>
              <div class="content-holder">
                <span>rendering /demo2</span>,
                <stencil-router-redirect url="/demo3" />
              </div>
            }></stencil-route>

            <stencil-route url="/demo3" routeRender={(props) =>
              <div class="content-holder">
                <test-demo-three {...props}></test-demo-three>
              </div>
            }></stencil-route>

            <stencil-route url="/demo4" routeRender={(props) =>
              <div class="content-holder">
                <test-demo-four {...props}></test-demo-four>
              </div>
            }></stencil-route>

            <stencil-route url="/demo5" routeRender={(props) =>
              <div class="content-holder">
                <async-content {...props} location="/"></async-content>
              </div>
            }></stencil-route>

            <stencil-route url="/demo6" routeRender={(props) =>
              <div class="content-holder">
                <test-demo-six {...props}></test-demo-six>
              </div>
            }></stencil-route>

            <PrivateRoute url="/demo7" routeRender={(props) =>
              <div class="content-holder">
                <test-demo-six {...props} testing={true}></test-demo-six>
              </div>
            }></PrivateRoute>

            <stencil-route url="/demo8" routeRender={() =>
              <div class="content-holder">
                <stencil-route-title title="Demo 8"></stencil-route-title>,
                <span>rendering /demo 8</span>
              </div>
            }></stencil-route>

            <stencil-route routeRender={() =>
              <div>
                <span>The route is not found</span>
              </div>
            }></stencil-route>

          </stencil-route-switch>
        </div>
      </stencil-router>
    );
  }
}
