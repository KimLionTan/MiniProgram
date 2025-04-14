Component({
  properties: {
      isMenuOpen: {
          type: Boolean,
          value: false
      },
      booksPerRow: {
          type: Number,
          value: 3
      },
      sortType: {
          type: String,
          value: 'asc'
      }
  },
  methods: {
      toggleMenu() {
          this.triggerEvent('toggleMenu');
      },
      sortBooksAsc() {
          this.triggerEvent('sortBooksAsc');
      },
      sortBooksDesc() {
          this.triggerEvent('sortBooksDesc');
      },
      handleBooksPerRowChange(e) {
          this.triggerEvent('handleBooksPerRowChange', { value: e.detail.value });
      }
  },
  externalClasses: ['custom-class'],
  pageLifetimes: {
      show: function () {
          // 在页面显示时添加点击事件监听
          wx.onTouchStart((res) => {
              const menu = this.selectComponent('.menu-list');
              if (menu) {
                  const menuRect = menu.getBoundingClientRect();
                  const touchX = res.touches[0].clientX;
                  const touchY = res.touches[0].clientY;
                  // 判断点击位置是否在菜单外
                  if (
                      touchX < menuRect.left ||
                      touchX > menuRect.right ||
                      touchY < menuRect.top ||
                      touchY > menuRect.bottom
                  ) {
                      if (this.data.isMenuOpen) {
                          this.triggerEvent('toggleMenu');
                      }
                  }
              }
          });
      }
  }
});