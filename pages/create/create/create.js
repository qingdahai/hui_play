// pages/create/create.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        labelTag: null,
        myModalHide: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.showLoading({
            title: "加载中..."
        });
        var that = this;
        var arr = ["zy_bg_min", "sports_bg_min", "jc_bg_min", "yd_bg_min", "ktv_bg_min", "ddj_bg_min", "qp_bg_min", "qt_bg_min"];
        if (app.labelTag.length == 0) {
            // 为加载数据重新加载
            wx.request({
                url: app.apiList.labelTag,
                success: function(res) {
                    wx.hideLoading();
                    app.request_api_success(res, function() {
                        for (var i in res.data.data) {
                            res.data.data[i].src = arr[i]
                        }
                        that.setData({
                            labelTag: res.data.data
                        });
                    });
                }
            });
        } else {
            wx.hideLoading();
            for (var i in app.labelTag) {
                app.labelTag[i].src = arr[i]
            }
            that.setData({
                labelTag: app.labelTag
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
    // 选择入局 
    inning: function(e) {
        if (e.currentTarget.dataset.id == this.data.labelTag.length) {
            this.setData({
                myModalHide: false,
                selectId: e.currentTarget.dataset.id
            });
        } else {
            wx.navigateTo({
                url: "../selectClassify/selectClassify?id=" + e.currentTarget.dataset.id
            });
        }
    },
    // modal确定
    myModalOk: function(e) {
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
        // 撤销隐藏textarea
        that.setData({
            myModalHide: true
        });
        var createInningsData = {
            classifyId: 0,
            classifyName: that.data.inputVal,
            labelId: that.data.selectId,
            labelName: app.labelTag[app.labelTag.length - 1].name
        }
        wx.setStorageSync("createInningsData", createInningsData);
        wx.navigateTo({
            url: "../goCreate/goCreate"
        });
    },
    // modal取消
    myModalCancel: function() {
        // 撤销隐藏textarea
        console.log(63)
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
    }
})