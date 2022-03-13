import * as templateHelper from "./../core/template_helper";
import * as loadingHelper from "./../core/loading_helper";
import * as dateTimeHelper from "./../core/datetime_helper";
import ActivityService from "../business_logic/service/activityService";
import ActivityDataProxy from "../data_proxy/activityDataProxy";
import HistoryService from "../business_logic/service/historyService";
import HistoryDataProxy from "../data_proxy/historyDataProxy";

class ReportListView {
  constructor() {
    this.activityService = new ActivityService(new ActivityDataProxy());
    this.historyService = new HistoryService(new HistoryDataProxy());
    this._reportData = [];
  }

  getMonthAndYearFromUrlParameter() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const month = urlParams.get("month");
    const year = urlParams.get("year");
    if (month == null || year == null) {
      return null;
    } else {
      return {
        month: month,
        year: year,
      };
    }
  }

  getActivitiesSummaryFromResult(result) {
    return result;
    // // - gathering information about created at on last history of each activities (this information used to sort activities)
    // for( let i = 0;i < result.length;i++) { //iterate over activities
    //   // o get created_at attribute on last history on this activity
    //   let historyCount = result[i]['histories'].length;
    //   if(historyCount <= 0) continue;
    //   let created_at_on_last_history = result[i]['histories'][historyCount - 1]['created_at'];
    //   result[i]['created_at_on_last_history'] = Date.parse(created_at_on_last_history);
    // }

    // // - sort activities by 'created_at_on_last_history'
    // result.sort(function(a,b){
    //   return new Date(b['created_at_on_last_history']) - new Date(a['created_at_on_last_history']);
    // });

    // // - store all activity summary to "activitySummary" variable
    // const activitySummary = [];
    // for (let i = 0; i < result.length; i++) {
    //   let score = 0;
    //   let count = result[i]["histories"].length;
    //   if (result[i]["use_textfield"]) {
    //     score = count;
    //   } else {
    //     for (let j = 0; j < count; j++) {
    //       score += result[i]["histories"][j]["value"];
    //     }
    //   }
    //   activitySummary.push({
    //     id: result[i]["id"],
    //     title: result[i]["title"],
    //     target: result[i]["target"],
    //     score: score,
    //     count: count,
    //   });
    // }
    // return activitySummary;
  }

  getDetailActivityFromResult(result, id, dataMonthAndYear) {
    //find activity detail
    let detailActivity = {};
    for (let i = 0; i < result.length; i++) {
      if (result[i]["id"] == id) {
        detailActivity = result[i];
        break;
      }
    }

    // //fill year and month
    // detailActivity["year"] = dataMonthAndYear["year"];
    // detailActivity["month"] = dataMonthAndYear["month"];

    // //get score
    // let score = 0;
    // const count = detailActivity["histories"].length;
    // if (detailActivity["use_textfield"]) {
    //   score = count;
    // } else {
    //   for (let i = 0; i < count; i++) {
    //     score += detailActivity["histories"][i]["value"];
    //   }
    // }

    // //fill score
    // detailActivity["score"] = score;

    // //get left
    // const left = detailActivity["target"] - score;

    // //fill left
    // detailActivity["left"] = left;
    console.log("check detailactivity");
    console.log(detailActivity);
    return detailActivity;
  }

  async fetchActivities(params) {
    loadingHelper.toggleLoading(true);

    const command = await this.activityService
      .getByMonthAndYearCommand(params.month, params.year)
      .execute();
    if (command.success) {
      const result = command.value;
      if (result.success) {
        const activitySummary = this.getActivitiesSummaryFromResult(
          result.response.data.filter(v => v.type !== 'speedrun')
        );
        this._reportData = result.response.data;
        this.showActivitiesSummary(activitySummary);

        const activitySummarySpeedrun = result.response.data.filter(v => v.type == 'speedrun')
        this.showActivitiesSummary(activitySummarySpeedrun, '.data-activity-speedrun-summary');

        loadingHelper.toggleLoading(false);
        $(".report-summary-activity").show();
        $('.content-container').show();
      }
    }
  }

  async fetchHistoryRange(params) {
    const command = await this.historyService.getHistoryRangeCommand(params).execute();

    if(command.success) {
      const result = command.value;
      if(result.success) {
        const data = result.response.data;

        if(data.length) {
          $('#monthSelection').show();

          const ranges = data[0].range;
          const currentValue = `${params.month}-${params.year}`;
          let options = ranges.map(r => `<option value="${r.month}-${r.year}" ${`${r.month}-${r.year}` === currentValue ? 'selected': ''}>${dateTimeHelper.monthToText(r.month)} ${r.year}</option>`)

          const check = ranges.filter(v => v.year == params.year && v.month == params.month).length;
          if(!check) {
            const optionForCurrentMonth = `<option value="${params.month}-${params.year}" selected>${dateTimeHelper.monthToText(params.month)} ${params.year}</option>`;
            options = [ optionForCurrentMonth, ...options];
          }

          $('#monthSelection').html(options.toString());
        }
      }
    }
  }

  showActivitiesSummary(activities, tbodyClassName = '.data-activity-summary') {
    console.log("check data");
    console.log(activities);

    //show report summary activity and hide report detail activity
    $(".report-summary-activity").show();
    $(".report-detail-activity").hide();

    //clear histories
    $(`.report-summary-activity ${tbodyClassName}`).empty();

    //prepare template
    var rowActivitySummaryTpl = $(
      'script[data-template="row-activity-summary"'
    ).text();

    //render html
    $(`.report-summary-activity ${tbodyClassName}`).append(activities.map(function(activity) {
        // var redScore = activity["score"] < activity["target"];
        // console.log("check redscore");
        let title = activity["title"];
        if(activity.type == 'speedrun') {
          title += '<br/>' + activity.value;
        }
        // console.log(redScore);
        return templateHelper.render(rowActivitySummaryTpl, {
            "activity_id" : activity["id"],
            "activity_name" : title,
            "target" : activity["target"],
            "score" : activity["score"],
            "count" : activity["count"],
            "point" : activity["point"] === null ? 'N/A' : Number(activity["point"]),
            "redscore" : activity['is_red'],
            "redcount" : activity.type == 'speedrun' ? activity['is_red_count'] : false,
        });
      })

      );
    if(Number(window.setting.point_system)) {
      $('.section-point-menu').show();
    }
  }

  showDetailActivity(detailActivity) {
    console.log("check data");
    console.log(detailActivity);

    //show report detail activity and hi hide report summary activity
    $(".report-summary-activity").hide();
    $(".report-detail-activity").show();

    //clear report heading, data report detail, footer report detail
    $(".report-detail-activity .report-heading").remove();
    $(".report-detail-activity .data-report-detail-activity").empty();
    $(".report-detail-activity .total-report-detail-activity").empty();

    //prepare template
    var reportHeadingTpl = $('script[data-template="report-heading"').text();
    var rowDataReportDetailActivityTpl = $(
      'script[data-template="row-data-report-detail-activity"'
    ).text();

    var templateDetail = detailActivity.type === 'speedrun' ? 'row-footer-report-detail-activity-speedrun' : 'row-footer-report-detail-activity';
    var rowFooterReportDetailActivityTpl = $(
      `script[data-template="${templateDetail}"`
    ).text();

    //render html
    let title = detailActivity["title"];
    if(detailActivity.type == 'speedrun') {
      title += '<br/>' + detailActivity.value;
    }
    //- render heading
    $(".report-detail-activity").prepend(
      templateHelper.render(reportHeadingTpl, {
        activity_name: title,
        year: detailActivity["year"],
        month: detailActivity["month"],
      })
    );

    //- render data report detail activity
    $(".report-detail-activity .data-report-detail-activity").append(
      detailActivity["histories"].map(function (history) {
        var value = null;
        if (history["value"] != null) {
          value = history["value"];
        } else if (history["value_textfield"] != null) {
          value = history["value_textfield"];
        } else {
          value = 0;
        }
        return templateHelper.render(rowDataReportDetailActivityTpl, {
          date: history["date"],
          time: history["time"],
          value: value,
        });
      })
    );

    const leftStyle = detailActivity['left'] < 0 ? 'display:none' : '';
    
    //- render total report detail activity
    $(".report-detail-activity .total-report-detail-activity").append(
      templateHelper.render(rowFooterReportDetailActivityTpl, {
        score: detailActivity["score"],
        target: detailActivity["target"],
        left: detailActivity["left"],
        best_time: detailActivity["best_time"],
        best_record_alltime: detailActivity["best_record_alltime"],
        average_time: detailActivity["score"],
        count: detailActivity["count"],
        leftStyle: leftStyle,
        point: detailActivity["point"] === null ? 'N/A' : Number(detailActivity["point"]),
      })
    );
    $("#btnBack").show();
    $('#monthSelection').hide();
      // change button back action
    $("#btnBack").on("click", function (e) {
      e.preventDefault();

      $(".report-summary-activity").show();
      $(".report-detail-activity").hide();
      $('#monthSelection').show();

      $("#btnBack").off();
      $("#btnBack").hide();
    });

    
    if(Number(window.setting.point_system)) {
      $('.section-point-menu').show();
    }
  }

  handleClickActivityTitle(evt) {
    const activityId = $(evt.target).attr("activityId");
    const params = this.getMonthAndYearFromUrlParameter();
    const detailActivity = this.getDetailActivityFromResult(
      this._reportData,
      activityId,
      params
    );
    this.showDetailActivity(detailActivity);
  }

  initialize() {
    const params = this.getMonthAndYearFromUrlParameter();
    this.fetchActivities(params);
    this.fetchHistoryRange(params);

    // event handler
    $("body").on("click", ".activity_button", (evt) =>
      this.handleClickActivityTitle(evt)
    );

    if(params.month) {
      $('#titleContent').html(`Report of ${dateTimeHelper.monthToText(params.month)} ${params.year}`)
    }

    const _this = this;
    $('#monthSelection').on('change', function(){
      const value = $(this).val();
      const split = value.split('-');
      const params = {
        month: split[0],
        year: split[1],
      };

      const url = window.location.protocol + "//" + window.location.host + window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('month', params.month);
      searchParams.set('year', params.year);
      
      const newUrl = `${url}?${searchParams.toString()}`;

      if(history.pushState) {

        _this.fetchActivities(params);
        history.pushState({path: newUrl}, '', newUrl)
        $('#titleContent').html(`Report of ${dateTimeHelper.monthToText(params.month)} ${params.year}`)
      } else {
        window.location.replace(newUrl);
      }
    })
  }
}

jQuery(async function () {
  new ReportListView().initialize();
});
