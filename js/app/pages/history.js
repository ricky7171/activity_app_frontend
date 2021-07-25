import * as historyRepository from './../../../js/app/data/history_repository';
import * as templateHelper from "./../core/template_helper";
import * as alertHelper from "./../core/alert_helper";
import * as loadingHelper from "./../core/loading_helper";

async function loadHistoriesData() {
    var result = await historyRepository.getHistories();
    return result;
}

function showHistoriesData(histories) {
    console.log("check dataaaa");
    console.log(histories);

    //clear histories
    $(".list-history").empty();

    if(!histories.length) {
        var rowEmptyContentTpl = $('script[data-template="row-empty-content"').text();
        $('.list-history').html(rowEmptyContentTpl);
        $('.list-history').find('.empty-content').show();
    }
    
    //prepare template
    var rowHistoriesTpl = $('script[data-template="row-history"').text();

    //generate row history, then put it on .list-history
    $(".list-history").append(histories.map(function(historyData, i) {
        var value = null;
        if(historyData["value"] != null) {
            value = historyData["value"];
        } else if(historyData["value_textfield"] != null) {
            value = historyData["value_textfield"];
        } else {
            value = 0;
        }
        return templateHelper.render(rowHistoriesTpl, {
            "id" : historyData["id"],
            "date" : historyData["date"],
            "time" : historyData["time"],
            "activity_title" : historyData["activity_title"],
            "value" : value,
            "history_id" : historyData['id'],
            "useTextField" : historyData["value_textfield"] ? true : false
        });
    }));
    
}

async function deleteHistory(id) {
    var result = await historyRepository.deleteHistory(id);
    return result;
}

jQuery(async function () {
    loadingHelper.toggleLoading(true);
    var historiesData = await loadHistoriesData();
    if(historiesData['success']) { 
        showHistoriesData(historiesData['response']['data']);
        loadingHelper.toggleLoading(false);
        $('.table-responsive').show();
    }

    //event handler
    $("body").on('click','.btn-delete-history', async function() {
        var result = await deleteHistory($(this).attr("historyId"));
        if(result['success']) {
            alertHelper.showSuccess("successfully deleted !");
            var historiesData = await loadHistoriesData();
            if(historiesData['success']) { 
                showHistoriesData(historiesData['response']['data']);
            }
        }
    });

    $('body').on('click', '.table-responsive td', function(e){
        e.stopPropagation();

        var value = $(this).html();
        var isEditable = $(this).data('editable');
        var hasInput = $(this).find('.input-editable').length;
        console.log('di click', this)
        
        if(isEditable && !hasInput) {
            // save default content
            $(this).data('defaultcontent', value);
            console.log("🚀 ~ file: history.js ~ line 86 ~ $ ~ $(this).data", $(this).data())

            var rowEditable = $('script[data-template="row-editable"').text();
            var content = templateHelper.render(rowEditable, {
                name: $(this).data('name'),
                value: value,
            })
            $(this).html(content);
        }
    })

    $('body').on('click', '.btn-cancel-editable', function(e){
        e.stopPropagation();
        var td = $(this).closest('td');
        var defaultContent = td.data('defaultcontent');
        
        td.html(defaultContent);
    })

    $('body').on('click', '.btn-save-editable', async function(e){
        e.stopPropagation();
        var inputContainer = $(this).closest('.input-editable-container');
        var value = inputContainer.find('.input-editable').val();
        var td = $(this).closest('td');
        var id = $(this).closest('tr').data('historyid');
        var name = td.data('name');
        var useTextField = td.data('usetextfield');

        if(useTextField) {
            name = 'value_textfield';
        }
        var body = {
            [name]: value
        };
        var result = await historyRepository.updateHistory(id, body);
        if(result['success']) {
            td.html(value);
            alertHelper.showSnackBar('Successfully Updated');
        }
    })
})