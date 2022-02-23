// pages/points/index.js

// import Dialog from "../../miniprogram_npm/@vant/weapp/dist/dialog、";

import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // https://img01.yzcdn.cn/vant/ipad.jpeg
    imageURL: "https://img01.yzcdn.cn/vant/ipad.jpeg",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
  redictoRecord: function () {
    wx.navigateTo({
      url: "/pages/pointsrecord/index",
    });
  },
  clickDh: function () {
    Dialog.confirm({
      title: "确定兑换该物品",
    })
      .then(() => {
        Toast("兑换成功~");
      })  
      .catch(() => {
        Toast("兑换失败~");
      });
  },
});
