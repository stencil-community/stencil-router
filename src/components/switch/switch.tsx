import uuidv4 from '../../utils/uuid';
import { Component, Prop, Element } from '@stencil/core';
import ActiveRouter from '../../global/active-router';

function getUniqueId() {
  if (window.crypto) {
    return uuidv4();
  }
  return (Math.random() * 10e16).toString();
}

@Component({
  tag: 'stencil-route-switch'
})
export class RouteSwitch {
  @Element() el: HTMLStencilElement;
  @Prop() group: string = getUniqueId();
  @Prop() createSubscriptionGroup: (groupId: string, groupSize: number) => void;

  componentWillLoad() {
    const childArray = Array.from(this.el.children);
    this.createSubscriptionGroup(this.group, childArray.length);

    childArray.forEach((childElement: HTMLStencilRouteElement, index: number) => {
      childElement.group = this.group;
      childElement.groupIndex = index;
    });
  }

  hostData() {
    this.el.setAttribute('group', this.group);
  }

  render() {
    return (
      <slot/>
    );
  }
}

ActiveRouter.injectProps(RouteSwitch, [
  'createSubscriptionGroup'
]);
