// pages/calendar/calendar.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    week: ['日', '一', '二', '三', '四', '五', '六'],
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    firstMonthArr: [],
    secondMonthArr: [],
    thirdMonthArr: [],
    fourthMonthArr: [],
    monthDayCount: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    lMonthDayCount: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], // 闰年每个月天数
    toView: '',
    totalPlayBack: 1,
    startDate: '',
    endDate: '',
    firstData: {},
    secondData: {},
    thirdData: {},
    fourthData: {},
    startIndex: 0,
    endIndex: 0,
    showButton: false,
    currentDayIndex: 0,
    imei: 0,
    bgcSet: '',
    bgcSetDisable: ''
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
      bgcSet: 'background-color:' + app.globalData.appTheme.theme_color.color_whole,
    })

    this.init ()
    // 根据月份第一天周几添加前面空标签，再添加日期，再添加后面空标签
    let monthArr = ['firstData', 'secondData', 'thirdData', 'fourthData']
    let monthDayArr = ['firstMonthArr', 'secondMonthArr', 'thirdMonthArr', 'fourthMonthArr']
    for (let i = 0; i < monthArr.length; i++) {
      for (let j = 0; j < this.data[monthArr[i]].firstDay; j++) {
        this.data[monthDayArr[i]].push('')
      }
      let monthDayCount = this.data[monthArr[i]].monthDayCount
      let month = this.data[monthArr[i]].month
      let firstDay = this.data[monthArr[i]].firstDay
      for (let k = 1; k <= monthDayCount[this.data[monthArr[i]].month - 1]; k++) {
        this.data[monthDayArr[i]].push(k)
      }
      if (firstDay == 0 && month == 2) {
        for (let m = 0; m < 28 - monthDayCount[month - 1] - firstDay; m++) {
          this.data[monthDayArr[i]].push('')
        }
      } else {
        for (let n = 0; n < 35 - monthDayCount[month - 1] - firstDay; n++) {
          this.data[monthDayArr[i]].push('')
        }
      }
    }
    this.setData({
      firstMonthArr: this.data.firstMonthArr,
      secondMonthArr: this.data.secondMonthArr,
      thirdMonthArr: this.data.thirdMonthArr,
      fourthMonthArr: this.data.fourthMonthArr,
      toView: 'fourth',
      imei: options.imei
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
  checkLeapYear(year) {
    if ((year % 400 == 0) || ((year % 4 == 0) && (year % 100 !== 0))) {
      return true
    }
    return false
  },
  toPlayBack () {
    var today = this.data.year + '/' + this.data.month + '/' + new Date().getDate()
    let startDate = this.data.startDate ? new Date(this.data.startDate).getTime() / 1000 : parseInt(new Date(today).getTime() / 1000)
    var defaultEndTime = startDate + 86400 - 1
    let endDate = this.data.endDate ? new Date(this.data.endDate).getTime() / 1000 + 86400 - 1 : defaultEndTime
    wx.redirectTo({
      url: './../playback/playback?startDate=' + startDate + '&endDate=' + endDate + '&imei=' + this.data.imei
    })
  },
  init () {
    this.data.firstData.year = this.data.month - 3 > 0 ? this.data.year : (this.data.year - 1);
    this.data.firstData.month = this.data.month - 3 > 0 ? this.data.month - 3 : (this.data.month - 3 + 12);
    this.data.firstData.firstDay = new Date(this.data.firstData.year +'/' + this.data.firstData.month +'/1').getDay();
    this.data.firstData.monthDayCount = this.checkLeapYear(this.data.firstData.year) ? this.data.lMonthDayCount : this.data.monthDayCount
    this.data.firstData.totalDay = this.data.firstData.monthDayCount[this.data.firstData.month - 1];
    this.data.secondData.year = this.data.month - 2 > 0 ? this.data.year : (this.data.year - 1);
    this.data.secondData.month = this.data.month - 2 > 0 ? this.data.month - 2 : (this.data.month - 2 + 12);
    this.data.secondData.firstDay = new Date(this.data.secondData.year + '/' + this.data.secondData.month + '/1').getDay();
    this.data.secondData.monthDayCount = this.checkLeapYear(this.data.secondData.year) ? this.data.lMonthDayCount : this.data.monthDayCount
    this.data.secondData.totalDay = this.data.secondData.monthDayCount[this.data.secondData.month - 1];
    this.data.thirdData.year = this.data.month - 1 > 0 ? this.data.year : (this.data.year - 1);
    this.data.thirdData.month = this.data.month - 1 > 0 ? this.data.month - 1 : (this.data.month - 1 + 12);
    this.data.thirdData.firstDay = new Date(this.data.thirdData.year + '/' + this.data.thirdData.month + '/1').getDay();
    this.data.thirdData.monthDayCount = this.checkLeapYear(this.data.thirdData.year) ? this.data.lMonthDayCount : this.data.monthDayCount
    this.data.thirdData.totalDay = this.data.thirdData.monthDayCount[this.data.thirdData.month - 1];
    this.data.fourthData.year = this.data.year;
    this.data.fourthData.month = this.data.month;
    this.data.fourthData.firstDay = new Date(this.data.fourthData.year + '/' + this.data.fourthData.month + '/1').getDay();
    this.data.fourthData.monthDayCount = this.checkLeapYear(this.data.fourthData.year) ? this.data.lMonthDayCount : this.data.monthDayCount
    this.data.fourthData.totalDay = this.data.fourthData.monthDayCount[this.data.fourthData.month - 1];
    this.data.currentDayIndex = new Date().getDate() + this.data.firstData.totalDay + this.data.secondData.totalDay + this.data.thirdData.totalDay
    this.setData({
      firstData: this.data.firstData,
      secondData: this.data.secondData,
      thirdData: this.data.thirdData,
      fourthData: this.data.fourthData,
      currentDayIndex: this.data.currentDayIndex,
      startIndex: this.data.currentDayIndex
    })
  },
  selectDate(e) {
    let classIndex = e.currentTarget.dataset.classindex
    let date = e.currentTarget.dataset.date
    if (classIndex === 0 || classIndex > this.data.currentDayIndex) {
      return
    }
    if (!this.data.startIndex) {
      this.setData({
        startIndex: classIndex,
        startDate: date
      })
    } else {
      if (!this.data.endIndex) {
        if (classIndex < this.data.startIndex) {
          this.setData({
            startIndex: classIndex,
            startDate: date
          })
        } else if (classIndex == this.data.startIndex) {
          this.setData({
            startIndex: '',
            startDate: ''
          })
        } else if (classIndex - this.data.startIndex >= 3) {
          console.log(classIndex - this.data.startIndex)
          this.setData({
            startIndex: classIndex,
            startDate: date,
          })
        } else {
          console.log(classIndex - this.data.startIndex)
          this.setData({
            endIndex: classIndex,
            endDate: date,
          })
        }
      } else {
        this.setData({
          startIndex: classIndex,
          startDate: date,
          endIndex: '',
          endDate: '',
          totalPlayBack: 1
        })
      }
    }
  }
})