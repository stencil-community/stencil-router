export interface ActiveRouter {
  subscribe: (location: LocationSegments, nextListeners: RouteSubscription[], routeSubscription: RouteSubscription) => Listener
  dispatch: (location: LocationSegments, nextListeners: RouteSubscription[]) => void;
}

export interface RouteRenderProps {
  history: RouterHistory;
  match: MatchResults | null;
  [key: string]: any;
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
