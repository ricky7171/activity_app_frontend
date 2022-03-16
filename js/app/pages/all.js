import * as dateTimeHelper from "./../core/datetime_helper";
import SettingService from "../business_logic/service/settingService";
import SettingDataProxy from "../data_proxy/settingDataProxy";
import AuthService from "../business_logic/service/authService";
import AuthDataProxy from "../data_proxy/authDataProxy";

class GlobalView {
  constructor() {
    this.settingService = new SettingService(new SettingDataProxy());
    this.authService = new AuthService(new AuthDataProxy());
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

        if(Number(window.setting.parental_inspection)) {
          $('.section-parentalInspection-menu').show();
        } else {
          $('.section-parentalInspection-menu').hide();
        }
      }
    }
  }

  onSettingInitialized() {
    if(window.setting) {
      if(Number(window.setting.point_system)) {
        $('.point-system-form').show();
      }
    } else {
      $('.point-system-form').hide();
    }
  }

  async getProfile() {
    const command = await this.authService.getProfileCommand().execute();
    if (command.success) {
      const result = command.value;
      const userDetail = result.response.data;

      window.localStorage.setItem('APP_USER', btoa(JSON.stringify(userDetail)))
      
      this.setUserDetail(userDetail)
    }
  }

  setUserDetail(userDetail) {
    $('#userDropdown').find('#userName').html(userDetail.name);
    $('#userDropdown').find('#userImg').attr('src', userDetail.avatar || `${window.location.origin}/assets/img/avatar.png`);
    const point = Number(userDetail.total_points);
    if(point < 0) {
      $('#userTotalPoint').attr('class', 'text-danger')
    } else {
      $('#userTotalPoint').attr('class', 'text-success')
    }
    
    $('#userTotalPoint').html(point);

    if(userDetail.parent_id) {
      // set value email parent on setting page
      $('#emailParent').val(userDetail.parent.email)
    }
  }
  
  initialize() {
    this.changeReportTextToCurrentMonth();
    this.setSettingObject();
    this.getProfile();
  }
}

jQuery(async function () {
  if(!window.localStorage.getItem('APP_USER') || !window.localStorage.getItem('APP_SID')) {
    window.location.replace(`${window.location.origin}/login.html`);
  }
  
  $('#btnLogout').click(function(){
    window.localStorage.removeItem('APP_USER');
    window.localStorage.removeItem('APP_SID');
    window.location.replace(`${window.location.origin}/login.html`);
  })
  
  const globalView = new GlobalView();
  globalView.initialize();

  const userDetail = JSON.parse(atob(window.localStorage.getItem('APP_USER')))
  globalView.setUserDetail(userDetail)
  
  if(!window.setting) {
    var localSetting = window.localStorage.getItem('SETTING_ACTIVITY');
    if(localSetting) {
      localSetting = JSON.parse(localSetting);
    }
    window.setting = localSetting
  }

  globalView.onSettingInitialized();
});
