import { Component, Prop } from '@stencil/core';
import { RouterHistory, MatchResults } from '../../global/interfaces';

@Component({
  tag: 'test-demo-seven'
})
export class TestDemoSeven {

  @Prop() pages: string[];
  @Prop() match: MatchResults;
  @Prop() history: RouterHistory;

  render() {
    return [
      <span>Demo 7 Test Page<br/></span>,
      <stencil-route url="/demo7/" exact={true} group="main" routeRender={
        (props: { [key: string]: any}) => {
          return [
            <h1>One</h1>,
            <stencil-route-link url="/demo7/asdf">Next</stencil-route-link>
          ];
        }
      }></stencil-route>,
      <stencil-route url="/demo7/:any*" group="main" routeRender={
        (props: { [key: string]: any}) => {
          return [
            <h1>Two: {props.match}</h1>,
            <stencil-route-link url="/demo7/">Back</stencil-route-link>
          ];
        }
      }></stencil-route>
    ]
  }
}
