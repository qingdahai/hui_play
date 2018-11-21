// pages/inningsMsg/inningsMsg.js
var util = require("../../../utils/util.js");
var app = getApp();
var time_timer = null;
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
            title: "加载中",
            mask: true
        })
        // 局详情
        // console.log(options.id)
        that.setData({
            id: options.id
        });
        wx.request({
            url: util.apiURL + "/api/gameRoom/gameRoomInfo",
            data: {
                id: options.id,
                lat: app.globalData.lat,
                lng: app.globalData.lng
            },
            success: function(inningRes) {
                app.request_api_success(inningRes, function() {
                    console.log(inningRes.data.data)
                    // 当前时间时间戳
                    var data_time = new Date().getTime();
                    that.setData({
                        data_time
                    })
                    // 定时器
                    clearInterval(time_timer)
                    if (inningRes.data.data.startTime > data_time && inningRes.data.data.startTime < data_time + 60 * 60 * 24 * 1000) {
                        time_timer = setInterval(function() {
                            // 判断组局时间是否在一天之内
                            that.setData({
                                countDownTime: util.getTime24(inningRes.data.data.startTime / 1000)
                            });
                        }, app.globalData.gShowTime);
                    }
                    // 时间戳处理
                    inningRes.data.data.startTime_zh = util.time1970num(inningRes.data.data.startTime);
                    // 局信息
                    that.setData({
                        inningData: inningRes.data.data,
                    });
                    // 商家信息：
                    if (inningRes.data.data.shopId) {
                        wx.request({
                            url: util.apiURL + "/api/gameRoom/shopInfo",
                            data: {
                                shopId: inningRes.data.data.shopId,
                                labelId: inningRes.data.data.labelId,
                            },
                            success: function(shopRes) {
                                wx.hideLoading();
                                app.request_api_success(shopRes, function() {
                                    that.setData({
                                        shopData: shopRes.data.data,
                                    });
                                });
                            },
                            fail: function(shopRes) {
                                console.log("局详情获取失败！");
                                wx.hideLoading();
                                // wx.showToast({
                                //     title: "局详情获取失败！",
                                //     icon: "none",
                                //     mask: true,
                                //     duration: app.globalData.gShowTime
                                // });
                            }
                        });
                    } else {
                        wx.hideLoading();
                        // console.log(that.data)
                    }
                });
            },
            fail: function(inningRes) {
                console.log("局详情获取失败！");
                wx.hideLoading();
                // wx.showToast({
                //     title: "局详情获取失败！",
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
    // 成员详情
    friendMsg: function(e) {
        // console.log(e.currentTarget.dataset.id)
        wx.navigateTo({
            url: "/pages/friends/friendMsg/friendMsg?id=" + e.currentTarget.dataset.id,
        });
    },
    // 加入组局
    joinInning: function() {
        var that = this;
        var onOff = false;
        wx.showLoading({
            title: "加载中...",
        });
        wx.request({
            url: util.apiURL + "/api/isLogin/myGames",
            header: {
                token: app.globalData.token
            },
            data: {
                userId: app.globalData.userId,
                type: 1,
                pageNo: 1,
                pageSize: 10
            },
            success: function(res) {
                console.log(res)
                if (res.data.code == 0) {
                    if (res.data.data.length != 0) {
                        for (var i in res.data.data) {
                            console.log(res.data.data[i].id != that.data.id)
                            if (res.data.data[i].id != that.data.id) {
                                onOff = true;
                            } else {
                                wx.hideLoading();
                                wx.navigateTo({
                                    url: '/pages/inning/inningUnderway/inningUnderway?id=' + that.data.id
                                });
                            }
                        }
                    } else {
                        onOff = true;
                    }
                    console.log(5)
                    if (onOff) {
                        // 正在进行的局与点击局不匹配，或没有正在进行的局
                        wx.setStorageSync("inningData", that.data.inningData);
                        console.log(that.data.inningData)
                        if (that.data.inningData.shopId) {
                            // 有商户
                            wx.hideLoading();
                            wx.navigateTo({
                                url: "../inningMealList/inningMealList",
                            })
                        } else {
                            // wx.setStorageSync("inningData", that.data.inningData);
                            // 非商户直接入局
                            wx.request({
                                url: util.apiURL + "/api/isLogin/gameRoom/enterGameRoom" +
                                    "?userId=" + app.globalData.userId +
                                    "&gameRoomId=" + that.data.inningData.id,
                                header: {
                                    token: app.globalData.token
                                },
                                method: "POST",
                                success: function(res) {
                                    wx.hideLoading();
                                    console.log(res)
                                    if (res.data.code == 0) {
                                        wx.navigateTo({
                                            url: "../inningUnderway/inningUnderway?id=" + that.data.inningData.id,
                                        });
                                    } else {
                                        wx.showToast({
                                            title: res.data.msg,
                                            icon: "none",
                                            mask: true,
                                            duration: app.globalData.gShowTime
                                        });
                                    }
                                },
                                fail() {
                                    wx.hideLoading();
                                }
                            })
                        }
                    }
                } else {
                    console.error(res.data.msg);
                }
            },
            fail: function(res) {
                wx.hideLoading();
            }
        });
    }
})