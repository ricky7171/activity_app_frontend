export function getDateStandartFormat() {
    const dateObj = new Date();
    return dateObj.toISOString().split("T")[0];
}

function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
}

export function getTimeStandartFormat() {
    const dateObj = new Date();
    var h = dateObj.getHours();
    var m = dateObj.getMinutes();
    var s = dateObj.getSeconds();
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);
    return h + ":" + m + ":" + s;
}

export function monthToText(month) {
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month - 1];
}

export function getCurrentMonth() {
    var dateObject = new Date();
    var currentMonth = dateObject.getMonth();
    return monthToText(currentMonth);
}