import { Component, Prop } from '@stencil/core';
import { RouterHistory, MatchResults } from '@stencil/router';

@Component({
  tag: 'test-demo-six'
})
export class TestDemoSix {

  @Prop() pages: string[];
  @Prop() match: MatchResults;
  @Prop() history: RouterHistory;

  render() {
    return [
      <span>Demo 6 Test Page<br/></span>,
      <stencil-route url="/demo6/" exact={true} group="main" routeRender={
        (props: { [key: string]: any}) => {
          props;
          return [
            <h1>One</h1>,
            <stencil-route-link url="/demo6/asdf">Next</stencil-route-link>
          ];
        }
      }></stencil-route>,
      <stencil-route url="/demo6/:any*" group="main" routeRender={
        (props: { [key: string]: any}) => {
          return [
            <h1>Two: {props.match}</h1>,
            <stencil-route-link url="/demo6/">Back</stencil-route-link>
          ];
        }
      }></stencil-route>
    ]
  }
}
