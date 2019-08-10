const app = getApp();
Page({
  data: {
    min: 0,
    max: 0,
    noDevice: false,
    noData: true,
    updateTimer: '',
    animationData: {},
    currentLongitude: 0,
    currentLatitude: 0,
    deviceList: [],
    deviceIndex: 0,
    currentDevice: {},
    circles: [],
    fence: false,
    markers: [],
    bgcSet: '',
    nodes: [{
      name: 'strong',
      attrs: {
        class: 'div_class',
        style: 'color: red;font-size:24px;line-height:24px;'
      },
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    }],
  },
  onLoad(option) {
    const that = this;
    that.setData({
      bgcSet: 'background-color:' + app.globalData.appTheme.theme_color.color_whole
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.globalData.appTheme.theme_color.color_whole
    })
    let imei = app.globalData.imei
    if (imei) {
      this.getDeviceList(function (res) {
        for (let i = 0; i < res.length; i++) {
          if (res[i].imei === imei) {
            that.setData({
              deviceIndex: i
            })
            break;
          }
        }
        that.updateCurrentDevice(that.data.deviceIndex)
        that.data.updateTimer = setInterval(function () {
          that.updateCurrentDevice(that.data.deviceIndex)
        }, 10000)
        that.setData({
          updateTimer: that.data.updateTimer
        })
      })
    } else {
      that.updateCurrentDevice(that.data.deviceIndex)
      that.data.updateTimer = setInterval(function () {
        that.updateCurrentDevice(that.data.deviceIndex)
      }, 10000)
      that.setData({
        updateTimer: that.data.updateTimer
      })
    }
  },
  onShow () { 
    const that = this
    if (!this.data.updateTimer) {
        that.data.updateTimer = setInterval(function () {
          that.updateCurrentDevice(that.data.deviceIndex)
        }, 10000)
        that.setData({
          updateTimer: that.data.updateTimer
        })
      }
  },
  onHide() {
    clearInterval(this.data.updateTimer)
  },
  regionchange(e) {
    
  },
  onUnload () {
    
  },
 onShareAppMessage(res) {
   if (res.from == 'button') {
     return {
       title: '数化万物 智在融合',
       path: 'pages/locationShare/locationShare?lng=' + app.globalData.location.lng + '&lat=' + app.globalData.location.lat,
       imageUrl: './../images/forward.jpg'
     }
   } else {
     return {
       title: '数化万物 智在融合',
       path: 'pages/login/login',
       imageUrl: './../images/forward.jpg'
     }
   }
 },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  tap (e) {
    console.log(e)
  },
  toAlarm () {
    wx.navigateTo({
      url: './../alarm/alarm'
    })
  },
  bindDevice() {
    wx.navigateTo({
      url: './../bind/bind'
    })
  },
  toDetail () {
    wx.navigateTo({
      url: '../detail/detail?imei=' + this.data.currentDevice.imei + '&heart_time=' + this.data.currentDevice.heart_time
    })
  },
  toPlayback () {
    wx.navigateTo({
      url: './../calendar/calendar?imei=' + this.data.currentDevice.imei
    })
  },
  toSwitch () {
    wx.navigateTo({
      url: './../switch/switch?imei=' + this.data.currentDevice.imei
    })
  },
  navigateTo() {
    var latitude = this.data.currentDevice.lat;
    var longitude = this.data.currentDevice.lng;
    wx.openLocation({
      latitude,
      longitude,
    })
  },
  getDeviceList (cb) {
    const that = this;
    wx.login({
      success(res) {
        wx.request({
          url: 'https://litin.gmiot.net/1/auth/access_token',
          data: {
            method: 'loginByWechat',
            wxcode: res.code
          },
          success: function (res) {
            app.globalData.account = res.data.data.account
            app.globalData.accessToken = res.data.data.access_token
            wx.request({
              url: 'https://litin.gmiot.net/1/account/monitor',
              data: {
                access_type: 'inner',
                map_type: 'AMAP',
                account: res.data.data.account,
                target: res.data.data.account,
                access_token: res.data.data.access_token
              },
              success: function (res) {
                cb(res.data.data)
                
              },
              fail: function (err) {
                console.log(err)
              }
            })
          },
          fail: function (err) {
            console.log(err)
          }
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  updateCurrentDevice (index) {
    const that = this;
    wx.request({
      url: 'https://litin.gmiot.net/1/account/monitor',
      data: {
        access_type: 'inner',
        map_type: 'AMAP',
        account: app.globalData.account,
        target: app.globalData.account,
        access_token: app.globalData.accessToken
      },
      success: function (res) {
        if (res.data.data.length == 0) {
          that.setData({
            deviceList: [],
            noDevice: true,
            markers: [],
            circles: []
          })
          that.getWeChatLocation(
            function (location) {
              if (location.latitude && location.longitude) {
                that.setData({
                  currentLatitude: location.latitude,
                  currentLongitude: location.longitude
                })
              } else {
                that.setData({
                  currentLatitude: res.data.defaultpos.lat,
                  currentLongitude: res.data.defaultpos.lng
                })
              }
            }
          )

        } else {
          that.setData({
            noDevice: false,
            noData: false,
          })
          that.data.currentDevice = res.data.data[index]
          that.setData({
            deviceList: res.data.data,
            currentDevice: that.data.currentDevice,
            markers: []
          })
          app.globalData.imei = that.data.currentDevice.imei
          app.globalData.location = {
            lat: that.data.currentDevice.lat,
            lng: that.data.currentDevice.lng
          }
          // 添加marker
          for (let i = 0; i < that.data.deviceList.length; i++) {
            let device = that.data.deviceList[i].device_info_new
            let iconPath
            if (device === 0) {
              // iconPath = './../images/move.png';
              iconPath = app.globalData.appTheme.theme_loc_icon.icon_moving;
            } else if (device === 1) {
              // iconPath = './../images/offline.png';
              iconPath = app.globalData.appTheme.theme_loc_icon.icon_offline;
            } else if (device === 2) {
              // iconPath = './../images/overdue.png';
              iconPath = app.globalData.appTheme.theme_loc_icon.icon_expired;
            } else if (device === 3) {
              // iconPath = './../images/offline.png';
              iconPath = app.globalData.appTheme.theme_loc_icon.icon_moving;              
            } else if (device === 4) {
              // iconPath = './../images/static.png';
              iconPath = app.globalData.appTheme.theme_loc_icon.icon_still;
            }
            let obj = {
              iconPath: iconPath,
              id: i,
              latitude: that.data.deviceList[i].lat,
              longitude: that.data.deviceList[i].lng,
              width: 30,
              height: 30,
              rotate: that.data.deviceList.course,
              anchor: {
                x: .5,
                y: .5
              }
            }
            that.data.markers.push(obj)
          }
          that.setData({
            markers: that.data.markers
          })
          that.getAddress({
            latitude: that.data.currentDevice.lat,
            longitude: that.data.currentDevice.lng
          }, function (e) {
            that.data.currentDevice.address = e
            that.setData({
              currentDevice: that.data.currentDevice
            })
          })
          that.getFenceStatus(that.data.currentDevice.imei)
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  toDeviceList() {
    wx.navigateTo({
      url: '../deviceList/deviceList'
    })
  },
  getAddress (obj, cb) {
    const url = 'https://litin.gmiot.net/1/tool/address'
    let data = {
      access_type: 'inner',
      lng: obj.longitude,
      lat: obj.latitude,
      access_token: app.globalData.accessToken,
      map_type: 'AMAP',
      account: app.globalData.account
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.errcode === 0) {
          let address = res.data.data.address
          cb(address)
        } else {
          console.log('获取地址信息错误')
        }
      }
    })
  },
  getFenceStatus (imei) { 
    const url = 'https://litin.gmiot.net/1/tool/efence'
    const that = this
    let data = {
      method: 'get',
      access_type: 'inner',
      map_type: 'AMAP',
      account: app.globalData.account,
      access_token: app.globalData.accessToken,
      imei: imei
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.errcode ===0) {
          let data = res.data.data
          if (data.validate_flag === '1' && data.alarm_type === '6') {
            let circleData = data.shape_param.split(',')
            that.setData({
              fence: true,
              circles: [
                {
                  latitude: circleData[0],
                  longitude: circleData[1],
                  color: '#22262DAA',
                  fillColor: '#0000002A',
                  radius: +circleData[2],
                  strokeWidth: 0.5
                }
              ]
            })
          } else {
            that.setData({
              fence: false,
              circles: []
            })

          }
        } else {
          wx.showToast({
            title: '获取设防状态失败',
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
  },
  setFence (obj) {
    const that = this
    const url = 'https://litin.gmiot.net/1/tool/efence'
    let data = {
      method: 'set',
      access_type: 'inner',
      access_token: app.globalData.accessToken,
      account: app.globalData.account,
      map_type: 'AMAP',
      validate_flag: 1,
      imei: obj.imei,
      alarm_type: 6,
      shape_type: 1,
      shape_param: obj.lat + ',' + obj.lng + ',' + '100'
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.errcode === 0) {
          wx.showToast({
            title: '设防成功',
            duration: 1500,
            icon: 'success'
          })
          clearInterval(that.data.updateTimer)
          that.updateCurrentDevice(that.data.deviceIndex)
          that.data.updateTimer = setInterval(function () {
            that.updateCurrentDevice(that.data.deviceIndex)
          }, 10000)
          that.setData({
            updateTimer: that.data.updateTimer,
            fence: true
          })
        } else {
          wx.showToast({
            title: '设防失败',
            duration: 1500
          })
        }
        
      }
    })
  },
  switchFence() {
    if (!this.data.fence) {
      this.setFence(this.data.currentDevice)
    } else {
      this.removeFence(this.data.currentDevice.imei)
    }
  },
  removeFence(imei) {
    const that = this
    const url = 'https://litin.gmiot.net/1/tool/efence'
    let data = {
      method: 'switch',
      imei: imei,
      validate_flag: 0,
      access_token: app.globalData.accessToken,
      account: app.globalData.account,
      alarm_type: 6,
      id:0
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.msg === 'OK') {
          wx.showToast({
            title: '撤防成功',
            icon: 'success'
          })
          clearInterval(that.data.updateTimer)
          that.updateCurrentDevice(that.data.deviceIndex)
          that.data.updateTimer = setInterval(function () {
            that.updateCurrentDevice(that.data.deviceIndex)
          }, 10000)
          that.setData({
            updateTimer: that.data.updateTimer,
            fence: false
          })
        }
        
      },
      fail: function (err) {
        wx.showToast({
          title: '关闭围栏失败'
        })
      }
    })
    
  },
  getWeChatLocation (cb) {
    const that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        cb(res)
      },
      fail: function (err) {
        cb(err)       
      }
    })
  }
  
})