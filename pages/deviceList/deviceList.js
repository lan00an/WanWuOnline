const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceList: [],
    statusArr: ['正常', '未启用', '过期', '离线', '静止']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDeviceList()
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

  },
  getDeviceList: function () {
    const that = this;
    wx.request({
      url: 'https://litin.gpsoo.net/1/account/monitor',
      data: {
        access_type: 'inner',
        map_type: 'AMAP',
        account: app.globalData.account,
        target: app.globalData.account,
        access_token: app.globalData.accessToken
      },
      success: function (res) {
        that.setData({
          deviceList: res.data.data
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  toDetail (e) {
    var imei = e.target.dataset.imei;
    var htime = e.target.dataset.htime;
    wx.navigateTo({
      url: './../detail/detail?imei=' + imei + '&heart_time='+ htime
    })
  },
  chooseDevice (e) {
    var imei = e.target.dataset.imei;
    app.globalData.imei = imei
    wx.reLaunch({
      url: './../monitor/monitor'
    })
  }
})