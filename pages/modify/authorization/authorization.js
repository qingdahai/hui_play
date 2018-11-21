// pages/modify/authorization/authorization.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isAuthorization: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        // 检查用户是否授权
        wx.getSetting({
            success: function(res) {
                if (res.authSetting['scope.userInfo']) {
                    // console.log("用户已授权");
                    that.setData({
                        userInfo: app.globalData.userInfo,
                        isAuthorization: true
                    });
                    console.log(that.data.userInfo)
                } else {
                    console.log("用户未授权");
                }
            }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    wxLogin: function(e) {
        if (e.detail.userInfo) {
            console.log("用户允许授权");
            wx.showNavigationBarLoading();
            var that = this;
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            wx.login({
                success: function(res) {
                    wx.request({
                        url: "https://api.weixin.qq.com/sns/jscode2session",
                        data: {
                            appid: "wxd9ac23c5bb7e951e", //小程序的 appid
                            secret: "26a882c87da4b39d6ad38daf84456db1", //小程序的 secret
                            grant_type: "authorization_code", //只能写authorization_code
                            js_code: res.code //登陆返回的code
                        },
                        success: function(openIdRes) {
                            wx.getUserInfo({
                                success: function(userInfoRes) {
                                    wx.request({
                                        url: util.apiURL + "/api/isLogin/userUpdate" + 
                                            "?userId=" + app.globalData.userId + 
                                            "&openId=" + openIdRes.data.openid,
                                        method: "PUT",
                                        header: {
                                            token: app.globalData.token
                                        },
                                        success: function(res) {
                                            app.globalData.userInfo.openId = openIdRes.data.openid
                                            prevPage.onLoad();
                                            wx.navigateBack({});
                                            wx.hideNavigationBarLoading();
                                        }
                                    });
                                }
                            });
                        }
                    })
                }
            })
        } else {
            console.log("用户拒绝授权");
        }
    },
})