var HttpDataProxy = require("./httpDataProxy");

class ActivityDataProxy extends HttpDataProxy {
  constructor() {
    super("activity");
  }

  getByMonthAndYear(month, year) {
    return this._handleResponseFrom(
      this._api.requestApi(
        "activity.getByMonthAndYear",
        {},
        `/${month}/${year}`
      )
    );
  }

  getSortByPosition() {
    return this._handleResponseFrom(
      this._api.requestApi("activity.get", {}, "?sortbyposition=true")
    );
  }

  updatePosition(values) {
    const body = {
      position: values,
    };
    return this._handleResponseFrom(
      this._api.requestApi("activity.updatePosition", body)
    );
  }
}

module.exports = ActivityDataProxy;
