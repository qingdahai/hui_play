// pages/create/setPeopleNum/setPeopleNum.js
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
    onLoad: function (options) {
        console.log(options)
        if (options.maxNum != 0) {
            this.setData({
                maxNum: options.maxNum,
                minNum: options.minNum
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 设置人数
    minNum: function (e) {
        // var pages = getCurrentPages();
        // var prevPage = pages[pages.length - 2];
        // prevPage.setData({
        //     minNum: e.detail.value
        // });
        // prevPage.onLoad();
        this.setData({
            minNum: e.detail.value
        });
    },
    // 最大人数
    maxNum: function (e) {
        // var pages = getCurrentPages();
        // var prevPage = pages[pages.length - 2];
        // prevPage.setData({
        //     maxNum: e.detail.value
        // });
        // prevPage.onLoad();
        this.setData({
            maxNum: e.detail.value
        });
    },
    query_ok: function () {
        var that = this;
        console.log(that.data)
        if (!that.data.minNum || that.data.minNum == "") {
            wx.showToast({
                title: "请输入成局人数",
                icon: "none",
                duration: app.globalData.gShowTime
            })
            return false
        }
        if (!that.data.maxNum || that.data.maxNum == "") {
            wx.showToast({
                title: "请输入最多人数",
                icon: "none",
                duration: app.globalData.gShowTime
            })
            return false
        }
        if (parseInt(that.data.maxNum) < parseInt(that.data.minNum)) {
            wx.showToast({
                title: "成局人数不能大于最多人数",
                icon: "none",
                duration: app.globalData.gShowTime
            });
            return false
        }
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.setData({
            minNum: that.data.minNum,
            maxNum: that.data.maxNum
        });
        prevPage.onLoad();
        wx.navigateBack({});
    }
})