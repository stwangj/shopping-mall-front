/**
 * Created by zhouxin on 2018/11/27.
 */
var constants = require('./constants');

var request = function () {
};

request.rq = function (url, data, needToken, method) {    
    // if (!requestControl(data, url)) {
    //     return new Promise(function (resolve, reject) {
    //         reject({ msg: "一秒类请求超过一次" })
    //     });
    // }
    var headers = {};
    var params = data || {};
    if ("POST" == method) {
        headers = {
            'content-type': 'application/json' // 默认值
        }
    }
    var tokenFlag = needToken === undefined ? true : needToken;
    //如果需要token 则加上
    if (tokenFlag) {
        headers.Authorization = ""
    }
    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            method: method,
            data: params,
            header: headers,
            success: function (res) {   
                if (res.statusCode == 200) {
                    resolve(res.data) 
                } else {
                    wx.showToast({
                        title: "网络请求发生异常,错误码:" + res.statusCode
                    });
                    reject(res.data);
                }
            },
            fail: function (resq) {
                reject(resq);
            }
        });
    });
}

request.get = function (url, data, unNeedToken) {
    return this.rq(constants.InterfaceUrl + url, data, unNeedToken, "GET");
}

request.post = function (url, data, unNeedToken) {
    return this.rq(constants.InterfaceUrl + url, data, unNeedToken, "POST");
}

request.directGet=function(url,data,unNeedToken){
  return this.rq(url, data, unNeedToken, "GET");
}

request.directPost=function(url,data,unNeedToken){
  return this.rq(url, data, unNeedToken, "POST");
}


/**
 * 请求处理器，1秒内仅允许一次请求*/
var urlMap = {};
function requestControl(params, url) {
    let dealUrl = parseUrl(params, url);
    let lastTime = urlMap[dealUrl];
    let now = new Date().getTime();
    if (!isNaN(lastTime)) {
        if (now - lastTime > 1000) {
            urlMap[dealUrl] = now;
            return true;
        } else {
            return false;
        }
    } else {
        urlMap[dealUrl] = now;
        return true;
    }
}



/**
 * 拼装url和参数
*/
function parseUrl(params, url) {
    let tmp = [];
    for (let k in params) {
        if (params.hasOwnProperty(k)) {
            tmp.push(k + params[k]);
        }
    }

    tmp.sort(function (a1, b1) {
        return a1 > b1;
    })

    return url + tmp.join("");
}

module.exports = request;