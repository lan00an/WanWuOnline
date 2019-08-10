// pages/scan/manual/manual.js
import md5 from './../../../utils/md5.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    submit: false,
    imei: '',
    bgcSet: '',
    bgcSetDisable: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
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
      path: 'pages/authorize/authorize',
      imageUrl: './../../images/forward.jpg'
    }
  },
   bindGetUserInfo: function (e) {
     console.log(e.detail.userInfo)
   },
   inputContent (e) {
    if (String(e.detail.value).length === 15) {
      this.setData({
        submit: true,
        imei: e.detail.value
      })
    }
    if (String(e.detail.value).length !== 15) {
      this.setData({
        submit: false,
        imei: e.detail.value
      })
    }
   },
   getAlarmType(callback) {
     const url = 'https://litin.gmiot.net/GetDataService?method=getAlarmTypesByPlatform'
     let data = {
       platform: 1,
       access_token: app.globalData.accessToken
     }
     wx.request({
       url: url,
       data: data,
       success: function (res) {
         if (res.data.errcode === 0) {
           let data = res.data.data
           let arr = new Array
           data.forEach(item => {
            arr.push(item.id)
           })
           let typeStr = arr.join(',')
           callback(typeStr)
         } else {
           wx.showToast({
             title: res.data.msg,
             icon: 'none',
             duration: 2000
           })
         }
         return
         
       },
       fail: function (err) {
         wx.showToast({
           title: '获取报警类型失败',
           icon: 'none',
           duration: 2000
         })
       }
     })
   },
   bindAlert() {
     this.getAlarmType(res => {
       const url = "https://litin.gmiot.net/v1/wxcgi/setWxAlarmPushInfo"
       let data = {
         openid: app.globalData.account,
         sign: app.globalData.accessToken,
         alarm_push_flag: 1,
         alarm_push_type: res
       }
       wx.request({
         url: url,
         data: data,
         success: function (res) {
           if (res.data.errcode === 0) {
             wx.reLaunch({
               url: './../../monitor/monitor'
             })
           } else {
             wx.showToast({
               title: '绑定微信报警失败',
               icon: 'none',
               duration: 2000
             })
           }
         }
       })
     })
   },
   bindDevice () {
      const that = this
      let timestamp = Math.floor(new Date().getTime() / 1000)
      let str = this.data.imei + timestamp + 'Goome'
      let secret = md5.hexMD5(str)
      if(String(this.data.imei).length != 15) {

        wx.showToast({
          title: 'imei号错误',
          icon: 'none'
        })
        return
      }
      wx.request({
        url: 'https://litin.gmiot.net/1/account/binddevice',
        data: {
          account: app.globalData.account,
          imei: this.data.imei,
          time: timestamp,
          signature: secret,
          access_token: app.globalData.accessToken,
          access_type: 'inner'
        },
        success: function (res) {
          if (res.data.errcode === 0) {
            wx.showToast({
              title: '绑定成功',
              icon: 'success',
              duration: 2500,
              success: function (res) {
                app.globalData.imei = that.data.imei
                that.bindAlert()
              }
            })            
          } else if (res.data.errcode === 20027) {
            wx.showToast({
              title: '绑定失败,请联系您的服务商',
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
   }
})