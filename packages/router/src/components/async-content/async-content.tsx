import { Component, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'stencil-async-content'
})
export class AsyncContent {
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
