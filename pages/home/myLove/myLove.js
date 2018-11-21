// pages/myLove/myLove.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selected: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        var labelTag = app.labelTag;
        if (labelTag.length == 8) {
            labelTag.pop();
        }
        if (app.globalData.userInfo.labelList) {
            var myLabel = app.globalData.userInfo.labelList.split(",");
            // 先清空之前的active
            for (var j in app.labelTag) {
                labelTag[j].active = "";
            }
            for (var i in myLabel) {
                for (var j in app.labelTag) {
                    if (labelTag[j].id == myLabel[i]) {
                        labelTag[j].active = "active";
                    }
                }
            }
        }
        that.setData({
            list: labelTag
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

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
    // 选择喜好
    selected: function(e) {
        for (var i in this.data.list) {
            if (this.data.list[i].id == e.currentTarget.dataset.id) {
                if (this.data.list[i].active == "active") {
                    this.data.list[i].active = ""
                } else {
                    this.data.list[i].active = "active";
                }
            }
        }
        this.setData({
            list: this.data.list
        });
    },
    // 确定喜好
    clickon: function() {
        var that = this;
        var arr = [];
        for (var i in that.data.list) {
            if (that.data.list[i].active) {
                arr.push(that.data.list[i].id);
            }
        }
        if (arr.length == 0) {
            wx.showToast({
                title: "请选择标签",
                icon: "none",
                duration: app.globalData.gShowTime
            });
            return false;
        }
        wx.request({
            url: util.apiURL + "/api/isLogin/userUpdate" +
                "?userId=" + app.globalData.userId +
                "&labelList=" + arr.join(","),
            header: {
                token: app.globalData.token
            },
            method: "PUT",
            success: function (res) {
                wx.hideLoading();
                app.request_api_success(res, function() {
                    app.globalData.userInfo.labelList = arr.join(",");
                    wx.navigateBack({});
                });
            },
            fail: function(res) {
                wx.hideLoading();
                wx.showToast({
                    title: "喜好设置失败！",
                    icon: "none",
                    mask: true,
                    duration: app.globalData.gShowTime
                });
            }
        })
    }
})