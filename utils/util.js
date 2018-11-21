// const apiURL = "http://www.crowdtechcorp.com";
const apiURL = "http://www.crowdtechcorp.com:8181"
const labelTag = apiURL + "/api/labelTag?tdsourcetag=s_pcqq_aiomsg";

const formatTime = date => {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const getTodayDate = function getTodayDate() {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return Y + "-" + M + "-" + D;
};

// 月日星期
const time1970 = function time1970(time) {
    if (time == undefined) {
        console.error("time is undefined");
        return false;
    }
    var date = new Date(time / 1000 * 1000);
    var Y = date.getFullYear() + '-';
    var M = twoBit(date.getMonth() + 1, "月");
    var D = twoBit(date.getDate(), "日");
    var h = twoBit(date.getHours(), ":");
    var m = twoBit(date.getMinutes(), ":");
    var s = twoBit(date.getSeconds(), "");
    var w = "周" + "日一二三四五六".charAt(date.getDay());
    return M + D + " " + w;
};

// 两位 2 -> 02;
function twoBit(obj, mark) {
    return (obj < 10 ? '0' + obj : obj) + mark;
};

// 时间戳转日期时间
const time1970num = function time1970num(time) {
    if (time == undefined) {
        console.error("time is undefined");
        return false;
    }
    var date = new Date(time / 1000 * 1000);
    var Y = date.getFullYear() + '-';
    var M = twoBit(date.getMonth() + 1, "-");
    var D = twoBit(date.getDate(), "");
    var h = twoBit(date.getHours(), ":");
    var m = twoBit(date.getMinutes(), ":");
    var s = twoBit(date.getSeconds(), "");
    return Y + M + D + " " + h + m + s;
};

// 生日时间戳转年龄
const birthdayToAge = function birthdayToAge(birthday) {
    var date = new Date();
    var Y = date.getFullYear();
    var M = date.getMonth() + 1;
    var D = date.getDate();
    var birthdayStr = time1970num(birthday)
    var arr = birthdayStr.split(" ")[0].split("-");
    var age = 0;

    if (Y >= parseInt(arr[0])) {
        age = Y - parseInt(arr[0]);
        if (M > parseInt(arr[1]) && D > parseInt(arr[2])) {
            age = age + 1;
        }
        if (M == parseInt(arr[1]) && D == parseInt(arr[2])) {
            // 生日
            console.log("Happy__Birthday +^_^+");
        }
    } else {
        console.error("当前时间小于出生时间=_=??");
    }

    return age;
};

// 一天各个小时数组,从零点开始
const dateTimeArr = function dateTimeArr() {
    var dateTime = [];
    for (var i = 0; i < 24; i++) {
        dateTime.push(formatNumber(i) + ":00");
    }
    return dateTime;
}

// 时间戳转时间(24h)
function getTime24(timestamp) {
    var nowTime = new Date();
    var endTime = new Date(timestamp * 1000);
    var t = endTime.getTime() - nowTime.getTime();
    var hour = Math.floor(t / 1000 / 60 / 60 % 24);
    var min = Math.floor(t / 1000 / 60 % 60);
    var sec = Math.floor(t / 1000 % 60);
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    return hour + ":" + min + ":" + sec;
};

module.exports = {
    formatTime: formatTime,
    getTodayDate: getTodayDate,
    apiURL: apiURL,
    labelTag: labelTag,
    time1970: time1970,
    time1970num: time1970num,
    birthdayToAge: birthdayToAge,
    dateTimeArr: dateTimeArr,
    getTime24
}












// getTodayDate: function() {
//     var timestamp = Date.parse(new Date());
//     var date = new Date(timestamp);
//     var Y = date.getFullYear();
//     var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
//     var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
//     return Y + "-" + M + "-" + D;
// }