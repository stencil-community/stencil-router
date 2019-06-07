import { LocationSegments } from '../global/interfaces';

export const hasBasename = (path: string, prefix: string) => {
  return (new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i')).test(path);
}

export const stripBasename = (path: string, prefix: string) => {
  return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
}

export const stripTrailingSlash = (path: string) => {
  return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
}

export const addLeadingSlash = (path: string) => {
  return path.charAt(0) === '/' ? path : '/' + path;
}

export const stripLeadingSlash = (path: string) => {
  return path.charAt(0) === '/' ? path.substr(1) : path;
}

export const stripPrefix = (path: string, prefix: string) => {
  return path.indexOf(prefix) === 0 ? path.substr(prefix.length) : path;
}

export const parsePath = (path: string): LocationSegments => {
  let pathname = path || '/';
  let search = '';
  let hash = '';

  const hashIndex = pathname.indexOf('#');
  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex);
    pathname = pathname.substr(0, hashIndex);
  }

  const searchIndex = pathname.indexOf('?');
  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex);
    pathname = pathname.substr(0, searchIndex);
  }

  return {
    pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash,
    query: {},
    key: ''
  };
}

export const createPath = (location: LocationSegments) => {
  const { pathname, search, hash } = location;
  let path = pathname || '/';

  if (search && search !== '?') {
    path += (search.charAt(0) === '?' ? search : `?${search}`);
  }

  if (hash && hash !== '#') {
    path += (hash.charAt(0) === '#' ? hash : `#${hash}`);
  }

  return path;
}

export const parseQueryString = (query: string) => {
  if (!query) {
    return { };
  }

  return (/^[?#]/.test(query) ? query.slice(1) : query)
    .split('&')
    .reduce((params, param) => {
      let [ key, value ] = param.split('=');
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
      return params;
    }, {} as { [key: string]: any });
};
