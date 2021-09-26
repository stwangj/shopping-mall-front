Page({

  /**
   * 页面的初始数据
   */
  data: {
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.previewImage({
      current: "http://t2.hddhhn.com/uploads/tu/201806/9999/91480c0c87.jpg", // 当前显示图片的http链接  
      urls: ["http://t2.hddhhn.com/uploads/tu/201806/9999/91480c0c87.jpg"], // 需要预览的图片http链接列表  
      success: function (_res) {
        console.log("预览成功啦")
      },
      fail:function(_fail){
        console.log("失败啦")
      },complete:function(c){
        console.log("什么都结束啦")
      }
    })
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