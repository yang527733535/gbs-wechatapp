// pages/dmdetai/index.js
import { request } from "../../request/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dmdetail: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDmDetail(options);
  },
  async getDmDetail(param) {
    console.log("param: ", param);
    const result = await request({
      url: "/xcx/dm/detail",
      method: "post",
      data: param,
    });
    const { data } = result.data;
    let dmdatail = data["0"];
    console.log("dmdatail: ", dmdatail);
    this.setData({
      dmdetail: dmdatail,
    });
  },
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
  // exitPage:Functio
  exitPage: function () {
    wx.navigateBack({
      delta: 1,
    });
  },
});
