import { Component, Prop } from '@stencil/core';
import { ActiveRouter, RouterHistory } from '../../global/interfaces';

@Component({
  tag: 'stencil-router-redirect'
})
export default class Redirect {
  @Prop({ context: 'activeRouter' }) activeRouter: ActiveRouter;
  @Prop() url: string;

  componentWillLoad() {
    const history: RouterHistory = this.activeRouter.get('history');
    if (!history) {
      return;
    }
    return history.replace(this.url, {});
  }
}
