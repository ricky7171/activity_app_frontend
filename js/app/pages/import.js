import * as historyRepository from './../../../js/app/data/history_repository';
import * as activityRepository from './../../../js/app/data/activity_repository';
import * as templateHelper from "./../core/template_helper";
import * as alertHelper from "./../core/alert_helper";

async function loadActivitiesData() {
    var result = await activityRepository.getActivities();
    return result;
}

function showActivitiesData(activities) {
    console.log("check data");
    console.log(activities);

    //clear histories
    $("#importer").empty();

    //prepare template
    var optionActivityTpl = $('script[data-template="option-activity"').text();

    //render template
    $("#importer").append(activities.map(function(activity,i) {
        return templateHelper.render(optionActivityTpl, {
            "title" : activity['title'],
            'id' : activity['id'],
            'useTextfield' : activity['use_textfield'],
        });
    }));
    
}

async function bulkStoreHistoriesData(inputHistories, activityId) {
    var result = await historyRepository.bulkStoreHistoriesData(inputHistories, activityId);
    return result;
}

jQuery(async function () {
    var activitiesData = await loadActivitiesData();
    if(activitiesData['success']) { 
        showActivitiesData(activitiesData['response']['data']);
    }

    //event handler
    $("body").on('click','#submit-btn', async function() {
        //get activityId
        var activityId = $("#importer").find(":selected").val();
        var useTextfield = $("#importer").find(":selected").attr("useTextfield");


        //get input history
        var plainInput = $("textarea[name='histories']").val();
        var inputHistories = [];
        try {
            console.log("check palinInput");
            console.log(plainInput);
            inputHistories = plainInput.split("\n").map(function(row) {
                var rowSplitted = row.split(", ");
                if(useTextfield == "1") {
                    return {
                        "date" : rowSplitted[0],
                        "time" : rowSplitted[1],
                        "value_textfield" : rowSplitted[2],
                    }
                } else {
                    return {
                        "date" : rowSplitted[0],
                        "time" : rowSplitted[1],
                        "value" : rowSplitted[2],
                    }
                }
            });
        } catch (error) {
            console.log(error);
            alertHelper.showError("your input format is wrong");
            
            return;
        }
        
        var result = await bulkStoreHistoriesData(inputHistories, activityId);
        if(result['success']) {
            alertHelper.showSuccess("successfully added !");
        }
    });

})