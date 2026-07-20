package com.chenjl.yuaicodemother.service;

import com.chenjl.yuaicodemother.model.dto.app.AppQueryRequest;
import com.chenjl.yuaicodemother.model.vo.AppVO;
import com.mybatisflex.core.query.QueryWrapper;
import com.mybatisflex.core.service.IService;
import com.chenjl.yuaicodemother.model.entity.App;

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

}
