import { Component, Prop, Element, Watch, ComponentInterface } from '@stencil/core';
import ActiveRouter from '../../global/active-router';

/**
  * Updates the document title when found.
  *
  * @name RouteTitle
  * @description
 */
@Component({
  tag: 'stencil-route-title'
})
export class RouteTitle implements ComponentInterface {
  @Element() el!: HTMLStencilElement;
  @Prop() titleSuffix: string = '';
  @Prop() pageTitle: string = '';
  
  @Watch('pageTitle')
  updateDocumentTitle() {
    document.title = `${this.pageTitle}${this.titleSuffix || ''}`;
  }

  componentWillLoad() {
    this.updateDocumentTitle();
  }
}

ActiveRouter.injectProps(RouteTitle, [
  'titleSuffix',
]);
