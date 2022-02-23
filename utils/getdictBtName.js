export const getdictByCode = (type) => {
  console.log("type: ", type);
  let data = [];
  wx.getStorage({
    key: "dicts",
    success(res) {
      console.log("res: ", res);
      data = res.data;
      data.forEach((element) => {
        if (element.dict_code === type) {
          console.log("element.dict_label", element.dict_label);
          return element.dict_label;
        }
      });
    },
  });
};
