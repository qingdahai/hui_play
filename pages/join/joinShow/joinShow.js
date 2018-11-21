// pages/joinShow/joinShow.js
var util = require("../../../utils/util.js");
var app = getApp();
var timer = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        labelTag: null,
        currentTab: 0, //预设当前项的值
        scrollLeft: 0, //tab标题的滚动条位置
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        wx.showLoading({
            title: "加载中...",
            mask: true
        });
        that.setData({
            labelId: options.id
        })
        wx.request({
            url: util.apiURL + "/api/classify",
            data: {
                labelId: that.data.labelId
            },
            success: function(classifyRes) {
                if (classifyRes.data.code == 0) {
                    console.log(classifyRes.data.data);

                    that.setData({
                        classify: classifyRes.data.data
                    });
                    wx.request({
                        url: util.apiURL + "/api/gameRoom/gameRoomList" +
                            "?labelId=" + that.data.labelId,
                        data: {
                            pageNo: 1,
                            pageSize: 10,
                            lat: app.globalData.lat,
                            lng: app.globalData.lng,
                        },
                        success: function(res) {
                            wx.hideLoading();
                            console.log(res)
                            // 根据距离排序
                            res.data.data.sort(function(a, b) {
                                return a.distance - b.distance
                            });
                            // 当前时间时间戳
                            var data_time = new Date().getTime();
                            that.setData({
                                data_time
                            });
                            // 定时器
                            timer = setInterval(function() {
                                var countDownTime = []; //展示的时间
                                for (var i in res.data.data) {
                                    // 判断组局时间是否在一天之内
                                    if (res.data.data[i].startTime > data_time && res.data.data[i].startTime < data_time + 60 * 60 * 24 * 1000) {
                                        countDownTime.push(util.getTime24(res.data.data[i].startTime / 1000));
                                    } else {
                                        countDownTime.push(false);
                                    }
                                }
                                that.setData({
                                    countDownTime: countDownTime
                                });
                            }, 1000);

                            // 时间戳转日期
                            for (var i in res.data.data) {
                                res.data.data[i].startTime_zh = util.time1970num(res.data.data[i].startTime);
                            }

                            that.setData({
                                inningsAll: res.data.data
                            });
                        },
                        fail: function(res) {
                            wx.hideLoading();
                            wx.showToast({
                                title: "获取失败！",
                                icon: "none",
                                mask: true,
                                duration: 2000
                            });
                        }
                    })
                } else {
                    wx.hideLoading();
                    wx.showToast({
                        title: classifyRes.data.msg,
                        icon: "none",
                        mask: true,
                        duration: 2000
                    });
                    console.log(classifyRes)
                }
            },
            fail: function(classifyRes) {
                wx.hideLoading();
                console.log(classifyRes)
                wx.showToast({
                    title: "获取失败！",
                    icon: "none",
                    mask: true,
                    duration: 2000
                });
            }
        })

        //  高度自适应
        wx.getSystemInfo({
            success: function(res) {
                var clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR - 88;
                that.setData({
                    winHeight: calc
                });
            }
        });
        that.setData({
            labelTag: app.labelTag
        });
        // // 切换到上一页指定位置
        // if (options.asdasdid == 0) {
        // wx.setNavigationBarTitle({
        //     title: "全部",
        // });
        // }
        console.log(options)
        wx.setNavigationBarTitle({
            title: options.labelName,
        });
        // for (var i in that.data.labelTag) {
        //     if (that.data.labelTag[i].id == options.asdasdid) {
        //         wx.setNavigationBarTitle({
        //             title: that.data.labelTag[i].name
        //         });
        //         that.setData({
        //             currentTab: options.asdasdid
        //         })
        //     }
        // }
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
    // 滚动切换标签样式
    switchTab: function(e) {
        var that = this;
        // var currentTab = that.data.currentTab;
        // if (e.detail && e.detail.current == 0) {
        //     wx.setNavigationBarTitle({
        //         title: "全部",
        //     });
        //     console.log(4)
        //     currentTab = e.detail.current;
        // } else {
        //     console.log(4)
        //     currentTab = e;
        // }
        if (e.detail) {
            var currentTab = e.detail.current;
        } else {
            var currentTab = e;
        }
        // for (var i in that.data.labelTag) {
        //     if (that.data.labelTag[i].id == currentTab) {
        //         console.log(that.data.labelTag[i].name)
        //         wx.setNavigationBarTitle({
        //             title: that.data.labelTag[i].name,
        //         });
        //         break;
        //     }
        // }
        that.setData({
            currentTab: currentTab,
            innings: ""
        });
        that.checkCor();
        that.getInnings(currentTab);
    },
    // 点击标题切换当前页时改变样式
    swichNav: function(e) {
        var that = this;
        // 如果点击当前不进行重加载
        if (that.data.currentTab == e.target.dataset.current) {
            return false;
        }
        that.switchTab(e.currentTarget.dataset.current);
    },
    // 点击菜单条或滚动页面获取组局
    getInnings: function(index) {
        var that = this;
        var data = {
            pageNo: 1,
            pageSize: 10,
            lat: app.globalData.lat,
            lng: app.globalData.lng,
        }
        if (index != 0) {
            data.classifyId = that.data.classify[index - 1].id
        }

        wx.showLoading({
            title: "加载中...",
        });
        wx.request({
            url: util.apiURL + "/api/gameRoom/gameRoomList" +
                "?labelId=" + that.data.labelId,
            data,
            success: function(res) {
                console.log(res)
                that.setData({
                    innings: res.data.data
                });
                wx.hideLoading();
            }
        })
    },
    //判断当前滚动超过一屏时，设置tab标题滚动条。
    checkCor: function() {
        if (this.data.currentTab > 4) {
            this.setData({
                scrollLeft: 300
            })
        } else {
            this.setData({
                scrollLeft: 0
            })
        }
    },
    // 点击
    inningMsg: function(e) {
        console.log(e)
        wx.navigateTo({
            url: "/pages/inning/inningMsg/inningMsg?id=" + e.currentTarget.dataset.id,
        });
    }
})