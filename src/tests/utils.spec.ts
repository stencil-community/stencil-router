import { normalizePathname, shouldPushState } from '../utils/helpers';
import { match } from '../utils/match';

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

  it('should return a match function', () => {
    expect(match('/one')).toBeInstanceOf(Function);
  });

  it('should match exact', () => {
    expect(match('/one', { exact: true })('/one')).toMatchObject({});
    expect(match('/one', { exact: true })('/one/')).toMatchObject({});
    expect(match('/one', { exact: true })('/one/two')).toBeUndefined();
    expect(match('/one', { exact: false })('/one/two')).toMatchObject({});
  });

  it('should match strict', () => {
    expect(match('/one/', { strict: true })('/one')).toBeUndefined();
    expect(match('/one/', { strict: true })('/one/')).toMatchObject({});
    expect(match('/one/', { strict: true })('/one/two')).toMatchObject({});
    expect(match('/one/', { strict: false })('/one')).toMatchObject({});
  });

  it('should match exact strict', () => {
    expect(match('/one', { exact: true, strict: true })('/one')).toMatchObject({});
    expect(match('/one', { exact: true, strict: true })('/one/')).toBeUndefined();
    expect(match('/one', { exact: true, strict: true })('/one/two')).toBeUndefined();
  });

  it('should match tokens', () => {
    expect(match('/users/:id')('/users/1')).toMatchObject({ id: '1' });
  });

  it('should match an array', () => {
    expect(match(['/one', '/two'])('/one')).toMatchObject({});
    expect(match(['/one', '/two'])('/two')).toMatchObject({});
    expect(match(['/one', '/two'])('/three')).toBeUndefined();
  });

  it('should match a regexp', () => {
    expect(match(/^\/one/)('/one')).toMatchObject({});
    expect(match(/^\/one/)('/two')).toBeUndefined();
    expect(match(/^\/two/)('/one')).toBeUndefined();
    expect(match(/^\/two/)('/two')).toMatchObject({});
  });
});
