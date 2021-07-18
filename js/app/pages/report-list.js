import * as activityRepository from './../../../js/app/data/activity_repository';
import * as templateHelper from "./../core/template_helper";
import * as dateTimeHelper from "./../core/datetime_helper";

async function loadActivityByMonthAndYear($month, $year) {
    var result = await activityRepository.getActivitiesByMonthAndYear($month, $year);
    return result;
}

function getMonthAndYearFromUrlParameter() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const month = urlParams.get('month');
    const year = urlParams.get('year');
    if(month == null || year == null) {
        return null;
    } else {
        return {
            "month" : month,
            "year" : year,
        };
    }
}

function getActivitiesSummaryFromResult(result) {
    var activitySummary = [];
    for(var i = 0;i<result.length;i++) {
        var score = 0;
        var count = result[i]["histories"].length;
        if(result[i]['use_textfield']) {
            score = count;
        } else {
            for(var j = 0;j<count;j++) {
                score += result[i]["histories"][j]["value"];
            }
        }
        activitySummary.push({
            "id" : result[i]["id"],
            "title" : result[i]["title"],
            "target" : result[i]["target"],
            "score" : score,
            "count" : count,
        });
    }
    return activitySummary;
}

function getDetailActivityFromResult(result, id, dataMonthAndYear) {
    //find activity detail
    var detailActivity = {};
    for(var i = 0;i<result.length;i++) {
        if(result[i]['id'] == id) {
            detailActivity = result[i];
            break;
        }
    }

    //fill year and month
    detailActivity["year"] = dataMonthAndYear["year"];
    detailActivity["month"] = dataMonthAndYear["month"];
    
    //get score
    var score = 0;
    var count = detailActivity["histories"].length;
    if(detailActivity["use_textfield"]) {
        score = count;
    } else {
        for(var i = 0;i<count;i++) {
            score += detailActivity["histories"][i]["value"];
        }
    }

    //fill score
    detailActivity["score"] = score;

    //get left
    var left = detailActivity["target"] - score;

    //fill left
    detailActivity["left"] = left;
    console.log("check detailactivity");
    console.log(detailActivity);
    return detailActivity;
    
}

function showActivitiesSummary(activities) {
    console.log("check data");
    console.log(activities);   

    //show report summary activity and hide report detail activity
    $(".report-summary-activity").show();
    $(".report-detail-activity").hide();

    //clear histories
    $(".report-summary-activity .data-activity-summary").empty();

    //prepare template
    var rowActivitySummaryTpl = $('script[data-template="row-activity-summary"').text();

    //render html
    $(".report-summary-activity .data-activity-summary").append(activities.map(function(activity) {
        return templateHelper.render(rowActivitySummaryTpl, {
            "activity_id" : activity["id"],
            "activity_name" : activity["title"],
            "target" : activity["target"],
            "score" : activity["score"],
            "count" : activity["count"],
        });
    }));
    
}

function showDetailActivity(detailActivity) {
    console.log("check data");
    console.log(detailActivity);

    //show report detail activity and hi hide report summary activity
    $(".report-summary-activity").hide();
    $(".report-detail-activity").show();

    //clear report heading, data report detail, footer report detail
    $(".report-detail-activity .report-heading").remove();
    $(".report-detail-activity .data-report-detail-activity").empty();
    $(".report-detail-activity .total-report-detail-activity").empty();

    //prepare template
    var reportHeadingTpl = $('script[data-template="report-heading"').text();
    var rowDataReportDetailActivityTpl = $('script[data-template="row-data-report-detail-activity"').text();
    var rowFooterReportDetailActivityTpl = $('script[data-template="row-footer-report-detail-activity"').text();

    //render html
    //- render heading
    $(".report-detail-activity").prepend(templateHelper.render(reportHeadingTpl, {
        "activity_name" : detailActivity["title"],
        "year" : detailActivity["year"],
        "month" : detailActivity["month"]
    }));

    //- render data report detail activity
    $(".report-detail-activity .data-report-detail-activity").append(detailActivity["histories"].map(function(history) {
        var value = null;
        if(history["value"] != null) {
            value = history["value"];
        } else if(history["value_textfield"] != null) {
            value = history["value_textfield"];
        } else {
            value = 0;
        }
        return templateHelper.render(rowDataReportDetailActivityTpl, {
            "date" : history["date"],
            "time" : history["time"],
            "value" : value,
        });
    }));

    //- render total report detail activity
    $(".report-detail-activity .total-report-detail-activity").append(templateHelper.render(rowFooterReportDetailActivityTpl, {
        "score" : detailActivity["score"],
        "target" : detailActivity["target"],
        "left" : detailActivity["left"]
    }));

    // change button back action
    $('#btnBack').on('click', function(e){
        console.log('clickkkk')
        e.preventDefault();

        $(".report-summary-activity").show();
        $(".report-detail-activity").hide();

        $('#btnBack').off();
    })
}

function changeReportTitleToCurrentMonth()
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const currentMonth = urlParams.get('month');
    const currentYear = urlParams.get('year');

    $("#titleContent").html("Report of " + dateTimeHelper.monthToText(currentMonth) + " " + currentYear);
}

jQuery(async function () {
    //change "report" text to current month
    changeReportTitleToCurrentMonth();

    var dataMonthAndYear = getMonthAndYearFromUrlParameter();
    var result = await loadActivityByMonthAndYear(dataMonthAndYear["month"], dataMonthAndYear["year"]);
    if(result['success']) { 
        var activitiesSummary = getActivitiesSummaryFromResult(result["response"]["data"]);
        showActivitiesSummary(activitiesSummary);
    }

    //event handler
    $("body").on('click', '.activity_button', function() {
        if(result['success']) {
            var activityId = $(this).attr("activityId");
            var detailActivity = getDetailActivityFromResult(result["response"]["data"], activityId, dataMonthAndYear);
            showDetailActivity(detailActivity);
        }  
    });
   

});