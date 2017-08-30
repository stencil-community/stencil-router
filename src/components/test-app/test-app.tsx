import { Component } from '@stencil/core';

@Component({
  tag: 'test-app'
})
export class TestApp {

  render() {
    return (
      <stencil-router>
        <stencil-route url="/" exact={true} routeRender={
          (props: { [key: string]: any}) => {
            console.log(props);
            return <span>rendering /</span>
          }
        }></stencil-route>

        <stencil-route url="/demo" exact={true} routeRender={
          (props: { [key: string]: any}) => {
            console.log(props);
            return <span>rendering /demo</span>
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

      </stencil-router>
    );
  }
}
