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

    // $("#reportBtnTop").html(btnText).attr("href", btnLink);
    $("#reportBtnTop").attr("href", btnLink);
  }

  async setSettingObject() {
    const command = await this.settingService.getAllCommand().execute();
    if (command.success) {
      const result = command.value;

      if (result.response && result.response.data) {
        window.setting = result.response.data;
        window.localStorage.setItem('SETTING_ACTIVITY', JSON.stringify(window.setting));
        this.onSettingInitialized();
        
        if(Number(window.setting.point_system)) {
          $('.section-point-menu').show();
        } else {
          $('.section-point-menu').hide();
        }
      }
    }
  }

  onSettingInitialized() {
    if(window.setting) {
      if(Number(window.setting.point_system)) {
        console.log('show point form')
        $('.point-system-form').show();
      }
    } else {
      $('.point-system-form').hide();
      console.log('hide point form')
    }
  }
  
  initialize() {
    this.changeReportTextToCurrentMonth();
    this.setSettingObject();
  }
}

jQuery(async function () {
  if(!window.localStorage.getItem('APP_USER') || !window.localStorage.getItem('APP_SID')) {
    window.location.replace(`${window.location.origin}/login.html`);
  }
  
  const userDetail = JSON.parse(atob(window.localStorage.getItem('APP_USER')))
  $('#userDropdown').find('#userName').html(userDetail.name);
  $('#userDropdown').find('#userImg').attr('src', userDetail.avatar || `${window.location.origin}/assets/img/avatar.png`);
  
  $('#btnLogout').click(function(){
    window.localStorage.removeItem('APP_USER');
    window.localStorage.removeItem('APP_SID');
    window.location.replace(`${window.location.origin}/login.html`);
  })
  
  const globalView = new GlobalView();
  globalView.initialize();

  if(!window.setting) {
    var localSetting = window.localStorage.getItem('SETTING_ACTIVITY');
    if(localSetting) {
      localSetting = JSON.parse(localSetting);
    }
    window.setting = localSetting
  }

  globalView.onSettingInitialized();
});
