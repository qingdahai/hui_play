// pages/inningsExit/inningsExit.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        disabled: true,
        textareaHide: false,
        myModalHide: true,
        selectOptions: ["临时有安排去不了", "个人事务", "身体不适", "太贵了", "其他"]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            gameRoomId: options.id
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
    // 单击选中
    selected: function(e) {
        // console.log(e.currentTarget.dataset.index)
        this.setData({
            currentTab: e.currentTarget.dataset.index,
            currentTabImg: e.currentTarget.dataset.index,
            disabled: true,
            // selectedNum: e.currentTarget.dataset.index
        });
        if (this.data.selectOptions.length - 1 == e.currentTarget.dataset.index) {
            this.setData({
                disabled: false
            });
        }
    },
    // 输入监听
    inputVal: function(e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    // 提交
    query_ok: function() {
        // 隐藏textarea，原因：在安卓上弹出自定义模态框会显示textarea中的值
        this.setData({
            textareaHide: true,
            myModalHide: false
        });
    },
    // 阅读modal提示内容确定
    myModalOk: function() {
        var that = this;
        wx.request({
            url: util.apiURL + "/api/gameRoom/isOut",
            data: {
                userId: app.globalData.userId,
                gameRoomId: that.data.gameRoomId
            },
            success: function(res) {
                app.request_api_success(res, function() {
                    //0没有支付的局,1退还全部 2退还50% 3不退
                    // if (res.data.data.state == 0) {

                    // } else if (res.data.data.state == 1) {

                    // } else if (res.data.data.state == 2) {

                    // } else if (res.data.data.state == 3) {

                    // } else {
                    //     console.error("err");
                    //     // return false;
                    // }
                    wx.request({
                        url: util.apiURL + "/api/gameRoom/out",
                        data: {
                            userId: app.globalData.userId,
                            gameRoomId: that.data.gameRoomId,
                            describe: that.data.inputVal,
                            cause: that.data.selectOptions[that.data.currentTab],
                        },
                        method: "POST",
                        success: function(outRes) {
                            app.request_api_success(outRes, function() {
                                wx.showToast({
                                    title: outRes.data.msg,
                                    icon: "none",
                                    mask: true,
                                    duration: app.globalData.gShowTime
                                })
                                var back_timer = setTimeout(function() {
                                    clearTimeout(back_timer);
                                    wx.navigateTo({
                                        url: "../inningOver/inningOver",
                                    });
                                }, app.globalData.gShowTime);
                            })
                        },
                        fail(outRes) {
                            wx.hideLoading();
                            wx.showToast({
                                title: '退出失败！',
                                icon: 'none',
                                duration: app.globalData.gShowTime
                            });
                            console.log(outRes)
                        }
                    });
                });
            },
            fail(res) {
                wx.hideLoading();
                wx.showToast({
                    title: '退出失败！',
                    icon: 'none',
                    duration: app.globalData.gShowTime
                });
                console.log(res)
            }
        });
        // 撤销隐藏textarea
        this.setData({
            textareaHide: false,
            myModalHide: true
        });
    },
    // 阅读modal提示内容取消
    myModalCancel: function() {
        // 撤销隐藏textarea
        this.setData({
            textareaHide: false,
            myModalHide: true
        });

    }
})