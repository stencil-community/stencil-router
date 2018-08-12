import { Component, Prop } from '@stencil/core';
import { RouterHistory, MatchResults } from '@stencil/router';

@Component({
  tag: 'test-demo-seven'
})
export class TestDemoSeven {

  @Prop() pages: string[];
  @Prop() match: MatchResults;
  @Prop() history: RouterHistory;

  componentWillLoad() {
    console.log(`%c test-demo-seven - componentWillLoad`, 'color: red');
  }
  componentDidLoad() {
    console.log(`%c test-demo-seven - componentDidLoad`, 'color: orange');
  }
  componentWillUpdate() {
    console.log(`%c test-demo-seven - componentWillUpdate`, 'color: green');
  }
  componentDidUpdate() {
    console.log(`%c test-demo-seven - componentDidUpdate`, 'color: blue');
  }

  render() {

    return (
      <div>
        <h1>Test Demo Seven</h1>
        <pre>
          <b>this.pages</b>:<br/>
          {JSON.stringify(this.pages, null, 2)}
        </pre>
        <pre>
          <b>this.match</b>:<br/>
          {JSON.stringify(this.match, null, 2)}
        </pre>
      </div>
    );
  }
}
