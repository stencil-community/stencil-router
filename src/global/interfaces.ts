export interface ActiveRouter {
  subscribe: (location: LocationSegments, nextListeners: RouteSubscription[], routeSubscription: RouteSubscription) => Listener
  dispatch: (location: LocationSegments, nextListeners: RouteSubscription[]) => void;
}


export interface RouteViewOptions {
  scrollTopOffset?: number
}

export interface RouteSubscription {
  isMatch: boolean;
  groupId?: string;
  groupIndex?: number;
}

export type HistoryType = 'browser' | 'hash';

export type Listener = () => void;

export interface LocationSegments {
  pathname?: string;
  search?: string;
  hash?: string;
  state?: any;
  key?: string;
  query?: { [key: string]: any };
  scrollPosition?: [number, number];
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
  block: (prompt?: string) => () => void;
  listen: (listener: Function) => () => void;
}

export interface RouterGroup {
  listenerList: ((switchMatched: boolean) => null | MatchResults)[];
  groupedListener: () => void;
  startLength: number;
}

export interface MatchOptions {
  path?: string | string[];
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
