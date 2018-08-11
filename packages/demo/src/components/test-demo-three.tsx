import { Component, Prop } from '@stencil/core';
import { RouterHistory, MatchResults } from '../../global/interfaces';

@Component({
  tag: 'test-demo-three'
})
export class TestDemoThree {

  @Prop() pages: string[];
  @Prop() match: MatchResults;
  @Prop() history: RouterHistory;

  render() {
    return [
      <span>Demo 3 Test Page<br/></span>,
      <stencil-route url="/demo3/page1" exact={true} routeRender={
        (props: { [key: string]: any}) => {
          props;
          return [
            <a href="#" onClick={(e) => {
              e.preventDefault();
              this.history.push('/demo3/page2', { 'blue': 'blue' });
            }}>
              History push to /demo3/page2
            </a>,
            <pre>
              <b>props.pages</b>:<br/>
              {JSON.stringify(this.pages, null, 2)}
            </pre>,
            <pre>
              <b>props.match</b>:<br/>
              {JSON.stringify(this.match, null, 2)}
            </pre>,
            <pre>
              <b>props.history.location</b>:<br/>
              {JSON.stringify(this.history.location, null, 2)}
            </pre>,
            <pre>
              <b>props.history.location.state</b>:<br/>
              {JSON.stringify(this.history.location.state, null, 2)}
            </pre>,
          ];
        }
      }></stencil-route>,

      <stencil-route url="/demo3/page2" exact={true} routeRender={
        (props: { [key: string]: any}) => {
          props;
          return [
            <a href="#" onClick={(e) => {
              e.preventDefault();
              this.history.push('/demo3/page1', { 'red': 'red' });
            }}>
              History push to /demo3/page1
            </a>,
            <pre>
              <b>props.pages</b>:<br/>
              {JSON.stringify(this.pages, null, 2)}
            </pre>,
            <pre>
              <b>props.match</b>:<br/>
              {JSON.stringify(this.match, null, 2)}
            </pre>,
            <pre>
              <b>props.history.location</b>:<br/>
              {JSON.stringify(this.history.location, null, 2)}
            </pre>
          ];
        }
      }></stencil-route>
    ];
  }
}
