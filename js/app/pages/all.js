import * as dateTimeHelper from "./../core/datetime_helper";
import * as settingRepository from '../data/setting_repository';


function changeReportTextToCurrentMonth()
{
    var dateObject = new Date();
    var currentMonth = dateObject.getMonth() + 1;
    var currentYear = dateObject.getFullYear();
    $("#reportBtnTop").html(dateTimeHelper.getCurrentMonth() + " Report").attr("href", "/report/list.html?year=" + currentYear + "&month=" + currentMonth);
}

async function setSettingObject()
{
    var result = await settingRepository.getSetting()

    if(result.response.data) {
        window.setting = result.response.data;
    }
} 

jQuery(async function () {
    changeReportTextToCurrentMonth();
    setSettingObject();
})
