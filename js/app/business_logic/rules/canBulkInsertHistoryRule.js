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

        if (!history.date || !history[keyValue]) {
          isValidFormat = false;
        }

        if (history.time) {
          // validate format time
          const split = history.time.split(":");

          if (split.length < 3) {
            isValidFormat = false;
          } else {
            split.forEach((t) => {
              if (t.length > 2) {
                isValidFormat = false;
              }
            });
          }

          console.log('DEBUG', { split, history })
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
