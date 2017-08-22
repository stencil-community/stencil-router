const PopStateEventName = 'popstate';

export default function createHistory() {
  const globalHistory = window.history;
  const { addEventListener } = window;

  function navigateTo(path: string, params: { [key: string]: any } = {}) {
    globalHistory.pushState(params, params.title, path || '/');
    return {
      url: path,
      params
    };
  }

  function replace(path, state) {
    globalHistory.replaceState({state}, null, path);
  }

  function go(n: number) {
    globalHistory.go(n)
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  function handlePopState(event: PopStateEvent) {

  }

  addEventListener(PopStateEventName, handlePopState)

  return {
    navigateTo,
    replace,
    go,
    goBack,
    goForward
  };
}
