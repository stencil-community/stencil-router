import { Component, Prop } from '@stencil/core';
import { ActiveRouter, RouterHistory } from '../../global/interfaces';

@Component({
  tag: 'stencil-router-scroll-top'
})
export class Redirect {
  @Prop({ context: 'activeRouter' }) activeRouter: ActiveRouter;
  @Prop() topOffset: number = 0;

  componentDidLoad() {
    const history: RouterHistory = this.activeRouter.get('history');
    if (!history || history.action === 'POP') {
      return;
    }
    window.scrollTo(0, this.topOffset);
  }

  render() {
    return <slot/>;
  }
}
