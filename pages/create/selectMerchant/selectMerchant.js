// pages/create/selectMerchant/selectMerchant.js
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
        var createInningsData = wx.getStorageSync("createInningsData");
        that.setData({
            createInningsData
        })
        wx.getLocation({
            success: function(locationRes) {
                wx.request({
                    url: util.apiURL + "/api/gameRoom/shopList",
                    data: {
                        pageNo: 1,
                        pageSize: 10,
                        labelId: createInningsData.labelId,
                        lat: locationRes.latitude,
                        lng: locationRes.longitude,
                    },
                    success: function(res) {
                        wx.hideLoading();
                        app.request_api_success(res, function() {
                            that.setData({
                                shopList: res.data.data
                            });
                        });
                    }, fail: function (res) {
                        wx.hideLoading();
                        wx.showToast({
                            title: "商户列表获取失败！",
                            icon: "none",
                            mask: true,
                            duration: app.globalData.gShowTime
                        });
                    }
                });
            },
            fail: function(res) {
                console.log("获取地理位置失败！");
                wx.showToast({
                    title: "获取地理位置失败！",
                    icon: "none",
                    mask: true,
                    duration: app.globalData.gShowTime
                });
            }
        })
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
    // 商户详情
    selectMerchantMsg: function(e) {
        wx.navigateTo({
            url: "../selectMerchantMsg/selectMerchantMsg?shopId=" + e.currentTarget.dataset.shopid + "&distance=" + e.currentTarget.dataset.distance,
        });
    },
    // 手动输入
    inputAddress: function() {
        wx.navigateTo({
            url: "../setAddress/setAddress",
        });
    }
})