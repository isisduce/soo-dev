export const ApiCode = {
    CODE: {
        SUCCESS: 200000, SUCCESS_MSG: 'Success',
        FAILURE: 400000, FAILURE_MSG: 'Failure',
        ERROR:   500000, ERROR_MSG:   'Error',
        ERROR_UNAUTHORIZED: 401000, ERROR_UNAUTHORIZED_MSG: 'Unauthorized',
        ERROR_FORBIDDEN: 403000, ERROR_FORBIDDEN_MSG: 'Forbidden',
        ERROR_NOT_FOUND: 404000, ERROR_NOT_FOUND_MSG: 'Not Found',
        ERROR_TIMEOUT: 408000, ERROR_TIMEOUT_MSG: 'Request Timeout',
        ERROR_CONFLICT: 409000, ERROR_CONFLICT_MSG: 'Conflict',
        ERROR_NETWORK: 500001, ERROR_NETWORK_MSG: 'Network Error',
        ERROR_SERVER: 500100, ERROR_SERVER_MSG: 'Internal Server Error',
        ERROR_SERVICE_UNAVAILABLE: 503000, ERROR_SERVICE_UNAVAILABLE_MSG: 'Service Unavailable',
        ERROR_GATEWAY_TIMEOUT: 504000, ERROR_GATEWAY_TIMEOUT_MSG: 'Gateway Timeout',
        //
        ERROR_INVALID_API_SERVER: 600001, ERROR_INVALID_API_SERVER_MSG: 'Invalid API Server',
        ERROR_LOGIN_FAILURE: 600002, ERROR_LOGIN_FAILURE_MSG: 'Login Failure',
    } as const,
};

const isSuccess = function(this: ApiResponseDTO<any>): boolean { return this.code === ApiCode.CODE.SUCCESS; }

export interface ApiResponseDTO<T> {
    code: number;
    message: string;
    result: T;
    readonly success: boolean;
}

export const ApiResponse = {
    success<T>(result: T): ApiResponseDTO<T> {
        return {
            code: ApiCode.CODE.SUCCESS,
            message: ApiCode.CODE.SUCCESS_MSG,
            result,
            get success() { return isSuccess.call(this); }
        };
    },

    successWithMessage<T>(result: T, message: string = ApiCode.CODE.SUCCESS_MSG): ApiResponseDTO<T> {
        return {
            code: ApiCode.CODE.SUCCESS,
            message,
            result,
            get success() { return isSuccess.call(this); }
        };
    },

    failure<T>(code?: number, message?: string, result?: T): ApiResponseDTO<T> {
        return {
            code: code || ApiCode.CODE.FAILURE,
            message: message || ApiCode.CODE.FAILURE_MSG,
            result: result || null as any,
            get success() { return isSuccess.call(this); }
        };
    },

    Failure<T>({code = ApiCode.CODE.FAILURE, message = ApiCode.CODE.FAILURE_MSG, result = null as any}: {code?: number, message?: string, result?: T}): ApiResponseDTO<T> {
        return {
            code,
            message,
            result,
            get success() { return isSuccess.call(this); }
        };
    },

    error<T>(code?: number, message?: string, result?: T): ApiResponseDTO<T> {
        return {
            code: code || ApiCode.CODE.ERROR,
            message: message || ApiCode.CODE.ERROR_MSG,
            result: result || null as any,
            get success() { return isSuccess.call(this); }
        };
    },

    Error<T>({code = ApiCode.CODE.ERROR, message = ApiCode.CODE.ERROR_MSG, result = null as any}: {code?: number, message?: string, result?: T}): ApiResponseDTO<T> {
        return {
            code,
            message,
            result,
            get success() { return isSuccess.call(this); }
        };
    },

};
