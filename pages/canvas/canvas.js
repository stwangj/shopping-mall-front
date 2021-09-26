import util from "../../utils/util";
import { request } from "../../utils/index";
import regeneratorRuntime, {
  async
} from "../../lib/regenerator-runtime/runtime";
var constants = require("../../utils/constants");
const app = getApp();

Page({
  data: {
    tempFilePath: "../../static/images/canvascode.jpg",
    logo: "",
    windowWidth: 0,
    windowHeight: 0,
    contentHeight: 0,
    thinkList: [],
    footer: "",
    offset: 0,
    lineHeight: 30,
    contentTitle: "",
    price: "",
    delPrice: "",
    canvasUrl: "",
    qrCode: "", //小程序码https图片路径
    accessToken: "",
    skuId: "",
    //商品图片
    goodsInfoImg: "",
    //规格
    specText: ""
  },

  onLoad: function(options) {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          offset: (res.windowWidth + res.windowWidth * 0.72) / 2, //box整体偏移X轴位置
          normalPageX:
            res.windowWidth - (res.windowWidth + res.windowWidth * 0.72) / 2, //左边文本图片X轴位置
          boxWidth: res.windowWidth * 0.84, //分享图片box宽度
          boxheight: res.windowWidth * (0.222 + 0.72 + 0.192) + 80, //分享图片box高度
          boxPageY: res.windowWidth * 0.081, //boxY轴位置
          logoWidth: res.windowWidth * 0.27, //logo宽度
          logoHeight: res.windowWidth * 0.053, //logo高度
          logoPageY: res.windowWidth * 0.154, //logoY轴位置
          imgWidth: res.windowWidth * 0.72, //商品图片宽度
          imgHeight: res.windowWidth * 0.72, //商品图片高度
          imgPageY: res.windowWidth * 0.252, //商品图片Y轴位置
          codeWidth: res.windowWidth * 0.192, //小程序码图片宽度
          codeHeight: res.windowWidth * 0.192, //小程序码图片高度
          codePageY: res.windowWidth * 0.222 + res.windowWidth * 0.72 + 40, //小程序码Y轴位置
          avatarPageY: res.windowWidth * 0.222 + res.windowWidth * 0.72 + 15, //头像Y轴位置
          titlePageY: res.windowWidth * 0.222 + res.windowWidth * 0.72 + 65, //标题Y轴位置
          specPageY: res.windowWidth * 0.222 + res.windowWidth * 0.72 + 82, //规格Y轴位置
          pricePageY: res.windowWidth * 0.222 + res.windowWidth * 0.72 + 123, //价格Y轴位置
          timePageY: res.windowWidth * 0.222 + res.windowWidth * 0.72 + 118 //秒杀Y轴位置
        });
        // that.getTempFile();
      }
    });
    if (JSON.parse(options.data).goodsInfoName) {
      let contentTitle = "contentTitle";
      let price = "price";
      let delPrice = "delPrice";
      let skuId = "skuId";
      let specText = "specText";
      this.setData({
        [contentTitle]: JSON.parse(options.data).goodsInfoName,
        [price]: JSON.parse(options.data).marketPrice,
        [delPrice]: JSON.parse(options.data).lineShowPrice,
        [skuId]: JSON.parse(options.data).skuId,
        [specText]: JSON.parse(options.data).specText
      });      
      //网络图片转为本地图片，直接显示网络图片的话真机不显示
      let url;
      //图片本身是https时，直接处理      
      if(JSON.parse(options.data).goodsInfoImg.indexOf('https')!=-1){                   
          url = JSON.parse(options.data).goodsInfoImg;
      }else{        
          //图片是http时，需要进行替换
          url =JSON.parse(options.data).goodsInfoImg.replace(/http/,"https")
      }            
      //本地的云存储图片传过来会有这个莫名的:80
      if(JSON.parse(options.data).goodsInfoImg.indexOf(':80')!=-1){
          url = url.replace(/:80/,"");
      }
      that.getTempFile(url);     
    }
  },

  onShow: function() {},

  getData: function() {
    let that = this;

    let i = 0;
    let lineNum = 1;
    let thinkStr = "";
    let thinkList = [];
    for (let item of that.data.contentTitle) {
      if (item === "\n") {
        thinkList.push(thinkStr);
        thinkList.push("a");
        i = 0;
        thinkStr = "";
        lineNum += 1;
      } else if (i === 21) {
        thinkList.push(thinkStr);
        i = 1;
        thinkStr = item;
        lineNum += 1;
      } else {
        thinkStr += item;
        i += 1;
      }
    }
    thinkList.push(thinkStr);
    that.setData({
      thinkList: thinkList
    });
    that.createNewImg(lineNum);
  },

  //画矩形，也是整块画布的大小，宽度是屏幕宽度，高度根据内容多少来动态设置。
  drawSquare: function(ctx, height) {
    let that = this;
    ctx.rect(
      that.data.windowWidth * 0.08,
      that.data.boxPageY,
      that.data.boxWidth,
      height
    );
    ctx.setFillStyle("#fff");
    ctx.fill();
  },

  // 设置文字大小，并填充颜色。
  drawFont: function(ctx, contentTitle, height) {
    let that = this;
    let str = that.data.contentTitle;
    let firstline;
    let secondline;
    //一行显示14个字，超过一行时
    if (str.length > 14) {
      //第一行截取前14个字符
      firstline = str.substring(0, 14);
      //两行都显示不下
      if (str.length > 28) {
        secondline = str.substr(14, 14) + "...";
      } else {
        //第二行取剩下的
        secondline = str.substr(14, str.length - 14);
      }
    } else {
      //一行就能显示时候
      firstline = str;
    }

    ctx.setFontSize(14);
    ctx.setFillStyle("#000");
    ctx.fillText(firstline, that.data.normalPageX, that.data.titlePageY);

    if (secondline) {
      ctx.setFontSize(12);
      ctx.setFillStyle("#333");
      ctx.fillText(
        secondline,
        that.data.normalPageX,
        that.data.titlePageY + 17
      );
    }

    if (that.data.specText) {
      ctx.setFontSize(12);
      ctx.setFillStyle("#999999");
      ctx.fillText(
        that.data.specText,
        that.data.normalPageX,
        that.data.specPageY + 18
      );
    }
  },

  //画线
  // drawLine: function(ctx) {
  //   let that = this;
  //   ctx.beginPath();
  //   ctx.moveTo(this.data.offset, that.data.pricePageY);
  //   ctx.lineTo(this.data.windowWidth - this.data.offset, that.data.pricePageY);
  //   ctx.stroke('#eee');
  //   ctx.closePath();
  // },

  // 根据文字多少动态计算高度，然后依次画出矩形，文字，横线和小程序码。
  createNewImg: function(lineNum) {
    let that = this;
    let ctx = wx.createCanvasContext("myCanvas");
    let contentHeight = that.data.boxheight;
    that.drawSquare(ctx, contentHeight);
    that.setData({
      contentHeight: contentHeight
    });
    let height = 100;
    for (let item of that.data.thinkList) {
      if (item !== "a") {
        that.drawFont(ctx, item, height);
        height += that.data.lineHeight;
      }
    }

    //logo
    ctx.drawImage(
      "../../static/images/logo.png",
      that.data.normalPageX + that.data.windowWidth * 0.22,
      that.data.logoPageY,
      that.data.logoWidth,
      that.data.logoHeight
    );
    //商品图片
    ctx.drawImage(
      that.data.goodsInfoImg,
      that.data.normalPageX,
      that.data.imgPageY,
      that.data.imgWidth,
      that.data.imgWidth
    );

    //绘制头像
    // ctx.drawImage('../../static/images/avatar.jpg', that.data.normalPageX, that.data.avatarPageY, 25, 25);
    let avatarurl_width = 25; //绘制的头像宽度
    let avatarurl_heigth = 25; //绘制的头像高度
    let avatarurl_x = that.data.normalPageX; //绘制的头像在画布上的X轴位置
    let avatarurl_y = that.data.avatarPageY; //绘制的头像在画布上的Y轴位置
    //ctx.save();
    //ctx.beginPath();
    //先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
    //ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
    //ctx.clip(); //画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
    //ctx.drawImage('../../static/images/avatar.jpg', avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth); // 推进去图片，必须是https图片
    //ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下文即状态 还可以继续绘制

    //文本
    //ctx.setFillStyle("#999");
    //ctx.font = 'normal normal 13px sans-serif';
    //填充昵称文本
    //ctx.fillText(that.data.nickName, that.data.normalPageX + 28, that.data.avatarPageY + 18);
    //计算昵称宽度
    //let nickNameWidth = ctx.measureText(that.data.nickName).width;
    //填充推荐文本
    //ctx.fillText('为你推荐好物', that.data.normalPageX + 30 + nickNameWidth, that.data.avatarPageY + 18)

    // 填充价格符号￥
    ctx.setFillStyle("#cb4255");
    ctx.font = "normal normal 15px sans-serif";
    ctx.fillText("￥", that.data.normalPageX - 2, that.data.pricePageY);
    // 填充价格文字
    ctx.font = "normal bold 20px sans-serif";
    ctx.fillText(
      that.data.price,
      that.data.normalPageX + 13,
      that.data.pricePageY
    );
    // 计算价格符号￥ + 价格文字宽度
    let priceWidth = ctx.measureText("￥" + that.data.price).width;
    //有划线价，才展示
    if (this.data.delPrice) {
      // 填充划线价文字
      ctx.setFillStyle("#999");
      ctx.font = "normal normal 13px sans-serif";
      ctx.fillText(
        that.data.delPrice,
        that.data.normalPageX + priceWidth,
        that.data.pricePageY
      );
      // 计算划线价宽度
      let delPriceWidth = ctx.measureText(that.data.delPrice).width;
      // 填充划线价横线
      ctx.beginPath();
      ctx.moveTo(
        that.data.normalPageX + priceWidth + 2,
        that.data.pricePageY - 4
      );
      ctx.lineTo(
        that.data.normalPageX + priceWidth + delPriceWidth + 2,
        that.data.pricePageY - 4
      );
      ctx.setStrokeStyle("#999");
      ctx.stroke();
      ctx.closePath();
    }
    // 填充小程序码
    ctx.drawImage(
      that.data.qrCode,
      that.data.normalPageX + that.data.windowWidth * 0.53,
      that.data.codePageY,
      that.data.codeWidth,
      that.data.codeHeight
    );
    // 填充长按立即购买文本
    ctx.setFillStyle("#333");
    ctx.font = "normal normal 9px sans-serif";
    ctx.fillText(
      "长按立即购买",
      that.data.normalPageX +
        that.data.windowWidth * 0.53 +
        (that.data.codeWidth - 54) / 2,
      that.data.codePageY + that.data.codeWidth + 10
    );
    //填充整点秒杀背景颜色
    // ctx.rect(that.data.normalPageX, that.data.timePageY, 157, 18)
    // ctx.setFillStyle('#000')
    // ctx.fill()
    // ctx.beginPath()
    // ctx.rect(that.data.normalPageX + 1, that.data.timePageY + 1, 50, 16)
    // ctx.setFillStyle('#fff')
    // ctx.fill()
    //填充整点秒杀文字
    // ctx.setFillStyle("#000")
    // ctx.font = 'normal normal 10px sans-serif'
    // ctx.fillText('整点秒杀', that.data.normalPageX + 6, that.data.timePageY + 12)
    // ctx.setFillStyle("#fff")
    // ctx.fillText('09月30日 16:00开抢', that.data.normalPageX + 56, that.data.timePageY + 12)

    ctx.draw(); //绘制到canvas
  },

  // 保存图片
  savePic: function() {
    let that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 50,
      width: that.data.windowWidth * 2,
      height: that.data.contentHeight * 2,
      canvasId: "myCanvas",
      success: function(res) {
        util.savePicToAlbum(res.tempFilePath);
        wx.hideLoading();
        var tempFilePath = res.tempFilePath;
        that.setData({
          canvasUrl: tempFilePath
        });
        if (tempFilePath !== "") {
          wx.hideLoading();
          wx.previewImage({
            current: that.data.canvasUrl, // 当前显示图片的http链接
            urls: [that.data.canvasUrl], // 需要预览的图片http链接列表
            success: function(_res) {
              console.log("预览成功啦");
            }
          });
        }
      }
    });
  },

  //临时图片路径
  getTempFile: function(url) {           
    wx.showLoading({
      title: '生成中...',
      mask: true,
    });
    let that = this;
    wx.downloadFile({
      url: url,
      success: function(res) {
        that.setData({
          goodsInfoImg: res.tempFilePath
        });
        //继续生成商品的小程序码
        that.getQrCode();
        // that.downloadSkuQrCode()
      },
      fail: function(err) {
        console.log('333333333',err)
        wx.showToast({
          title: "商品图片加载失败！",
          icon: "none",      
          duration:5000
        });
      }
    });
  },

  getQrCode: async function() {       
    let that = this;
    let url =
      constants.InterfaceUrl + `/getSkuQrCode.htm?goodsInfoId=${that.data.skuId}`;
    wx.request({
      url: url,
      method: "GET",
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        "content-type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      success: function(res) {   
        console.log("res===>",res) 
        if(res && res.statusCode == 200 && res.data){//多个条件判断下吧  只能这样了。。
          that.downloadSkuQrCode(res.data);

        }else{
          //返回错误或者返回链接为null
          wx.showToast({
            title: "获取商品码失败,稍后重试",
            icon: "none",      
            duration:5000
          });
        }

        // if (res.data.code == "K-000000" && res.data.context) {
        //   //返回的是个链接，下载下来
        //   that.downloadSkuQrCode(res.data.context);
        // }else{
        //   //返回错误或者返回链接为null
        //   wx.showToast({
        //     title: "获取商品码失败,稍后重试",
        //     icon: "none",      
        //     duration:5000
        //   });
        // }
      },
      fail: function(err) {
        console.log("获取商品码失败", err);
      }
    });
  },

  downloadSkuQrCode: function(url) {
    let that = this;
    // url = "https://mall-mvp-prod-media.oss-cn-beijing.aliyuncs.com/201812261614017902.jpeg";
    wx.downloadFile({
      url: url,
      success: function(res) {
        that.setData({
          qrCode: res.tempFilePath
        });
        wx.hideLoading();
        //生成数据
        that.getData();
      },
      fail: function(err) {
        wx.showToast({
          title: "下载商品码失败,稍后重试！",
          icon: "none",          
          duration:5000
        });
      }
    });
  }
});
