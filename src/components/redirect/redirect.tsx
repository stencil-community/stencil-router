import { Component, Prop } from '@stencil/core';
import { ActiveRouter, RouterHistory } from '../../global/interfaces';

@Component({
  tag: 'stencil-router-redirect'
})
export class Redirect {
  @Prop({ context: 'activeRouter' }) activeRouter: ActiveRouter;
  @Prop() url: string;

  componentWillLoad() {
    const history: RouterHistory = this.activeRouter.get('history');
    if (!history) {
      return;
    }
    return history.replace(this.getUrl(this.url));
  }

  // Get the URL for this route link without the root from the router
  getUrl(url: string) {
    const root: string = this.activeRouter.get('root') || '/';

    // Don't allow double slashes
    if(url.charAt(0) == '/' && root.charAt(root.length - 1) == '/') {
      return root.slice(0, root.length-1) + url;
    }
    return root + url;
  }
}
