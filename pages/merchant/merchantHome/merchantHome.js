// pages/merchant/merchantHome/merchantHome.js
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
        wx.showLoading({
            title: "加载中...",
            icon: "none",
            mask: true,
        });
        var that = this;
        // 根据登陆ID获取信息
        var merchantLoginSuccess = wx.getStorageSync("merchantLoginSuccess");
        if (merchantLoginSuccess && merchantLoginSuccess != "") {
            wx.request({
                url: util.apiURL + "/api/shop/shopInfo",
                data: {
                    shopId: wx.getStorageSync("merchantLoginSuccess").data.data.id
                },
                success: function(res) {
                    wx.hideLoading();
                    if (res.data.code == 0) {
                        wx.setStorageSync("merchantDatas", res.data.data);
                        that.setData({
                            merchantInfo: res.data.data
                        });
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: "none",
                            mask: true,
                            duration: 2000
                        });
                        that.goLogin();
                    }
                }
            });
        } else {
            wx.showToast({
                title: "请重新登陆",
                icon: "none",
                mask: true,
                duration: 2000
            });
            that.goLogin();
        }
    },
    goLogin: function () {
        wx.setStorageSync("merchantLoginSuccess", "");
        var back_timer = setTimeout(function() {
            clearTimeout(back_timer);
            wx.reLaunch({
                url: "/pages/login/login/login?type=merchant",
            });
        }, 2000);
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
    // 商户数据
    merchantData: function() {
        wx.navigateTo({
            url: "../merchantData/merchantData",
        })
    },
    // 套餐管理
    merchantSetMeal: function() {
        wx.navigateTo({
            url: "../merchantSetMeal/merchantSetMeal",
        });
    },
    // 相册管理
    merchantAlbum: function() {
        wx.navigateTo({
            url: "../merchantAlbum/merchantAlbum",
        });
    },
    // 收入明细
    merchantMoney: function() {
        wx.navigateTo({
            url: "../merchantMoney/merchantMoney",
        });
    },
    // 设置
    merchantSettings: function() {
        wx.navigateTo({
            url: "../merchantSettings/merchantSettings",
        });
    },
})