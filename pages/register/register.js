// pages/register/register.js
// pages/modify/forgetPassword/forgetPassword.js
var util = require("../../utils/util.js");
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
        oneMinute: 0,
        showModal: true
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
        clearTimeout(timer);
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
        // console.log(e.detail.value)
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
        if (this.data.oneMinute == 0) {
            var that = this;
            if (!regPhone.test(that.data.phone)) {
                wx.showToast({
                    title: "请输入注册手机号！",
                    icon: "none",
                    duration: 2000,
                    mask: true,
                });
                return false
            }
            // 发送请求获取验证码
            wx.request({
                url: util.apiURL + "/api/verifyCode",
                data: {
                    phone: that.data.phone
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
        } else {
            console.log("倒计时未结束！")
        }
    },
    // 注册按钮
    query_ok: function() {
        var that = this;
        if (!regPhone.test(that.data.phone)) {
            wx.showToast({
                title: "手机号不合法！",
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
                title: "密码不合法！",
                icon: "none",
                duration: 2000,
                mask: true,
            });
            return false
        }
        wx.showNavigationBarLoading();
        // 输入的验证码和新密码同时发送
        // console.log(this.data.phoneVerifyCode)
        // console.log(this.data.newPwd)
        // console.log(this.data.phone)
        wx.request({
            url: util.apiURL + "/api/register" +
                "?phone=" + this.data.phone +
                "&verifyCode=" + this.data.phoneVerifyCode +
                "&password=" + this.data.newPwd,
            method: "POST",
            success: function(res) {
                if (res.data.code == 0) {
                    wx.hideNavigationBarLoading();
                    wx.hideToast();
                    console.log("注册成功", res.data)
                    that.setData({
                        showModal: false,
                        showModalText: "注册成功"
                    })
                } else {
                    console.error(res.data.msg)
                    wx.showToast({
                        title: res.data.msg,
                        icon: "none",
                        duration: 2000,
                        mask: true
                    })
                }
            }
        })

        // 注册成功跳转至登陆
        // wx.navigateTo({
        //     url: "/pages/login/login",
        // })
    },
    // 注册成功
    goLogin: function() {
        wx.reLaunch({
            url: "../login/login/login",
        })
    }
})