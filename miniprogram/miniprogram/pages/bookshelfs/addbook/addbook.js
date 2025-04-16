Page({
  data: {
    cover: '',
    bookName: '',
    author: '',
    readingTime: '',
    editIndex: -1 // 用于标识是否是编辑状态以及编辑的书籍索引
  },
  onLoad(options) {
    if (options.index) {
      // 如果有 index 参数，说明是编辑状态
      this.setData({
        editIndex: parseInt(options.index),
        cover: options.cover,
        bookName: options.bookName,
        author: options.author,
        readingTime: options.readingTime
      });
    }
  },
  chooseImage() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          cover: res.tempFilePaths[0]
        });
      }
    });
  },
  handleBookNameInput(e) {
    this.setData({
      bookName: e.detail.value
    });
  },
  handleAuthorInput(e) {
    this.setData({
      author: e.detail.value
    });
  },
  handleReadingTimeInput(e) {
    this.setData({
      readingTime: e.detail.value
    });
  },
  saveBook() {
    const { cover, bookName, author, readingTime, editIndex } = this.data;
    if (!cover || !bookName || !author || !readingTime) {
      wx.showToast({
        title: '请完善信息',
        icon: 'none'
      });
      return;
    }
    // 获取已保存的书籍信息
    let savedBooks = wx.getStorageSync('books') || [];
    if (editIndex !== -1) {
      // 如果是编辑状态，更新对应索引的书籍信息
      savedBooks[editIndex] = {
        cover,
        bookName,
        author,
        readingTime
      };
    } else {
      // 否则添加新书籍信息
      savedBooks.push({
        cover,
        bookName,
        author,
        readingTime
      });
    }
    // 保存到本地存储
    wx.setStorageSync('books', savedBooks);
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
    // 返回书架页面
    wx.navigateBack();
  },
  deleteBook() {
    const { editIndex } = this.data;
    if (editIndex !== -1) {
      wx.showModal({
        title: '确认删除',
        content: '确定要删除这本书籍吗？',
        success: (res) => {
          if (res.confirm) {
            // 获取已保存的书籍信息
            let savedBooks = wx.getStorageSync('books') || [];
            // 删除对应索引的书籍信息
            savedBooks.splice(editIndex, 1);
            // 保存到本地存储
            wx.setStorageSync('books', savedBooks);
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
            // 返回书架页面
            wx.navigateBack({
              success: () => {
                const pages = getCurrentPages();
                const prevPage = pages[pages.length - 2];
                if (prevPage) {
                  prevPage.onLoad(); // 刷新上一页（书架页面）的数据
                }
              }
            });
          }
        }
      });
    }
  }
});