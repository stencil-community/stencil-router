import { Build } from '@stencil/core';
import { createWindowRouter } from './router';
import { isPromise, normalizePathname, devDebug } from './utils/helpers';
import type {
  MapParamData,
  PageState,
  RouterOptions,
  RouteParams,
  StateHistory,
} from './types';
import { setDocumentStaticData } from './utils/server-static-data-proxy';

const stateHistory: StateHistory = new Map();

export const staticState = (
  mapFn: MapParamData,
): ((params: RouteParams, url: URL) => PageState) => {
  if (Build.isServer) {
    // server side (async)
    return (params, url) => staticServerState(params, url!, mapFn);
  } else {
    // client side (sync)
    return staticClientState;
  }
};

const staticServerState = (
  params: RouteParams,
  url: URL,
  mapFn: MapParamData,
): PageState => {
  // server-side only
  const inputData = mapFn(params, url);

  if (isPromise(inputData)) {
    return inputData.then(setDocumentStaticData).catch(err => {
      console.error(err);
      return setDocumentStaticData({});
    });
  }

  return setDocumentStaticData(inputData);
};

const staticClientState = (_params: RouteParams | undefined, url: URL) => {
  // client side (sync)
  try {
    return getCachedState(url) || getDocumentState(url, document);
  } catch (e) {
    console.error(e);
  }
};

const getDocumentState = (url: URL | Location, doc: Document) => {
  const staticElm = doc.querySelector(
    '[data-stencil-static="page.state"]',
  ) as HTMLScriptElement | null;
  let staticState: any;
  if (staticElm) {
    devDebug(`staticClientState: ${url.pathname} [parsed page.state]`);
    staticState = JSON.parse(staticElm.textContent!);
    staticElm.remove();
  } else {
    devDebug(`staticClientState: ${url.pathname} [page.state not found]`);
  }
  return setCachedState(url, staticState);
};

const getCachedState = (url: URL | Location) =>
  stateHistory.get(normalizePathname(url));

const hasCachedState = (url: URL | Location) =>
  stateHistory.has(normalizePathname(url));

const setCachedState = (url: URL | Location, stateData?: any) =>
  stateHistory.set(normalizePathname(url), stateData);

const createWindowStaticRouter = (
  win: Window,
  doc: Document,
  loc: Location,
  hstry: History,
  opts: RouterOptions,
) => {
  const buildId = doc.documentElement.dataset.stencilBuild;
  const getDataFetchPath = (url: URL) =>
    `${
      url.pathname.endsWith('/') ? url.pathname : url.pathname + '/'
    }page.state.json?s-cache=${buildId}`;

  const loadStaticState = async (pushToUrl: URL) => {
    try {
      if (win.fetch) {
        if (normalizePathname(pushToUrl) === normalizePathname(location)) {
          devDebug(`beforePush: ${pushToUrl.pathname} [no pathname change]`);
          return true;
        }

        if (hasCachedState(pushToUrl)) {
          // already have static state ready to go
          devDebug(`beforePush: ${pushToUrl.pathname} [cached state]`);
          return true;
        }

        // try fetching for the static state
        const fetchUrl = getDataFetchPath(pushToUrl);
        const res = await win.fetch(fetchUrl, {
          cache: 'force-cache',
        });

        if (res.ok) {
          // awesome, we got a good response for page state data
          const staticData = await res.json();
          if (staticData.components) {
            // page state is all the known components already
            // let's preload them all before navigating
            // await preloadComponents({ tags: staticData.components });
          }
          // cache the page state, which could be undefined, but that's valuable too
          setCachedState(pushToUrl, staticData['page.state']);
          devDebug(`beforePush: ${pushToUrl.pathname} [fetched state]`);

          // stop so we don't trigger the location.href
          return true;
        } else {
          devDebug(
            `beforePush: ${pushToUrl.pathname} [fetched failed ${res.status}]`,
          );
        }
      }
    } catch (e) {
      devDebug(`beforePush: ${pushToUrl.pathname}, ${e}`);
    }
    return false;
  };

  const beforePush = async (pushToUrl: URL) => {
    const success = await loadStaticState(pushToUrl);
    if (!success) {
      // something errored, fallback to a normal page navigation
      loc.href = pushToUrl.pathname;
    }
  };

  const onHrefRender = (navigatedToUrl: URL, currentUrl: URL) => {
    // let's add a <link rel="prefetch"> for links found on this page
    // if the page we're navigating to is different than the current page
    // and we haven't cached it already
    // and there isn't already a <link> in the document.head for this url
    if (
      normalizePathname(navigatedToUrl) !== normalizePathname(currentUrl) &&
      !getCachedState(navigatedToUrl) &&
      !doc.head.querySelector(
        `link[href="${getDataFetchPath(navigatedToUrl)}"]`,
      )
    ) {
      const linkElm = doc.createElement('link');
      linkElm.setAttribute('rel', 'prefetch');
      linkElm.setAttribute('href', getDataFetchPath(navigatedToUrl));
      linkElm.setAttribute('as', 'fetch');
      doc.head.appendChild(linkElm);
    }
  };

  const reloadOnPopState = () => {
    const hasState = hasCachedState(loc);
    devDebug(`reloadOnPopState: ${loc.pathname} [hasStateCache: ${hasState}]`);
    return !hasState;
  };

  if (Build.isServer) {
    const styleElm = doc.createElement('style');
    styleElm.innerHTML = `.stencil-router-queue{display:none!important}`;
    doc.head.appendChild(styleElm);
  }

  if (Build.isBrowser) {
    if (!buildId) {
      console.warn(
        `Stencil Router: html document has not been prerendered, falling back to non-static router`,
      );
      return createWindowRouter(win, doc, loc, hstry, opts);
    }
    getDocumentState(loc, doc);
  }

  return createWindowRouter(win, doc, loc, hstry, {
    beforePush,
    onHrefRender,
    reloadOnPopState,
    ...opts,
  });
};

export const createStaticRouter = (opts: RouterOptions = {}) =>
  createWindowStaticRouter(window, document, location, history, opts).router;
