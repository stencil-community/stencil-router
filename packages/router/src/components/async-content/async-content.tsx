import { Component, Prop, State, Watch, ComponentInterface, h } from '@stencil/core';

@Component({
  tag: 'stencil-async-content'
})
export class AsyncContent implements ComponentInterface {
  @Prop() documentLocation?: string;
  @State() content: string = '';

  componentWillLoad() {
    if (this.documentLocation != null) {
      return this.fetchNewContent(this.documentLocation);
    }
  }

  @Watch('documentLocation')
  fetchNewContent(newDocumentLocation: string) {
    return fetch(newDocumentLocation)
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
