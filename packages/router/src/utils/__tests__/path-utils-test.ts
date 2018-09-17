import {
  hasBasename,
  stripBasename,
  stripTrailingSlash,
  addLeadingSlash,
  stripLeadingSlash,
  stripPrefix,
  parsePath,
  createPath
} from '../path-utils';

describe('path-utils', () => {
  describe('hasBasename', () => {

    it('should return true when is basename', () => {
      const resp = hasBasename('/base/path', '/base');
      expect(resp).toBeTruthy();
    });
    it('should return false when is not a  basename', () => {
      const resp = hasBasename('/base/path', '/src');
      expect(resp).toBeFalsy();
    });

  });

  describe('stripBasename', () => {

    it('should strip if basename supplied is basename', () => {
      const resp = stripBasename('/base/path', '/base');
      expect(resp).toEqual('/path');
    });
    it('should not strip if basename supplied it is not a basename', () => {
      const resp = stripBasename('/base/path', '/');
      expect(resp).toEqual('/base/path');
    });

  });

  describe('stripTrailingSlash', () => {

    it('should strip a trailing slash', () => {
      const resp = stripTrailingSlash('/base/path/');
      expect(resp).toEqual('/base/path');
    });
    it('should not strip last char if there is no trailing slash', () => {
      const resp = stripTrailingSlash('/base/path');
      expect(resp).toEqual('/base/path');
    });

  });
  describe('addLeadingSlash', () => {

    it('should add a first slash', () => {
      const resp = addLeadingSlash('base/path');
      expect(resp).toEqual('/base/path');
    });
    it('should not add a first slash if string already has one', () => {
      const resp = addLeadingSlash('/base/path');
      expect(resp).toEqual('/base/path');
    });

  });

  describe('stripLeadingSlash', () => {

    it('should strip first slash', () => {
      const resp = stripLeadingSlash('/base/path');
      expect(resp).toEqual('base/path');
    });
    it('should not strip first char is not a slash', () => {
      const resp = stripLeadingSlash('base/path');
      expect(resp).toEqual('base/path');
    });

  });
  describe('stripPrefix', () => {

    it('should strip prefix', () => {
      const resp = stripPrefix('/base/path', '/ba');
      expect(resp).toEqual('se/path');
    });
    it('should not strip if does not begin with prefix', () => {
      const resp = stripPrefix('/base/path', 'bas');
      expect(resp).toEqual('/base/path');
    });

  });
  describe('parsePath', () => {

    it('should parse a simple url path', () => {
      const resp = parsePath('/base/path');
      expect(resp).toEqual({
        pathname: '/base/path',
        search: '',
        hash: '',
        key: '',
        query: {}
      });
    });
    it('should parse a simple url path with search', () => {
      const resp = parsePath('/base/path?a=1&b=2');
      expect(resp).toEqual({
        pathname: '/base/path',
        search: '?a=1&b=2',
        hash: '',
        key: '',
        query: {}
      });
    });
    it('should parse a simple url path with hash', () => {
      const resp = parsePath('/base/path#blue');
      expect(resp).toEqual({
        pathname: '/base/path',
        search: '',
        hash: '#blue',
        key: '',
        query: {}
      });
    });
    it('should parse a url path with hash and search', () => {
      const resp = parsePath('/base/path?a=1&b=2#blue');
      expect(resp).toEqual({
        pathname: '/base/path',
        search: '?a=1&b=2',
        hash: '#blue',
        key: '',
        query: {}
      });
    });

  });
  describe('createPath', () => {

    it('should parse a simple url path', () => {
      const resp = createPath({
        pathname: '/base/path',
        search: '',
        hash: '',
        query: {},
        key: ''
      });
      expect(resp).toEqual('/base/path');
    });
    it('should parse a simple url path with search', () => {
      const resp = createPath({
        pathname: '/base/path',
        search: '?a=1&b=2',
        hash: '',
        query: {},
        key: ''
      });
      expect(resp).toEqual('/base/path?a=1&b=2');
    });
    it('should parse a simple url path with hash', () => {
      const resp = createPath({
        pathname: '/base/path',
        search: '',
        hash: '#blue',
        query: {},
        key: ''
      });
      expect(resp).toEqual('/base/path#blue');
    });
    it('should parse a url path with hash and search', () => {
      const resp = createPath({
        pathname: '/base/path',
        search: '?a=1&b=2',
        hash: '#blue',
        query: {},
        key: ''
      });
      expect(resp).toEqual('/base/path?a=1&b=2#blue');
    });

  });
});
