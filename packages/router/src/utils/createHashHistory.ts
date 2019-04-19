// Adapted from the https://github.com/ReactTraining/history and converted to TypeScript

import { createLocation, locationsAreEqual, createKey } from './location-utils';
import { RouterHistory, LocationSegments, Prompt } from '../global/interfaces';
import { warning } from './log';
import {
  addLeadingSlash,
  stripLeadingSlash,
  stripTrailingSlash,
  hasBasename,
  stripBasename,
  createPath
} from './path-utils';
import createTransitionManager from './createTransitionManager';
import {
  getConfirmation,
  supportsGoWithoutReloadUsingHash
} from './dom-utils';

export interface CreateHashHistoryOptions {
  getUserConfirmation?: (message: string, callback: (confirmed: boolean) => {}) => {};
  hashType?: 'hashbang' | 'noslash' | 'slash';
  basename?: string;
  keyLength?: number;
}

const HashChangeEvent = 'hashchange';
const HashPathCoders = {
  hashbang: {
    encodePath: (path: string) => path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path),
    decodePath: (path: string) => path.charAt(0) === '!' ? path.substr(1) : path
  },
  noslash: {
    encodePath: stripLeadingSlash,
    decodePath: addLeadingSlash
  },
  slash: {
    encodePath: addLeadingSlash,
    decodePath: addLeadingSlash
  }
};

const createHashHistory = (win: Window, props: CreateHashHistoryOptions = {}) => {
  let forceNextPop = false;
  let ignorePath: any = null;
  let listenerCount = 0;
  let isBlocked = false;

  const globalLocation = win.location;
  const globalHistory = win.history;
  const canGoWithoutReload = supportsGoWithoutReloadUsingHash(win.navigator);
  const keyLength = (props.keyLength != null) ? props.keyLength : 6;

  const {
    getUserConfirmation = getConfirmation,
    hashType = 'slash'
  } = props;
  const basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';

  const { encodePath, decodePath } = HashPathCoders[hashType];

  const getHashPath = () => {
    // We can't use window.location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    const href = globalLocation.href;
    const hashIndex = href.indexOf('#');
    return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
  };

  const pushHashPath = (path: string) => (
    globalLocation.hash = path
  );

  const replaceHashPath = (path: string) => {
    const hashIndex = globalLocation.href.indexOf('#');

    globalLocation.replace(
      globalLocation.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path
    );
  };

  const getDOMLocation = () => {
    let path = decodePath(getHashPath());

    warning(
      (!basename || hasBasename(path, basename)),
      'You are attempting to use a basename on a page whose URL path does not begin ' +
      'with the basename. Expected path "' + path + '" to begin with "' + basename + '".'
    );

    if (basename) {
      path = stripBasename(path, basename);
    }

    return createLocation(path, undefined, createKey(keyLength));
  };

  const transitionManager = createTransitionManager();

  const setState = (nextState?: any) => {
    Object.assign(history, nextState);

    history.length = globalHistory.length;

    transitionManager.notifyListeners(
      history.location,
      history.action
    );
  };

  const handleHashChange = () => {
    const path = getHashPath();
    const encodedPath = encodePath(path);

    if (path !== encodedPath) {
      // Ensure we always have a properly-encoded hash.
      replaceHashPath(encodedPath);

    } else {
      const location = getDOMLocation();
      const prevLocation = history.location;

      if (!forceNextPop && locationsAreEqual(prevLocation, location)) {
        return; // A hashchange doesn't always == location change.
      }

      if (ignorePath === createPath(location)) {
        return; // Ignore this change; we already setState in push/replace.
      }

      ignorePath = null;

      handlePop(location);
    }
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
    // keeping a list of paths we've seen in sessionStorage.
    // Instead, we just default to 0 for paths we don't know.

    let toIndex = allPaths.lastIndexOf(createPath(toLocation));
    let fromIndex = allPaths.lastIndexOf(createPath(fromLocation));

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

  // Ensure the hash is encoded properly before doing anything else.
  const path = getHashPath();
  const encodedPath = encodePath(path);

  if (path !== encodedPath) {
    replaceHashPath(encodedPath);
  }

  const initialLocation = getDOMLocation();
  let allPaths = [ createPath(initialLocation) ];

  // Public interface

  const createHref = (location: LocationSegments) => (
    '#' + encodePath(basename + createPath(location))
  );

  const push = (path: string| LocationSegments, state: any) => {
    warning(
      state === undefined,
      'Hash history cannot push state; it is ignored'
    );

    const action = 'PUSH';
    const location = createLocation(path, undefined, createKey(keyLength), history.location);

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok: boolean) => {
      if (!ok) {
        return;
      }

      const path = createPath(location);
      const encodedPath = encodePath(basename + path);
      const hashChanged = getHashPath() !== encodedPath;

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a PUSH, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path;
        pushHashPath(encodedPath);

        const prevIndex = allPaths.lastIndexOf(createPath(history.location));
        const nextPaths = allPaths.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);

        nextPaths.push(path);
        allPaths = nextPaths;

        setState({ action, location });
      } else {
        warning(
          false,
          'Hash history cannot PUSH the same path; a new entry will not be added to the history stack'
        );

        setState();
      }
    });
  };

  const replace = (path: string | LocationSegments, state: any) => {
    warning(
      state === undefined,
      'Hash history cannot replace state; it is ignored'
    );

    const action = 'REPLACE';
    const location = createLocation(path, undefined, createKey(keyLength), history.location);

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok: boolean) => {
      if (!ok) {
        return;
      }

      const path = createPath(location);
      const encodedPath = encodePath(basename + path);
      const hashChanged = getHashPath() !== encodedPath;

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a REPLACE, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path;
        replaceHashPath(encodedPath);
      }

      const prevIndex = allPaths.indexOf(createPath(history.location));

      if (prevIndex !== -1) {
        allPaths[prevIndex] = path;
      }

      setState({ action, location });
    });
  };

  const go = (n: number) => {
    warning(
      canGoWithoutReload,
      'Hash history go(n) causes a full page reload in this browser'
    );

    globalHistory.go(n);
  };

  const goBack = () => go(-1);

  const goForward = () => go(1);

  const checkDOMListeners = (win: Window, delta: number) => {
    listenerCount += delta;

    if (listenerCount === 1) {
      win.addEventListener(HashChangeEvent, handleHashChange);
    } else if (listenerCount === 0) {
      win.removeEventListener(HashChangeEvent, handleHashChange);
    }
  };

  const block = (prompt: string | Prompt = '') => {
    const unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(win, 1);
      isBlocked = true;
    }

    return () => {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(win, -1);
      }

      return unblock();
    };
  };

  const listen = (listener: Function) => {
    const unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(win, 1);

    return () => {
      checkDOMListeners(win, -1);
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

export default createHashHistory;
