import { Component, Prop, Element } from '@stencil/core';
import { RouterHistory } from '../../global/interfaces';
import ActiveRouter from '../../global/active-router';

@Component({
  tag: 'stencil-router-redirect'
})
export class Redirect {
  @Element() el: HTMLStencilElement;

  @Prop() history: RouterHistory = null;
  @Prop() root: string = null;

  @Prop() url: string;

  componentWillLoad() {
    return this.history.replace(this.getUrl(this.url));
  }

  // Get the URL for this route link without the root from the router
  getUrl(url: string) {
    // Don't allow double slashes
    if(url.charAt(0) == '/' && this.root.charAt(this.root.length - 1) == '/') {
      return this.root.slice(0, this.root.length-1) + url;
    }
    return this.root + url;
  }
}

ActiveRouter.injectProps(Redirect, [
  'history',
  'root'
]);
