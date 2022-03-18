import * as templateHelper from "./../core/template_helper";
import * as alertHelper from "./../core/alert_helper";
import * as loadingHelper from "./../core/loading_helper";
import AuthService from "../business_logic/service/authService";
import AuthDataProxy from "../data_proxy/authDataProxy";


class StudentsView {
  constructor() {
    this.authService = new AuthService(new AuthDataProxy());
  }

  async fetchData() {
    loadingHelper.toggleLoading(true)
    const command = await this.authService.getStudentsCommand().execute();

    if(command.success) {
      const result = command.value;

      this.showData(result.response.data);
      loadingHelper.toggleLoading(false);
      $(".table-students").show();
    }
  }

  showData(listData) {
    $(".list-students").empty();
    
    if (!listData.length) {
      var rowEmptyContentTpl = $(
        'script[data-template="row-empty-content"'
      ).text();

      $(".list-students").html(rowEmptyContentTpl);
      $(".list-students").find(".empty-content").show();
      return;
    }

     //prepare template
     var rowTpl = $('script[data-template="row-students"').text();

     //generate row history, then put it on .list-history
     $(".list-students").append(
       listData.map(function (data, i) {
         return templateHelper.render(rowTpl, {
           order: i+1,
           name: data.name,
           id: data.id,
         });
       })
     );
  }
  
  initialize() {
    this.fetchData();
  }
}

jQuery(async function () {
  new StudentsView().initialize();
});