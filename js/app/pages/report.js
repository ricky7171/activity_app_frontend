import * as templateHelper from "./../core/template_helper";
import * as dateTimeHelper from "./../core/datetime_helper";
import * as loadingHelper from "./../core/loading_helper";
import HistoryService from "../business_logic/service/historyService";
import HistoryDataProxy from "../data_proxy/historyDataProxy";

class ReportView {
  constructor() {
    this.historyService = new HistoryService(new HistoryDataProxy());
  }

  async fetchHistory() {
    loadingHelper.toggleLoading(true);
    const command = await this.historyService
      .getHistoryRangeCommand()
      .execute();
    if (command.success) {
      const result = command.value;
      if (result.success) {
        this.showHistoryRange(result.response.data);
        loadingHelper.toggleLoading(false);
      }
    }
  }

  showHistoryRange(ranges) {
    if (!ranges.length) {
      $(".empty-content").show();
    } else {
      $(".empty-content").hide();
    }

    //clear histories
    $(".all-reports").empty();

    //prepare template
    const yearDataTpl = $('script[data-template="year-data"').text();
    const monthDataTpl = $('script[data-template="month-data"').text();

    //generate year & month data, then put it on .all-reports
    let yearDataHtml = "";
    for (let index in ranges) {
      const dataRange = ranges[index];
      const monthsDataHtml = dataRange.range
        .map(function (history, i) {
          return templateHelper.render(monthDataTpl, {
            year_number: history["year"],
            month_number: history["month"],
            month_text: dateTimeHelper.monthToText(history["month"]),
          });
        })
        .join("");
      yearDataHtml += templateHelper.render(yearDataTpl, {
        year: dataRange.year,
        months_data_html: monthsDataHtml,
      });
    }
    $(".all-reports").append(yearDataHtml);
  }

  initialize() {
    this.fetchHistory();
  }
}

jQuery(async function () {
  new ReportView().initialize();
});
