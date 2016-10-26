import * as React from 'react';
import { connect } from 'react-redux';
import { Router as ReactRouter, Route, IndexRoute } from 'react-router';

import { isLoggedIn } from '../lib/auth';
import { getInfo } from '../actions/user';

import Root from './Root';
import UserRoot from './UserRoot';
import Home from './Home';
import Dashboard from './Dashboard';

interface Props {
  history: ReactRouterRedux.ReactRouterReduxHistory;
  onGetUser?: () => void;
}

export class Router extends React.Component<Props, {}> {
  componentWillMount() {
    // Remove #_=_ from url
    if (window.location.hash == '#_=_') {
      history.replaceState
        ? history.replaceState(null, null, window.location.href.split('#')[0])
        : window.location.hash = '';
    }
  }

  requireAuth = (nextState, replace) => {
    if (!isLoggedIn())
      replace('/');
  }

  handleEnter = (nextState, replace) => {
    if (isLoggedIn)
      this.props.onGetUser();
  }

  handleEnterHome = (nextState, replace) => {
    if (isLoggedIn())
      replace('/dashboard');
  }

  render() {
    const { history } = this.props;
    return (
      <ReactRouter history={history as any}>
        <Route path="/" component={Root} onEnter={this.handleEnter}>
          <IndexRoute component={Home} onEnter={this.handleEnterHome} />
          <Route component={UserRoot} onEnter={this.requireAuth}>
            <Route path="/dashboard" component={Dashboard} />
          </Route>
        </Route>
      </ReactRouter>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    onGetUser: () => dispatch(getInfo())
  };
};

const RouterContainer = connect(mapStateToProps, mapDispatchToProps)(Router);
export default RouterContainer;
