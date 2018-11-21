// pages/indexPulldown/indexPulldown.js
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
        wx.getLocation({
            success: function(res) {
                wx.request({
                    url: util.apiURL + "/api/gameRoom/gameUrgencyList",
                    data: {
                        pageNo: 1,
                        pageSize: 10,
                        lat: res.latitude,
                        lng: res.longitude,
                        distance: parseInt(options.distance)
                    },
                    success: function(res) {
                        app.request_api_success(res, function() {
                            console.log(res.data.data)
                            // for (var i in res.data.data.indexHot) {
                            //     // console.log(res.data.data.indexHot[i].startTime)
                            //     // console.log(util.time1970num(res.data.data.indexHot[i].startTime))
                            //     if (util.time1970num(res.data.data.indexHot[i].startTime).split("-")[2].split(" ")[0] == util.getTodayDate().split("-")[2]) {
                            //         // 今天
                            //     } else {
                            //         res.data.data.indexHot[i].startTime = util.time1970num(res.data.data.indexHot[i].startTime)
                            //     }
                            //     that.setData({
                            //         indexHot: res.data.data.indexHot
                            //     });
                            // }
                            // console.log(util.time1970num(res.data.data.indexHot[0].startTime))
                        });
                    },
                    fail(res) {
                        wx.hideLoading();
                        wx.showToast({
                            title: '获取组局失败！',
                            icon: 'none',
                            duration: app.globalData.gShowTime
                        });
                        console.log(res)
                    },
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