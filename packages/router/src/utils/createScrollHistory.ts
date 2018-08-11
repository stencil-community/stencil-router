import { storageAvailable } from './dom-utils';

const createScrollHistory = (applicationScrollKey: string = 'scrollPositions') => {

  let scrollPositions = new Map<string, [number, number]>();

  if (storageAvailable('sessionStorage')) {
    scrollPositions = window.sessionStorage.getItem(applicationScrollKey) ?
      new Map(JSON.parse(window.sessionStorage.getItem(applicationScrollKey))) :
      scrollPositions;
  }


  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }


  function set(key: string, value: [number, number]) {
    scrollPositions.set(key, value);
    if (storageAvailable('sessionStorage')) {
      const arrayData: [string, [number, number]][] = [];

      scrollPositions.forEach((value, key) => {
        arrayData.push([key, value]);
      });
      window.sessionStorage.setItem('scrollPositions', JSON.stringify(arrayData));
    }
  }

  function get(key: string) {
    return scrollPositions.get(key);
  }

  function has(key: string) {
    return scrollPositions.has(key);
  }

  function capture(key: string) {
    set(key, [window.scrollX, window.scrollY])
  }

  return {
    set,
    get,
    has,
    capture
  }
}



export default createScrollHistory;
