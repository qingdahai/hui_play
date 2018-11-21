// pages/inningsOver/inningsOver.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        myModalHide: true,
        shopCommont: 0,
        gameCommont: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        // 清除签到
        wx.setStorageSync("signInInningSign", false);
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
    // 输入监听
    textareaInput: function(e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    // 显示提示确定
    myModalBtn: function() {
        this.setData({
            myModalHide: true
        })
    },
    // 星星选择
    assess: function(e) {
        if (e.currentTarget.dataset.type == 0) {
            this.setData({
                shopCommont: e.currentTarget.dataset.id
            });
        }
        if (e.currentTarget.dataset.type == 1) {
            this.setData({
                gameCommont: e.currentTarget.dataset.id
            });
        }
    },
    //提交评价
    query_ok: function() {
        var that = this;
        var data = {
            userId: app.globalData.userId,
            gameCommont: that.data.gameCommont,
            gameRoomId: 0,
            shopCommont: that.data.shopCommont,
            describe: that.data.inputVal,
        }
        console.log(data)
        wx.showLoading({
            title: "加载中...",
            mask: true
        });
        wx.request({
            url: util.apiURL + "/api/gameRoom/comment",
            method: "POST",
            data: {
                userId: app.globalData.userId,
                gameCommont: that.data.gameCommont,
                gameRoomId: 0,
                shopCommont: that.data.shopCommont,
                describe: that.data.inputVal,
            },
            success: function(res) {
                wx.hideLoading();
                app.request_api_success(res, function() {
                    that.setData({
                        myModalHide: false
                    });
                });
            },
            fail: function(res) {
                wx.showToast({
                    title: "提交失败！",
                    icon: "none",
                    duration: app.globalData.gShowTime,
                    mask: true
                });
                console.log(res)
            }
        });
    }
})