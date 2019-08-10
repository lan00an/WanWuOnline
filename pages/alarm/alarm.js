// pages/alarm.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login_type:'',
    contactList: [{
      "alarm_type": "",
      "user_name": "",
      "send_time": "",
      "alarm_num":"",
      "alarm_type_id":""    }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor:                       app.globalData.appTheme.theme_color.color_whole
    })

    that.getAlarm()


  },

  /**
   * 报警信息
   */
  getAlarm: function() {
    let that = this
    const url = 'https://litin.gmiot.net/1/tool/get_alarminfo?access_type=inner&cn=gm&lang=zh-CN&map_type=AMAP&method=getAlarmOverview&time=1510037579&timestamp=0'
    console.log(app.globalData.accessToken)
    console.log(app.globalData.imei)
    console.log(app.globalData.account)
    if (app.globalData.imei){
      that.data.login_type = "dev"
    }else{
      that.data.login_type = "user"
    }
    let data = {
      login_type: that.data.login_type,
      imie: app.globalData.imei,
      account: app.globalData.account,
      access_token: app.globalData.accessToken
    }
    wx.request({
      url: url,
      data:data,
      success: function (res) {
        console.log(res)
        if (res.data.errcode === 0) {
          let arr = res.data.data
          console.log(arr)
          for (let i = 0; i < arr.length;i++){
            let date=new Date(Number(arr[i].send_time)*1000);
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            let D = date.getDate() + ' ';
            let h = date.getHours() + ':';
            let m = date.getMinutes() + ':';
            let s = date.getSeconds();
            console.log(Y + M + D + h + m + s); 
            arr[i].send_time = Y + M + D + h + m + s
            console.log(arr[i].send_time)
            // console.log(time)
            // res.data.data[i].send_time=time
          }
          that.setData({
            contactList: arr
          })
          // that.data.contactList=res.data.data
          console.log(that.data.contactList)
        } else {
          console.log('111')
        }
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

  readDetail: function (e) {
    console.log(e)
    var $data = e.currentTarget.dataset; 
    console.log($data)
    wx.navigateTo({
      url: './../alarmDetails/alarmDetails?alarm_type=' + $data.alarm_type + "&user_name=" + $data.user_name + "&alarm_type_id=" + $data.alarm_type_id
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