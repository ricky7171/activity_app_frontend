export default {
  GET_SUCCESS: {
    data: {
      error: false,
      data: [],
    },
  },

  GET_ERROR: {
    data: {
      error: true,
      message: "Get Data Failed: Undefined Error",
    },
  },

  INSERT_SUCCESS: {
    data: {
      error: false,
      message: "create data success",
    },
  },

  INSERT_ERROR: {
    data: {
      error: true,
      message: "Store Data Failed: Undefined Error",
    },
  },

  UPDATE_SUCCESS: {
    data: {
      error: false,
      message: "update data success",
    },
  },

  UPDATE_FAILED: {
    data: {
      error: false,
      message: "Update Data Failed : Undefined Error",
    },
  },

  DELETE_SUCCESS: {
    data: {
      error: false,
      message: "delete data success",
    },
  },

  DELETE_FAILED: {
    data: {
      error: false,
      message: "Delete Data Failed : Undefined Error",
    },
  },
};
