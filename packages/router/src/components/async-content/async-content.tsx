import { Component, Prop, State, Watch, ComponentInterface } from '@stencil/core';

@Component({
  tag: 'stencil-async-content'
})
export class AsyncContent implements ComponentInterface {
  @Prop() documentLocation: string;
  @State() content: string;

  componentWillLoad() {
    return this.fetchNewContent();
  }

  @Watch('documentLocation')
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
