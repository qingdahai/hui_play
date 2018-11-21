// pages/create/selectMerchantMsg/selectMerchantMsg.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgIndex: 0
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
            createInningsData,
            distance: options.distance
        })
        wx.request({
            url: util.apiURL + "/api/gameRoom/shopInfo",
            data: {
                labelId: createInningsData.labelId,
                shopId: options.shopId
            },
            success: function(res) {
                wx.hideLoading();
                app.request_api_success(res, function() {
                    for (var i in res.data.data.shopMealList) {
                        res.data.data.shopMealList[i].price = res.data.data.shopMealList[i].price.toFixed(2);
                    }
                    that.setData({
                        shopInfo: res.data.data
                    });
                });
            },
            fail: function() {
                wx.hideLoading();
                wx.showToast({
                    title: "商户信息获取失败！",
                    icon: "none",
                    mask: true,
                    duration: app.globalData.gShowTime
                });
            }
        })
    },
    bindchange: function(e) {
        this.setData({
            imgIndex: e.detail.current
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
    // 单选
    selectType: function(e) {
        this.setData({
            selectId: e.currentTarget.dataset.id
        });
    },
    // 确定
    query_ok: function(e) {
        var that = this;
        if (!that.data.selectId) {
            wx.showToast({
                title: "请选择套餐",
                icon: "none",
                duration: app.globalData.gShowTime
            });
            return false
        }
        for (var i in that.data.shopInfo.shopMealList) {
            if (that.data.shopInfo.shopMealList[i].id == that.data.selectId) {
                that.data.shopInfo.shopMealList[i].active = true;
                break;
            }
        }
        console.log(that.data.shopInfo)
        wx.setStorageSync("createInningsData_shopInfo", that.data.shopInfo);
        getCurrentPages()[getCurrentPages().length - 3].onLoad();
        getCurrentPages()[getCurrentPages().length - 3].setData({
            hideSelectedMeal: false,
            placeName: that.data.shopInfo.address,
            address: that.data.shopInfo.address,
            distance: that.data.distance,
            isUserInputAddress: false
        })
        wx.navigateBack({
            delta: 2
        });
    }
})