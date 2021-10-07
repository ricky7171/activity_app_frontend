import mockAxios from "jest-mock-axios";
import ActivityService from "../business_logic/service/activityService";
import ActivityDataProxy from "../data_proxy/activityDataProxy";
import DummyResponse from "./dummy-response";

test("get all activity", async () => {
  DummyResponse.GET_SUCCESS.data.data = [
    {
      id: 1,
      title: "asdasdasdasdad",
      target: 123,
      position: 2,
      color: "#4e73df",
      value: 0,
      can_change: 1,
      deleted_at: null,
      created_at: "2021-07-30T15:28:37.000000Z",
      updated_at: "2021-07-31T08:01:11.000000Z",
    },
  ];

  const service = new ActivityService(new ActivityDataProxy());
  const command = service.getAllCommand();
  const request = command._onValidationSuccess;
  command._onValidationSuccess = function (...args) {
    var res = request.apply(this, args);
    mockAxios.mockResponse(DummyResponse.GET_SUCCESS);
    return res;
  };
  const res = await command.execute();

  expect(res.success).toBe(true);
  expect(res.value.response.data.length).toBeGreaterThan(0);
});

test("insert activity", async () => {
  const service = new ActivityService(new ActivityDataProxy());
  const attributes = {
    title: "First Activity",
    value: 100,
    target: 500,
    color: "#000000",
    can_change: 0,
    use_textfield: 0,
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

test("insert activity with wrong attributes must fail", async () => {
  const service = new ActivityService(new ActivityDataProxy());
  const attributes = {
    title: "First Activity",
    value: 100,
    target: 500,
    color: "#000000",
    can_change: 0, // if textfield, can_change attribute must also true
    use_textfield: 1,
  };
  const command = service.insertCommand(attributes);
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

test("update activity", async () => {
  const service = new ActivityService(new ActivityDataProxy());
  const attributes = {
    id: 1,
    title: "First Activity",
    value: 100,
    target: 500,
    color: "#000000",
    can_change: 0,
    use_textfield: 0,
  };
  const command = service.updateCommand(attributes);
  const request = command._onValidationSuccess;
  command._onValidationSuccess = function (...args) {
    var res = request.apply(this, args);
    mockAxios.mockResponse(DummyResponse.UPDATE_SUCCESS);
    return res;
  };
  const res = await command.execute();

  expect(res.success).toBe(true);
  expect(res.value).toHaveProperty(
    "data.message",
    DummyResponse.UPDATE_SUCCESS.message
  );
});

test("update activity with wrong attributes must fail", async () => {
  const service = new ActivityService(new ActivityDataProxy());
  const attributes = {
    id: 1,
    title: "First Activity",
    value: 100,
    target: 500,
    color: "#000000",
    can_change: 0, // if textfield, can_change attribute must also true
    use_textfield: 1,
  };
  const command = service.updateCommand(attributes);
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

test("get sort by position activity", async () => {
  DummyResponse.GET_SUCCESS.data.data = [
    {
      id: 1,
      title: "asdasdasdasdad",
      target: 123,
      position: 2,
      color: "#4e73df",
      value: 0,
      can_change: 1,
      deleted_at: null,
      created_at: "2021-07-30T15:28:37.000000Z",
      updated_at: "2021-07-31T08:01:11.000000Z",
    },
  ];

  const service = new ActivityService(new ActivityDataProxy());
  const command = service.getSortByPositionCommand();
  const request = command._onValidationSuccess;
  command._onValidationSuccess = function (...args) {
    var res = request.apply(this, args);
    mockAxios.mockResponse(DummyResponse.GET_SUCCESS);
    return res;
  };
  const res = await command.execute();

  expect(res.success).toBe(true);
  expect(res.value.response.data.length).toBeGreaterThan(0);
});

test("update position of activity", async () => {
  const service = new ActivityService(new ActivityDataProxy());
  const attributes = [1,4,5];
  const command = service.updatePositionCommand(attributes);
  const request = command._onValidationSuccess;
  command._onValidationSuccess = function (...args) {
    var res = request.apply(this, args);
    mockAxios.mockResponse(DummyResponse.UPDATE_SUCCESS);
    return res;
  };

  const res = await command.execute();
  expect(res.success).toBe(true);
  expect(res.value).toHaveProperty(
    "data.message",
    DummyResponse.UPDATE_SUCCESS.message
  );
});

test("get by month and year activity", async () => {
  DummyResponse.GET_SUCCESS.data.data = [
    {
      id: 1,
      title: "asdasdasdasdad",
      target: 123,
      position: 2,
      color: "#4e73df",
      value: 0,
      can_change: 1,
      deleted_at: null,
      created_at: "2021-07-30T15:28:37.000000Z",
      updated_at: "2021-07-31T08:01:11.000000Z",
    },
  ];

  const service = new ActivityService(new ActivityDataProxy());
  const command = service.getByMonthAndYearCommand(7, 2021);
  const request = command._onValidationSuccess;
  command._onValidationSuccess = function (...args) {
    var res = request.apply(this, args);
    mockAxios.mockResponse(DummyResponse.GET_SUCCESS);
    return res;
  };
  const res = await command.execute();

  expect(res.success).toBe(true);
  expect(res.value.response.data.length).toBeGreaterThan(0);
});