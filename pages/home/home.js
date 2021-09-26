//该页面用于存放内嵌网页
import regeneratorRuntime, {
  async
} from "../../lib/regenerator-runtime/runtime";
import { request } from '../../utils/index';

var constants = require("../../utils/constants");
var app = getApp();
var ctxPath = app.globalData.ctxPath;


Page({


  /**
   * 页面的初始数据
   */
  data: {
    web_src: "", //webview内嵌的url
    settingTitle: '',//配置的标题
    settingImg: '',//配置的图片
    shareTitle: "", //图片信息
    skuId: "",    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      web_src: ctxPath
    });
    that.queryShareSetting();
  },

  /**
   * 查询基本的分享配置
   */
  queryShareSetting: function () {
    let that = this;
    request.get("/queryMiniShareInfo.htm").then((data) => {
      that.setData({
        settingTitle: data.title,//配置的标题
        settingImg: data.logo,//配置的图片
      })
    })
  },
  /**
  * 拿到H5发生给小程序的消息
  * @param {} res
  */
  msgHandler: function (res) {
    let that = this;

    //因为这边是数据。所以取最后一个数据是传过来的数据
    let goodsName = res.detail.data[res.detail.data.length - 1].goodsName;
    let skuId = res.detail.data[res.detail.data.length - 1].skuId;
    that.setData({
      shareTitle: goodsName,
      skuId: skuId
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {

    let that = this;
    let return_url = encodeURIComponent(options.webViewUrl);
    let title = options.webViewUrl.search("/item/") != -1 ? that.data.shareTitle : that.data.settingTitle;
    let imgUrl = options.webViewUrl.search("/item/") != -1 ? "" : that.data.settingImg;
    var path = "pages/sharepage/sharepage?shareUrl=" + return_url;
    return {
      title: title,
      path: path,
      imageUrl: imgUrl,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "转发成功",
          icon: "success",
          duration: 2000
        });
      },
      fail: function (res) {
        // 转发成功
        wx.showToast({
          title: "转发失败",
          icon: "success",
          duration: 2000
        });
      }
    };
  },

  bindload(res) {

  }
});
