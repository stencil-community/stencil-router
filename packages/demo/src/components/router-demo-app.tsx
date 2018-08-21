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
        <stencil-route-switch>
          <stencil-route url="/" exact={true} routeRender={
            (props: { [key: string]: any}) => {
              props;
              return <span>rendering /</span>;
            }
          }></stencil-route>

          <stencil-route url={['/demo', '/demox']} routeRender={
            (props: { [key: string]: any}) => {
              props;
              return (
                <div>
                  <stencil-route-title title="DEMO"></stencil-route-title>
                  <span>rendering /demo</span>
                  <li><stencil-route-link url="/demo3">Demo3 Link</stencil-route-link></li>
                </div>
              );
            }
          }></stencil-route>

          <stencil-route url="/demo2" routeRender={
            (props: { [key: string]: any}) => {
              props;
              return [
                <span>rendering /demo2</span>,
                <stencil-router-redirect url="/demo3" />
              ];
            }
          }></stencil-route>

          <stencil-route
            url="/demo3"
            component="test-demo-three"
          ></stencil-route>

          <stencil-route
            url="/demo4"
            component="test-demo-four"
          ></stencil-route>

          <stencil-route url="/demo5" component="async-content" componentProps={{ location: '/' }}></stencil-route>

          <stencil-route url="/demo6" component="test-demo-six"></stencil-route>

          <PrivateRoute url="/demo7" component="test-demo-six" componentProps={{ testing: true }}></PrivateRoute>

          <stencil-route url="/demo8" routeRender={
            (props: { [key: string]: any}) => {
              props;
              return [
                <stencil-route-title title="Demo 8"></stencil-route-title>,
                <span>rendering /demo 8</span>
              ]
            }
          }></stencil-route>

          <stencil-route routeRender={
            () => {
              return <span>The route is not found</span>;
            }
          }></stencil-route>
        </stencil-route-switch>
      </stencil-router>
    );
  }
}
