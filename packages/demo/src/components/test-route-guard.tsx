import { Component, ComponentInterface, Prop, State } from '@stencil/core';
import { RouterHistory, MatchResults } from '@stencil/router';

@Component({
  tag: 'test-route-guard'
})
export class TestRouteGuard implements ComponentInterface {

  @Prop() pages?: string[];
  @Prop() match: MatchResults | null = null;
  @Prop() history?: RouterHistory;

  @State() routeGuardBlock?: () => void;

  toggleRouteGuard = () => {
    if (this.routeGuardBlock != null) {
      this.routeGuardBlock();
    } else if (this.history) {
      this.routeGuardBlock = this.history.block('oh you got blocked');
    }
  }

  render() {
    const currentlyBlocked = this.routeGuardBlock != null;
    return (
      <div>
        {currentlyBlocked ?
          <span>You are currently blocked</span> :
          <span>Go freely about your business</span>
        }
        <br/>
        <br/>
        <button onClick={this.toggleRouteGuard}>
          {currentlyBlocked ? 'Unblock' : 'Block'}
        </button>
        <br/>
        <br/>
        <stencil-route-link url="/demo6/asdf">Next</stencil-route-link>
      </div>
    );
  }
}
