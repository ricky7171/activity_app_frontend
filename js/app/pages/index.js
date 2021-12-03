import * as templateHelper from "./../core/template_helper";
import * as alertHelper from "./../core/alert_helper";
import * as mediaHelper from "./../core/media_helper";
import * as loadingHelper from "./../core/loading_helper";
import * as colorHelper from "./../core/color_helper";
import ActivityService from "../business_logic/service/activityService";
import ActivityDataProxy from "../data_proxy/activityDataProxy";
import HistoryService from "../business_logic/service/historyService";
import HistoryDataProxy from "../data_proxy/historyDataProxy";
import MediaGalleryComponent from "./components/media-gallery";

class HomeView {
  constructor() {
    this.activityService = new ActivityService(new ActivityDataProxy());
    this.historyService = new HistoryService(new HistoryDataProxy());
    this.tempData = [];
    this.is_hide = true;
  }

  async fetchActivities() {
    loadingHelper.toggleLoading(true);
    const command = await this.activityService
      .getSortByPositionCommand()
      .execute();

    if (command.success) {
      const activitiesData = command.value;
      if (activitiesData.success) {
        this.tempData = activitiesData.response.data;
        this.showActivitiesData(this.tempData.filter(v => !v.is_hide));
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
    let rowActivitySpeedrunTpl = $(
      'script[data-template="row-activity-speedrun"]'
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
        // el.find(".btn-add-value").css(
        //   "color",
        //   colorHelper.isDark(color) ? "#ffffff" : "#000000"
        // );
      } else {
        el.find(".btn-add-value").css("background-color", "");
        el.find(".btn-add-value").css("color", "");
      }
    }

    dataSource.forEach((activityData) => {
      // process if activity is use textfield
      if (['count'].indexOf(activityData.type) >= 0) {
        //prepare content activity row for textfield value
        let contentActivityRowTextfield = {
          title: activityData.title,
          activity_id: activityData.id,
          placeholder: activityData.type == 'speedrun' ? 'TAST' : 'Text Field'
        };

        if(activityData.type == 'badhabit' && activityData.is_red) {
          contentActivityRowTextfield.style = "color:red";
        }

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
      if(activityData.type == 'value' || activityData.type == 'badhabit') {
        let templateValueActivity = activityData.can_change
          ? editableValueActivityTpl
          : disabledValueActivityTpl;
  
        const contentActivityValue = {
          activity_id: activityData.id,
          value: activityData.value,
          increase_value: activityData.increase_value,
        };

        if(activityData.type == 'badhabit' && activityData.is_red) {
          contentActivityValue.style = "color:red";
        }
  
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
      } else if(activityData.type == 'speedrun') {
        let contentActivityRowSpeedrun = {
          title: activityData.title,
          activity_id: activityData.id,
        };
  
        // modify template change color of button
        rowActivitySpeedrunTpl = $(rowActivitySpeedrunTpl);
        rowActivitySpeedrunTpl
          .find(".changepos-btn-wrapper")
          .attr("data-activityId", activityData["id"]);
        changeColorBtnActivity(activityData["color"], rowActivitySpeedrunTpl);
  
        // get html script from modified template
        rowActivitySpeedrunTpl = rowActivitySpeedrunTpl[0].outerHTML;
  
        // render template and save to temp variable
        tempActivityRowTextfieldHtml += templateHelper.render(
          rowActivitySpeedrunTpl,
          contentActivityRowSpeedrun
        );
      }
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

  async handleClickButtonAddValue(evt, inputElement) {
    //get activity id and input value
    var elInput = null;
    if(inputElement) {
      elInput = inputElement;
    } else {
      elInput = $(evt)
        .parents(".input-activity-group")
        .find(".input-activity-value");
    }
    let activityId = elInput.attr("activityId");
    const useTextfield = elInput.is("[type=text]");
    const useNumberField = elInput.is("[type=number]");
    const isSpeedrun = elInput.closest('.speedrun-container').length;
    
    let inputValue = null;

    if(isSpeedrun) {
      const container = elInput.closest('.speedrun-container');
      const hour = container.find('input[name=hour]').val() || 0;
      const minute = container.find('input[name=minute]').val() || 0;
      const second = container.find('input[name=second]').val() || 0;
      const millisecond = container.find('input[name=millisecond]').val() || 0;
      inputValue = `${hour}h ${minute}m ${second}s ${millisecond}ms`;
      activityId = container.attr("activityId");

      if(hour == 0 && minute == 0 && second == 0 && millisecond == 0) {
        alertHelper.showError('Invalid speedrun value');
        return;
      }
      
      if(hour < 0 || minute < 0 || second < 0 || millisecond < 0) {
        alertHelper.showError('Invalid speedrun value');
        return;
      }
      
    } else {
      if (useNumberField || useTextfield) {
        inputValue = elInput.val();
      } else {
        inputValue = elInput.attr("value");
      }
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

  changeNumber(input, direction = 'up') {
    let value = Number($(input).val());
    let increaseValue = $(input).data('increasevalue') || 1;

    // convert number
    increaseValue = Number(increaseValue)

    if(direction == 'up') {
      value += increaseValue;
    } else {
      if(value < 1) {
        return ;
      }

      value -= increaseValue;
    }
    
    $(input).val(value);
  }

  handleClickSeeAllButton(evt) {
    var data = [];
    if(this.is_hide) {
      this.is_hide = false;
      data = this.tempData;
      $('#seeAllActivity').html('Hide');
    } else {
      this.is_hide = true;
      data = this.tempData.filter(v => !v.is_hide);
      $('#seeAllActivity').html('See All');
    }

    this.showActivitiesData(data)
  }

  initialize() {
    var thisObject = this;
    thisObject.fetchActivities();

    $("body").on("click", ".btn-down", (evt) =>
      thisObject.handleClickButtonChangePosition("down", evt.target)
    );
    $("body").on("click", ".btn-up", (evt) =>
      thisObject.handleClickButtonChangePosition("up", evt.target)
    );

    $("body").on("click", ".btn-add-value", (evt) =>
      thisObject.handleClickButtonAddValue(evt.target)
    );

    $("body").on('keyup', ".input-activity-value", function (evt) {
      evt.key === 'Enter' ? thisObject.handleClickButtonAddValue(null, $(this)) : null
    });

    const media = new MediaGalleryComponent();
    media.initiate();

    $('body').on('click', '.btn-step', function(){
      var direction = $(this).hasClass('step-up') ? 'up' : 'down';
      var input = $(this).closest('.activity-input-float').find('input');
      thisObject.changeNumber(input, direction)
    })

    $('body').on('click', '#seeAllActivity', function(evt){
      thisObject.handleClickSeeAllButton(evt)
    });
  }
}

jQuery(async function () {
  new HomeView().initialize();
});
