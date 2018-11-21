// pages/friendMessage/friendMessage.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showFriendNum: true,
        showFriendCare: true,
        showMyModal: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options) {
            var that = this;
            wx.showLoading({
                title: "加载中...",
            });
            wx.request({
                url: util.apiURL + "/api/isLogin/friendsInfo",
                header: {
                    token: app.globalData.token
                },
                data: {
                    userId: app.globalData.userId,
                    otherId: options.id //重新加载id报错
                },
                success: function(res) {
                    wx.hideLoading();
                    app.request_api_success(res, function() {
                        // 出生日期转年龄（微信登陆可能没有年龄）
                        if (res.data.data.birthday) {
                            res.data.data.age = util.birthdayToAge(res.data.data.birthday);
                        } else {
                            res.data.data.age = 0;
                        }
                        if (res.data.data.isFollow == 1) {
                            // 没关注 -->粉丝
                            that.setData({
                                showFriendNum: true,
                                showFriendCare: true,
                                showFriendNumBtn: "showFriendNumBtn",
                                btnVal: "关注"
                            })
                        } else if (res.data.data.isFollow == 2) {
                            // 已关注
                            that.setData({
                                showFriendNum: false,
                                showFriendCare: true,
                                btnVal: "取消关注"
                            })
                        } else if (res.data.data.isFollow == 3) {
                            // 互相关注
                            that.setData({
                                showFriendNum: false,
                                showFriendCare: false,
                                showFriendCareBtn: "showFriendCareBtn",
                                btnVal: "取消关注"
                            })
                        }
                        that.setData({
                            friendMsg: res.data.data
                        });
                    })
                },
                fail: function(res) {
                    wx.hideLoading();
                    wx.showToast({
                        title: "未获取到好友信息！",
                        icon: "none",
                        mask: true,
                        duration: app.globalData.gShowTime
                    });
                }
            });
        }
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
    // 图片单击预览
    previewImg: function(e) {
        var that = this;
        var arr = [];
        var current = null;
        var index = e.currentTarget.dataset.id;
        for (var i in that.data.friendMsg.userPhotoList) {
            arr.push(that.data.friendMsg.userPhotoList[i].imageUrl)
            if (that.data.friendMsg.userPhotoList[i].id == index) {
                current = that.data.friendMsg.userPhotoList[i].imageUrl
            }
        }
        console.log(current)
        wx.previewImage({
            current: current,
            urls: arr
        });
    },
    careFriend: function() {
        var that = this;
        wx.showLoading({
            title: "加载中",
            mask: true,
        });
        if (that.data.btnVal == "关注") {
            // 关注
            console.log(that.data.friendMsg.userId)
            // 添加关注
            wx.request({
                url: util.apiURL + "/api/isLogin/addFriends" +
                    "?userId=" + app.globalData.userId +
                    "&otherId=" + that.data.friendMsg.userId,
                header: {
                    token: app.globalData.token
                },
                method: "POST",
                success: function(res) {
                    wx.hideLoading();
                    app.request_api_success(res, function() {
                        console.log(res.data.msg)
                        // console.log(res.data.data)
                        that.setData({
                            showFriendNum: false,
                            showFriendCare: true,
                            showFriendNumBtn: "",
                            showFriendCareBtn: "",
                            btnVal: "取消关注",
                            showMyModal: false,
                            myModalText: res.data.msg
                        });
                        that.onLoad();
                    });
                },
                fail: function() {
                    wx.hideLoading();
                    wx.showToast({
                        title: "关注失败！",
                        icon: "none",
                        mask: true,
                        duration: app.globalData.gShowTime
                    });
                }
            });
        } else {
            // 取消关注
            wx.request({
                url: util.apiURL + "/api/isLogin/cancelFriends" +
                    "?userId=" + app.globalData.userId +
                    "&otherId=" + that.data.friendMsg.userId,
                header: {
                    token: app.globalData.token
                },
                method: "POST",
                success: function(res) {
                    wx.hideLoading();
                    app.request_api_success(res, function() {
                        console.log(res.data.msg)
                        that.setData({
                            showFriendNum: true,
                            showFriendCare: true,
                            showFriendNumBtn: "showFriendNumBtn",
                            showFriendCareBtn: "",
                            btnVal: "关注",
                            showMyModal: false,
                            myModalText: "取消关注成功！"
                        });
                        that.onLoad();
                    });
                },
                fail: function() {
                    wx.hideLoading();
                    wx.showToast({
                        title: "取消关注失败！",
                        icon: "none",
                        mask: true,
                        duration: app.globalData.gShowTime
                    });
                    console.log(red)
                }
            });
        }
        // getCurrentPages()[getCurrentPages().length - 1].onLoad();
    },
    // 关注成功
    myModalClick: function() {
        this.setData({
            showMyModal: true
        });
    }
})