import * as historyRepository from './../../../js/app/data/history_repository';
import * as templateHelper from "./../core/template_helper";

async function loadHistoriesData() {
    var result = await historyRepository.getHistories();
    return result;
}

function showHistoriesData(histories) {
    console.log("check data");
    console.log(histories);

    //clear histories
    $(".list-history").empty();

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
            "date" : historyData["date"],
            "time" : historyData["time"],
            "activity_title" : historyData["activity_title"],
            "value" : value,
            "history_id" : historyData['id']
        });
    }));
    
}

async function deleteHistory(id) {
    var result = await historyRepository.deleteHistory(id);
    return result;
}

jQuery(async function () {
    var historiesData = await loadHistoriesData();
    if(historiesData['success']) { 
        showHistoriesData(historiesData['response']['data']);
    }

    //event handler
    $("body").on('click','.btn-delete-history', async function() {
        var result = await deleteHistory($(this).attr("historyId"));
        if(result['success']) {
            alert("successfully deleted !");
            var historiesData = await loadHistoriesData();
            if(historiesData['success']) { 
                showHistoriesData(historiesData['response']['data']);
            }
        }
    });

})