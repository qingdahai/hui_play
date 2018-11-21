// pages/integral/integralincome/integralincome.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        gameIntegralShow: true, // 初始化隐藏组局积分记录
        integralShow: true, // 初始化隐藏积分记录
        textclass: "in", // 样式
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // console.log(options.type);
        var title; // nav标题
        var that = this;
        wx.showLoading({
            title: "加载中...",
        });
        if (options.type == 1) {
            title = "组局分记录";
            that.setData({
                gameIntegralShow: false,
                integralShow: true
            });
            wx.request({
                url: util.apiURL + "/api/isLogin/userBankRecord",
                header: {
                    token: app.globalData.token
                },
                data: {
                    userId: app.globalData.userId,
                    bankType: 1,
                    pageNo: 1,
                    pageSize: 10
                },
                success: function(res) {
                    wx.hideLoading();
                    app.request_api_success(res, function() {
                        for (var i in res.data.data) {
                            res.data.data[i].showCreateTime = util.time1970num(res.data.data[i].createTime);
                        }
                        console.log(res.data.data);
                        that.setData({
                            gameIntegral: res.data.data
                        });
                    });
                },
                fail: function(res) {
                    wx.hideLoading();
                    wx.showToast({
                        title: "组局分记录获取失败！",
                        icon: "none",
                        mask: true,
                        duration: app.globalData.gShowTime
                    });
                }
            });
        } else {
            title = "积分记录";
            this.setData({
                gameIntegralShow: true,
                integralShow: false
            });
            wx.request({
                url: util.apiURL + "/api/isLogin/userBankRecord",
                header: {
                    token: app.globalData.token
                },
                data: {
                    userId: app.globalData.userId,
                    bankType: 2,
                    pageNo: 1,
                    pageSize: 10
                },
                success: function(res) {
                    wx.hideLoading();
                    app.request_api_success(res, function() {
                        console.log(res.data.data);
                        for (var i in res.data.data) {
                            res.data.data[i].showCreateTime = util.time1970num(res.data.data[i].createTime);
                        }
                        that.setData({
                            integral: res.data.data
                        });
                    });
                },
                fail: function(res) {
                    wx.hideLoading();
                    wx.showToast({
                        title: "局分记录获取失败！",
                        icon: "none",
                        mask: true,
                        duration: app.globalData.gShowTime
                    });
                }
            });
        }
        wx.setNavigationBarTitle({
            title: title
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