import { Component, Element, Prop } from '@stencil/core';
import { RouterHistory, LocationSegments, injectHistory } from '@stencil/router';

@Component({
  tag: 'test-deep-component'
})
export class TestDeepComponent {

  @Element() el!: HTMLStencilElement;
  @Prop() history?: RouterHistory;
  @Prop() location?: LocationSegments;

  componentDidUpdate() {
    console.log('deepchild DidUpdate');
  }

  render() {
    return (
      <div>
        <pre>
          <b>this.history</b>:<br/>
          {JSON.stringify(this.history, null, 2)}
        </pre>
        <pre>
          <b>this.location</b>:<br/>
          {JSON.stringify(this.location, null, 2)}
        </pre>
        <button onClick={() => this.history ? this.history.push('/') : null}> Back Home</button>
      </div>
    );
  }
}

injectHistory(TestDeepComponent);
