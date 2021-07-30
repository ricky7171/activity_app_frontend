var HttpDataProxy = require("./httpDataProxy");
var axios = require("axios");


class ActivityDataProxy extends HttpDataProxy {
    constructor() {
        super('activity');
    }

    getByMonthAndYear(month, year) {
        this._handleResponseFrom(this._api.requestApi("activity.getByMonthAndYear", {}, `/${month}/${year}`));
    }
}

module.exports = ActivityDataProxy;
