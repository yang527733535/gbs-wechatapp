import { noloadingrequest } from "../../request/index.js";
import { request } from "../../request/index.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    param: {},
    showPay: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyUserInfo();
    this.joinRoom(JSON.parse(options.roomdata));
    const myneedData = JSON.parse(options.roomdata);
    console.log("myneedData", myneedData);
    this.setData({
      reqParam: myneedData,
    });
    this.startSetInter();
    this.getTagMap();
    // this.getDramaDetail(myneedData.gb_code);
  },
  getTagMap() {
    wx.getStorage({
      key: 'dicts',
      success: (res) => {
        const {
          data
        } = res
        console.log(data)
        data.forEach(element => {
          if (element.dict_code === "app_gb_text_tag") {
            let mymap = {}
            element.dict_label.forEach(item => {
              mymap[item.label_value] = item.label_zh
            });
            this.setData({
              gb_tag_map: mymap
            })
          }
        });
      }
    })
  },
  getDramaDetail: async function (code) {
    let param = {
      gb_code: code,
    };
    // let data = await reqDramaDetailByCode(param)
    const result = await request({
      url: "/xcx/drama/detail",
      method: "post",
      data: param,
    });
    const { data } = result.data;
    data.author = JSON.parse(data.gb_remarks);
    // gb_remarks
    this.setData({
      dramaDetail: data,
    });
  },

  getMyUserInfo: function () {},

  startSetInter: function () {
    var that = this;
    //将计时器赋值给setInter
    that.data.setInter = setInterval(function () {
      // reqParam
      that.joinRoom(that.data.reqParam);
      var numVal = that.data.num + 1;
      that.setData({
        num: numVal,
      });
    }, 20000);
  },
  endSetInter: function () {
    var that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter);
  },

  async joinRoom(param) {
    const result = await noloadingrequest({
      url: "/xcx/game/join-room",
      method: "post",
      data: param,
    });
    console.log(result.data);
    const { code, message, data } = result.data;
    this.getDramaDetail(data.gb_code);
    this.setData({
      roomDetailData: data,
    });
    if (code != 200) {
      wx.showToast({
        title: message,
        icon: "none",
      });
    }
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
  onUnload: function () {
    var that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter);
  },

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
  exitPage: function () {
    wx.navigateBack({
      delta: 1,
    });
  },
  async wechatPay(e) {
    console.log("e", e);
    const { order_amount, order_code, member_account } =
      e.currentTarget.dataset.myorder;
    const param = {
      order_data: [
        {
          order_code: order_code,
          member_account: member_account,
          order_amount: order_amount,
        },
      ],
    };
    let amount = 0;
    param.order_data.forEach((element) => {
      amount = amount + parseFloat(element.order_amount);
    });
    param.amount = amount;
    param.scene_code = "pay_game";
    const result = await request({
      method: "post",
      url: "/xcx/transaction/pay-game",
      data: param,
    });
    const { paySign } = result.data.data;
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
        // wx.reLaunch({
        //   url: "/pages/my/index",
        // });
      },
    });
  },
  async bagPay(e) {
    const { order_amount, order_code, member_account } =
      e.currentTarget.dataset.myorder;
    const param = {
      order_data: [
        {
          order_code: order_code,
          member_account: member_account,
          order_amount: order_amount,
        },
      ],
    };

    let amount = 0;
    param.order_data.forEach((element) => {
      amount = amount + parseFloat(element.order_amount);
    });
    param.amount = amount;
    console.log("param", param);
    const result = await request({
      method: "post",
      url: "/xcx/transaction/deduct",
      data: param,
    });
    console.log(result);
  },
});
