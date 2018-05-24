import { createProviderConsumer } from '@stencil/state-tunnel';
import { LocationSegments, RouterHistory } from './interfaces';

export interface State {
  location: LocationSegments;
  titleSuffix: string;
  root: string;
  history: RouterHistory;
  subscribeGroupMember: any;
  createSubscriptionGroup: (groupId: string, groupSize: number) => void;
}

export default createProviderConsumer<State>({
  location: null,
  titleSuffix: '',
  root: '/',
  history: null,
  subscribeGroupMember: () => {},
  createSubscriptionGroup: () => {}
});
