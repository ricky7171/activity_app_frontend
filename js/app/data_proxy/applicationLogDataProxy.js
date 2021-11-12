import HttpDataProxy from "./httpDataProxy";

class ApplicationLogDataProxy extends HttpDataProxy {
  constructor() {
    super("applicationLog");
  }
}

export default ApplicationLogDataProxy;
