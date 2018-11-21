// Pages/index/index.js
var util = require("../../../utils/util.js");
var app = getApp();
var timer = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        defaultKm: "5KM", // 选中的范围或默认范围
        kmData: ["5KM", "10KM", "50KM", "50KM以上"], //可选范围列表
        active: "", //用于范围选择样式开启
        selectKMShow: true, // 展示选择范围列表
        hideModal: true // 快速加入模态窗隐藏显示
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        // 所有labelTag添加字段isSelected为false，表示未选中状态。
        for (var i in app.labelTag) {
            app.labelTag[i].isSelected = false;
        }
        // 设置选择范围盒子自动高度
        that.setData({
            selectItemBoxHeight: 36 * that.data.kmData.length * 2,
            labelTag: app.labelTag
        });
        // 获取位置经纬度
        wx.getLocation({
            success: function(res) {
                that.setData({
                    lat: res.latitude,
                    lng: res.longitude,
                });
                // 获取组局
                that.getInningsList(parseInt(that.data.defaultKm));
            }
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
    // 搜索
    searchInnings: function() {
        wx.navigateTo({
            url: "/pages/search/searchInnings/searchInnings?distance=" + this.data.defaultKm,
        });
    },
    // 显示选择范围
    selectKMShow: function() {
        // 判断是否显示
        if (this.data.selectKMShow) {
            this.setData({
                active: "active",
                selectKMShow: false
            });
        } else {
            this.setData({
                active: "",
                selectKMShow: true
            });
        }
    },
    // 选择范围
    selectKM: function(e) {
        console.log(this.data.kmData[e.currentTarget.dataset.id]);
        var that = this;
        that.getInningsList(parseInt(that.data.kmData[e.currentTarget.dataset.id]));
        this.setData({
            active: "",
            selectKMShow: true,
            defaultKm: this.data.kmData[e.currentTarget.dataset.id]
        });
        clearInterval(timer);
    },
    // 获取组局列表并初始化展示
    getInningsList: function(distance) {
        var that = this;
        wx.showLoading({
            title: "加载中",
            mask: true
        });

        // 获取局列表
        wx.request({
            url: util.apiURL + "/api/gameRoom/getIndexGame",
            data: {
                pageNo: 1, //开始页
                pageSize: 10, //条数
                lat: that.data.lat,
                lng: that.data.lng,
                distance
            },
            success: function(res) {
                wx.hideLoading();
                app.request_api_success(res, function() {
                    //成功
                    console.log(res)
                    // 根据距离排序
                    res.data.data.indexHot.sort(function(a, b) {
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
                        for (var i in res.data.data.indexHot) {
                            // 判断组局时间是否在一天之内
                            if (res.data.data.indexHot[i].startTime > data_time && res.data.data.indexHot[i].startTime < data_time + 60 * 60 * 24 * 1000) {
                                countDownTime.push(util.getTime24(res.data.data.indexHot[i].startTime / 1000));
                            } else {
                                countDownTime.push(false);
                            }
                        }
                        that.setData({
                            countDownTime: countDownTime
                        });
                    }, 1000);
                    // 时间戳转日期
                    for (var i in res.data.data.indexHot) {
                        res.data.data.indexHot[i].startTime_zh = util.time1970num(res.data.data.indexHot[i].startTime);
                    }
                    // 设置展示数据
                    that.setData({
                        indexHot: res.data.data.indexHot
                    });
                }, true);
            },
            fail(res) {
                wx.hideLoading();
                wx.showToast({
                    title: '获取组局失败！',
                    icon: 'none',
                    duration: app.globalData.gShowTime
                });
                console.log(res)
            },
            complete(res) {
                // console.log(res)
            }
        });
    },

    // 组局详情
    inningsMsg: function(e) {
        // console.log(e)
        wx.navigateTo({
            url: "/pages/inning/inningMsg/inningMsg?id=" + e.currentTarget.dataset.id,
        });
    },
    // 下拉
    onPullDownRefresh() {
        wx.navigateTo({
            url: "../indexPulldown/indexPulldown?distance=" + this.data.defaultKm,
        });
    },
    // 多选
    selectItem: function(e) {
        var item = this.data.labelTag[e.currentTarget.dataset.index];
        item.isSelected = !item.isSelected;
        this.setData({
            labelTag: this.data.labelTag,
        });
    },
    // 模态框取消按钮
    myModalCancel: function() {
        this.setData({
            hideModal: true
        });
    },
    // 确定快速加入
    myModalOk: function() {
        var that = this;
        var selectedIdArr = [];
        for (var i in that.data.labelTag) {
            // 判断是否选中
            if (that.data.labelTag[i].isSelected) {
                selectedIdArr.push(that.data.labelTag[i].id)
            }
        }
        console.log(selectedIdArr)
        wx.request({
            url: util.apiURL + "/api/isLogin/userUpdate" +
                "?userId=" + app.globalData.userId +
                "&labelList=" + selectedIdArr.join(","),
            method: "PUT",
            header: {
                token: app.globalData.token
            },
            success: function(res) {
                app.request_api_success(res, function() {
                    app.globalData.userInfo.labelList = selectedIdArr.join(",");
                    that.fastJoin();
                })
            },
            fail(res) {
                wx.hideLoading();
                wx.showToast({
                    title: '喜好设置失败！',
                    icon: 'none',
                    duration: app.globalData.gShowTime
                });
                console.log(res)
            }
        });
    },
    // 快速加入
    fastJoin: function() {
        var that = this;
        console.log("快速加入！");
        // 判断登陆
        if (!app.globalData.userInfo.token) {
            wx.reLaunch({
                url: "/login/login/login",
            });
        }
        // 判断用户是否设置过喜好
        if (!app.globalData.userInfo.labelList || app.globalData.userInfo.labelList == "") {
            that.setData({
                hideModal: false
            });
        } else {
            wx.showLoading({
                title: "加载中...",
                mask: true
            });
            wx.request({
                url: util.apiURL + "/api/gameRoom/quickStart",
                data: {
                    userId: app.globalData.userId,
                    lat: that.data.lat,
                    lng: that.data.lng,
                },
                success: function(res) {
                    wx.hideLoading();
                    app.request_api_success(res, function() {
                        // 判断是否匹配到组局
                        if (res.data.data.gameRoomId) {
                            console.log(res)
                            // 找到局跳转
                            wx.navigateTo({
                                url: "/pages/inning/inningMsg/inningMsg?id=" + res.data.data.gameRoomId
                            });
                        } else {
                            // 没有找到对应的局
                            wx.showToast({
                                title: '未匹配到组局',
                                icon: 'none',
                                duration: app.globalData.gShowTime
                            });
                        }
                    });
                },
                fail(res) {
                    wx.hideLoading();
                    wx.showToast({
                        title: '加载失败！',
                        icon: 'none',
                        duration: app.globalData.gShowTime
                    });
                    console.log(res)
                }
            });
        }
    },
    onUnload: function(res) {
        clearInterval(timer);
    }
})