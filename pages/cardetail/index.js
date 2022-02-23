// pages/cardetail/index.js


Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: {
      name: '天安门广场',
      latitude: 39.903740,
      longitude: 116.397827
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  onRunApi() {
    const version = wx.getSystemInfoSync().SDKVersion
    if (util.compareVersion(version, '2.14.0') < 0) {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showToast({
        title: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        icon: 'none'
      })
      return;
    }
    if (!this.data.location) {
      wx.showToast({
        title: '请选择目的地',
        icon: 'none'
      })
      return;
    }
    const mapCtx = wx.createMapContext('map', this);
    mapCtx.openMapApp({
      latitude: this.data.location.latitude,
      longitude: this.data.location.longitude,
      destination: this.data.location.name
    })
  },
})