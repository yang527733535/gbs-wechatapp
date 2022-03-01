// 同时发送异步请求的次数
let ajaxTimes = 0;
const baseUrl = "https://dev-service.mengmohmg.com";
// const baseUrl = 'https://service.mengmohmg.com';
export const request = (params) => {
  const { method } = params;
  // 判断url中是否带有 /my/ 请求的是私有的路径 带上header token
  let header = {
    ...params.header,
  };

  if (wx.getStorageSync("token")) {
    // 拼接header 带上token
    header["Authorization"] = "Bearer " + wx.getStorageSync("token");
  }

  ajaxTimes++;
  // 加载图标
  wx.showLoading({
    title: "加载中",
    mask: true,
  });

  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header: header,
      method,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          wx.hideLoading();
        }
      },
    });
  });
};

export const noloadingrequest = (params) => {
  const { method } = params;
  // 判断url中是否带有 /my/ 请求的是私有的路径 带上header token
  let header = {
    ...params.header,
  };

  if (wx.getStorageSync("token")) {
    // 拼接header 带上token
    header["Authorization"] = "Bearer " + wx.getStorageSync("token");
  }

  ajaxTimes++;
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header: header,
      method,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          // wx.hideLoading();
        }
      },
    });
  });
};
