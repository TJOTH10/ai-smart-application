package com.chenjl.yuaicodemother.model.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;

/**
 * 更新用户请求（管理员）
 */
@Schema(description = "更新用户请求")
@Data
public class UserUpdateRequest implements Serializable {

    /**
     * id
     */
    @Schema(description = "用户 ID", requiredMode = Schema.RequiredMode.REQUIRED, example = "123456789")
    private Long id;

    /**
     * 用户昵称
     */
    @Schema(description = "用户昵称", example = "张三")
    private String userName;

    /**
     * 用户头像
     */
    @Schema(description = "用户头像 URL", example = "https://example.com/avatar.png")
    private String userAvatar;

    /**
     * 简介
     */
    @Schema(description = "用户简介", example = "这是我的简介")
    private String userProfile;

    /**
     * 用户角色：user/admin
     */
    @Schema(description = "用户角色", example = "user", allowableValues = {"user", "admin"})
    private String userRole;

    private static final long serialVersionUID = 1L;
}
