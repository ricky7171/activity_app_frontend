import { BusinessService } from "peasy-js";
import { ValidTextFieldActivityRule, FieldRequiredRule } from "../rules";

class ActivityService extends BusinessService {
  constructor(dataProxy) {
    super(dataProxy);
  }

  _getRulesForInsertCommand(attr) {
    return Promise.resolve([
      new ValidTextFieldActivityRule(attr),
      new FieldRequiredRule("title", attr),
      new FieldRequiredRule("default_value", 'value', attr),
      new FieldRequiredRule("target", attr),
      new FieldRequiredRule("color", attr),
    ]);
  }
  
  _getRulesForUpdateCommand(attr) {
    return Promise.resolve([
      new FieldRequiredRule("id", attr),
      new ValidTextFieldActivityRule(attr),
      new FieldRequiredRule("title", attr),
      new FieldRequiredRule("default_value", 'value', attr),
      new FieldRequiredRule("target", attr),
      new FieldRequiredRule("color", attr),
    ]);
  }
}

export default ActivityService;
