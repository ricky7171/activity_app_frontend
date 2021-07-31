var HttpDataProxy = require("./httpDataProxy");

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
}

module.exports = HistoryDataProxy;
