import * as api from "./../infra/api";


export async function getActivities() {
    var result = null;
    var response = null;
    try {
        response = await api.requestApi("activity.get");    
    } catch (error) {
        response = false;  
    }
    result = api.processResponse(response);
    return result;
    
}

export async function getActivitiesByMonthAndYear(month, year) {
    var result = null;
    var response = null;
    try {
        response = await api.requestApi("activity.getByMonthAndYear", {}, "/" + month + "/" + year);    
    } catch (error) {
        response = false;  
    }
    result = api.processResponse(response);
    return result;
}

export async function addActivity(title = "title", value = 50, target = 100, canChange = 0, useTextField = 0) {
    //prepare variable to store response & result
    var result = null;
    var response = null;

    //prepare body
    //- fill to body
    var body = {
        "title" : title,
        "default_value" : value,
        "target" : target,
        "can_change" : canChange,
        "use_textfield" : useTextField,
    };

    //call to api
    try {
        response = await api.requestApi("activity.add", body);    
    } catch (error) {
        console.log("error !", error);
        response = false;  
    }
    //proccess response
    result = api.processResponse(response);
    return result;
}