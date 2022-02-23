// pages/mapApi/include-points/include-points.js

import {
  qqmapsdk
} from "../../utils/location.js";
import {
  request
} from "../../request/index.js";
Page({
  data: {
    shopinputvalue: "",
    shoplist: [],
  },
  onLoad: function (options) {
    this.getShopList();
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
            distance: item.distance / 1000 + ""
          };
        });
        that.setData({
          shoplist: finallObj,
        });
      },
    });
  },

  makePhoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phoneNumber,
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "腾讯位置服务示例中心",
    };
  },

  gotoShopDetail(e) {
    const {
      shopinfo
    } = e.currentTarget.dataset;
    console.log('shopinfo', shopinfo)
    var shopinforesult = JSON.stringify(shopinfo);
    // return
    // wx.setStorageSync("shopdetail", shopinfo);
    wx.navigateTo({
      url: `/pages/shopdetail/index?shopdata=${shopinforesult}`,
    });
    //
  },
});