Page({
  data: {
      title: '',
      content: '',
      tempFilePaths: [],
      nowCount: 0,
      isFormVisible: false,
      posts: [],
      // 新增用于记录历史发帖状态的变量
      isHistoryPostShown: false 
  },

  onLoad() {
      // 加载本地帖子
      this.loadLocalPosts();
  },

  // 加载本地帖子
  loadLocalPosts() {
      const posts = wx.getStorageSync('posts') || [];
      this.setData({ posts });
  },

  // 显示发帖表单
  showPostForm() {
      this.setData({
          isFormVisible: true,
          title: '',
          content: '',
          tempFilePaths: [],
          nowCount: 0,
          // 确保不显示历史发帖
          isHistoryPostShown: false 
      });
  },

  // 设置标题
  bindSetTitle(e) {
      this.setData({
          title: e.detail.value
      });
  },

  // 设置内容
  bindSetContent(e) {
      this.setData({
          content: e.detail.value
      });
  },

  // 选择图片
  chooseImage() {
      wx.chooseImage({
          count: 3 - this.data.nowCount,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: (res) => {
              this.setData({
                  tempFilePaths: this.data.tempFilePaths.concat(res.tempFilePaths),
                  nowCount: this.data.tempFilePaths.length + res.tempFilePaths.length
              });
          }
      });
  },

  // 删除图片
  removeImage(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({
          tempFilePaths: this.data.tempFilePaths.filter((_, i) => i!== index),
          nowCount: this.data.nowCount - 1
      });
  },

  // 获取文件扩展名
  getFileExt(filePath) {
      const pos = filePath.lastIndexOf('.');
      return pos === -1? 'unknown' : filePath.substr(pos + 1).toLowerCase();
  },

  // 上传文件（这里只是本地存储路径，不真正上传到云）
  async uploadFiles() {
      return this.data.tempFilePaths;
  },

  // 提交帖子
  async submitPost() {
      if (!this.data.title ||!this.data.content) {
          wx.showToast({ title: '请填写标题和内容', icon: 'none' });
          return;
      }

      wx.showLoading({ title: '发布中...', mask: true });

      try {
          const images = await this.uploadFiles();
          const newPost = {
              title: this.data.title,
              content: this.data.content,
              images,
              openid: this.data.openid,
              createTime: new Date().getTime(),
              likeCount: 0,
              commentCount: 0,
              comments: []
          };

          let posts = this.data.posts;
          posts.push(newPost);
          wx.setStorageSync('posts', posts);

          wx.hideLoading();
          wx.showToast({ title: '发布成功' });

          wx.navigateBack();
      } catch (err) {
          wx.hideLoading();
          wx.showToast({ title: '发布失败：' + err.message, icon: 'none' });
          console.error('发布失败:', err);
      }
  }
})