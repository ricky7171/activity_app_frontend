import HttpDataProxy from "./httpDataProxy";

class ApplicationLogDataProxy extends HttpDataProxy {
  constructor() {
    super("applicationlog");
  }
}

export default ApplicationLogDataProxy;
