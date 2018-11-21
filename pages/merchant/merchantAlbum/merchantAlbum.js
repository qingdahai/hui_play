// // pages/album/album.js
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
        var merchantDatas = wx.getStorageSync("merchantDatas");
        that.setData({
            merchantDatas: merchantDatas
        });
        if (options && options.newMerchant) {
            if (options.newMerchant) {
                // console.log("新商户")
                if (app.globalData.merchantInfo.imageUrls == null) {
                    app.globalData.merchantInfo.imageUrls = [];
                }
                that.setData({
                    addbutton: false,
                    isNewMerchant: true,
                    albumsAccount: 0,
                    albums: app.globalData.merchantInfo.imageUrls
                });
                if (that.data.albumsAccount >= 16) {
                    that.setData({
                        addbutton: true
                    });
                }
            } else {
                console.log("旧商户！");
            }
        } else {
            wx.showLoading({
                title: "加载中...",
                icon: "none",
                mask: true,
            });
            wx.request({
                url: util.apiURL + "/api/shop/shopPhoto" +
                    "?shopId=" + that.data.merchantDatas.id,
                success: function(res) {
                    wx.hideLoading();
                    if (res.data.code == 0) {
                        // console.log(res.data.msg)
                        console.log(res.data.data)
                        for (var i in res.data.data) {
                            that.data.albums.push(res.data.data[i].imageUrl)
                        }
                        that.setData({
                            addbutton: false,
                            albums: that.data.albums,
                            albumsAccount: res.data.data.length,
                        });
                        if (res.data.data.length == 16) {
                            that.setData({
                                addbutton: true
                            })
                        }
                    } else {
                        console.error(res.data.msg);
                    }
                }
            });
        }

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
    // 上传方法 -- 添加图片
    chooseWxImage: function(type) {
        if (this.data.albumsAccount >= 16) {
            this.setData({
                addbutton: true
            });
        } else {
            var that = this;
            wx.chooseImage({
                sizeType: ['original', 'compressed'],
                sourceType: [type],
                success: function(res) {
                    if ((that.data.albumsAccount + res.tempFilePaths.length) > 16) {
                        wx.showModal({
                            title: '提示',
                            content: '相册图片不能超过16张。请重新上传！您还可以上传' + (16 - that.data.albumsAccount) + '张。',
                            showCancel: false
                        });
                        return false;
                    }
                    // 遍历上传

                    if (that.data.isNewMerchant) {
                        for (var i in res.tempFilePaths) {
                            that.data.albums.push(res.tempFilePaths[i]);
                        }
                        that.setData({
                            albums: that.data.albums,
                        });
                        console.log(that.data.albumsAccount)
                        var albumsAccount = that.data.albumsAccount + res.tempFilePaths.length;
                        that.setData({
                            albumsAccount
                        })
                        console.log(albumsAccount)
                        if (albumsAccount == 16) {
                            that.setData({
                                addbutton: true
                            })
                        }
                    } else {
                        // 旧商户修改
                        var nowTime = util.time1970num(new Date());
                        for (var i in res.tempFilePaths) {
                            wx.showLoading({
                                title: "加载中" + (parseInt(i) + 1) + '/' + res.tempFilePaths.length,
                                mask: true
                            });
                            uploadImage(res.tempFilePaths[i], "wxapp/merchant/" + that.data.merchantDatas.id + "/" + nowTime.split(" ")[0] + "/" + nowTime.split(" ")[1] + "/",
                                function(result) {
                                    // 成功回调
                                    that.data.albums.push(result);
                                    that.setData({
                                        albums: that.data.albums,
                                    })
                                    wx.hideLoading();
                                },
                                function(result) {
                                    console.error(result);
                                    wx.hideLoading();
                                }
                            );
                        }
                        var albumsAccount = that.data.albumsAccount + res.tempFilePaths.length;
                        if (albumsAccount == 16) {
                            that.setData({
                                addbutton: true
                            })
                        }
                    }
                }
            })
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
    query_ok: function(e) {
        var that = this;
        if (that.data.isNewMerchant) {
            console.log("新");
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            app.globalData.merchantInfo.imageUrls = that.data.albums;
            prevPage.setData({
                isNewMerchantBack: true
            });
            wx.navigateBack({})
            prevPage.onLoad();
            
        } else {
            wx.showLoading({
                title: "上传中...",
            });
            wx.request({
                url: util.apiURL + "/api/shop/updatePhoto" +
                    "?shopId=" + that.data.merchantDatas.id +
                    "&imageUrls=" + that.data.albums.join(","),
                method: "PUT",
                success: function(res) {
                    wx.hideLoading();
                    wx.showToast({
                        title: "成功",
                        icon: "none",
                        duration: 2000,
                        mask: true,
                    });
                    var back_timer = setTimeout(function() {
                        clearTimeout(back_timer);
                        wx.navigateBack({});
                    }, 2000);
                }
            })
        }
    }
});

// 新商户修改相册确定上传
// addSuccess: function() {
//     var pages = getCurrentPages();
//     var prevPage = pages[pages.length - 2];
//     if (this.data.newMerchant == 1) {
//         app.globalData.merchantInfo.imageUrls = this.data.albums;
//         prevPage.setData({
//             isNewMerchantBack: true
//         });
//         wx.navigateBack({})
//         prevPage.onLoad();
//     }
// }

// Page({

//     /**
//      * 页面的初始数据
//      */
//     data: {
//         addbutton: false,
//         // albumsaccount: 9,
//         newMerchant: 0,
//         // albums: [{
//         //         id: "0",
//         //         url: "/images/logo.png"
//         //     },
//         //     {
//         //         id: "1",
//         //         url: "/images/logo.png"
//         //     },
//         //     {
//         //         id: "2",
//         //         url: "/images/logo.png"
//         //     },
//         //     {
//         //         id: "3",
//         //         url: "/images/logo.png"
//         //     },
//         //     {
//         //         id: "4",
//         //         url: "/images/logo.png"
//         //     },
//         //     {
//         //         id: "5",
//         //         url: "/images/logo.png"
//         //     },
//         //     {
//         //         id: "6",
//         //         url: "/images/logo.png"
//         //     },
//         //     {
//         //         id: "7",
//         //         url: "/images/logo.png"
//         //     },
//         //     {
//         //         id: "8",
//         //         url: "/images/logo.png"
//         //     }
//         // ],
//         delbutton: true,
//     },

//     /**
//      * 生命周期函数--监听页面加载
//      */
//     onLoad: function(options) {
//         var that = this;
//         if (options) {}
//         if (!options) {
//             if (options.newMerchant) {
//                 // console.log("新商户")
//                 if (app.globalData.merchantInfo.imageUrls == null) {
//                     app.globalData.merchantInfo.imageUrls = [];
//                 }
//                 that.setData({
//                     newMerchant: 1,
//                     albumsaccount: 0,
//                     albums: app.globalData.merchantInfo.imageUrls
//                 });
//             }
//         } else {
//             // console.log("旧商户")
//             wx.showNavigationBarLoading();
//             wx.request({
//                 url: util.apiURL + "/api/shop/shopPhoto" +
//                     "?shopId=" + app.globalData.shopId,
//                 success: function(res) {
//                     if (res.data.code == 0) {
//                         // console.log(res.data.msg)
//                         console.log(res.data.data)
//                         that.setData({
//                             albumsaccount: res.data.data.length,
//                             albums: res.data.data
//                         })
//                         if (that.data.albumsAccount >= 16) {
//                             that.setData({
//                                 addbutton: true
//                             })
//                         }
//                         wx.hideNavigationBarLoading();
//                     } else {
//                         console.error(res.data.msg);
//                     }
//                 }
//             });
//         }
//     },

//     /**
//      * 生命周期函数--监听页面初次渲染完成
//      */
//     onReady: function() {

//     },

//     /**
//      * 生命周期函数--监听页面显示
//      */
//     onShow: function() {

//     },

//     /**
//      * 生命周期函数--监听页面隐藏
//      */
//     onHide: function() {

//     },

//     /**
//      * 生命周期函数--监听页面卸载
//      */
//     onUnload: function() {

//     },

//     /**
//      * 页面相关事件处理函数--监听用户下拉动作
//      */
//     onPullDownRefresh: function() {

//     },

//     /**
//      * 页面上拉触底事件的处理函数
//      */
//     onReachBottom: function() {

//     },

//     /**
//      * 用户点击右上角分享
//      */
//     onShareAppMessage: function() {

//     },
//     // 选择上传方式
//     chooseimage: function() {
//         var that = this;
//         wx.showActionSheet({
//             itemList: ['从相册中选择', '拍照'],
//             itemColor: "#4b5bdb",
//             success: function(res) {
//                 if (!res.cancel) {
//                     if (res.tapIndex == 0) {
//                         that.chooseWxImage("album")
//                     } else if (res.tapIndex == 1) {
//                         that.chooseWxImage("camera")
//                     }
//                 }
//             }
//         })
//     },
//     // 上传方法
//     chooseWxImage: function(type) {
//         // 判断是否超过十六张(包含)
//         var that = this;
//         if (that.data.albums.length >= 16) {
//             that.setData({
//                 addbutton: true
//             });
//             console.log(that.data.albums.length)
//         } else {
//             wx.chooseImage({
//                 sizeType: ['original', 'compressed'],
//                 sourceType: [type],
//                 success: function(resImg) {
//                     // 可以多选，判断选的总数与已有之和是否超过(不包含)十六张
//                     if ((that.data.albums.length + resImg.tempFilePaths.length) > 16) {
//                         wx.showModal({
//                             title: '提示',
//                             content: '相册图片不能超过16张。请重新上传！您还可以上传' + (16 - that.data.albums.length) + '张。',
//                             showCancel: false
//                         });
//                         return false;
//                     } else {
//                         wx.showNavigationBarLoading();
//                         wx.request({
//                             url: util.apiURL + "/api/shop/updatePhoto" +
//                                 "?shopId=" + app.globalData.shopId +
//                                 "&imageUrls=" + resImg.tempFilePaths.join(","),
//                             method: "PUT",
//                             success: function(res) {
//                                 if (res.data.code == 0) {
//                                     // console.log(res)
//                                     that.onLoad();
//                                     wx.showNavigationBarLoading();
//                                 } else {
//                                     console.error(res.data.msg);
//                                 }
//                             }
//                         });
//                     }
//                 }
//             })
//         }
//     },
//     // 图片单击预览
//     previewImg: function(e) {
//         var arr = [];
//         for (var i in this.data.albums) {
//             arr.push(this.data.albums[i].url)
//         }
//         wx.previewImage({
//             current: e.currentTarget.dataset.src,
//             urls: arr
//         });
//     },
//     // 图片长按事件
//     deleteImagebtn: function() {
//         this.setData({
//             delbutton: false
//         });
//     },
//     // 图片删除事件
//     deleteImage: function(e) {
//         // console.log(e.currentTarget.dataset.id)
//         var that = this;
//         var id = e.currentTarget.dataset.id;
//         console.log(id)
//         wx.showModal({
//             title: '提示',
//             content: '确定要删除此图片吗？',
//             success: function(res) {
//                 var albums = that.data.albums;
//                 var newAlbums = [];
//                 for (var i in albums) {
//                     if (albums[i].id == id) {} else {
//                         newAlbums.push(albums[i])
//                     }
//                 }
//                 that.setData({
//                     albums: newAlbums
//                 });

//             }
//         })
//     },
//     // 新商户修改相册确定上传
//     addSuccess: function() {
//         var pages = getCurrentPages();
//         var prevPage = pages[pages.length - 2];
//         if (this.data.newMerchant == 1) {
//             app.globalData.merchantInfo.imageUrls = this.data.albums;
//             prevPage.setData({
//                 isNewMerchantBack: true
//             });
//             wx.navigateBack({})
//             prevPage.onLoad();
//         }
//     }
// });