// pages/authorization/authorization.js
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
        // 检查用户是否授权
        wx.getSetting({
            success: function(res) {
                if (res.authSetting['scope.userInfo']) {
                    // console.log("用户已授权");
                    that.setData({
                        isAuthorization: true
                    });
                    if (app.globalData.userInfo) {
                        that.setData({
                            userInfo: app.globalData.userInfo,
                        });
                    }
                } else {
                    console.log("用户未授权");
                }
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
    wxAuthorizationLogin: function(e) {
        // 调用用户允许授权
        if (e.detail.userInfo) {
            // console.log("用户允许授权");
            this.wxLogin();
        } else {
            console.log("用户拒绝授权");
            wx.showToast({
                title: "请允许授权。",
                icon: "none",
                mask: true,
                duration: 2000
            })
        }
    },
    wxLogin: function() {
        console.log("已授权");
        wx.showNavigationBarLoading();
        wx.showLoading({
            title: "登录中...",
        });
        var that = this;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        wx.login({
            success: function(res) {
                wx.request({
                    url: "https://api.weixin.qq.com/sns/jscode2session",
                    data: {
                        appid: app.globalData.appid, //小程序的 appid 
                        secret: app.globalData.secret, //小程序的 secret
                        grant_type: "authorization_code",
                        js_code: res.code
                    },
                    success: function(openIdRes) {
                        console.log(openIdRes)
                        wx.getUserInfo({
                            success: function(userInfoRes) {
                                wx.request({
                                    url: util.apiURL + "/api/wxLogin" +
                                        "?openId=" + openIdRes.data.openid +
                                        "&headUrl=" + userInfoRes.userInfo.avatarUrl +
                                        "&sex=" + userInfoRes.userInfo.gender +
                                        "&nickname=" + userInfoRes.userInfo.nickName,
                                    method: "POST",
                                    success: function(loginRes) {
                                        wx.hideLoading();
                                        wx.hideNavigationBarLoading();
                                        if (loginRes.data.code == 0) {
                                            // console.log("登陆成功！");
                                            // console.log(loginRes)
                                            app.globalData.userId = loginRes.data.data.id;
                                            app.globalData.token = loginRes.data.data.token;
                                            wx.setStorageSync("userLoginSuccess", loginRes);
                                            wx.reLaunch({
                                                url: "/pages/home/home/home",
                                            });
                                        } else {
                                            console.error("/pages/wxLogin/wxLogin/wxLogin" + loginRes.data.msg);
                                        }
                                    },
                                    fail: function(loginRes) {
                                        wx.hideLoading();
                                        wx.hideNavigationBarLoading();
                                        wx.showToast({
                                            title: "",
                                        })
                                    }
                                });
                            },
                            fail(userInfoRes) {
                                wx.hideLoading();
                                wx.hideNavigationBarLoading();
                            }
                        });
                    },
                    fail(openIdRes) {
                        wx.hideLoading();
                        wx.hideNavigationBarLoading();
                        if (openIdRes.data.errcode == -1) {
                            wx.showToast({
                                title: "系统繁忙!",
                                icon: "none",
                                mask: true,
                                duration: 2000
                            });
                            return false;
                        }
                        wx.showToast({
                            title: "登录失败！",
                            icon: "none",
                            mask: true,
                            duration: 2000
                        });
                    }
                })
            },
            fail: function(res) {
                wx.hideLoading();
                wx.hideNavigationBarLoading();
                wx.showToast({
                    title: "登录失败！",
                    icon: "none",
                    mask: true,
                    duration: 2000
                });
            }
        })
    }
})