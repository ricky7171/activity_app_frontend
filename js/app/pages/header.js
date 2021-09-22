import * as loadingHelper from "./../core/loading_helper";
import ActivityService from "./../business_logic/service/activityService";
import ActivityDataProxy from "./../data_proxy/activityDataProxy";
import * as alertHelper from "./../core/alert_helper";
import * as colorHelper from "./../core/color_helper";

class HeaderView {
    constructor() {
        this.defaultValue = {
            title: "",
            value: "",
            target: "",
            description: "",
            color: "#4e73df",
        };

        this.activityService = new ActivityService(new ActivityDataProxy());
    }

    async handleClickSubmitButton() {
        // - get data
        const attributes = {
            title: $("#form_title").val(),
            default_value: $("#form_value").val(),
            target: $("#form_target").val(),
            description: $("#form_description").val(),
            color: $("#form_color").val(),
            can_change: $("#form_is_editable").prop("checked") ? 1 : 0,
            use_textfield: $("#form_is_use_textfield").prop("checked") ? 1 : 0,
        };

        // - show loading
        loadingHelper.toggleLoading(true);

        // - insert activity
        const command = await this.activityService
            .insertCommand(attributes)
            .execute();

        // - show error if there is error
        if (command.success == false) {
            console.log("check command errors");
            console.log(command.errors);
            const firstErrorMsg = command.errors[0].message;
            alertHelper.showError(firstErrorMsg);
            loadingHelper.toggleLoading(false);
            return;
        }

        // - show popup when success
        const result = command.value;
        if (result.success) {
            alertHelper.showSnackBar("Successfully added !", 1);

            // - set form to default value
            $("#form_title").val(this.defaultValue.title);
            $("#form_value").val(this.defaultValue.value);
            $("#form_target").val(this.defaultValue.target);
            $("#form_description").val(this.defaultValue.description);
            $("#form_is_editable").prop("checked", false);
            $("#form_is_use_textfield").prop("checked", false);

            $("#modalAddActivity").modal("hide");
            loadingHelper.toggleLoading(true);

        }


    }
    
    handleClickAddActivityButtonTop() {
        console.log("clicked");
        $("#modalAddActivity").modal("show");
    }
    
    handleChangeUseTextfield(isChecked, isFormEdit) {
        const valueEl = isFormEdit ? $("#form_value2") : $("#form_value");
        const editableEl = isFormEdit ? $("#form_is_editable2") : $("#form_is_editable");

        if (isChecked) {
            valueEl.val(0);
            valueEl.prop("disabled", true);
            editableEl.prop("checked", true);
        } else {
            valueEl.val(0);
            valueEl.prop("disabled", false);
        }
    }

    

    initialize() {

        // $("input[type=color]").spectrum({
        //     showInput: true,
        //     className: "full-spectrum",
        //     showInitial: true,
        //     showPalette: true,
        //     showSelectionPalette: true,
        //     maxSelectionSize: 10,
        //     preferredFormat: "hex",
        // });


        $("body").on('click', '#addActivityBtnTop', (evt) =>
            this.handleClickAddActivityButtonTop()
        );

        $("#form_submit_btn").on("click", () => this.handleClickSubmitButton());
        $("body").on("change", "#form_is_use_textfield", (evt) =>
            this.handleChangeUseTextfield(evt.target.checked)
        );




    }

}

$( document ).ready(function() {
    console.log("ready to init header");
    new HeaderView().initialize();
});
