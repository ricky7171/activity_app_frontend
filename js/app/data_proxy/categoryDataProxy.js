import HttpDataProxy from "./httpDataProxy";

class CategoryDataProxy extends HttpDataProxy {
  constructor() {
    super("category");
  }

  getByType(type) {
    return this._handleResponseFrom(this._api.requestApi(`${this._entity}.get`, {}, `?type=${type}`));
  }
}

export default CategoryDataProxy;
