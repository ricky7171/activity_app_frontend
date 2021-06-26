import * as historyRepository from './../../../js/app/data/history_repository';
import * as templateHelper from "./../core/template_helper";
import * as dateTimeHelper from "./../core/datetime_helper";

async function loadHistoryRange() {
    var result = await historyRepository.getHistoryRange();
    return result;
}

function showHistoryRange(ranges) {
    console.log("check data");
    console.log(ranges);

    //clear histories
    $(".all-reports").empty();

    //prepare template
    var yearDataTpl = $('script[data-template="year-data"').text();
    var monthDataTpl = $('script[data-template="month-data"').text();

    //generate year & month data, then put it on .all-reports
    var yearDataHtml = "";
    for(var year in ranges) {
        var monthsDataHtml = ranges[year].map(function(history, i) {
            return templateHelper.render(monthDataTpl, {
                "year_number" : history["year"],
                "month_number" : history["month"],
                "month_text" : dateTimeHelper.monthToText(history['month']),
            });
        });
        yearDataHtml += templateHelper.render(yearDataTpl, {
            "year" : year,
            "months_data_html" : monthsDataHtml
        });
    }
    $(".all-reports").append(yearDataHtml);
    
}


jQuery(async function () {
    var rangeData = await loadHistoryRange();
    if(rangeData['success']) { 
        showHistoryRange(rangeData['response']['data']);
    }

})