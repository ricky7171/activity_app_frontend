import * as activityRepository from '../data/activity_repository';
import * as templateHelper from "../core/template_helper";





jQuery(async function () {
    // - declare state
    var activitiesData = [];

    // - startup
    await loadData();

    // - functions
    async function loadData() {
        activitiesData = await loadActivitiesData();
        if(activitiesData['success']) { 
            showActivitiesData(activitiesData['response']['data']);
        }
    }

    async function loadActivitiesData() {
        var result = await activityRepository.getActivities();
        return result;
    }
    
    function showActivitiesData(activities) {
    
        //clear histories
        $("#activity-list").empty();
    
        //prepare template
        var optionActivityTpl = $('script[data-template="option-activity"').text();
    
        //render template
        $("#activity-list").empty().append(activities.map(function(activity,i) {
            return templateHelper.render(optionActivityTpl, {
                "title" : activity['title'],
                'id' : activity['id'],
                'useTextfield' : activity['use_textfield'],
            });
        }));
        
    }
    
    
    async function deleteActivityData(activityId) {
        var result = await activityRepository.deleteActivity(activityId);
        return result;
    }
    

    // - event handler
    $("body").on('click','#delete-btn', async function() {
        //get activityId
        var activityId = $("#activity-list").find(":selected").val();

        if(!activityId) {
            alert("Please select your activity that you want to delete");
            return;
        }
        
        var result = await deleteActivityData(activityId);
        if(result['success']) {
            await loadData();
            alert("successfully deleted !");
        }
        
    });

})