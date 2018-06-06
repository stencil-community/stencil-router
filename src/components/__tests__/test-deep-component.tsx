import { Component, Element, Prop } from '@stencil/core';
import injectHistory from '../../global/injectHistory';
import { RouterHistory } from '../../global/interfaces';

@Component({
  tag: 'test-deep-component'
})
export class TestDeepComponent {

  @Element() el: HTMLStencilElement;
  @Prop() history: RouterHistory;

  render() {
    return (
      <div>
        <pre>
          <b>this.history</b>:<br/>
          {JSON.stringify(this.history, null, 2)}
        </pre>
        <button onClick={() => this.history.push('/')}> Back Home</button>
      </div>
    );
  }
}

injectHistory(TestDeepComponent);
