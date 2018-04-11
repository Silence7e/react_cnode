import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import { inject, observer } from 'mobx-react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

import UserWrapper from './user';
import loginStyles from './styles/loginStyles';

@inject(stores => ({
  appState: stores.appState,
  user: stores.appState.user,
})) @observer
class UserLogin extends Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  constructor() {
    super();
    this.state = {
      accesstoken: '',
      helpText: '',
    };
  }

  componentWillMount() {
    if (this.props.user.isLogin) {
      this.context.router.history.replace('/user/info');
    }
  }

  getFromm(location = this.props.location) {
    const query = queryString.parse(location.search);
    return query.from || '/user/info';
  }

  handleInput(event) {
    this.setState({
      accesstoken: event.target.value.trim(),
    });
  }

  handleLogin() {
    if (!this.state.accesstoken) {
      return this.setState({
        helpText: '必须填写',
      });
    }
    this.setState({
      helpText: '',
    });
    return this.props.appState.login(this.state.accesstoken)
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { classes, user: { isLogin } } = this.props;
    const from = this.getFromm();
    if (isLogin) {
      return <Redirect to={from} />;
    }
    return (
      <UserWrapper>
        <div className={classes.root}>
          <TextField
            label="请输入 accesstoken"
            placeholder="请输入 accesstoken"
            required
            helperText={this.state.helpText}
            value={this.state.accesstoken}
            onChange={e => this.handleInput(e)}
            className={classes.input}
          />
          <Button
            variant="raised"
            color="secondary"
            onClick={() => this.handleLogin()}
            className={classes.input}
          >
            登  录
          </Button>
        </div>
      </UserWrapper>
    );
  }
}

UserLogin.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

UserLogin.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withStyles(loginStyles)(UserLogin);
