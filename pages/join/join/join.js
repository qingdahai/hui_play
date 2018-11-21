// pages/join/join.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        labelTag: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        var arr = ["zy_bg_min", "sports_bg_min", "jc_bg_min", "yd_bg_min", "ktv_bg_min", "ddj_bg_min", "qp_bg_min", "qt_bg_min"];
        if (app.labelTag.length == 0) {
            // 为加载数据重新加载
            wx.request({
                url: app.apiList.labelTag,
                success: function(res) {
                    // wx.showToast({
                    //     title: 'loading',
                    //     icon: 'loading',
                    //     duration: 500
                    // });
                    for (var i in res.data.data) {
                        res.data.data[i].src = arr[i]
                    }
                    that.setData({
                        labelTag: res.data.data
                    })
                }
            });
        } else {
            for (var i in app.labelTag) {
                app.labelTag[i].src = arr[i]
            }
            that.setData({
                labelTag: app.labelTag
            })
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
        // console.log(e.currentTarget.dataset.id)
        wx.navigateTo({
            url: "../joinShow/joinShow?id=" + e.currentTarget.dataset.id + "&labelName=" + e.currentTarget.dataset.labelname,
        })
    }
})