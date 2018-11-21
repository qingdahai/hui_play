// pages/modify/modifyPhoneNumber/modifyPhoneNumber.js
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
    onLoad: function(options) {},

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
    // 监听手机号输入
    phoneNumberVal: function(e) {
        // console.log(e.detail.value)
        this.setData({
            phoneNumber: e.detail.value
        });
    },
    // 监听验证码输入
    verifyCodeVal: function(e) {
        // console.log(e.detail.value)
        this.setData({
            verifyCode: e.detail.value
        });
    },
    // 修改按钮
    modify: function (e) {
        wx.showNavigationBarLoading();
        var that = this;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        wx.request({
            url: util.apiURL + "/api/isLogin/changePhone" + 
                "?userId=" + app.globalData.userId + 
                "&phone=" + that.data.phoneNumber + 
                "&verifyCode=" + that.data.verifyCode,
            method: "PUT",
            header: {
                token: app.globalData.token
            },
            success: function(res) {
                // console.log(res)
                app.globalData.userInfo.phone = res.data.data.phone;
                prevPage.onLoad();
                wx.navigateBack({});
                wx.hideNavigationBarLoading();
            }
        });
    }
})