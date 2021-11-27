import { Rule } from "peasy-js";

class FieldRequiredRule extends Rule {
  constructor(field, association = null, data = null, message = null) {
    super();

    if (!data) {
      data = association;
      association = field;
    }

    this.association = association;
    this.field = field;
    this.data = data;
    this.message = message;
  }

  _onValidate() {
    this.data = this.data || {};
    console.log("REQUIRED RULE", {
      fied: this.field,
      data: this.data,
      selected_data: this.data[this.field]
    })
    if (!this.data[this.field]) {
      this._invalidate(
        this.message ? this.message : this.association + " is required"
      );
    }

    return Promise.resolve();
  }
}

export default FieldRequiredRule;
