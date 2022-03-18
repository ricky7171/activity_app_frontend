import * as templateHelper from "./../core/template_helper";
import * as dateTimeHelper from "./../core/datetime_helper";
import * as loadingHelper from "./../core/loading_helper";
import HistoryService from "../business_logic/service/historyService";
import HistoryDataProxy from "../data_proxy/historyDataProxy";
import AuthService from "../business_logic/service/authService";
import AuthDataProxy from "../data_proxy/authDataProxy";
import { parseQueryString } from "../core/url_helper";

class ReportView {
  constructor() {
    this.historyService = new HistoryService(new HistoryDataProxy());
    this.authService = new AuthService(new AuthDataProxy());
  }

  async fetchHistory(params = {}) {
    loadingHelper.toggleLoading(true);
    const command = await this.historyService
      .getHistoryRangeCommand(params)
      .execute();
    if (command.success) {
      const result = command.value;
      if (result.success) {
        this.showHistoryRange(result.response.data, params);
        loadingHelper.toggleLoading(false);
      }
    }
  }

  showHistoryRange(ranges, params = {}) {
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
            ...params,
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

  async fetchDetailStudent(id) {
    const command = await this.authService.getDetailStudentCommand(id).execute();

    if (command.success) {
      const result = command.value;
      if (result.success) {
        const detail = result.response.data
        $('#titleReport').html(`${detail.name} Reports`)
      }
    }
  }
  
  initialize() {
    const params = parseQueryString(window.location.search);
    this.fetchHistory(params);

    if(params.student_id) {
      this.fetchDetailStudent(params.student_id);
    }
  }
}

jQuery(async function () {
  new ReportView().initialize();
});
