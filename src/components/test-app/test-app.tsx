import { Component } from '@stencil/core';

@Component({
  tag: 'test-app'
})
export class TestApp {

  render() {
    return (
      <stencil-router>
        <stencil-route url="/" exact={true} routeRender={
          () => <span>routeRender</span>
        }></stencil-route>

        <stencil-route url="/:test" routeRender={
          (props: { [key: string]: any}) => {
            console.log(props);
          }
        }></stencil-route>

      </stencil-router>
    );
  }
}
