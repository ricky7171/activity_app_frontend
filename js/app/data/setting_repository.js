import * as api from "./../infra/api";

export async function getSetting() {
    var result = null;
    var response = null;
    try {
        response = await api.requestApi("setting.get");    
    } catch (error) {
        response = false;  
    }
    result = api.processResponse(response);
    return result;
}

export async function saveSetting(key, value) {
    console.log("🚀 ~ file: setting_repository.js ~ line 16 ~ saveSetting ~ value", value)
    var result = null;
    var response = null;
    try {
        var body = {
            "key" :key,
            "value" :value
        }
        response = await api.requestApi("setting.save", body);
    } catch (error) {
        response = false; 
    }
    result = api.processResponse(response);
    return result;
}