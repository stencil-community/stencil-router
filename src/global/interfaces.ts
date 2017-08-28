export interface ActiveRouter {
  subscribe: (callback: Function) => () => void;
  set: (value: {[key: string]: any}) => void;
  get: (attrName?: string) => any;
}

export type Listener = () => void;
