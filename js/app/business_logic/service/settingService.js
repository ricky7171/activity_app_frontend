import { BusinessService, Command } from "peasy-js";

class SettingService extends BusinessService {
  constructor(dataProxy) {
    super(dataProxy);
  }

  saveCommand(key, value) {
    const dataProxy = this.dataProxy;
    return new Command({
      _onValidationSuccess() {
        return dataProxy.save(key, value);
      }
    })
  }
}

export default SettingService;
