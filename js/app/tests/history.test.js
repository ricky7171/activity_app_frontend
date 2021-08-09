import mockAxios from "jest-mock-axios";
import HistoryService from "../business_logic/service/historyService";
import HistoryDataProxy from "../data_proxy/historyDataProxy";
import DummyResponse from "./dummy-response";

test("get all histories", async () => {
  DummyResponse.GET_SUCCESS.data.data.push({
    id: 16,
    activity_id: 7,
    date: "2021-07-31",
    time: "18:07:06",
    value: null,
    value_textfield: "test",
    created_at: "2021-07-31T10:07:06.000000Z",
    updated_at: "2021-07-31T10:07:06.000000Z",
    deleted_at: null,
    activity_title: "asdasdasdasdad",
  });

  const service = new HistoryService(new HistoryDataProxy());
  const getCommand = service.getAllCommand();
  const request = getCommand._onValidationSuccess;
  getCommand._onValidationSuccess = function (...args) {
    var res = request.apply(this, ...args);
    mockAxios.mockResponse(DummyResponse.GET_SUCCESS);
    return res;
  };
  const res = await getCommand.execute();

  expect(res.success).toBe(true);
  expect(res.value.response.data.length).toBeGreaterThan(0);
});

test("get history range", async () => {
  DummyResponse.GET_SUCCESS.data.data.push({
    year: 2021,
    range: [
      {
        historyDate: "07-2021",
        year: 2021,
        month: 7,
      },
      {
        historyDate: "05-2021",
        year: 2021,
        month: 5,
      },
    ],
  });

  const service = new HistoryService(new HistoryDataProxy());
  const getCommand = service.getHistoryRangeCommand();
  const request = getCommand._onValidationSuccess;
  getCommand._onValidationSuccess = function (...args) {
    var res = request.apply(this, ...args);
    mockAxios.mockResponse(DummyResponse.GET_SUCCESS);
    return res;
  };
  const res = await getCommand.execute();

  expect(res.success).toBe(true);
  expect(res.value.response.data.length).toBeGreaterThan(0);
});

test("insert history", async () => {
  const service = new HistoryService(new HistoryDataProxy());
  const attributes = {
    activity_id: 1,
    value: 200,
    use_textfield: false,
  };
  const command = service.insertCommand(attributes);
  const request = command._onValidationSuccess;
  command._onValidationSuccess = function (...args) {
    var res = request.apply(this, args);
    mockAxios.mockResponse(DummyResponse.INSERT_SUCCESS);
    return res;
  };
  const res = await command.execute();

  expect(res.success).toBe(true);
  expect(res.value).toHaveProperty(
    "data.message",
    DummyResponse.INSERT_SUCCESS.message
  );
});

test("bulk insert history", async () => {
  const service = new HistoryService(new HistoryDataProxy());
  const attributes = {
    activity_id: 1,
    history: "2021-06-01, 05:00, 200\n 2021-06-01, 15:00, 200",
    use_textfield: 0
  };
  const command = service.bulkInsertCommand(attributes);
  const request = command._onValidationSuccess;
  command._onValidationSuccess = function (...args) {
    var res = request.apply(this, args);
    mockAxios.mockResponse(DummyResponse.INSERT_SUCCESS);
    return res;
  };
  const res = await command.execute();

  expect(res.success).toBe(true);
  expect(res.value).toHaveProperty(
    "data.message",
    DummyResponse.INSERT_SUCCESS.message
  );
});

test("bulk insert history invalid format must fail", async () => {
  const service = new HistoryService(new HistoryDataProxy());
  const attributes = {
    activity_id: 1,
    history: "2021-06-01; 05:00, 200\n 2021-06-01, 15:00, 200",
    use_textfield: 0
  };
  const command = service.bulkInsertCommand(attributes);
  const request = command._onValidationSuccess;
  command._onValidationSuccess = function (...args) {
    var res = request.apply(this, args);
    mockAxios.mockResponse(DummyResponse.INSERT_SUCCESS);
    return res;
  };
  const res = await command.execute();

  expect(res.success).toBe(false);
  expect(res.errors.length).toBeGreaterThan(0);
});