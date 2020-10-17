import { Build } from '@stencil/core';

export const isFunction = (v: any): v is Function => typeof v === 'function';

export const isPromise = <T = any>(v: any): v is Promise<T> =>
  !!v && (typeof v === 'object' || isFunction(v)) && isFunction(v.then);

export const isString = (v: any): v is string => typeof v === 'string';

export const normalizePathname = (url: URL | Location) =>
  url.pathname.toLowerCase();

export const urlToPath = (url: URL | Location) =>
  normalizePathname(url) + url.search;

export const shouldPushState = (loc: URL | Location, newUrl: URL) =>
  urlToPath(loc) !== urlToPath(newUrl);

export const handlePushState = (
  win: Window,
  loc: URL | Location,
  hstry: History,
  isFromPopState: boolean,
  newUrl: URL,
) => {
  const pathBeforePush = urlToPath(loc);
  const newHref = newUrl.href;
  const hasHash = newUrl.hash.startsWith('#');

  if (shouldPushState(loc, newUrl)) {
    hstry.pushState(null, '', newHref);
  }

  if (!isFromPopState) {
    if (pathBeforePush !== urlToPath(newUrl)) {
      if (hasHash) {
        loc.href = newHref;
      } else {
        win.scrollTo(0, 0);
      }
    } else if (hasHash) {
      loc.href = newHref;
    }
  }
};

export const devDebug = (msg: string) => {
  if (Build.isDev) {
    console.debug.apply(console, [
      '%crouter',
      `background: #717171; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;`,
      msg,
    ]);
  }
};
