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
    goome_card: '',
    mobile: '',
    palte: '',
    owner: '',
    idNum: '',
    wlcard_out_time: '',
    beginpos: 0,
    wlcard_out_time: ''
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
          that.setData({
            name: data.name.trim(),
            imei: data.imei,
            remark: data.remark || '',
            enableTime: that.getDate(data.in_time),
            outTime: that.getDate(data.out_time),
            type: data.dev_type,
            iotCard: data.phone,
            goome_card: data.goome_card,
            mobile: data.tel,
            plate: data.number,
            owner: data.owner,
            idNum: data.owner_idno == 'NULL' ? '' : data.owner_idno,
            wlcard_out_time: data.is_iot_card ? that.getDate(data.wlcard_out_time) : ''
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
  editDetail(e) {
    let title = e.currentTarget.dataset.prop
    let val = e.currentTarget.dataset.value
    wx.navigateTo({
      url: './editDetail/editDetail?title=' + title + '&imei=' + this.data.imei + '&val=' + val
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
  },
  platformCharge() {
      const that = this
      const url = 'https://litin.gpsoo.net/1/carol-pay'
      let params = {
        method: 'renewDevList',
        beginpos: this.data.beginpos,
        pagesize: 20,
        access_token: app.globalData.accessToken,
        access_type: 'inner'
      }
      wx.request({
        url: url,
        data: params,
        success: function (res) {
          if (res.data.errcode === 0) {
            let list = res.data.data;
            let chargeObj = {}
            for (var i = 0; i < list.length; i++) {
              if (list[i].imei == app.globalData.imei) {
                chargeObj = list[i]
                break
              }
            }
            if (JSON.stringify(chargeObj) == "{}") {
              that.setData({
                beginpos: that.data.beginpos += 20
              })
              that.platformCharge()
              return
            }
            that.setData({
              beginpos : 0
            })
            var expire = '';
            var confirmText = '确定';
            if (chargeObj.expire_time == '2100-01-01 00:00:00') {
              expire = '终生';
            } else {
              expire = chargeObj.expire_time.split(' ')[0] + '到期    ' + (chargeObj.fee[0].amount / 100) + '元/年';
              confirmText = '续费';
            }
            wx.showModal({
              title: chargeObj.user_name,
              content: expire,
              confirmText: confirmText,
              success: function (res) {
                if (res.confirm) {
                  if (chargeObj.expire_time != '2100-01-01 00:00:00') {
                    that.initPayment(chargeObj)
                  }
                } else if (res.cancel) {

                }
              }
            })
          } else {
            wx.showToast({
              title: '获取充值信息失败',
              icon: 'none'
            })
          }
        }
      })
  },
  wlcardRecharge () {
    const that = this;
    wx.showModal({
      title: this.data.name,
      content: "物联卡到期时间：" + this.data.wlcard_out_time,
      confirmText: "续费",
      success: function (res) {
        if (res.confirm) {
            that.initWlcardPayment()
        } else if (res.cancel) {

        }
      }
    })
  },
  initWlcardPayment () {
    const that = this;
    const url = "https://litin.gmiot.net/carol-pay";
    wx.request({
      url,
      data: {
        method: 'renewWlcard',
        eid: app.globalData.accessToken.substr(5, 7),
        msisdns: that.data.iotCard,
        access_token: app.globalData.accessToken,
        pay_type: "mp",
        open_id: app.globalData.openId
      },
      success: function (res) {
        if (res.data.errcode == 0) {
          let data = res.data.data;
          that.checkPayment(data);
        } else {
          wx.showToast({
              title: '获取充值信息失败',
              icon: 'none'
          })
        }
      }
    })
  },
  initPayment(obj) {
    const that = this
    const url = 'https://litin.gpsoo.net/1/carol-pay'
    let data = {
      method: 'renewOrder',
      imei: obj.imei,
      fee_type: 6, // 6 代表万物在线小程序
      amount: obj.fee[0].amount,
      pay_plat: 1,
      pay_manner: 2,
      access_token: app.globalData.accessToken,
      uid: obj.uid,
      access_type: 'inner',
      open_id: app.globalData.openId
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.errcode == 0) {
          that.checkPayment(res.data.data)
        } else {
          wx.showToast({
            title: '获取充值信息失败',
            icon: 'none'
          })
        }
      }
    })
  },
  checkPayment(obj) {
    const that = this
    wx.requestPayment({
      timeStamp: obj.wx_pay.timestamp,
      nonceStr: obj.wx_pay.noncestr,
      package: obj.wx_pay.package,
      signType: 'MD5',
      paySign: obj.wx_pay.paysign,
      appId: obj.wx_pay.appid,
      success(res) {
        console.log('成功')
        console.log(res)
        that.getDetail(that.data.imei);
      },
      fail(res) {
        console.log('失败')
        console.log(res)
      }
    })
  }
})