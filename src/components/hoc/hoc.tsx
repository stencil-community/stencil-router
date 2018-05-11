import { Component, State, Prop } from '@stencil/core';
import { Listener } from '../../global/interfaces';

@Component({
  tag: 'with-subscription'
})
export class HigherOrder {
  @Prop() stores: { [key: string]: any } = {};
  @Prop() tagname: string;

  @State() data: any = {};

  unsubscribeList: Listener[] = [];

  componentWillLoad = function() {
    // subscribe the project's active router and listen
    // for changes. Recompute the match if any updates get
    // pushed
    this.unsubscribeList = Object.keys(this.stores).map((propName: string) => {
      const store = this.stores[propName];
      return store.subscribe(this.handleChange.bind(this, propName));
    });
  }

  componentDidUnload() {
    // be sure to unsubscribe to the router so that we don't
    // get any memory leaks
    this.unsubscribeList.map(unsubscribe => unsubscribe());
  }

  handleChange = (propName: string, data: any) => {
    this.data = {
      [propName]: data,
      ...this.data
    };
  }

  render() {
    const Component = this.tagname;

    if (!Component) {
      return <slot></slot>
    }

    return (
      <Component {...this.data}>
        <slot></slot>
      </Component>
    )
  }
}


export function withSubscription(component: any, Stores: { [key: string]: any }) {
  return ({ children }: { [key: string]: any}) => {

    return (
      <with-subscription tagname={component.is} stores={Stores}>
        { children }
      </with-subscription>
    )
  };
}

interface Store {
  defaultState?: { [key: string]: any },
  [key: string]: any
}

export function createStore(store: Store) {
  let { defaultState, ...storeMethods } = store;
  let internalState = { ...defaultState };
  let listeners: Function[] = [];

  return {
    ...storeMethods,

    subscribe(func: Function): Function {

      listeners.push(func);
      let isSubscribed = true;
      func(internalState);

      return function unsubscribe() {
        if (!isSubscribed) {
          return;
        }

        const index = listeners.indexOf(func);
        listeners.splice(index, 1);

        isSubscribed = false;
      };
    },

    getState() {
      return internalState;
    },

    setState(newState: any) {
      internalState = {
        ...newState
      };
      listeners.forEach(func => func(internalState));
    },
  };
}
