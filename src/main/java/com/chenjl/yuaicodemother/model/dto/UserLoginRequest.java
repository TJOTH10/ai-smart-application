package com.chenjl.yuaicodemother.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;

/**
 * 用户登录请求
 */
@Schema(description = "用户登录请求")
@Data
public class UserLoginRequest implements Serializable {

    private static final long serialVersionUID = 3191241716373120793L;

    /**
     * 账号
     */
    @Schema(description = "用户账号", requiredMode = Schema.RequiredMode.REQUIRED, example = "zhangsan")
    private String userAccount;

    /**
     * 密码
     */
    @Schema(description = "用户密码", requiredMode = Schema.RequiredMode.REQUIRED, example = "12345678")
    private String userPassword;
}
