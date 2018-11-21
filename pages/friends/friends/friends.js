// pages/friends/friends.js
var util = require("../../../utils/util.js");
var pinyin = require("../../../utils/pinyin.js");
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 当前选择的导航字母
        selected: 0,
        // 选择字母视图滚动的位置id
        scrollIntoView: 'A',
        // 导航字母
        letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
            'U', 'V', 'W', 'X', 'Y', 'Z', "ZZ"
        ],
        //默认选中关注
        currentTab: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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
        var that = this;
        wx.showLoading({
            title: "请稍等...",
        });
        // 互相关注
        wx.request({
            url: util.apiURL + "/api/isLogin/friends",
            header: {
                token: app.globalData.token
            },
            data: {
                userId: app.globalData.userId
            },
            success: function(friendsRes) {
                app.request_api_success(friendsRes, function() {
                    var friends = pinyin.getPyDataOther(friendsRes.data.data, "nickname");
                    that.setData({
                        friends
                    });
                    // 粉丝
                    res("/api/isLogin/fans", "fans");
                    // 关注
                    res("/api/isLogin/attention", "attention");
                    // 请求封装
                    function res(URL, dataName) {
                        wx.request({
                            url: util.apiURL + URL,
                            header: {
                                token: app.globalData.token
                            },
                            data: {
                                userId: app.globalData.userId
                            },
                            success: function(res) {
                                wx.hideLoading();
                                app.request_api_success(res, function() {
                                    res.data.data.sort(function(a, b) {
                                        return a.id - b.id
                                    });
                                    for (var i in res.data.data) {
                                        for (var j in friendsRes.data.data) {
                                            // 再删选，如果是互相关注的，在关注、粉丝列表不显示
                                            if (res.data.data[i].id == friendsRes.data.data[j].id) {
                                                res.data.data.splice(i, 1);
                                            }
                                        }
                                    }
                                    that.setData({
                                        [dataName]: pinyin.getPyDataOther(res.data.data, "nickname")
                                    });
                                });
                            },fail:function(res){ 
                                wx.hideLoading();
                                wx.showToast({
                                    title: "信息获取失败！",
                                    icon: "none",
                                    mask: true,
                                    duration: app.globalData.gShowTime
                                });
                            }
                        });
                    };
                })
            },
            fail: function(friendsRes) {
                wx.hideLoading();
                wx.showToast({
                    title: "好友获取失败！",
                    icon: "none",
                    mask: true,
                    duration: app.globalData.gShowTime
                });
                console.log("获取互相关注好友失败！");
            }
        });
        var that = this;
        //  高度自适应
        wx.getSystemInfo({
            success: function(res) {
                var clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR - 120;
                that.setData({
                    winHeight: calc
                });
            }
        });


        const res = wx.getSystemInfoSync(),
            letters = this.data.letters;
        // 设备信息
        this.setData({
            windowHeight: res.windowHeight,
            windowWidth: res.windowWidth,
            pixelRatio: res.pixelRatio
        });
        // 第一个字母距离顶部高度，单位使用的是rpx,须除以pixelRatio，才能与touch事件中的数值相加减，css中定义nav高度为94%，所以 *0.94
        const navHeight = this.data.windowHeight * 0.94, // 
            eachLetterHeight = navHeight / 27,
            comTop = (this.data.windowHeight - navHeight),
            temp = [];

        this.setData({
            eachLetterHeight: eachLetterHeight
        });

        // 求各字母距离设备左上角所处位置

        for (let i = 0, len = letters.length; i < len; i++) {
            const x = this.data.windowWidth - (10 + 50) / this.data.pixelRatio,
                y = comTop + (i * eachLetterHeight);
            temp.push([x, y]);
        }
        this.setData({
            lettersPosition: temp
        });
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
    // 字母点击事件
    tabLetter(e) {
        // const index = e.currentTarget.dataset.index;
        // if (index == "#") {
        //     console.log("点了#")
        //     this.setData({
        //         selected: index
        //     })
        //     // return false;
        // }
        // this.setData({
        //     selected: index,
        //     scrollIntoView: index
        // })

        // this.cleanAcitvedStatus();
    },
    // 清除字母选中状态
    cleanAcitvedStatus() {
        setTimeout(() => {
            this.setData({
                selected: 0
            })
        }, 500);
    },
    // 触摸移动
    touchmove(e) {
        // const x = e.touches[0].clientX,
        //     y = e.touches[0].clientY,
        //     lettersPosition = this.data.lettersPosition,
        //     eachLetterHeight = this.data.eachLetterHeight,
        //     letters = this.data.letters;
        // console.log(y);
        // // 判断触摸点是否在字母导航栏上
        // if (x >= lettersPosition[0][0]) {
        //     for (let i = 0, len = lettersPosition.length; i < len; i++) {
        //         // 判断落在哪个字母区域，取出对应字母所在数组的索引，根据索引更新selected及scroll-into-view的值
        //         const _y = lettersPosition[i][1], // 单个字母所处高度
        //             __y = _y + eachLetterHeight; // 单个字母最大高度取值范围， 50为字母高50rpx
        //         if (y >= _y && y <= __y) {
        //             this.setData({
        //                 selected: letters[i],
        //                 // scrollIntoView: letters[i]
        //             });
        //             break;
        //         }
        //     }
        // }
    },
    // 踪触摸时触发
    touchcancel: function() {

    },
    // 当手指从屏幕上移开时触发。
    touchend(e) {
        // this.cleanAcitvedStatus();
    },

    // 滚动切换标签样式
    switchTab: function(e) {
        this.setData({
            currentTab: e.detail.current
        });
        this.checkCor();
    },
    // 点击标题切换当前页时改变样式
    swichNav: function(e) {
        var cur = e.target.dataset.current;
        if (this.data.currentTaB == cur) {
            return false;
        } else {
            this.setData({
                currentTab: cur
            })
        }
    },
    //判断当前滚动超过一屏时，设置tab标题滚动条。
    checkCor: function() {
        if (this.data.currentTab > 4) {
            this.setData({
                scrollLeft: 300
            })
        } else {
            this.setData({
                scrollLeft: 0
            })
        }
    },
    //获取当前滑块的index
    bindchange: function(e) {
        const that = this;
        that.setData({
            currentData: e.detail.current
        })
    },
    // 好友详情
    friendMessage: function(e) {
        // console.log(e.currentTarget.dataset);
        wx.navigateTo({
            url: "/pages/friends/friendMsg/friendMsg?id=" + e.currentTarget.dataset.id
        });
    }
})