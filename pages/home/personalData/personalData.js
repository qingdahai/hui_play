// pages/personalData/personalData.js
var util = require("../../../utils/util.js");
var uploadImage = require("../../../utils/uploadFile.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: null
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        app.globalData.userInfo.age = util.birthdayToAge(app.globalData.userInfo.birthday);
        this.setData({
            userInfo: app.globalData.userInfo
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
    // 头像修改
    // 选择上传方式
    chooseimage: function() {
        var that = this;
        wx.showActionSheet({
            itemList: ['从相册中选择', '拍照'],
            itemColor: "#4b5bdb",
            success: function(res) {
                if (!res.cancel) {
                    if (res.tapIndex == 0) {
                        that.chooseWxImage('album')
                    } else if (res.tapIndex == 1) {
                        that.chooseWxImage('camera')
                    }
                }
            }
        })
    },
    // 上传方法
    chooseWxImage: function(type) {

        // wx.chooseImage({
        //     count: 1, // 默认9
        //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        //     sourceType: [type], // 可以指定来源是相册还是相机，默认二者都有
        //     success: (res) => {
        //         // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //         const tempFilePaths = res.tempFilePaths;
        //         //启动上传等待中...  
        //         wx.showToast({
        //             title: '正在上传...',
        //             icon: 'loading',
        //             mask: true,
        //             duration: 1000
        //         })
        //         this.setData({
        //             imgSrc: res.tempFilePaths
        //         })
        //     }
        // })

        if (this.data.albumsaccount >= 16) {
            this.setData({
                addbutton: true
            });
        } else {
            var that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: [type],
                success: function(res) {
                    wx.showLoading({
                        title: "正在上传...",
                        mask: true
                    })
                    // 直接上传 
                    var pages = getCurrentPages();
                    var prevPage = pages[pages.length - 2];

                    var tempFilePaths = res.tempFilePaths;
                    var nowTime = util.time1970num(new Date());
                    //支持多图上传
                    // for (var i = 0; i < res.tempFilePaths.length; i++) {
                    //     //显示消息提示框
                    //     wx.showLoading({
                    //         title: '上传中' + (i + 1) + '/' + res.tempFilePaths.length,
                    //         mask: true
                    //     })
                    //上传图片
                    //你的域名下的/cbb文件下的/当前年月日文件下的/图片.png
                    //图片路径可自行修改
                    uploadImage(res.tempFilePaths[0], "wxapp/user/" + nowTime.split(" ")[0] + "/" + nowTime.split(" ")[1] + "/",
                        function(result) {
                            // 成功回调
                            wx.request({
                                url: util.apiURL + "/api/isLogin/userUpdate" +
                                    "?userId=" + app.globalData.userId +
                                    "&headUrl=" + result,
                                header: {
                                    token: app.globalData.token
                                },
                                method: "PUT",
                                success: function(res) {
                                    wx.hideLoading();
                                    app.request_api_success(res, function() {
                                        app.globalData.userInfo.headUrl = res.data.data.headUrl;
                                        that.onLoad();
                                        prevPage.onLoad();
                                    });
                                },
                                fail: function(res) {
                                    wx.hideLoading();
                                    wx.showToast({
                                        title: "头像上传失败！",
                                        icon: "none",
                                        mask: true,
                                        duration: app.globalData.gShowTime
                                    });
                                }
                            });
                        },
                        function(result) {
                            wx.hideLoading();
                            wx.showToast({
                                title: "头像上传失败！",
                                icon: "none",
                                mask: true,
                                duration: app.globalData.gShowTime
                            });
                            console.log(result);
                        }
                    );
                    // } 

                    // 去剪切页面（功能未完善）
                    // wx.navigateTo({
                    //     url: "/pages/modify/modifyUserHead/modifyUserHead?imgurl=" + res.tempFilePaths[0],
                    // });
                }
            })
        }
    },
    // 跳转修改
    modifyID: function() {
        wx.navigateTo({
            url: "/pages/modify/modifyIDorAge/modifyIDorAge?type=id",
        });
    },
    modifyAge: function() {
        // wx.navigateTo({
        //     url: "/pages/modify/modifyIDorAge/modifyIDorAge?type=age",
        // });
    },
    modifyGender: function() {
        wx.navigateTo({
            url: "/pages/modify/modifyGender/modifyGender",
        });
    },
    modifyPhoneNumber: function() {
        wx.navigateTo({
            url: "/pages/modify/modifyPhoneNumber/modifyPhoneNumber",
        });
    },
    authorization: function() {
        if (!this.data.userInfo.openId) {
            wx.navigateTo({
                url: "/pages/modify/authorization/authorization",
            });
        }
    }
})