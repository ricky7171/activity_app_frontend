import { BusinessService, Command } from "peasy-js";
import { ValidTextFieldActivityRule, FieldRequiredRule } from "../rules";

class ApplicationLogService extends BusinessService {
  constructor(dataProxy) {
    super(dataProxy);
  }

  _getRulesForInsertCommand(attr) {
    return Promise.resolve([
      new FieldRequiredRule("version", attr),
      new FieldRequiredRule("description", attr),
    ]);
  }

  _getRulesForUpdateCommand(attr) {
    return Promise.resolve([new FieldRequiredRule("id", attr)]);
  }
}

export default ApplicationLogService;
