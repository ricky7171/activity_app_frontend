import * as alertHelper from "./../core/alert_helper";
import * as loadingHelper from "./../core/loading_helper";
import * as templateHelper from "./../core/template_helper";
import * as colorHelper from "./../core/color_helper";
import ActivityService from "./../business_logic/service/activityService";
import ActivityDataProxy from "./../data_proxy/activityDataProxy";

class FormView {
  constructor() {
    this.defaultValue = {
      title: "",
      value: "",
      target: "",
      description: "",
      color: "#4e73df",
    };

    this.activityService = new ActivityService(new ActivityDataProxy());
    this.tableElement = $(".table-responsive");
  }

  /**
   * Fetch all activities data
   */
  async fetchActivities() {
    this.tableElement.hide();

    loadingHelper.toggleLoading(true);
    const command = await this.activityService.getAllCommand().execute();

    if (command.success) {
      const activitiesData = command.value;
      if (activitiesData.success) {
        this.showActivitiesData(activitiesData.response.data);
        loadingHelper.toggleLoading(false);
        this.tableElement.show();
        $("div.form-wrapper").show();
      }
    }
  }

  /**
   * Render activities data to table
   *
   * @param {array} activities
   */
  showActivitiesData(activities) {
    //clear activities
    $(".list-activity").empty();

    if (!activities.length) {
      const rowEmptyContentTpl = $(
        'script[data-template="row-empty-content"'
      ).text();
      $(".list-activity").html(rowEmptyContentTpl);
      $(".list-activity").find(".empty-content").show();
    }

    //prepare template
    var rowActivitiesTpl = $('script[data-template="row-activity"').text();

    //generate row activity, then put it on .list-activity
    $(".list-activity").append(
      activities.map(function (activityData, i) {
        var html = templateHelper.render(rowActivitiesTpl, {
          title: activityData["title"],
          value: activityData["default_value"],
          target: activityData["target"],
          description: activityData["description"],
          color: activityData["color"],
          id: activityData["id"],
          textColor: colorHelper.isDark(activityData["color"])
            ? "#ffffff"
            : "#000000",
        });

        html = $(html);
        html.data("activity", activityData);

        return html;
      })
    );
  }

  async handleClickSubmitButton() {
    // - get data
    const attributes = {
      title: $("#title").val(),
      default_value: $("#value").val(),
      target: $("#target").val(),
      description: $("#description").val(),
      color: $("#color").val(),
      can_change: $("#is_editable").prop("checked") ? 1 : 0,
      use_textfield: $("#is_use_textfield").prop("checked") ? 1 : 0,
      type: $('#is_time_as_speed_target').prop("checked") ? "timespeed" : "text",
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
    console.log("🚀 ~ file: form.js ~ line 118 ~ FormView ~ handleClickSubmitButton ~ result", result)
    if (result.success) {
      alertHelper.showSnackBar("Successfully added !", 1);

      // - set form to default value
      $("#title").val(this.defaultValue.title);
      $("#value").val(this.defaultValue.value);
      $("#target").val(this.defaultValue.target);
      $("#description").val(this.defaultValue.description);
      $("#is_editable").prop("checked", false);
      $("#is_use_textfield").prop("checked", false);
      colorHelper.updateColorOfInput("#color", this.defaultValue.color);

      // - refresh activities data
      this.fetchActivities();
    } else {
      loadingHelper.toggleLoading(false);
    }
  }

  /**
   * Handle Change is_use_textfield element
   *
   * if is_use_textfield true set is editable true
   * @param {bool} isChecked
   */
  handleChangeUseTextfield(isChecked, isFormEdit) {
    const valueEl = isFormEdit ? $("#value2") : $("#value");
    const editableEl = isFormEdit ? $("#is_editable2") : $("#is_editable");

    if (isChecked) {
      valueEl.val(0);
      valueEl.prop("disabled", true);
      editableEl.prop("checked", true);
    } else {
      valueEl.val(0);
      valueEl.prop("disabled", false);
    }
  }

  handleChangeTimeSpeedTarget(evt, isFormEdit = false) {
    const useTextfieldEl = $("#is_use_textfield");
    const editableEl = isFormEdit ? $("#is_editable2") : $("#is_editable");
    this.handleChangeUseTextfield(true);
    useTextfieldEl.prop('checked', true);
    $('#target').prop('type', 'text');
  }

  async handleClickDeleteButton(evt) {
    // - show confirmation popup
    var result = await alertHelper.showConfirmation(
      "Your activity will be delete and cannot be restore"
    );

    // - if user cancel delete
    if (!result.isConfirmed) return;

    // - delete activity
    // o show loading
    loadingHelper.toggleLoading(true);

    // o get activity id
    const activityId = $(evt).attr("activityId");

    // o run command
    const command = await this.activityService
      .destroyCommand(activityId)
      .execute();

    // o hide loading
    loadingHelper.toggleLoading(false);

    // o show success message if success delete
    if (command.success) {
      const result = command.value;
      if (result.success) {
        alertHelper.showSuccess("successfully deleted !");
        this.fetchActivities();
      }
    }
  }

  async handleClickEditButton(evt) {
    const btn = $(evt);
    const tr = btn.closest("tr");
    const activityData = tr.data("activity");
    const modalEdit = $("#modalEdit");

    // set form
    modalEdit.find("#title2").val(activityData.title);
    modalEdit.find("#value2").val(activityData.default_value);
    modalEdit.find("#target2").val(activityData.target);
    modalEdit.find("#description2").val(activityData.description);
    colorHelper.updateColorOfInput(
      modalEdit.find("#color2"),
      activityData.color
    );
    modalEdit
      .find("#is_editable2")
      .prop("checked", activityData.can_change == 1);
    modalEdit
      .find("#is_use_textfield2")
      .prop("checked", activityData.use_textfield == 1);
    modalEdit.find("input[name=activity_id]").val(activityData.id);
    modalEdit.modal("show");
  }

  async handleClickUpdateButton() {
    const attributes = {
      id: $("#modalEdit").find("input[name=activity_id]").val(),
      title: $("#title2").val(),
      default_value: $("#value2").val(),
      target: $("#target2").val(),
      color: $("#color2").val(),
      description: $("#description2").val(),
      can_change: $("#is_editable2").prop("checked") ? 1 : 0,
      use_textfield: $("#is_use_textfield2").prop("checked") ? 1 : 0,
      use_timespeedtarget: $('#is_time_as_speed_target2').prop('checked') ? 'timespeed' : 'text',
    };

    const command = await this.activityService
      .updateCommand(attributes)
      .execute();

    if (command.success == false) {
      const firstErrorMsg = command.errors[0].message;
      alertHelper.showError(firstErrorMsg);
      return;
    }

    const result = command.value;
    if (result.success) {
      alertHelper.showSnackBar("Successfully updated !", 1);
      // refresh activities data
      this.fetchActivities();

      $("#modalEdit").modal("hide");
    }
  }

  initialize() {
    this.fetchActivities();

    $("input[type=color]").spectrum({
      showInput: true,
      className: "full-spectrum",
      showInitial: true,
      showPalette: true,
      showSelectionPalette: true,
      maxSelectionSize: 10,
      preferredFormat: "hex",
    });

    // event handler
    $("#submit-btn").on("click", () => this.handleClickSubmitButton());
    $("body").on("change", "#is_use_textfield", (evt) =>
      this.handleChangeUseTextfield(evt.target.checked)
    );
    $("body").on("click", ".btn-delete-activity", (evt) =>
      this.handleClickDeleteButton(evt.target)
    );
    $("body").on("click", ".btn-edit-activity", (evt) =>
      this.handleClickEditButton(evt.target)
    );
    $("body").on("click", "#btn-update-activity", (evt) =>
      this.handleClickUpdateButton(evt.target)
    );
    $("body").on("change", "#is_use_textfield2", (evt) =>
      this.handleChangeUseTextfield(evt.target.checked, true)
    );
    $("body").on("change", "#is_time_as_speed_target", (evt) =>
      this.handleChangeTimeSpeedTarget(evt.target)
    );
    $("body").on("change", "#is_time_as_speed_target2", (evt) =>
      this.handleChangeTimeSpeedTarget(evt.target)
    );
  }
}

jQuery(async function () {
  new FormView().initialize();
});
