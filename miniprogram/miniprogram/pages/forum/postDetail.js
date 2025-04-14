Page({
  data: {
    post: {
      _id: 'welcome-post',
      title: '欢迎！！！',
      content: '欢迎来到「仓鼠阅读」的世界！这里是你掌中的知识粮仓，藏着万千好书与惊喜短篇，像小仓鼠囤积宝藏一样，为你打包每一份阅读的快乐！无论是通勤碎片时间，还是睡前放松时刻，轻点指尖，即可潜入治愈的文字森林。智能推荐懂你的喜好，笔记功能留住灵光一闪，更有共读小队等你结伴探索～让阅读像撸仓鼠一样轻松温暖，从此每天都是充实又柔软的好日子！快来开启你的囤知识之旅吧～',
      images: [],
      likeCount: 0,
      createTime: '2025.02.30',
      username: '刘彻',
      avatar: '/images/default-avatar.png',
      comments: []
    },
    commentInput: ''
  },

  onLoad(options) {
    if (options.id) {
      this.loadLocalPostDetail(options.id);
    } else {
      // 展示内置欢迎帖子逻辑不变
    }
  },

  loadLocalPostDetail(postId) {
    wx.showLoading({ title: '加载中...' });
    const posts = wx.getStorageSync('posts') || [];
    const targetPost = posts.find(post => post._id === postId);
    if (targetPost) {
      this.setData({
        post: targetPost
      });
      wx.hideLoading();
    } else {
      console.error('未找到对应帖子');
      wx.hideLoading();
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  likePost() {
    const post = this.data.post;
    post.likeCount++;
    this.setData({
      post: post
    });
    wx.showToast({ title: '点赞成功' });
    // 更新本地存储
    const posts = wx.getStorageSync('posts') || [];
    const index = posts.findIndex(p => p._id === post._id);
    if (index!== -1) {
      posts[index] = post;
      wx.setStorageSync('posts', posts);
    }
  },

  // 追加评论相关方法
  bindCommentInput(e) {
    const commentInput = e.detail.value;
    this.setData({
      commentInput
    });
  },

  addComment() {
    const commentContent = this.data.commentInput;
    if (!commentContent) {
      wx.showToast({ title: '评论内容不能为空', icon: 'none' });
      return;
    }
    const comment = {
      commenter: '暂用标识',
      commentContent,
      commentTime: new Date().getTime()
    };
    const post = this.data.post;
    post.comments.push(comment);
    this.setData({
      post: post,
      commentInput: ''
    });
    wx.showToast({ title: '评论成功' });
    // 同步更新本地存储
    const posts = wx.getStorageSync('posts') || [];
    const index = posts.findIndex(p => p._id === post._id);
    if (index!== -1) {
      posts[index] = post;
      wx.setStorageSync('posts', posts);
    }
  }
})