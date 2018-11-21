// pages/home/appeal/appeal.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputNumber: 200 //最大输入值
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        this.setData({
            gameRoomId: options.gameRoomId,
        })
    },
    // 输入监听
    textareaInput: function(e) {
        this.setData({
            inputNumber: 200 - e.detail.value.length,
            inputVal: e.detail.value
        });
    },
    query_ok: function() {
        var that = this;
        wx.showLoading({
            title: "加载中...",
        });
        wx.request({
            url: util.apiURL + "/api/isLogin/userAppeal",
            header: {
                token: app.globalData.token
            },
            data: {
                cause: that.data.inputVal,
                gameRoomId: that.data.gameRoomId,
                userId: app.globalData.userId
            },
            method: "POST",
            success: function(res) {
                wx.hideLoading();
                app.request_api_success(res, function() {
                    wx.showToast({
                        title: res.data.msg,
                        icon: "none",
                        mask: true,
                        duration: app.globalData.gShowTime
                    });
                    var back_time = setTimeout(function() {
                        clearTimeout(back_time);
                        wx.navigateBack({})
                    }, app.globalData.gShowTime);
                });
            },
            fail: function(res) {
                console.log(res)
                wx.showToast({
                    title: "提交失败",
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

    }
})