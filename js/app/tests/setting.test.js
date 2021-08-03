import mockAxios from "jest-mock-axios";
import SettingService from "../business_logic/service/settingService";
import SettingDataProxy from "../data_proxy/settingDataProxy";
import DummyResponse from "./dummy-response";

test("get all settings", async () => {
  DummyResponse.GET_SUCCESS.data.data = {
    beep_sound: 1,
  };

  const service = new SettingService(new SettingDataProxy());
  const getCommand = service.getAllCommand();
  const request = getCommand._onValidationSuccess;
  getCommand._onValidationSuccess = function (...args) {
    var res = request.apply(this, ...args);
    mockAxios.mockResponse(DummyResponse.GET_SUCCESS);
    return res;
  };
  const res = await getCommand.execute();

  expect(res.success).toBe(true);
  expect(res.value.response.data.beep_sound).toBe(1);
});

test("save setting", async () => {
  const service = new SettingService(new SettingDataProxy());
  const saveCommand = service.saveCommand("beep_sound", 1);
  const request = saveCommand._onValidationSuccess;
  saveCommand._onValidationSuccess = function (...args) {
    var res = request.apply(this, ...args);
    mockAxios.mockResponse(DummyResponse.UPDATE_SUCCESS);
    return res;
  };
  const res = await saveCommand.execute();
  expect(res.success).toBe(true);
});
