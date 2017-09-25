import { Component, Prop, PropDidChange, State } from '@stencil/core';

@Component({
  tag: 'stencil-async-content'
})
export class AsyncContent {
  @Prop() documentLocation: string;
  @State() content: string;

  ionViewWillLoad() {
    return this.fetchNewContent();
  }

  @PropDidChange('doc')
  fetchNewContent() {
    return fetch(this.documentLocation)
      .then(response => response.text())
      .then(data => {
        this.content = data;
      });
  }

  render() {
    return (
      <div innerHTML={this.content}></div>
    );
  }
}
