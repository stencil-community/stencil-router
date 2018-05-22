import { Listener, RouteSubscription, MatchResults, LocationSegments } from './interfaces';
import { shallowEqual } from '../utils/shallow-equal';

function addListener(location: LocationSegments, listeners: RouteSubscription[], routeSubscription: RouteSubscription) {
  const match = routeSubscription.isMatch(location.pathname);
  routeSubscription.lastMatch = match;
  routeSubscription.listener(match);

  listeners.push(routeSubscription);
  listeners.sort((a: RouteSubscription, b: RouteSubscription) => {
    if (a.groupId < b.groupId) {
      return -1;
    }
    if (a.groupId > b.groupId) {
      return 1;
    }
    if (a.groupIndex < b.groupIndex) {
      return -1;
    }
    if (a.groupIndex > b.groupIndex) {
      return 1;
    }
    return 0;
  });
}

/**
 * Subscribe to the router for changes
 * The callback that is returned should be used to unsubscribe.
 */
export function subscribeGroupMember(location: LocationSegments, listeners: RouteSubscription[], routeSubscription: RouteSubscription): Listener {

  addListener(location, listeners, routeSubscription);

  let isSubscribed = true;

  return function unsubscribe() {
    if (!isSubscribed) {
      return;
    }

    const index = listeners.indexOf(routeSubscription);
    listeners.splice(index, 1);

    isSubscribed = false;
  };
}

export async function dispatchToGroupMembers(location: LocationSegments, listeners: RouteSubscription[]) {
  const matchList: [ number, MatchResults, string ][] = [];
  const pathname = location.pathname;

  // Assume listeners are ordered by group and then groupIndex
  for (let i = 0; i < listeners.length; i++) {
    let match = null;

    const isGroupMatch = matchList.some(me => {
      return me[1] != null && me[2] != null && me[2] === listeners[i].groupId;
    });

    // If listener has a groupId and group already has a match then don't check
    if (!isGroupMatch) {
      match = listeners[i].isMatch(pathname);

    // If listener does not have a group then just check if it matches
    } else {
      match = null;
    }

    if (!shallowEqual(listeners[i].lastMatch, match)) {
      if (!isGroupMatch && listeners[i].groupId) {
        matchList.unshift([i, match, listeners[i].groupId]);
      } else {
        matchList.push([i, match, listeners[i].groupId]);
      }
    }
    listeners[i].lastMatch = match;
  }

  for (const [listenerIndex, matchResult] of matchList) {
    if (matchResult != null) {
      await listeners[listenerIndex].listener(matchResult);
    } else {
      listeners[listenerIndex].listener(matchResult);
    }
  }
}
