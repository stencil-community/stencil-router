import { Component, Prop, Element } from '@stencil/core';
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
export class RouteTitle {
  @Element() el: HTMLStencilElement;
  @Prop() titleSuffix: string = '';
  @Prop() title: string = '';

  componentWillLoad() {
    document.title = `${this.title}${this.titleSuffix || ''}`;
  }
}

ActiveRouter.injectProps(RouteTitle, [
  'titleSuffix',
]);
