import {
  request
} from "../../request/index.js";


// const baseUrl = 'https://dev-service.mengmohmg.com';
const baseUrl = 'https://service.mengmohmg.com';


Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    userInfo: {},
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    canIUseGetUserProfile: false,
    canIUseOpenData: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.dictMap();
    if (wx.getStorageSync("token")) {
      this.getUserApi();
    } else {
      //  不存在 此时要进行登录
    }
  },

  dictMap() {
    console.log("dictMap");
    const that = this;
    wx.getStorage({
      key: "dicts",
      success(res) {
        const data = res.data;
        data.forEach((element) => {
          if (element.dict_code === "sys_member_type") {
            let objMap = {};
            element.dict_label.forEach((element) => {
              objMap[element.label_value] = element.label_zh;
            });
            that.setData({
              memberMap: objMap,
            });
          }
        });
      },
    });
  },

  async getUserApi() {
    const result = await request({
      url: "/xcx/member/get-info",
    });
    const {
      data
    } = result.data;
    console.log("data", data);

    if (data.code === 4002) {
      console.log("请重新登录");
    }
    await this.setData({
      userInfo: data,
      isLogin: true,
    });
    wx.setStorage({
      key: "userInfo",
      data,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.login({
      timeout: 0,
    });
  },

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
  clickPoints: function () {
    wx.navigateTo({
      url: "/pages/points/index",
    });
  },
  gotoChongzhi: function () {
    wx.navigateTo({
      url: "/pages/chongzhi/index",
    });
  },

  // "pages/chongzhi/index"

  handleGetUserInfo(e) {
    const that = this;
    wx.getUserProfile({
      desc: "展示用户信息", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        const {
          userInfo
        } = res;
        wx.login({
          success(res) {
            if (res.errMsg === "login:ok") {
              const myparma = {
                js_code: res.code,
                avatar_url: userInfo.avatarUrl,
                city: userInfo.city,
                country: userInfo.country,
                gender: userInfo.gender,
                language: userInfo.language,
                nick_name: userInfo.nickName,
                province: userInfo.province,
              };
              wx.request({
                url: `${baseUrl}/xcx/member/session`,
                data: myparma,
                method: "POST",
                success: (result) => {
                  const {
                    member_token
                  } = result.data.data;
                  console.log('member_token', member_token)
                  wx.setStorageSync("token", member_token);
                  const userInfo = {
                    ...result.data.data,
                  };
                  wx.setStorageSync("userInfo", userInfo);
                  // 在这里获取手机号码
                  console.log("我登录啦");
                  that.getPhoneNumber();
                  that.setData({
                    isLogin: true,
                    userInfo: userInfo,
                  });
                },
              });
            } else {
              console.log("登录失败！" + res.errMsg);
            }
          },
        });
      },
    });
  },
  getPhoneNumber: function (e) {
    console.log(e);
    return;
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: "提示",
        content: e.detail.errMsg,
        showCancel: false,
      });
      return;
    }
    // this._getPhoneNumber(e);
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: "展示用户信息", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        this.setData({
          showUser: false,
        });
      },
    });
  },
  async chongzhi() {
    console.log("充值");
    // request
    const result = await request({
      method: "post",
      url: "/xcx/transaction/jsapi",
      data: {
        amount: 0.01,
        currency: "CNY",
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
        // wx.redirectTo({
        //   url: redirectUrl
        // });
      },
    });
  },
  gotoJoin() {
    wx.redirectTo({
      url: "/pages/join/index",
    });
  },

  // pages/join/index
});