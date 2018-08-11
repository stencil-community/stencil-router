import uuidv4 from '../../utils/uuid';
import { Component, Prop, Element, Watch } from '@stencil/core';
import { QueueApi } from '@stencil/core/dist/declarations';
import { LocationSegments, MatchResults, RouteViewOptions } from '../../global/interfaces';
import ActiveRouter from '../../global/active-router';
import { matchPath } from '../../utils/match-path';

interface Child {
  el: HTMLStencilRouteElement,
  match: MatchResults
}
type ComponentUpdatedResolve = (options: RouteViewOptions) => void;

function getUniqueId() {
  if (window.crypto) {
    return uuidv4();
  }
  return (Math.random() * 10e16).toString().match(/.{4}/g).join('-');
}

function getMatch(pathname: string, url: any, exact: boolean) {
  return matchPath(pathname, {
    path: url,
    exact: exact,
    strict: true
  });
}

@Component({
  tag: 'stencil-route-switch'
})
export class RouteSwitch {
  @Prop({ context: 'queue'}) queue: QueueApi;
  @Element() el: HTMLStencilElement;
  @Prop({reflectToAttr: true}) group: string = getUniqueId();
  @Prop() scrollTopOffset: number = null;
  @Prop() location: LocationSegments;
  @Prop() routeViewsUpdated: (options: RouteViewOptions) => void;

  activeIndex: number = null;
  subscribers: Child[];

  componentWillLoad() {
    this.regenerateSubscribers(this.location);
  }

  @Watch('location')
  async regenerateSubscribers(newLocation: LocationSegments) {
    let newActiveIndex: number = null;
    this.subscribers = Array.from(this.el.children)
      .map((childElement: HTMLStencilRouteElement, index): Child => {
        const match = getMatch(newLocation.pathname, childElement.url, childElement.exact);

        if (match && newActiveIndex === null) {
          newActiveIndex = index;
        }
        return {
          el: childElement,
          match: match
        };
      });

    // Check if this actually changes which child is active
    // then just pass the new match down if the active route isn't changing.
    if (this.activeIndex === newActiveIndex) {
      this.subscribers[this.activeIndex].el.groupMatch = this.subscribers[this.activeIndex].match;
      return;
    }
    this.activeIndex = newActiveIndex;

    // Set all props on the new active route then wait until it says that it
    // is completed
    new Promise((resolve: ComponentUpdatedResolve) => {
      const activeChild = this.subscribers[this.activeIndex];
      activeChild.el.scrollTopOffset = this.scrollTopOffset;
      activeChild.el.group = this.group;
      activeChild.el.groupMatch = activeChild.match;
      activeChild.el.componentUpdated = resolve;
    })
    .then((routeViewUpdatedOptions: RouteViewOptions) => {
      // After the new active route has completed then update visibility of routes
      this.queue.write(() => {
        this.subscribers.forEach((child, index) => {
          child.el.componentUpdated = null;

          if (index === this.activeIndex) {
            return child.el.style.display = null;
          }

          child.el.scrollTopOffset = this.scrollTopOffset;
          child.el.group = this.group;
          child.el.groupMatch = null;
          child.el.style.display = 'none';
        });
      });

      this.routeViewsUpdated({
        scrollTopOffset: this.scrollTopOffset,
        ...routeViewUpdatedOptions
      });
    });
  }

  render() {
    return (
      <slot/>
    );
  }
}

ActiveRouter.injectProps(RouteSwitch, [
  'location',
  'routeViewsUpdated'
]);
