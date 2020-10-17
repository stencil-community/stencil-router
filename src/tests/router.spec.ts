import { createWindowRouter, Route } from '../router';
import { RouterOptions } from '../index';
import { Build } from '@stencil/core';
import { Router } from '../types';

describe('router', () => {
  Build.isServer = false;
  let win: any;
  let doc: Document;
  let loc: Location;
  let hstry: History;
  let opts: RouterOptions;
  let popState: (ev: PopStateEvent) => Promise<void>;

  beforeEach(() => {
    const baseUrl = new URL(`https://capacitorjs.com/page-1`);
    win = {
      addEventListener(_: string, cb: any) {
        popState = cb;
      },
      removeEventListener() {
        popState = null;
      },
      scrollTo(x: number, y: number) {
        win.scrollX = x;
        win.scrollY = y;
      },
      scrollX: 0,
      scrollY: 0,
    };
    doc = {
      baseURI: baseUrl.href,
      querySelector() {},
    } as any;
    loc = baseUrl as any;
    hstry = {
      pushState(_data: any, _title: string, url: string) {
        Object.assign(loc, new URL(url));
      },
    } as any;
    opts = {};
  });

  const renderSwitch = (router: Router) => {
    return router.Switch(
      {},
      [
        TestRoute({
          path: '/page-1',
        }),
        TestRoute({
          path: '/page-2',
        }),
      ],
      null,
    );
  };

  it('push same page hash change', async () => {
    const { router } = createWindowRouter(win, doc, loc, hstry, opts);

    let newUrlChange: URL;
    let oldUrlChange: URL;
    let newUrlBeforeChange: URL;
    let oldUrlBeforeChange: URL;
    router.on('change', (n, o) => {
      newUrlChange = n;
      oldUrlChange = o;
    });
    router.on('beforechange', (n, o) => {
      newUrlBeforeChange = n;
      oldUrlBeforeChange = o;
    });
    renderSwitch(router);
    expect(router.hash).toBe(``);

    win.scrollX = 50;
    win.scrollY = 100;

    await router.push('/page-1#hash-change');
    renderSwitch(router);
    expect(router.path).toBe(`/page-1`);
    expect(router.hash).toBe(`#hash-change`);

    expect(win.scrollX).toBe(50);
    expect(win.scrollY).toBe(100);

    expect(newUrlChange.href).toBe(
      `https://capacitorjs.com/page-1#hash-change`,
    );
    expect(oldUrlChange.href).toBe(`https://capacitorjs.com/page-1`);
    expect(newUrlBeforeChange.href).toBe(
      `https://capacitorjs.com/page-1#hash-change`,
    );
    expect(oldUrlBeforeChange.href).toBe(`https://capacitorjs.com/page-1`);
  });

  it('push then pop', async () => {
    const { router, state } = createWindowRouter(win, doc, loc, hstry, opts);
    renderSwitch(router);

    await router.push('/page-2');
    renderSwitch(router);
    expect(state.views).toHaveLength(1);
    expect(router.path).toBe(`/page-2`);

    Object.assign(loc, new URL(`https://capacitorjs.com/page-1`));
    await popState(null);
    renderSwitch(router);
    expect(state.views).toHaveLength(1);

    expect(state.href).toBe('https://capacitorjs.com/page-1');
    expect(router.path).toBe(`/page-1`);
  });

  it('push', async () => {
    const { router, state } = createWindowRouter(win, doc, loc, hstry, opts);
    let newUrlChange: URL;
    let oldUrlChange: URL;
    let newUrlBeforeChange: URL;
    let oldUrlBeforeChange: URL;
    router.on('change', (n, o) => {
      newUrlChange = n;
      oldUrlChange = o;
    });
    router.on('beforechange', (n, o) => {
      newUrlBeforeChange = n;
      oldUrlBeforeChange = o;
    });
    expect(state.views).toHaveLength(0);

    renderSwitch(router);
    expect(state.href).toBe(`https://capacitorjs.com/page-1`);
    expect(router.path).toBe(`/page-1`);
    expect(state.views).toHaveLength(1);

    win.scrollX = 50;
    win.scrollY = 100;

    await router.push('/page-2');
    renderSwitch(router);
    expect(state.views).toHaveLength(1);
    expect(state.href).toBe(`https://capacitorjs.com/page-2`);
    expect(router.path).toBe(`/page-2`);

    expect(win.scrollX).toBe(0);
    expect(win.scrollY).toBe(0);

    expect(newUrlChange.pathname).toBe(`/page-2`);
    expect(oldUrlChange.pathname).toBe(`/page-1`);
    expect(newUrlBeforeChange.pathname).toBe(`/page-2`);
    expect(oldUrlBeforeChange.pathname).toBe(`/page-1`);
  });

  it('set state', () => {
    const { router, state } = createWindowRouter(win, doc, loc, hstry, opts);
    let newUrlChange: URL;
    let oldUrlChange: URL;
    let newUrlBeforeChange: URL;
    let oldUrlBeforeChange: URL;
    router.on('change', (n, o) => {
      newUrlChange = n;
      oldUrlChange = o;
    });
    router.on('beforechange', (n, o) => {
      newUrlBeforeChange = n;
      oldUrlBeforeChange = o;
    });

    renderSwitch(router);

    expect(state.views).toHaveLength(1);
    expect(state.href).toBe(`https://capacitorjs.com/page-1`);
    expect(state.path).toBe(`/page-1`);
    expect(router.path).toBe(`/page-1`);
    expect(router.hash).toBe(``);
    expect(win.scrollX).toBe(0);
    expect(win.scrollY).toBe(0);

    expect(newUrlChange).toBeUndefined();
    expect(oldUrlChange).toBeUndefined();
    expect(newUrlBeforeChange).toBeUndefined();
    expect(oldUrlBeforeChange).toBeUndefined();
  });
});

function TestRoute(props: { path: string }) {
  return Route(props, [], null) as any;
}
