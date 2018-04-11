import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';

import UserWrapper from './user';
import styles from './styles/infoStyles';

const TopicItem = ({ topic, onClick }) => (
  <ListItem button onClick={onClick}>
    <Avatar src={topic.author.avatar_url} />
    <ListItemText
      primary={topic.title}
      secondary={`最新回复${topic.last_reply_at}`}
    />
  </ListItem>
);

TopicItem.propTypes = {
  topic: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

@inject(stores => ({
  user: stores.appState.user,
  appState: stores.appState,
})) @observer
class Info extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    this.props.appState.getUserDetail();
    this.props.appState.getUserCollection();
  }

  goToTopic(id) {
    this.context.router.history.push(`/detail/${id}`);
  }
  render() {
    const { classes } = this.props;
    const topics = this.props.user.detail.recentTopics;
    const replies = this.props.user.detail.recentReplies;
    const collections = this.props.user.collections.list;
    return (
      <UserWrapper>
        <div className={classes.root}>
          <Grid container spacing={16} align="stretch" className={classes.grid}>
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.paperTitle}>
                  <span>最近发布的话题</span>
                </Typography>
                <List>
                  {
                    topics.length > 0
                      ? topics.map(topic => (
                        <TopicItem
                          topic={topic}
                          key={topic.id}
                          onClick={() => this.goToTopic(topic.id)}
                        />))
                      : <Typography>最近没有发布过话题</Typography>
                  }
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.paperTitle}>
                  <span>最近回复的话题</span>
                </Typography>
                <List>
                  {
                    replies.length > 0
                      ? replies.map(topic => (
                        <TopicItem
                          topic={topic}
                          key={topic.id}
                          onClick={() => this.goToTopic(topic.id)}
                        />))
                      : <Typography>最近没有回复过话题</Typography>
                  }
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.paperTitle}>
                  <span>最近收藏的话题</span>
                </Typography>
                <List>
                  {
                    collections.length > 0
                      ? collections.map(topic => (
                        <TopicItem
                          topic={topic}
                          key={topic.id}
                          onClick={() => this.goToTopic(topic.id)}
                        />))
                      : <Typography>最近没有收藏过话题</Typography>
                  }
                </List>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </UserWrapper>
    );
  }
}

Info.wrappedComponent.propTypes = {
  user: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
};

Info.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Info);
