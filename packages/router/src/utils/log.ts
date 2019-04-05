
export const warning = (value:boolean, ...args: any[]) => {
  if (!value) {
    console.warn(...args);
  }
}
