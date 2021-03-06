import * as templateHelper from "./../core/template_helper";
import * as alertHelper from "./../core/alert_helper";
import * as mediaHelper from "./../core/media_helper";
import * as loadingHelper from "./../core/loading_helper";
import * as colorHelper from "./../core/color_helper";
import ActivityService from "../business_logic/service/activityService";
import ActivityDataProxy from "../data_proxy/activityDataProxy";
import HistoryService from "../business_logic/service/historyService";
import HistoryDataProxy from "../data_proxy/historyDataProxy";

class HomeView {
  constructor() {
    this.activityService = new ActivityService(new ActivityDataProxy());
    this.historyService = new HistoryService(new HistoryDataProxy());
  }

  async fetchActivities() {
    loadingHelper.toggleLoading(true);
    const command = await this.activityService
      .getSortByPositionCommand()
      .execute();

    if (command.success) {
      const activitiesData = command.value;
      if (activitiesData.success) {
        this.showActivitiesData(activitiesData.response.data);
        loadingHelper.toggleLoading(false);
      }
    }
  }

  showActivitiesData(dataSource) {
    const emptyContent = $("#empty-content");
    const reportWrapper = $(".report-wrapper");
    // prepare template
    let rowActivityFloatTpl = $(
      'script[data-template="row-activity-float"]'
    ).text();
    let rowActivityTextfieldTpl = $(
      'script[data-template="row-activity-textfield"]'
    ).text();
    const editableValueActivityTpl = $(
      'script[data-template="editable-value-activity-template"'
    ).text();
    const disabledValueActivityTpl = $(
      'script[data-template="disabled-value-activity-template"'
    ).text();

    if (!dataSource.length) {
      emptyContent.show();
      return;
    }
    emptyContent.hide();
    // clear activities
    reportWrapper.find("#float-wrapper").empty();
    reportWrapper.find("#text-wrapper").empty();

    let tempActivityRowFloatHtml = "";
    let tempActivityRowTextfieldHtml = "";

    function changeColorBtnActivity(color, el) {
      if (color) {
        el.find(".btn-add-value").css("background-color", color);
        el.find(".btn-add-value").css(
          "color",
          colorHelper.isDark(color) ? "#ffffff" : "#000000"
        );
      } else {
        el.find(".btn-add-value").css("background-color", "");
        el.find(".btn-add-value").css("color", "");
      }
    }

    dataSource.forEach((activityData) => {
      // process if activity is use textfield
      if (activityData.use_textfield) {
        //prepare content activity row for textfield value
        let contentActivityRowTextfield = {
          title: activityData.title,
          activity_id: activityData.id,
        };

        // modify template change color of button
        rowActivityTextfieldTpl = $(rowActivityTextfieldTpl);
        rowActivityTextfieldTpl
          .find(".changepos-btn-wrapper")
          .attr("data-activityId", activityData["id"]);
        changeColorBtnActivity(activityData["color"], rowActivityTextfieldTpl);

        // get html script from modified template
        rowActivityTextfieldTpl = rowActivityTextfieldTpl[0].outerHTML;

        // render template and save to temp variable
        tempActivityRowTextfieldHtml += templateHelper.render(
          rowActivityTextfieldTpl,
          contentActivityRowTextfield
        );
        return null;
      }

      // process if activity not using textfield
      const templateValueActivity = activityData.can_change
        ? editableValueActivityTpl
        : disabledValueActivityTpl;

      const contentActivityValue = {
        activity_id: activityData.id,
        value: activityData.default_value,
      };

      const valueActivityHtml = templateHelper.render(
        templateValueActivity,
        contentActivityValue
      );

      //prepare content activity row for float value
      let contentActivityRowFloat = {
        title: activityData.title,
        activity_id: activityData.id,
        value_activity_html: valueActivityHtml,
      };

      // modify template change color of button
      rowActivityFloatTpl = $(rowActivityFloatTpl);
      rowActivityFloatTpl
        .find(".changepos-btn-wrapper")
        .attr("data-activityId", activityData["id"]);
      changeColorBtnActivity(activityData["color"], rowActivityFloatTpl);

      // get html script from modified template
      rowActivityFloatTpl = rowActivityFloatTpl[0].outerHTML;

      // render template and save to temp variable
      tempActivityRowFloatHtml += templateHelper.render(
        rowActivityFloatTpl,
        contentActivityRowFloat
      );
    });

    // render list activity
    reportWrapper.find("#float-wrapper").append(tempActivityRowFloatHtml);
    reportWrapper.find("#text-wrapper").append(tempActivityRowTextfieldHtml);
  }

  getValuePositionOfActivities() {
    const values = $(".row-activity").map(function () {
      const btnPos = $(this).find(".changepos-btn-wrapper");
      const activityId = btnPos.data("activityid");

      return activityId;
    });

    return values.toArray();
  }

  async changePosition(direction = "up", currentEl = null, parentEl = null) {
    var children = $(parentEl).children();
    var currentIndex = currentEl.index();
    var newIndex = direction == "up" ? currentIndex - 1 : currentIndex + 1;
    var totalIndex = children.length - 1;
    if (newIndex > totalIndex || newIndex < 0) {
      return;
    } else {
      var temp = children[newIndex];
      children[newIndex] = children[currentIndex];
      children[currentIndex] = temp;
    }
    $(parentEl).html(children);

    // update position to server
    const value = this.getValuePositionOfActivities();
    await this.activityService.updatePositionCommand(value).execute();
  }

  handleClickButtonChangePosition(direction, el) {
    const floatEl = $(el).closest(".row-activity-float");
    const textfieldEl = $(el).closest(".row-activity-textfield");
    const parentEl = floatEl.length ? "#float-wrapper" : "#text-wrapper";
    const currentEl = floatEl.length ? floatEl : textfieldEl;

    this.changePosition(direction, currentEl, parentEl);
  }

  async handleClickButtonAddValue(evt) {
    console.log("???? ~ file: index.js ~ line 185 ~ HomeView ~ handleClickButtonAddValue ~ evt", evt)
    //get activity id and input value
    const elInput = $(evt)
      .parents(".input-activity-group")
      .find(".input-activity-value");
    const activityId = elInput.attr("activityId");
    const useTextfield = elInput.is("[type=text]");
    const useNumberField = elInput.is("[type=number]");
    let inputValue = null;

    if (useNumberField || useTextfield) {
      inputValue = elInput.val();
    } else {
      inputValue = elInput.attr("value");
    }

    const attributes = {
      activity_id: activityId,
      value: inputValue,
      use_textfield: useTextfield,
    };

    const command = await this.historyService
      .insertCommand(attributes)
      .execute();
    if (command.success == false) {
      const firstErrorMsg = command.errors[0].message;
      alertHelper.showError(firstErrorMsg);
      return;
    }
    const result = command.value;
    if (result.success) {
      alertHelper.showSnackBar("Successfully added !", 1);
      if (window.setting.beep_sound == 1) {
        mediaHelper.playBeepSound();
      }
    }
  }

  initialize() {
    this.fetchActivities();

    $("body").on("click", ".btn-down", (evt) =>
      this.handleClickButtonChangePosition("down", evt.target)
    );
    $("body").on("click", ".btn-up", (evt) =>
      this.handleClickButtonChangePosition("up", evt.target)
    );

    $("body").on("click", ".btn-add-value", (evt) =>
      this.handleClickButtonAddValue(evt.target)
    );
  }
}

jQuery(async function () {
  new HomeView().initialize();
});
