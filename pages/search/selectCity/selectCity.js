// pages/search/selectCity/selectCity.js
// mapLocation.js
var QQMapWX = require('../../../libs/qqmap-wx-jssdk.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        var qqmapsdk = new QQMapWX({
            key: '3ZMBZ-FU7CU-ZCQVY-2KO2A-XOLEH-ZZBFM'
        });
        wx.getLocation({
            success: function(res) {
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude
                    },
                    success: function(res) {
                        // console.log(res);
                    },
                    fail: function(res) {
                        // console.log(res);
                    },
                    complete: function(res) {
                        that.setData({
                            positionCity: res.result.address_component.city
                        })
                    }
                });
            },
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