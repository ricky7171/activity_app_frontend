import { BusinessService, Command } from "peasy-js";
import { ValidTextFieldActivityRule, FieldRequiredRule } from "../rules";

class CategoryService extends BusinessService {
  constructor(dataProxy) {
    super(dataProxy);
  }

  _getRulesForInsertCommand(attr) {
    const rules = [
      new FieldRequiredRule("type", attr),
      new FieldRequiredRule("name", attr),
    ];

    return Promise.resolve(rules);
  }

  _getRulesForUpdateCommand(attr) {
    const rules = [
      new FieldRequiredRule("type", attr),
      new FieldRequiredRule("name", attr),
    ];
    
    return Promise.resolve(rules);
  }

  getByTypeCommand(type) {
    const dataProxy = this.dataProxy;

    return new Command({
      _onValidationSuccess() {
        return dataProxy.getByType(type);
      },
    });
  }
}

export default CategoryService;
