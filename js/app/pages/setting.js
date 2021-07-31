import SettingService from "../business_logic/service/settingService";
import SettingDataProxy from "../data_proxy/settingDataProxy";
import * as alertHelper from "./../core/alert_helper";

class SettingView {
  constructor() {
    this.settingService = new SettingService(new SettingDataProxy());
  }

  async fetchSettingData() {
    const command = await this.settingService.getAllCommand().execute();
    if (command.success) {
      const result = command.value;
      if (result.success) {
        const setting = result.response.data;
        // set value
        $("#toggleBeepSound").prop("checked", setting.beep_sound == 1);
      }
    }
  }

  async handleChangeBeepSound(evt) {
    const value = $(evt.target).prop("checked") ? 1 : 0;

    const command = await this.settingService.saveCommand('beep_sound', value).execute();
    if (command.success) {
      const result = command.value;

      if (result.success) {
        alertHelper.showSnackBar("Successfully saved !", 1);
      }
    }
  }

  initialize() {
    this.fetchSettingData();

    $("#toggleBeepSound").on("change", (evt) =>
      this.handleChangeBeepSound(evt)
    );
  }
}

jQuery(async function () {
  new SettingView().initialize();
});