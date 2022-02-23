import {
  request
} from "../../request/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    showPay: false,
  },
  showPopup() {
    this.setData({
      showPay: true
    });
  },

  onClose() {
    this.setData({
      showPay: false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 个头/xcx/member/order
    this.getMyOrder();
  },
  async getMyOrder() {
    const result = await request({
      method: "post",
      url: "/xcx/member/order",
    });
    const {
      data
    } = result.data;
    console.log("data: ", data);
    this.setData({
      orderList: data,
    });
  },

  async gotoPayOrder(e) {
    this.setData({
      showPay: true
    });
    const {
      orderdetail
    } = e.currentTarget.dataset;
    console.log("orderdetail: ", orderdetail);
    this.setData({
      orderdetail,
    });
    // this.showPopup();
    return;
    const result = await request({
      method: "post",
      url: "/xcx/member/order",
    });
    const {
      data
    } = result.data;
    console.log("data: ", data);
    this.setData({
      orderList: data,
    });
  },
  async wechatPay() {
    const {
      order_amount,
      order_code,
      member_account
    } = this.data.orderdetail;
    const param = {
      order_data: [{
        order_code: order_code,
        member_account: member_account,
        order_amount: order_amount,
      }, ],
    };
    let amount = 0;
    param.order_data.forEach((element) => {
      amount = amount + parseFloat(element.order_amount);
    });
    param.amount = amount;
    param.scene_code = 'pay_game';
    const result = await request({
      method: "post",
      url: "/xcx/transaction/pay-game",
      data: param
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

  async bagPay() {
    const {
      order_amount,
      order_code,
      member_account
    } = this.data.orderdetail;
    const param = {
      order_data: [{
        order_code: order_code,
        member_account: member_account,
        order_amount: order_amount,
      }, ],
    };
    let amount = 0;
    param.order_data.forEach((element) => {
      amount = amount + parseFloat(element.order_amount);
    });
    param.amount = amount;
    const result = await request({
      method: "post",
      url: "/xcx/transaction/deduct",
      data: param,
    });
    console.log(result);
  },
  //
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
});