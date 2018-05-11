import { createStore } from '../components/hoc/hoc';

export const router = createStore({
  defaultState: {
    message: 'Hello!'
  },
  setMessageAction (newValue: string) {
    this.setState({
      ...this.getState(),
      message: newValue
    });
  },
  clearMessageAction () {
    this.setMessageAction('');
  }
});

// This is just for testing purposes
(<any>window).router = router;
