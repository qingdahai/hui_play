// pages/modify/forgetPassword/forgetPassword.js
var util = require("../../../utils/util.js");
var app = getApp();
var timer = null; // 验证码倒计时 
var regPhone = /^\d{10,11}$/; // 手机号正则
var regVerifyCode = /^\d{6}$/; // 验证码正则
var regNewPwd = /./; // 密码正则
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showModal: true,
        oneMinute: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options.merchant) {
            console.log("商户")
            // 商户判断是否登陆
            if (wx.getStorageSync("merchantDatas") && wx.getStorageSync("merchantDatas") != "") {
                this.setData({
                    merchantInfo: wx.getStorageSync("merchantDatas")
                });
            }
            this.setData({
                isMerchant: true
            });
        } else {
            console.log("用户")
            // 用户判断是否登陆
            if (app.globalData.userId && app.globalData.userId != "") {
                this.setData({
                    userInfo: app.globalData.userInfo
                });
            }
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
        clearInterval(timer);
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
    // 输入框监听
    inputPhoneNumber: function(e) {
        console.log(e.detail.value)
        this.setData({
            phone: e.detail.value
        })
    },
    phoneVerifyCode: function(e) {
        // console.log(e.detail.value)
        this.setData({
            phoneVerifyCode: e.detail.value
        })
    },
    newPwd: function(e) {
        // console.log(e.detail.value)
        this.setData({
            newPwd: e.detail.value
        })
    },
    // 获取验证码
    getPhoneVerifyCode: function() {
        var that = this;
        if (this.data.oneMinute == 0) {
            if (!regPhone.test(that.data.phone)) {
                wx.showToast({
                    title: "注册手机号不合法！",
                    icon: "none",
                    duration: 2000,
                    mask: true,
                });
                return false
            }
            var user_type = null;
            var isLogin = false;
            if (that.data.isMerchant) {
                // 商户判断是否登陆
                if (wx.getStorageSync("merchantDatas") && wx.getStorageSync("merchantDatas") != "") {
                    user_type = that.data.merchantInfo;
                    isLogin = true;
                }
            } else {
                // 用户判断是否登陆
                if (app.globalData.userId && app.globalData.userId != "") {
                    user_type = that.data.userInfo;
                    isLogin = true;
                }
            }
            if (isLogin) {
                if (user_type.phone != that.data.phone) {
                    wx.showToast({
                        title: "请输入您注册的手机号！",
                        icon: "none",
                        duration: 2000,
                        mask: true,
                    });
                    return false
                }
            }
            if (that.data.phone) {
                // 发送请求获取验证码
                wx.request({
                    url: util.apiURL + "/api/verifyCode",
                    data: {
                        phone: that.data.phoneNumber,
                        type: 2
                    },
                    success: function(res) {
                        if (res.data.code == 0) {
                            console.log("获取验证码成功！")
                        } else {
                            console.log(res.data.msg)
                        }
                    }
                });
                var oneMinute = 60;
                that.setData({
                    oneMinute: oneMinute
                });
                timer = setInterval(function() {
                    oneMinute--;
                    that.setData({
                        oneMinute: oneMinute
                    });
                    if (oneMinute == 0) {
                        clearInterval(timer);
                    }
                    console.log(that.data.oneMinute)
                }, 1000)
            }
        }
    },
    // 修改密码
    forgetPassword: function() {
        var that = this;
        // 发送请求判断输入的验证码是否与后台一致
        // 输入的验证码和新密码同时发送

        // console.log(that.data.phoneVerifyCode)
        // console.log(that.data.newPwd)
        // console.log(that.data.phoneNumber)
        if (!regPhone.test(that.data.phone)) {
            wx.showToast({
                title: "注册手机号不合法！",
                icon: "none",
                duration: 2000,
                mask: true,
            });
            return false
        } else if (!regVerifyCode.test(that.data.phoneVerifyCode)) {
            wx.showToast({
                title: "验证码不合法！",
                icon: "none",
                duration: 2000,
                mask: true,
            });
            return false
        } else if (!regNewPwd.test(that.data.newPwd)) {
            wx.showToast({
                title: "新密码不合法！",
                icon: "none",
                duration: 2000,
                mask: true,
            });
            return false
        }
        // 判断商户
        var reqURL = null;
        if (that.data.isMerchant) {
            reqURL = "/api/shop/updatePassword"
        } else {
            reqURL = "/api/userForgetPassword"
        }
        wx.request({
            url: util.apiURL + reqURL +
                "?phone=" + that.data.phoneNumber +
                "&verifyCode=" + that.data.phoneVerifyCode +
                "&newPassword=" + that.data.newPwd,
            method: "PUT",
            success: function(res) {
                if (res.data.code == 0) {
                    that.setData({
                        showModal: false
                    });
                } else {
                    console.error(res.data.msg);
                    wx.showToast({
                        title: res.data.msg,
                        icon: "none",
                        duration: 2000,
                        mask: true
                    })
                }
            }
        });
    },
    goLogin: function() {
        if (that.data.isMerchant) {
            if (wx.getStorageSync("merchantDatas") && wx.getStorageSync("merchantDatas") != "") {
                this.setData({
                    showModalText: "修改成功，请重新登陆！"
                })
            } else {
                this.setData({
                    showModalText: "修改成功，去登陆！"
                })
            }
            wx.reLaunch({
                url: "../../login/login/login?type=merchant",
            });
        } else {
            if (app.globalData.userId && app.globalData.userId != "") {
                this.setData({
                    showModalText: "修改成功，请重新登陆！"
                })
            } else {
                this.setData({
                    showModalText: "修改成功，去登陆！"
                })
            }
            wx.reLaunch({
                url: "../../login/login/login",
            });
        }
    }
})