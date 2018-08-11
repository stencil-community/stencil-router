export function invariant(value: boolean, ...args: any[]) {
  if (!value) {
    console.error(...args);
  }
}

export function warning(value:boolean, ...args: any[]) {
  if (!value) {
    console.warn(...args);
  }
}
