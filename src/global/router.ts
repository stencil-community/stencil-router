import { ActiveRouter, Listener } from './interfaces';

Context.activeRouter = (function() {
  let state: { [key: string]: any } = {};
  const nextListeners: Function[] = [];

  function set(value: { [key: string]: any }) {
    state = {
      ...state,
      ...value
    };
    dispatch();
  }

  function get(attrName?: string) {
    if (!attrName) {
      return state;
    }
    return state[attrName];
  }


  function dispatch() {
    const listeners = nextListeners;
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }


  function subscribe(listener: Function): Listener {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    let isSubscribed = true;

    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  return {
    set,
    get,
    subscribe
  } as ActiveRouter;
})();
