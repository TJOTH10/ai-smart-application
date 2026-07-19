package com.chenjl.yuaicodemother.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 分页请求基类
 */
@Schema(description = "分页请求参数")
@Data
public class PageRequest {

    /**
     * 当前页号
     */
    @Schema(description = "当前页码，从 1 开始", example = "1")
    private int pageNum = 1;

    /**
     * 页面大小
     */
    @Schema(description = "每页大小", example = "10")
    private int pageSize = 10;

    /**
     * 排序字段
     */
    @Schema(description = "排序字段名", example = "createTime")
    private String sortField;

    /**
     * 排序顺序（默认降序）
     */
    @Schema(description = "排序方向", example = "descend", allowableValues = {"ascend", "descend"})
    private String sortOrder = "descend";
}
