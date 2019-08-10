// pages/detail/detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    imei: '',
    remark: '',
    iotCard: '',
    outTime: '',
    enableTime: '',
    type: '',
    heart_time: '',
    goome_card: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      heart_time: this.getDate(options.heart_time) + ' ' + this.getTime(options.heart_time),
      imei: options.imei
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.globalData.appTheme.theme_color.color_whole
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDetail(this.data.imei)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // wx.redirectTo({
    //   url: './../monitor/monitor'
    // })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '数化万物 智在融合',
      path: 'pages/authorize/authorize',
      imageUrl: './../images/forward.jpg'
    }
  },
  getDate(timestamp) {
    let fullTimestamp = timestamp * 1000
    let year = new Date(fullTimestamp).getFullYear();
    let month = new Date(fullTimestamp).getMonth() + 1;
    let day = new Date(fullTimestamp).getDate()
    month = month >= 10 ? month : '0' + month
    day = day >= 10 ? day : '0' + day
    return year + '-' + month + '-' + day
  },
  getTime(timestamp) {
    let fullTimestamp = timestamp * 1000
    let hour = new Date(fullTimestamp).getHours();
    let minute = new Date(fullTimestamp).getMinutes();
    let second = new Date(fullTimestamp).getSeconds()
    hour = hour >= 10 ? hour : '0' + hour
    minute = minute >= 10 ? minute : '0' + minute
    second = second >= 10 ? second : '0' + second
    return hour + ':' + minute + ':' + second
  },
  getDetail (imei) {
    const that = this
    const url = 'https://litin.gmiot.net/1/account/devinfo'
    let data = {
      access_type: 'inner',
      account: app.globalData.account,
      target: imei,
      access_token: app.globalData.accessToken
    }
    wx.request({
      url,
      data,
      success: function (res) {
        if (res.data.errcode === 0) {
          let data = res.data.data
          console.log(data)
          that.setData({
            name: data.name.trim(),
            imei: data.imei,
            remark: data.remark || '',
            enableTime: that.getDate(data.in_time),
            outTime: that.getDate(data.out_time),
            type: data.dev_type,
            iotCard: data.phone,
            goome_card: data.goome_card
          })
        } else {
          console.log(res.data)
        }
      }
    })
  },
  editCard() {
    if (this.data.goome_card) {
      return
    }
    wx.navigateTo({
      url: './editCard/editCard?cardNum=' + this.data.iotCard + '&imei=' + this.data.imei
    })
  },
  editName () {
    wx.navigateTo({
      url: './editName/editName?name=' + this.data.name + '&imei=' + this.data.imei
    })
  },
  editRemark () {
    wx.navigateTo({
      url: './editRemark/editRemark?remark=' + this.data.remark + '&imei=' + this.data.imei
    })
  },
  copyText(e){
    console.log(e)
    wx.setClipboardData({　　　　　　
      data: e.currentTarget.dataset.content,
      　success: function (res) {　　　　　　　　
          wx.getClipboardData({　　　　　　　　　　
            success: function (res) {　　　　　　　　　　　　
              wx.showToast({　　　　　　　　　　　　　　
                title: '复制成功'　　　　　　　　　　　　
              })　　　　　　　　　　
            }　　　　　　　　
          })　　　　
        }
      })
    }
})