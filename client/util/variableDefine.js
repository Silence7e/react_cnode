export const tabs = {
  all: '全部',
  share: '分享',
  job: '工作',
  ask: '问答',
  good: '精品',
  dev: '测试',
};

export const topicSchema = {
  id: '',
  author_id: '',
  tab: '',
  content: '',
  title: '',
  last_repay_at: '',
  good: false,
  top: false,
  reply_count: 0,
  visit_count: 0,
  create_at: '',
  is_colleat: '',
  author: {
    loginname: '',
    avatar_url: '',
  },
};

export const replySchame = {
  id: '',
  author: {
    loginname: '',
    avatar_url: '',
  },
  content: '',
  ups: [],
  create_at: '',
  reply_id: null,
  is_uped: false,
};

export default { tabs, topicSchema, replySchame };
