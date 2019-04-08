import { storageAvailable } from './dom-utils';

const createScrollHistory = (win: Window, applicationScrollKey: string = 'scrollPositions') => {

  let scrollPositions = new Map<string, [number, number]>();

  const set = (key: string, value: [number, number]) => {
    scrollPositions.set(key, value);
    if (storageAvailable(win, 'sessionStorage')) {
      const arrayData: [string, [number, number]][] = [];

      scrollPositions.forEach((value, key) => {
        arrayData.push([key, value]);
      });
      win.sessionStorage.setItem('scrollPositions', JSON.stringify(arrayData));
    }
  }

  const get = (key: string) => {
    return scrollPositions.get(key);
  }

  const has = (key: string) => {
    return scrollPositions.has(key);
  }

  const capture = (key: string) => {
    set(key, [win.scrollX, win.scrollY])
  }

  if (storageAvailable(win, 'sessionStorage')) {
    const scrollData = win.sessionStorage.getItem(applicationScrollKey);
    scrollPositions = scrollData ?
      new Map(JSON.parse(scrollData)) :
      scrollPositions;
  }

  if ('scrollRestoration' in win.history) {
    history.scrollRestoration = 'manual';
  }

  return {
    set,
    get,
    has,
    capture
  }
}


export default createScrollHistory;
