import { Component, Prop } from '@stencil/core';
import { withSubscription } from '../hoc/hoc';
import { router } from '../../stores/router';

@Component({
  tag: 'hoc-test'
})
export class HocTest {
  @Prop() routerData: any = null;

  render() {
    return (
      <span>{this.routerData.message}</span>
    );
  }
}

export const HocTestImp = withSubscription(HocTest, {
  'routerData': router
});
