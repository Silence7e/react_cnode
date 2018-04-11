import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { inject, observer } from 'mobx-react';
import AppBar from 'material-ui/AppBar';
import ToolBar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import HomeIcon from 'material-ui-icons/Home';

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
};

@inject(stores => ({
  appState: stores.appState,
})) @observer
class MainAppBar extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  onHomeIconClick() {
    this.context.router.history.push('/index');
  }
  /* eslint-disable */
  createButtonClick() {

  }
  /* eslint-ensable */
  loginButtonClick() {
    if(this.props.appState.user.isLogin){
      this.context.router.history.push('/user/info');
    }else{
      this.context.router.history.push('/user/login');
    }

  }

  render() {
    const { classes } = this.props;
    const { user } = this.props.appState;
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <ToolBar>
            <IconButton color="inherit" onClick={() => this.onHomeIconClick()} >
              <HomeIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              JNode
            </Typography>
            <Button variant="raised" color="secondary" onClick={() => this.createButtonClick()}>新建话题</Button>
            <Button color="inherit" onClick={() => this.loginButtonClick()}>
              {user.info.loginname || '登录'}
            </Button>
          </ToolBar>
        </AppBar>
      </div>
    );
  }
}

MainAppBar.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
};

MainAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainAppBar);
