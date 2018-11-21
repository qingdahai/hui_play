// pages/integral/integral.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        wx.showLoading({
            title: "加载中...",
        });
        wx.request({
            url: util.apiURL + "/api/isLogin/integral",
            header: {
                token: app.globalData.token
            },
            data: {
                userId: app.globalData.userId
            },
            success: function(res) {
                wx.hideLoading();
                app.request_api_success(res, function() {
                    that.setData({
                        integralData: res.data.data
                    });
                });
            },
            fail: function(res) {
                wx.hideLoading();
                wx.showToast({
                    title: "积分获取失败！",
                    icon: "none",
                    mask: true,
                    duration: app.globalData.gShowTime
                });
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
    // 组局分
    gameIntegral: function() {
        wx.navigateTo({
            url: '../integralShow/integralShow?type=1',
        });
    },
    // 积分
    integral: function() {
        wx.navigateTo({
            url: '../integralShow/integralShow?type=2',
        });
    }
})