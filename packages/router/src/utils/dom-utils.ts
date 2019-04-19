
export const getConfirmation = (win: Window, message: string, callback: (confirmed: boolean) => {}) => (
  callback(win.confirm(message))
);

export const isModifiedEvent = (ev: MouseEvent) => (
  ev.metaKey || ev.altKey || ev.ctrlKey || ev.shiftKey
);

/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */
export const supportsHistory = (win: Window) => {
  const ua = win.navigator.userAgent;

  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false;
  }

  return win.history && 'pushState' in win.history;
};

/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */
export const supportsPopStateOnHashChange = (nav: Navigator) => (
  nav.userAgent.indexOf('Trident') === -1
);

/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */
export const supportsGoWithoutReloadUsingHash = (nav: Navigator) => (
  nav.userAgent.indexOf('Firefox') === -1
);

export const isExtraneousPopstateEvent = (nav: Navigator, event: any) => (
  event.state === undefined &&
  nav.userAgent.indexOf('CriOS') === -1
);

export const storageAvailable = (win: any, type: 'localStorage' | 'sessionStorage') => {
  const storage = win[type];
  const x = '__storage_test__';

  try {
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;

  } catch(e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0;
  }
}
