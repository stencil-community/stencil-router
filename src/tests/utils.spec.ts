import { normalizePathname, shouldPushState } from '../utils/helpers';

describe('utils', () => {
  it('shouldPushState if search are different', () => {
    const loc = new URL('https://stenciljs.com/page-1?qs=1');
    const newUrl = new URL('https://stenciljs.com/page-1?qs=2');
    expect(shouldPushState(loc, newUrl)).toBe(true);
  });

  it('shouldPushState if pathnames are different', () => {
    const loc = new URL('https://stenciljs.com/');
    const newUrl = new URL('https://stenciljs.com/page-1');
    expect(shouldPushState(loc, newUrl)).toBe(true);
  });

  it('shouldPushState false if same pathname but different hash', () => {
    const loc = new URL('https://stenciljs.com/page-1');
    const newUrl = new URL('https://stenciljs.com/page-1#hash');
    expect(shouldPushState(loc, newUrl)).toBe(false);
  });

  it('shouldPushState if different pathname and different hash', () => {
    const loc = new URL('https://stenciljs.com/page-1#hash');
    const newUrl = new URL('https://stenciljs.com/page-2#hash-change');
    expect(shouldPushState(loc, newUrl)).toBe(true);
  });

  it('shouldPushState false if same pathname and same hash', () => {
    const loc = new URL('https://stenciljs.com/page-1#hash');
    const newUrl = new URL('https://stenciljs.com/page-1#hash');
    expect(shouldPushState(loc, newUrl)).toBe(false);
  });

  it('shouldPushState false if same pathname and same search', () => {
    const loc = new URL('https://stenciljs.com/page-1?qs=1');
    const newUrl = new URL('https://stenciljs.com/page-1?qs=1');
    expect(shouldPushState(loc, newUrl)).toBe(false);
  });

  it('shouldPushState false if same pathname', () => {
    const loc = new URL('https://stenciljs.com/page-1');
    const newUrl = new URL('https://stenciljs.com/page-1');
    expect(shouldPushState(loc, newUrl)).toBe(false);
  });

  it('normalizePathname', () => {
    expect(normalizePathname(new URL('https://stenciljs.com/'))).toBe('/');
    expect(normalizePathname(new URL('https://stenciljs.com/pathname'))).toBe(
      '/pathname',
    );
    expect(normalizePathname(new URL('https://stenciljs.com/PaThName'))).toBe(
      '/pathname',
    );
    expect(
      normalizePathname(
        new URL('https://stenciljs.com/PaThName?search=qs#hash'),
      ),
    ).toBe('/pathname');
  });
});
