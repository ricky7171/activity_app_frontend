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
      // new FieldRequiredRule("target", attr),
      new FieldRequiredRule("color", attr),
    ];
    
    if(['speedrun', 'value', 'badhabit'].indexOf(attr.type) >= 0) {
      rules.push(new FieldRequiredRule("value", attr));
    }
    
    if(attr.type !== 'alarm') {
      rules.push(new FieldRequiredRule("target", attr));
    }

    if(['speedrun', 'count'].indexOf(attr.type) < 0) {
      rules.push(new FieldRequiredRule("increase_value", attr))
    }

    if(attr.type == 'speedrun') {
      rules.push(new FieldRequiredRule("criteria", attr))
    }

    if(Number(window.setting.point_system)) {
      rules.push(new FieldRequiredRule("point_weight", attr));
    }

    return Promise.resolve(rules);
  }

  _getRulesForUpdateCommand(attr) {
    const rules = [
      new FieldRequiredRule("id", attr),
    ];

    if(!attr.without_validation) {
      rules.push(new FieldRequiredRule("type", attr))
      rules.push(new FieldRequiredRule("title", attr))
      rules.push(new FieldRequiredRule("color", attr))
      
      if(['speedrun', 'value', 'badhabit'].indexOf(attr.type) >= 0) {
        rules.push(new FieldRequiredRule("value", attr));
      }
  
      if(attr.type !== 'alarm') {
        rules.push(new FieldRequiredRule("target", attr));
      }
  
      if(['speedrun', 'count'].indexOf(attr.type) < 0) {
        rules.push(new FieldRequiredRule("increase_value", attr))
      }
  
      if(attr.type == 'speedrun') {
        rules.push(new FieldRequiredRule("criteria", attr))
      }
      
      if(Number(window.setting.point_system)) {
        rules.push(new FieldRequiredRule("point_weight", attr));
      }
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
