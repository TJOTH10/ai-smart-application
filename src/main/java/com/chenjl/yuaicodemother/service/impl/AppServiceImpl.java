package com.chenjl.yuaicodemother.service.impl;

import com.mybatisflex.spring.service.impl.ServiceImpl;
import com.chenjl.yuaicodemother.model.entity.App;
import com.chenjl.yuaicodemother.mapper.AppMapper;
import com.chenjl.yuaicodemother.service.AppService;
import org.springframework.stereotype.Service;

/**
 * 应用 服务层实现。
 *
 * @author Administrator
 * @since 2026-07-21
 */
@Service
public class AppServiceImpl extends ServiceImpl<AppMapper, App>  implements AppService{

}
