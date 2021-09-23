import { BusinessService, Command } from "peasy-js";
import { ValidTextFieldActivityRule, FieldRequiredRule } from "../rules";

class ApplicationLogService extends BusinessService {
  constructor(dataProxy) {
    super(dataProxy);
  }

}

export default ApplicationLogService;
