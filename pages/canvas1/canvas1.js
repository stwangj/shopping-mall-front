//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    cardInfo: {
      avater: "http://t2.hddhhn.com/uploads/tu/201806/9999/91480c0c87.jpg", //需要https图片路径
      qrCode: "http://i4.hexun.com/2018-07-05/193365388.jpg", //需要https图片路径
      TagText: "小姐姐", //标签
      Name: '小姐姐', //姓名
      Position: "程序员鼓励师", //职位
      Mobile: "13888888888", //手机
      Company: "才华无限有限公司2222", //公司
    },
    canvasUrl:""
  },

  onLoad: function (option) {    
    var name = 'cardInfo.Name';
    var Mobile = 'cardInfo.Mobile';
    this.setData({
      [name]: JSON.parse(option.data).goodsName,
      [Mobile]:JSON.parse(option.data).goodsName,      
    })
    this.getAvaterInfo();
  },

  /**
   * 先下载头像图片
   */
  getAvaterInfo: function () {
    // wx.showLoading({
    //   title: '生成中...',
    //   mask: true,
    // });
    var that = this;
    wx.downloadFile({
      url: that.data.cardInfo.avater, //头像图片路径
      success: function (res) {
        // wx.hideLoading();
        if (res.statusCode === 200) {
          var avaterSrc = res.tempFilePath; //下载成功返回结果
          console.log("avaterSrc===>", avaterSrc)
          that.getQrCode(avaterSrc); //继续下载二维码图片
        } else {
          wx.showToast({
            title: '头像下载失败！',
            icon: 'none',
            duration: 2000,
            success: function () {
              var avaterSrc = "";
              that.getQrCode(avaterSrc);
            }
          })
        }
      }
    })
  },

  /**
   * 下载二维码图片
   */
  getQrCode: function (avaterSrc) {
    // wx.showLoading({
    //   title: '生成中...',
    //   mask: true,
    // });
    var that = this;
    wx.downloadFile({
      url: that.data.cardInfo.qrCode, //二维码路径
      success: function (res) {
        // wx.hideLoading();
        if (res.statusCode === 200) {
          var codeSrc = res.tempFilePath;
          that.sharePosteCanvas(avaterSrc, codeSrc);
        } else {
          wx.showToast({
            title: '二维码下载失败！',
            icon: 'none',
            duration: 2000,
            success: function () {
              var codeSrc = "";
              that.sharePosteCanvas(avaterSrc, codeSrc);
            }
          })
        }
      }
    })
  },

  /**
   * 开始用canvas绘制分享海报
   * @param avaterSrc 下载的头像图片路径
   * @param codeSrc   下载的二维码图片路径
   */
  sharePosteCanvas: function (avaterSrc, codeSrc) {
    var that = this;
    var cardInfo = that.data.cardInfo; //需要绘制的数据集合
    const ctx = wx.createCanvasContext('myCanvas'); //创建画布
    var width = "";
    wx.createSelectorQuery().select('#canvas-container').boundingClientRect(function (rect) {
      var height = rect.height;
      var right = rect.right;
      width = rect.width * 0.8;
      var left = rect.left + 5;
      ctx.setFillStyle('#fff');
      ctx.fillRect(0, 0, rect.width, height);

      //头像为正方形
      if (avaterSrc) {
        ctx.drawImage(avaterSrc, left, 20, width, width);
        ctx.setFontSize(14);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
      }

      //标签
      if (cardInfo.TagText) {
        ctx.fillText(cardInfo.TagText, left + 20, width - 4);
        const metrics = ctx.measureText(cardInfo.TagText); //测量文本信息
        ctx.stroke();
        ctx.rect(left + 10, width - 20, metrics.width + 20, 25);
        ctx.setFillStyle('rgba(255,255,255,0.4)');
        ctx.fill();
      }

      //姓名
      if (cardInfo.Name) {
        ctx.setFontSize(14);
        ctx.setFillStyle('#000');
        ctx.setTextAlign('left');
        ctx.fillText(cardInfo.Name, left, width + 60);
      }

      //职位
      if (cardInfo.Position) {
        ctx.setFontSize(12);
        ctx.setFillStyle('#666');
        ctx.setTextAlign('left');
        ctx.fillText(cardInfo.Position, left, width + 85);
      }

      //电话
      if (cardInfo.Mobile) {
        ctx.setFontSize(12);
        ctx.setFillStyle('#666');
        ctx.setTextAlign('left');
        ctx.fillText(cardInfo.Mobile, left, width + 105);
      }

      // 公司名称
      if (cardInfo.Company) {
        const CONTENT_ROW_LENGTH = 24; // 正文 单行显示字符长度
        let [contentLeng, contentArray, contentRows] = that.textByteLength(cardInfo.Company, CONTENT_ROW_LENGTH);
        ctx.setTextAlign('left');
        ctx.setFillStyle('#000');
        ctx.setFontSize(10);
        let contentHh = 22 * 1;
        for (let m = 0; m < contentArray.length; m++) {
          ctx.fillText(contentArray[m], left, width + 150 + contentHh * m);
        }
      }

      //  绘制二维码
      if (codeSrc) {
        ctx.drawImage(codeSrc, left + 160, width + 40, width / 3, width / 3)
        ctx.setFontSize(10);
        ctx.setFillStyle('#000');
        ctx.fillText("微信扫码或长按识别", left + 160, width + 150);
      }
      ctx.draw()
      that.saveShareImg()

    }).exec()

    // setTimeout(function () {
    //   ctx.draw()
    //   wx.hideLoading();
    // }, 1000)
   

  },

  /**
   * 多行文字处理，每行显示数量
   * @param text 为传入的文本
   * @param num  为单行显示的字节长度
   */
  textByteLength(text, num) {
    let strLength = 0; // text byte length
    let rows = 1;
    let str = 0;
    let arr = [];
    for (let j = 0; j < text.length; j++) {
      if (text.charCodeAt(j) > 255) {
        strLength += 2;
        if (strLength > rows * num) {
          strLength++;
          arr.push(text.slice(str, j));
          str = j;
          rows++;
        }
      } else {
        strLength++;
        if (strLength > rows * num) {
          arr.push(text.slice(str, j));
          str = j;
          rows++;
        }
      }
    }
    arr.push(text.slice(str, text.length));
    return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
  },

  //点击保存到相册
  saveShareImg: function () {
    var that = this;
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    setTimeout(function () {
      wx.canvasToTempFilePath({//转成真实图片
        canvasId: 'myCanvas',
        success: function (res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          that.setData({
            canvasUrl: tempFilePath
          })
          if (tempFilePath !== '') {
            wx.hideLoading();
            wx.previewImage({
              current: that.data.canvasUrl, // 当前显示图片的http链接  
              urls: [that.data.canvasUrl,that.data.canvasUrl,that.data.canvasUrl], // 需要预览的图片http链接列表  
              success:function(_res){
                console.log("预览成功啦")

              }
            })
          }
        }
      });
    }, 1000);
  },

})