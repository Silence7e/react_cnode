import AppSteteClass from './app.state';
import TopicStoreClass from './topic.store';

export const AppState = AppSteteClass;
export const TopicStore = TopicStoreClass;

export default {
  AppState,
  TopicStore,
};

export const createStoreMap = () => ({
  appState: new AppState(),
  topicStore: new TopicStore(),
});
