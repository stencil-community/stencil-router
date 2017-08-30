import { Component } from '@stencil/core';

@Component({
  tag: 'test-page'
})
export class TestPage {

  render() {
    return [
      <span>Demo 3 Test Page<br/></span>,
      <stencil-route url="/demo3/page1" exact={true} routeRender={
        (props: { [key: string]: any}) => {
          console.log(props);
          return <span>rendering /demo3/page1</span>
        }
      }></stencil-route>,

      <stencil-route url="/demo3/page2" exact={true} routeRender={
        (props: { [key: string]: any}) => {
          console.log(props);
          return <span>rendering /demo3/page2</span>
        }
      }></stencil-route>
    ];
  }
}
