import {
  resolvePathname,
  createLocation,
  valueEqual
} from '../location-utils';

describe('resolvePathname', () => {
  it('works when from is not given', () => {
    expect(resolvePathname('c')).toEqual('c');
  });

  it('works when from is relative', () => {
    expect(resolvePathname('c', 'a/b')).toEqual('a/c');
  });

  it('works when to is absolute', () => {
    expect(resolvePathname('/c', '/a/b')).toEqual('/c');
  });

  it('works when to is empty', () => {
    expect(resolvePathname('', '/a/b')).toEqual('/a/b');
  });

  it('works when to is a sibling of the parent', () => {
    expect(resolvePathname('../c', '/a/b')).toEqual('/c');
  });

  it('works when to is a sibling path', () => {
    expect(resolvePathname('c', '/a/b')).toEqual('/a/c');
  });

  it('works when from is an index path', () => {
    expect(resolvePathname('c', '/a/')).toEqual('/a/c');
  });

  it('works when to points to the parent directory', () => {
    expect(resolvePathname('..', '/a/b')).toEqual('/');
  });

  // Copied from node's test/parallel/test-url.js
  const nodeURLResolveTestCases = [
    ['/foo/bar/baz', 'quux', '/foo/bar/quux'],
    ['/foo/bar/baz', 'quux/asdf', '/foo/bar/quux/asdf'],
    ['/foo/bar/baz', 'quux/baz', '/foo/bar/quux/baz'],
    ['/foo/bar/baz', '../quux/baz', '/foo/quux/baz'],
    ['/foo/bar/baz', '/bar', '/bar'],
    ['/foo/bar/baz/', 'quux', '/foo/bar/baz/quux'],
    ['/foo/bar/baz/', 'quux/baz', '/foo/bar/baz/quux/baz'],
    ['/foo/bar/baz', '../../../../../../../../quux/baz', '/quux/baz'],
    ['/foo/bar/baz', '../../../../../../../quux/baz', '/quux/baz'],
    ['/foo', '.', '/'],
    ['/foo', '..', '/'],
    ['/foo/', '.', '/foo/'],
    ['/foo/', '..', '/'],
    ['/foo/bar', '.', '/foo/'],
    ['/foo/bar', '..', '/'],
    ['/foo/bar/', '.', '/foo/bar/'],
    ['/foo/bar/', '..', '/foo/'],
    ['foo/bar', '../../../baz', '../../baz'],
    ['foo/bar/', '../../../baz', '../baz'],
    ['/foo/bar/baz', '/../etc/passwd', '/etc/passwd'],
  ];

  nodeURLResolveTestCases.forEach(([from, to, expected]) => {
    it(`resolvePathname('${to}', '${from}') == '${expected}'`, () => {
      expect(resolvePathname(to, from)).toEqual(expected);
    });
  });
});

describe('createLocation', () => {
  describe('with a full path', () => {
    describe('given as a string', () => {
      it('has the correct properties', () => {
        expect(createLocation('/the/path?the=query#the-hash', undefined, '')).toEqual({
          pathname: '/the/path',
          search: '?the=query',
          hash: '#the-hash',
          query: {
            'the': 'query'
          },
          key: '',
        });
      });
    });

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(createLocation({ pathname: '/the/path', search: '?the=query', hash: '#the-hash', query: {}, key: '' }, undefined, '')).toEqual({
          pathname: '/the/path',
          search: '?the=query',
          hash: '#the-hash',
          query: {
            'the': 'query'
          },
          key: '',
        });
      });
    });
  });

  describe('with a relative path', () => {
    describe('given as a string', () => {
      it('has the correct properties', () => {
        expect(createLocation('the/path?the=query#the-hash', undefined, '')).toEqual({
          pathname: 'the/path',
          search: '?the=query',
          hash: '#the-hash',
          query: {
            'the': 'query'
          },
          key: '',
        });
      });
    });

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(createLocation({ pathname: 'the/path', search: '?the=query', hash: '#the-hash', query: {}, key: '' }, undefined, '')).toEqual({
          pathname: 'the/path',
          search: '?the=query',
          hash: '#the-hash',
          query: {
            'the': 'query'
          },
          key: '',
        });
      });
    });
  });

  describe('with a path with no pathname', () => {
    describe('given as a string', () => {
      it('has the correct properties', () => {
        expect(createLocation('?the=query#the-hash', undefined, '')).toEqual({
          pathname: '/',
          search: '?the=query',
          hash: '#the-hash',
          query: {
            'the': 'query'
          },
          key: ''
        });
      });
    });

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(createLocation({ pathname: '/', search: '?the=query', hash: '#the-hash', query: {}, key: '' }, undefined, '')).toEqual({
          pathname: '/',
          search: '?the=query',
          hash: '#the-hash',
          query: {
            'the': 'query'
          },
          key: '',
        });
      });
    });
  });

  describe('with a path with no search', () => {
    describe('given as a string', () => {
      it('has the correct properties', () => {
        expect(createLocation('/the/path#the-hash', undefined, '')).toEqual({
          pathname: '/the/path',
          search: '',
          hash: '#the-hash',
          query: {},
          key: '',
        });
      });
    });

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(createLocation({ pathname: '/the/path', hash: '#the-hash', query: {}, key: '' }, undefined, '')).toEqual({
          pathname: '/the/path',
          hash: '#the-hash',
          query: {},
          key: '',
        });
      });
    });
  });

  describe('with a path with no hash', () => {
    describe('given as a string', () => {
      it('has the correct properties', () => {
        expect(createLocation('/the/path?the=query', undefined, '')).toEqual({
          pathname: '/the/path',
          search: '?the=query',
          query: {
            'the': 'query'
          },
          key: '',
          hash: ''
        });
      });
    });

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(createLocation({ pathname: '/the/path', search: '?the=query', query: {}, key: '' }, undefined, '')).toEqual({
          pathname: '/the/path',
          search: '?the=query',
          query: {
            'the': 'query'
          },
          key: '',
        });
      });
    });
  });

  describe('with a path that cannot be decoded', () => {

    describe('given as a string', () => {
      it('throws custom message when decodeURI throws a URIError', () => {
        expect(() => {
          createLocation('/test%', null, '');
        }).toThrow('Pathname "/test%" could not be decoded.');
      });
    });

    describe('given as an object', () => {
      it('throws custom message when decodeURI throws a URIError', () => {
        expect(() => {
          createLocation({ pathname: '/test%', query: {}, key: '' }, undefined, '');
        }).toThrow('Pathname "/test%" could not be decoded.');
      });
    });
  });

  describe('key', () => {
    it('has a key property if a key is provided', () => {
      const location = createLocation('/the/path', undefined, 'key');
      expect(location).toHaveProperty('key');
    });
  });

  describe('with a state value', () => {
    describe('given as the second parameter', () => {
      it('has a matching property', () => {
        const location = createLocation('/a/path', { foo: 'bar' }, '');
        expect(location).toHaveProperty('state');
        expect(location.state).toEqual({ foo: 'bar' });
      });
    });

    describe('given as an object property of the first parameter', () => {
      it('has the correct property', () => {
        const location = createLocation({
          pathname: '/a/path',
          state: { foo: 'bar' },
          key: '',
          query: {},
        }, undefined, '');
        expect(location).toHaveProperty('state');
        expect(location.state).toEqual({ foo: 'bar' });
      });
    });
  });

  describe('with an undefined state value', () => {
    describe('given as the second parameter', () => {
      it('does not have the state property', () => {
        const location = createLocation('/a/path', undefined, '');
        expect(location).not.toHaveProperty('state');
      });
    });

    describe('given as an object property of the first parameter', () => {
      it('does not have the state property', () => {
        const location = createLocation({
          pathname: '/a/path',
          key: '',
          query: {},
        }, undefined, '');
        expect(location).not.toHaveProperty('state');
      });
    });
  });
});

describe('valueEqual', () => {
  describe('undefined and null', () => {
    describe('when both are undefined', () => {
      it('returns true', () => {
        expect(valueEqual(undefined, undefined)).toBe(true);
      });
    });

    describe('when one is null', () => {
      it('returns false', () => {
        expect(valueEqual(undefined, null)).toBe(false);
      });
    });

    describe('when one is null and the other is an object', () => {
      it('returns false', () => {
        expect(valueEqual({}, null)).toBe(false);
        expect(valueEqual(null, {})).toBe(false);
      });
    });
  });

  describe('string primitives', () => {
    describe('that are equal', () => {
      it('returns true', () => {
        expect(valueEqual('asdf', 'asdf')).toBe(true);
      });
    });

    describe('that are not equal', () => {
      it('returns false', () => {
        expect(valueEqual('asdf', 'sdfg')).toBe(false);
      });
    });
  });

  describe('string objects', () => {
    describe('that are equal', () => {
      it('returns true', () => {
        expect(valueEqual(new String('asdf'), new String('asdf'))).toBe(true);
      });
    });

    describe('that are not equal', () => {
      it('returns false', () => {
        expect(valueEqual(new String('asdf'), new String('sdfg'))).toBe(false);
      });
    });
  });

  describe('number primitives', () => {
    describe('that are equal', () => {
      it('returns true', () => {
        expect(valueEqual(123.456, 123.456)).toBe(true);
      });
    });

    describe('that are not equal', () => {
      it('returns false', () => {
        expect(valueEqual(123.456, 123.567)).toBe(false);
      });
    });
  });

  describe('number objects', () => {
    describe('that are equal', () => {
      it('returns true', () => {
        expect(valueEqual(new Number(123.456), new Number(123.456))).toBe(true);
      });
    });

    describe('that are not equal', () => {
      it('returns false', () => {
        expect(valueEqual(new Number(123.456), new Number(123.567))).toBe(false);
      });
    });
  });

  describe('boolean primitives', () => {
    describe('that are equal', () => {
      it('returns true', () => {
        expect(valueEqual(true, true)).toBe(true);
      });
    });

    describe('that are not equal', () => {
      it('returns false', () => {
        expect(valueEqual(true, false)).toBe(false);
      });
    });
  });

  describe('boolean objects', () => {
    describe('that are equal', () => {
      it('returns true', () => {
        expect(valueEqual(new Boolean(true), new Boolean(true))).toBe(true);
      });
    });

    describe('that are not equal', () => {
      it('returns false', () => {
        expect(valueEqual(new Boolean(true), new Boolean(false))).toBe(false);
      });
    });
  });

  describe('date objects', () => {
    const now = Date.now()

    describe('that are equal', () => {
      it('returns true', () => {
        expect(valueEqual(new Date(now), new Date(now))).toBe(true);
      });
    });

    describe('that are not equal', () => {
      it('returns false', () => {
        expect(valueEqual(new Date(now), new Date(now + 1))).toBe(false);
      });
    });
  });

  describe('arrays', () => {
    describe('that are equal', () => {
      it('returns true', () => {
        expect(valueEqual([ 1, 2, 3 ], [ 1, 2, 3 ])).toBe(true);
      });
    });

    describe('that are not equal', () => {
      it('returns false', () => {
        expect(valueEqual([ 1, 2, 3 ], [ 2, 3, 4 ])).toBe(false);
      });
    });
  });

  describe('objects with different constructors but the same properties', () => {
    class A {
      constructor(public a: number, public b: number, public c: number) {}
    }
    class B {
      constructor(public a: number, public b: number, public c: number) {}
    }

    it('returns true', () => {
      expect(valueEqual(new A(1, 2, 3), new B(1, 2, 3))).toBe(true);
    });
  });
});
