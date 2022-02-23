// pages/chongzhi/index.js
import {
  request
} from "../../request/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    balance_use: 0,
    chongzhiArr: [{
        id: 1,
        count: 0.02,
      },
      {
        id: 2,
        count: 50.0,
      },
      {
        id: 3,
        count: 100,
      },
      {
        id: 4,
        count: 200,
      },
      {
        id: 5,
        count: 500,
      },
      {
        id: 6,
        count: 1000,
      },
    ],
    nowSelectCount: null,
  },

  clickCount: function (e) {
    const {
      countinfo
    } = e.currentTarget.dataset;
    console.log("countinfo: ", countinfo);

    this.setData({
      nowSelectCount: countinfo,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
  },

  getUserInfo() {
    console.log('getUserInfo')
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        const {
          data
        } = res
        console.log(data)
        this.setData({
          balance_use: data.balance_use,
        });
      }
    })

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

  async numberrecharge() {
    console.log("充值");
    // request
    const result = await request({
      method: "post",
      url: "/xcx/transaction/recharge",
      data: {
        amount: this.data.nowSelectCount.count,
        currency: "CNY",
        scene_code: "recharge",
      },
    });
    const {
      paySign
    } = result.data.data;
    let obj = JSON.parse(paySign);
    wx.requestPayment({
      timeStamp: obj.timeStamp,
      nonceStr: obj.nonceStr,
      package: obj.package,
      signType: obj.signType,
      paySign: obj.paySign,
      fail: function (aaa) {
        console.error(aaa);
        wx.showToast({
          title: "支付失败:" + aaa,
        });
      },
      success: function () {
        // 提示支付成功
        wx.showToast({
          title: "支付成功",
        });
        wx.reLaunch({
          url: "/pages/my/index",
        });
      },
    });
  },
});