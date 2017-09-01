import { Component, Prop } from '@stencil/core';
import { RouterHistory, MatchResults } from '../../global/interfaces';

@Component({
  tag: 'test-demo-four'
})
export class TestDemoFour {

  @Prop() pages: string[];
  @Prop() match: MatchResults;
  @Prop() history: RouterHistory;

  handleClick(e: MouseEvent) {
    e.preventDefault();
    const link = e.currentTarget as HTMLAnchorElement;
debugger;
    this.history.push(link.href, { 'blue': 'blue'});
  }

  render() {
    console.log('pages: ', this.pages);
    console.log('match: ', this.match);
    console.log('history: ', this.history.location);

    const linkLocation = '/demo3/page1';

    return (
      <div>
        <a href={linkLocation} onClick={(e) => this.handleClick(e)}>
          History push to /demo3/page2
        </a>
        <pre>
          <b>this.pages</b>:<br/>
          {JSON.stringify(this.pages, null, 2)}
        </pre>
        <pre>
          <b>this.match</b>:<br/>
          {JSON.stringify(this.match, null, 2)}
        </pre>
        <pre>
          <b>this.history.location</b>:<br/>
          {JSON.stringify(this.history.location, null, 2)}
        </pre>
      </div>
    );
  }
}
