import { BusinessService, Command } from "peasy-js";
import {
  ValidTextFieldActivityRule,
  FieldRequiredRule,
  CanBulkInsertHistoryRule,
} from "../rules";

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
    return Promise.resolve([new FieldRequiredRule("id", attr)]);
  }

  parseImportFormat(row) {
    const rowSplitted = row.split(", ");
    const attr = {
      date: rowSplitted[0],
      value: rowSplitted[1],
      time: rowSplitted[2],
    };

    if (rowSplitted.length < 3) {
      attr.time = null;
      attr.value = rowSplitted[1];
    }

    return attr;
  }

  bulkInsertCommand(attributes) {
    if (typeof attributes.history == "string") {
      const plainInput = attributes.history;
      attributes.history = plainInput.split("\n").filter(v => v).map((row) => {
        const result = this.parseImportFormat(row);

        if (attributes.use_textfield == "1") {
          return {
            date: result.date,
            time: result.time,
            value_textfield: result.value,
          };
        }

        return result;
      });
    }

    // console.log({attributes})
    // return Promise.resolve();

    const dataProxy = this.dataProxy;
    return new Command({
      _getRules() {
        return Promise.resolve([
          new FieldRequiredRule("activity_id", attributes, null, 'Please choose activity first !'),
          new CanBulkInsertHistoryRule(
            attributes.history,
            attributes.use_textfield
          ),
        ]);
      },
      _onValidationSuccess() {
        return dataProxy.bulkInsert(attributes);
      },
    });
  }

  getHistoryRangeCommand(params) {
    const dataProxy = this.dataProxy;

    return new Command({
      _onValidationSuccess() {
        return dataProxy.getHistoryRange(params);
      },
    });
  }

  bulkDestroyCommand(historiesIds) {
    const dataProxy = this.dataProxy;

    return new Command({
      _onValidationSuccess() {
        return dataProxy.bulkDestroy(historiesIds);
      },
    });
  }
}

export default HistoryService;
