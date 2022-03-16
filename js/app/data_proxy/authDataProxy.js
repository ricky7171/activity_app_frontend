import HttpDataProxy from "./httpDataProxy";

class AuthDataProxy extends HttpDataProxy {
  constructor() {
    super("setting");
  }

  getProfile() {
    return this._handleResponseFrom(this._api.requestApi("auth.profile"));
  }

  updateParentEmail(email) {
    const data = {
      email
    }
    
    return this._handleResponseFrom(this._api.requestApi("auth.updateParentEmail", data))
  }
}

export default AuthDataProxy;
