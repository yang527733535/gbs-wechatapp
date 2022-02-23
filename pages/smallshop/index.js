// pages/smallshop/index.js

import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    AllCartNum: 0,
    goods_list: [{
        goodName: "咖啡",
        goods_id: "10000",
        price: 110,
        imgUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/UUpia7ibte2HH8nicSr7vJkxlMyW2XFicnNognWGYDBicrBejribzO0m0lZX9xc8c47ee9mvauqccXnuAtHwZ90Zwufg/132",
        nowCartNum: 0,
        stockNum: 100
      },
      {
        goodName: '燕麥拿鐵',
        goods_id: "10001",
        price: 13,
        imgUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/UUpia7ibte2HH8nicSr7vJkxlMyW2XFicnNognWGYDBicrBejribzO0m0lZX9xc8c47ee9mvauqccXnuAtHwZ90Zwufg/132",
        nowCartNum: 0,
        stockNum: 100
      }
    ]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("我来填充啦")
    let cart = wx.getStorageSync('cart') || [];
    console.log('cart', cart)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  showPopup() {
    // 如果购物车上的商品数量为0 直接return 



    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },
  handleCartAdd(event) {
    console.log(event)
    console.log(event.detail);
    const addNum = event.detail
    const goods_id = event.target.dataset.goods_id
    const price = parseInt(event.target.dataset.price)
    console.log("goods_id", goods_id)
    //addNum 要添加这个商品的数量

    let cart = wx.getStorageSync('cart') || [];
    console.log(cart)
    // 判断商品对象是否存入在购物车数组中
    let index = cart.findIndex(v => v.goods_id === goods_id);
    console.log('index', index)
    if (index === -1) {
      // 不存在 第一次加入购物车
      // 有两个要改变 一个是商品列表里
      // 一个是购物车的数量里
      const goods = {
        goods_id,
        num: addNum,
        price,
      }
      cart.push(goods);

      wx.showToast({
        title: '添加成功',
        icon: 'success',
        mask: true // 防止用户手抖
      })
    } else {
      //说明存在
      cart[index].num = addNum;
    }
    wx.setStorageSync('cart', cart);

  },
})