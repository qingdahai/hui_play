// pages/share/share.js
var util = require("../../../utils/util.js");
var WxParse = require('../../../wxParse/wxParse.js');
Page({
    onLoad: function(options) {
        var that = this;
        wx.showLoading({
            title: "加载中...",
        });
        wx.request({
            url: util.apiURL + "/api/html",
            data: {
                id: 2
            },
            success: function(res) {
                wx.hideLoading();
                console.log(res.data);
                app.request_api_success(res, function() {
                    WxParse.wxParse('article', 'html', res.data, that, 5);
                });
            },
            fail: function(res) {
                wx.hideLoading();
                wx.showToast({
                    title: "加载失败！",
                    icon: "none",
                    mask: true,
                    duration: app.globalData.gShowTime
                });
            }
        });
    },
})