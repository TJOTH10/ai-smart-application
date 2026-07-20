package com.chenjl.yuaicodemother.model.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;

/**
 * 创建用户请求（管理员）
 */
@Schema(description = "创建用户请求")
@Data
public class UserAddRequest implements Serializable {

    /**
     * 用户昵称
     */
    @Schema(description = "用户昵称", example = "张三")
    private String userName;

    /**
     * 账号
     */
    @Schema(description = "用户账号", requiredMode = Schema.RequiredMode.REQUIRED, example = "zhangsan")
    private String userAccount;

    /**
     * 用户头像
     */
    @Schema(description = "用户头像 URL", example = "https://example.com/avatar.png")
    private String userAvatar;

    /**
     * 用户简介
     */
    @Schema(description = "用户简介", example = "这是我的简介")
    private String userProfile;

    /**
     * 用户角色: user, admin
     */
    @Schema(description = "用户角色", example = "user", allowableValues = {"user", "admin"})
    private String userRole;

    private static final long serialVersionUID = 1L;
}
