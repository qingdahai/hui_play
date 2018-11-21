// pages/myInningsDetails/underway/underway.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        signInInningVal: "签到",
        showAdmin: true,
        adminToOtherSignInId: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 判断当前用户是不是局主
        // 是 显示可帮签按钮
        var that = this;
        wx.showLoading({
            title: "加载中..."
        });
        console.log(app.globalData.userInfo)
        that.setData({
            showAdmin: false,
            inningId: options.id
        });
        if (wx.getStorageSync("signInInningSign")) {
            that.setData({
                signInInning: "signInInning",
                signInInningVal: "已签到"
            });
        }
        wx.request({
            url: util.apiURL + "/api/gameRoom/gameRoomInfo",
            data: {
                id: that.data.inningId,
                lat: app.globalData.lat,
                lng: app.globalData.lng
            },
            success: function(res) {
                wx.hideLoading();
                app.request_api_success(res, function() {
                    var inningData = wx.setStorageSync("inningData", res.data.data);
                    console.log(res.data.data)
                    that.setData({
                        inningInfo: res.data.data
                    });
                }, function() {
                    wx.showToast({
                        title: res.data.msg,
                        icon: "none",
                        duration: app.globalData.gShowTime,
                        mask: true
                    });
                    var back_timer = setTimeout(function() {
                        clearTimeout(back_timer);
                        wx.navigateBack({})
                    }, app.globalData.gShowTime);
                });
                // if (res.data.code == 0) {
                //     var inningData = wx.setStorageSync("inningData", res.data.data);
                //     that.setData({
                //         inningInfo: res.data.data
                //     });
                // } else {
                //     wx.showToast({
                //         title: res.data.msg,
                //         icon: "none",
                //         duration: app.globalData.gShowTime,
                //         mask: true
                //     });
                //     var back_timer = setTimeout(function() {
                //         clearTimeout(back_timer);
                //         wx.navigateBack({})
                //     }, app.globalData.gShowTime)
                // }
            },
            fail: function(res) {
                wx.showToast({
                    title: "获取局失败！",
                    icon: "none",
                    duration: app.globalData.gShowTime,
                    mask: true
                });
                console.log(res)
            },
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
    // 套餐列表
    inningMealList: function() {
        wx.navigateTo({
            url: "../inningMealList/inningMealList?isAddMyMeal=true",
        });
    },
    // 局主选择
    selectInningPer: function(e) {
        var that = this;
        // console.log(e.currentTarget.dataset.id)
        if (that.data.currentTab == e.currentTarget.dataset.id) {
            this.setData({
                currentTab: "",
                currentTabImg: "",
                adminToOtherSignInId: ""
            });
        } else {
            this.setData({
                currentTab: e.currentTarget.dataset.id,
                currentTabImg: e.currentTarget.dataset.id,
                adminToOtherSignInId: e.currentTarget.dataset.id
            });
            if (that.data.signInInning == "signInInning") {
                this.setData({
                    signInInning: "",
                    signInInningVal: "签到"
                });
            } else {
                // 再次判断局主签到
                // 签到了
                this.setData({
                    signInInning: "signInInning",
                    signInInningVal: "已签到"
                })
                // 没有不改变
            }
        }
    },
    // 代替签到
    signInInningAdmin: function() {

    },
    // 退出
    exitInning: function() {
        wx.navigateTo({
            url: "/pages/inning/inningExit/inningExit?id=" + this.data.inningInfo.id,
        })
    },
    // 签到
    signInInning: function() {
        var that = this;
        if (wx.getStorageSync("signInInningSign")) {
            this.setData({
                signInInning: "signInInning",
                signInInningVal: "已签到"
            });
            return false;
        }
        if (that.data.signInInning == "signInInning") {
            console.log("不能重复签到");
        } else {
            console.log(app.globalData.lat)
            console.log(app.globalData.lng)
            console.log(that.data.inningInfo.id)
            console.log(app.globalData.userInfo.id)
            wx.showLoading({
                title: "加载中...",
                mask: true
            });
            wx.request({
                url: util.apiURL + "/api/gameRoom/sign" +
                    "?lat=" + app.globalData.lat +
                    "&lng=" + app.globalData.lng +
                    "&gameRoomId=" + that.data.inningInfo.id +
                    "&userIds=" + app.globalData.userInfo.id,
                method: "PUT",
                success: function(res) {
                    wx.hideLoading();
                    app.request_api_success(res, function() {
                        wx.showToast({
                            title: res.data.msg,
                            icon: "none",
                            duration: app.globalData.gShowTime,
                            mask: true
                        });
                        wx.setStorageSync("signInInningSign", true);
                    });
                    // if (res.data.code == 0) {
                    //     wx.showToast({
                    //         title: res.data.msg,
                    //         icon: "none",
                    //         duration: app.globalData.gShowTime,
                    //         mask: true
                    //     });
                    //     wx.setStorageSync("signInInningSign", true);
                    // } else {
                    //     wx.showToast({
                    //         title: res.data.msg,
                    //         icon: "none",
                    //         duration: app.globalData.gShowTime,
                    //         mask: true
                    //     });
                    // }
                },
                fail: function(res) {
                    wx.hideLoading();
                }
            })
            this.setData({
                signInInning: "signInInning",
                signInInningVal: "已签到"
            });
            // 签到成功处理
            // 判断是否是局主帮助签到
            if (this.data.adminToOtherSignInId == "") {
                console.log("签到");
                // 否
                // ...
            } else {
                // 是
                console.log("局主帮签");
            }
        }
    }
})