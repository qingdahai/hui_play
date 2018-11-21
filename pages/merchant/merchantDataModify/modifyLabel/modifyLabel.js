// pages/merchant/merchantDataModify/merchantLabel.js
var util = require("../../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selected: "",
        userInfo: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        var labelTag = app.labelTag;
        
        // if (labelTag.length == 8) {
        //     labelTag.pop();
        // }
        // 先清空之前的active
        for (var i in app.labelTag) {
            labelTag[i].active = "";
        }

        if (options.newMerchant) {
            // 新商户
            that.setData({
                isnewMerchant: true
            });
            // 新商户遍历已选择的标签
            for (var i in app.globalData.merchantInfo.labelList) {
                for (var j in labelTag) {
                    if (labelTag[j].id == app.globalData.merchantInfo.labelList[i].id) {
                        labelTag[j].active = "active";
                    }
                }
            }
        } else {
            // 旧商户遍历自己标签
            var selectedLabelArr = [];
            var merchantDatas = wx.getStorageSync("merchantDatas");
            console.log(merchantDatas)
            var selectedLabel = merchantDatas.labelList.split(",");
            for (var i in selectedLabel) {
                for (var j in labelTag) {
                    if (labelTag[j].id == selectedLabel[i]) {
                        labelTag[j].active = "active";
                    }
                }
            }
        }
        that.setData({
            list: labelTag
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
    // 选择标签
    selected: function(e) {
        for (var i in this.data.list) {
            if (this.data.list[i].id == e.currentTarget.dataset.id) {
                if (this.data.list[i].active == "active") {
                    this.data.list[i].active = "";
                } else {
                    this.data.list[i].active = "active";
                }
            }
        }
        this.setData({
            list: this.data.list
        });
    },
    // 用户自定义
    userDefined: function() {
        console.log("用户自定义标签");
    },
    // 确定按钮
    clickon: function() {
        var that = this;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        var arr = [];
        for (var i in this.data.list) {
            if (this.data.list[i].active) {
                arr.push(this.data.list[i]);
            }
        }
        if (arr.length == 0) {
            wx.showToast({
                title: "请选择标签",
                icon: "none",
                duration: 2000
            });
            return false;
        }
        if (that.data.isnewMerchant) {
            app.globalData.merchantInfo.labelList = arr; // 存入全局 *再次点入判断，选择套餐标签列表处使用
            wx.navigateBack({});
            prevPage.onLoad();
        } else {
            wx.showNavigationBarLoading();
            console.log(arr)
            var labelListArr = [];
            for (var i in arr) {
                labelListArr.push(arr[i].id)
            }

            wx.request({
                url: util.apiURL + "/api/shop/updateInfo" +
                    "?shopId=" + app.globalData.shopId,
                method: "PUT",
                data: {
                    labelList: labelListArr.join(",")
                },
                success: function(res) {
                    if (res.data.code == 0) {
                        console.log(res.data.msg)
                        app.globalData.merchantInfo.labelList = labelListArr.join(",");
                        prevPage.onLoad();
                        wx.navigateBack({});
                        wx.hideNavigationBarLoading();
                    } else {
                        console.error(res.data.msg);
                    }
                }
            })
        }
    }
})