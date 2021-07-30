var ServiceException = require("peasy-js").ServiceException;
var ConcurrencyError = require("../business_logic/shared/concurrencyError");
var NotFoundError = require("../business_logic/shared/notFoundError");
var api = require("../infra/api");

class HttpDataProxy {
  constructor(entity) {
    this._entity = entity;
    this._api = api;
    this.httpStatusCodes = {
      BAD_REQUEST: 400,
      CONFLICT: 409,
      NOT_FOUND: 404,
      NOT_IMPLEMENTED: 501,
    };
  }

  _handleResponseFrom(promise) {
    return promise
      .then((response) => this._api.processResponse(response))
      .catch((err) => {
        return this._getError(err);
      });
  }

  _handleGetListByIdFrom(promise) {
    return promise
      .then((response) => this._api.processResponse(response))
      .catch((err) => {
        if (err.response.status === this.httpStatusCodes.NOT_FOUND) {
          return [];
        }
        return this._getError(err);
      });
  }

  _getError(err) {
    if (!err.response) return err;
    switch (err.response.status) {
      case this.httpStatusCodes.BAD_REQUEST:
        var serviceException = new ServiceException(err.message);
        if (Array.isArray(err.response.data)) {
          serviceException.errors = err.response.data;
        }
        return serviceException;

      case this.httpStatusCodes.CONFLICT:
        return new ConcurrencyError(err.message);

      case this.httpStatusCodes.NOT_FOUND:
        return new NotFoundError(err.message);

      default:
        return err;
    }
  }

  getAll() {
    return this._handleResponseFrom(api.requestApi(`${this._entity}.get`));
  }

  getById(id) {
    return this._handleResponseFrom(
      api.requestApi(`${this._entity}.find`, null, `/${id}`)
    );
  }

  insert(data) {
    return this._handleResponseFrom(
      api.requestApi(`${this._entity}.add`, data)
    );
  }

  update(data) {
    return this._handleResponseFrom(
      api.requestApi(`${this._entity}.update`, data, `/${data.id}`)
    );
  }

  destroy(id) {
    return this._handleResponseFrom(
      api.requestApi(`${this._entity}.delete`, null, `/${id}`)
    );
  }
}

module.exports = HttpDataProxy;
