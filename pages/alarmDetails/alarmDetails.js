// pages/alarmDetails/alarmDetails.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailList: [{
      "alarm_time": "",
      "dev_name": "",
      "address":"",
      "lat":"",
      "lng":""
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    that.setData({
      options:options
    })
    wx.setNavigationBarTitle({
      title: options.alarm_type
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.globalData.appTheme.theme_color.color_whole
    })
    that.getAlarmDetails();
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
  readDetails:function(e){
    console.log(e)
    var $data = e.currentTarget.dataset;
    console.log($data)
    wx.navigateTo({
      url: './../mapDetail/mapDetail?dev_name=' + $data.dev_name + "&alarm_time=" + $data.alarm_time + "&address=" + $data.address + "&lat=" + $data.lat+"&lng="+$data.lng
    })
  },
/**
   * 获取设备的所有详情
   */
  getAlarmDetails:function () {
    let that = this
    const url = 'https://litin.gmiot.net/1/tool/get_alarminfo?access_type=inner&cn=gm&lang=zh-CN&map_type=AMAP&method=getAlarmDetail&&page_dir=next&pagesize=10&time=1510196075&timestamp=0'
    if (app.globalData.imei) {
      that.data.login_type = "dev"
    } else {
      that.data.login_type = "user"
    }
    let data = {
      alarm_type: that.options.alarm_type_id,
      login_type: that.data.login_type,
      imie: app.globalData.imei,
      account: app.globalData.account,
      access_token: app.globalData.accessToken
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        console.log(res)
        if (res.data.errcode === 0) {
          let arr = res.data.data
          console.log(arr)
          for (let i = 0; i < arr.length; i++) {
            let date = new Date(Number(arr[i].alarm_time) * 1000);
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            let D = date.getDate() + ' ';
            let h = date.getHours() + ':';
            let m = date.getMinutes() + ':';
            let s = date.getSeconds();
            arr[i].alarm_time = Y + M + D + h + m + s
            console.log(arr[i].alarm_time)
          }
          that.setData({
            detailList: arr
          })
          console.log(that.data.detailList)
        } else {
          console.log('111')
        }
      }
    })

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
  }
})