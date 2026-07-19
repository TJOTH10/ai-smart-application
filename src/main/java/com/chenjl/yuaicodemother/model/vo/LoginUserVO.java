package com.chenjl.yuaicodemother.model.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 登录用户视图（脱敏）
 */
@Schema(description = "登录用户信息")
@Data
public class LoginUserVO implements Serializable {

    /**
     * 用户 id
     */
    @Schema(description = "用户 ID", example = "123456789")
    private Long id;

    /**
     * 账号
     */
    @Schema(description = "用户账号", example = "zhangsan")
    private String userAccount;

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
     * 用户简介
     */
    @Schema(description = "用户简介", example = "这是我的简介")
    private String userProfile;

    /**
     * 用户角色：user/admin
     */
    @Schema(description = "用户角色", example = "user", allowableValues = {"user", "admin"})
    private String userRole;

    /**
     * 创建时间
     */
    @Schema(description = "创建时间", example = "2026-07-18T12:00:00")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @Schema(description = "更新时间", example = "2026-07-18T12:00:00")
    private LocalDateTime updateTime;

    private static final long serialVersionUID = 1L;
}
