const APP = getApp();
import { qqmapsdk } from "../../utils/location.js";
import { request } from "../../request/index";
import { getArrayItems } from "../../utils/util";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    dramaDetail: null,
    gb_tag_map: null,
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

    this.getShopList();
    this.getDramaListData();
    this.getDramaDetail(gb_code);
    this.setData({
      navHeight: APP.globalData.navHeight,
      navTop: APP.globalData.navTop,
      windowHeight: APP.globalData.windowHeight,
      menuButtonObject: APP.globalData.menuButtonObject, //小程序胶囊信息
    });
    this.getTagMap();
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

  getTagMap() {
    wx.getStorage({
      key: "dicts",
      success: (res) => {
        const { data } = res;
        console.log(data);
        data.forEach((element) => {
          if (element.dict_code === "app_gb_text_tag") {
            let mymap = {};
            element.dict_label.forEach((item) => {
              mymap[item.label_value] = item.label_zh;
            });
            this.setData({
              gb_tag_map: mymap,
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
        page_size: 100,
      },
    });
    let { data, paginator } = result.data;
    const chaosData = getArrayItems(data, 6);

    this.setData({
      dramaNumber: paginator.total_count,
      dramaList: chaosData.map((item) => {
        return {
          ...item,
          gb_theme: item.gb_theme.split("/"),
        };
      }),
    });
  },
  async getShopList() {
    const that = this;
    wx.getStorage({
      key: "storage",
      success: (result) => {
        that.setData({
          selectedShop: result.data,
        });
      },
      fail: async () => {
        const result = await request({
          url: "/xcx/store/option",
          method: "post",
        });
        const { data } = result.data;
        // 获得店铺列表
        const myobj = data.map((item) => {
          return {
            ...item,
            latitude: item.position_x,
            longitude: item.position_y,
          };
        });
        qqmapsdk.calculateDistance({
          mode: "straight",
          to: myobj, //终点坐标
          success: function (res) {
            // 根据你的排序来排序的
            const { elements } = res.result;
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
      complete: () => {},
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
    data.author = JSON.parse(data.gb_remarks);
    // gb_remarks
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
  gotoRoleDetail: function (e) {
    console.log("e", e);
    const { roledata } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/roledetail/index?roledata=${JSON.stringify(roledata)}`,
    });
  },
  makePhoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.selectedShop.store_phone,
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
