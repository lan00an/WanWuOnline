//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    // 获取用户信息
  },
  globalData: {
    userInfo: null,
    account: '',
    accessToken: '',
    imei: '',
    appTheme: {}
  }
})