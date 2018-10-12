import { Component } from '@stencil/core';

@Component({
  tag: 'test-demo-eight'
})
export class TestDemoEight {

  render() {
    return (
      <div>
        <h1>Deep Component Test</h1>
        <test-deep-component></test-deep-component>
      </div>
    );
  }
}
