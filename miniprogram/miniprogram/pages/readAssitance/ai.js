const db = wx.cloud.database()

Page({
  data: {
    imgurl:'',
    inputMessage: '',  // 用户输入的消息
    messages: [],      // 存储所有对话记录
    scrollIntoView: '' // 控制滚动到最新的消息
  },

  // 处理用户输入
  bindInput(event) {
    this.setData({
      inputMessage: event.detail.value
    });
  },

  // 发送消息
  async sendMessage() {
    const message = this.data.inputMessage;

    if (!message) {
      return; // 如果消息为空，直接返回
    }

   // 添加用户的消息到消息列表
   this.setData({
    messages: [...this.data.messages, { content: message, type: 'user', alignment: 'right' }],
    inputMessage: '', // 清空输入框内容
    scrollIntoView: 'msg-' + this.data.messages.length
  });

    // 请求AI接口
    wx.request({
      url: 'https://api.chatanywhere.tech/v1/chat/completions',
      method: 'POST',
      data: {
        "model": "gpt-3.5-turbo",  // 使用的模型ID
        "messages": [{
          "role": "user",
          "content": message
        }]
      },
      header: {
        'Authorization': 'Bearer sk-rwUSiPW9fbBBgmAZYf2ADnFnUE3V3WjBzWLST58k7KTvsZdQ',  // 替换为你的API Key
        'Content-Type': 'application/json'
      },
      success: (res) => {
        const reply = res.data.choices[0].message.content;

        // 调用逐字显示函数
        this.typeWriter(reply);
      },
      fail: (error) => {
        console.error('请求失败:', error);
      }
    });
  },
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
          imgurl: res.data[0].userphoto,

        })
      })
    })
  },
  // 逐字显示AI回复
  typeWriter(text) {
    const length = text.length;
    let displayText = '';
    let index = 0;

    // 添加一个空的消息框，用于显示逐字显示的内容
    this.setData({
      messages: [...this.data.messages, { content: '', type: 'bot', alignment: 'left' }],
      scrollIntoView: 'msg-' + (this.data.messages.length)
    });

    const interval = setInterval(() => {
      if (index < length) {
        displayText += text.charAt(index);
        this.setData({
          // 更新最后一条消息的内容
          messages: [...this.data.messages.slice(0, -1), { content: displayText, type: 'bot', alignment: 'left' }],
          scrollIntoView: 'msg-' + (this.data.messages.length - 1)
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);  // 100ms 每个字符的间隔时间，可以根据需要调整
  }
});
