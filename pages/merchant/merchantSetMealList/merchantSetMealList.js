// pages/merchant/merchantSetMealList/merchantSetMealList.js
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
        var merchantDatas = wx.getStorageSync("merchantDatas");
        // 判断新商户
        // if (options.newMerchant) {
        //     // 新商户
        // } else {
        //     // 旧商户
        //     that.setData({
        //         labelId: options.id
        //     });
        //     wx.request({
        //         url: util.apiURL + "/api/gameRoom/shopMeal" +
        //             "?shopId=" + merchantDatas.id +
        //             "&labelId=" + that.data.labelId,
        //         success: function(res) {
        //             if (res.data.code == 0) {
        //                 console.log(res.data.msg)
        //                 that.setData({
        //                     mealList: res.data.data
        //                 });
        //                 console.log(res.data.data)
        //                 wx.hideNavigationBarLoading();
        //             } else {
        //                 console.log(res)
        //                 // console.error("merchantSetMealList.js" + res.data.msg)
        //             }
        //         }
        //     })
        // }
        // 先判断是否有返回值(不判断,添加套餐返回没有options会报错)
        if (that.data.isNewMerchantBack) { //判断是否是新商户返回
            that.setData({
                shopMealList: app.globalData.merchantInfo.shopMealList
            });
            console.log(app.globalData.merchantInfo.shopMealList)
        } else if (that.data.isOldMerchantBack) { //判断是否是旧商户返回
            console.log("旧商户返回请求");
            that.getMealList(merchantDatas);
        } else {
            if (options.newMerchant) {
                // 新商家
                console.log(app.globalData.merchantInfo.shopMealList)
                // 判断是否有数据
                if (app.globalData.merchantInfo.shopMealList != null) {
                    that.setData({
                        shopMealList: app.globalData.merchantInfo.shopMealList
                    });
                }
                that.setData({
                    newMerchant: 1
                });
            } else {
                // 旧商户数据
                wx.showNavigationBarLoading();
                that.setData({
                    labelId: options.id
                });
                that.getMealList(merchantDatas);
            }
        }
    },
    // 获取套餐
    getMealList: function (merchantDatas) {
        var that = this;
        wx.request({
            url: util.apiURL + "/api/gameRoom/shopMeal" +
                "?shopId=" + merchantDatas.id +
                "&labelId=" + that.data.labelId,
            success: function(res) {
                if (res.data.code == 0) {
                    console.log(res.data.msg)
                    that.setData({
                        mealList: res.data.data
                    });
                    console.log(res.data.data)
                    wx.hideNavigationBarLoading();
                } else {
                    console.error(res.data.msg)
                }
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
    // 添加按钮
    merchantSetMealAdd: function() {
        // console.log(this.data.newMerchant)
        var that = this;
        wx.navigateTo({
            url: "../merchantSetMealAdd/merchantSetMealAdd?type=" + that.data.newMerchant + "&id=" + that.data.labelId,
        })
    },
    // 新商户确定按钮
    addSuccess: function() {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.setData({
            isNewMerchantBack: true
        })
        wx.navigateBack({})
        prevPage.onLoad();
    },
    //套餐详情

})