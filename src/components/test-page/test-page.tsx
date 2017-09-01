import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'test-page'
})
export class TestPage {

  @Prop() pages: string[];

  render() {
    return [
      <span>Demo 3 Test Page<br/></span>,
      <stencil-route url="/demo3/page1" exact={true} routeRender={
        (props: { [key: string]: any}) => {
          console.log(props);
          return [
            <a href="#" onClick={(e) => {
              e.preventDefault();
              props.history.push('/demo3/page2', { 'blue': 'blue' });
            }}>
              History push to /demo3/page2
            </a>,
            <br/>,
            <span>rendering /demo3/page1</span>
          ];
        }
      }></stencil-route>,

      <stencil-route url="/demo3/page2" exact={true} routeRender={
        (props: { [key: string]: any}) => {
          console.log(props);
          return [
            <a href="#" onClick={(e) => {
              e.preventDefault();
              props.history.push('/demo3/page1', { 'red': 'red' });
            }}>
              History push to /demo3/page1
            </a>,
            <br/>,
            <span>rendering /demo3/page2</span>
          ];
        }
      }></stencil-route>
    ];
  }
}
