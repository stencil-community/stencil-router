export interface ActiveRouter {
  subscribe: (Function) => () => void,
  set: (value: {[key: string]: any}) => void,
  get: (attrName?: string) => any
}
