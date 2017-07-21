import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'stencil-router-redirect'
})
export class Redirect {
  @Prop() router: any;

  @Prop() url: string;

  componentWillLoad() {
    const router = document.querySelector(this.router);
    router.navigateTo(this.url);
  }
}
