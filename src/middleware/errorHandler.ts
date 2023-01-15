export const errorHandler = (opts?: { logger: Function }) => {
  const defaults = {
    logger: console.error,
  };
  const options = { ...defaults, ...opts };

  return {
    onError: (handler) => {
      const statusCode = handler.error.statusCode || 500;
      const message = handler.error.message || "Internal Server Error";
      if (typeof options.logger === "function") {
        options.logger(handler.error);
      }

      handler.response = {
        statusCode,
        body: JSON.stringify({ statusCode, message }),
        headers: { "Access-Control-Allow-Origin": "*" },
      };
    },
  };
};
