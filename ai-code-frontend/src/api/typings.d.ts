declare namespace API {
  type AppId = string

  type AppAddRequest = {
    initPrompt?: string
  }

  type AppAdminUpdateRequest = {
    id?: AppId
    appName?: string
    cover?: string
    priority?: number
  }

  type AppDeployRequest = {
    appId?: AppId
  }

  type AppDeleteRequest = {
    id: AppId
  }

  type AppQueryRequest = {
    /** 当前页码，从 1 开始 */
    pageNum?: number
    /** 每页大小 */
    pageSize?: number
    /** 排序字段名 */
    sortField?: string
    /** 排序方向 */
    sortOrder?: 'ascend' | 'descend'
    id?: AppId
    appName?: string
    cover?: string
    initPrompt?: string
    codeGenType?: string
    deployKey?: string
    priority?: number
    userId?: number
  }

  type AppUpdateRequest = {
    id?: AppId
    appName?: string
  }

  type AppVO = {
    id?: AppId
    appName?: string
    cover?: string
    initPrompt?: string
    codeGenType?: string
    deployKey?: string
    deployedTime?: string
    priority?: number
    userId?: number
    createTime?: string
    updateTime?: string
    user?: UserVO
  }

  type BaseResponseAppVO = {
    code?: number
    data?: AppVO
    message?: string
  }

  type BaseResponseBoolean = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseLoginUserVO = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type BaseResponseLong = {
    code?: number
    data?: string
    message?: string
  }

  type BaseResponsePageAppVO = {
    code?: number
    data?: PageAppVO
    message?: string
  }

  type BaseResponsePageUserVO = {
    code?: number
    data?: PageUserVO
    message?: string
  }

  type BaseResponseString = {
    code?: number
    data?: string
    message?: string
  }

  type BaseResponseUser = {
    code?: number
    data?: User
    message?: string
  }

  type BaseResponseUserVO = {
    code?: number
    data?: UserVO
    message?: string
  }

  type chatToGenCodeParams = {
    appId: AppId
    message: string
  }

  type DeleteRequest = {
    /** 要删除的记录 ID */
    id: number
  }

  type getAppVOByIdByAdminParams = {
    id: AppId
  }

  type getAppVOByIdParams = {
    id: AppId
  }

  type getUserByIdParams = {
    /** 用户 ID */
    id: number
  }

  type getUserVOByIdParams = {
    /** 用户 ID */
    id: number
  }

  type LoginUserVO = {
    /** 用户 ID */
    id?: number
    /** 用户账号 */
    userAccount?: string
    /** 用户昵称 */
    userName?: string
    /** 用户头像 URL */
    userAvatar?: string
    /** 用户简介 */
    userProfile?: string
    /** 用户角色 */
    userRole?: 'user' | 'admin'
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
  }

  type PageAppVO = {
    records?: AppVO[]
    pageNumber?: number
    pageSize?: number
    totalPage?: number
    totalRow?: number
    optimizeCountQuery?: boolean
  }

  type PageUserVO = {
    records?: UserVO[]
    pageNumber?: number
    pageSize?: number
    totalPage?: number
    totalRow?: number
    optimizeCountQuery?: boolean
  }

  type ServerSentEventString = true

  type serveStaticResourceParams = {
    deployKey: string
  }

  type User = {
    id?: number
    userAccount?: string
    userPassword?: string
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    editTime?: string
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type UserAddRequest = {
    /** 用户昵称 */
    userName?: string
    /** 用户账号 */
    userAccount: string
    /** 用户头像 URL */
    userAvatar?: string
    /** 用户简介 */
    userProfile?: string
    /** 用户角色 */
    userRole?: 'user' | 'admin'
  }

  type UserLoginRequest = {
    /** 用户账号 */
    userAccount: string
    /** 用户密码 */
    userPassword: string
  }

  type UserQueryRequest = {
    /** 当前页码，从 1 开始 */
    pageNum?: number
    /** 每页大小 */
    pageSize?: number
    /** 排序字段名 */
    sortField?: string
    /** 排序方向 */
    sortOrder?: 'ascend' | 'descend'
    /** 用户 ID 精确匹配 */
    id?: number
    /** 用户昵称模糊搜索 */
    userName?: string
    /** 用户账号模糊搜索 */
    userAccount?: string
    /** 用户简介模糊搜索 */
    userProfile?: string
    /** 用户角色筛选 */
    userRole?: 'user' | 'admin' | 'ban'
  }

  type UserRegisterRequest = {
    /** 用户账号 */
    userAccount: string
    /** 用户密码 */
    userPassword: string
    /** 确认密码，需与密码一致 */
    checkPassword: string
  }

  type UserUpdateRequest = {
    /** 用户 ID */
    id: number
    /** 用户昵称 */
    userName?: string
    /** 用户头像 URL */
    userAvatar?: string
    /** 用户简介 */
    userProfile?: string
    /** 用户角色 */
    userRole?: 'user' | 'admin'
  }

  type UserVO = {
    /** 用户 ID */
    id?: number
    /** 用户账号 */
    userAccount?: string
    /** 用户昵称 */
    userName?: string
    /** 用户头像 URL */
    userAvatar?: string
    /** 用户简介 */
    userProfile?: string
    /** 用户角色 */
    userRole?: 'user' | 'admin'
    /** 创建时间 */
    createTime?: string
  }
}
