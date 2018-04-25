import { observable, action, extendObservable, computed, toJS } from 'mobx';
import { topicSchema, replySchame } from '../util/variableDefine';
import { get, post } from '../util/http';

const createTopic = topic => Object.assign({}, topicSchema, topic);
const createReply = reply => Object.assign({}, replySchame, reply);

class Topic {
  constructor(data, isDetail) {
    extendObservable(this, data);
    this.isDetail = isDetail;
  }
  @observable syncing = false;
  @observable createdReplies = [];
  @action doReply(content) {
    return new Promise((resolve, reject) => {
      post(`/topic/${this.id}/replies`, {
        needAccessToken: true,
      }, { content })
        .then((resp) => {
          if (resp.success) {
            this.createdReplies.push(createReply({
              id: resp.reply_id,
              content,
              create_at: Date.now(),
            }));
            resolve();
          } else {
            reject(resp);
          }
        }).catch(reject);
    });
  }
}

class TopicStore {
  @observable topics;
  @observable details;
  @observable syncing;
  @observable tab;

  constructor({
    syncing = false,
    topics = [],
    details = [],
    tab = null,
  } = {}) {
    this.syncing = syncing;
    this.topics = topics.map(topic => new Topic(createTopic(topic)));
    this.details = details.map(topic => new Topic(createTopic(topic)));
    this.tab = tab;
  }

  addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)));
  }
  @computed get detailMap() {
    return this.details.reduce((result, detail) => {
      result[detail.id] = detail; // eslint-disable-line
      return result;
    }, {});
  }

  @action fetchTopics(tab) {
    return new Promise((resolve, reject) => {
      if (tab === this.tab && this.topics.length > 0) {
        resolve();
        return;
      }
      console.log('获取新的数据');
      this.tab = tab;
      this.syncing = true;
      this.topics = [];
      get('/topics', {
        tab,
        mdrender: false,
      }).then((resp) => {
        if (resp.success) {
          this.topics = resp.data.map(topic => new Topic(createTopic(topic)));
          resolve();
        } else {
          reject();
        }
        this.syncing = false;
      }).catch((err) => {
        reject(err);
        this.syncing = false;
      });
    });
  }

  @action getTopicDetail(id) {
    return new Promise((resolve, reject) => {
      if (this.detailMap[id]) {
        resolve(this.detailMap[id]);
      } else {
        get(`/topic/${id}`, {
          mdrender: false,
        }).then((resp) => {
          if (resp.success) {
            const topic = new Topic(createTopic(resp.data));
            this.details.push(topic);
            resolve(topic);
          } else {
            reject();
          }
        }).catch(reject);
      }
    });
  }

  toJson() {
    return {
      syncing: this.syncing,
      topics: toJS(this.topics),
      details: toJS(this.details),
      tab: this.tab,
    };
  }
}


export default TopicStore;
