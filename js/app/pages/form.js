import * as activityRepository from './../../../js/app/data/activity_repository';
import * as alertHelper from "./../core/alert_helper";

async function addActivity(title, value, target, canChange, useTextfield) {
    var result = await activityRepository.addActivity(title, value, target, canChange, useTextfield);
    return result;
}


jQuery(async function () {

    //event handler
    $("body").on('click', '#submit-btn', async function() {

         //get title, value, target, canchange
         var title = $("#title").val();
         var value = $("#value").val();
         var target = $("#target").val();
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
         if(title == "" || title == null || value == "" || value == null || target == "" || target == null || target <= 0) {
             alertHelper.showError("Failed to add activity, please fill all the fields !");
         }
         var result = await addActivity(title, value, target, canChange, useTextfield);
         if(result['success']) {
             alertHelper.showSnackBar("Successfully added !", 1);
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

})



