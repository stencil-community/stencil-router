import ActiveRouter from './active-router';

export default function injectHistory(Component: any) {
  ActiveRouter.injectProps(Component, ['history', 'location']);
}
