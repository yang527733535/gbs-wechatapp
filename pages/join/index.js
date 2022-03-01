import {
  request
} from "../../request/index.js";

// pages/join/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopcode: '请选择店铺',
    roomcode: '请选择房间',
    showstore: false,
    showroom: false,
    selectShop: {
      name: "请选择店铺"
    },
    selectRoom: {
      name: '请选择房间'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getstoreList()
    var isEmptyObj = JSON.stringify(options) === "{}";
    console.log("isEmptyObj");
    if (isEmptyObj) {
      wx.showToast({
        title: "请选店铺和房间",
        duration: 2000,
      });
      return;
    }

    // 判断有没有options

    wx.navigateTo({
      url: `/pages/roomdetail/index?roomdata=${JSON.stringify(options)}`,
    });
  },
  async getstoreList() {
    const storelist = await request({
      url: "/xcx/store/option",
      method: "post",
    });
    const storeArr = storelist.data.data;
    console.log("storeArr: ", storeArr);
    this.setData({
      storeactions: storeArr.map((item) => {
        return {
          name: item.store_name,
          store_code: item.store_code
        };
      }),
    });
    // storeactions
  },
  entergame() {
    console.log('加入游戏')
    let parma = {
      store_code: this.data.selectShop.store_code,
      room_code: this.data.selectRoom.room_code
    }
    wx.navigateTo({
      url: `/pages/roomdetail/index?roomdata=${JSON.stringify(parma)}`,
    });

  },
  showShorePopup() {
    this.setData({
      showstore: true,
    });
  },
  showRoomPopup() {
    this.setData({
      showroom: true,
    });
  },

  onCloseStore() {
    this.setData({
      showstore: false,
    });
  },
  onCloseRoom() {
    this.setData({
      showroom: false,
    });
  },


  async onSelectStore(event) {
    console.log(event.detail);
    this.setData({
      selectShop: event.detail,
      showstore: false,
    });
    const param = {
      store_code: event.detail.store_code
    }
    const {
      data
    } = await request({
      url: "/xcx/store/get-room",
      method: "post",
      data: param
    });
    let newroomlist = data.data.map((item) => {
      return {
        name: item.room_name,
        room_code: item.room_code
      }
    })
    this.setData({
      roomlist: newroomlist
    })
  },

  onSelectRoom(event) {
    console.log(event.detail);
    this.setData({
      selectRoom: event.detail,
      showroom: false,
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
});