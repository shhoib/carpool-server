const tryCatchMiddleware = (handler) => {
    return async (req, res, next) => {
      try {
        await handler(req, res, next);
      } catch (error) {
        res.status(500);
        res.json({
          status: "failure",
          message: "something went wrong",
          error_message: error.message,
        });
      }
    };
  };
  
  module.exports = tryCatchMiddleware;