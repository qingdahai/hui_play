// mapLocation.js
var QQMapWX = require('../../../libs/qqmap-wx-jssdk.js');

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
        this.getCurrentLocation()
        // this.configMap()
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

    /**
     * 地图
     */
    getCurrentLocation: function() {
        var that = this;
        wx.getLocation({
            success: function(res) {
                var latitude = res.latitude
                var longitude = res.longitude
                that.setData({
                    currentLat: latitude,
                    currentLon: longitude,
                    markers: [{
                        latitude: latitude,
                        longitude: longitude,
                        iconPath: "/images/position.png"
                    }]
                })
                that.configMap();
            },
            fail: function(res) {
                wx.getSetting({
                    success: function(res) {
                        var statu = res.authSetting;
                        if (!statu['scope.userLocation']) {
                            wx.showModal({
                                title: '是否授权当前位置',
                                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                                success: function(tip) {
                                    if (tip.confirm) {
                                        wx.openSetting({
                                            success: function(data) {
                                                console.log(data)
                                                if (data.authSetting["scope.userLocation"] === true) {
                                                    wx.showToast({
                                                        title: '授权成功',
                                                        icon: 'success',
                                                        duration: 1000
                                                    })
                                                    //授权成功之后，再调用chooseLocation选择地方
                                                    wx.chooseLocation({
                                                        success: function(res) {
                                                            obj.setData({
                                                                addr: res.address
                                                            })
                                                        },
                                                    })
                                                } else {
                                                    wx.showToast({
                                                        title: '授权失败',
                                                        icon: 'success',
                                                        duration: 1000
                                                    })
                                                }
                                            },
                                            fail: function(res) {
                                                console.log(res)
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    },
                    fail: function(res) {
                        wx.showToast({
                            title: '调用授权窗口失败',
                            icon: 'success',
                            duration: 1000
                        })
                    }
                })
            }
        })
    },

    configMap: function() {
        var that = this;
        var qqmapsdk = new QQMapWX({
            key: '3ZMBZ-FU7CU-ZCQVY-2KO2A-XOLEH-ZZBFM'
        });
        qqmapsdk.reverseGeocoder({
            location: {
                latitude: that.data.currentLat,
                longitude: that.data.currentLon
            },
            success: function(res) {
                // console.log(res);
            },
            fail: function(res) {
                // console.log(res);
            },
            complete: function(res) {
                // console.log(res.result);
                that.setData({
                    myAddress: res.result,
                    positionCity: res.result.address_component.city
                })
            }
        });
        // .search({
        //     keyword: '是',
        //     location: {
        //         latitude: that.data.currentLat,
        //         longitude: that.data.currentLon
        //     },
        //     complete: function(res) {
        //         console.log('qqmap_complete', res.data[0]);
        //         that.setData({
        //             myAddress: res.data[0]
        //         })
        //     }
        // });

    },
    selectAddress: function(e) {
        var that = this;
        var locationData = that.data.myAddress;
        // console.log(locationData)
        // console.log(locationData.address, locationData.formatted_addresses.recommend)
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.setData({
            addressData: locationData.address + locationData.formatted_addresses.recommend,
            addressDatas: locationData
        });
        // getApp().addressDatas = locationData
        wx.navigateBack({});
        prevPage.onLoad();
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
            url: "../selectCity/selectCity",
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
        // this.setData({

        // });
    }

})