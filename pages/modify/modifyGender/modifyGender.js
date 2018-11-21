// pages/modifyGender/modifyGender.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showselect: null,
        selectgender: ""
    },

    select: function(e) {
        if (e.currentTarget.dataset.gender == "男") {
            this.setData({
                showselect: 1
            });
        } else {
            this.setData({
                showselect: 2
            });
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            userInfo: app.globalData.userInfo,
            showselect: app.globalData.userInfo.sex
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
    // 确认修改按钮
    modify: function(e) {
        wx.showNavigationBarLoading();
        var that = this;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        wx.request({
            url: util.apiURL + "/api/isLogin/userUpdate" + 
                "?userId=" + app.globalData.userId + 
                "&sex=" + that.data.showselect,
            method: "PUT",
            header: {
                token: app.globalData.token
            },
            success: function(res) {
                app.globalData.userInfo.sex = that.data.showselect
                prevPage.onLoad();
                wx.navigateBack({});
                wx.hideNavigationBarLoading();
            }
        });
    }
})