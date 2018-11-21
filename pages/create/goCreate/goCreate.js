// pages/goCreate/goCreate.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inningTime: "去选择",
        selectTimeShow: [0, 0, 0],
        minNum: 0,
        maxNum: 0,
        inningPeopleNumShow: "去选择",
        placeName: "去选择",
        hideSelectedMeal: true,
        uploadTime: [],
        isUserInputAddress: false //用于判断是否是用户自定义地址
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        that.setData({
            selectTime: [
                [], util.dateTimeArr(), util.dateTimeArr()
            ]
        });
        var createInningsData = wx.getStorageSync("createInningsData");
        var createInningsData_shopInfo = wx.getStorageSync("createInningsData_shopInfo");
        if (createInningsData.classifyId) {
            that.setData({
                classifyId: createInningsData.classifyId,
            })
        }
        that.setData({
            classifyName: createInningsData.classifyName,
            labelId: createInningsData.labelId,
            labelName: createInningsData.labelName,
            shopInfo: createInningsData_shopInfo,
        })
        var numShow = null;
        that.data.selectTime[0].push("今天");
        that.data.uploadTime.push(util.time1970num(new Date().getTime() / 1000 * 1000));
        for (var i = 1; i < 30; i++) {
            that.data.uploadTime.push(util.time1970num(new Date().getTime() / 1000 * 1000 + i * 24 * 60 * 60 * 1000));
            that.data.selectTime[0].push(util.time1970(new Date().getTime() / 1000 * 1000 + i * 24 * 60 * 60 * 1000));
        }
        if (that.data.maxNum == 0 || that.data.minNum == 0) {
            numShow = "去选择"
        } else {
            numShow = "最少" + that.data.minNum + "人，最多" + that.data.maxNum + "人"
        }
        that.setData({
            selectTime: that.data.selectTime,
            numShow: numShow
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
    onUnload: function() {},

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
    // 局标题
    inningTitle: function(e) {
        this.setData({
            title: e.detail.value
        })
    },
    // 活动介绍
    inningInfo: function(e) {
        this.setData({
            info: e.detail.value
        })
    },
    // 时间选择
    bindMultiPickerChange: function(e) {
        var val_1 = null,
            showDate = null,
            that = this;
        if (that.data.selectTime[0][e.detail.value[0]] == "今天") {
            val_1 = util.time1970(new Date().getTime() / 1000 * 1000);
            showDate = "今天";
        } else {
            val_1 = that.data.selectTime[0][e.detail.value[0]];
            showDate = val_1.split(" ")[0];
        }
        var val_2 = that.data.selectTime[1][e.detail.value[1]];
        var val_3 = that.data.selectTime[2][e.detail.value[2]];
        var arr_1 = val_1.split(" ");
        that.setData({
            selectTimeShow: [e.detail.value[0], e.detail.value[1], e.detail.value[2]],
            inningTime: showDate + " " + val_2 + "(" + arr_1[1] + ")",
            startTime: that.data.uploadTime[e.detail.value[0]].split(" ").join("T") + ".000Z"
        });
    },
    // 人数
    goSetPeopleNum: function() {
        wx.navigateTo({
            url: "../setPeopleNum/setPeopleNum?maxNum=" + this.data.maxNum + "&minNum=" + this.data.minNum,
        });
    },
    // 地点
    goSetAddress: function() {
        wx.navigateTo({
            url: "../selectMerchant/selectMerchant",
        });
    },
    // 创建支付按钮
    create: function() {
        var that = this;
        if (!that.data.title) {
            wx.showToast({
                title: "请填写局标题",
                icon: "none",
                duration: app.globalData.gShowTime
            });
            return false
        }
        if (!that.data.info) {
            wx.showToast({
                title: "请填写活动介绍",
                icon: "none",
                duration: app.globalData.gShowTime
            });
            return false
        }
        if (!that.data.startTime) {
            wx.showToast({
                title: "请选择时间",
                icon: "none",
                duration: app.globalData.gShowTime
            });
            return false
        }
        if (that.data.maxNum == 0 || that.data.minNum == 0) {
            wx.showToast({
                title: "请填写人数",
                icon: "none",
                duration: app.globalData.gShowTime
            });
            return false
        }
        if (!that.data.address) {
            wx.showToast({
                title: "请填写地点",
                icon: "none",
                duration: app.globalData.gShowTime
            });
            return false
        }
        // 用于支付页面显示
        var pagePayData = {
            labelName: that.data.labelName, // 标签
            classifyName: that.data.classifyName, // 二级标题
            labelId: that.data.labelId, // 标签ID
            classifyId: that.data.classifyId, // 二级标题ID
            title: that.data.title, // 局标题
            info: that.data.info, // 局介绍
            startTime: that.data.startTime, //开局时间 2018-9-9T03:41:27.692
            minNum: that.data.minNum, // 成局人数
            maxNum: that.data.maxNum, //最多人数
            location: that.data.placeName, //位置名称 
            address: that.data.address, //详细地址 
            shopMealList: that.data.shopInfo.shopMealList, //选择的套餐
            distance: that.data.distance, //
            isCreateInning: true
        }
        // 用于发布组局数据传输
        var createData = {
            address: that.data.address, //详细地址 
            classifyId: that.data.classifyId, // 二级标题ID
            classifyName: that.data.classifyName, // 二级标题
            info: that.data.info,
            labelId: that.data.labelId, // 标签ID
            lat: that.data.shopInfo.lat,
            lng: that.data.shopInfo.lng,
            location: that.data.placeName, //位置名称 
            maxNum: that.data.maxNum, //最多人数
            minNum: that.data.minNum, // 成局人数,
            nowNum: 1,
            startTime: that.data.startTime,
            title: that.data.title,
            userId: app.globalData.userId
            // 还有两个参数userId和orderNo
        }
        if (that.data.isUserInputAddress) {
            createData.gameType = 1; //自定义地址 
            wx.request({
                url: util.apiURL + "/api/isLogin/gameRoom",
                header: {
                    token: app.globalData.token
                },
                method: "POST",
                data: createData,
                success: function(resGameRoom) {
                    // console.log(getCurrentPages())
                    wx.hideLoading();
                    app.request_api_success(resGameRoom, function() {
                        wx.showToast({
                            title: resGameRoom.data.msg,
                            icon: "none",
                            mask: true,
                            duration: app.globalData.gShowTime
                        });
                        var back_time = setTimeout(function() {
                            clearTimeout(back_time);
                            wx.setStorageSync("addressDatasOneMinute", "")
                            wx.navigateTo({
                                url: '/pages/inning/inningUnderway/inningUnderway?id=' + resGameRoom.data.data.id,
                            });
                        }, app.globalData.gShowTime);
                    });
                },
                fail: function(resGameRoom) { 
                    wx.hideLoading();
                    wx.showToast({
                        title: "创建失败！",
                        icon: "none",
                        mask: true,
                        duration: app.globalData.gShowTime
                    });
                }
            });
            return false;
        }

        createData.gameType = 2; //选择了商户
        createData.shopId = that.data.shopInfo.id; //商户id
        createData.shopMealId = that.data.shopInfo.shopMealList[0].id; //选择的套餐
        // 存储创建数据去支付页面：
        wx.setStorageSync("pagePayData", pagePayData);
        wx.setStorageSync("createInningData_data", createData);
        wx.navigateTo({
            url: "/pages/inning/pay/pay?create=ok",
        });
        // 支付成功后跳转页面：
        // wx.navigateTo({
        //     url: "../createSuccess/createSuccess",
        // });

    }
})