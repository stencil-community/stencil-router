import {
  Build,
  FunctionalComponent,
  FunctionalUtilities,
  VNode,
  h,
  writeTask,
} from '@stencil/core';
import { createStore } from '@stencil/store';
import {
  isPromise,
  isString,
  normalizePathname,
  urlToPath,
  devDebug,
  isFunction,
  handlePushState,
} from './utils/helpers';
import type {
  Router,
  RouterOptions,
  InternalRouterState,
  RouteEntry,
  RouteProps,
  RoutePath,
  RouteParams,
  PageState,
  SwitchView,
  OnChangeHandler,
  OnChangeType,
} from './types';

interface MatchResult {
  params: RouteParams;
  route: RouteEntry;
  index: number;
}
let defaultRouter: Router | undefined;

export const createWindowRouter = (
  win: Window,
  doc: Document,
  loc: Location,
  hstry: History,
  opts: RouterOptions,
) => {
  let hasQueuedView = false;
  let lastHref = loc.href;

  const onChanges: OnChangeHandler[] = [];
  const onBeforeChanges: OnChangeHandler[] = [];
  const urlFromHref = (href: string) => new URL(href, doc.baseURI);

  const { state, dispose } = createStore<InternalRouterState>({
    href: lastHref,
    path: urlToPath(loc),
    hash: loc.hash,
    views: [],
    popState: false,
  });

  const pushState = (updateUrl: URL) => {
    try {
      const path = urlToPath(updateUrl);
      if (path != null) {
        devDebug(`pushState: ${path}`);
        state.href = updateUrl.href;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const match = (
    testUrl: URL,
    routes: RouteEntry[],
  ): MatchResult | undefined => {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const params = matchPath(normalizePathname(testUrl), route.path);
      if (params) {
        if (route.to != null) {
          pushState(urlFromHref(route.to));
          return match(urlFromHref(route.to), routes);
        } else {
          return { params, route, index: i };
        }
      }
    }
    return undefined;
  };

  const push = async (href: string, isFromPopState = false) => {
    const pushToUrl = urlFromHref(href);

    if (state.href !== pushToUrl.href) {
      onBeforeChanges.forEach(cb => {
        try {
          cb(urlFromHref(href), urlFromHref(lastHref));
        } catch (e) {
          console.error(e);
        }
      });

      try {
        if (opts?.beforePush) {
          await opts.beforePush(pushToUrl);
        }
      } catch (e) {
        console.error(e);
      }
      state.href = pushToUrl.href;
      state.popState = isFromPopState;
    } else if (!isFromPopState && pushToUrl.hash !== '') {
      loc.href = pushToUrl.href;
    }
  };

  const createSwitchChildren = (
    matchedViewChildren: any,
    hasRouteEntryChanged: boolean,
  ) => {
    pushView(matchedViewChildren);
    hasQueuedView = false;

    const views = state.views;
    if (hasRouteEntryChanged && views.length > 1) {
      for (const view of views) {
        if (view.s === VIEW_STATE.QUEUED) {
          checkForQueuedView(view);
        }
        if (!hasQueuedView) {
          // the view being added didn't have any children that
          // requires a transition, just stop here and only show the active
          break;
        }
      }
    }

    if (hasQueuedView && views.length > 1) {
      for (const view of views) {
        view.c = updateQueuedView(view);
      }
    } else {
      views[0].c = matchedViewChildren;
    }

    updateSwitchVNodes();
  };

  const pushView = (matchedViewChildren: any) => {
    const views = state.views;
    if (views.length === 0 || (views.length > 0 && views[0].h !== state.href)) {
      state.views = [
        {
          s: VIEW_STATE.QUEUED,
          c: matchedViewChildren,
          h: state.href,
          o: state.popState,
          p: [],
        },
        ...views
          .filter(v => v.s !== VIEW_STATE.QUEUED)
          .map(v => ({ ...v, s: VIEW_STATE.LEAVING })),
      ];
    }
  };

  const checkForQueuedView = (view: SwitchView) => {
    h((_t: any, _c: VNode[], utils: FunctionalUtilities) => {
      const vchildren = Array.isArray(view.c) ? view.c : [view.c];
      utils.forEach(vchildren, (vnode, i) => {
        if (
          vnode &&
          !isString(view.c[i]) &&
          isString(vnode.vtag) &&
          vnode.vtag.includes('-')
        ) {
          hasQueuedView = true;
        }
      });
    }, null);
  };

  const updateQueuedView = (view: SwitchView) =>
    h((_t: any, _c: VNode[], utils: FunctionalUtilities) => {
      const vchildren = Array.isArray(view.c) ? view.c : [view.c];
      const hChildren = utils.map(vchildren, (vnode, i) => {
        if (isString(vchildren[i])) {
          // text nodes are not mapped correctly with the function utils
          return vchildren[i];
        }
        if (vnode && hasQueuedView && view.s === VIEW_STATE.QUEUED) {
          vnode.vattrs = vnode.vattrs || {};
          vnode.vattrs.class =
            (vnode.vattrs.class || '') + ' stencil-router-queue';
          const userRef = vnode.vattrs.ref;
          vnode.vattrs.ref = (el: any) => {
            addComponentOnReady(view, el);
            if (userRef) {
              userRef(el);
            }
          };
        }
        return vnode;
      });
      return hChildren;
    }, null);

  const addComponentOnReady = (view: SwitchView, el: any) => {
    if (el) {
      if (el.componentOnReady) {
        view.p.push(el.componentOnReady());
      }
      const children = el.children;
      for (let i = 0; i < children.length; i++) {
        addComponentOnReady(view, children[i]);
      }
    }
  };

  const updateSwitchVNodes = () => {
    if (!hasQueuedView) {
      state.views = [state.views[0]];
    }

    if (state.views.length === 1) {
      state.views[0].s = VIEW_STATE.ACTIVE;
    } else {
      const queuedViews = state.views.filter(v => v.s === VIEW_STATE.QUEUED);

      if (queuedViews.length > 0) {
        queuedViews.forEach(v => {
          if (Array.isArray(v.c)) {
            v.c = v.c.map(c => (isString(c) ? '' : c));
          }
        });

        writeTask(async () => {
          const activeView = state.views[0];
          await Promise.all(activeView.p);
          activeView.s = VIEW_STATE.ACTIVE;
          state.views = [activeView];
        });

        return;
      }
    }

    const view = state.views[0];
    const newUrl = urlFromHref(view.h);
    const newHref = newUrl.href;

    if (lastHref !== newHref) {
      handlePushState(win, loc, hstry, view.o, newUrl);

      state.path = urlToPath(newUrl);
      state.hash = newUrl.hash;

      onChanges.forEach((cb: OnChangeHandler) => {
        try {
          cb(urlFromHref(newHref), urlFromHref(lastHref));
        } catch (e) {
          console.error(e);
        }
      });
      lastHref = newHref;
    }
  };

  const onPopState = (ev: PopStateEvent) => {
    devDebug(`onPopState to: ${loc.pathname}`);
    if (isFunction(opts.reloadOnPopState) && opts.reloadOnPopState(ev)) {
      // if there's an event then it's from 'popstate' event
      // and we didn't have cached state and didn't have
      // state in the <script> element, probably when full
      // reloading page 2, and hitting the back button to page 1 that
      // would be in the user's browserhistory, but nothing in-memory
      // in this window instance, so let's do a full page reload
      // cuz we don't have any data we can load synchronously
      loc.reload();
    } else {
      // we've got an entirely different path and we
      // we ensured we have synchronous static state ready to go
      // changing of only the hash should not trigger a push
      return push(loc.href, true);
    }
  };

  const getRouteChildren = (matchResult: MatchResult): any => {
    const route = matchResult?.route;
    if (route) {
      if (isFunction(route.jsx)) {
        const pageState = route.mapParams
          ? route.mapParams(matchResult.params, urlFromHref(state.href))
          : undefined;

        if (Build.isServer) {
          if (isPromise<PageState>(pageState)) {
            return pageState
              .then(resolvedPagedState =>
                route.jsx(matchResult.params, resolvedPagedState),
              )
              .catch(err => {
                console.error(err);
                return route.jsx(matchResult.params);
              });
          }
        }

        return route.jsx(matchResult.params, pageState);
      } else {
        return route.jsx;
      }
    }
  };

  const Switch: any = (_: any, childrenRoutes: RouteEntry[]): any => {
    devDebug(`switch render: ${state.href}`);
    const matchResult = match(urlFromHref(state.href), childrenRoutes);
    if (matchResult) {
      const matchedViewChildren = getRouteChildren(matchResult);

      const activeMatchResult = match(urlFromHref(loc.href), childrenRoutes);
      const hasRouteEntryChanged =
        activeMatchResult?.index !== matchResult?.index;

      if (matchedViewChildren) {
        if (Build.isServer) {
          // server-side only, no transitions
          return matchedViewChildren;
        }

        createSwitchChildren(matchedViewChildren, hasRouteEntryChanged);

        return state.views
          .slice()
          .reverse()
          .map(v => v.c);
      }
    }
  };

  const on = (type: OnChangeType, cb: OnChangeHandler) =>
    (type === 'change' ? onChanges : onBeforeChanges).push(cb);

  const router: Router = (defaultRouter = {
    Switch,
    get path() {
      return state.path;
    },
    get hash() {
      return state.hash;
    },
    push,
    on,
    onHrefRender: navigateToUrl => {
      if (isFunction(opts.onHrefRender)) {
        opts.onHrefRender(navigateToUrl, urlFromHref(state.href));
      }
    },
    preload: opts => {
      if (!doc.head.querySelector(`link[href="${opts.href}"]`)) {
        const lnk = doc.createElement('link');
        lnk.href = opts.href;
        if (opts.as === 'module') {
          lnk.rel = 'modulepreload';
        } else {
          lnk.rel = 'prefetch';
          lnk.as = opts.as;
        }
        doc.head.appendChild(lnk);
      }
    },
    dispose: () => {
      defaultRouter = undefined;
      win.removeEventListener('popstate', onPopState);
      dispose();
    },
    serializeURL: urlToPath,
  });

  // listen URL changes
  win.addEventListener('popstate', onPopState);

  return {
    router,
    state,
  };
};

export const href = (
  href: string,
  router: Router | undefined = defaultRouter,
) => {
  if (typeof href !== 'string') {
    return {};
  }

  const baseURI = document.baseURI;
  const goToUrl = new URL(href, baseURI);

  if (href.startsWith('#') || goToUrl.host !== new URL(baseURI).host) {
    return {
      href,
    };
  }

  if (Build.isDev) {
    if (!router || !isFunction(router.push)) {
      console.error('Router must be defined in href()', href);
      return {
        href,
      };
    }

    const baseName = goToUrl.pathname.split('/').pop();
    if (baseName!.indexOf('.') > -1) {
      console.error(
        'Router href() should only be used for a page link, without an extension, and not for an asset',
        href,
      );
      return {
        href,
      };
    }
  }

  router!.onHrefRender(goToUrl);

  const anchor = href.includes('#') ? `#${href.split('#')[1]}` : '';

  return {
    href: router!.serializeURL(goToUrl) + anchor,
    onClick: (ev: MouseEvent) => {
      if (!ev.metaKey && !ev.ctrlKey && ev.which != 2 && ev.button != 1) {
        ev.preventDefault();
        router!.push(href);
      }
    },
  };
};

export const Route: FunctionalComponent<RouteProps> = (props, children) => {
  if ('to' in props) {
    const entry: RouteEntry = {
      path: props.path,
      to: props.to,
    };
    return entry as any;
  }
  if (Build.isDev && props.render && children.length > 0) {
    console.warn(
      'Route: if `render` is provided, the component should not have any children',
    );
  }
  const entry: RouteEntry = {
    path: props.path,
    id: props.id,
    jsx: props.render ?? children,
    mapParams: props.mapParams,
  };
  return entry as any;
};

const matchPath = (
  pathname: string,
  path: RoutePath,
): RouteParams | undefined => {
  if (isString(path)) {
    if (path === pathname) {
      return {};
    }
  } else if (isFunction(path)) {
    const params = path(pathname);
    if (params) {
      return params === true ? {} : { ...params };
    }
  } else {
    const results = path.exec(pathname) as any;
    if (results) {
      path.lastIndex = 0;
      return { ...results };
    }
  }
  return undefined;
};

export const createRouter = (opts: RouterOptions = {}) =>
  createWindowRouter(window, document, location, history, opts).router;

export const NotFound = () => {};

const enum VIEW_STATE {
  QUEUED,
  ACTIVE,
  LEAVING,
}
