export type Path = string | RegExp | Array<string | RegExp>;

export interface ActiveRouter {
  subscribe: (location: LocationSegments, nextListeners: RouteSubscription[], routeSubscription: RouteSubscription) => Listener
  dispatch: (location: LocationSegments, nextListeners: RouteSubscription[]) => void;
}

export type Prompt = (location: LocationSegments, action: string) => string;

export interface RouteRenderProps {
  history: RouterHistory;
  match: MatchResults;
  [key: string]: any;
}


export interface RouteViewOptions {
  scrollTopOffset?: number,
  scrollToId?: string
}

export interface RouteSubscription {
  isMatch: boolean;
  groupId?: string;
  groupIndex?: number;
}

export type HistoryType = 'browser' | 'hash';

export type Listener = () => void;

export interface LocationSegments {
  pathname: string;
  query: { [key: string]: any };
  key: string;
  scrollPosition?: [number, number];
  search?: string;
  hash?: string;
  state?: any;
}

export type LocationSegmentPart = 'pathname' | 'search' | 'hash' | 'state' | 'key';

export interface RouterHistory {
  length: number;
  action: string;
  location: LocationSegments;
  createHref: (location: LocationSegments) => string;
  push: (path: string | LocationSegments, state?: any) => void;
  replace: (path: string | LocationSegments, state?: any) => void;
  go: (n: number) => void;
  goBack: () => void;
  goForward: () => void;
  block: (prompt?: string | Prompt) => () => void;
  listen: (listener: Function) => () => void;
  win: Window;
}

export interface RouterGroup {
  listenerList: ((switchMatched: boolean) => null | MatchResults)[];
  groupedListener: () => void;
  startLength: number;
}

export interface MatchOptions {
  path?: Path;
  exact?: boolean;
  strict?: boolean;
}

export interface MatchResults {
  path: string;
  url: string;
  isExact: boolean;
  params: {
    [key: string]: string
  };
}
