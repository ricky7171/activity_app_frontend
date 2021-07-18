import * as dateTimeHelper from "./../core/datetime_helper";


function changeReportTextToCurrentMonth()
{
    var dateObject = new Date();
    var currentMonth = dateObject.getMonth() + 1;
    var currentYear = dateObject.getFullYear();
    $("#reportBtnTop").html(dateTimeHelper.getCurrentMonth() + " Report").attr("href", "/report/list.html?year=" + currentYear + "&month=" + currentMonth);
}

jQuery(async function () {
    changeReportTextToCurrentMonth();
})
