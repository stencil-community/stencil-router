import { Component } from '@stencil/core';


const PrivateRoute = ({ component, ...props}: { [key: string]: any}) => (
  <stencil-route {...props} routeRender={
    (props: { [key: string]: any}) => {
      if ((window as any).userAuthenticated) {
        const Component = component;
        return <Component {...props.componentProps}></Component>;
      }
      return <stencil-router-redirect url="/"></stencil-router-redirect>
    }
  }/>
)


@Component({
  tag: 'test-app'
})
export class TestApp {

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
          <li><stencil-route-link url="/demo6/">Demo6 Link</stencil-route-link></li>
          <li><stencil-route-link url="/demo7/">Demo7 Link</stencil-route-link></li>
        </ul>

        <stencil-route url="/" exact={true} routeRender={
          (props: { [key: string]: any}) => {
            return <span>rendering /</span>;
          }
        }></stencil-route>

        <stencil-route url={['/demo', '/demox']} exact={true} routeRender={
          (props: { [key: string]: any}) => {
            return [
              <stencil-route-title title="DEMO"></stencil-route-title>,
              <span>rendering /demo</span>
            ]
          }
        }></stencil-route>

        <stencil-route url="/demo2" exact={true} routeRender={
          (props: { [key: string]: any}) => {
            return [
              <span>rendering /demo2</span>,
              <stencil-router-redirect url="/demo3" />
            ];
          }
        }></stencil-route>

        <stencil-route url="/demo3" exact={true} routeRender={
          (props: { [key: string]: any}) => {
            return [
              <stencil-route-title title="Demo 3"></stencil-route-title>,
              <span>rendering /demo 3</span>
            ]
          }
        }></stencil-route>

        <stencil-route
          url="/demo3"
          componentProps={{
            pages: ['intro/index.html']
          }}
          component="test-demo-three"
        ></stencil-route>

        <stencil-route
          url="/demo4"
          component="test-demo-four"
        ></stencil-route>

        <stencil-route url="/demo5" component="async-content" componentProps={{ location: '/' }}></stencil-route>

        <stencil-route url="/demo6" component="test-demo-six"></stencil-route>

        <PrivateRoute url="/demo7" component="test-demo-six" componentProps={{ testing: true }}></PrivateRoute>
      </stencil-router>
    );
  }
}
