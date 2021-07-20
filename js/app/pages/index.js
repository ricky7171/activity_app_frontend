import * as activityRepository from './../../../js/app/data/activity_repository';
import * as historyRepository from './../../../js/app/data/history_repository';
import * as templateHelper from "./../core/template_helper";
import * as alertHelper from "./../core/alert_helper";
import * as dateTimeHelper from "./../core/datetime_helper";
import * as mediaHelper from "./../core/media_helper";
import * as loadingHelper from "./../core/loading_helper";
import * as colorHelper from "./../core/color_helper";


async function loadActivitiesData() {
    var result = await activityRepository.getActivities();
    return result;
}

async function addHistory(activityId, inputValue, useTextfield) {
    var result = await historyRepository.addHistory(activityId, inputValue, useTextfield);
    return result;
}

function showActivitiesData(activities) {
    console.log("check data ");
    console.log(activities);

    //clear activities 
    $(".report-wrapper").empty();

    // prepare template
    var rowActivityFloatTpl = $('script[data-template="row-activity-float"]').text();
    var rowActivityTextfieldTpl = $('script[data-template="row-activity-textfield"]').text();
    var editableValueActivityTpl = $('script[data-template="editable-value-activity-template"').text();
    var disabledValueActivityTpl = $('script[data-template="disabled-value-activity-template"').text();

    //prepare content activity row for float value
    var contentActivityRowFloat = {
        "value_activity_left_side_html" : "",
        "title_left_side" : "",
        "value_activity_right_side_html" : "",
        "title_right_side" : ""
    };

    //prepare content activity row for textfield value
    var contentActivityRowTextfield = {
        "title" : "",
        "activity_id" : "",
    };
    
    var tempActivityRowFloatHtml = "";
    var tempActivityRowTextfieldHtml = "";

    function changeColorBtnActivity(color, el) {
        if(color) {
            el.find('.btn-add-value').css('background-color', color);
            el.find('.btn-add-value').css('color', colorHelper.isDark(color) ? '#ffffff' : '#000000');
        } else {
            el.find('.btn-add-value').css('background-color', '');
            el.find('.btn-add-value').css('color', '');
        }
    }
    
    var indexActivityRowFloat = -1;
    $(".report-wrapper").append(activities.map(function(activityData, i) {

        //if this activity NOT use textfield, then render it on report-wrapper first
        if(activityData["use_textfield"] == false) {

            //increase indexActivityRowFloat
            indexActivityRowFloat += 1;

            //if it's even, then it should clear contentActivityRowFloat first
            if(indexActivityRowFloat % 2 == 0) { 
                for (var key in contentActivityRowFloat) {
                    contentActivityRowFloat[key] = "";
                }
            }
    
            //fill activityValueHtml (it can be editable or disabled) with contentActivityValue
            var contentActivityValue = {
                "activity_id" : activityData["id"],
                "value" : activityData["default_value"],
            };
            var activityValueHtml = "";
            if(activityData["can_change"]) {
                activityValueHtml = templateHelper.render(editableValueActivityTpl, contentActivityValue);
            } else {
                activityValueHtml = templateHelper.render(disabledValueActivityTpl, contentActivityValue);
            }

            rowActivityFloatTpl = $(rowActivityFloatTpl);
            //fill contentActivityRowFloat
            if(contentActivityRowFloat["value_activity_left_side_html"] != "") { //it means, it should fill right side, after that, insert to report-wrapper
                changeColorBtnActivity(activityData['color'], rowActivityFloatTpl.find('.right-side'));
                rowActivityFloatTpl = rowActivityFloatTpl[0].outerHTML;
        
                contentActivityRowFloat["value_activity_right_side_html"] = activityValueHtml;
                contentActivityRowFloat["title_right_side"] = activityData["title"];
                tempActivityRowFloatHtml += templateHelper.render(rowActivityFloatTpl, contentActivityRowFloat);
            }
            
            if(contentActivityRowFloat["value_activity_left_side_html"] == "") { //it means, it should fill left side first
                changeColorBtnActivity(activityData['color'], rowActivityFloatTpl.find('.left-side'));
                rowActivityFloatTpl = rowActivityFloatTpl[0].outerHTML;

                contentActivityRowFloat["value_activity_left_side_html"] = activityValueHtml;
                contentActivityRowFloat["title_left_side"] = activityData["title"];
            } 
            
            console.log("🚀 ~ file: index.js ~ line 96 ~ $ ~ contentActivityRowFloat", contentActivityRowFloat)
        } else { //if this activity USE textfield, then save on the temporary variable, and render it later
            contentActivityRowTextfield["title"] = activityData["title"];
            contentActivityRowTextfield["activity_id"] = activityData["id"];

            rowActivityTextfieldTpl = $(rowActivityTextfieldTpl);
            changeColorBtnActivity(activityData['color'], rowActivityTextfieldTpl);
            rowActivityTextfieldTpl = rowActivityTextfieldTpl[0].outerHTML;
            tempActivityRowTextfieldHtml += templateHelper.render(rowActivityTextfieldTpl, contentActivityRowTextfield);
            return null;
        }
        
    }).join(''));

    //render list activity that use float
    
    //check whether last iteration is even or odd, if odd, then remove last element
    if(contentActivityRowFloat["value_activity_right_side_html"] == "" && contentActivityRowFloat["title_right_side"] == "" && contentActivityRowFloat["value_activity_left_side_html"] != "" && contentActivityRowFloat["title_left_side"] != "") { 
        tempActivityRowFloatHtml += templateHelper.render(rowActivityFloatTpl, contentActivityRowFloat);
        $(".report-wrapper").append(tempActivityRowFloatHtml);
        $(".report-wrapper .right-side").last().remove();
    } else {
        $(".report-wrapper").append(tempActivityRowFloatHtml);
    }


    //render list activity that use textfield
    $(".report-wrapper").append(tempActivityRowTextfieldHtml);

}


function changeReportTextToCurrentMonth()
{
    var dateObject = new Date();
    var currentMonth = dateObject.getMonth() + 1;
    var currentYear = dateObject.getFullYear();
    $("#reportBtnTop").html("See " + dateTimeHelper.getCurrentMonth() + " Report").attr("href", "/report-list.html?year=" + currentYear + "&month=" + currentMonth);
}

function addEventHandler() {
    //event handler
    $("body").on('click', '.row-activity-float .btn-add-value, .row-activity-textfield .btn-add-value', async function() {
        //get activity id and input value
        var elInput = $(this).parents(".input-activity-group").find(".input-activity-value");
        var activityId = elInput.attr("activityId");
        var useTextfield = elInput.is("[type=text]");
        var useNumberField = elInput.is("[type=number]");
        var inputValue = null;

        if(useNumberField || useTextfield) {
            inputValue = elInput.val();
        } else {
            inputValue = elInput.attr("value");
        }

        if(inputValue == null || inputValue == "") {
            alertHelper.showError("Please fill the value !");
            return;
        }
        
        var result = await addHistory(activityId, inputValue, useTextfield);
        if(result['success']) {
            alertHelper.showSnackBar("Successfully added !", 1);
            if(window.setting.beep_sound == 1) {
                mediaHelper.playBeepSound();
            }
        }
    })
}

jQuery(async function () {

    // changeReportTextToCurrentMonth();

    loadingHelper.toggleLoading(true);
    var activitiesData = await loadActivitiesData();
    if(activitiesData['success']) { 
        showActivitiesData(activitiesData['response']['data']);
        loadingHelper.toggleLoading(false);
    }

    addEventHandler();

})



