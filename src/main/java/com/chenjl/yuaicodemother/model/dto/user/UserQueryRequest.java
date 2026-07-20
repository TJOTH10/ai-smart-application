package com.chenjl.yuaicodemother.model.dto.user;

import com.chenjl.yuaicodemother.common.PageRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * 用户分页查询请求（管理员）
 */
@Schema(description = "用户分页查询请求")
@EqualsAndHashCode(callSuper = true)
@Data
public class UserQueryRequest extends PageRequest implements Serializable {

    /**
     * id
     */
    @Schema(description = "用户 ID 精确匹配", example = "123456789")
    private Long id;

    /**
     * 用户昵称
     */
    @Schema(description = "用户昵称模糊搜索", example = "张三")
    private String userName;

    /**
     * 账号
     */
    @Schema(description = "用户账号模糊搜索", example = "zhangsan")
    private String userAccount;

    /**
     * 简介
     */
    @Schema(description = "用户简介模糊搜索", example = "编程")
    private String userProfile;

    /**
     * 用户角色：user/admin/ban
     */
    @Schema(description = "用户角色筛选", example = "user", allowableValues = {"user", "admin", "ban"})
    private String userRole;

    private static final long serialVersionUID = 1L;
}
