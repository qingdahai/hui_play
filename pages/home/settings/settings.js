// pages/settings/settings.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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
    // 修改密码
    modifyPassword: function() {
        wx.navigateTo({
            url: "/pages/modify/modifyPassword/modifyPassword",
        });
    },
    // 退出登陆
    logout: function() {
        wx.clearStorage();
        wx.request({
            url: util.apiURL + "/api/isLogin/loginOut" +
                "?userId=" + app.globalData.userId,
            header: {
                token: app.globalData.token
            },
            method: "DELETE",
            success: function(res) {
                wx.setStorageSync("userLoginSuccess", "");
                wx.reLaunch({
                    url: "/pages/login/login/login",
                });
            },
            fail: function(res) {
                wx.setStorageSync("userLoginSuccess", "");
                wx.reLaunch({
                    url: "/pages/login/login/login",
                });
            },
            complete(res) {
                wx.setStorageSync("userLoginSuccess", "");
                wx.reLaunch({
                    url: "/pages/login/login/login",
                });
            }
        });
    }
})