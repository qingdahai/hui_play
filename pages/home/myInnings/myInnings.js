// pages/friends/friends.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentTab: 0, // 默认进入进行中
        userInfo: null,
        underwayHideButton: true, // 默认隐藏按钮
        historyHideButton: true, // 默认隐藏按钮
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        that.setData({
            userInfo: app.globalData.userInfo
        });
        // 进行中
        that.getInning(1);
        // 已结束
        // that.getInning(2);
        //  高度自适应
        wx.getSystemInfo({
            success: function(res) {
                var clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR - 130;
                that.setData({
                    winHeight: calc
                });
            }
        });
    },
    // 获取组局列表
    getInning: function(type) {
        var that = this;
        wx.showLoading({
            title: "加载中..."
        });
        wx.request({
            url: util.apiURL + "/api/isLogin/myGames",
            header: {
                token: app.globalData.token
            },
            data: {
                userId: app.globalData.userId,
                type: type,
                pageNo: 1,
                pageSize: 10
            },
            success: function(res) {
                wx.hideLoading();
                app.request_api_success(res, function() {
                    if (res.data.data.length > 0) {
                        console.log(res.data.data)
                        for (var i in res.data.data) {
                            res.data.data[i].time = util.time1970(res.data.data[i].startTime);
                        }
                        that.setData({
                            hideButton: true,
                            innings: res.data.data
                        });
                    } else {
                        that.setData({
                            hideButton: false
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
    // 滚动切换标签样式
    switchTab: function(e) {
        var that = this;
        that.setData({
            currentTab: e.detail.current,
            innings: ""
        });
        that.checkCor();
        that.getInning(that.data.currentTab + 1);
    },
    // 点击标题切换当前页时改变样式
    swichNav: function(e) {
        var cur = e.target.dataset.current;
        if (this.data.currentTab == cur) {
            return false;
        } else {
            this.setData({
                currentTab: cur
            });
        }
    },
    //判断当前滚动超过一屏时，设置tab标题滚动条。
    checkCor: function() {
        if (this.data.currentTab > 4) {
            this.setData({
                scrollLeft: 300
            });
        } else {
            this.setData({
                scrollLeft: 0
            });
        }
    },
    //获取当前滑块的index
    bindchange: function(e) {
        const that = this;
        that.setData({
            currentData: e.detail.current
        });
    },
    // 正在进行组局详情
    underway: function(e) {
        wx.navigateTo({
            url: '/pages/inning/inningUnderway/inningUnderway?id=' + e.currentTarget.dataset.id,
        });
    },
    // 历史进行组局详情
    history: function(e) {
        wx.navigateTo({
            url: '/pages/inning/inningHistory/inningHistory?id=' + e.currentTarget.dataset.id,
        });
    },
    // 加入或创建
    join: function() {
        wx.showActionSheet({
            itemList: ['创建局', '加入'],
            itemColor: "#000",
            success: function(res) {
                if (!res.cancel) {
                    if (res.tapIndex == 0) {
                        console.log("创建局");
                        wx.reLaunch({
                            url: "/pages/create/create/create",
                        });
                    } else if (res.tapIndex == 1) {
                        console.log("加入局");
                        wx.reLaunch({
                            url: "/pages/join/join/join",
                        });
                    }
                }
            }
        });
    },
    // 申诉
    appeal: function(e) {
        wx.navigateTo({
            url: "../appeal/appeal?gameRoomId=" + e.currentTarget.dataset.gameroomid,
        });
    }
})