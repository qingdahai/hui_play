// pages/album/album.js
var util = require("../../../utils/util.js");
var uploadImage = require("../../../utils/uploadFile.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addbutton: true, // 初始化添加按钮隐藏
        albums: [], // 初始化相册展示URL数组
        delbutton: false, // 初始化删除按钮显示
        hideBtn: true, // 初始化上传按钮隐藏
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        wx.showLoading({
            title: "加载中...",
        });
        wx.request({
            url: util.apiURL + "/api/isLogin/userPhoto",
            header: {
                token: app.globalData.token
            },
            data: {
                userId: app.globalData.userId
            },
            success: function(res) {
                wx.hideLoading();
                app.request_api_success(res, function() {
                    // 读取存储URL
                    for (var i in res.data.data) {
                        that.data.albums.push(res.data.data[i].imageUrl)
                    }
                    that.setData({
                        addbutton: false,
                        albums: that.data.albums,
                        albumsAccount: res.data.data.length,
                        hideBtn: false
                    });
                    // 判断是否有十六张，隐藏上传按钮
                    if (res.data.data.length >= 16) {
                        that.setData({
                            addbutton: true
                        });
                    }
                });
            },
            fail: function(res) {
                wx.hideLoading();
                wx.showToast({
                    title: "加载失败！",
                    icon: "none",
                    mask: true,
                    duration: app.globalData.gShowTime
                });
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
    // 选择上传方式
    chooseimage: function() {
        var that = this;
        wx.showActionSheet({
            itemList: ["从相册中选择", "拍照"],
            itemColor: "#4b5bdb",
            success: function(res) {
                if (!res.cancel) {
                    if (res.tapIndex == 0) {
                        that.chooseWxImage("album");
                    } else if (res.tapIndex == 1) {
                        that.chooseWxImage("camera");
                    }
                }
            }
        })
    },
    // 上传方法 -- 添加图片
    chooseWxImage: function(type) {
        if (this.data.albumsAccount >= 16) {
            this.setData({
                addbutton: true
            });
        } else {
            var that = this;
            wx.chooseImage({
                sizeType: ["original", "compressed"],
                sourceType: [type],
                success: function(res) {
                    // 判断是否上传超过16张
                    if ((that.data.albumsAccount + res.tempFilePaths.length) > 16) {
                        wx.showModal({
                            title: "提示",
                            content: "相册图片不能超过16张。请重新上传！您还可以上传" + (16 - that.data.albumsAccount) + "张。",
                            showCancel: false
                        });
                        return false;
                    }
                    // 遍历上传
                    var nowTime = util.time1970num(new Date());
                    for (var i in res.tempFilePaths) {
                        wx.showLoading({
                            title: "加载中" + (parseInt(i) + 1) + '/' + res.tempFilePaths.length,
                            mask: true
                        });
                        // 调用上传阿里云oss方法
                        uploadImage(res.tempFilePaths[i], "wxapp/user/" + app.globalData.userId + "/" + nowTime.split(" ")[0] + "/" + nowTime.split(" ")[1] + "/",
                            function(result) {
                                // 成功回调
                                that.data.albums.push(result);
                                that.setData({
                                    albums: that.data.albums,
                                });
                                wx.hideLoading();
                            },
                            function(result) {
                                console.error(result);
                                wx.hideLoading();
                                wx.showToast({
                                    title: "上传失败！",
                                    icon: "none",
                                    mask: true,
                                    duration: app.globalData.gShowTime
                                });
                            }
                        );
                    }
                    var albumsAccount = that.data.albumsAccount + res.tempFilePaths.length;
                    if (albumsAccount == 16) {
                        that.setData({
                            addbutton: true
                        });
                    }
                },
                fail: function(res) {
                    wx.hideLoading();
                    wx.showToast({
                        title: "上传失败！",
                        icon: "none",
                        mask: true,
                        duration: app.globalData.gShowTime
                    });
                }
            });
        }
    },
    // 图片单击预览
    previewImg: function(e) {
        var that = this;
        var current = null;
        var index = e.currentTarget.dataset.index;
        wx.previewImage({
            current: that.data.albums[index],
            urls: that.data.albums
        });
    },
    // 图片长按事件
    deleteImagebtn: function() {
        this.setData({
            delbutton: false
        });
    },
    // 图片删除事件
    deleteImage: function(e) {
        // console.log(e.currentTarget.dataset.mid)
        var that = this;
        var index = e.currentTarget.dataset.index;
        that.data.albums.splice(index, 1);
        that.setData({
            albums: that.data.albums
        });
        // wx.showModal({
        //     title: '提示',
        //     content: '确定要删除此图片吗？',
        //     success: function(res) {
        //         var albums = that.data.albums;
        //         if (res.confirm) {
        //             albums.splice(mid, 1);
        //         } else if (res.cancel) {
        //             return false;
        //         }
        //         that.setData({
        //             albums
        //         });
        //     }
        // })
    },
    // 确认上传
    query_ok: function() {
        var that = this;
        wx.showLoading({
            title: "上传中...",
        });
        wx.request({
            url: util.apiURL + "/api/isLogin/userPhoto" +
                "?userId=" + app.globalData.userId +
                "&imageUrls=" + that.data.albums.join(","),
            header: {
                token: app.globalData.token
            },
            method: "PUT",
            success: function(res) {
                wx.hideLoading();
                app.request_api_success(res, function() {
                    wx.showToast({
                        title: "成功",
                        icon: "none",
                        duration: app.globalData.gShowTime,
                        mask: true,
                    });
                    // 上传成功后返回上一页
                    var back_timer = setTimeout(function() {
                        clearTimeout(back_timer);
                        wx.navigateBack({});
                    }, app.globalData.gShowTime);
                });
            },
            fail: function(res) {
                wx.hideLoading();
                wx.showToast({
                    title: "上传失败！",
                    icon: "none",
                    mask: true,
                    duration: app.globalData.gShowTime
                });
            }
        });
    }
});