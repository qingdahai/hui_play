// pages/myInningsDetails/inningMealList/inningMealList.js
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
            title: "加载中",
            mask: true
        })
        var that = this;
        console.log(options)
        if (options.isAddMyMeal) {
            that.setData({
                isAddMyMeal: options.isAddMyMeal
            });
        }
        var inningData = wx.getStorageSync("inningData");
        // console.log(inningData)
        wx.request({
            url: util.apiURL + "/api/gameRoom/shopMeal",
            data: {
                shopId: inningData.shopId
            },
            success: function(res) {
                wx.hideLoading();
                app.request_api_success(res, function() {
                    console.log(res.data.data)
                    that.setData({
                        mealList: res.data.data
                    });
                    wx.setStorageSync("mealList", res.data.data);
                });
            },
            fail: function(res) {
                console.log("获取商户列表失败！");
                wx.hideLoading();
                // wx.showToast({
                //     title: "获取商户列表失败！",
                //     icon: "none",
                //     mask: true,
                //     duration: app.globalData.gShowTime
                // });
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

    },
    // 选择套餐
    selectMeal: function(e) {
        // console.log(e.currentTarget.dataset.id)
        var urladd = "";
        if (this.data.isAddMyMeal) {
            urladd = "&isAddMyMeal=true"
        }
        // 判断是否添加套餐
        wx.navigateTo({
            url: "../pay/pay?id=" + e.currentTarget.dataset.id + urladd,
        });
    }
})