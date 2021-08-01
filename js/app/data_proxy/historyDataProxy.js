import HttpDataProxy from "./httpDataProxy";

class HistoryDataProxy extends HttpDataProxy {
  constructor() {
    super("history");
  }

  insert(data) {
    if (data.use_textfield) {
      data.value_textfield = data.value;
      delete data.value;
    }

    delete data.use_textfield;

    return this._handleResponseFrom(
      this._api.requestApi(`${this._entity}.add`, data)
    );
  }

  bulkInsert(attributes) {
    const body = {
      activity_id: attributes.activity_id,
      history: attributes.history,
    };

    return this._handleResponseFrom(
      this._api.requestApi(`${this._entity}.bulkStore`, body)
    );
  }

  getHistoryRange() {
    return this._handleResponseFrom(
      this._api.requestApi(`${this._entity}.getHistoryRange`)
    );
  }
}

export default HistoryDataProxy;
