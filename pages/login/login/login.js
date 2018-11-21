// pages/login/login.js
var util = require("../../../utils/util.js");
var md5 = require("../../../utils/md5.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeholder: "请输入手机号",
        loginType: "商户登录",
        userType: 0,
        forgetPasswordURL: "/pages/modify/forgetPassword/forgetPassword"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        wx.setNavigationBarTitle({
            title: "用户登录",
        });
        var userLoginSuccess = wx.getStorageSync("userLoginSuccess");
        var merchantLoginSuccess = wx.getStorageSync("merchantLoginSuccess");
        if (userLoginSuccess && userLoginSuccess.data.code == 0) {
            // 如果登录过 获取缓存数据直接登录？
            app.globalData.userId = userLoginSuccess.data.data.id;
            app.globalData.token = userLoginSuccess.data.data.token;
            that.getAppUserInfo();
            wx.reLaunch({
                url: "/pages/index/index/index",
            });
        } else if (merchantLoginSuccess && merchantLoginSuccess.data.code == 0) {
            app.globalData.shopId = merchantLoginSuccess.data.data.id;
            wx.reLaunch({
                url: "/pages/merchant/merchantHome/merchantHome"
            });
        }
        if (options.type == "merchant") {
            this.merchantLogin()
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
        wx.navigateTo({
            url: this.data.forgetPasswordURL,
        })
    },
    // 输入监听
    loginName: function(e) {
        this.setData({
            setLoginName: e.detail.value
        });
    },
    loginPwd: function(e) {
        this.setData({
            setLoginPwd: e.detail.value
        });
    },
    // 商家登录 && 普通用户切换
    merchantLogin: function(e) {
        if (this.data.userType == 0) {
            wx.setNavigationBarTitle({
                title: "商户登录",
            });
            this.setData({
                placeholder: "请输入后台分配的账号",
                hiddend: true,
                loginType: "用户登录",
                userType: 1,
                forgetPasswordURL: "/pages/modify/forgetPassword/forgetPassword?merchant=ok"
            })
        } else {
            wx.setNavigationBarTitle({
                title: "用户登录",
            });
            this.setData({
                placeholder: "请输入手机号",
                hiddend: false,
                loginType: "商户登录",
                userType: 0,
                forgetPasswordURL: "/pages/modify/forgetPassword/forgetPassword"
            })
        }
    },
    // 微信登录
    thirdLogin: function() {
        wx.navigateTo({
            url: "../wxLogin/wxLogin",
        })
    },
    // 去注册
    register: function() {
        wx.navigateTo({
            url: "/pages/register/register",
        })

    },
    // 登录
    login: function(e) {
        var that = this;
        if (!that.data.setLoginName) {
            var title = null;
            if (e.currentTarget.dataset.usertype == 1) {
                title = "请输入商户账号"
            } else {
                title = "手机号不能为空"
            }
            wx.showToast({
                title,
                icon: "none",
                duration: 2000
            });
            return false;
        } else if (!that.data.setLoginPwd) {
            wx.showToast({
                title: "密码不能为空",
                icon: "none",
                duration: 2000
            });
            return false;
        }
        wx.showLoading({
            title: "登录中...",
        })
        // console.log("普通用户登录")
        if (e.currentTarget.dataset.usertype == 0 && that.data.setLoginName) {
            // console.log("普通用户登录")
            // 手机号正则匹配????
            wx.request({
                url: util.apiURL + "/api/userLogin",
                data: {
                    phone: that.data.setLoginName,
                    password: that.data.setLoginPwd
                },
                success: function(res) {
                    wx.hideLoading();
                    if (res.data.code == 0) {
                        // 登录成功
                        // console.log(res)
                        wx.setStorageSync("userLoginSuccess", res);
                        app.globalData.userId = res.data.data.id;
                        app.globalData.token = res.data.data.token;
                        that.getAppUserInfo();
                        wx.reLaunch({
                            url: "/pages/index/index/index"
                        });
                    } else {
                        // 登录失败
                        console.error(res.data.msg);
                        wx.showToast({
                            title: res.data.msg,
                            icon: "none",
                            duration: 2000
                        });
                    }
                },
                fail: function(res) {
                    wx.hideLoading();
                    // 请求失败
                    console.error(res)
                    wx.getNetworkType({
                        success: function(res) {
                            console.log(res)
                            wx.showToast({
                                title: "登陆出错",
                                icon: "none",
                                duration: 2000
                            });
                        },
                    })
                }
            });
        }
        // console.log("商户登录")
        if (e.currentTarget.dataset.usertype == 1) {
            wx.request({
                url: util.apiURL + "/api/shop/login",
                data: {
                    phone: that.data.setLoginName,
                    password: md5.md5(that.data.setLoginPwd)
                },
                success: function(res) {
                    wx.hideLoading();
                    if (res.data.code == 0) {
                        // 登录成功
                        wx.setStorageSync("merchantLoginSuccess", res);
                        wx.reLaunch({
                            url: "/pages/merchant/merchantHome/merchantHome"
                        });
                    } else {
                        // 登录失败
                        console.error(res.data.msg);
                        wx.showToast({
                            title: res.data.msg,
                            icon: "none",
                            duration: 2000
                        });
                    }
                },
                fail: function(res) {
                    wx.hideLoading();
                    // 请求失败
                    console.error("/pages/login/login/login.js" + res)
                    wx.showToast({
                        title: "登陆失败",
                        icon: "none",
                        duration: 2000
                    });
                }
            });
        }
    },
    getAppUserInfo: function() {
        var that = this;
        if (app.globalData.userInfo) {
            that.setData({
                userInfo: app.globalData.userInfo
            });
            return false;
        }
        wx.showLoading({
            title: "登录中...",
        });
        wx.request({
            url: util.apiURL + "/api/isLogin/userInfo",
            header: {
                token: app.globalData.token
            },
            data: {
                userId: app.globalData.userId
            },
            success: function(res) {
                app.request_api_success(res, function() {
                    app.globalData.userInfo = res.data.data;
                });
            },
            fail: function(res) {
                console.error("/pages/login/login/login.js" + res);
            }
        });
    }

})