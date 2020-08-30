// https://www.jsonrpc.org/specification

/**
 * An identifier established by the Client that MUST contain a String, Number, or NULL value if included.
 * If it is not included it is assumed to be a notification.
 * The value SHOULD normally not be Null and Numbers SHOULD NOT contain fractional parts
 */
export type Id = string | number | null;

/**
 * A Structured value that holds the parameter values to be used during the invocation of the method.
 */
export type Params = Record<string, any> | Array<any>;

/**
 * A Primitive or Structured value that contains additional information about the error.
 */
export type ErrorDetails = object | string | Array<any>;

/**
 * A rpc call is represented by sending a Request object to a Server
 */
export type Request = {
    /**
     * A String specifying the version of the JSON-RPC protocol. MUST be exactly "2.0"
     */
    jsonrpc: '2.0';
    /**
     * A String containing the name of the method to be invoked. Method names that begin with the word rpc followed
     * by a period character (U+002E or ASCII 46) are reserved for rpc-internal methods and extensions and MUST NOT
     * be used for anything else.
     */
    method: string;
    /**
     * A Structured value that holds the parameter values to be used during the invocation of the method.
     * This member MAY be omitted.
     */
    params?: Params;
    /**
     * An identifier established by the Client that MUST contain a String, Number, or NULL value if included.
     * If it is not included it is assumed to be a notification
     */
    id?: Id;
};

/**
 * When a rpc call encounters an error, the Response Object MUST
 * contain the error member with a value that is a Object
 */
export type ErrorObject = {
    /**
     * A Number that indicates the error type that occurred.
     * This MUST be an integer.
     */
    code: number;
    /**
     * A String providing a short description of the error.
     * The message SHOULD be limited to a concise single sentence.
     */
    message: string;
    /**
     * A Primitive or Structured value that contains additional information about the error.
     * This may be omitted.
     * The value of this member is defined by the Server (e.g. detailed error information, nested errors etc.).
     */
    data?: ErrorDetails;
};

/**
 * When a rpc call is made, the Server MUST reply with a Response, except for in the case of Notifications.
 * The Response is expressed as a single JSON Object
 */
export type ResponseObject =
    | {
          /**
           * A String specifying the version of the JSON-RPC protocol. MUST be exactly "2.0"
           */
          jsonrpc: '2.0';
          /**
           * This member is REQUIRED on success.
           * This member MUST NOT exist if there was an error invoking the method.
           * The value of this member is determined by the method invoked on the Server.
           */
          result: any;
          /**
           * This member is REQUIRED.
           * It MUST be the same as the value of the id member in the Request Object.
           * If there was an error in detecting the id in the Request object (e.g. Parse error/Invalid Request), it MUST be Null.
           */
          id: Id;
      }
    | {
          /**
           * A String specifying the version of the JSON-RPC protocol. MUST be exactly "2.0"
           */
          jsonrpc: '2.0';
          /**
           * This member is REQUIRED on error.
           * This member MUST NOT exist if there was no error triggered during invocation.
           * The value for this member MUST be an Object
           */
          error: ErrorObject;
          /**
           * This member is REQUIRED.
           * It MUST be the same as the value of the id member in the Request Object.
           * If there was an error in detecting the id in the Request object (e.g. Parse error/Invalid Request), it MUST be Null.
           */
          id: Id;
      };
