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

  bulkInsertCommand(attributes) {
    if (typeof attributes.history == "string") {
      const plainInput = attributes.history;
      attributes.history = plainInput.split("\n").map(function (row) {
        const rowSplitted = row.split(", ");
        if (attributes.use_textfield == "1") {
          return {
            date: rowSplitted[0],
            time: rowSplitted[1],
            value_textfield: rowSplitted[2],
          };
        } else {
          return {
            date: rowSplitted[0],
            time: rowSplitted[1],
            value: rowSplitted[2],
          };
        }
      });
    }

    const dataProxy = this.dataProxy;
    return new Command({
      _getRules() {
        return Promise.resolve([
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

  getHistoryRangeCommand() {
    const dataProxy = this.dataProxy;

    return new Command({
      _onValidationSuccess() {
        return dataProxy.getHistoryRange();
      },
    });
  }

  bulkDestroyCommand(historiesIds) {
    const dataProxy = this.dataProxy;

    return new Command({
      _onValidationSuccess() {
        return dataProxy.bulkDestroy(historiesIds);
      },
    })
  }
}

export default HistoryService;
