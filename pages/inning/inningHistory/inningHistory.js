// pages/myInningsDetails/underway/underway.js
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
        var that = this;
        wx.showLoading({
            title: "加载中...",
        });
        wx.request({
            url: util.apiURL + "/api/gameRoom/gameRoomInfo",
            data: {
                userId: app.globalData.userId,
                id: options.id,
                lat: app.globalData.lat,
                lng: app.globalData.lng,
            },
            success: function(res) {
                wx.hideLoading();
                app.request_api_success(res, function() {
                    console.log(res.data.data)
                    res.data.data.time = util.time1970(res.data.data.startTime);
                    that.setData({
                        inningInfo: res.data.data
                    });
                    if (res.data.data.shopId) {
                        wx.request({
                            url: util.apiURL + "/api/gameRoom/shopInfo",
                            data: {
                                userId: app.globalData.userId,
                                id: options.id,
                                lat: app.globalData.lat,
                                lng: app.globalData.lng,
                            },
                            success: function(shopRes) {
                                app.request_api_success(shopRes, function() {
                                    that.setData({
                                        shopInfo: shopRes.data.data
                                    });
                                });
                            },
                            fail: function(res) {
                                console.log("商户信息获取失败！");
                                wx.hideLoading();
                                // wx.showToast({
                                //     title: "商户信息获取失败！",
                                //     icon: "none",
                                //     mask: true,
                                //     duration: app.globalData.gShowTime
                                // });
                            }
                        });
                    }
                });
            },
            fail: function(res) {
                wx.hideLoading();
                wx.showToast({
                    title: "组局加载失败！",
                    icon: "none",
                    mask: true,
                    duration: app.globalData.gShowTime
                });
            }
        });
    },
    // 成员详情
    friendMsg: function(e) {
        // console.log(e.currentTarget.dataset.id)
        wx.navigateTo({
            url: "/pages/friends/friendMsg/friendMsg?id=" + e.currentTarget.dataset.id,
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