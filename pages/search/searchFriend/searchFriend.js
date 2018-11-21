// pages/searchFriend/searchFriend.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputVal: "",
        goSearch: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},

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
    inputVal: function(e) {
        this.setData({
            goSearch: false,
            inputVal: e.detail.value
        });
    },
    searchFriend: function(e) {
        console.log(app.globalData.userId)
        var that = this;
        console.log(that.inputVal)
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
                otherId: that.inputVal, //重新加载id报错
            },
            success: function(res) {
                wx.hideLoading();
                if (res.data.code == 0) {
                    console.log(res.data);
                    // console.log(res.data.data.isFollow)
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
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: "none",
                        mask: true,
                        duration: 2000
                    })
                    console.error("pages/friendMessage/friendMessage.js：" + res.data.msg);
                }
            },
            fail: function(res) {
                wx.hideLoading();
            }
        });
        // wx.navigateTo({
        //     url: "/pages/friends/friendMsg/friendMsg?friendType=" + this.inputVal,
        // });
    }
})