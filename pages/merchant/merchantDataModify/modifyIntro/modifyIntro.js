// pages/merchant/merchantDataModify/modifyIntro/modifyIntro.js
var util = require("../../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        textarea: "",
        inputNumber: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        if (options.newMerchant) {
            wx.setNavigationBarTitle({
                title: "填写简介",
            })
            that.setData({
                isnewMerchant: true
            });
        }
        if (!that.data.isnewMerchant){
            console.log(wx.getStorageSync("merchantDatas"))
            that.setData({
                textarea: wx.getStorageSync("merchantDatas").shopInfo
            });
        }
        // this.setData({
        //     textarea: app.globalData.merchantInfo.shopInfo
        // })
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
    // 实时监听
    textareaInput: function(e) {
        // console.log(e.detail.value)
        this.setData({
            inputNumber: e.detail.value.length,
            textarea: e.detail.value
        });
    },
    // 修改按钮
    modifyIntro: function() {
        wx.showLoading({
            title: "加载中...",
        });
        var that = this;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        if (that.data.isnewMerchant) {
            app.globalData.merchantInfo.shopInfo = that.data.textarea;
            wx.hideLoading();
            wx.navigateBack({});
            prevPage.onLoad();
        } else {
            wx.request({
                url: util.apiURL + "/api/shop/updateInfo" +
                    "?shopId=" + app.globalData.shopId,
                method: "PUT",
                data: {
                    shopInfo: that.data.textarea
                },
                success: function(res) {
                    wx.hideLoading();
                    if (res.data.code == 0) {
                        prevPage.onLoad();
                        wx.navigateBack({});
                    } else {
                        wx.showToast({
                            title: res.msg.data,
                            icon: "none",
                            mask: true,
                            duration: 2000
                        });
                        console.error(res.data.msg);
                    }
                },
                fail: function(res) {
                    wx.hideLoading();
                    wx.showToast({
                        title: "修改失败!",
                        icon: "none",
                        mask: true,
                        duration: 2000
                    });
                }
            });
        }
    }
})