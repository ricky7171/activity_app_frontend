import * as activityRepository from './../../../js/app/data/activity_repository';
import * as historyRepository from './../../../js/app/data/history_repository';
import * as templateHelper from "./../core/template_helper";
import * as alertHelper from "./../core/alert_helper";
import * as dateTimeHelper from "./../core/datetime_helper";
import * as mediaHelper from "./../core/media_helper";
import * as loadingHelper from "./../core/loading_helper";
import * as colorHelper from "./../core/color_helper";


async function loadActivitiesData() {
    var result = await activityRepository.getActivitiesSortByPosition();
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
    // $(".report-wrapper").empty();

    // prepare template
    var rowActivityFloatTpl = $('script[data-template="row-activity-float"]').text();
    var rowActivityTextfieldTpl = $('script[data-template="row-activity-textfield"]').text();
    var editableValueActivityTpl = $('script[data-template="editable-value-activity-template"').text();
    var disabledValueActivityTpl = $('script[data-template="disabled-value-activity-template"').text();

    //prepare content activity row for float value
    var contentActivityRowFloat = {
        "value_activity_html" : "",
        "title" : "",
        "activity_id" : "",
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
    (activities.map(function(activityData, i) {
        contentActivityRowTextfield["activity_id"] = activityData["id"];

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
            rowActivityFloatTpl.find('.changepos-btn-wrapper').attr('data-activityId', activityData['id']);
            changeColorBtnActivity(activityData['color'], rowActivityFloatTpl);
            rowActivityFloatTpl = rowActivityFloatTpl[0].outerHTML;
            
            //fill contentActivityRowFloat
            contentActivityRowFloat["value_activity_html"] = activityValueHtml;
            contentActivityRowFloat["title"] = activityData["title"];

            tempActivityRowFloatHtml += templateHelper.render(rowActivityFloatTpl, contentActivityRowFloat);
        } else { //if this activity USE textfield, then save on the temporary variable, and render it later
            contentActivityRowTextfield["title"] = activityData["title"];
            rowActivityTextfieldTpl = $(rowActivityTextfieldTpl);
            rowActivityTextfieldTpl.find('.changepos-btn-wrapper').attr('data-activityId', activityData['id']);
            changeColorBtnActivity(activityData['color'], rowActivityTextfieldTpl);
            rowActivityTextfieldTpl = rowActivityTextfieldTpl[0].outerHTML;
            tempActivityRowTextfieldHtml += templateHelper.render(rowActivityTextfieldTpl, contentActivityRowTextfield);
            return null;
        }
        
    }).join(''));

    //render list activity that use float
    
    $(".report-wrapper").find('#float-wrapper').append(tempActivityRowFloatHtml);
    //render list activity that use textfield
    $(".report-wrapper").find('#text-wrapper').append(tempActivityRowTextfieldHtml);

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

function changePosition(direction = 'up', currentEl = null, parentEl = null) {
    var children = $(parentEl).children();
    var currentIndex = currentEl.index();
    var newIndex = direction == 'up' ? currentIndex-1 : currentIndex+1;
    var totalIndex = children.length-1;
    if(newIndex > totalIndex || newIndex < 0) {
        return;
    } 
    else {
        var temp = children[newIndex];
        children[newIndex] = children[currentIndex];
        children[currentIndex] = temp;
    }
    $(parentEl).html(children);

    handleChangePosition();
}

function getValuePositionOfActivities() {
    var values = $('.row-activity').map(function(){
        var btnPos = $(this).find('.changepos-btn-wrapper');
        var activityId = btnPos.data('activityid');

        return activityId;
    }).toArray();

    return values;
}

function handleChangePosition() {
    var value = getValuePositionOfActivities();
    activityRepository.updatePosition(value);
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

    $(document).on('click', '.btn-up', function() {
        var floatEl = $(this).closest('.row-activity-float');
        var textfieldEl = $(this).closest('.row-activity-textfield'); 
        if(floatEl.length) {
            var parentEl = '#float-wrapper';
            var currentEl = floatEl;
        } else if(textfieldEl.length) {
            var parentEl = '#text-wrapper';
            var currentEl = textfieldEl;
        }

        changePosition('up', currentEl, parentEl);
    });

    $(document).on('click', '.btn-down', function() {
        var floatEl = $(this).closest('.row-activity-float');
        var textfieldEl = $(this).closest('.row-activity-textfield'); 
        if(floatEl.length) {
            var parentEl = '#float-wrapper';
            var currentEl = floatEl;
        } else if(textfieldEl.length) {
            var parentEl = '#text-wrapper';
            var currentEl = textfieldEl;
        }

        changePosition('down', currentEl, parentEl);
    });
})



