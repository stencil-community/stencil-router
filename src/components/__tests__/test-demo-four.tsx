import { Component, Prop } from '@stencil/core';
import RouterDetails, { RenderProps } from '../../components/router/routerDetails';

@Component({
  tag: 'test-demo-four'
})
export class TestDemoFour {

  @Prop() pages: string[];

  handleClick(e: MouseEvent, linkLocation: string, history: any) {
    e.preventDefault();
    history.push(linkLocation, { 'blue': 'blue'});
  }

  render() {
    const linkLocation = '/demo3/page1';

    return (
      <RouterDetails>
        {({ match, history }: RenderProps) => (
        <div>
          <a href={linkLocation} onClick={(e) => this.handleClick(e, linkLocation, history)}>
            History push to {linkLocation}
          </a>
          <pre>
            <b>this.pages</b>:<br/>
            {JSON.stringify(this.pages, null, 2)}
          </pre>
          <pre>
            <b>this.match</b>:<br/>
            {JSON.stringify(match, null, 2)}
          </pre>
          <pre>
            <b>this.history.location</b>:<br/>
            {JSON.stringify(history.location, null, 2)}
          </pre>
        </div>
        )}
      </RouterDetails>
    );
  }
}
