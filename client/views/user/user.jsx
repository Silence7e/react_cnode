import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Avatar from 'material-ui/Avatar';
import { withStyles } from 'material-ui/styles';

import UserIcon from 'material-ui-icons/AccountCircle';

import Conatiner from '../layout/container';
import userStyles from './styles/userStyles';

@inject(stores => ({
  user: stores.appState.user,
})) @observer
class User extends Component {
  componentDidMount() {
    // do
  }
  render() {
    const { classes } = this.props;
    const { info } = this.props.user;
    return (
      <Conatiner>
        <div className={classes.avatar}>
          <div className={classes.bg} />
          {
            info.avatar_url ?
              <Avatar className={classes.avatarImg} src={info.avatar_url} /> :
              <Avatar className={classes.avatarImg}>
                <UserIcon />
              </Avatar>
          }
          <span className={classes.user}>{info.loginname || '未登录'}</span>
        </div>
        {this.props.children}
      </Conatiner>
    );
  }
}
User.wrappedComponent.propTypes = {
  user: PropTypes.object.isRequired,
};

User.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element,
};

export default withStyles(userStyles)(User);
