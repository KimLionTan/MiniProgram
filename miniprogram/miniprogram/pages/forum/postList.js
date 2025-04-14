Page({
  data: {
    posts: []
  },

  onLoad() {
    // 添加内置帖子
    const welcomePost = {
      _id: 'welcome-post',
      title: '欢迎！！！',
      content: '欢迎来到「仓鼠阅读」的世界！这里是你掌中的知识粮仓，藏着万千好书与惊喜短篇，像小仓鼠囤积宝藏一样，为你打包每一份阅读的快乐！无论是通勤碎片时间，还是睡前放松时刻，轻点指尖，即可潜入治愈的文字森林。智能推荐懂你的喜好，笔记功能留住灵光一闪，更有共读小队等你结伴探索～让阅读像撸仓鼠一样轻松温暖，从此每天都是充实又柔软的好日子！快来开启你的囤知识之旅吧～',
      images: [],
      likeCount: 0,
      createTime: new Date().toISOString(),
      comments: []
    };

    // 加载本地帖子
    const localPosts = wx.getStorageSync('posts') || [];
    // 将内置帖子和本地帖子合并
    const allPosts = [welcomePost, ...localPosts];
    this.setData({
      posts: allPosts
    });
  },

  navigateToPostForm() {
    wx.navigateTo({
      url: '/pages/forum/forum'
    });
  },

  viewPostDetail(e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/forum/postDetail?id=${postId}`
    });
  },

  // 点赞功能逻辑
  likePost(e) {
    const postId = e.currentTarget.dataset.id;
    let posts = this.data.posts;
    const targetPost = posts.find(post => post._id === postId);
    if (targetPost) {
      targetPost.likeCount++;
      this.setData({
        posts: posts
      });
      // 同步更新本地存储
      wx.setStorageSync('posts', posts);
      wx.showToast({ title: '点赞成功' });
    } else {
      console.error('未找到对应帖子');
    }
  },

  // 修改后的追加评论功能
  navigateToCommentSection(e) {
    const postId = e.currentTarget.dataset.id;
    const targetPost = this.data.posts.find(post => post._id === postId);
    
    if (targetPost) {
      wx.showActionSheet({
        itemList: ['追加评论'],
        success: (res) => {
          if (!res.cancel) {
            wx.showModal({
              title: '追加评论',
              content: '',
              editable: true,  // 新版可编辑属性
              placeholderText: '写下你的神评论...',  // 占位提示
              success: (resModal) => {
                if (resModal.content.trim()) {  // 过滤空内容
                  const comment = {
                    commenter: '匿名用户',
                    commentContent: resModal.content,
                    commentTime: new Date().toLocaleTimeString(),  // 更友好的时间格式
                    _id: new Date().getTime().toString()  // 添加唯一ID
                  };
                  
                  // 找到当前帖子的索引
                  const index = this.data.posts.findIndex(p => p._id === postId);
                  if (index > -1) {
                    // 更新评论数组
                    const updatedComments = [...this.data.posts[index].comments, comment];
                    
                    // 使用路径更新数据
                    this.setData({
                      [`posts[${index}].comments`]: updatedComments
                    });
                    
                    // 持久化存储
                    wx.setStorageSync('posts', this.data.posts);
                    wx.showToast({ 
                      title: '评论成功',
                      icon: 'success' 
                    });
                  }
                }
              }
            });
          }
        }
      });
    } else {
      console.error('未找到对应帖子');
    }
  }
});