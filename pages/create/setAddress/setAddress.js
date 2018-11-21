// pages/create/selectAddress/selectAddress.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        // 判断是否有地址信息（选择地址页面返回的）
        if (that.data.addressDatas) {
            that.setData({
                placeName: that.data.addressDatas.formatted_addresses.recommend,
                address: that.data.addressDatas.address
            });
            var arr = [];
            arr.push(that.data.addressDatas.formatted_addresses.recommend);
            arr.push(that.data.addressDatas.address);
            wx.setStorageSync("addressDatasOneMinute", arr);
        } else if (wx.getStorageSync("addressDatasOneMinute")) {
            var addressDatas = wx.getStorageSync("addressDatasOneMinute");
            that.setData({
                placeName: addressDatas[0],
                address: addressDatas[1]
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
    // 地点名称
    placeName: function(e) {
        this.setData({
            placeName: e.detail.value
        })
    },
    // 地址
    address: function(e) {
        this.setData({
            address: e.detail.value
        });
    },
    // 选择地址
    selectMapAddress: function() {
        wx.navigateTo({
            url: "/pages/search/selectMapAddress/selectMapAddress",
        });
    },
    // 确定
    query_ok: function() {
        var that = this;
        var pages = getCurrentPages();
        var prevPrevPage = pages[pages.length - 3];
        // console.log(that.data.placeName)
        // console.log(that.data.addressData)
        if (that.data.address && that.data.placeName) {
            prevPrevPage.setData({
                placeName: that.data.placeName,
                address: that.data.address,
                isUserInputAddress: true
            });
            var arr = [];
            arr.push(that.data.placeName);
            arr.push(that.data.address);
            wx.setStorageSync("addressDatasOneMinute", arr);
            wx.navigateBack({
                delta: 2
            });
            prevPrevPage.onLoad();
        }
    }
})