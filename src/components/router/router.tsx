import {
  Component,
  Prop,
  Element
} from '@stencil/core';
import createHistory from '../../utils/history';

/**
  * @name Router
  * @module ionic
  * @description
 */
@Component({
  tag: 'stencil-router'
})
export class Router {
  @Element() el: HTMLElement;

  base: string;

  @Prop() root: string = '/';
  @Prop({ context: 'activeRouter' }) activeRouter: any;

  componentWillLoad() {
    const history = createHistory();
    this.activeRouter.set({
      location,
      history: history
    });
  }

  computeMatch(pathname) {
    return {
      path: '/',
      url: '/',
      params: {},
      isExact: pathname === '/'
    };
  }

  render() {
    return <slot />;
  }
}
