// pages/merchant/merchantSetMealAdd/merchantSetMealAdd.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isMerchant: true,
        showModal: true,
        mealLabel: "选择标签"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options.type == 1) {
            // 新商户需要填写套餐所属标签
            this.setData({
                isMerchant: false,
                labelList: app.globalData.merchantInfo.labelList
            })
        } else {
            // 旧商户添加
            this.setData({
                isMerchant: true,
                labelId: options.id
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
    // 输入监听
    // 套餐名称
    mealName: function(e) {
        // console.log(e.detail.value)
        this.setData({
            mealName: e.detail.value
        })
    },
    // 套餐价格
    mealPrice: function(e) {
        // console.log(e.detail.value)
        this.setData({
            mealPrice: e.detail.value
        })
    },
    // 最大用户数
    mealMaxPer: function(e) {
        // console.log(e.detail.value)
        this.setData({
            mealMaxPer: e.detail.value
        })
    },
    // 选择modal
    selectLabel: function() {
        this.setData({
            showModal: false
        })
        // 从所填喜好中获取选择列表
    },
    // modal里面选择按钮
    selectItem: function(e) {
        this.setData({
            selectID: e.currentTarget.dataset.id
        })
    },
    // modal取消按钮
    query_cancel: function(e) {
        this.setData({
            showModal: true
        });
    },
    // modal确定按钮
    query_ok: function(e) {
        // console.log(this.data.labelList)
        // console.log(this.data.selectID)
        for (var i in this.data.labelList) {
            if (this.data.labelList[i].id == this.data.selectID) {
                this.setData({
                    showModal: true,
                    mealLabel: this.data.labelList[i].name // 设置数据
                });
                break;
            }
        }
    },
    // 添加套餐按钮
    addMeal: function() {
        var that = this;
        if (that.data.isMerchant) {
            // console.log("旧商户增加套餐")
            // 商户需要上传套餐所属标签
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            if (that.data.mealName && that.data.mealPrice && that.data.mealMaxPer) {
                var data = {
                    labelId: that.data.labelId,
                    maxNum: that.data.mealMaxPer,
                    mealName: that.data.mealName,
                    price: that.data.mealPrice,
                    shopId: app.globalData.shopId
                }
                if (app.globalData.merchantInfo.shopMealList == null) {
                    app.globalData.merchantInfo.shopMealList = [];
                }
                app.globalData.merchantInfo.shopMealList.push(data);

                wx.request({
                    url: util.apiURL + "/api/shop/setMeal",
                    data: data,
                    method: "POST",
                    success: function(res) {
                        if (res.data.code == 0) {
                            wx.navigateBack({});
                            prevPage.setData({
                                isOldMerchantBack: true
                            })
                            prevPage.onLoad();
                        } else {
                            console.error(res.data.msg);
                        }
                    }
                });
            } else {
                wx.showToast({
                    title: "请填写完整",
                    icon: "none",
                    duration: 2000
                });
                return false
            }
        } else {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            var prevPrevPage = pages[pages.length - 3];
            // console.log("新商户增加套餐")
            if (that.data.mealName && that.data.mealPrice && that.data.selectID && that.data.mealMaxPer) {
                var obj = {
                    mealName: that.data.mealName,
                    price: that.data.mealPrice,
                    labelId: that.data.selectID,
                    maxNum: that.data.mealMaxPer,
                }
                if (app.globalData.merchantInfo.shopMealList == null) {
                    app.globalData.merchantInfo.shopMealList = [];
                }
                app.globalData.merchantInfo.shopMealList.push(obj);
                wx.navigateBack({});
                prevPage.setData({
                    isNewMerchantBack: true
                })
                prevPage.onLoad();
                prevPrevPage.onLoad();
            } else {
                wx.showToast({
                    title: "请填写完整",
                    icon: "none",
                    duration: 2000
                });
                return false
            }
        }
    }
})