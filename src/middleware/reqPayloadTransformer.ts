export const requestPayloadTransformerMiddleware = ({
  payloadType,
  transformerFunction,
}: {
  payloadType: "body" | "headers" | "queryStringParameters";
  transformerFunction: Function;
}) => {
  return {
    before: ({ event }) => {
      const objectToTransform = (() => {
        switch (payloadType) {
          case "body":
            return event.body;
          case "headers":
            return event.headers;
          case "queryStringParameters":
            return event.queryStringParameters;
        }
      })();
      event[payloadType] = transformerFunction(objectToTransform);
    },
  };
};
