import { createProviderConsumer } from '@stencil/state-tunnel';
import { LocationSegments, RouterHistory } from './interfaces';

export interface ActiveRouterState {
  location: LocationSegments;
  titleSuffix: string;
  root: string;
  history: RouterHistory;
  subscribeGroupMember: any;
  createSubscriptionGroup: (groupId: string, groupSize: number) => void;
}

export default createProviderConsumer<ActiveRouterState>({
  location: null,
  titleSuffix: '',
  root: '/',
  history: null,
  subscribeGroupMember: () => {},
  createSubscriptionGroup: () => {}
});
