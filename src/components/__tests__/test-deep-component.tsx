import { Component, Element, Prop } from '@stencil/core';
import injectHistory from '../../global/injectHistory';
import { RouterHistory, LocationSegments } from '../../global/interfaces';

@Component({
  tag: 'test-deep-component'
})
export class TestDeepComponent {

  @Element() blue: HTMLStencilElement;
  @Prop() history: RouterHistory;
  @Prop() location: LocationSegments;

  render() {
    return (
      <div>
        <pre>
          <b>this.history</b>:<br/>
          {JSON.stringify(this.history, null, 2)}
        </pre>
        <pre>
          <b>this.history</b>:<br/>
          {JSON.stringify(this.location, null, 2)}
        </pre>
        <button onClick={() => this.history.push('/')}> Back Home</button>
      </div>
    );
  }
}

injectHistory(TestDeepComponent);
