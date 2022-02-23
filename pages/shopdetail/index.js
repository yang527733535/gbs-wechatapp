// pages/shopdetail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      storage: JSON.parse(options.shopdata),
    });
  },
  makePhoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phoneNumber,
    });
  },

  onNavigationTap() {
    wx.openLocation({
      latitude: this.data.storage.position_x,
      longitude: this.data.storage.position_y,
      name: this.data.storage.store_name,
      address: this.data.storage.position_address,
      fail: (error) => {
        console.log(error);
      },
    });
  },

  // getShopDetail() {
  //   const that = this;
  //   wx.getStorage({
  //     key: "shopdetail",
  //     success: function (res) {
  //       console.log("res: ", res);
  //       // success
  //       that.setData({
  //         storage: res.data,
  //       });
  //     },
  //   });
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  changeShop: function () {
    // 这里的逻辑 切回首页，然后
    wx.setStorageSync("storage", this.data.storage);
    wx.reLaunch({
      url: "/pages/index/index",
    });
  },
});
