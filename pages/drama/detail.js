const APP = getApp();

import { request } from "../../request/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dramaDetail: null,
    opacity: 0,
    scrollTop: 0,
    more: false,
    levelMap: null,
  },
  onPageScroll: function (ev) {
    const { scrollTop } = ev;
    let opacity = 0;
    if (scrollTop >= 200) {
      opacity = 1;
    } else {
      opacity = scrollTop / 200;
    }
    this.setData({
      opacity,
    });

    console.log("opacity", opacity);
    this.setData({
      scrollTop: ev.scrollTop,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { gb_code } = options;
    this.getDramaListData();
    this.getDramaDetail(gb_code);
    this.setData({
      navHeight: APP.globalData.navHeight,
      navTop: APP.globalData.navTop,
      windowHeight: APP.globalData.windowHeight,
      menuButtonObject: APP.globalData.menuButtonObject, //小程序胶囊信息
    });
    var _this = this;

    wx.getStorage({
      key: "dicts",
      success(res) {
        res.data.forEach((element) => {
          if (element.dict_code === "app_gb_level") {
            console.log(element.dict_label);
            let myMap = {};
            element.dict_label.forEach((element) => {
              myMap[element.label_value] = element.label_zh;
            });
            _this.setData({
              levelMap: myMap,
            });
          }
        });
      },
    });
  },
  async getDramaListData() {
    const result = await request({
      url: "/xcx/drama/search",
      method: "post",
      data: {
        app_gb_people: this.data.app_gb_people,
        app_gb_text_tag: this.data.gb_text_tag,
        app_gb_type: this.data.app_gb_type,
      },
    });
    let { data, paginator } = result.data;
    data.length = 6;
    this.setData({
      dramaNumber: paginator.total_count,
      dramaList: data.map((item) => {
        return {
          ...item,
          gb_theme: item.gb_theme.split("/"),
        };
      }),
    });
  },

  async getDramaDetail(gb_code) {
    console.log("gb_code", gb_code);
    let param = {
      gb_code,
    };
    // let data = await reqDramaDetailByCode(param)
    const result = await request({
      url: "/xcx/drama/detail",
      method: "post",
      data: param,
    });
    const { data } = result.data;
    this.setData({
      dramaDetail: data,
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
  gotoback: function () {
    wx.navigateBack({
      delta: 1,
    });
  },

  gotoDramaDesc: function (e) {
    const { gb_code } = this.data.dramaDetail;
    console;
    wx.navigateTo({
      url: `/pages/dramadescripe/index?gb_code=${gb_code}`,
    });
  },
  toggleMore: function () {
    this.setData({
      more: !this.data.more,
    });
  },
  gotoDetail: function (e) {
    const { gb_code } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/drama/detail?gb_code=${gb_code}`,
    });
  },
});
