import * as api from "./../infra/api";
import * as datetimeHelper from "./../core/datetime_helper";


export async function getHistories() {
    var result = null;
    var response = null;
    try {
        response = await api.requestApi("history.get");    
    } catch (error) {
        response = false;  
    }
    result = api.processResponse(response);
    return result;
    
}

export async function addHistory(activityId, inputValue, useTextfield) {
    //prepare variable to store response & result
    var result = null;
    var response = null;

    //prepare body
    //- get date 
    const dateObj = new Date()
    var currentDateFormatted = datetimeHelper.getDateStandartFormat();
    //- get time
    var currentHours = dateObj.getHours();
    if (currentHours.toString().length < 2) currentHours = '0' + currentHours;

    var currentMinutes = dateObj.getMinutes();
    if (currentMinutes.toString().length < 2) currentMinutes = '0' + currentMinutes;

    var currentSeconds = dateObj.getSeconds();
    if (currentSeconds.toString().length < 2) currentSeconds = '0' + currentSeconds;
    
    var currentTimeFormatted = currentHours + ":" + currentMinutes + ":" + currentSeconds;

    //- fill to body
    var body = {
        "activity_id" : activityId,
        "date" : currentDateFormatted,
        "time" : currentTimeFormatted,
    };
    if(useTextfield) {
        body['value_textfield'] = inputValue;
    } else {
        body['value'] = inputValue;
    }

    //call to api
    try {
        console.log("CHECK BODY FIRST");
        console.log(body);
        response = await api.requestApi("history.add", body);    
    } catch (error) {
        console.log("error !", error);
        response = false;  
    }
    //proccess response
    result = api.processResponse(response);
    return result;
}

export async function bulkStoreHistoriesData(inputHistories, activityId) {
    //prepare variable to store response & result
    var result = null;
    var response = null;

    //prepare body
    //langsung kirim, karena inputhistory sudah jadi array, tinggalbkin body

    
    //- fill to body
    var body = {
        "activity_id" : activityId,
        "history" : inputHistories,
    };

    //call to api
    try {
        console.log("CHECK BODY FIRST");
        console.log(body);
        response = await api.requestApi("history.bulkStore", body);    
    } catch (error) {
        console.log("error !", error);
        response = false;  
    }
    //proccess response
    result = api.processResponse(response);
    return result;
}

export async function deleteHistory(id) {
     //prepare variable to store response & result
     var result = null;
     var response = null;
 
     //call to api
     try {
         response = await api.requestApi("history.delete", {
             "_method" : "delete"
         }, "/" + id);    
     } catch (error) {
         console.log("error !", error);
         response = false;  
     }
     //proccess response
     result = api.processResponse(response);
     return result;
}

export async function getHistoryRange() {
    var result = null;
    var response = null;
    try {
        response = await api.requestApi("history.getHistoryRange");    
    } catch (error) {
        response = false;  
    }
    result = api.processResponse(response);
    return result;
}

export async function updateHistory(id, body) {
    //prepare variable to store response & result
    var result = null;
    var response = null;

    //prepare body
    //- fill to body
    var body = body;

    //call to api
    try {
        console.log("CHECK BODY FIRST");
        console.log(body);
        response = await api.requestApi("history.update", body, '/'+id);    
    } catch (error) {
        console.log("error !", error);
        response = false;  
    }
    //proccess response
    result = api.processResponse(response);
    return result;
}