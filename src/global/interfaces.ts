export interface ActiveRouter {
  subscribe: (callback: Function) => () => void;
  set: (value: {[key: string]: any}) => void;
  get: (attrName?: string) => any;
}

export type Listener = () => void;

export interface LocationSegments {
  pathname?: string;
  search?: string;
  hash?: string;
  state?: any;
  key?: string;
  query?: { [key: string]: any };
}

export interface RouterHistory {
  length: number;
  action: string;
  location: LocationSegments;
  createHref: (location: LocationSegments) => string;
  push: (path: string | LocationSegments, state: any) => void;
  replace: (path: string | LocationSegments, state: any) => void;
  go: (n: number) => void;
  goBack: () => void;
  goForward: () => void;
  block: (prompt?: string) => () => void;
  listen: (listener: Function) => () => void;
}

