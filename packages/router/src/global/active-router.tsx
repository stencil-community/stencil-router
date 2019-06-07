import { h } from '@stencil/core';
import { createProviderConsumer } from '@stencil/state-tunnel';
import { LocationSegments, RouterHistory, RouteViewOptions, HistoryType } from './interfaces';


export interface ActiveRouterState {
  historyType: HistoryType;
  location: LocationSegments;
  titleSuffix: string;
  root: string;
  history?: RouterHistory;
  routeViewsUpdated: (options: RouteViewOptions) => void;
}

export default createProviderConsumer<ActiveRouterState>({
  historyType: 'browser',
  location: {
    pathname: '',
    query: {},
    key: ''
  },
  titleSuffix: '',
  root: '/',
  routeViewsUpdated: () => {}
},
(subscribe, child) => (
  <context-consumer subscribe={subscribe} renderer={child} />
));
