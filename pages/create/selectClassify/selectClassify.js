// pages/create/selectClassify/selectClassify.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        myModalHide: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.showLoading({
            title: "加载中...",
            mask: true
        });
        var that = this;
        that.setData({
            labelId: options.id
        });
        for (var i in app.labelTag) {
            if (app.labelTag[i].id == that.data.labelId) {
                that.setData({
                    labelName: app.labelTag[i].name
                });
                wx.setNavigationBarTitle({
                    title: app.labelTag[i].name,
                });
                break;
            }
        }
        wx.request({
            url: util.apiURL + "/api/classify",
            data: {
                labelId: that.data.labelId
            },
            success: function(res) {
                wx.hideLoading();
                app.request_api_success(res, function() {
                    that.setData({
                        classify: res.data.data
                    });
                });
            },
            fail: function(res) {
                wx.hideLoading();
                wx.showToast({
                    title: "获取二级菜单失败！",
                    icon: "none",
                    mask: true,
                    duration: app.globalData.gShowTime
                });
            }
        })
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
    // 选择二级菜单
    selectClassify: function(e) {
        var that = this;
        if (e.currentTarget.dataset.classifyid) {
            var createInningsData = {
                classifyId: e.currentTarget.dataset.classifyid,
                classifyName: e.currentTarget.dataset.classifyname,
                labelId: that.data.labelId,
                labelName: that.data.labelName
            }
            wx.setStorageSync("createInningsData", createInningsData);
            wx.navigateTo({
                url: "../goCreate/goCreate"
            });
        } else {
            // 自定义
            this.setData({
                myModalHide: false
            });
        }
    },
    // modal取消
    myModalCancel: function() {
        // 撤销隐藏textarea
        this.setData({
            myModalHide: true,
            inputVal: ""
        });
    },
    // 输入框监听
    inputVal: function(e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    // 自定义确认按钮
    addClassify: function(e) {
        var that = this;
        if (!that.data.inputVal || that.data.inputVal == "") {
            wx.showToast({
                title: "不能为空",
                icon: "none",
                mask: true,
                duration: app.globalData.gShowTime
            });
            return false
        }
        that.setData({
            myModalHide: true
        });
        var createInningsData = {
            classifyId: e.currentTarget.dataset.classifyid,
            classifyName: that.data.inputVal,
            labelId: that.data.labelId,
            labelName: that.data.labelName
        }
        wx.setStorageSync("createInningsData", createInningsData);
        that.setData({
            inputVal: ""
        });
        wx.navigateTo({
            url: "../goCreate/goCreate"
        });
        // wx.navigateTo({
        //     url: "../goCreate/goCreate?type=" + that.data.labelId + "&option=" + that.data.inputVal
        // });
    }
})