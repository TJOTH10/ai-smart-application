# 用户模块 API 文档

> 后端服务地址：`http://localhost:8123/api`  
> Swagger 在线文档：`http://localhost:8123/api/doc.html`

---

## 通用说明

### 统一响应格式 `BaseResponse<T>`

所有接口返回格式如下：

```json
{
  "code": 0,
  "data": {},
  "message": "ok"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| code | int | 状态码，`0` 表示成功 |
| data | T | 响应数据，类型因接口而异 |
| message | string | 提示信息 |

### 错误码

| code | message | 说明 |
|------|---------|------|
| 0 | ok | 成功 |
| 40000 | 请求参数错误 | 参数校验不通过 |
| 40100 | 未登录 | 需登录后操作 |
| 40101 | 无权限 | 当前角色无权限 |
| 40300 | 禁止访问 | 禁止访问 |
| 40400 | 请求数据不存在 | 数据未找到 |
| 50000 | 系统内部异常 | 服务器内部错误 |
| 50001 | 操作失败 | 业务操作失败 |

### 认证机制

登录后服务端通过 `HttpSession` 维护登录态（Cookie: `JSESSIONID`）。需要登录的接口需在请求头中携带 Cookie。

---

## 接口列表

| 序号 | 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|------|
| 1 | POST | `/api/user/register` | 用户注册 | 公开 |
| 2 | POST | `/api/user/login` | 用户登录 | 公开 |
| 3 | GET | `/api/user/get/login` | 获取当前登录用户 | 需登录 |
| 4 | GET | `/api/user/get/vo` | 根据 ID 获取脱敏用户 | 公开 |
| 5 | POST | `/api/user/add` | 创建用户 | 管理员 |
| 6 | GET | `/api/user/get` | 根据 ID 获取用户（含敏感字段） | 管理员 |
| 7 | POST | `/api/user/update` | 更新用户 | 管理员 |
| 8 | POST | `/api/user/delete` | 删除用户 | 管理员 |
| 9 | POST | `/api/user/list/page/vo` | 分页查询用户列表 | 管理员 |

---

## 1. 用户注册

### 基本信息

- **方法**: `POST`
- **路径**: `/api/user/register`
- **权限**: 公开

### 请求体

```json
{
  "userAccount": "zhangsan",
  "userPassword": "12345678",
  "checkPassword": "12345678"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userAccount | string | 是 | 用户账号，长度 >= 4 |
| userPassword | string | 是 | 用户密码，长度 >= 8 |
| checkPassword | string | 是 | 确认密码，需与密码一致 |

### 响应示例

```json
{
  "code": 0,
  "data": 1912345678901234567,
  "message": "ok"
}
```

> `data` 为新注册用户的雪花 ID（Long 类型，JS 中需用字符串接收防止精度丢失）

### 错误场景

| 场景 | code | message |
|------|------|---------|
| 参数为空 | 40000 | 请求参数错误 |
| 账号过短 | 40000 | 账号长度需要 >= 4 |
| 密码过短 | 40000 | 密码长度需要 >= 8 |
| 两次密码不一致 | 40000 | 两次输入的密码不一致 |
| 账号已存在 | 40000 | 账号已存在 |

---

## 2. 用户登录

### 基本信息

- **方法**: `POST`
- **路径**: `/api/user/login`
- **权限**: 公开

### 请求体

```json
{
  "userAccount": "zhangsan",
  "userPassword": "12345678"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userAccount | string | 是 | 用户账号 |
| userPassword | string | 是 | 用户密码 |

### 响应示例

```json
{
  "code": 0,
  "data": {
    "id": "1912345678901234567",
    "userAccount": "zhangsan",
    "userName": "张三",
    "userAvatar": "https://example.com/avatar.png",
    "userProfile": "这是我的简介",
    "userRole": "user",
    "createTime": "2026-07-18T12:00:00",
    "updateTime": "2026-07-18T12:00:00"
  },
  "message": "ok"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string(Long) | 用户 ID |
| userAccount | string | 账号 |
| userName | string | 昵称 |
| userAvatar | string | 头像 URL |
| userProfile | string | 简介 |
| userRole | string | 角色：`user` / `admin` |
| createTime | string(datetime) | 创建时间 |
| updateTime | string(datetime) | 更新时间 |

> 登录成功后服务端写入 session，响应头 `Set-Cookie` 携带 `JSESSIONID`

### 错误场景

| 场景 | code | message |
|------|------|---------|
| 参数为空 | 40000 | 请求参数错误 |
| 账号不存在 | 40000 | 账号不存在 |
| 密码错误 | 40000 | 密码错误 |

---

## 3. 获取当前登录用户

### 基本信息

- **方法**: `GET`
- **路径**: `/api/user/get/login`
- **权限**: 需登录（携带 Cookie）

### 请求参数

无请求体，无需 query 参数。需在请求头携带登录时获得的 `Cookie: JSESSIONID=xxx`。

### 响应示例

```json
{
  "code": 0,
  "data": {
    "id": "1912345678901234567",
    "userAccount": "zhangsan",
    "userName": "张三",
    "userAvatar": "https://example.com/avatar.png",
    "userProfile": "这是我的简介",
    "userRole": "user",
    "createTime": "2026-07-18T12:00:00",
    "updateTime": "2026-07-18T12:00:00"
  },
  "message": "ok"
}
```

> 响应字段与登录接口一致

### 错误场景

| 场景 | code | message |
|------|------|---------|
| 未登录 | 40100 | 未登录 |

---

## 4. 根据 ID 获取脱敏用户

### 基本信息

- **方法**: `GET`
- **路径**: `/api/user/get/vo`
- **权限**: 公开

### 请求参数

Query 参数：

```
/api/user/get/vo?id=1912345678901234567
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number(Long) | 是 | 用户 ID，需 > 0 |

### 响应示例

```json
{
  "code": 0,
  "data": {
    "id": "1912345678901234567",
    "userAccount": "zhangsan",
    "userName": "张三",
    "userAvatar": "https://example.com/avatar.png",
    "userProfile": "这是我的简介",
    "userRole": "user",
    "createTime": "2026-07-18T12:00:00"
  },
  "message": "ok"
}
```

> 不含 `updateTime`，脱敏数据不包含密码、删除标记等敏感字段

### 错误场景

| 场景 | code | message |
|------|------|---------|
| id <= 0 | 40000 | 请求参数错误 |
| 用户不存在 | 40400 | 请求数据不存在 |

---

## 5. 创建用户（管理员）

### 基本信息

- **方法**: `POST`
- **路径**: `/api/user/add`
- **权限**: 管理员（`userRole = "admin"`）

### 请求体

```json
{
  "userAccount": "lisi",
  "userName": "李四",
  "userAvatar": "https://example.com/lisi.png",
  "userProfile": "新用户简介",
  "userRole": "user"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userAccount | string | 是 | 用户账号 |
| userName | string | 否 | 用户昵称 |
| userAvatar | string | 否 | 用户头像 URL |
| userProfile | string | 否 | 用户简介 |
| userRole | string | 否 | 角色，不传默认 `user`，可选 `user` / `admin` |

> 创建时默认密码为 `12345678`（MD5 加密存储）

### 响应示例

```json
{
  "code": 0,
  "data": 1912345678901234999,
  "message": "ok"
}
```

> `data` 为新创建用户的雪花 ID

### 错误场景

| 场景 | code | message |
|------|------|---------|
| 参数为空 | 40000 | 请求参数错误 |
| 未登录 | 40100 | 未登录 |
| 非管理员 | 40101 | 无权限 |
| 创建失败 | 50001 | 操作失败 |

---

## 6. 根据 ID 获取用户（管理员）

### 基本信息

- **方法**: `GET`
- **路径**: `/api/user/get`
- **权限**: 管理员

### 请求参数

Query 参数：

```
/api/user/get?id=1912345678901234567
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number(Long) | 是 | 用户 ID，需 > 0 |

### 响应示例

```json
{
  "code": 0,
  "data": {
    "id": "1912345678901234567",
    "userAccount": "zhangsan",
    "userPassword": "e10adc3949ba59abbe56e057f20f883e",
    "userName": "张三",
    "userAvatar": "https://example.com/avatar.png",
    "userProfile": "这是我的简介",
    "userRole": "user",
    "editTime": "2026-07-18T12:00:00",
    "createTime": "2026-07-18T12:00:00",
    "updateTime": "2026-07-18T12:00:00",
    "isDelete": 0
  },
  "message": "ok"
}
```

> 返回完整 `User` 实体，包含 `userPassword`、`isDelete` 等敏感字段，仅供管理后台使用。前端展示请使用 `/api/user/get/vo`。

### 错误场景

| 场景 | code | message |
|------|------|---------|
| id <= 0 | 40000 | 请求参数错误 |
| 用户不存在 | 40400 | 请求数据不存在 |
| 未登录 | 40100 | 未登录 |
| 非管理员 | 40101 | 无权限 |

---

## 7. 更新用户（管理员）

### 基本信息

- **方法**: `POST`
- **路径**: `/api/user/update`
- **权限**: 管理员

### 请求体

```json
{
  "id": 1912345678901234567,
  "userName": "张三三",
  "userAvatar": "https://example.com/new-avatar.png",
  "userProfile": "更新后的简介",
  "userRole": "admin"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number(Long) | **是** | 要更新的用户 ID |
| userName | string | 否 | 新昵称 |
| userAvatar | string | 否 | 新头像 URL |
| userProfile | string | 否 | 新简介 |
| userRole | string | 否 | 新角色，可选 `user` / `admin` |

> 只更新传入的字段，未传入字段保持不变。不支持修改账号和密码。

### 响应示例

```json
{
  "code": 0,
  "data": true,
  "message": "ok"
}
```

### 错误场景

| 场景 | code | message |
|------|------|---------|
| 参数为空或 id 为空 | 40000 | 请求参数错误 |
| 未登录 | 40100 | 未登录 |
| 非管理员 | 40101 | 无权限 |
| 更新失败 | 50001 | 操作失败 |

---

## 8. 删除用户（管理员）

### 基本信息

- **方法**: `POST`
- **路径**: `/api/user/delete`
- **权限**: 管理员

### 请求体

```json
{
  "id": 1912345678901234567
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number(Long) | 是 | 要删除的用户 ID，需 > 0 |

> 删除为**逻辑删除**，设置 `isDelete = 1`，数据不会物理删除。

### 响应示例

```json
{
  "code": 0,
  "data": true,
  "message": "ok"
}
```

### 错误场景

| 场景 | code | message |
|------|------|---------|
| 参数为空或 id <= 0 | 40000 | 请求参数错误 |
| 未登录 | 40100 | 未登录 |
| 非管理员 | 40101 | 无权限 |

---

## 9. 分页查询用户列表（管理员）

### 基本信息

- **方法**: `POST`
- **路径**: `/api/user/list/page/vo`
- **权限**: 管理员

### 请求体

```json
{
  "pageNum": 1,
  "pageSize": 10,
  "sortField": "createTime",
  "sortOrder": "descend",
  "id": null,
  "userName": "张",
  "userAccount": null,
  "userProfile": null,
  "userRole": null
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| pageNum | int | 否 | 1 | 当前页码，从 1 开始 |
| pageSize | int | 否 | 10 | 每页大小 |
| sortField | string | 否 | — | 排序列名，如 `createTime` |
| sortOrder | string | 否 | descend | 排序方向，`ascend` / `descend` |
| id | number(Long) | 否 | — | 用户 ID 精确匹配 |
| userName | string | 否 | — | 昵称模糊搜索 |
| userAccount | string | 否 | — | 账号模糊搜索 |
| userProfile | string | 否 | — | 简介模糊搜索 |
| userRole | string | 否 | — | 角色筛选，可选 `user` / `admin` / `ban` |

> 所有查询条件均为可选，不传则不过滤。支持组合查询。

### 响应示例

```json
{
  "code": 0,
  "data": {
    "totalRow": 2,
    "pageNumber": 1,
    "pageSize": 10,
    "records": [
      {
        "id": "1912345678901234999",
        "userAccount": "lisi",
        "userName": "李四",
        "userAvatar": "https://example.com/lisi.png",
        "userProfile": "新用户简介",
        "userRole": "user",
        "createTime": "2026-07-19T10:00:00"
      },
      {
        "id": "1912345678901234567",
        "userAccount": "zhangsan",
        "userName": "张三",
        "userAvatar": "https://example.com/avatar.png",
        "userProfile": "这是我的简介",
        "userRole": "admin",
        "createTime": "2026-07-18T12:00:00"
      }
    ]
  },
  "message": "ok"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| totalRow | number | 总记录数 |
| pageNumber | number | 当前页码 |
| pageSize | number | 每页大小 |
| records | array | 当前页数据（`UserVO` 脱敏列表） |

> `records` 中每条记录的字段含义参考「根据 ID 获取脱敏用户」接口。

### 错误场景

| 场景 | code | message |
|------|------|---------|
| 参数为空 | 40000 | 请求参数错误 |
| 未登录 | 40100 | 未登录 |
| 非管理员 | 40101 | 无权限 |

---

## 前端对接建议

### 1. Axios 封装示例

```typescript
// api/types.ts
interface BaseResponse<T> {
  code: number
  data: T
  message: string
}

interface LoginUserVO {
  id: string           // Long → string 防止精度丢失
  userAccount: string
  userName: string
  userAvatar: string
  userProfile: string
  userRole: 'user' | 'admin'
  createTime: string
  updateTime: string
}

interface UserVO {
  id: string
  userAccount: string
  userName: string
  userAvatar: string
  userProfile: string
  userRole: 'user' | 'admin'
  createTime: string
}

interface PageResult<T> {
  totalRow: number
  pageNumber: number
  pageSize: number
  records: T[]
}

// 登录请求
interface UserLoginRequest {
  userAccount: string
  userPassword: string
}

// 注册请求
interface UserRegisterRequest {
  userAccount: string
  userPassword: string
  checkPassword: string
}

// 分页查询请求
interface UserQueryRequest {
  pageNum?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'ascend' | 'descend'
  id?: number
  userName?: string
  userAccount?: string
  userProfile?: string
  userRole?: string
}
```

### 2. 登录态维护

- 登录成功后浏览器会自动保存 `JSESSIONID` Cookie（后端 `HttpSession` 机制）
- 后续请求自动携带 Cookie，无需手动处理 Token
- 跨域场景需设置 `withCredentials: true`

```typescript
// axios 配置
axios.defaults.withCredentials = true
```

### 3. Long 精度处理

后端雪花 ID 为 Java Long 类型，超出 JS 安全整数范围（2⁵³-1）。后端 `JsonConfig` 已配置将 Long 序列化为字符串，前端直接用字符串接收即可，无需额外处理。
