import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import dateFormat from 'dateformat';

import Avatar from 'material-ui/Avatar';
import ListItem from 'material-ui/List/ListItem';
import ListItemAvatar from 'material-ui/List/ListItemAvatar';
import ListItemText from 'material-ui/List/ListItemText';
// import IconHome from 'material-ui-icons/Home';
import { withStyles } from 'material-ui/styles';

import { tabs } from '../../util/variableDefine';
import { topicPrimaryStyle, topicSecondaryStyle } from './styles';


const Primary = ({ classes, topic }) => {
  const classNames = cx({
    [classes.tab]: true,
    [classes.top]: topic.top,
  });
  return (
    <div className={classes.root}>
      <span className={classNames}>{topic.top ? '置顶' : tabs[topic.tab]}</span>
      <span className={classes.title}>{topic.title}</span>
    </div>
  );
};

const StyledPrimary = withStyles(topicPrimaryStyle)(Primary);

const Secondary = ({ classes, topic }) => (
  <span className={classes.root}>
    <span className={classes.username}>{topic.author.loginname}</span>
    <span className={classes.count}>
      <span className={classes.accentColor}>{topic.reply_count}</span>
      <span>/</span>
      <span>{topic.visit_count}</span>
    </span>
    <span>创建时间:{dateFormat(topic.create_at, 'yyyy/mm/dd')}</span>
  </span>
);

const StylesSecondary = withStyles(topicSecondaryStyle)(Secondary);

const TopicListItem = ({ onClick, topic }) => (
  <ListItem button onClick={onClick}>
    <ListItemAvatar>
      <Avatar src={topic.author.avatar_url} />
    </ListItemAvatar>
    <ListItemText
      primary={<StyledPrimary topic={topic} />}
      secondary={<StylesSecondary topic={topic} />}
    />
  </ListItem>
);


Primary.propTypes = {
  topic: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

Secondary.propTypes = {
  topic: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

TopicListItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  topic: PropTypes.object.isRequired,
};

export default TopicListItem;
