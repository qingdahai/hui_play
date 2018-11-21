// pages/merchantRegister/merchantRegisterHome/merchantRegisterHome.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectTimeShow: [0, 0]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        // 设置merchantInfo数据
        that.setData({
            merchantInfo: app.globalData.merchantInfo,
            selectTime: [util.dateTimeArr(), util.dateTimeArr()]
        });
        for (var key in that.data.merchantInfo) {
            if (that.data.merchantInfo[key] == null) {
                if (key == "shopName")
                    that.data.merchantInfo.shopName = "填写名称";
                if (key == "address")
                    that.data.merchantInfo.address = "填写地址";
                if (key == "phone")
                    that.data.merchantInfo.phone = "填写联系电话";
                if (key == "startTime")
                    that.data.merchantInfo.startTime = "选择营业时间";
                if (key == "email")
                    that.data.merchantInfo.email = "填写邮箱";
                if (key == "labelList")
                    that.data.merchantInfo.labelList = "选择标签";
                if (key == "linkman")
                    that.data.merchantInfo.linkman = "填写联系人";
                if (key == "collectMode")
                    that.data.merchantInfo.collectMode = "填写收款方式";
                if (key == "imageUrls")
                    that.data.merchantInfo.imageUrls = "添加照片（选填）";
            }
        }
        // 判断是否填写地址
        if (that.data.addressData) {
            that.data.merchantInfo.address = that.data.addressData;
            app.globalData.merchantInfo.address = that.data.addressData;
        }
        // 重设merchantInfo数据
        that.setData({
            merchantInfo: that.data.merchantInfo
        });
        // console.log(merchant)
        console.log(that.data.merchantInfo)
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
                    wx.showToast({
                        title: "正在上传...",
                        icon: "loading",
                        mask: true,
                        duration: 1000
                    })
                    // 直接上传 
                    app.globalData.merchantInfo.logo = resImg.tempFilePaths[0];
                    that.onLoad();
                    wx.hideToast();
                    // 去剪切页面（功能未完善）
                    // wx.navigateTo({
                    //     url: "../merchantDataModify/modifyLogo/modifyLogo?newMerchant=ok&imgurl=" + resImg.tempFilePaths[0],
                    // });
                }
            })
        }
    },
    // 修改商户名称
    merchantTitle: function() {
        wx.navigateTo({
            url: "../merchantDataModify/modifyOne/modifyOne?newMerchant=ok&type=shopName",
        });
    },
    // 修改商户地址
    merchantAddress: function() {
        // console.log("地址")
        wx.navigateTo({
            url: "../merchantDataModify/modifyAddress/modifyAddress?newMerchant=ok",
        });
    },
    // 修改商户联系电话
    merchantPhoneNumber: function() {
        wx.navigateTo({
            url: "../merchantDataModify/modifyOne/modifyOne?newMerchant=ok&type=phone",
        });
    },
    // 修改商户营业时间
    merchantTime: function() {
        console.log("营业时间");
    },
    // 修改商户营业时间选择器
    bindMultiPickerChange: function(e) {
        var that = this;
        var val_1 = that.data.selectTime[0][e.detail.value[0]];
        var val_2 = that.data.selectTime[1][e.detail.value[1]];
        console.log("选择的值为", val_1, val_2);
        that.data.merchantInfo.startTime = val_1;
        that.data.merchantInfo.endTime = val_2;
        // 修改全局数据，避免修改其它某些数据返回重载时显示不正确
        app.globalData.merchantInfo.startTime = val_1;
        app.globalData.merchantInfo.endTime = val_2;
        // 重设merchantInfo数据
        that.setData({
            selectTimeShow: [e.detail.value[0], e.detail.value[1]],
            merchantInfo: that.data.merchantInfo
        });
    },
    // 修改商户邮箱
    merchantEmail: function() {
        wx.navigateTo({
            url: "../merchantDataModify/modifyOne/modifyOne?newMerchant=ok&type=email",
        });
    },
    // 修改商户标签
    merchantLabel: function() {
        // console.log("标签");
        wx.navigateTo({
            url: "../merchantDataModify/modifyLabel/modifyLabel?newMerchant=ok",
        });
    },
    // 修改商户联系人
    merchantName: function() {
        wx.navigateTo({
            url: "../merchantDataModify/modifyOne/modifyOne?newMerchant=ok&type=linkman",
        });
    },
    // 修改商户简介
    merchantIntro: function() {
        // console.log("简介");
        wx.navigateTo({
            url: "../merchantDataModify/modifyIntro/modifyIntro?newMerchant=ok",
        });
    },
    // 修改商户套餐
    merchantMeal: function() {
        if (this.data.merchantInfo.labelList[0].id) {
            wx.navigateTo({
                url: "../merchantSetMealList/merchantSetMealList?newMerchant=ok",
            });
        } else {
            wx.showToast({
                title: "请先选择标签",
                icon: "none",
                duration: 2000
            });
        }
    },
    // 修改商户收款方式
    merchantMoneyStyle: function() {
        // console.log("收款方式");
        // 微信小程序支持微信支付，此功能没意义
        var that = this;
        wx.showActionSheet({
            itemList: ['微信支付'],
            itemColor: "#4b5bdb",
            success: function(res) {
                if (!res.cancel) {
                    // 重设merchantInfo数据
                    that.data.merchantInfo.collectMode = "微信支付";
                    that.setData({
                        merchantInfo: that.data.merchantInfo
                    });
                }
            }
        });
    },
    // 图片上传
    merchantImgs: function() {
        wx.navigateTo({
            url: "../merchantAlbum/merchantAlbum?newMerchant=ok",
        });
    },
    // 图片单击预览
    previewImg: function(e) {
        var that = this;
        var current = null;
        var index = e.currentTarget.dataset.index;
        wx.previewImage({
            current: that.data.merchantInfo.imageUrls[index],
            urls: that.data.merchantInfo.imageUrls
        });
    },
    // 点击注册
    merchantRegister: function() {
        var that = this;
        var registerData = that.data.merchantInfo;
        if (registerData.logo == null) {
            wx.showToast({
                title: "请上传商户LOGO",
                icon: "none",
                duration: 2000
            });
            return false
        }
        if (registerData.shopName == "填写名称") {
            wx.showToast({
                title: "请填写名称",
                icon: "none",
                duration: 2000
            });
            return false
        }
        if (registerData.address == "填写地址") {
            wx.showToast({
                title: "请填写地址",
                icon: "none",
                duration: 2000
            });
            return false
        }
        if (registerData.phone == "填写联系电话") {
            wx.showToast({
                title: "请填写联系电话",
                icon: "none",
                duration: 2000
            });
            return false
        }
        if (registerData.startTime == "选择营业时间") {
            wx.showToast({
                title: "请选择营业时间",
                icon: "none",
                duration: 2000
            });
            return false
        }
        if (registerData.email == "填写邮箱") {
            wx.showToast({
                title: "请填写邮箱",
                icon: "none",
                duration: 2000
            });
            return false
        }
        if (registerData.linkman == "填写联系人") {
            wx.showToast({
                title: "请填写联系人",
                icon: "none",
                duration: 2000
            });
            return false
        }
        if (registerData.shopInfo == null) {
            wx.showToast({
                title: "请填写简介",
                icon: "none",
                duration: 2000
            });
            return false
        }
        if (registerData.collectMode == "填写收款方式") {
            wx.showToast({
                title: "请填写收款方式",
                icon: "none",
                duration: 2000
            });
            return false
        }
        // 选择标签处理
        var labelList = [];
        for (var i in registerData.labelList) {
            if (!registerData.labelList[i].id) {
                wx.showToast({
                    title: "请选择标签",
                    icon: "none",
                    duration: 2000
                });
                return false
            }
            labelList.push(registerData.labelList[i].id)
        }
        registerData.labelList = labelList.join(",");
        //微信支付方式(固定值2)
        registerData.collectMode = 2;
        // 相册处理
        console.log(registerData.imageUrls)
        if (registerData.imageUrls) {
            registerData.imageUrls = registerData.imageUrls.join(",");
        }
        // console.log(registerData)
        // console.log(app.globalData.merchantInfo)
        wx.request({
            url: util.apiURL + "/api/shop/enter",
            method: "POST",
            data: registerData,
            success: function(res) {
                if (res.data.code == 0) {
                    wx.hideNavigationBarLoading();
                    wx.showToast({
                        title: res.data.msg,
                        icon: "none",
                        mask: true,
                        duration: 2000,
                    });
                    var back_timer = setTimeout(function() {
                        clearTimeout(back_timer);
                        wx.clearStorage();
                        wx.reLaunch({
                            url: "/pages/login/login/login?type=merchant",
                        });
                    }, 2000);
                } else {
                    console.log(res.data.msg);
                    wx.showToast({
                        title: res.data.msg,
                        icon: "none",
                        mask: true,
                        duration: 2000,
                    });
                }
            },
            fail: function(res) {
                console.log(res);
                wx.showToast({
                    title: "提交失败",
                    icon: "none",
                    mask: true,
                    duration: 2000,
                });
            }
        });
    }
});