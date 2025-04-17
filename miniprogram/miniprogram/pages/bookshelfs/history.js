Page({
  data: {
    sortedBooks: [],
    showHistoryInfoIndex: -1
  },
  onLoad() {
    // 从本地存储获取已保存的书籍信息
    let savedBooks = wx.getStorageSync('books') || [];
    // 按照阅读时间排序
    savedBooks.sort((a, b) => {
      return new Date(a.readingTime) - new Date(b.readingTime);
    });
    this.setData({
      sortedBooks: savedBooks
    });
  },
  showBookInfo(e) {
    const index = e.currentTarget.dataset.index;
    if (this.data.showHistoryInfoIndex === index) {
      this.setData({
        showHistoryInfoIndex: -1
      });
    } else {
      this.setData({
        showHistoryInfoIndex: index
      });
    }
  },
  goToEditBookPage(e) {
    const index = e.currentTarget.dataset.index;
    const book = this.data.sortedBooks[index];
    wx.navigateTo({
      url: `/pages/bookshelfs/addbook?index=${index}&cover=${book.cover}&bookName=${book.bookName}&author=${book.author}&readingTime=${book.readingTime}`
    });
  },
  handleTimelineScroll(e) {
    // 这里可以添加具体的滚动逻辑，例如根据滚动距离显示不同的书籍信息
    // 目前只是简单示例，后续可根据需求完善
  },
  goBackToBookshelf() {
    wx.navigateBack({
      delta: 1,
      success: function () {
        console.log('成功返回书架页面');
      },
      fail: function (err) {
        console.error('返回书架页面失败:', err);
      }
    });
  }
});