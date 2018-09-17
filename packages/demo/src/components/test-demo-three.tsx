import { Component, Prop } from '@stencil/core';
import { RouterHistory, MatchResults } from '@stencil/router';

@Component({
  tag: 'test-demo-three'
})
export class TestDemoThree {

  @Prop() pages?: string[];
  @Prop() match: MatchResults | null = null;
  @Prop() history?: RouterHistory;

  pushToPage = (url: string, state: any) => (e: Event) => {
    e.preventDefault();
    this.history ? this.history.push(url, state) : null;
  }

  render() {
    if (this.history == null) {
      return;
    }
    return [
      <span>Demo 3 Test Page<br/></span>,
      <stencil-route url="/demo3/page1" exact={true} routeRender={() =>
        <div>
          <a href="/demo3/page2" onClick={this.pushToPage('/demo3/page2', { 'blue': 'blue' })}>
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
            {JSON.stringify(this.history ? this.history.location: {}, null, 2)}
          </pre>,
          <pre>
            <b>props.history.location.state</b>:<br/>
            {JSON.stringify(this.history ? this.history.location.state: {}, null, 2)}
          </pre>
        </div>
      }></stencil-route>,

      <stencil-route url="/demo3/page2" exact={true} routeRender={() =>
        <div>
          <a href="/demo3/page1" onClick={this.pushToPage('/demo3/page1', { 'red': 'red' })}>
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
            {JSON.stringify(this.history ? this.history.location: {}, null, 2)}
          </pre>
        </div>
      }></stencil-route>
    ];
  }
}
