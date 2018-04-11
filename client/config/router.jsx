import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { inject, observer } from 'mobx-react';

import TopicList from '../views/topicList/index';
import TopicDetail from '../views/topicDetail/index';
import ApiTest from '../views/test/apiTest';
import Login from '../views/user/login';
import UserInfo from '../views/user/info';

const PrivateRoute = ({ isLogin, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      isLogin
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/user/login', search: `?from=${rest.path}` }} />
    )}
  />
);

const InjectedPrivateRoute = withRouter(inject(stores => ({
  isLogin: stores.appState.user.isLogin,
}))(observer(PrivateRoute)));

PrivateRoute.propTypes = {
  component: PropTypes.element.isRequired,
  isLogin: PropTypes.bool,
};
PrivateRoute.defaultProps = {
  isLogin: false,
};

export default () => [
  <Route key="root" exact path="/" push="true" render={() => <Redirect to="/list" />} />,
  <Route key="index" path="/index" push="true" component={TopicList} />,
  <Route key="list" path="/list" component={TopicList} />,
  <Route key="detail" path="/detail/:id" component={TopicDetail} />,
  <Route key="apiTest" path="/test" component={ApiTest} />,
  <Route key="login" path="/user/login" component={Login} />,
  <InjectedPrivateRoute key="userInfo" path="/user/info" component={UserInfo} />,
];
