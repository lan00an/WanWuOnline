const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.login({
      success: function (res) {
        wx.request({
          url: 'https://litin.gmiot.net/1/auth/access_token',
          data: {
            method: 'loginByWechat',
            wxcode:  res.code,
            access_type: 'inner'
          },
          success: function (res) {
            if (res.data.errcode === 0) {
              app.globalData.account = res.data.data.account
              app.globalData.accessToken = res.data.data.access_token
              that.getAppTheme();
              if (res.data.data.name.indexOf('goocar-') > -1) {
                that.setData({
                  showDialog: true
                })
              } else {
                setTimeout(() => {
                  wx.redirectTo({
                    url: './../monitor/monitor'
                  })
                }, 2000);
              }
            } else {
              wx.showModal({
                title: '登陆失败',
                  content: res.data.errcode + '登陆失败,请检查您的网络设置，稍后重试'
              })
            }
          },
          fail: function (err) {
            wx.showModal({
              title: '登陆失败'+ '(' + err + ')',
              content: '登陆失败,请检查您的网络设置，稍后重试'
            })
          }
        })
      },
      fail: function (err) {
        wx.showModal({
          title: '登陆微信失败' + '(' + err + ')',
          content: '登陆失败,请检查您的网络设置，稍后重试'
        })
      }
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
      path: 'pages/authorize/authorize',
      imageUrl: './../images/forward.jpg'
    }
  },
  bindGetUserInfo(e) {
    this.setData({
      showDialog: false
    })
    
    let rawData = JSON.parse(e.detail.rawData)
    let name = rawData.nickName
    const url = "https://litin.gmiot.net/GetDataService"
    let data = {
      method: "modifyEnterprise",
      writes: true,
      name: name + '(微信)',
      access_token: app.globalData.accessToken
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if(res.data.errcode ===0) {
          
        } else {
          
          wx.showToast({
            title: '获取微信昵称失败'
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '获取微信昵称失败'
        })
        
      }
    })
    setTimeout(() => {
      wx.redirectTo({
        url: './../monitor/monitor'
      })
    }, 2000);
  },
  getAppTheme () {
    let defaultTheme = {
        theme_app_icon: {
          url: "",
          app_icon_id: 0
        },
        theme_color: {
          theme_color_type: 0,
          color_whole: "#22262D",
          color_untouchable_btn: "#697489",
          color_navibar_text: "",
          color_searchbar_bg: "",
        },
        theme_loc_icon: {
          theme_locicon_type: 0,
          icon_moving: "",
          icon_moving_fast: "",
          icon_overspeed: "",
          icon_offline: "",
          icon_still: "",
          icon_expired: ""
        },
        theme_logo: {
          url: ""
        }
    };
    const that = this;
    wx.request({
      url: 'https://litin.gmiot.net/1/tool/theme?method=getAllTheme',
      data: {
        account: app.globalData.account,
        access_token: app.globalData.accessToken
      },
      success: function (res) {
        let data = res.data.data;
        app.globalData.appTheme.theme_color = data.theme_color.color_whole ? data.theme_color : defaultTheme.theme_color;
        app.globalData.appTheme.theme_loc_icon = data.theme_loc_icon.theme_locicon_type ? data.theme_loc_icon : defaultTheme.theme_loc_icon;
        for (const key in app.globalData.appTheme.theme_loc_icon) {
          if (key.indexOf('icon_')==0) {
            wx.downloadFile({
              url: app.globalData.appTheme.theme_loc_icon[key],
              success (res) {
                app.globalData.appTheme.theme_loc_icon[key] = res.tempFilePath;
              }
            })
          }
        }
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: app.globalData.appTheme.theme_color.color_whole
        })
        // that.setData({
        //   themeLogo: app.globalData.appTheme.theme_logo.url
        // })
      },
      fail: function (err) {
        console.log(err);
      }
    })
  }
})