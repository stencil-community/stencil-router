import { ActiveRouter, Listener } from './interfaces';

declare var Context: any;

Context.activeRouter = (function() {
  let state: { [key: string]: any } = {};
  let groups: { [key: string]: any[] } = {};
  let matchedGroups: { [key: string]: boolean } = {};
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
    clearGroups();
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

  /**
   *  When we get a new location, clear matching groups
   *  so we give them a chance to re-match and re-render.
   */
  function clearGroups() {
    matchedGroups = {};
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

  /**
   * Remove a Route from all groups
   */
  function removeFromGroups(route: any) {
    for(let groupName in groups) {
      const group = groups[groupName];
      groups[groupName] = group.filter(r => r !== route);
    }
  }

  /**
   * Add a Route to the given group
   */
  function addToGroup(route: any, groupName: string) {
    if (!(groupName in groups)) {
      groups[groupName] = [];
    } 
    groups[groupName].push(route);
  }

  /**
   * Check if a group already matched once
   */
  function didGroupAlreadyMatch(groupName: string) {
    if (!groupName) { return false; }
    return matchedGroups[groupName] === true;
  }

  /**
   * Set that a group has matched
   */
  function setGroupMatched(groupName: string) {
    matchedGroups[groupName] = true;
  }

  return {
    set,
    get,
    subscribe,
    addToGroup,
    removeFromGroups,
    didGroupAlreadyMatch,
    setGroupMatched
  } as ActiveRouter;
})();
