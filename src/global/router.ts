import { ActiveRouter, Listener } from './interfaces';

Context.activeRouter = (function() {
  let state: { [key: string]: any } = {};
  const nextListeners: Function[] = [];

  function getDefaultState() {
    return {
      location: {
        pathname: Context.window.location.pathname,
        search: Context.window.location.search
      }
    };
  }

  function set(value: { [key: string]: any }) {
    state = {
      ...state,
      ...value
    };
    dispatch();
  }

  function get(attrName?: string) {
    if (Object.keys(state).length === 0) {
      return getDefaultState();
    }
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
