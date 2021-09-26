//该页面用于存放分享后的内嵌网页
var app = getApp();
var ctxPath = app.globalData.ctxPath;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share_src: ''
  },
  
  /**
 * 用户点击右上角分享
 */
  // onShareAppMessage(options) {
  //   var that = this
  //   var return_url = options.webViewUrl
  //   var path = 'pages/sharepage/sharepage?shareUrl=' + return_url
  //   console.log(path, options)
  //   return {
  //     title: '内嵌网页分享',
  //     path: path,
  //     success: function (res) {
  //       // 转发成功
  //       wx.showToast({
  //         title: "转发成功",
  //         icon: 'success',
  //         duration: 2000
  //       })
  //       that.setData({
  //         share_src: return_url
  //       })
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }
  //   }
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {                
    let that = this;
    //通过点击分享链接进来
    if(options.shareUrl){
      that.setData({
        share_src: decodeURIComponent(options.shareUrl),
      })
    }
    //通过识别商品码打开
    if(options.scene && options.scene.indexOf('goodsDetail')!=-1){          
      //不携带推广达人ID，视为普通商品码
      if(decodeURIComponent(options.scene).split(',')[2]==undefined){
        that.setData({             
          share_src: ctxPath + "productdetail.htm?productId=" + decodeURIComponent(options.scene).split(',')[0]
        })
      }else{
       //携带推广达人，跳转到推广达人商品详情页
       that.setData({             
        share_src: ctxPath + "item/"+decodeURIComponent(options.scene).split(',')[0]+'.html?promoteId='
        +decodeURIComponent(options.scene).split(',')[2]+'&from=code'
      })
      }
    }    
    //识别店铺码打开
    if(options.scene && decodeURIComponent(options.scene).indexOf('storeInfo')!=-1){
      that.setData({
        share_src: ctxPath + "/thirdStoreIndex.htm?storeId=" + decodeURIComponent(options.scene).split(",")[0]
      })
    }
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


})