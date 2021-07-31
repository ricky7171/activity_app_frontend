import { BusinessService, Command } from "peasy-js";
import { ValidTextFieldActivityRule, FieldRequiredRule } from "../rules";

class HistoryService extends BusinessService {
  constructor(dataProxy) {
    super(dataProxy);
  }

  _getRulesForInsertCommand(attr) {
    return Promise.resolve([
      new FieldRequiredRule("activity_id", attr),
      new FieldRequiredRule("value", attr),
    ]);
  }

  _getRulesForUpdateCommand(attr) {
    return Promise.resolve([
      new FieldRequiredRule("id", attr),
    ]);
  }
}

export default HistoryService;
