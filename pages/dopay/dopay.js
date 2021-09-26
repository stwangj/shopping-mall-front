//唤起支付的承载页面
var app = getApp();
var ctxPath = app.globalData.ctxPath;
Page({
  data:{
   
  },

  onLoad: function (options) {    
    //解析出参数    
    let that = this;
    let data = JSON.parse(options.data);
    wx.requestPayment(
      {
      'timeStamp':data.timeStamp,
      'nonceStr':data.nonceStr,
      'package': `prepay_id=`+data.package,
      'signType': 'MD5',
      'paySign':data.sign,
      'notify_url':"http://kstore.wanmi.com/mobile/wxpaysuc.htm",
      'success':function(res){ 
        if(res.errMsg="requestPayment:ok"){
          wx.showToast({
            title: "支付成功！",
            icon: "none",                  
          });
          wx.navigateTo({
            url: '../home/home'　　// 页面 B
          })          
        }
      },
      'fail':function(res){      
        if(res.errMsg="requestPayment:fail cancel"){
          wx.showToast({
            title: "用户取消支付！",
            icon: "none",                       
          });
        }else{
          wx.showToast({
            title: "支付失败",
            icon: "none",                          
          });  
        }
        wx.navigateTo({
          url: '../home/home'　　
        })   
      },
      'complete':function(res){                     
      }
      })
  },
})