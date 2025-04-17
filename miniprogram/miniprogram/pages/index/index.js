// pages/info/info.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  navigateToInfo() {
    wx.navigateTo({
      url: '/pages/info/info', // 确保路径正确
    });
  },
  navigateToAi() {
    wx.navigateTo({
      url: '/pages/readAssitance/ai', // 确保路径正确
    });
  },
  navigateToBookshelf() {
    wx.navigateTo({
      url: '/pages/bookshelfs/bookshelf',// 导航到书架页面
    });
  },
  navigateToForum() {
    wx.navigateTo({
      url: '/pages/forum/postList' // 导航到帖子列表页面
    });
  },
  data: {
    person:'',//判断用户是否存在
    imgurl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.cloud.callFunction({
      name: "loginopenid"
    }).then(res => {
      console.log("当前用户的openid", res.result.openid)
      wx.setStorageSync('openid', res.result.openid)

      //查看是否有用户头像，有就显示
      db.collection("userlist").where({
        openid: res.result.openid
      }).get().then(res => {
        console.log("获取用户信息", res.data)
        this.setData({
          person:res.data.length,
          imgurl:res.data[0].userphoto
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.cloud.callFunction({
      name: "loginopenid"
    }).then(res => {
      console.log("当前用户的openid", res.result.openid)
      wx.setStorageSync('openid', res.result.openid)

      //查看是否有用户头像，有就显示
      db.collection("userlist").where({
        openid: res.result.openid
      }).get().then(res => {
        console.log("获取用户信息", res.data)
        this.setData({
          person:res.data.length,
          imgurl:res.data[0].userphoto
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
