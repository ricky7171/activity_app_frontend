import { BusinessService, Command } from "peasy-js";
import { ValidTextFieldActivityRule, FieldRequiredRule } from "../rules";

class MediaGalleryService extends BusinessService {
  constructor(dataProxy) {
    super(dataProxy);
  }

  _getRulesForInsertCommand(attr) {
    const rules = [
      new FieldRequiredRule("type", attr),
    ];

    if(attr.type == 'youtube') {
      rules.push(new FieldRequiredRule('value', attr));
    } else {
      rules.push(new FieldRequiredRule('file', attr));
    }

    if(attr.type == 'video') {
      rules.push(new FieldRequiredRule('thumbnail', attr));
    }
    
    return Promise.resolve(rules);
  }

  _getRulesForUpdateCommand(attr) {
    const rules = [
      new FieldRequiredRule("type", attr),
    ];

    if(attr.type == 'youtube') {
      rules.push(new FieldRequiredRule('value', attr));
    } else {
      rules.push(new FieldRequiredRule('file', attr));
    }

    if(attr.type == 'video') {
      rules.push(new FieldRequiredRule('thumbnail', attr));
    }
    
    return Promise.resolve(rules);
  }

  getByCategoryIdCommand(categoryId) {
    const dataProxy = this.dataProxy;

    return new Command({
      _onValidationSuccess() {
        return dataProxy.getByCategoryId(categoryId);
      },
    });
  }
}

export default MediaGalleryService;
