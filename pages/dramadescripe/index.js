import { request } from "../../request/index";
// import { format } from "../../utils/util";

function add0(m) {
  return m < 10 ? "0" + m : m;
}
function format(shijianchuo) {
  //shijianchuo是整数，否则要parseInt转换
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return (
    y +
    "-" +
    add0(m) +
    "-" +
    add0(d) +
    " " +
    add0(h) +
    ":" +
    add0(mm) +
    ":" +
    add0(s)
  );
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    showstore: false,
    gb_tag_map: null,
    // 格式化后的时间
    subscribe_start: "点击选择时间",
    store: {
      name: "点击选择店铺",
    },
    storeactions: [],
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      }
      if (type === "month") {
        return `${value}月`;
      }
      return value;
    },
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail,
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

  showPopup() {
    this.setData({
      show: true,
    });
  },

  showShorePopup() {
    this.setData({
      showstore: true,
    });
  },
  onClose() {
    this.setData({
      show: false,
    });
  },

  confirmDate() {
    console.log(this.data.currentDate);
    const subscribe_end =
      this.data.currentDate +
      parseInt(this.data.dramaDetail.gb_hour) * 60 * 60 * 1000;
    this.setData({
      show: false,
      subscribe_start: format(this.data.currentDate),
      subscribe_end: format(subscribe_end),
    });
  },
  onSelectStore(event) {
    console.log(event.detail);
    this.setData({
      store: event.detail,
      showstore: false,
    });
  },
  onCloseStore() {
    this.setData({
      showstore: false,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options: ", options);
    const { gb_code } = options;
    this.getDramaDetail(gb_code);
    this.getstoreList();
    // 获取门店列表
    this.getTagMap();
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
        return { name: item.store_name, store_code: item.store_code };
      }),
    });
    // storeactions
  },
  async getDramaDetail(gb_code) {
    let param = {
      gb_code: gb_code,
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

  submitForm: async function () {
    console.log("提交表单");
    let param = {
      subscribe_type: "yd_drama",
      store_code: this.data.store.store_code,
      gb_code: this.data.dramaDetail.gb_code,
      subscribe_start: this.data.subscribe_start,
      subscribe_end: this.data.subscribe_end,
      subscribe_people: this.data.dramaDetail.gb_people,
      subscribe_note: "",
    };
    console.log("param", param);
    let res = await await request({
      url: "/xcx/game/subscribe",
      method: "post",
      data: param,
    });
    const { code } = res.data;
    console.log(code);
  },
});
