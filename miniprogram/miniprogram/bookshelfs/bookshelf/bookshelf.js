Page({
  data: {
      books: [],
      showInfoIndex: -1,
      autoHideTimer: null,
      sortType: 'asc',
      booksPerRow: 3,
      isMenuOpen: false
  },
  onLoad() {
      // 从本地存储中读取保存的书架格式设置
      const savedSortType = wx.getStorageSync('sortType');
      const savedBooksPerRow = wx.getStorageSync('booksPerRow');

      // 如果本地存储中有保存的数据，则使用保存的数据更新页面数据
      if (savedSortType) {
          this.setData({
              sortType: savedSortType
          });
      }
      if (savedBooksPerRow) {
          this.setData({
              booksPerRow: savedBooksPerRow
          });
      }

      let savedBooks = wx.getStorageSync('books') || [];
      savedBooks.sort((a, b) => {
          if (this.data.sortType === 'asc') {
              return new Date(a.readingTime) - new Date(b.readingTime);
          } else {
              return new Date(b.readingTime) - new Date(a.readingTime);
          }
      });
      this.setData({
          books: savedBooks
      });
  },
  goToAddbookPage() {
      wx.navigateTo({
          url: '/pages/addbook/addbook'
      });
  },
  showBookInfo(e) {
      const index = e.currentTarget.dataset.index;
      if (this.data.showInfoIndex === index) {
          // 点击已显示信息的书籍，隐藏信息并清除定时器
          this.hideBookInfo();
      } else {
          // 显示新信息前清除旧定时器
          if (this.data.autoHideTimer) {
              clearTimeout(this.data.autoHideTimer);
          }
          this.setData({
              showInfoIndex: index
          });
          this.startAutoHideTimer();
      }
  },
  goToEditBookPage(e) {
      const index = e.currentTarget.dataset.index;
      const book = this.data.books[index];
      wx.navigateTo({
          url: `/pages/addbook/addbook?index=${index}&cover=${book.cover}&bookName=${book.bookName}&author=${book.author}&readingTime=${book.readingTime}`
      });
  },
  hideBookInfoOnBlank(e) {
      this.hideBookInfo();
  },
  sortBooks(sortType) {
      let savedBooks = wx.getStorageSync('books') || [];
      savedBooks.sort((a, b) => {
          if (sortType === 'asc') {
              return new Date(a.readingTime) - new Date(b.readingTime);
          } else {
              return new Date(b.readingTime) - new Date(a.readingTime);
          }
      });
      this.setData({
          books: savedBooks,
          sortType: sortType,
          isMenuOpen: false
      });
      // 将排序方式保存到本地存储
      wx.setStorageSync('sortType', sortType);
  },
  sortBooksAsc() {
      this.sortBooks('asc');
  },
  sortBooksDesc() {
      this.sortBooks('desc');
  },
  toggleMenu() {
      this.setData({
          isMenuOpen:!this.data.isMenuOpen
      });
  },
  handleBooksPerRowChange(e) {
      const newBooksPerRow = e.detail.value;
      this.setData({
          booksPerRow: newBooksPerRow
      });
      // 将每行书籍数量保存到本地存储
      wx.setStorageSync('booksPerRow', newBooksPerRow);
  },
  handleOutsideClick(e) {
      if (this.data.isMenuOpen) {
          const menu = this.selectComponent('.menu');
          const menuRect = menu.getBoundingClientRect();
          const touchX = e.touches[0].clientX;
          const touchY = e.touches[0].clientY;
          if (
              touchX < menuRect.left ||
              touchX > menuRect.right ||
              touchY < menuRect.top ||
              touchY > menuRect.bottom
          ) {
              this.setData({
                  isMenuOpen: false
              });
          }
      }
      // 点击菜单外不隐藏书籍详细信息，除非点击书籍本身
  },
  hideBookInfo() {
      if (this.data.showInfoIndex!== -1) {
          this.setData({
              showInfoIndex: -1
          });
          if (this.data.autoHideTimer) {
              clearTimeout(this.data.autoHideTimer);
              this.data.autoHideTimer = null;
          }
      }
  },
  startAutoHideTimer() {
      this.data.autoHideTimer = setTimeout(() => {
          this.hideBookInfo();
      }, 6000);
  },
  goToHistoryPage() {
      wx.navigateTo({
          url: '/pages/history/history',
          success: function () {
              console.log('成功跳转到历史记录页面');
          },
          fail: function (err) {
              console.error('跳转到历史记录页面失败:', err);
          }
      });
  }
});