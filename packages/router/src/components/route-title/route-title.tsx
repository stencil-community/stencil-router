import { Component, Prop, Element, ComponentInterface } from '@stencil/core';
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
  @Prop() pageTitleSuffix: string = '';
  @Prop() pageTitle: string = '';

  componentWillLoad() {
    document.title = `${this.pageTitle}${this.pageTitleSuffix || ''}`;
  }
}

ActiveRouter.injectProps(RouteTitle, [
  'titleSuffix',
]);
