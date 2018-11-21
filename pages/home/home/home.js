// pages/home/home.js
var util = require("../../../utils/util.js")
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        wx.showLoading({
            title: "加载中..."
        });
        if (app.globalData.userInfo) {
            wx.hideLoading();
            that.setData({
                userInfo: app.globalData.userInfo
            });
            return false;
        }
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
    // 页面跳转
    // 个人中心
    personalData: function() {
        wx.navigateTo({
            url: "../personalData/personalData",
        })
    },
    // 我的组局
    myInnings: function() {
        wx.navigateTo({
            url: "../myInnings/myInnings",
        })
    },
    // 积分
    integral: function() {
        wx.navigateTo({
            url: "../integral/integral",
        })
    },
    // 相册
    album: function() {
        wx.navigateTo({
            url: "../album/album",
        })
    },
    // ******************************************************************************************************************************
    osMsg: function() {
        wx.navigateTo({
            url: "/pages/msgCenter/menu/msg",
        })
    },
    // ******************************************************************************************************************************
    // 我的喜好
    myLove: function() {
        wx.navigateTo({
            url: "../myLove/myLove",
        })
    },
    // 分享好友
    share: function() {
        wx.navigateTo({
            url: "../share/share",
        })
    },
    // 关于我们
    aboutAs: function() {
        wx.navigateTo({
            url: "../about/about",
        })
    },
    // 商家入驻
    merchantRegister: function() {
        // 初始化商家数据
        app.globalData.merchantInfo = {
            logo: null,
            shopName: null,
            address: null,
            phone: null,
            startTime: null,
            endTime: null,
            email: null,
            labelList: null,
            linkman: null,
            shopInfo: null,
            shopMealList: [],
            collectMode: null
        };
        wx.navigateTo({
            url: "/pages/merchant/merchantRegister/merchantRegister",
        });
    },
    // 使用教程
    usage: function() {
        wx.navigateTo({
            url: "../usage/usage",
        })
    },
    // 设置
    settings: function() {
        wx.navigateTo({
            url: "../settings/settings",
        })
    }
})