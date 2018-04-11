import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import queryString from 'query-string';
// import Button from 'material-ui/Button';
import Tabs, { Tab } from 'material-ui/Tabs';
import List from 'material-ui/List';
import { CircularProgress } from 'material-ui/Progress';

import { AppState } from '../../store/app.state';
import Conatiner from '../layout/container';
import TopicListItem from './listItem';
import { TopicStore } from '../../store/store';
import { tabs } from '../../util/variableDefine';
@inject(stores => ({
  appState: stores.appState,
  topicStore: stores.topicStore,
})) @observer
export default class TopicList extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };
  constructor() {
    super();
    this.changeName = this.changeName.bind(this);
    this.changeTab = this.changeTab.bind(this);
  }
  componentDidMount() {
    this.props.topicStore.fetchTopics(this.getTab());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search));
    }
  }

  getTab(search = this.props.location.search) {
    const query = queryString.parse(search);
    return query.tab || 'all';
  }

  bootstrap() {
    const query = queryString.parse(this.props.location.search);
    const { tab } = query;
    console.log('asyncBootstrap is called');
    return this.props.topicStore.fetchTopics(tab || 'all')
      .then(() => true)
      .catch(() => false);
  }

  changeName(event) {
    this.props.appState.changeName(event.target.value);
  }

  changeTab(event, value) {
    this.context.router.history.push({
      pathname: '/index',
      search: `?tab=${value}`,
    });
  }
  listItemClick(topic) {
    this.context.router.history.push(`/detail/${topic.id}`);
  }
  render() {
    const { topicStore: { topics: topicList, syncing: syncingTopics } } = this.props;
    // const topicList = topicStore.topics;
    // const syncingTopics = topicStore.syncing;
    const tab = this.getTab();
    return (
      <Conatiner>
        <div>
          <Helmet>
            <title>this is topic list</title>
            <meta name="description" content="this is description" />
          </Helmet>
        </div>
        <Tabs value={tab} onChange={this.changeTab} centered>
          {Object.keys(tabs).map(t => <Tab key={t} label={tabs[t]} value={t} />)}
        </Tabs>
        <List>
          {topicList.map(topic => (
            <TopicListItem
              key={topic.id}
              onClick={() => this.listItemClick(topic)}
              topic={topic}
            />
          ))}
        </List>
        {syncingTopics
          ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'pace-around',
                padding: '40px 0',
              }}
            >
              <CircularProgress color="secondary" />
            </div>
          )
          : null}
      </Conatiner>
    );
  }
}
TopicList.wrappedComponent.propTypes = {
  appState: PropTypes.instanceOf(AppState).isRequired,
  topicStore: PropTypes.instanceOf(TopicStore).isRequired,
};

TopicList.propTypes = {
  location: PropTypes.object.isRequired,
};
