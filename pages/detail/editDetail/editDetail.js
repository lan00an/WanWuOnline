// pages/detail/editName/editName.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    clickable: true,
    bgcSet: '',
    bgcSetDisable: '',
    content: '',
    titleArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title: options.title,
      imei: options.imei,
      content: options.val,
      bgcSet: 'background-color:' + app.globalData.appTheme.theme_color.color_whole,
      bgcSetDisable: 'background-color:' + app.globalData.appTheme.theme_color.color_untouchable_btn
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
      path: 'pages/login/login',
      imageUrl: './../../images/forward.jpg'
    }
  },
  getInput(e) {
    if (e.detail.value) {
      this.setData({
        clickable: true,
        content: e.detail.value
      })
    } else {
      this.setData({
        clickable: false
      })
    }
  },
  modifyItem() {
    const that = this
    if (!this.data.clickable) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
      })
      return
    } else {
      const url = 'https://litin.gpsoo.net/1/account/devinfo'
      let data = {
        method: 'modifyUser',
        access_token: app.globalData.accessToken,
        access_type: 'inner',
        account: app.globalData.account,
        imei: this.data.imei,
        map_type: 'AMAP',
        target: app.globalData.account,
      }
      if (this.data.title == "联系人") {
        data.owner = this.data.content
      } else if (this.data.title == "手机号") {
        var mobileReg = /^1[0-9]{10}$/
        if (!mobileReg.test(this.data.content)) {
          wx.showToast({
            title: '手机号格式错误',
            icon: 'none'
          })
          return
        }
        data.tel = this.data.content
      } else if (this.data.title == "车牌号") {
        data.sex = this.data.content
      } else if (this.data.title == "身份证号") {
        data.owner_idno = this.data.content
      }
      wx.request({
        url: url,
        data: data,
        success: function (res) {
          if (res.data.errcode === 0) {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 1000,
              success: function () {
                setTimeout(() => {
                  wx.reLaunch({
                    url: './../../monitor/monitor'
                  })
                }, 1000);
              }
            })
          } else {
            wx.showToast({
              title: '修改失败'
            })
          }
        }
      })
    }
  }
})