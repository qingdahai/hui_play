// pages/searchInnings/searchInnings.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showHistory: true,
        historyDatas: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 读取历史记录缓存
        var inningsHistorySearch = wx.getStorageSync('inningsHistorySearch');
        if (inningsHistorySearch) {
            this.setData({
                showHistory: false,
                historyDatas: inningsHistorySearch.reverse()
            });
            // console.log(inningsHistorySearch)
        } else {
            this.setData({
                showHistory: true
            })
        }
        this.setData({
            distance: options.distance
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
    // 搜索框输入监听
    searchInput: function(e) {
        // console.log(e.detail.value)
        this.setData({
            searchValue: e.detail.value
        });
    },
    // 搜索按钮点击
    searchButton: function(e) {
        var searchContent = "";
        var that = this;
        if (that.data.searchValue == "" || that.data.searchValue == null) {
            if (e.currentTarget.dataset.val == undefined) {
                console.log("搜索内容不能为空!");
                return false;
            } else {
                searchContent = e.currentTarget.dataset.val;
            }
        } else {
            searchContent = that.data.searchValue;
        }
        var arr = [];
        // 读取缓存
        if (wx.getStorageSync('inningsHistorySearch')) {
            arr = wx.getStorageSync('inningsHistorySearch');
        }
        if (arr.length >= 4) {
            arr.shift();
        }
        arr.push(searchContent)
        // 存入缓存"
        wx.setStorageSync("inningsHistorySearch", arr);
        // 刷新页面数据
        that.setData({
            showHistory: false,
            historyDatas: arr.reverse()
        });
        // 发送请求成功跳转展示数据


        wx.showNavigationBarLoading();
        wx.showLoading({
            title: "加载中..."
        });
        wx.request({
            url: util.apiURL + "/api/gameRoom/getIndexGame",
            data: {
                pageNo: 1,
                pageSize: 10,
                lat: app.globalData.lat,
                lng: app.globalData.lng,
                distance: parseInt(that.data.distance),
                title: searchContent
            },
            success: function(res) {
                if (res.data.code == 0) {
                    console.log(res)
                    if (res.data.data.indexHot.length > 0) {
                        // 时间戳转换处理
                        // for (var i in res.data.data.indexHot) {
                        //     res.data.data.indexHot[i].startTime = util.time1970num(res.data.data.indexHot[i].startTime);
                        //     // console.log(util.time1970num(res.data.data.indexHot[i].startTime));
                        // }

                        // that.setData({
                        //     indexHot: res.data.data.indexHot
                        // })
                        // console.log(res.data.data.indexHot)
                        // wx.hideToast();
                        wx.navigateTo({
                            url: "../searchInningsResult/searchInningsResult?searchDatas=" + res.data.data,
                        });
                    } else {
                        wx.hideNavigationBarLoading();
                        wx.hideLoading();
                        wx.showToast({
                            title: "未匹配到组局",
                            icon: "none",
                            duration: 2000
                        })
                        return false;
                    }
                }
                wx.hideNavigationBarLoading();
                wx.hideLoading();
            },
            fail(res) {
                // console.log(res)
                wx.hideNavigationBarLoading();
                wx.hideLoading();
            },
            complete(res) {
                // console.log(res)
            }
        })
    },
    clearHistory: function() {
        this.setData({
            showHistory: true,
            historyDatas: ""
        });
        wx.setStorageSync("inningsHistorySearch", "");
    }
})