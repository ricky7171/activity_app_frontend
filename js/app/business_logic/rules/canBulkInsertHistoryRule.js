import { Rule } from "peasy-js";

class CanBulkInsertHistoryRule extends Rule {
  constructor(inputHistories, useTextfield) {
    super();

    this.inputHistories = inputHistories;
    this.useTextfield = useTextfield;
  }

  _onValidate() {
    if (!this.inputHistories) {
      this._invalidate("Please fill data");
    } else {
        // checkFormat
        let isValidFormat = true;
        console.log("🚀 ~ file: canBulkInsertHistoryRule.js ~ line 19 ~ CanBulkInsertHistoryRule ~ this.inputHistories.forEach ~ inputHistories", this.inputHistories)
        this.inputHistories.forEach((history) => {
          const keyValue = this.useTextfield ? "value_textfield" : "value";
    
          if (!history.date || !history.time || !history[keyValue]) {
            isValidFormat = false;
          }
        });
    
        if (isValidFormat == false) {
            this._invalidate("Your input format is wrong !");
        }
        console.log("🚀 ~ file: canBulkInsertHistoryRule.js ~ line 27 ~ CanBulkInsertHistoryRule ~ _onValidate ~ isValidFormat", isValidFormat)
    }


    return Promise.resolve();
  }
}

export default CanBulkInsertHistoryRule;
