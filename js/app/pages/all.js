import * as dateTimeHelper from "./../core/datetime_helper";
import SettingService from "../business_logic/service/settingService";
import SettingDataProxy from "../data_proxy/settingDataProxy";

class GlobalView {
  constructor() {
    this.settingService = new SettingService(new SettingDataProxy());
  }

  changeReportTextToCurrentMonth() {
    const dateObject = new Date();
    const currentMonth = dateObject.getMonth() + 1;
    const currentYear = dateObject.getFullYear();
    const btnText = `${dateTimeHelper.getCurrentMonth()} Report`;
    const btnLink = `/report/list.html?year=${currentYear}&month=${currentMonth}`;

    $("#reportBtnTop").html(btnText).attr("href", btnLink);
  }

  async setSettingObject() {
    const command = await this.settingService.getAllCommand().execute();
    if (command.success) {
      const result = command.value;

      if (result.response && result.response.data) {
        window.setting = result.response.data;
      }
    }
  }

  initialize() {
    this.changeReportTextToCurrentMonth();
    this.setSettingObject();
  }
}

jQuery(async function () {
  new GlobalView().initialize();
});
