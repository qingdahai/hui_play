// pages/merchant/merchantDataModify/modifyAddress/modifyAddress.js
var util = require("../../../../utils/util.js");
var QQMapWX = require('../../../../libs/qqmap-wx-jssdk.js');
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressList: [],
        currentLat: '',
        currentLon: '',
        markers: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        if (options.newMerchant) {
            that.setData({
                isnewMerchant: true
            });
        }
        var that = this;
        wx.getLocation({
            success: function(res) {
                that.configMap(res.latitude, res.longitude);
            },
            fail: function(res) {
                wx.getSetting({
                    success: function(res) {
                        // 判断用户是否开启定位授权
                        if (!res.authSetting["scope.userLocation"]) {
                            wx.showModal({
                                title: "是否授权当前位置",
                                content: "需要获取您的地理位置，请确认授权，否则地图功能将无法使用",
                                success: function(tip) {
                                    if (tip.confirm) {
                                        // 同意授权
                                        wx.openSetting({
                                            success: function(data) {
                                                console.log(data)
                                                if (data.authSetting["scope.userLocation"] === true) {
                                                    wx.showToast({
                                                        title: "授权成功",
                                                        icon: "none",
                                                        duration: 2000
                                                    });
                                                    // var back_timer = setTimeout(function(){
                                                    //     clearTimeout(back_timer);
                                                    //     wx.navigateBack({});
                                                    // },2000);
                                                } else {
                                                    wx.showToast({
                                                        title: "授权失败",
                                                        icon: "none",
                                                        duration: 2000
                                                    })
                                                }
                                            },
                                            fail: function(res) {
                                                console.log(res)
                                            }
                                        })
                                    } else {
                                        wx.showToast({
                                            title: "授权失败",
                                            icon: "none",
                                            duration: 2000
                                        });
                                    }
                                }, fail: function (res) {
                                    wx.showToast({
                                        title: "授权失败",
                                        icon: "none",
                                        duration: 2000
                                    });
                                }
                            })
                        }
                    },
                    fail: function(res) {
                        wx.showToast({
                            title: "授权失败",
                            icon: "none",
                            duration: 2000
                        });
                    }
                });
            }
        });
    },
    // 地图点击
    moveToLocation: function() {
        var that = this;
        wx.chooseLocation({
            success: function(res) {
                that.configMap(res.latitude, res.longitude);
            },
            fail: function(err) {
                console.log(err)
            }
        });
    },
    // 地图定位
    configMap: function(lat, lng) {
        var that = this;
        var qqmapsdk = new QQMapWX({
            key: '3ZMBZ-FU7CU-ZCQVY-2KO2A-XOLEH-ZZBFM'
        });
        that.setData({
            lat: lat,
            lng: lng,
            markers: [{
                latitude: lat,
                longitude: lng,
                iconPath: "/images/position.png"
            }]
        });
        qqmapsdk.reverseGeocoder({
            location: {
                latitude: lat,
                longitude: lng
            },
            success: function(res) {
                console.log(res)
                that.setData({
                    myAddress: res.result,
                    positionCity: res.result.address_component.city
                })
            },
            fail: function(res) {
                console.log(res);
            },
        });
    },
    // 确定
    selectAddress: function(e) {
        var that = this;
        var locationData = that.data.myAddress;
        // console.log(locationData)
        // console.log(locationData.address, locationData.formatted_addresses.recommend)
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        var addressData = null;
        if (that.data.inputVal && that.data.inputVal != "") {
            // console.log(that.data.inputVal)
            addressData = that.data.inputVal
        } else {
            addressData = locationData.address + locationData.formatted_addresses.recommend;
        }
        if (that.data.isnewMerchant) {
            // 新商户
            prevPage.setData({
                addressData: addressData,
                addressDatas: locationData
            });
            wx.navigateBack({});
            prevPage.onLoad();
        } else {
            wx.showLoading({
                title: "加载中",
            })
            wx.request({
                url: util.apiURL + "/api/shop/updateInfo" +
                    "?shopId=" + app.globalData.shopId,
                method: "PUT",
                data: {
                    address: addressData
                },
                success: function(res) {
                    wx.hideLoading();
                    if (res.data.code == 0) {
                        prevPage.onLoad();
                        wx.navigateBack({});
                    } else {
                        wx.showToast({
                            title: res.msg.data,
                            icon: "none",
                            mask: true,
                            duration: 2000
                        });
                        console.error(res.data.msg);
                    }
                },
                fail: function(res) {
                    wx.hideLoading();
                    wx.showToast({
                        title: "修改失败!",
                        icon: "none",
                        mask: true,
                        duration: 2000
                    });
                }
            });
        }
    },
    // 点击搜索框
    bindSearchTap: function() {
        wx.navigateTo({
            url: 'searchMapLocation/searchMapLocation',
        })
    },
    // 选择城市
    selectCity: function() {
        wx.navigateTo({
            url: "/pages/search/selectCity/selectCity",
        })
    },
    // 聚焦输入框设置标题
    setPageTitle: function() {
        wx.setNavigationBarTitle({
            title: "手动输入",
        });
    },
    // 移出输入框设置标题
    defalutPageTitle: function() {
        wx.setNavigationBarTitle({
            title: "设置地址",
        });
    },
    // 输入框监听
    inputVal: function(e) {
        console.log(e.detail.value)
        this.setData({
            inputVal: e.detail.value
        });
    }
});




// // pages/merchant/merchantDataModify/modifyAddress/modifyAddress.js
// var util = require("../../../../utils/util.js");
// var QQMapWX = require('../../../../libs/qqmap-wx-jssdk.js');
// var app = getApp();

// Page({

//     /**
//      * 页面的初始数据
//      */
//     data: {
//         addressList: [],
//         currentLat: '',
//         currentLon: '',
//         markers: []
//     },

//     /**
//      * 生命周期函数--监听页面加载
//      */
//     onLoad: function(options) {
//         var that = this;
//         if (options.newMerchant) {
//             that.setData({
//                 isnewMerchant: true
//             });
//         }
//         that.getCurrentLocation()
//         // this.configMap()
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

//     /**
//      * 地图
//      */
//     getCurrentLocation: function() {
//         var that = this;
//         wx.getLocation({
//             success: function(res) {
//                 var latitude = res.latitude
//                 var longitude = res.longitude
//                 that.setData({
//                     currentLat: latitude,
//                     currentLon: longitude,
//                     markers: [{
//                         latitude: latitude,
//                         longitude: longitude,
//                         iconPath: "/images/position.png"
//                     }]
//                 })
//                 that.configMap();
//             },
//             fail: function(res) {
//                 wx.getSetting({
//                     success: function(res) {
//                         var statu = res.authSetting;
//                         if (!statu['scope.userLocation']) {
//                             wx.showModal({
//                                 title: '是否授权当前位置',
//                                 content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
//                                 success: function(tip) {
//                                     if (tip.confirm) {
//                                         wx.openSetting({
//                                             success: function(data) {
//                                                 console.log(data)
//                                                 if (data.authSetting["scope.userLocation"] === true) {
//                                                     wx.showToast({
//                                                         title: '授权成功',
//                                                         icon: 'success',
//                                                         duration: 1000
//                                                     })
//                                                     //授权成功之后，再调用chooseLocation选择地方
//                                                     wx.chooseLocation({
//                                                         success: function(res) {
//                                                             obj.setData({
//                                                                 addr: res.address
//                                                             })
//                                                         },
//                                                     })
//                                                 } else {
//                                                     wx.showToast({
//                                                         title: '授权失败',
//                                                         icon: 'success',
//                                                         duration: 1000
//                                                     })
//                                                 }
//                                             },
//                                             fail: function(res) {
//                                                 console.log(res)
//                                             }
//                                         })
//                                     }
//                                 }
//                             })
//                         }
//                     },
//                     fail: function(res) {
//                         wx.showToast({
//                             title: '调用授权窗口失败',
//                             icon: 'success',
//                             duration: 1000
//                         })
//                     }
//                 })
//             }
//         })
//     },
//     configMap: function() {
//         var that = this;
//         var qqmapsdk = new QQMapWX({
//             key: '3ZMBZ-FU7CU-ZCQVY-2KO2A-XOLEH-ZZBFM'
//         });
//         qqmapsdk.reverseGeocoder({
//             location: {
//                 latitude: that.data.currentLat,
//                 longitude: that.data.currentLon
//             },
//             success: function(res) {
//                 // console.log(res);
//             },
//             fail: function(res) {
//                 // console.log(res);
//             },
//             complete: function(res) {
//                 // console.log(res.result);
//                 that.setData({
//                     myAddress: res.result,
//                     positionCity: res.result.address_component.city
//                 })
//             }
//         });

//     },
//     //地图点击
//     bindtap: function(e) {
//         console.log(e)
//     },
//     // 确定
//     selectAddress: function(e) {
//         var that = this;
//         var locationData = that.data.myAddress;
//         // console.log(locationData)
//         // console.log(locationData.address, locationData.formatted_addresses.recommend)
//         var pages = getCurrentPages();
//         var prevPage = pages[pages.length - 2];
//         var addressData = null;
//         if (that.data.inputVal && that.data.inputVal != "") {
//             addressData = that.data.inputVal
//         } else {
//             addressData = locationData.address + locationData.formatted_addresses.recommend;
//         }
//         if (that.data.isnewMerchant) {
//             // 新商户
//             prevPage.setData({
//                 addressData: addressData,
//                 addressDatas: locationData
//             });
//             wx.navigateBack({});
//             prevPage.onLoad();
//         } else {
//             wx.showLoading({
//                 title: "加载中",
//             })
//             wx.request({
//                 url: util.apiURL + "/api/shop/updateInfo" +
//                     "?shopId=" + app.globalData.shopId,
//                 method: "PUT",
//                 data: {
//                     address: addressData
//                 },
//                 success: function(res) {
//                     wx.hideLoading();
//                     if (res.data.code == 0) {
//                         prevPage.onLoad();
//                         wx.navigateBack({});
//                     } else {
//                         wx.showToast({
//                             title: res.msg.data,
//                             icon: "none",
//                             mask: true,
//                             duration: 2000
//                         });
//                         console.error(res.data.msg);
//                     }
//                 },
//                 fail: function(res) {
//                     wx.hideLoading();
//                     wx.showToast({
//                         title: "修改失败!",
//                         icon: "none",
//                         mask: true,
//                         duration: 2000
//                     });
//                 }
//             });
//         }
//     },
//     // 点击搜索框
//     bindSearchTap: function() {
//         wx.navigateTo({
//             url: 'searchMapLocation/searchMapLocation',
//         })
//     },
//     // 选择城市
//     selectCity: function() {
//         wx.navigateTo({
//             url: "/pages/search/selectCity/selectCity",
//         })
//     },
//     // 聚焦输入框设置标题
//     setPageTitle: function() {
//         wx.setNavigationBarTitle({
//             title: "手动输入",
//         });
//     },
//     // 移出输入框设置标题
//     defalutPageTitle: function() {
//         wx.setNavigationBarTitle({
//             title: "设置地址",
//         });
//     },
//     // 输入框监听
//     inputVal: function(e) {
//         console.log(e.detail.value)
//         this.setData({
//             inputVal: e.detail.value
//         });
//     }

// })