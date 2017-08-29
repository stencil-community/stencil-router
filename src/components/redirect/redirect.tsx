import { Component, Prop } from '@stencil/core';
import { ActiveRouter } from '../../global/interfaces';

@Component({
  tag: 'stencil-router-redirect'
})
export class Redirect {
  @Prop({ context: 'activeRouter' }) activeRouter: ActiveRouter;
  @Prop() url: string;

  componentWillLoad() {
    this.activeRouter.get('history').navigateTo(this.url);
  }
}
