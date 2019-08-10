// pages/mapDetail/mapDetail.js
const app = getApp();
Page({
  data: {
    dev_name:'',
    alarm_time:'',
    address:'',
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      id: 0,
      iconPath: './../images/c-position.png',
      latitude: 23.099994,
      longitude: 113.324520,
      name: '',
      callout:{}
    }],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      dev_name: options.dev_name,
      alarm_time: options.alarm_time,
      address: options.address,
      latitude:options.lat,
      longitude:options.lng,
      markers: [{
        id: 1,
        iconPath: './../images/c-position.png',
        latitude: options.lat,
        longitude: options.lng,
        name: options.address,
        width:30,
        height:30,
      }],

    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.globalData.appTheme.theme_color.color_whole
    })
  },
  // onReady: function (e) {
  //   this.mapCtx = wx.createMapContext('myMap')
  // },
  bindcallouttap: function (e) {
    wx.redirectTo({
      url: './../monitor/monitor'
    })
  },
  onShareAppMessage(res) {
    return {
      title: '数化万物 智在融合',
      path: 'pages/authorize/authorize',
      imageUrl: './../images/forward.jpg'
    }
  },
})