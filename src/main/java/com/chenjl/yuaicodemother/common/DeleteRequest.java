package com.chenjl.yuaicodemother.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;

/**
 * 通用删除请求
 */
@Schema(description = "删除请求")
@Data
public class DeleteRequest implements Serializable {

    /**
     * id
     */
    @Schema(description = "要删除的记录 ID", requiredMode = Schema.RequiredMode.REQUIRED, example = "123456789")
    private Long id;

    private static final long serialVersionUID = 1L;
}
