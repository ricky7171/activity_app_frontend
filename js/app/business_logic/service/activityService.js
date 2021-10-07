import { BusinessService, Command } from "peasy-js";
import { ValidTextFieldActivityRule, FieldRequiredRule } from "../rules";

class ActivityService extends BusinessService {
  constructor(dataProxy) {
    super(dataProxy);
  }

  _getRulesForInsertCommand(attr) {
    const rules = [
      // new ValidTextFieldActivityRule(attr),
      new FieldRequiredRule("type", attr),
      new FieldRequiredRule("title", attr),
      // new FieldRequiredRule("value", "value", attr),
      new FieldRequiredRule("target", attr),
      new FieldRequiredRule("color", attr),
    ];
    
    if(['speedrun', 'value'].indexOf(attr.type) >= 0) {
      rules.push(new FieldRequiredRule("value", attr));
    }
    
    return Promise.resolve(rules);
  }

  _getRulesForUpdateCommand(attr) {
    const rules = [
      new FieldRequiredRule("id", attr),
      // new ValidTextFieldActivityRule(attr),
      new FieldRequiredRule("type", attr),
      new FieldRequiredRule("title", attr),
      // new FieldRequiredRule("value", "value", attr),
      new FieldRequiredRule("target", attr),
      new FieldRequiredRule("color", attr),
    ];

    if(['speedrun', 'value'].indexOf(attr.type) >= 0) {
      rules.push(new FieldRequiredRule("value", attr));
    }
    
    return Promise.resolve(rules);
  }

  getSortByPositionCommand() {
    const dataProxy = this.dataProxy;

    return new Command({
      _onValidationSuccess() {
        return dataProxy.getSortByPosition();
      },
    });
  }

  updatePositionCommand(values) {
    const dataProxy = this.dataProxy;

    return new Command({
      _onValidationSuccess() {
        return dataProxy.updatePosition(values);
      },
    });
  }

  getByMonthAndYearCommand(month, year) {
    const dataProxy = this.dataProxy;

    return new Command({
      _onValidationSuccess() {
        return dataProxy.getByMonthAndYear(month, year);
      },
    });
    
  }
}

export default ActivityService;
