// pages/merchant/merchantData/merchantData.js
var util = require("../../../utils/util.js");
var uploadImage = require("../../../utils/uploadFile.js");
var app = getApp();
Page({
    data: {
        selectTimeShow: [0, 0]
    },
    onLoad: function(options) {
        var that = this;
        console.log(that.data)
        wx.showLoading({
            title: "加载中...",
            mask: true,
        });
        that.setData({
            selectTime: [util.dateTimeArr(), util.dateTimeArr()]
        });
        wx.request({
            url: util.apiURL + "/api/shop/shopInfo",
            data: {
                shopId: wx.getStorageSync("merchantLoginSuccess").data.data.id
            },
            success: function(res) {
                wx.hideLoading();
                if (res.data.code == 0) {
                    that.setData({
                        merchantInfo: res.data.data
                    });
                    that.showLabel();
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: "none",
                        mask: true,
                        duration: 2000
                    });
                }
            },
            fail: function(res) {
                wx.hideLoading();
                // 数据更新失败
                console.log("缓存信息!");
                that.setData({
                    merchantInfo: wx.getStorageSync("merchantLoginSuccess").data.data
                });
                that.showLabel();
            }
        });
    },
    // 头像修改
    // 选择上传方式
    chooseimage: function() {
        var that = this;
        wx.showActionSheet({
            itemList: ["从相册中选择", "拍照"],
            itemColor: "#4b5bdb",
            success: function(res) {
                if (!res.cancel) {
                    if (res.tapIndex == 0) {
                        that.chooseWxImage("album")
                    } else if (res.tapIndex == 1) {
                        that.chooseWxImage("camera")
                    }
                }
            }
        })
    },
    // 头像上传方法
    chooseWxImage: function(type) {
        if (this.data.albumsaccount >= 16) {
            this.setData({
                addbutton: true
            });
        } else {
            var that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ["original", "compressed"],
                sourceType: [type],
                success: function(resImg) {
                    // 直接上传
                    wx.showLoading({
                        title: "加载中...",
                        mask: true
                    })
                    var pages = getCurrentPages();
                    var prevPage = pages[pages.length - 2];
                    var nowTime = util.time1970num(new Date());
                    uploadImage(resImg.tempFilePaths[0], "wxapp/merchant/" + nowTime.split(" ")[0] + "/" + nowTime.split(" ")[1] + "/",
                        function(result) {
                            // 上传oss成功回调
                            wx.request({
                                url: util.apiURL + "/api/shop/updateInfo" +
                                    "?shopId=" + that.data.merchantInfo.id,
                                method: "PUT",
                                data: {
                                    logo: result
                                },
                                success: function(res) {
                                    if (res.data.code == 0) {
                                        that.onLoad();
                                        getCurrentPages()[getCurrentPages().length - 2].onLoad();
                                    } else {
                                        wx.showLoading();
                                        wx.showToast({
                                            title: res.data.msg,
                                            icon: "none",
                                            mask: true,
                                            duration: 2000
                                        });
                                        console.error(res.data.msg);
                                    }
                                },
                                fail: function(res) {
                                    wx.hideLoading();
                                    wx.showToast({
                                        title: "上传失败",
                                        icon: "none",
                                        mask: true,
                                        duration: 2000
                                    });
                                }
                            })
                        },
                        function(result) {
                            // 上传OSS失败回调
                            console.error(result);
                            wx.hideLoading();
                            wx.showToast({
                                title: "上传失败",
                                icon: "none",
                                mask: true,
                                duration: 2000
                            });
                        }
                    );
                    // 去剪切页面（功能未完善）
                    // wx.showToast({
                    //     title: "正在上传...",
                    //     mask: true,
                    //     duration: 1000
                    // });
                    // wx.navigateTo({
                    //     url: "../merchantDataModify/modifyLogo/modifyLogo?imgurl=" + resImg.tempFilePaths[0],
                    // });
                }
            })
        }
    },
    // 修改商户名称
    merchantTitle: function() {
        wx.navigateTo({
            url: "../merchantDataModify/modifyOne/modifyOne?type=shopName",
        });
    },
    // 修改商户地址
    merchantAddress: function() {
        // console.log("地址")
        wx.navigateTo({
            url: "../merchantDataModify/modifyAddress/modifyAddress",
        });
        // wx.navigateTo({
        //     url: "/pages/search/selectMapAddress/selectMapAddress",
        // });
    },
    // 修改商户联系电话
    merchantPhoneNumber: function() {
        wx.navigateTo({
            url: "../merchantDataModify/modifyOne/modifyOne?type=phone",
        });
    },
    // 显示营业时间处理
    showLabel: function() {
        var that = this;
        var labelTag = wx.getStorageSync("inningsLabelTag").data.data;
        var merchantLabelArr = that.data.merchantInfo.labelList.split(",");
        var merchantLabelArrShow = [];
        for (var i in merchantLabelArr) {
            for (var j in labelTag) {
                if (merchantLabelArr[i] == labelTag[j].id) {
                    merchantLabelArrShow.push(labelTag[j]);
                }
            }
        }
        that.setData({
            merchantLabelArrShow
        });
    },
    // 修改商户营业时间
    merchantTime: function(e) {
        var arr = []
        var timeArr = [this.data.merchantInfo.startTime, this.data.merchantInfo.endTime];
        for (var i in this.data.selectTime) {
            for (var j in this.data.selectTime[i]) {
                if (this.data.selectTime[i][j] == timeArr[i]) {
                    arr.push(j);
                }
            }
        }
        console.log(arr)
        this.setData({
            selectTimeShow: arr
        })
        // for (var i in this.data.selectTime[0]) {
        //     if (this.data.selectTime[0][i] == this.data.merchantInfo.startTime) {
        //         arr.push(i);
        //     }
        // }
        console.log(this.data.merchantInfo.startTime)
        console.log(this.data.merchantInfo.endTime)
    },
    // 修改商户营业时间确定
    bindMultiPickerChange: function(e) {
        var that = this;
        var val_1 = that.data.selectTime[0][e.detail.value[0]];
        var val_2 = that.data.selectTime[1][e.detail.value[1]];
        console.log("选择的值为", val_1, val_2)
        that.data.merchantInfo.startTime = val_1;
        that.data.merchantInfo.endTime = val_2;
        // 修改全局数据，避免修改其它某些数据返回重载时显示不正确
        wx.request({
            url: util.apiURL + "/api/shop/updateInfo" +
                "?shopId=" + that.data.merchantInfo.id,
            method: "PUT",
            data: {
                startTime: val_1,
                endTime: val_2
            },
            success: function(res) {
                if (res.data.code == 0) {
                    that.onLoad();
                } else {
                    wx.hideLoading();
                    wx.showToast({
                        title: res.data.msg,
                        icon: "none",
                        mask: true,
                        duration: 2000
                    });
                    console.error(res.data.msg);
                }
            },
            fail: function(res) {
                wx.hideLoading();
                wx.showToast({
                    title: "修改失败",
                    icon: "none",
                    mask: true,
                    duration: 2000
                });
            }
        });
    },
    // 修改商户邮箱
    merchantEmail: function() {
        wx.navigateTo({
            url: "../merchantDataModify/modifyOne/modifyOne?type=email",
        });
    },
    // 修改商户标签
    merchantLabel: function() {
        // console.log("标签");
        wx.navigateTo({
            url: "../merchantDataModify/modifyLabel/modifyLabel",
        });
    },
    // 修改商户联系人
    merchantName: function() {
        wx.navigateTo({
            url: "../merchantDataModify/modifyOne/modifyOne?type=linkman",
        });
    },
    // 修改商户简介
    merchantIntro: function() {
        // console.log("简介");
        wx.navigateTo({
            url: "../merchantDataModify/modifyIntro/modifyIntro",
        });
    },
    // 修改商户收款方式
    merchantMoney: function() {
        // console.log("收款方式");
        var that = this;
        wx.showActionSheet({
            itemList: ['微信支付'],
            itemColor: "#4b5bdb",
            success: function(res) {
                if (!res.cancel) {
                    that.onLoad();
                    // 微信小程序支持微信支付，此功能没意义
                    // 重设merchantInfo数据
                    // that.data.merchantInfo.collectMode = "微信支付";
                    // that.setData({
                    //     merchantInfo: that.data.merchantInfo
                    // });
                }
            }
        });
    },
});