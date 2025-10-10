package com.soo.libs.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
@ToString
public class ApiResponseDto<T> implements Serializable {
    private int code;
    private String message;
    private T result;
    private boolean isSuccess;

    public static <T> ApiResponseDto<T> success(T result) {
        return ApiResponseDto.<T>builder()
                .code(ApiCode.SUCCESS)
                .message(ApiCode.SUCCESS_MSG)
                .result(result)
                .isSuccess(true)
                .build();
    }

    public static <T> ApiResponseDto<T> success(T result, String message) {
        return ApiResponseDto.<T>builder()
                .code(ApiCode.SUCCESS)
                .message(message)
                .result(result)
                .isSuccess(true)
                .build();
    }

    public static <T> ApiResponseDto<T> failure(String message) {
        return ApiResponseDto.<T>builder()
                .code(ApiCode.FAILURE)
                .message(message)
                .isSuccess(false)
                .build();
    }

    public static <T> ApiResponseDto<T> failure(int code, String message) {
        return ApiResponseDto.<T>builder()
                .code(code)
                .message(message)
                .isSuccess(false)
                .build();
    }

    public static <T> ApiResponseDto<T> error(String message) {
        return ApiResponseDto.<T>builder()
                .code(ApiCode.ERROR)
                .message(message)
                .isSuccess(false)
                .build();
    }

    public static <T> ApiResponseDto<T> error(int code, String message) {
        return ApiResponseDto.<T>builder()
                .code(code)
                .message(message)
                .isSuccess(false)
                .build();
    }

}
