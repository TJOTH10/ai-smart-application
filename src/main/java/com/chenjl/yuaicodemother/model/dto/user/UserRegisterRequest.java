package com.chenjl.yuaicodemother.model.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;

/**
 * 用户注册请求
 */
@Schema(description = "用户注册请求")
@Data
public class UserRegisterRequest implements Serializable {

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

    /**
     * 确认密码
     */
    @Schema(description = "确认密码，需与密码一致", requiredMode = Schema.RequiredMode.REQUIRED, example = "12345678")
    private String checkPassword;
}
