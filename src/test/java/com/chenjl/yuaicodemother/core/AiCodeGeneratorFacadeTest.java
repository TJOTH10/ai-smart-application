package com.chenjl.yuaicodemother.core;

import com.chenjl.yuaicodemother.model.enums.CodeGenTypeEnum;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import reactor.core.publisher.Flux;

import java.io.File;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AiCodeGeneratorFacadeTest {

    @Resource
    private AiCodeGeneratorFacade aiCodeGeneratorFacade;

    @Test
    void generateAndSaveCode() {
        File file = aiCodeGeneratorFacade.generateAndSaveCode("任务记录网站", CodeGenTypeEnum.MULTI_FILE);
        Assertions.assertNotNull(file);
    }

    @Test
    void generateAndSaveCodeStream() {
        // 多文件生成
        // Flux<String> codeStream = aiCodeGeneratorFacade.generateAndSaveCodeStream("任务记录网站", CodeGenTypeEnum.MULTI_FILE);
        // 单文件生成
        Flux<String> codeStream = aiCodeGeneratorFacade.generateAndSaveCodeStream("任务记录网站", CodeGenTypeEnum.HTML);
        // 阻塞等待所有数据收集完成
        List<String> result = codeStream.collectList().block();
        // 验证结果
        Assertions.assertNotNull(result);
        // 将结果拼接成一个完整的字符串
        String completeContent = String.join("", result);
        Assertions.assertNotNull(completeContent);
    }

}
