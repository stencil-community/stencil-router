import { Component } from '@stencil/core';

@Component({
  tag: 'test-app'
})
export class TestApp {

  render() {
    return (
      <stencil-router>
        <ul>
          <li><stencil-route-link url="/" exact={true}>Exact Base Link</stencil-route-link></li>
          <li><stencil-route-link url="/">Base Link</stencil-route-link></li>
          <li><stencil-route-link url="/demo">Demo Link</stencil-route-link></li>
          <li><stencil-route-link url="/demo2">Demo2 Link</stencil-route-link></li>
          <li><stencil-route-link url="/demo3">Demo3 Link</stencil-route-link></li>
          <li><stencil-route-link url="/demo3/page1">Demo3 Page1 Link</stencil-route-link></li>
          <li><stencil-route-link url="/demo3/page2">Demo3 Page2 Link</stencil-route-link></li>
          <li><stencil-route-link url="/demo4">Demo4 Link</stencil-route-link></li>
        </ul>

        <stencil-route url="/" exact={true} routeRender={
          (props: { [key: string]: any}) => {
            console.log(props);
            return <span>rendering /</span>;
          }
        }></stencil-route>

        <stencil-route url="/demo" exact={true} routeRender={
          (props: { [key: string]: any}) => {
            console.log(props);
            return <span>rendering /demo</span>;
          }
        }></stencil-route>

        <stencil-route url="/demo2" exact={true} routeRender={
          (props: { [key: string]: any}) => {
            console.log(props);
            return [
              <span>rendering /demo2</span>,
              <stencil-router-redirect url="/demo3" />
            ];
          }
        }></stencil-route>

        <stencil-route url="/demo3" exact={true} routeRender={
          (props: { [key: string]: any}) => {
            console.log(props);
            return <span>rendering /demo 3</span>
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

      </stencil-router>
    );
  }
}
