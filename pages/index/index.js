// index.js
// 获取应用实例
import {
  request
} from "../../request/index.js";
const APP = getApp();
import {
  getCurrentLocation,
  qqmapsdk
} from "../../utils/location.js";
Page({
  data: {
    show: true,
    selectedShop: null,
    dmlist: [],
    hotDramaList: [],
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse("open-data.type.userAvatarUrl") &&
      wx.canIUse("open-data.type.userNickName"), // 如需尝试获取用户信息可改为false
  },
  onLoad() {
    // 获取热门剧本
    this.getHotDramaList();
    // 获取当前的s位置
    this.getDmlist();
    // 获取店铺列表
    this.getShopList();

    // 获取公告
    this.getnotice();

    this.setData({
      navHeight: APP.globalData.navHeight,
      navTop: APP.globalData.navTop,
      windowHeight: APP.globalData.windowHeight,
      menuButtonObject: APP.globalData.menuButtonObject, //小程序胶囊信息
    });
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
  },

  async getnotice() {
    const result = await request({
      url: "/xcx/notice/index",
      method: "post",
    });
    const {
      data
    } = result.data;
    console.log("data: ", data[1]["notice_array"]);
    this.setData({
      noticeList: data[1]["notice_array"],
    });
    console.log("notice", data);
  },
  async getHotDramaList() {
    const result = await request({
      url: "/xcx/drama/search",
      method: "post",
      data: {
        app_is_hot: 1,
      },
    });
    let {
      data,
      paginator
    } = result.data;
    console.log("data: ", data);
    this.setData({
      hotDramaList: data,
    });
    // this.setData({
    //   hotDramaList: data
    // })
    // this.setData({
    //   dramaNumber: paginator.total_count,
    //   dramaList: data.map((item) => {
    //     return {
    //       ...item,
    //       gb_theme: item.gb_theme.split("/"),
    //     };
    //   }),
    // });
  },

  async getShopList() {
    const result = await request({
      url: "/xcx/store/option",
      method: "post",
    });
    const {
      data
    } = result.data;
    // 获得店铺列表
    const myobj = data.map((item) => {
      return {
        ...item,
        latitude: item.position_x,
        longitude: item.position_y,
      };
    });
    const that = this;
    qqmapsdk.calculateDistance({
      mode: "straight",
      to: myobj, //终点坐标
      success: function (res) {
        // 根据你的排序来排序的
        const {
          elements
        } = res.result;
        // 排序后结果
        for (let index = 0; index < elements.length; index++) {
          const element = elements[index];
          myobj[index]["distance"] = element.distance;
        }
        let newOBj = myobj.sort((a, b) => {
          return a.distance - b.distance;
        });
        const finallObj = newOBj.map((item) => {
          return {
            ...item,
            distance: item.distance / 1000 + "",
          };
        });
        that.setData({
          shoplist: finallObj,
          selectedShop: finallObj[0],
        });
      },
    });
  },

  gotoBook() {
    wx.reLaunch({
      url: "/pages/book/index",
    });
  },
  gotoDMdetail(e) {
    const {
      dmaccout
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/dmdetai/index?user_account=${dmaccout}`,
    });
  },
  gotoDramaDetail: function (e) {
    const {
      gb_code
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/drama/detail?gb_code=${gb_code}`,
    });
  },

  gotoCar() {
    wx.reLaunch({
      url: "/pages/group/index",
    });
  },
  gotoMember() {
    wx.reLaunch({
      url: "/pages/my/index",
    });
  },

  onClose() {
    this.setData({
      show: false,
    });
  },

  onSelect(event) {
    console.log(event.detail);
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: "../logs/logs",
    });
  },

  async getDmlist() {
    const result = await request({
      url: "/xcx/dm/list",
      method: "post",
    });
    const {
      data
    } = result.data;
    this.setData({
      dmlist: data,
    });
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: "展示用户信息", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      },
    });
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
  },
  gotoShop() {
    wx.navigateTo({
      url: "/pages/smallshop/index",
    });
  },
  getName() {},
  gotoDrama() {},
  gotoMAP() {
    wx.navigateTo({
      url: "/pages/map/index",
    });
  },
});