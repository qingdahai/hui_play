// pages/myInningsDetails/pay/pay.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        gratuities: "选择小费比例",
        gratuitiesList: [],
        gratuitiesListMoney: [],
        tipRate: [8, 10, 12],
        useIntegralInput: "未选择",
        gratuity: 0, //小费
        taxPrice: 0, //税价
        serviceCharge: 0, //服务费
        totalPrice: 0, //总计
        showModalSelectIntegral: true, // 折扣分显示
        showModalPaySuccess: true,
        hideCreateInning: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this,
            inningData = wx.getStorageSync("inningData"),
            mealList = wx.getStorageSync("mealList"),
            pagePayData = wx.getStorageSync("pagePayData"),
            gratuitiesList = [],
            gratuitiesListMoney = [];

        if (options.create) {
            for (var i in pagePayData.shopMealList) {
                if (pagePayData.shopMealList[i].active) {
                    inningData = pagePayData
                    that.setData({
                        hideCreateInning: true,
                        inningData: inningData,
                        mealData: pagePayData.shopMealList[i],
                        taxPrice: parseFloat(pagePayData.shopMealList[i].price) / 2,
                        mealId: pagePayData.shopMealList[i].id,
                    });
                    // 小费计算
                    for (var j in that.data.tipRate) {
                        //（ 套餐价格 + 税 ）* 小费比率
                        var money = ((parseFloat(pagePayData.shopMealList[i].price) + parseFloat(that.data.taxPrice)) * parseFloat(that.data.tipRate[j]) / 100).toFixed(2);
                        gratuitiesList.push(that.data.tipRate[j] + "%(￥" + money + ")");
                        gratuitiesListMoney.push(money)
                    }
                    that.setData({
                        gratuitiesListMoney: gratuitiesListMoney,
                        gratuitiesList: gratuitiesList,
                    });
                    break;
                }
            }
            return false;
        }
        that.setData({
            inningData: inningData,
            mealList: mealList,
            mealId: options.id
        });
        for (var i in mealList) {
            if (mealList[i].id == options.id) {
                that.setData({
                    mealData: mealList[i],
                    taxPrice: mealList[i].price / 2
                });
                // 小费计算
                for (var j in that.data.tipRate) {
                    var money = ((mealList[i].price + that.data.taxPrice) * that.data.tipRate[j] / 100).toFixed(2);
                    gratuitiesList.push(that.data.tipRate[j] + "%(￥" + money + ")");
                    gratuitiesListMoney.push(money)
                }
                that.setData({
                    gratuitiesListMoney: gratuitiesListMoney,
                    gratuitiesList: gratuitiesList,
                });
                break;
            }
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
    // 小费选择
    selectGratuities: function() {
        var that = this;
        var arr = that.data.gratuitiesList;
        wx.showActionSheet({
            itemList: arr,
            itemColor: "#000",
            success: function(res) {
                if (!res.cancel) {
                    var gratuity = parseFloat(that.data.gratuitiesListMoney[res.tapIndex]);
                    that.setData({
                        tapIndex: res.tapIndex, // 选择的第几个
                        gratuities: arr[res.tapIndex], //小费比率
                        totalPrice: (gratuity + parseFloat(that.data.mealData.price) + parseFloat(that.data.taxPrice) + that.data.serviceCharge).toFixed(2), //总计
                        gratuity: gratuity, //小费
                        red: "red",
                    });
                } else {
                    that.setData({
                        gratuities: "选择小费比例",
                        red: ""
                    });
                }
            }
        })
    },
    // 显示选择输入使用组局分
    useIntegralInput: function() {
        if (this.data.useIntegralInput == "未选择") {
            this.setData({
                showModalSelectIntegral: false,
                useIntegralInput: 0
            })
        } else {
            this.setData({
                showModalSelectIntegral: false
            })
        }
    },
    // 取消使用组局分
    myModalCancel: function() {
        if (this.data.useIntegralInput == "未选择") {
            this.setData({
                showModalSelectIntegral: true,
                useIntegralInput: "未选择"
            })
        } else {
            this.setData({
                showModalSelectIntegral: true
            })
        }
    },
    // 确定使用组局分
    myModalOk: function() {
        this.setData({
            showModalSelectIntegral: true
        });
    },
    // 使用组局分输入框监听
    inputVal: function(e) {
        this.setData({
            useIntegralInput: e.detail.value
        })
    },
    // 使用组局分加
    myModalAdd: function() {
        if (this.data.useIntegralInput < 20) {
            this.setData({
                useIntegralInput: this.data.useIntegralInput + 1
            });
        }
        // console.log(this.data.useIntegralInput)
    },
    // 使用组局分减
    myModalMinus: function() {
        if (this.data.useIntegralInput > 1) {
            this.setData({
                useIntegralInput: this.data.useIntegralInput - 1
            });
        }
        // console.log(this.data.useIntegralInput)
    },
    // 支付按钮
    query_ok: function() {
        var that = this;
        var integralPay = 0;
        if (!that.data.tipRate[that.data.tapIndex]) {
            wx.showToast({
                title: "请选择小费",
                icon: "none",
                duration: app.globalData.gShowTime
            })
            return false;
        }
        if (that.data.useIntegralInput == "未选择") {
            integralPay = 0
        } else {
            integralPay = parseInt(that.data.useIntegralInput)
        }
        // console.log(app.globalData.userId)
        // console.log(that.data.mealId)
        // console.log(that.data.tipRate[that.data.tapIndex])
        // console.log(that.data.gratuity)
        // console.log(that.data.totalPrice);
        wx.showLoading({
            title: "加载中...",
            mask: true,
        })
        //创建局支付
        if (this.data.hideCreateInning) {
            wx.request({
                url: util.apiURL + "/api/payment/new_order",
                data: {
                    userId: app.globalData.userId,
                    mealId: that.data.mealId,
                    integralPay: integralPay,
                    tipRate: that.data.tipRate[that.data.tapIndex],
                    tip: that.data.gratuity,
                    channel: "Wechat"
                },
                success: function(orderRes) {
                    // console.log(orderRes)
                    // 支付成功
                    // console.log(orderRes)
                    if (orderRes.data.code == 0) {
                        // console.log(orderRes.data.data.payInfo.sdk_params)
                        // 调取微信支付
                        // wx.requestPayment({
                        //     // appId: orderRes.data.data.payInfo.sdk_params.appid,
                        //     timeStamp: orderRes.data.data.payInfo.sdk_params.timestamp,
                        //     nonceStr: orderRes.data.data.payInfo.sdk_params.noncestr,
                        //     package: "prepay_id=" + orderRes.data.data.payInfo.sdk_params.prepayid,
                        //     signType: "MD5",
                        //     paySign: orderRes.data.data.payInfo.sdk_params.sign,
                        //     success: function(paySuccessRes) {
                        //         wx.hideLoading();
                        //         // 支付成功
                        //         console.log(paySuccessRes)
                        //         // wx.request({
                        //         //     url: util.apiURL + "/api/payment/notify",
                        //         //     data: {
                        //         //         order_id: orderRes.data.data.payInfo.order_id,
                        //         //         channel: "Wechat"
                        //         //     },
                        //         //     success: function(payCallback) {

                        //         //     }
                        //         // })
                        //     },
                        //     fail: function(orderRes) {
                        //         //支付失败
                        //         console.error(orderRes);
                        //         wx.hideLoading();
                        //         wx.showToast({
                        //             title: orderRes.err_desc,
                        //             icon: "none",
                        //             mask: true,
                        //             duration: app.globalData.gShowTime
                        //         })
                        //     }
                        // })

                        /**假如支付成功*********************************************************************************/
                        // 获取订单回调
                        wx.request({
                            url: util.apiURL + "/api/payment/notify",
                            data: {
                                order_id: orderRes.data.data.payInfo.order_id,
                                channel: "Wechat"
                            },
                            success: function(payCallback) {
                                var createInningDatas = wx.getStorageSync("createInningData_data");
                                if (!createInningDatas.classifyId) {
                                    createInningDatas.classifyId = 0;
                                }
                                createInningDatas.orderNo = orderRes.data.data.orderNo
                                console.log(createInningDatas)
                                wx.request({
                                    url: util.apiURL + "/api/isLogin/gameRoom",
                                    header: {
                                        token: app.globalData.token
                                    },
                                    method: "POST",
                                    data: createInningDatas,
                                    success: function(resGameRoom) {
                                        // console.log(getCurrentPages())
                                        wx.hideLoading();
                                        if (resGameRoom.data.code == 0) {
                                            console.log(resGameRoom)
                                            wx.showToast({
                                                title: resGameRoom.data.msg,
                                                icon: "none",
                                                mask: true,
                                                duration: app.globalData.gShowTime
                                            });

                                            wx.navigateTo({
                                                url: '/pages/inning/inningUnderway/inningUnderway?id=' + resGameRoom.data.data.id,
                                            })
                                        } else {
                                            wx.showToast({
                                                title: resGameRoom.data.msg,
                                                icon: "none",
                                                mask: true,
                                                duration: app.globalData.gShowTime
                                            });
                                            console.log(resGameRoom)
                                        }
                                    }
                                });
                            }
                        })
                    } else {
                        wx.showToast({
                            title: orderRes.data.msg,
                            icon: "none",
                            duration: app.globalData.gShowTime,
                            mask: true
                        });
                    }

                },
                fail: function(orderRes) {
                    wx.hideLoading();
                    wx.showToast({
                        title: "支付失败",
                        icon: "none",
                        mask: true,
                        duration: app.globalData.gShowTime
                    });
                }
            })
        } else {
            // 入局支付
            wx.request({
                url: util.apiURL + "/api/payment/new_order",
                data: {
                    userId: app.globalData.userId,
                    mealId: that.data.mealId,
                    integralPay: integralPay,
                    tipRate: that.data.tipRate[that.data.tapIndex],
                    tip: that.data.gratuity,
                    channel: "Wechat"
                },
                success: function(orderRes) {
                    console.log(orderRes)
                    console.log(orderRes.data.data.payInfo)
                    if (orderRes.data.code == 0) {
                        // 调取微信支付
                        wx.requestPayment({
                            // appId: orderRes.data.data.payInfo.sdk_params.appid,
                            // timeStamp: orderRes.data.data.payInfo.sdk_params.timestamp,
                            // nonceStr: orderRes.data.data.payInfo.sdk_params.noncestr,
                            // package: orderRes.data.data.payInfo.sdk_params.package,
                            // signType: 'MD5',
                            // paySign: orderRes.data.data.payInfo.sdk_params.sign,
                            // appId: orderRes.data.data.payInfo.sdk_params.appid,
                            timeStamp: orderRes.data.data.payInfo.sdk_params.timestamp,
                            nonceStr: orderRes.data.data.payInfo.sdk_params.noncestr,
                            package: "prepay_id=" + orderRes.data.data.payInfo.sdk_params.prepayid,
                            signType: "MD5",
                            paySign: orderRes.data.data.payInfo.sdk_params.sign,
                            success: function(paySuccessRes) {
                                // 支付成功
                                console.log(paySuccessRes)
                                wx.request({
                                    url: util.apiURL + "/api/isLogin/gameRoom/enterGameRoom" +
                                        "?userId=" + app.globalData.userId +
                                        "&gameRoomId=" + that.data.inningData.id +
                                        "&orderNo=" + orderRes.data.data.orderNo,
                                    header: {
                                        token: app.globalData.token
                                    },
                                    method: "POST",
                                    success: function(payCallback) {
                                        console.log(payCallback)
                                        wx.hideLoading();
                                        if (payCallback.data.code == 0) {
                                            wx.showToast({
                                                title: payCallback.data.msg,
                                                icon: "none",
                                                duration: app.globalData.gShowTime,
                                                mask: true
                                            });
                                        } else {
                                            wx.showToast({
                                                title: payCallback.data.msg,
                                                icon: "none",
                                                duration: app.globalData.gShowTime,
                                                mask: true
                                            });
                                        }
                                    },
                                    fail: function(res) {
                                        wx.hideLoading();
                                        console.log("支付成功，入局失败！")
                                        // 入局失败
                                    }
                                });
                            },
                            fail: function(orderRes) {
                                //支付失败
                                console.log(orderRes)
                                wx.hideLoading();
                                wx.showToast({
                                    title: orderRes.err_desc,
                                    icon: "none",
                                    duration: app.globalData.gShowTime,
                                    mask: true
                                });
                            }
                        });
                    } else {
                        console.log("new_order请求成功！数据获取失败！");
                        wx.hideLoading();
                        wx.showToast({
                            title: orderRes.data.msg,
                            icon: "none",
                            duration: app.globalData.gShowTime,
                            mask: true
                        });
                    }

                },
                fail: function(res) {
                    console.log("new_order请求失败");
                }
            });
        }



        // wx.request({
        //     url: "https://14592619.qcloud.la/payment",
        //     data: {
        //         openid
        //     },
        // })
        // wx.requestPayment({
        //     timeStamp: new Date().getTime(),
        //     nonceStr: '',
        //     package: '',
        //     signType: '',
        //     paySign: '',
        // })

        // app.getUserOpenId(function(err, openid) {
        //     if (!err) {
        //         wx.request({
        //             url: "https://tcb-api.tencentcloudapi.com",
        //             data: {
        //                 openid
        //             },
        //             method: 'POST',
        //             success(res) {
        //                 console.log('unified order success, response is:', res)
        //                 const payargs = res.data.payargs
        //                 wx.requestPayment({
        //                     timeStamp: payargs.timeStamp,
        //                     nonceStr: payargs.nonceStr,
        //                     package: payargs.package,
        //                     signType: payargs.signType,
        //                     paySign: payargs.paySign
        //                 })

        //                 self.setData({
        //                     loading: false
        //                 })
        //             }
        //         })
        //     } else {
        //         console.log('err:', err)
        //         self.setData({
        //             loading: false
        //         })
        //     }
        // })
        // wx.request({
        //     url: util.apiURL + "/api/wxPay/payInfo",
        //     data: {
        //         userId: app.globalData.userId, //用户id
        //         mealId: that.data.mealId, // 套餐ID
        //         integralPay: that.data.useIntegralInput == "未选择" ? 0 : that.data.useIntegralInput, //支付的组局分，不用组局分传0
        //         tipRate: that.data.tipRate[that.data.tapIndex], //小费比率(百分号前的数字)
        //         tip: that.data.gratuity, //小费（税后价格*小费比率）
        //     },
        //     success: function(res) {
        //         console.log(res)
        //         if (res.data.code == 0) {
        //             wx.request({
        //                 url: util.apiURL + "/api/isLogin/gameRoom/enterGameRoom" +
        //                     "?userId=" + app.globalData.userId +
        //                     "&gameRoomId=" + that.data.inningData.id +
        //                     "&orderNo=" + res.data.data.orderNo,
        //                 header: {
        //                     token: app.globalData.token
        //                 },
        //                 method: "POST",
        //                 success: function(res) {
        //                     console.log(res)
        //                     wx.request({
        //                         url: "https://14592619.qcloud.la/payment",
        //                         data: {
        //                             openid
        //                         },
        //                     })
        //                     // wx.requestPayment({
        //                     //     timeStamp: new Date().getTime(),
        //                     //     nonceStr: '',
        //                     //     package: '',
        //                     //     signType: '',
        //                     //     paySign: '',
        //                     // })
        //                 }
        //             })
        //         } else {
        //             // console.error(res.data.msg);
        //         }
        //     }
        // });
        // this.setData({
        //     showModalPaySuccess: false
        // });
    },
    // 支付成功
    paySuccess: function() {
        this.setData({
            showModalPaySuccess: true
        });
    },
    /**
     * 支付函数
     * @param  {[type]} _payInfo [description]
     * @return {[type]}          [description]
     */
    // pay: function(_payInfo, success, fail) {
    //     var payInfo = {
    //         body: '',
    //         total_fee: 0,
    //         order_sn: ''
    //     }
    //     Object.assign(payInfo, _payInfo);
    //     if (payInfo.body.length == 0) {
    //         wx.showToast({
    //             title: '支付信息描述错误'
    //         })
    //         return false;
    //     }
    //     if (payInfo.total_fee == 0) {
    //         wx.showToast({
    //             title: '支付金额不能0'
    //         })
    //         return false;
    //     }
    //     if (payInfo.order_sn.length == 0) {
    //         wx.showToast({
    //             title: '订单号不能为空'
    //         })
    //         return false;
    //     }
    //     var This = this;
    //     This.getOpenid(function(openid) {
    //         payInfo.openid = openid;
    //         This.request({
    //             url: 'api/pay/prepay',
    //             data: payInfo,
    //             success: function(res) {
    //                 var data = res.data;
    //                 console.log(data);
    //                 if (!data.status) {
    //                     wx.showToast({
    //                         title: data['errmsg']
    //                     })
    //                     return false;
    //                 }
    //                 This.request({
    //                     url: 'api/pay/pay',
    //                     data: {
    //                         prepay_id: data.data.data.prepay_id
    //                     },
    //                     success: function(_payResult) {
    //                         var payResult = _payResult.data;
    //                         console.log(payResult);
    //                         wx.requestPayment({
    //                             'timeStamp': payResult.timeStamp.toString(),
    //                             'nonceStr': payResult.nonceStr,
    //                             'package': payResult.package,
    //                             'signType': payResult.signType,
    //                             'paySign': payResult.paySign,
    //                             'success': function(succ) {
    //                                 success && success(succ);
    //                             },
    //                             'fail': function(err) {
    //                                 fail && fail(err);
    //                             },
    //                             'complete': function(comp) {

    //                             }
    //                         })
    //                     }
    //                 })
    //             }
    //         })
    //     })
    // }    
})