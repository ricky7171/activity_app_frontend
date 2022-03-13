import HttpDataProxy from "./httpDataProxy";

class AuthDataProxy extends HttpDataProxy {
  constructor() {
    super("setting");
  }

  getProfile() {
    return this._handleResponseFrom(this._api.requestApi("auth.profile"));
  }

  // getApplicationLogs() {
  //   return this._handleResponseFrom(this._api.requestApi("applicationlogs.get"));
  // }
}

export default AuthDataProxy;
