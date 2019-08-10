// pages/playback/playback.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mapHeight: "300px",
    beginTime: '',
    endTime: '',
    currentDate: '0000-00-00',
    currentTime: '00:00:00',
    curretSpeed: 0,
    currentLatitude: 0,
    currentLongitude: 0,
    totalDistance: 0,
    sliderValue: 0,
    image: 'pause',
    timer: 0,
    runTime: '',
    totalTime: '',
    playIndex: 0,
    playData: [],
    markers: [],
    polyline: [{
        points: [],
        color: "#22262DFF",
        width: 4,
        dottedLine: false
    }],
    imei: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.globalData.appTheme.theme_color.color_whole
    })
    this.setData({
      beginTime: options.startDate,
      endTime: options.endDate,
      imei: options.imei
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          mapHeight: (res.windowHeight - 100) + "px"
        })
        that.sendRequest(that.data.beginTime, that.data.endTime)
      }
    })
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
    clearInterval(this.data.timer)
    wx.redirectTo({
      url: './../monitor/monitor'
    })
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
      imageUrl: '../images/forward.jpg'
    }
  },
  slider3change(e) {
    
  },
  addPoints(index) {
    const that = this
    let i = index;
    let distance = 0;
    let data = this.data.playData
    this.data.timer = setInterval(function () {
      let locationB = {
        longitude: data[i].lng,
        latitude: data[i].lat,
        gpsTime: data[i].gps_time
      }
      if (i > 0) {
        let locationA = {
          longitude: data[i - 1].lng,
          latitude: data[i - 1].lat,
          gpsTime: data[i-1].gps_time
        }
        distance = distance + that.getDistance(locationB, locationA)
        that.getRunTime(data[0], data[i])
      }
      that.data.polyline[0].points.push(locationB)
      that.setData({
        polyline: that.data.polyline,
        currentDate: that.getDate(data[i].gps_time),
        currentTime: that.getTime(data[i].gps_time),
        curretSpeed: data[i].speed,
        totalDistance: (distance / 1000).toFixed(2),
        sliderValue: i,
        markers: [{
          latitude: data[i].lat,
          longitude: data[i].lng,
          iconPath: '../images/marker.png',
          width: 30,
          height: 30,
          rotate: data[i].course,
          anchor:{x:.5, y:.5}
        }]
      })
      that.markerVisible()
      i++
      if (i > (that.data.playData.length - 1)) {
        clearInterval(that.data.timer)
      }
      that.setData({
        playIndex: i
      })

    }, 500)
    this.setData({
      timer: this.data.timer
    })
  },
  markerVisible () {
    const that = this
    let map = wx.createMapContext('playback')
    map.getRegion({
      success: function(res) {
        let location = {
          longitude: that.data.markers[0].longitude,
          latitude: that.data.markers[0].latitude
        }
        let moveMap = res.southwest.longitude > location.longitude || res.southwest.latitude > location.latitude || res.northeast.longitude < location.longitude || res.northeast.latitude < location.latitude
        if (moveMap) {
          that.setData({
            currentLongitude: location.longitude,
            currentLatitude: location.latitude
          })
        }
      }
    })
  },
  getDistance(locationA, locationB) {
    let EARTH_RADIUS = 6378137
    let PI = Math.PI
    function getRad(d) {
      return d * PI / 180.0;
    }
    let radLatA = getRad(locationA.latitude);
    let radLatB = getRad(locationB.latitude);
    let a = radLatA - radLatB;
    let b = getRad(locationA.longitude) - getRad(locationB.longitude);
    let distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLatA) * Math.cos(radLatB) * Math.pow(Math.sin(b / 2), 2)));
    distance = distance * EARTH_RADIUS;
    distance = Math.round(distance * 10000) / 10000.0;
    return distance
  },
  getRunTime (beginPoint, endPoint) {
    let runTime = '';
    let timeGap = endPoint.gps_time - beginPoint.gps_time
    let hour = parseInt(timeGap / 3600)
    let minute = parseInt((timeGap % 3600) / 60)
    let second = timeGap % 60
    hour = hour >= 10 ? hour: '0' + hour
    minute = minute >= 10 ? minute : '0' + minute
    second = second >= 10 ? second: '0' + second
    runTime = hour + ':' + minute + ':' + second
    this.setData({
      runTime: runTime
    })
  },
  getTotalTime () {
    // 1534349247 1534376833
    let totalTime = '';
    let timeGap = this.data.playData[this.data.playData.length -1].gps_time - this.data.playData[0].gps_time
    let hour = parseInt(timeGap / 3600)
    let minute = parseInt((timeGap % 3600) / 60)
    let second = timeGap % 60
    hour = hour >= 10 ? hour: '0' + hour
    minute = minute >= 10 ? minute : '0' + minute
    second = second >= 10 ? second: '0' + second
    totalTime = hour + ':' + minute + ':' + second
    this.setData({
      totalTime: totalTime
    })
    console.log(totalTime)
  },
  getDate (timestamp) {
    let fullTimestamp = timestamp * 1000
    let year = new Date(fullTimestamp).getFullYear();
    let month = new Date(fullTimestamp).getMonth() + 1;
    let day = new Date(fullTimestamp).getDate()
    month = month >= 10 ? month : '0' + month
    day = day >= 10 ? day: '0' + day
    return year + '-' + month + '-' + day
  },
  getTime(timestamp) {
    let fullTimestamp = timestamp * 1000
    let hour = new Date(fullTimestamp).getHours();
    let minute = new Date(fullTimestamp).getMinutes();
    let second = new Date(fullTimestamp).getSeconds()
    minute = minute >=10 ? minute : '0' + minute
    second = second >=10 ? second : '0' + second
    return hour + ':' + minute + ':' + second
  },
  playAndPause () {
    if (this.data.image == 'pause') {
      this.setData({
        image: 'play'
      })
      clearInterval(this.data.timer)
    } else {
      this.setData({
        image: 'pause'
      })
      this.addPoints(this.data.playIndex)
    }
  },
  sendRequest(beginTime, endTime) {
    const that = this
    wx.request({
      url: 'https://litin.gmiot.net/1/devices/history',
      data: {
        begin_time: beginTime,
        end_time: endTime,
        account: app.globalData.account,
        map_type: 'AMAP',
        access_type: 'inner',
        limit: 1000,
        access_token: app.globalData.accessToken,
        imei: this.data.imei,
        method: "getHistoryGpsLocation",
        appver: 1.0

      },
      success: function (res) {
       if (res.data.errcode ===0) {
        let data = res.data.data
        if (data.pos.length >0) {
          that.data.playData = that.data.playData.concat(data.pos)
          that.setData({
            playData: that.data.playData
          })
        }
        if (data.pos.length > 0 && (data.resEndTime - data.pos[data.pos.length - 1].gps_time > 10)) {
          that.sendRequest(data.resEndTime, endTime)
        } else {
          if (that.data.playData.length > 0) {
            for (let i = 0; i < that.data.playData.length; i++) {
              if (that.data.playData[0].speed === 0) {
                that.data.playData.shift()
              }
              if (that.data.playData[that.data.playData.length - 1] ===0) {
                that.data.playData.pop()
              }
            }
            for (let i = 0; i < that.data.length; i++) {
              if (that.data.playData[i].speed < 0) {
                that.data.playData.splice(i, 1)
              }
            }
            that.setData({
              playData: that.data.playData
            })            
              that.getTotalTime()
              that.setData({
                min: 0,
                max: that.data.playData.length - 1,
                currentLongitude: that.data.playData[0].lng,
                currentLatitude: that.data.playData[0].lat
              })
              that.addPoints(0)            
          } else {
            wx.getLocation({
              type: 'gcj02',
              success: function (res) {
                that.setData({
                  currentLatitude: res.latitude,
                  currentLongitude: res.longitude
                })
                wx.showToast({
                  title: '没有回放数据',
                  icon: 'none',
                  duration: 2000,
                  success: function (res) {
                    setTimeout(() => {
                      
                    }, 2000);
                  }
                })
              }
            })
            
          }
        }
       }
        
      },
      fail: function (err) {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})