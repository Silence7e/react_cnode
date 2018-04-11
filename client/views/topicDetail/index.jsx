import React, { Component } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import Helment from 'react-helmet';
import { observer, inject } from 'mobx-react';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import IconReply from 'material-ui-icons/Replay';
import SimpleMDE from 'react-simplemde-editor';

import Container from '../layout/container';
import { TopicStore } from '../../store/store';
import { topicDetailStyle } from './styles';
import Reply from './reply';

@inject(stores => (
  {
    topicStore: stores.topicStore,
    user: stores.appState.user,
  }
)) @observer
class TopicDetail extends Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  constructor() {
    super();
    this.state = {
      newReply: '',
    };
  }

  componentDidMount() {
    this.props.topicStore.getTopicDetail(this.getTopicId());
    // do something;
  }

  getTopicId() {
    const { match: { params: { id } } } = this.props;
    return id;
  }

  doReply() {
    const topic = this.props.topicStore.detailMap[this.getTopicId()];
    topic.doReply(this.state.newReply).then(() => {
      this.setState({ newReply: '' });
    }).catch((err) => {
      console.log(err);
    });
  }

  qoToLogin() {
    this.context.router.history.push('/user/login');
  }

  hindleNewReplyChange(content) {
    this.setState({ newReply: content });
  }

  render() {
    const { classes, user } = this.props;
    const topic = this.props.topicStore.detailMap[this.getTopicId()];
    if (!topic) {
      return (
        <Container>
          <section className={classes.loadingConatiner}>
            <CircularProgress color="secondary" />
          </section>
        </Container>
      );
    }
    return (
      <div>
        <Container>
          <Helment>
            <title>{topic.title}</title>
          </Helment>
          <header className={classes.header}>
            <h3>{topic.title}</h3>
          </header>
          <section className={classes.body}>
            <p dangerouslySetInnerHTML={{ __html: marked(topic.content) }} />
          </section>
        </Container>
        {
          topic.createdReplies && topic.createdReplies.length > 0
            ? (
              <Paper elevation={4} className={classes.replies}>
                <header className={classes.replyHeader}>
                  <span>我的最新回复</span>
                  <span>{`${topic.createdReplies.length}条`}</span>
                </header>
                {
                  topic.createdReplies.map(reply => (
                    <Reply
                      key={reply.id}
                      reply={Object.assign({}, reply, {
                        author: {
                          avatar_url: user.info.avatar_url,
                          loginname: user.info.loginname,
                        },
                      })}
                    />
                  ))
                }
              </Paper>
            )
            : null
        }
        <Paper elevation={4} className={classes.replies}>
          <header className={classes.replyHeader}>
            <span>{`${topic.reply_count} 回复`}</span>
            <span>{`最新回复 ${topic.last_reply_at}`}</span>
          </header>
          {
            user.isLogin && (
              <section className={classes.replyEditor}>
                <SimpleMDE
                  onChange={content => this.hindleNewReplyChange(content)}
                  value={this.state.newReply}
                  options={{
                    toolbar: false,
                    autoFocus: false,
                    spellChecker: false,
                    placeholder: '添加恢复',
                  }}
                />
                <Button variant="fab" color="primary" className={classes.replyButton} onClick={() => this.doReply()}>
                  <IconReply />
                </Button>
              </section>
            )
          }
          {
            !user.isLogin && (
              <section className={classes.noLoginButton}>
                <Button variant="raised" color="secondary" onClick={() => this.qoToLogin()}>登录并回复</Button>
              </section>
            )
          }
          <section>
            {
              topic.replies.map(reply => <Reply reply={reply} key={reply.id} />)
            }
          </section>
        </Paper>
      </div>
    );
  }
}
TopicDetail.wrappedComponent.propTypes = {
  topicStore: PropTypes.instanceOf(TopicStore).isRequired,
  user: PropTypes.object.isRequired,
};

TopicDetail.propTypes = {
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};
export default withStyles(topicDetailStyle)(TopicDetail);
