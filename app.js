//app.js
const util = require("/utils/util.js");
var inningsLabelTag = wx.getStorageSync("inningsLabelTag");
App({
    onLaunch: function() {
        var that = this;
        // // 检查用户是否授权
        wx.getSetting({
            success: function(res) {
                // console.log(res.authSetting["scope.userLocation"])
                if (res.authSetting["scope.userLocation"]) {
                    // console.log("用户已授权");
                    wx.getLocation({
                        success: function(res) {
                            that.globalData.lat = res.latitude;
                            that.globalData.lng = res.longitude;
                        },
                    });
                    // wx.getUserInfo({
                    //     success: function(res) {
                    //         // console.log(res)
                    //         that.globalData.userInfo.headimg = res.userInfo.avatarUrl;
                    //     }
                    // });
                } else {
                    // console.log("用户未授权");
                    // wx.navigateTo({
                    //     url: "/pages/modify/authorization/authorization?type=first",
                    // });
                }
            }
        });
        // 菜单请求
        wx.request({
            url: util.labelTag,
            success: function(res) {
                // console.log(res)
                if (res.data.data) {
                    // console.log("获取分类列表成功！");
                    wx.setStorageSync("inningsLabelTag", res);
                    that.labelTag = res.data.data;
                    // console.log(that.labelTag)
                } else {
                    if (inningsLabelTag == null || inningsLabelTag == "") {
                        // console.log("Success:没有缓存数据！");
                    } else {
                        // console.log("Success:读取缓存数据！");
                        that.labelTag = inningsLabelTag.data.data;
                    }
                }
            },
            fail: function() {
                if (inningsLabelTag == null || inningsLabelTag == "") {
                    console.log("Success:没有缓存数据！");
                } else {
                    console.log("Success:读取缓存数据！");
                    that.labelTag = inningsLabelTag.data.data;
                }
            }
        });
        // wx.createMapContext(mapid, this)
        // wx.showNavigationBarLoading()
        //     wx.getSetting({
        //         success: res => {
        //             console.log(res)
        //             if (!res.authSetting['scope.userInfo']) {
        //                 console.log('未授权')
        //                 wx.getUserInfo({
        //                     success: res => {
        //                         console.log(res)
        //                         this.globalData.userInfo = res.userInfo
        //                     },
        //                     fail: res => {
        //                         console.log('授权失败,手动授权')
        //                         this.showWarn()
        //                     }
        //                 })
        //             } else {
        //                 wx.getUserInfo({
        //                     success: res => {
        //                         console.log(res)
        //                         this.globalData.userInfo = res.userInfo
        //                     }
        //                 })
        //             }
        //         }
        //     })
        // },
        // showWarn: function() {
        //     wx.showModal({
        //         title: '必须授权才能进入小程序',
        //         content: '去授权吗？',
        //         showCancel: false,
        //         success: res => {
        //             console.log('点击了确认')
        //             wx.openSetting({
        //                 success: res => {
        //                     console.log(res)
        //                     if (res.authSetting['scope.userInfo']) {
        //                         wx.getUserInfo({
        //                             success: res => {
        //                                 console.log(res)
        //                                 this.globalData.userInfo = res.userInfo
        //                             }
        //                         })
        //                     } else {
        //                         this.showWarn()
        //                     }
        //                 }
        //             })
        //         }
        //     })
    },
    apiList: {
        labelTag: util.labelTag
    },
    globalData: {
        AppName: "HUI玩",
        appid: "wxe4db397b3c8fdc26",
        secret: "cb7be2db1e2d8eb90812fa1eae8b29cc",
        gShowTime: 2000,
        // 商家入驻模拟数据
        merchantInfo: {
            logo: null,
            shopName: null,
            address: null,
            phone: null,
            startTime: null,
            endTime: null,
            email: null,
            labelList: null,
            linkman: null,
            shopInfo: null,
            shopMealList: [],
            collectMode: null
        }
    },
    labelTag: [],
    // labelTag: [{
    //         id: 1,
    //         name: "桌游"
    //     },
    //     {
    //         id: 2,
    //         name: "运动户外"
    //     },
    //     {
    //         id: 3,
    //         name: "聚餐"
    //     },
    //     {
    //         id: 4,
    //         name: "夜店"
    //     },
    //     {
    //         id: 5,
    //         name: "KTV"
    //     },
    //     {
    //         id: 6,
    //         name: "电竞"
    //     },
    //     {
    //         id: 7,
    //         name: "棋牌"
    //     },
    //     {
    //         id: 8,
    //         name: "其他"
    //     }
    // ],
    // lazy loading openid
    getUserOpenId(callback) {
        const self = this

        if (self.globalData.openid) {
            callback(null, self.globalData.openid)
        } else {
            wx.login({
                success(data) {
                    wx.request({
                        url: openIdUrl,
                        data: {
                            code: data.code
                        },
                        success(res) {
                            console.log('拉取openid成功', res)
                            self.globalData.openid = res.data.openid
                            callback(null, self.globalData.openid)
                        },
                        fail(res) {
                            console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
                            callback(res)
                        }
                    })
                },
                fail(err) {
                    console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
                    callback(err)
                }
            })
        }
    },
    // 请求返回值处理,第三个参数可以为true或函数：区别：在为true时，请求参数不带token返回code可能为其他值，做兼容处理!
    /*
    假设：
     在普通请求成功后返回参数code中有code为2时，就必须添加第三个参数为true或fun，为true时，不做任何处理，为函数时候可以自定义对应code值返回用户显示内容
     在URL含有isLogin（或header含有token）请求中，不强制必须！
     （在普通请求中现有返回值-1，1，0，）
     */
    request_api_success(res, fun, fun_err) {
        var that = this;
        if (res.data.code == 0) {
            // 成功
            fun();
            return false;
        }
        wx.hideLoading();
        wx.hideToast();
        if (fun_err) {
            if (fun_err == true) {
                wx.showToast({
                    title: res.data.msg,
                    icon: "none",
                    mask: true,
                    duration: that.globalData.gShowTime,
                });
            } else {
                fun_err();
            }
            return false;
        }
        if (res.data.code == 1) {
            // 失败
            wx.showToast({
                title: res.data.msg,
                icon: "none",
                mask: true,
                duration: that.globalData.gShowTime,
            });
            return false;
        }
        if (res.data.code == 2) {
            // token失效
            wx.showToast({
                title: "登陆失效，重新登陆！",
                icon: "none",
                mask: true,
                duration: that.globalData.gShowTime,
            });
            var back_timer = setTimeout(function() {
                clearTimeout(back_timer);
                wx.clearStorage();
                wx.reLaunch({
                    url: "/pages/login/login/login",
                });
            }, that.globalData.gShowTime);
            return false;
        }
        if (res.data.code == 3) {
            // 账户冻结
            wx.showToast({
                title: "账户被冻结！",
                icon: "none",
                mask: true,
                duration: that.globalData.gShowTime,
            });
            var back_timer = setTimeout(function() {
                clearTimeout(back_timer);
                wx.clearStorage();
                wx.reLaunch({
                    url: "/pages/login/login/login",
                });
            }, that.globalData.gShowTime);
            return false;
        }
        console.log(res);
    }
})