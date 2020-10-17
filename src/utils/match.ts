import { Key, Path, pathToRegexp } from './path-to-regex';

export interface MatchOptions {
  exact?: boolean;
  strict?: boolean;
}

interface CompileOptions {
  end: boolean;
  strict: boolean;
}

let cacheCount = 0;
const patternCache: { [key: string]: any } = {};
const cacheLimit = 10000;

// Memoized function for creating the path match regex
const compilePath = (pattern: Path, options: CompileOptions): { re: RegExp; keys: Key[] } => {
  const cacheKey = `${options.end}${options.strict}`;
  const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});
  const cachePattern = JSON.stringify(pattern);

  if (cache[cachePattern]) {
    return cache[cachePattern];
  }

  const keys: Key[] = [];
  const re = pathToRegexp(pattern, keys, options);
  const compiledPattern = { re, keys };

  if (cacheCount < cacheLimit) {
    cache[cachePattern] = compiledPattern;
    cacheCount += 1;
  }

  return compiledPattern;
};

export const match = (pathname: string, options: MatchOptions = {}) => {
  const { exact = false, strict = false } = options;
  const { re, keys } = compilePath(pathname, { end: exact, strict });
  return (path: string) => {
    const match = re.exec(path);
    if (!match) {
      return undefined;
    }
    const [url, ...values] = match;
    if (exact && path !== url) {
      return undefined;
    }
    return keys.reduce((memo, key: Key, index) => {
      memo[key.name] = values[index];
      return memo;
    }, {} as { [key: string]: string });
  };
};

export const matchAny = (pathnames: string[], options: MatchOptions = {}) => {
  const matchFns = pathnames.map(pathname => match(pathname, options));
  return (path: string) => {
    let result: { [key: string]: string } | undefined;
    for (const matchFn of matchFns) {
      result = matchFn(path);
      if (result) {
        break;
      }
    }
    return result;
  };
};
