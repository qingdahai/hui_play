// pages/modify/modifyPassword/modifyPassword.js
var util = require("../../../utils/util.js");
var md5 = require("../../../utils/md5.js");
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
        if (options.merchant) {
            this.setData({
                isMerchant: true
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
    // 忘记密码
    forgetPassword: function() {
        var url = null;
        if (this.data.isMerchant) {
            url = "../forgetPassword/forgetPassword?merchant=ok"
        } else {
            url = "../forgetPassword/forgetPassword"
        }
        wx.navigateTo({
            url
        })
    },
    // 输入框监听
    oldPasswd: function(e) {
        // console.log(e.detail.value)
        this.setData({
            oldpwd: e.detail.value
        });
    },
    newPasswd: function(e) {
        // console.log(e.detail.value)
        this.setData({
            newpwd: e.detail.value
        });
    },
    newPasswd2: function(e) {
        // console.log(e.detail.value)
        this.setData({
            newpwd2: e.detail.value
        });
    },
    // 修改密码
    modifyPassword: function() {
        var that = this;
        // var reg = /A-Za-z0-9/;
        if (that.data.newpwd == that.data.newpwd2) {
            // 发送修改密码请求
            // console.log(this.data.oldpwd)
            // console.log(this.data.newpwd)
            if (that.data.isMerchant) {
                // 商户
                wx.request({
                    url: util.apiURL + "/api/shop/updatePassword" +
                        "?shopId=" + wx.getStorageSync("merchantDatas").id +
                        "&oldPassword=" + md5.md5(that.data.oldpwd) +
                        "&newPassword=" + md5.md5(that.data.newpwd),
                    method: "PUT",
                    success: function(res) {
                        console.log(res)
                        if (res.data.code == 0) {
                            wx.showToast({
                                title: res.data.msg,
                                icon: "none",
                                duration: 2000,
                                mask: true,
                                success: function(res) {
                                    var timr = setTimeout(function() {
                                        clearTimeout(timr)
                                        wx.navigateBack({})
                                    }, 2000)
                                }
                            });
                        } else {
                            wx.showToast({
                                title: res.data.msg,
                                icon: "none",
                                duration: 2000
                            });
                        }
                    }
                })
            } else {
                wx.request({
                    url: util.apiURL + "/api/isLogin/userUpdatePassword" +
                        "?userId=" + app.globalData.userId +
                        "&oldPassword=" + that.data.oldpwd +
                        "&newPassword=" + that.data.newpwd,
                    header: {
                        token: app.globalData.token
                    },
                    method: "PUT",
                    success: function(res) {
                        if (res.data.code == 0) {
                            wx.showToast({
                                title: res.data.msg,
                                icon: "none",
                                duration: 2000,
                                success: function(res) {
                                    wx.navigateBack({})
                                }
                            });
                        } else {
                            wx.showToast({
                                title: res.data.msg,
                                icon: "none",
                                duration: 2000
                            });
                        }
                    }
                })
            }
        } else {
            console.log("两次密码不一致！");
        }
    },
})