import { Component, Prop, Element, Watch, ComponentInterface, getDocument } from '@stencil/core';
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
  doc = getDocument(this);
  @Element() el!: HTMLElement;
  @Prop() titleSuffix: string = '';
  @Prop() pageTitle: string = '';

  @Watch('pageTitle')
  updateDocumentTitle() {
    this.doc.title = `${this.pageTitle}${this.titleSuffix || ''}`;
  }

  componentWillLoad() {
    this.updateDocumentTitle();
  }
}

ActiveRouter.injectProps(RouteTitle, [
  'titleSuffix',
]);
