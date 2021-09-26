var constants = require("../../utils/constants");
//该页面用于存放分享后的内嵌网页
var app = getApp();
var ctxPath = app.globalData.ctxPath;
Page({
  data:{
    orderMap:{},
    pay_src:''
  },

  onLoad: function (options) {        
    //解析出参数    
    let that = this;
    let orderCode = JSON.parse(options.data).orderCode;
    let orderId = JSON.parse(options.data).orderId;
    let orderCount = JSON.parse(options.data).orderCount;  
    let orderNo = JSON.parse(options.data).orderNo;   
    //如果传了orderNo,则是从提交订单页直接过来支付
    if(orderNo){
      that.setData({
        pay_src:ctxPath+`order/toPayOrder.htm?isWx=is&orderNo=`+orderNo+'&openId='+app.globalData.openId
      }) 
    }else{
      that.setData({
        pay_src:ctxPath+`order/toPayOrder.htm?isWx=is&orderId=`+orderId+`&orderNo=`+orderCode+`&orderCount=`+orderCount+'&openId='+app.globalData.openId
      }) 
    }
  },
})