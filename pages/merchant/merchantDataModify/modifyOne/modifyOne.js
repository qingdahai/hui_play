// pages/merchant/merchantDataModify/modifyOne/modifyOne.js
var util = require("../../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageType: ["shopName", "phone", "email", "linkman"],
        pageTitle: ["设置名字", "设置联系电话", "设置邮箱", "联系人"],
        maxlengthArr: [10,11,30,10]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // console.log(options)
        var that = this;
        that.setData({
            merchantInfo: wx.getStorageSync("merchantDatas"),
            setType: options.type,
        });
        // 用for避免重复调用
        for (var i in that.data.pageType) {
            if (that.data.pageType[i] == that.data.setType) {
                that.setNavTitle(that.data.pageType[i], that.data.pageTitle[i]);
                that.setData({
                    maxlength: that.data.maxlengthArr[i]
                });
                break;
            }
        }

        if (options.newMerchant) {
            // 新商户
            // console.log("新商户")
            that.resetinput();
            that.setData({
                isnewMerchant: true
            });
        } else {
            // 旧商户修改
            // console.log("旧商户修改");
            // 用for避免重复调用
            for (var i in that.data.pageType) {
                if (that.data.pageType[i] == that.data.setType) {
                    that.setInputval(that.data.pageType[i]);
                    break;
                }
            }
        }
    },
    // 清空按钮
    resetinput: function() {
        this.setData({
            inputval: ""
        });
    },
    // 监听input数据
    inputval: function(e) {
        this.setData({
            inputval: e.detail.value
        });
    },
    // 确认修改按钮
    modify: function(e) {
        var that = this;
        var newVal = e.currentTarget.dataset.value;
        if (newVal == "" || newVal == null) {
            wx.showToast({
                title: "不能为空！",
                icon: "none",
                duration: 2000
            })
            return false;
        }
        // 用for避免重复调用
        for (var i in that.data.pageType) {
            if (that.data.pageType[i] == that.data.setType) {
                that.modifyFn(that.data.pageType[i], newVal);
                break;
            }
        }
    },
    //设置nav标题
    setNavTitle: function(if_name, set_name) {
        var that = this;
        if (that.data.setType == if_name) {
            wx.setNavigationBarTitle({
                title: set_name
            });
        }
    },
    // 旧商户进入设置input数据
    setInputval: function(val) {
        var that = this;
        if (that.data.setType == val) {
            that.setData({
                inputval: that.data.merchantInfo[val]
            });
        }
    },
    // 修改函数
    modifyFn: function(modifyObj, newVal) {
        wx.showLoading({
            title: "加载中...",
        });
        var that = this;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        var prevPrevPage = pages[pages.length - 3];
        // 判断是新入驻商户还是旧商户
        if (that.data.isnewMerchant) {
            // console.log("新商户的名字shopName：", newVal);
            // 新商户设置全局数据
            app.globalData.merchantInfo[modifyObj] = newVal;
            wx.hideLoading();
            wx.navigateBack({});
            prevPage.onLoad();
        } else {
            // console.log("旧商户新的名字shopName：", newVal;
            wx.request({
                url: util.apiURL + "/api/shop/updateInfo" +
                    "?shopId=" + that.data.merchantInfo.id,
                method: "PUT",
                data: {
                    [modifyObj]: newVal
                },
                success: function(res) {
                    wx.hideLoading();
                    if (res.data.code == 0) {
                        // console.log(res)
                        prevPage.onLoad();
                        // 确保商户点返回时商户名称已更改
                        prevPrevPage.onLoad();
                        wx.navigateBack({});
                    } else {
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
                    })
                }
            })
        }
    }
});