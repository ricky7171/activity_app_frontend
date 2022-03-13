import { BusinessService, Command } from "peasy-js";

class AuthService extends BusinessService {
  constructor(dataProxy) {
    super(dataProxy);
  }

  getProfileCommand() {
    const dataProxy = this.dataProxy;
    return new Command({
      _onValidationSuccess() {
        return dataProxy.getProfile();
      }
    })
  }

  // getApplicationLogs() {
  //   const dataProxy = this.dataProxy;
  //   return new Command({
  //     _onValidationSuccess() {
  //       return dataProxy.getApplicationLogs();
  //     }
  //   })
  // }
}

export default AuthService;
