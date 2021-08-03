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
        this.inputHistories.forEach((history) => {
          const keyValue = this.useTextfield ? "value_textfield" : "value";
    
          if (!history.date || !history.time || !history[keyValue]) {
            isValidFormat = false;
          }
        });
    
        if (isValidFormat == false) {
            this._invalidate("Your input format is wrong !");
        }
    }


    return Promise.resolve();
  }
}

export default CanBulkInsertHistoryRule;
