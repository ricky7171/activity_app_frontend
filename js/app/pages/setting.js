import * as settingRepository from '../data/setting_repository';
import * as alertHelper from "./../core/alert_helper";

jQuery(async function () {
    async function loadSettingData() {
        var result = await settingRepository.getSetting();
        return result;
    }

    loadSettingData().then(function(res){
        var setting = res.response.data;

        $('#toggleBeepSound').prop('checked', setting.beep_sound == 1)
    });

    $('#toggleBeepSound').on('change', function(){
        settingRepository
            .saveSetting('beep_sound', $(this).prop('checked') ? 1 : 0)
            .then(() => alertHelper.showSnackBar("Successfully saved !", 1));
    })
})