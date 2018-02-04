var _ = require('lodash');
var moment = require('moment');
moment.locale('fr');

function splitTime(time) {
    var s = time.split(":");
    return [Number(s[0]), Number(s[1])];
}

function timeToFloat(time) {
    var _in = splitTime(time);
    return (_in[0] + (_in[1] * 0.01)) * 1.0;
}

function timeOfDateTimeToFloat(date) {
    //var date = moment.utc(date).toDate();
    var result = date.getHours() + date.getMinutes() * 0.01;
    return result;
}

function dayOfWeek(date) {
    return moment(date).isoWeekday();
}

function compareTimeOfDate(date1, date2) {
    return timeOfDateTimeToFloat(date1) > timeOfDateTimeToFloat(date2);
}

function compareTime(time1, time2) {
    return timeToFloat(time1) <= timeToFloat(time2);
}

function makeDateTime(year, month, day, hour, minute) {
    if (_.isString(hour)) {
        var _in = hour.split(":");
        hour = Number(_in[0]);
        minute = Number(_in[1]);
    }
    return moment().year(year).month(month).day(day).hour(hour).minute(minute);
}
module.exports = {
    timeToFloat: timeToFloat,
    timeOfDateTimeToFloat: timeOfDateTimeToFloat,
    dayOfWeek: dayOfWeek,
    compareTimeOfDate: compareTimeOfDate,
    compareTime: compareTime,
    makeDateTime: makeDateTime,
    splitTime: splitTime
}