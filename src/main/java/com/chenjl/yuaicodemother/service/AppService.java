package com.chenjl.yuaicodemother.service;

import com.chenjl.yuaicodemother.model.dto.app.AppQueryRequest;
import com.chenjl.yuaicodemother.model.entity.User;
import com.chenjl.yuaicodemother.model.vo.AppVO;
import com.mybatisflex.core.query.QueryWrapper;
import com.mybatisflex.core.service.IService;
import com.chenjl.yuaicodemother.model.entity.App;
import reactor.core.publisher.Flux;

import java.util.List;

/**
 * 应用 服务层。
 *
 * @author Administrator
 * @since 2026-07-21
 */
public interface AppService extends IService<App> {

    /**
     * 获取应用封装类
     * @param app
     * @return
     */
    public AppVO getAppVO(App app);

    /**
     * 获取应用封装类列表
     * @param appList
     * @return
     */
    public List<AppVO> getAppVOList(List<App> appList);

    /**
     *  构造查询条件获取查询条件
     * @param appQueryRequest
     * @return
     */
    public QueryWrapper getQueryWrapper(AppQueryRequest appQueryRequest);

    /**
     *  通过对话生成应用代码
     *
     * @param appId 应用id
     * @param message 对话内容
     * @param loginUser 登陆用户
     * @return
     */
    public Flux<String> chatToGenCode(Long appId, String message, User loginUser);

    /**
     * 应=应用部署
     *
     * @param appId 应用id
     * @param loginUser 登陆用户
     * @return
     */
    public String deployApp(Long appId, User loginUser);

}
