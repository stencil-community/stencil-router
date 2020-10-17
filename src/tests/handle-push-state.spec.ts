import { handlePushState } from '../utils/helpers';

describe('handlePushState', () => {
  let win: any;
  let hstry: History;
  let pushedStateHref: string;

  beforeEach(() => {
    pushedStateHref = null;
    win = {
      scrollTo(x: number, y: number) {
        win.scrollX = x;
        win.scrollY = y;
      },
      scrollX: 0,
      scrollY: 0,
      requestAnimationFrame() {},
    };
    hstry = {
      pushState(_data: any, _title: string, url: string) {
        pushedStateHref = url;
      },
    } as any;
  });

  it('pushState, set location.hash cuz different pathname and has a hash', () => {
    win.scrollX = 50;
    win.scrollY = 80;
    const loc = new URL('https://stenciljs.com/page-1');
    const newUrl = new URL('https://stenciljs.com/page-2#hash');
    const isFromPopState = false;

    handlePushState(win, loc, hstry, isFromPopState, newUrl);
    expect(pushedStateHref).toBe('https://stenciljs.com/page-2#hash');
    expect(loc.href).toBe('https://stenciljs.com/page-2#hash');
  });

  it('no pushState, set location.hash cuz same pathname and has a hash', () => {
    win.scrollX = 50;
    win.scrollY = 80;
    const loc = new URL('https://stenciljs.com/page-1');
    const newUrl = new URL('https://stenciljs.com/page-1#hash');
    const isFromPopState = false;

    handlePushState(win, loc, hstry, isFromPopState, newUrl);
    expect(pushedStateHref).toBe(null);
    expect(loc.href).toBe('https://stenciljs.com/page-1#hash');
  });

  it('no scroll to top cuz same pathname, different hash', () => {
    win.scrollX = 50;
    win.scrollY = 80;
    const loc = new URL('https://stenciljs.com/page-1');
    const newUrl = new URL('https://stenciljs.com/page-1#hash');
    const isFromPopState = false;

    handlePushState(win, loc, hstry, isFromPopState, newUrl);
    expect(pushedStateHref).toBe(null);
    expect(win.scrollX).toBe(50);
    expect(win.scrollY).toBe(80);
  });

  it('no scroll to top cuz its from popstate event', () => {
    win.scrollX = 50;
    win.scrollY = 80;
    const loc = new URL('https://stenciljs.com/page-1');
    const newUrl = new URL('https://stenciljs.com/page-2');
    const isFromPopState = true;
    handlePushState(win, loc, hstry, isFromPopState, newUrl);
    expect(pushedStateHref).toBe('https://stenciljs.com/page-2');
    expect(win.scrollX).toBe(50);
    expect(win.scrollY).toBe(80);
  });

  it('window scroll to top for same path but different search', () => {
    win.scrollX = 50;
    win.scrollY = 80;
    const loc = new URL('https://stenciljs.com/page-1?search=1');
    const newUrl = new URL('https://stenciljs.com/page-1?search=2');
    const isFromPopState = false;
    handlePushState(win, loc, hstry, isFromPopState, newUrl);
    expect(pushedStateHref).toBe('https://stenciljs.com/page-1?search=2');
    expect(win.scrollX).toBe(0);
    expect(win.scrollY).toBe(0);
  });

  it('window scroll to top', () => {
    win.scrollX = 50;
    win.scrollY = 80;
    const loc = new URL('https://stenciljs.com/page-1');
    const newUrl = new URL('https://stenciljs.com/page-2');
    const isFromPopState = false;
    handlePushState(win, loc, hstry, isFromPopState, newUrl);
    expect(pushedStateHref).toBe('https://stenciljs.com/page-2');
    expect(win.scrollX).toBe(0);
    expect(win.scrollY).toBe(0);
  });
});
