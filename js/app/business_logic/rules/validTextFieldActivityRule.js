import { Rule } from "peasy-js";

class ValidTextFieldActivityRule extends Rule {
  constructor(attributes) {
    super();

    this.use_textfield = attributes.use_textfield;
    this.can_change = attributes.can_change;
  }

  _onValidate() {
    if (this.use_textfield && !this.can_change) {
      this._invalidate(
        "If you want to use textfield, then you should check 'is editable' !"
      );
    }

    return Promise.resolve();
  }
}

export default ValidTextFieldActivityRule;
