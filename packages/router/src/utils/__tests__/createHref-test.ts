import createBrowserHistory from '../createBrowserHistory';
import createHashHistory from '../createHashHistory';
import { RouterHistory } from '../../global/interfaces';

describe('a browser history', () => {
  describe('with no basename', () => {
    let history: RouterHistory;
    beforeEach(() => {
      history = createBrowserHistory(window);
    });

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash',
        query: {},
        key: ''
      });

      expect(href).toEqual('/the/path?the=query#the-hash');
    });
  });

  describe('with a basename', () => {
    let history: RouterHistory;
    beforeEach(() => {
      history = createBrowserHistory(window, { basename: '/the/base' });
    });

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash',
        query: {},
        key: ''
      });

      expect(href).toEqual('/the/base/the/path?the=query#the-hash');
    });
  });

  describe('with a bad basename', () => {
    let history: RouterHistory;
    beforeEach(() => {
      history = createBrowserHistory(window, { basename: '/the/bad/base/' });
    });

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash',
        query: {},
        key: ''
      });

      expect(href).toEqual('/the/bad/base/the/path?the=query#the-hash');
    });
  });

  describe('with a slash basename', () => {
    let history: RouterHistory;
    beforeEach(() => {
      history = createBrowserHistory(window, { basename: '/' });
    });

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash',
        query: {},
        key: ''
      });

      expect(href).toEqual('/the/path?the=query#the-hash');
    });
  });

  describe('encoding', () => {
    let history: RouterHistory;
    beforeEach(() => {
      history = createBrowserHistory(window);
    });

    it('does not encode the generated path', () => {
      // encoded
      const encodedHref = history.createHref({
        pathname: '/%23abc',
        query: {},
        key: ''
      });
      // unencoded
      const unencodedHref = history.createHref({
        pathname: '/#abc',
        query: {},
        key: ''
      });

      expect(encodedHref).toEqual('/%23abc');
      expect(unencodedHref).toEqual('/#abc');
    });
  });
});

describe('a hash history', () => {
  describe('with default encoding', () => {
    let history: RouterHistory;
    beforeEach(() => {
      history = createHashHistory(window);
    });

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash',
        query: {},
        key: ''
      });

      expect(href).toEqual('#/the/path?the=query#the-hash');
    });
  });

  describe('with hashType="noslash"', () => {
    let history: RouterHistory;
    beforeEach(() => {
      history = createHashHistory(window, { hashType: 'noslash' });
    });

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash',
        query: {},
        key: ''
      });

      expect(href).toEqual('#the/path?the=query#the-hash');
    });
  });

  describe('with hashType="hashbang"', () => {
    let history: RouterHistory;
    beforeEach(() => {
      history = createHashHistory(window, { hashType: 'hashbang' });
    });

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash',
        query: {},
        key: ''
      });

      expect(href).toEqual('#!/the/path?the=query#the-hash');
    });
  });

  describe('with a basename', () => {
    let history: RouterHistory;
    beforeEach(() => {
      history = createHashHistory(window, { basename: '/the/base' });
    });

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        query: {},
        key: ''
      });

      expect(href).toEqual('#/the/base/the/path?the=query');
    });
  });

  describe('with a bad basename', () => {
    let history: RouterHistory;
    beforeEach(() => {
      history = createHashHistory(window, { basename: '/the/bad/base/' });
    });

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        query: {},
        key: ''
      });

      expect(href).toEqual('#/the/bad/base/the/path?the=query');
    });
  });

  describe('with a slash basename', () => {
    let history: RouterHistory;
    beforeEach(() => {
      history = createHashHistory(window, { basename: '/' });
    });

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        query: {},
        key: ''
      });

      expect(href).toEqual('#/the/path?the=query');
    });
  });

  describe('encoding', () => {
    let history: RouterHistory;
    beforeEach(() => {
      history = createHashHistory(window);
    });

    it('does not encode the generated path', () => {
      // encoded
      const encodedHref = history.createHref({
        pathname: '/%23abc',
        query: {},
        key: ''
      });
      // unencoded
      const unencodedHref = history.createHref({
        pathname: '/#abc',
        query: {},
        key: ''
      });

      expect(encodedHref).toEqual('#/%23abc');
      expect(unencodedHref).toEqual('#/#abc');
    });
  });
});
