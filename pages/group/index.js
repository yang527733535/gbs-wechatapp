// pages/group/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carlist: [1, 2, 3, 4, 5]
  },
  gotocardetail() {
    wx.navigateTo({
      url: "/pages/cardetail/index",
    })
  },
  async getDramaListData() {
    const result = await request({
      url: "/xcx/drama/search",
      method: "post",
    });
    const {
      data,
      paginator
    } = result.data
    this.setData({
      dramaNumber: paginator.total_count,
      dramaList: data.map((item) => {
        return {
          ...item,
          gb_theme: item.gb_theme.split('/')
        }
      })
    })
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

  }
})