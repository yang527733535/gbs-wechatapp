import {
  request
} from './request/index'

App({
  onLaunch: function (options) {
    // ---------------检测navbar高度

    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top, //胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.menuButtonObject = menuButtonObject;
      },
      fail(err) {
        console.log(err);
      }
    })
    this.getDicts()
  },
  getDicts: async function () {
    let data = await request({
      url: "/system/dict/labels"
    })
    let {
      data: dicts
    } = data.data
    console.log(dicts)
    const AllMaP = {}
    dicts.forEach(element => {
      let param = {}
      element.dict_label.forEach(item => {
        param[item.label_value] = item.label_zh
      });
      AllMaP[element.dict_code] = param

    });
    wx.setStorageSync('dicts', dicts)
    wx.setStorageSync('AllMaP', AllMaP)
  },


  /**
   * 下载小程序新版本并重启应用
   */
  downLoadAndUpdate: function (updateManager) {
    var self = this
    wx.showLoading();
    //静默下载更新小程序新版本
    updateManager.onUpdateReady(function () {
      wx.hideLoading()
      //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '已经有新版本了哟~',
        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
      })
    })
  },
  globalData: {
    // isConnected: true,
  }
})