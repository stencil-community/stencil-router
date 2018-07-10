import { createProviderConsumer } from '@stencil/state-tunnel';
import { LocationSegments, RouterHistory, RouteViewOptions } from './interfaces';


export interface ActiveRouterState {
  location: LocationSegments;
  titleSuffix: string;
  root: string;
  history: RouterHistory;
  routeViewsUpdated: (options: RouteViewOptions) => void;
}

export default createProviderConsumer<ActiveRouterState>({
  location: null,
  titleSuffix: '',
  root: '/',
  history: null,
  routeViewsUpdated: () => {}
});
