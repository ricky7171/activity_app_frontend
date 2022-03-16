import { BusinessService, Command } from "peasy-js";
import { FieldRequiredRule } from "../rules";

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

  updateParentEmailCommand(email) {
    const dataProxy = this.dataProxy;
    const attr = {
      email
    }
    return new Command({
      _getRules() {
        return Promise.resolve([
          new FieldRequiredRule('email', attr)
        ])
      },
      _onValidationSuccess() {
        return dataProxy.updateParentEmail(email);
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
