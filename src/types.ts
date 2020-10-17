import type { FunctionalComponent } from '@stencil/core';

export type RouteParams = { [prop: string]: string };
export type PageState = { [prop: string]: any };

export type RoutePath =
  | string
  | RegExp
  | ((path: string) => RouteParams | boolean | undefined | null);

export type OnChangeType = 'change' | 'beforechange';

export type OnChangeHandler = (newUrl: URL, oldURL: URL) => void;

export interface Router {
  readonly Switch: FunctionalComponent<{}>;
  /**
   * The active path includes the url's `pathname` and `search`,
   * but does not include the `hash`. The path will
   * always be absolute, but without the origin/host.
   * For example, `/pathname?search=qs`
   */
  readonly path: string;
  /**
   * The active hash includes only the url's `hash` value. The active
   * hash value will be an empty string if there is no fragment identifier,
   * and if there is a fragment the value will always start with `#`.
   * Same as https://developer.mozilla.org/en-US/docs/Web/API/URL/hash
   */
  readonly hash: string;
  dispose(): void;
  on(type: OnChangeType, cb: OnChangeHandler): void;
  onHrefRender(url: URL): void;
  push(href: string): Promise<void>;
  preload(opts: { href: string; as: 'fetch' | 'module' }): void;
  serializeURL(url: URL): string;
}

export interface RouterProps {
  router: Router;
}

export type RouteProps = RenderProps | RedirectProps;

export interface RenderProps {
  path: RoutePath;
  id?: string;
  mapParams?: (params: RouteParams, url: URL) => PageState;
  render?: (params: RouteParams, mappedState: any | null) => any;
}

export type MapParamData = (
  params: RouteParams,
  url: URL,
) => PageState | Promise<PageState>;

export interface RedirectProps {
  path: RoutePath;
  to: string;
}

export interface RouteEntry {
  path: RoutePath;
  jsx?: any;
  mapParams?: (params: RouteParams, url: URL) => PageState;
  to?: string;
  id?: string;
}

export interface InternalRouterState {
  href: string;
  path: string;
  hash: string;
  views: SwitchView[];
  popState: boolean;
}

export interface RouterOptions {
  beforePush?: (url: URL) => void | Promise<void>;
  onHrefRender?: (navigateToUrl: URL, currentUrl: URL) => void;
  reloadOnPopState?: (ev: PopStateEvent) => boolean;
}

export type StateHistory = Map<string, any>;

export interface SwitchView {
  /**
   * state
   */
  s: number;
  /**
   * children
   */
  c: any;
  /**
   * href
   */
  h: string;
  /**
   * If the url change was from a popstate event or not. Would be true
   * if you clicked the browser back or forward button, and false
   * if the change came from clicking a link
   */
  o: boolean;
  /**
   * promises
   */
  p: Promise<any>[];
}
