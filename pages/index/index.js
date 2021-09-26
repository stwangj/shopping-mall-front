//index.js
//获取应用实例
const app = getApp()
var constants = require("../../utils/constants");

Page({
  data: {},
  onLoad: function (options) {    
    wx.login({
      success: function(res) {        
        if (res.code) {              
          //向服务端发起请求，获取小程序的openId       
          let url = constants.InterfaceUrl + `/getMiniPorgramOpenId.htm?code=${res.code}`;
          wx.request({
            url:url,          
            success:function(result){
              //返回结果为openid,并全局存储
              if(result && result.statusCode == 200 && result.data){              
                app.globalData.openId=result.data;   
              }               
            },
            fail:function(res){
              console.log("获取用户登录装失败！",res)
            }
          })
        } else {
          console.log('获取用户登录装失败！' + res.errMsg)
        }
      },
      fail:function(res){
        console.log('获取用户登录装失败！' + res.errMsg)
      }
    });
    wx.navigateTo({ url: '/pages/home/home' })
  },

  onLaunch:function(){
    console.log("加载一次")
  },
  onHide:function(){
    console.log("影响页面")
  },
  onShow:function(){
    console.log("搭载页面展示")
    //点击首页的返回按钮
    wx.navigateTo({ url: '/pages/home/home' })
  },
  onUnload: function () {
    console.log("搭载页面销毁")
  },
})
