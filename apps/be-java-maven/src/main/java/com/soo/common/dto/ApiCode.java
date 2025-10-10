package com.soo.common.dto;

public class ApiCode {

    public static final int SUCCESS = 200000;
    public static final String SUCCESS_MSG = "Success";
    public static final int FAILURE = 400000;
    public static final String FAILURE_MSG = "Failure";
    public static final int ERROR = 500000;
    public static final String ERROR_MSG = "Error";
    public static final int ERROR_UNAUTHORIZED = 401000;
    public static final String ERROR_UNAUTHORIZED_MSG = "Unauthorized";
    public static final int ERROR_FORBIDDEN = 403000;
    public static final String ERROR_FORBIDDEN_MSG = "Forbidden";
    public static final int ERROR_NOT_FOUND = 404000;
    public static final String ERROR_NOT_FOUND_MSG = "Not Found";
    public static final int ERROR_TIMEOUT = 408000;
    public static final String ERROR_TIMEOUT_MSG = "Request Timeout";
    public static final int ERROR_CONFLICT = 409000;
    public static final String ERROR_CONFLICT_MSG = "Conflict";
    public static final int ERROR_NETWORK = 500001;
    public static final String ERROR_NETWORK_MSG = "Network Error";
    public static final int ERROR_SERVER = 500100;
    public static final String ERROR_SERVER_MSG = "Internal Server Error";
    public static final int ERROR_SERVICE_UNAVAILABLE = 503000;
    public static final String ERROR_SERVICE_UNAVAILABLE_MSG = "Service Unavailable";
    public static final int ERROR_GATEWAY_TIMEOUT = 504000;
    public static final String ERROR_GATEWAY_TIMEOUT_MSG = "Gateway Timeout";

}
