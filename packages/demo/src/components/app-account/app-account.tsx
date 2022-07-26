import { Component, Host, h } from '@stencil/core';
import { Router } from '../../router';

@Component({
  tag: 'app-account',
})
export class AppAccount {
  render() {
    return (
      <Host>
        <h1>Account</h1>
        <p>{Router.path}</p>
      </Host>
    );
  }
}
