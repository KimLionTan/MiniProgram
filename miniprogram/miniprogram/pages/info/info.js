// pages/info/info.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    person:'',
    usermail: '',
    userid: '',
    username: '',
    imgurl: 'https://6c61-laocangshu-3ga11gxx8e84a6f2-1327579794.tcb.qcloud.la/images/%E7%94%A8%E6%88%B7.png?sign=709792217e10d48a10ca0894618a881c&t=1725252735' //云存储头像的地址
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
          person: res.data.length,
          imgurl: res.data[0].userphoto,
          username: res.data[0].username,
          userid:res.data[0].userid,
          usermail:res.data[0].usermail
        })
      })
    })
  },
  getUsername(username) {
    console.log("获取用户姓名", username.detail.value)
    this.setData({
      username: username.detail.value
    })
  },
  getUserid(userid) {
    console.log("获取用户学号", userid.detail.value)
    this.setData({
      userid: userid.detail.value
    })
  },
  getUsermail(usermail) {
    console.log("获取用户邮箱", usermail.detail.value)
    this.setData({
      usermail: usermail.detail.value
    })
  },
  upload() {
    console.log("点击上传头像")
    let that = this
    //拍摄或从手机相册中选择图片或视频。
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success(res) {
        console.log("头像", res.tempFiles[0].tempFilePath)
        //本地上传云存储
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + 'example.png',
          filePath: res.tempFiles[0].tempFilePath, // 文件路径
        }).then(res => {
          // get resource ID
          console.log("云存储的头像id", res.fileID)
          that.setData({
            imgurl: res.fileID
          })
        }).catch(error => {
          // handle error
        })
      }
    })
  },
  save() {
    if (this.data.person == 0) {
      console.log("保存")
      let openid = wx.getStorageSync("openid")
      db.collection("userlist").add({
        data: {
          openid: openid,
          userphoto: this.data.imgurl,
          username: this.data.username,
          userid: this.data.userid,
          usermail: this.data.usermail
        }
      }).then(res => {
        wx.showToast({
          title: '信息已保存成功',
        })
      })
    } else {
      console.log("修改")
      let openid = wx.getStorageSync("openid")
      db.collection("userlist").where({openid:openid}).update({
        data: {
          openid: openid,
          userphoto: this.data.imgurl,
          username: this.data.username,
          userid: this.data.userid,
          usermail: this.data.usermail
        }
      }).then(res => {
        wx.showToast({
          title: '更新成功',
        })
      })
    }
   
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