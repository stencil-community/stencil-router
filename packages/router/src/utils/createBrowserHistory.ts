// Adapted from the https://github.com/ReactTraining/history and converted to TypeScript

import { createLocation, createKey } from './location-utils';
import { RouterHistory, LocationSegments, Prompt } from '../global/interfaces';
import { warning } from './log';
import {
  addLeadingSlash,
  stripTrailingSlash,
  hasBasename,
  stripBasename,
  createPath
} from './path-utils';
import createTransitionManager from './createTransitionManager';
import createScrollHistory from './createScrollHistory';
import {
  getConfirmation,
  supportsHistory,
  supportsPopStateOnHashChange,
  isExtraneousPopstateEvent
} from './dom-utils';

export interface CreateBrowserHistoryOptions {
  getUserConfirmation?: (message: string, callback: (confirmed: boolean) => {}) => {};
  forceRefresh?: boolean;
  keyLength?: number;
  basename?: string;
}

interface NextState {
  action: string;
  location: LocationSegments;
}

const PopStateEvent = 'popstate';
const HashChangeEvent = 'hashchange';

/**
 * Creates a history object that uses the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */
const createBrowserHistory = (win: Window, props: CreateBrowserHistoryOptions = {}) => {
  let forceNextPop = false;

  const globalHistory = win.history;
  const globalLocation = win.location;
  const globalNavigator = win.navigator;
  const canUseHistory = supportsHistory(win);
  const needsHashChangeListener = !supportsPopStateOnHashChange(globalNavigator);
  const scrollHistory = createScrollHistory(win);

  const forceRefresh = (props.forceRefresh != null) ? props.forceRefresh : false;
  const getUserConfirmation = (props.getUserConfirmation != null) ? props.getUserConfirmation : getConfirmation;
  const keyLength = (props.keyLength != null) ? props.keyLength : 6;
  const basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';

  const getHistoryState = () => {
    try {
      return win.history.state || {};
    } catch (e) {
      // IE 11 sometimes throws when accessing window.history.state
      // See https://github.com/ReactTraining/history/pull/289
      return {};
    }
  };

  const getDOMLocation = (historyState: LocationSegments) => {
    historyState = historyState || {};
    const { key, state } = historyState;
    const { pathname, search, hash } = globalLocation;

    let path = pathname + search + hash;

    warning(
      (!basename || hasBasename(path, basename)),
      'You are attempting to use a basename on a page whose URL path does not begin ' +
      'with the basename. Expected path "' + path + '" to begin with "' + basename + '".'
    );

    if (basename) {
      path = stripBasename(path, basename);
    }

    return createLocation(path, state, key || createKey(keyLength));
  };


  const transitionManager = createTransitionManager();

  const setState = (nextState?: NextState) => {

    // Capture location for the view before changing history.
    scrollHistory.capture(history.location.key);

    Object.assign(history, nextState);

    // Set scroll position based on its previous storage value
    history.location.scrollPosition = scrollHistory.get(history.location.key);
    history.length = globalHistory.length;

    transitionManager.notifyListeners(
      history.location,
      history.action
    );
  };

  const handlePopState = (event: any) => {
    // Ignore extraneous popstate events in WebKit.
    if (!isExtraneousPopstateEvent(globalNavigator, event)) {
      handlePop(getDOMLocation(event.state));
    }
  };

  const handleHashChange = () => {
    handlePop(getDOMLocation(getHistoryState()));
  };


  const handlePop = (location: LocationSegments) => {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      const action = 'POP';

      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok: boolean) => {
        if (ok) {
          setState({ action, location });
        } else {
          revertPop(location);
        }
      });
    }
  };

  const revertPop = (fromLocation: LocationSegments) => {
    const toLocation = history.location;

    // TODO: We could probably make this more reliable by
    // keeping a list of keys we've seen in sessionStorage.
    // Instead, we just default to 0 for keys we don't know.

    let toIndex = allKeys.indexOf(toLocation.key);
    let fromIndex = allKeys.indexOf(fromLocation.key);

    if (toIndex === -1) {
      toIndex = 0;
    }

    if (fromIndex === -1) {
      fromIndex = 0;
    }

    const delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  };

  const initialLocation = getDOMLocation(getHistoryState());
  let allKeys = [ initialLocation.key ];
  let listenerCount = 0;
  let isBlocked = false;

  // Public interface

  const createHref = (location: LocationSegments) => {
    return basename + createPath(location);
  };

  const push = (path: string | LocationSegments, state: any) => {
    warning(
      !(typeof path === 'object' && path.state !== undefined && state !== undefined),
      'You should avoid providing a 2nd state argument to push when the 1st ' +
      'argument is a location-like object that already has state; it is ignored'
    );

    const action = 'PUSH';
    const location = createLocation(path, state, createKey(keyLength), history.location);

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok: boolean) => {
      if (!ok) {
        return;
      }

      const href = createHref(location);
      const { key, state } = location;

      if (canUseHistory) {
        globalHistory.pushState({ key, state }, '', href);

        if (forceRefresh) {
          globalLocation.href = href;
        } else {
          const prevIndex = allKeys.indexOf(history.location.key);
          const nextKeys = allKeys.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);

          nextKeys.push(location.key);
          allKeys = nextKeys;

          setState({ action, location });
        }
      } else {
        warning(
          state === undefined,
          'Browser history cannot push state in browsers that do not support HTML5 history'
        );

        globalLocation.href = href;
      }
    });
  };

  const replace = (path: string | LocationSegments, state: any) => {
    warning(
      !(typeof path === 'object' && path.state !== undefined && state !== undefined),
      'You should avoid providing a 2nd state argument to replace when the 1st ' +
      'argument is a location-like object that already has state; it is ignored'
    );

    const action = 'REPLACE';
    const location = createLocation(path, state, createKey(keyLength), history.location);

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok: boolean) => {
      if (!ok) {
        return;
      }

      const href = createHref(location);
      const { key, state } = location;

      if (canUseHistory) {
        globalHistory.replaceState({ key, state }, '', href);

        if (forceRefresh) {
          globalLocation.replace(href);

        } else {
          const prevIndex = allKeys.indexOf(history.location.key);

          if (prevIndex !== -1) {
            allKeys[prevIndex] = location.key;
          }

          setState({ action, location });
        }
      } else {
        warning(
          state === undefined,
          'Browser history cannot replace state in browsers that do not support HTML5 history'
        );

        globalLocation.replace(href);
      }
    });
  };

  const go = (n: number) => {
    globalHistory.go(n);
  };

  const goBack = () => go(-1);
  const goForward = () => go(1);


  const checkDOMListeners = (delta: number) => {
    listenerCount += delta;

    if (listenerCount === 1) {
      win.addEventListener(PopStateEvent, handlePopState);

      if (needsHashChangeListener) {
        win.addEventListener(HashChangeEvent, handleHashChange);
      }
    } else if (listenerCount === 0) {
      win.removeEventListener(PopStateEvent, handlePopState);

      if (needsHashChangeListener) {
        win.removeEventListener(HashChangeEvent, handleHashChange);
      }
    }
  };

  const block = (prompt: string | Prompt = '') => {
    const unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return () => {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  };

  const listen = (listener: Function) => {
    const unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);

    return () => {
      checkDOMListeners(-1);
      unlisten();
    };
  };

  const history: RouterHistory = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref,
    push,
    replace,
    go,
    goBack,
    goForward,
    block,
    listen,
    win: win
  };

  return history;
};

export default createBrowserHistory;
