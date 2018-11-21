// pages/merchant/merchantDataModify/modifyLogo.js
var util = require("../../../../utils/util.js");
var uploadImage = require("../../../../utils/uploadFile.js");
var app = getApp();
var merchant = app.globalData.merchantInfo;
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        if (options.newMerchant) {
            // 判断新商户
            that.setData({
                isNewMerchant: true
            });
        }
        wx.getImageInfo({
            src: options.imgurl,
            success: function(res) {
                that.setData({
                    imgWidth: res.width,
                    imgHeight: res.height
                });
            },
            complete: function(res) {
                var imgWidth = that.data.imgWidth;
                var imgHeight = that.data.imgHeight;
                var ratio = imgWidth / imgHeight;
                var windowWidth = wx.getSystemInfoSync().windowWidth;
                var windowHeight = wx.getSystemInfoSync().windowHeight;
                that.setData({
                    imgUrl: options.imgurl,
                    windowWidth: windowWidth,
                    windowHeight: windowHeight,
                    ratio: ratio
                });
                var ctx = wx.createCanvasContext("myCanvas", this);
                ctx.arc(that.data.windowWidth / 2, that.data.windowHeight / 2, that.data.windowWidth / 2.5, 0, 2 * Math.PI);
                ctx.fill();
                // 剪切
                ctx.clip();
                // 剪切后载入图片
                if (that.data.ratio >= 1) {
                    // 横屏图片
                    ctx.drawImage(that.data.imgUrl, 0, 0, that.data.windowHeight * that.data.ratio, that.data.windowHeight);
                } else {
                    // 竖屏图片
                    ctx.drawImage(that.data.imgUrl, 0, 0, that.data.windowWidth, that.data.windowWidth / that.data.ratio);
                }
                ctx.draw();

                // ctx.draw(true, function () {
                //     wx.canvasToTempFilePath({
                //         canvasId: "myCanvas",
                //         x: that.data.windowWidth / 2 - that.data.windowWidth / 2.5,
                //         y: that.data.windowHeight / 2 - that.data.windowWidth / 2.5,
                //         width: that.data.windowWidth / 2.5 * 2,
                //         height: that.data.windowWidth / 2.5 * 2,
                //         destWidth: 500,
                //         destHeight: 500,
                //         success: function (resImg) {
                //             that.setData({
                //                 clipImgUrl: resImg.tempFilePath
                //             });
                //             var pages = getCurrentPages();
                //             var prevPage = pages[pages.length - 2];
                //             var prevPrevPage = pages[pages.length - 3];
                //             var nowTime = util.time1970num(new Date());
                //             // 判断新商户
                //             if (that.data.isNewMerchant) {
                //                 app.globalData.merchantInfo.logo = resImg.tempFilePath;
                //                 prevPage.onLoad();
                //                 wx.navigateBack({});
                //                 wx.hideNavigationBarLoading();
                //             } else {
                //                 // 已注册的商户修改logo
                //                 uploadImage(resImg.tempFilePath, "wxapp/merchant/" + nowTime.split(" ")[0] + "/" + nowTime.split(" ")[1] + "/",
                //                     function (result) {
                //                         // 上传oss成功回调
                //                         wx.request({
                //                             url: util.apiURL + "/api/shop/updateInfo" +
                //                                 "?shopId=" + app.globalData.shopId,
                //                             method: "PUT",
                //                             data: {
                //                                 logo: result
                //                             },
                //                             success: function (res) {
                //                                 if (res.data.code == 0) {
                //                                     app.globalData.merchantInfo.logo = resImg.tempFilePath;
                //                                     prevPage.onLoad();
                //                                     // 确保商户点返回时商户logo已更改
                //                                     prevPrevPage.onLoad();
                //                                     wx.navigateBack({});
                //                                     wx.hideNavigationBarLoading();
                //                                 } else {
                //                                     console.error(res.data.msg);
                //                                 }
                //                             }
                //                         })
                //                     },
                //                     function (result) {
                //                         console.error(result);
                //                         wx.hideLoading();
                //                     }
                //                 );
                //             }
                //         }
                //     })
                // });
            }
        });
    },
    clipImg: function() {
        wx.showNavigationBarLoading();
        wx.showLoading({
            title: "正在上传...",
            mask: true
        });
        var that = this;
        var ctx = wx.createCanvasContext("myCanvas", this);
        // ???? 手机端要重新绘制一次？？？？
        ctx.arc(that.data.windowWidth / 2, that.data.windowHeight / 2, that.data.windowWidth / 2.5, 0, 2 * Math.PI);
        ctx.fill();
        // 剪切
        ctx.clip();
        // 剪切后载入图片
        if (that.data.ratio >= 1) {
            // 横屏图片
            ctx.drawImage(that.data.imgUrl, 0, 0, that.data.windowHeight * that.data.ratio, that.data.windowHeight);
        } else {
            // 竖屏图片
            ctx.drawImage(that.data.imgUrl, 0, 0, that.data.windowWidth, that.data.windowWidth / that.data.ratio);
        }
        ctx.draw(true, function() {
            wx.canvasToTempFilePath({
                canvasId: "myCanvas",
                x: that.data.windowWidth / 2 - that.data.windowWidth / 2.5,
                y: that.data.windowHeight / 2 - that.data.windowWidth / 2.5,
                width: that.data.windowWidth / 2.5 * 2,
                height: that.data.windowWidth / 2.5 * 2,
                destWidth: 500,
                destHeight: 500,
                success: function(resImg) {
                    that.setData({
                        clipImgUrl: resImg.tempFilePath
                    });
                    var pages = getCurrentPages();
                    var prevPage = pages[pages.length - 2];
                    var prevPrevPage = pages[pages.length - 3];
                    var nowTime = util.time1970num(new Date());
                    // 判断新商户
                    if (that.data.isNewMerchant) {
                        app.globalData.merchantInfo.logo = resImg.tempFilePath;
                        prevPage.onLoad();
                        wx.navigateBack({});
                        wx.hideLoading();
                        wx.hideNavigationBarLoading();
                    } else {
                        // 已注册的商户修改logo
                        uploadImage(resImg.tempFilePath, "wxapp/merchant/" + nowTime.split(" ")[0] + "/" + nowTime.split(" ")[1] + "/",
                            function(result) {
                                // 上传oss成功回调
                                wx.request({
                                    url: util.apiURL + "/api/shop/updateInfo" +
                                        "?shopId=" + app.globalData.shopId,
                                    method: "PUT",
                                    data: {
                                        logo: result
                                    },
                                    success: function(res) {
                                        if (res.data.code == 0) {

                                            app.globalData.merchantInfo.logo = resImg.tempFilePath;
                                            prevPage.onLoad();
                                            // 确保商户点返回时商户logo已更改
                                            prevPrevPage.onLoad();
                                            wx.navigateBack({});
                                        } else {
                                            console.error(res.data.msg);
                                        }
                                        wx.hideNavigationBarLoading();
                                        wx.hideLoading();
                                    }
                                })
                            },
                            function(result) {
                                console.error(result);
                                wx.hideNavigationBarLoading();
                                wx.hideLoading();
                            }
                        );
                    }
                }
            })
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        // console.log(this.data)
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

    }
})