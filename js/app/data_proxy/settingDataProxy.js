var HttpDataProxy = require("./httpDataProxy");

class SettingDataProxy extends HttpDataProxy {
  constructor() {
    super("setting");
  }

  save(key, value) {
    const body = { key, value };
    return this._handleResponseFrom(this._api.requestApi("setting.save", body));
  }
}

module.exports = SettingDataProxy;
