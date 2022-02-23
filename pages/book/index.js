// pages/group/index.js
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
import {
  request
} from "../../request/index.js";
const APP = getApp()
Page({
  /**
   * 页面的初始数据
   */

  data: {
  timeId: null,
    dramaNumber: 0,
    currentPage: 1,
    gb_title: "",
    gb_tag_map: null,
    gb_typeArr: [],
    gb_peopleArr: [],
    gb_text_tagArr: [],
    app_gb_type: null,
    app_gb_people: null,
    gb_text_tag: null,
    dramaSelectData: [],
    dramaList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navHeight: APP.globalData.navHeight,
      navTop: APP.globalData.navTop,
      windowHeight: APP.globalData.windowHeight,
      menuButtonObject: APP.globalData.menuButtonObject //小程序胶囊信息
    })
    this.getDramaSelectData();
    this.getDramaListData();
    this.getTagMap()
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
  async getDramaListData() {
    const result = await request({
      url: "/xcx/drama/search",
      method: "post",
      data: {
        page: this.data.currentPage,
        page_size: 10,
        app_gb_title:this.data.gb_title,
        app_gb_people: this.data.app_gb_people,
        app_gb_text_tag: this.data.gb_text_tag,
        app_gb_type: this.data.app_gb_type,
      }
    });
    const {
      data,
      paginator
    } = result.data
    this.setData({
      dramaNumber: paginator.total_count,
      dramaList: data
    })
  },
  async getDramaListDataByPage() {
    const result = await request({
      url: "/xcx/drama/search",
      method: "post",
      data: {
        page: this.data.currentPage,
        page_size: 10,
        app_gb_people: this.data.app_gb_people,
        app_gb_text_tag: this.data.gb_text_tag,
        app_gb_type: this.data.app_gb_type,
      }
    });
    const {
      data,
      paginator
    } = result.data
    this.setData({
      dramaNumber: paginator.total_count,
      dramaList: [...this.data.dramaList, ...data]
    })
  },
  async getDramaListDataByName() {
    const result = await request({
      url: "/xcx/drama/search",
      method: "post",
      data: {
        page: 1,
        page_size: 10,
        app_gb_title:this.data.gb_title,
      }
    });
    const {
      data,
      paginator
    } = result.data
    this.setData({
      dramaNumber: paginator.total_count,
      dramaList: data
    })
  },

  async getDramaSelectData() {
    const result = await request({
      url: "/xcx/drama/filter",
    });
    const {
      data
    } = result.data
    this.setData({
      dramaSelectData: data
    })
    this.setData({
      gb_typeArr: this.getSelectDataByCode('app_gb_type'),
      gb_peopleArr: this.getSelectDataByCode("app_gb_people"),
      gb_text_tagArr: this.getSelectDataByCode("app_gb_text_tag"),
    })
  },
  //通过对应的返回数据
  getSelectDataByCode(type) {
    let initData = this.data.dramaSelectData
    let reData = []
    initData.forEach(element => {
      if (element.dict_code === type) {
        reData = element.dict_child
      }
    });
    return reData
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let res = wx.getMenuButtonBoundingClientRect();
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
  onclick: function () {
    wx.vibrateShort({
      complete: (res) => {
        this.getDramaListData()
      },
    });
  },
  onclickType: function (e) {
    Toast.loading({
      message: "加载中...",
      forbidClick: true,
    });
    const {
      typeid
    } = e.currentTarget.dataset;
    this.setData({
      app_gb_type: typeid,
      currentPage: 1
    });
    wx.vibrateShort({
      complete: (res) => {
        this.getDramaListData()
      },
    });
  },
  onclickPeople: function (e) {
    Toast.loading({
      message: "加载中...",
      forbidClick: true,
    });
    const {
      typeid
    } = e.currentTarget.dataset;
    this.setData({
      app_gb_people: typeid,
      currentPage: 1
    });
    wx.vibrateShort({
      complete: (res) => {
        this.getDramaListData()
      },
    });
  },
  gotoDramaDetail: function (e) {
    const {
      gb_code
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/drama/detail?gb_code=${gb_code}`,
    })
  },


  onclickTag: function (e) {
    Toast.loading({
      message: "加载中...",
      forbidClick: true,
    });

    const {
      typeid
    } = e.currentTarget.dataset;
    this.setData({
      gb_text_tag: typeid,
      currentPage: 1
    });
    wx.vibrateShort({
      complete: (res) => {
        this.getDramaListData()
      },
    });
  },
  lower: function (e) {
    this.setData({
      currentPage: this.data.currentPage + 1
    })
    this.getDramaListDataByPage()
  },
  getName: function (e) {
    var val = e.detail.value;
    this.setData({
      gb_title: val.trim()
    });
    clearInterval(this.data.timeId)
    let timeId = setTimeout(() => {
      this.getDramaListDataByName()
    }, 200)
    this.setData({
      timeId,
    })
  },

});