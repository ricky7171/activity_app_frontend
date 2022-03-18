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

  getStudents() {
    return this._handleResponseFrom(this._api.requestApi("auth.getStudents"))
  }

  getDetailStudent(id) {
    return this._handleResponseFrom(this._api.requestApi("auth.getDetailStudent", {}, `/${id}`))
  }
}

export default AuthDataProxy;
