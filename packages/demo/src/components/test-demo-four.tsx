import { Component, Prop } from '@stencil/core';
import { RouterHistory, MatchResults } from '../../global/interfaces';

@Component({
  tag: 'test-demo-four'
})
export class TestDemoFour {

  @Prop() pages: string[];
  @Prop() match: MatchResults;
  @Prop() history: RouterHistory;

  handleClick(e: MouseEvent, linkLocation: string) {
    e.preventDefault();
    this.history.push(linkLocation, { 'blue': 'blue'});
  }

  componentDidLoad() {
    console.log('demoFour DidLoad');
  }

  render() {
    const linkLocation = '/demo3/page1';

    return (
      <div>
        <a href={linkLocation} onClick={(e) => this.handleClick(e, linkLocation)}>
          History push to {linkLocation}
        </a>
        <pre>
          <b>this.pages</b>:<br/>
          {JSON.stringify(this.pages, null, 2)}
        </pre>
        <pre>
          <b>this.match</b>:<br/>
          {JSON.stringify(this.match, null, 2)}
        </pre>
        <test-deep-component/>
      </div>
    );
  }
}
