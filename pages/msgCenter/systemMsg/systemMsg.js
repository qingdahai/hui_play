// pages/msgCenter/systemMsg/systemMsg.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        clickTrue: true,
        items: [],
        startX: 0, //开始坐标
        startY: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;

        wx.request({
            url: util.apiURL + "/api/isLogin/sysMsg",
            header: {
                token: app.globalData.token
            },
            data: {
                userId: app.globalData.userId
            },
            success: function(res) {
                console.log(res)
            }
        })

        // for (var i = 0; i < 10; i++) {
        //     this.data.items.push({
        //         typename: "【系统提醒】",
        //         content: i + "您关注的好友xxx正在参加xxx局",
        //         time: "08:20",
        //         isTouchMove: false //默认隐藏删除
        //     })
        // }
        this.setData({
            items: this.data.items
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
    //手指触摸动作开始 记录起点X坐标
    touchstart: function(e) {
        var that = this;
        //开始触摸时 重置所有删除
        this.data.items.forEach(function(v, i) {
            if (v.isTouchMove) { //只操作为true的
                v.isTouchMove = false;
            }
        });

        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY,
            items: this.data.items
        })
    },
    touchsend: function() {
        // console.log(4)
    },
    //滑动事件处理
    touchmove: function(e) {
        // console.log("滑动" + this.data.clickTrue)
        // this.setData({
        //     clickTrue: false
        // })
        // console.log("滑动后" + this.data.clickTrue)
        var that = this,
            index = e.currentTarget.dataset.index, //当前索引
            startX = that.data.startX, //开始X坐标
            startY = that.data.startY, //开始Y坐标
            touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
            touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
            //获取滑动角度
            angle = that.angle({
                X: startX,
                Y: startY
            }, {
                X: touchMoveX,
                Y: touchMoveY
            });
        that.data.items.forEach(function(v, i) {
            v.isTouchMove = false
            //滑动超过30度角 return
            if (Math.abs(angle) > 30) return;
            if (i == index) {
                if (touchMoveX > startX) //右滑
                    v.isTouchMove = false
                else //左滑
                    v.isTouchMove = true
            }
        })
        //更新数据
        // console.log("更新" + this.data.clickTrue)
        that.setData({
            items: that.data.items,
            // clickTrue: true
        })
        // console.log("更新后" + this.data.clickTrue)
    },
    /**
     * 计算滑动角度
     * @param {Object} start 起点坐标
     * @param {Object} end 终点坐标
     */
    angle: function(start, end) {
        var _X = end.X - start.X,
            _Y = end.Y - start.Y
        //返回角度 /Math.atan()返回数字的反正切值
        return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },
    //删除事件
    del: function(e) {
        this.data.items.splice(e.currentTarget.dataset.index, 1)
        this.setData({
            items: this.data.items
        })
    },
    // 点击进入信息详情
    informSystemMessage: function(e) {
        console.log("点击" + this.data.clickTrue)
        if (this.data.clickTrue) {
            wx.navigateTo({
                url: '../systemMsgDetail/systemMsgDetail?index=' + e.currentTarget.dataset.index,
            })
        }
        //     this.setData({
        //         clickTrue: true
        //     });
    }
})