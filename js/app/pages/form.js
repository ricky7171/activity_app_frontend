import * as activityRepository from './../../../js/app/data/activity_repository';
import * as alertHelper from "./../core/alert_helper";
import * as loadingHelper from "./../core/loading_helper";
import * as templateHelper from "./../core/template_helper";
import * as colorHelper from "./../core/color_helper";

async function loadActivitiesData() {
    var result = await activityRepository.getActivities();
    return result;
}

function showActivitiesData(activities) {
    console.log("check data");
    console.log(activities);

    //clear activities
    $(".list-activity").empty();

    if(!activities.length) {
        var rowEmptyContentTpl = $('script[data-template="row-empty-content"').text();
        $('.list-activity').html(rowEmptyContentTpl);
        $('.list-activity').find('.empty-content').show();
    }
    
    //prepare template
    var rowActivitiesTpl = $('script[data-template="row-activity"').text();

    //generate row activity, then put it on .list-activity
    $(".list-activity").append(activities.map(function(activityData, i) {
        var html =  templateHelper.render(rowActivitiesTpl, {
            "title" : activityData["title"],
            "value" : activityData["default_value"],
            "target" : activityData["target"],
            "color" : activityData["color"],
            "id" : activityData['id'],
            "textColor": colorHelper.isDark(activityData['color']) ? '#ffffff' : '#000000'
        });


        html = $(html);
        html.data('activity', activityData)
        
        return html;
    }));
    
}

async function fetchActivities() {
    console.log('fetching.....')
    $('.table-responsive').hide();
    loadingHelper.toggleLoading(true);
    var activitiesData = await loadActivitiesData();
    if(activitiesData['success']) { 
        showActivitiesData(activitiesData['response']['data']);
        loadingHelper.toggleLoading(false);
        $('.table-responsive').show();
    }
}

async function deleteActivity(id) {
    var result = await activityRepository.deleteActivity(id);
    return result;
}

jQuery(async function () {
    $('input[type=color]').spectrum({
        showInput: true,
        className: "full-spectrum",
        showInitial: true,
        showPalette: true,
        showSelectionPalette: true,
        maxSelectionSize: 10,
        preferredFormat: "hex",
    });

    var defaultValue = {
        title: '',
        value: '',
        target: '',
        color: '#4e73df'
    };
    
    //event handler
    $("#submit-btn").on('click', async function(e) {
         //get title, value, target, canchange
         var title = $("#title").val();
         var value = $("#value").val();
         var target = $("#target").val();
         var color = $("#color").val();
         var canChange = 0;
         var useTextfield = 0;
         //validate if user use textfield, then it SHOULD EDITABLE
         //if user use textfield, but not use editable, it will return error
         if($("#is_use_textfield:checked").length > 0 && $("#is_editable:checked").length == 0) {
            alertHelper.showError("If you want to use textfield, then you should check 'is editable' !");
            return;
         }

         if($("#is_editable:checked").length > 0) {
             canChange = 1;
         }
         if($("#is_use_textfield:checked").length > 0) {
            useTextfield = 1;
         }
         if(title == "" || title == null || value == "" || value == null || target == "" || target == null || target <= 0 || !color) {
             alertHelper.showError("Failed to add activity, please fill all the fields !");
         }
         var result = await activityRepository.addActivity(title, value, target, canChange, useTextfield, color);
         if(result['success']) {
             alertHelper.showSnackBar("Successfully added !", 1);
             fetchActivities();

            $("#title").val(defaultValue.title);
            $("#value").val(defaultValue.value);
            $("#target").val(defaultValue.target);
            colorHelper.updateColorOfInput('#color', defaultValue.color);
         }
    });

    $("body").on('change', '#is_use_textfield', function() {
        if(this.checked) {
            $("#value").val(0);
            $("#value").prop("disabled", true);
            $("#is_editable").prop("checked", true);
        } else {
            $("#value").val(0);
            $("#value").prop("disabled", false);
        }
    });

    fetchActivities();

     //event handler
     $("body").on('click','.btn-delete-activity', async function() {
        var result = await deleteActivity($(this).attr("activityId"));
        if(result['success']) {
            alertHelper.showSuccess("successfully deleted !");
            fetchActivities();
        }
    });

    $("body").on('click','.btn-edit-activity', async function() {
        var btn = $(this);
        var tr = btn.closest('tr');
        var activityData = tr.data('activity');
        var modalEdit = $("#modalEdit");

        // set form
        modalEdit.find('#title2').val(activityData.title);
        modalEdit.find('#value2').val(activityData.default_value);
        modalEdit.find('#target2').val(activityData.target);
        colorHelper.updateColorOfInput(modalEdit.find('#color2'), activityData.color);
        modalEdit.find('#is_editable2').prop('checked', activityData.can_change == 1);
        modalEdit.find('#is_use_textfield2').prop('checked', activityData.use_textfield == 1);
        modalEdit.find('input[name=activity_id]').val(activityData.id);
        modalEdit.modal('show');
    });

    $("body").on('click','#btn-update-activity', async function() {
        //get title, value, target, canchange
        var id = $('#modalEdit').find('input[name=activity_id]').val();
        var title = $("#title2").val();
        var value = $("#value2").val();
        var target = $("#target2").val();
        var color = $("#color2").val();
        var canChange = 0;
        var useTextfield = 0;
        //validate if user use textfield, then it SHOULD EDITABLE
        //if user use textfield, but not use editable, it will return error
        if($("#is_use_textfield2:checked").length > 0 && $("#is_editable2:checked").length == 0) {
           alertHelper.showError("If you want to use textfield, then you should check 'is editable' !");
           return;
        }

        if($("#is_editable2:checked").length > 0) {
            canChange = 1;
        }
        if($("#is_use_textfield2:checked").length > 0) {
           useTextfield = 1;
        }
        if(title == "" || title == null || value == "" || value == null || target == "" || target == null || target <= 0 || !color) {
            alertHelper.showError("Failed to update activity, please fill all the fields !");
        }
        var result = await activityRepository.updateActivity(id, title, value, target, canChange, useTextfield, color);
        if(result['success']) {
            alertHelper.showSnackBar("Successfully updated !", 1);
            fetchActivities();
        }

        $('#modalEdit').modal('hide');
    });

})



