import * as React from 'react';
import { connect } from 'react-redux';
import { Router as ReactRouter, Route, IndexRoute, Redirect } from 'react-router';

import { isLoggedIn } from '../lib/auth';
import { getUserInfo } from '../actions/users';

import Root from './Root';
import UserRoot from './UserRoot';
import Home from './Home';
import Dashboard from './Dashboard';
import PublicCheckpoint from './PublicCheckpoint';

interface Props {
  history: ReactRouterRedux.ReactRouterReduxHistory;
  shouldGetUser?: boolean;
  onGetUser?: () => void;
}

export class Router extends React.Component<Props, {}> {
  componentWillMount() {
    // Remove #_=_ from url
    if (window.location.hash == '#_=_') {
      history.replaceState
        ? history.replaceState(null, null, window.location.href.split('#')[0])
        : window.location.hash = '';
      return;
    }
  }

  requireAuth = (nextState, replace) => {
    if (!isLoggedIn())
      replace('/');
  };

  handleEnter = (nextState, replace) => {
    if (isLoggedIn() && nextState.pathname != '/')
      this.props.onGetUser();
  };

  handleEnterHome = (nextState, replace) => {
    if (isLoggedIn())
      replace('/dashboard');
  };

  render() {
    const { history } = this.props;
    return (
      <ReactRouter history={history as any}>
        <Route path="/" component={Root} onEnter={this.handleEnter}>
          <IndexRoute component={Home} onEnter={this.handleEnterHome} />
          <Route component={UserRoot} onEnter={this.requireAuth}>
            <Route path="/dashboard" component={Dashboard} />
          </Route>
          <Route path="/checkpoint/:userId/:checkpointId" component={PublicCheckpoint} />
        </Route>
        <Redirect from="*" to="/" />
      </ReactRouter>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    onGetUser: () => dispatch(getUserInfo())
  };
};

const RouterContainer = connect(mapStateToProps, mapDispatchToProps)(Router);
export default RouterContainer;
