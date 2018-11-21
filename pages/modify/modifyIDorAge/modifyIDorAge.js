// pages/personalData/personalData.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: null,
        inputval: "",
        settype: "",
        maxlength: 999999
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // console.log(options.type)


        if (options.type == "id") {
            wx.setNavigationBarTitle({
                title: "设置ID",
            });

            // console.log(app.globalData.userInfo)
            this.setData({
                userInfo: app.globalData.userInfo,
                inputval: app.globalData.userInfo.nickname,
                settype: options.type,
                maxlength: 50
            });
        }
        if (options.type == "age") {
            wx.setNavigationBarTitle({
                title: "设置年龄",
            });
            this.setData({
                userInfo: app.globalData.userInfo,
                inputval: app.globalData.userInfo.age,
                settype: options.type,
                maxlength: 3
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
        wx.showNavigationBarLoading();
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        var prevPrevPage = pages[pages.length - 3];
        if (e.currentTarget.dataset.settype == "id") {
            wx.request({
                url: util.apiURL + "/api/isLogin/userUpdate" + "?userId=" + app.globalData.userId + "&nickname=" + e.currentTarget.dataset.value,
                method: "PUT",
                header: {
                    token: app.globalData.token
                },
                success: function(res) {
                    app.globalData.userInfo.nickname = res.data.data.nickname;
                    prevPage.onLoad();
                    prevPrevPage.onLoad();
                    wx.navigateBack({});
                    wx.hideNavigationBarLoading();
                }
            });
        }
        if (e.currentTarget.dataset.settype == "age") {

        }

        // 上传新ID
        // wx.request({
        //     url: "",
        //     data: {
        //         username: e.currentTarget.dataset.value
        //     },
        //     method: 'GET',
        //     header: {
        //         'content-type': 'application/json' // 默认值
        //     },
        //     success: function(res) {
        //         console.log("上传成功！");
        //         wx.navigateBack({
        //             delta: 1
        //         });
        //         prevPage.onLoad();
        //     },
        //     fail: function(res) {
        //         console.log("上传错误！");
        //     }
        // });
    }
})