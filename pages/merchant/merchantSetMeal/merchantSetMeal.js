// pages/merchant/merchantSetMeal/merchantSetMeal.js
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
        var merchantDatas = wx.getStorageSync("merchantDatas");
        this.setData({
            labelList: merchantDatas.labelList.split(","),
            merchantInfo: merchantDatas
        });
        var labelTag = wx.getStorageSync("inningsLabelTag").data.data;
        var showLabel = [];
        for (var i in this.data.labelList) {
            for (var j in labelTag) {
                if (labelTag[j].id == this.data.labelList[i]) {
                    showLabel.push(labelTag[j]);
                }
            }
        }
        this.setData({
            showLabel: showLabel
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
    // 套餐列表
    merchantSetMealList: function(e) {
        wx.navigateTo({
            url: "../merchantSetMealList/merchantSetMealList?id=" + e.currentTarget.dataset.id,
        })
    },
})