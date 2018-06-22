import { createProviderConsumer } from '@stencil/state-tunnel';
import { LocationSegments, RouterHistory } from './interfaces';

export interface ActiveRouterState {
  location: LocationSegments;
  titleSuffix: string;
  root: string;
  history: RouterHistory;
}

export default createProviderConsumer<ActiveRouterState>({
  location: null,
  titleSuffix: '',
  root: '/',
  history: null
});
