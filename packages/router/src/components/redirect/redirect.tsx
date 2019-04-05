import { Component, Prop, Element, ComponentInterface } from '@stencil/core';
import { RouterHistory } from '../../global/interfaces';
import ActiveRouter from '../../global/active-router';

// Get the URL for this route link without the root from the router
function getUrl(url: string, root: string) {
  // Don't allow double slashes
  if(url.charAt(0) == '/' && root.charAt(root.length - 1) == '/') {
    return root.slice(0, root.length-1) + url;
  }
  return root + url;
}

@Component({
  tag: 'stencil-router-redirect'
})
export class Redirect implements ComponentInterface {
  @Element() el!: HTMLElement;

  @Prop() history?: RouterHistory;
  @Prop() root?: string;

  @Prop() url?: string;

  componentWillLoad() {
    if (this.history && this.root && this.url) {
      return this.history.replace(getUrl(this.url, this.root));
    }
  }
}

ActiveRouter.injectProps(Redirect, [
  'history',
  'root'
]);
