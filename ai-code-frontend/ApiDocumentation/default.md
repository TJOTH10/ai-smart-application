# OpenAPI definition


**简介**:OpenAPI definition


**HOST**:http://localhost:8123/api


**联系人**:


**Version**:v0


**接口路径**:/api/v3/api-docs/default


[TOC]






# 用户管理


## 更新用户


**接口地址**:`/api/user/update`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员更新用户信息（昵称、头像、简介、角色等）</p>



**请求示例**:


```javascript
{
  "id": 123456789,
  "userName": "张三",
  "userAvatar": "https://example.com/avatar.png",
  "userProfile": "这是我的简介",
  "userRole": "user"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userUpdateRequest|更新用户请求|body|true|UserUpdateRequest|UserUpdateRequest|
|&emsp;&emsp;id|用户 ID||true|integer(int64)||
|&emsp;&emsp;userName|用户昵称||false|string||
|&emsp;&emsp;userAvatar|用户头像 URL||false|string||
|&emsp;&emsp;userProfile|用户简介||false|string||
|&emsp;&emsp;userRole|用户角色,可用值:user,admin||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseBoolean|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## 用户注册


**接口地址**:`/api/user/register`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>创建新用户账号，账号和密码长度需满足要求</p>



**请求示例**:


```javascript
{
  "userAccount": "zhangsan",
  "userPassword": "12345678",
  "checkPassword": "12345678"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userRegisterRequest|用户注册请求|body|true|UserRegisterRequest|UserRegisterRequest|
|&emsp;&emsp;userAccount|用户账号||true|string||
|&emsp;&emsp;userPassword|用户密码||true|string||
|&emsp;&emsp;checkPassword|确认密码，需与密码一致||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseLong|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||integer(int64)|integer(int64)|
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"message": ""
}
```


## 用户登录


**接口地址**:`/api/user/login`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>使用账号密码登录，登录成功后将用户信息存入 session</p>



**请求示例**:


```javascript
{
  "userAccount": "zhangsan",
  "userPassword": "12345678"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userLoginRequest|用户登录请求|body|true|UserLoginRequest|UserLoginRequest|
|&emsp;&emsp;userAccount|用户账号||true|string||
|&emsp;&emsp;userPassword|用户密码||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseLoginUserVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||LoginUserVO|LoginUserVO|
|&emsp;&emsp;id|用户 ID|integer(int64)||
|&emsp;&emsp;userAccount|用户账号|string||
|&emsp;&emsp;userName|用户昵称|string||
|&emsp;&emsp;userAvatar|用户头像 URL|string||
|&emsp;&emsp;userProfile|用户简介|string||
|&emsp;&emsp;userRole|用户角色,可用值:user,admin|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"id": 123456789,
		"userAccount": "zhangsan",
		"userName": "张三",
		"userAvatar": "https://example.com/avatar.png",
		"userProfile": "这是我的简介",
		"userRole": "user",
		"createTime": "",
		"updateTime": ""
	},
	"message": ""
}
```


## 分页查询用户列表


**接口地址**:`/api/user/list/page/vo`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员分页查询用户，支持按昵称、账号、角色等条件筛选，返回脱敏数据</p>



**请求示例**:


```javascript
{
  "pageNum": 1,
  "pageSize": 10,
  "sortField": "createTime",
  "sortOrder": "descend",
  "id": 123456789,
  "userName": "张三",
  "userAccount": "zhangsan",
  "userProfile": "编程",
  "userRole": "user"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userQueryRequest|用户分页查询请求|body|true|UserQueryRequest|UserQueryRequest|
|&emsp;&emsp;pageNum|当前页码，从 1 开始||false|integer(int32)||
|&emsp;&emsp;pageSize|每页大小||false|integer(int32)||
|&emsp;&emsp;sortField|排序字段名||false|string||
|&emsp;&emsp;sortOrder|排序方向,可用值:ascend,descend||false|string||
|&emsp;&emsp;id|用户 ID 精确匹配||false|integer(int64)||
|&emsp;&emsp;userName|用户昵称模糊搜索||false|string||
|&emsp;&emsp;userAccount|用户账号模糊搜索||false|string||
|&emsp;&emsp;userProfile|用户简介模糊搜索||false|string||
|&emsp;&emsp;userRole|用户角色筛选,可用值:user,admin,ban||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponsePageUserVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||PageUserVO|PageUserVO|
|&emsp;&emsp;records|用户脱敏信息|array|UserVO|
|&emsp;&emsp;&emsp;&emsp;id|用户 ID|integer||
|&emsp;&emsp;&emsp;&emsp;userAccount|用户账号|string||
|&emsp;&emsp;&emsp;&emsp;userName|用户昵称|string||
|&emsp;&emsp;&emsp;&emsp;userAvatar|用户头像 URL|string||
|&emsp;&emsp;&emsp;&emsp;userProfile|用户简介|string||
|&emsp;&emsp;&emsp;&emsp;userRole|用户角色,可用值:user,admin|string||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;pageNumber||integer(int64)||
|&emsp;&emsp;pageSize||integer(int64)||
|&emsp;&emsp;totalPage||integer(int64)||
|&emsp;&emsp;totalRow||integer(int64)||
|&emsp;&emsp;optimizeCountQuery||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"records": [
			{
				"id": 123456789,
				"userAccount": "zhangsan",
				"userName": "张三",
				"userAvatar": "https://example.com/avatar.png",
				"userProfile": "这是我的简介",
				"userRole": "user",
				"createTime": ""
			}
		],
		"pageNumber": 0,
		"pageSize": 0,
		"totalPage": 0,
		"totalRow": 0,
		"optimizeCountQuery": true
	},
	"message": ""
}
```


## 删除用户


**接口地址**:`/api/user/delete`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员根据 ID 逻辑删除用户</p>



**请求示例**:


```javascript
{
  "id": 123456789
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|deleteRequest|删除请求|body|true|DeleteRequest|DeleteRequest|
|&emsp;&emsp;id|要删除的记录 ID||true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseBoolean|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## 创建用户


**接口地址**:`/api/user/add`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员创建新用户，默认密码为 12345678</p>



**请求示例**:


```javascript
{
  "userName": "张三",
  "userAccount": "zhangsan",
  "userAvatar": "https://example.com/avatar.png",
  "userProfile": "这是我的简介",
  "userRole": "user"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userAddRequest|创建用户请求|body|true|UserAddRequest|UserAddRequest|
|&emsp;&emsp;userName|用户昵称||false|string||
|&emsp;&emsp;userAccount|用户账号||true|string||
|&emsp;&emsp;userAvatar|用户头像 URL||false|string||
|&emsp;&emsp;userProfile|用户简介||false|string||
|&emsp;&emsp;userRole|用户角色,可用值:user,admin||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseLong|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||integer(int64)|integer(int64)|
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"message": ""
}
```


## 根据 ID 获取用户


**接口地址**:`/api/user/get`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员根据用户 ID 查询完整用户信息（含敏感字段）</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|用户 ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseUser|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||User|User|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;userAccount||string||
|&emsp;&emsp;userPassword||string||
|&emsp;&emsp;userName||string||
|&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;userProfile||string||
|&emsp;&emsp;userRole||string||
|&emsp;&emsp;editTime||string(date-time)||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;isDelete||integer(int32)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"id": 0,
		"userAccount": "",
		"userPassword": "",
		"userName": "",
		"userAvatar": "",
		"userProfile": "",
		"userRole": "",
		"editTime": "",
		"createTime": "",
		"updateTime": "",
		"isDelete": 0
	},
	"message": ""
}
```


## 根据 ID 获取脱敏用户


**接口地址**:`/api/user/get/vo`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据用户 ID 查询，返回脱敏后的用户信息（不含密码等敏感字段）</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|用户 ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseUserVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||UserVO|UserVO|
|&emsp;&emsp;id|用户 ID|integer(int64)||
|&emsp;&emsp;userAccount|用户账号|string||
|&emsp;&emsp;userName|用户昵称|string||
|&emsp;&emsp;userAvatar|用户头像 URL|string||
|&emsp;&emsp;userProfile|用户简介|string||
|&emsp;&emsp;userRole|用户角色,可用值:user,admin|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"id": 123456789,
		"userAccount": "zhangsan",
		"userName": "张三",
		"userAvatar": "https://example.com/avatar.png",
		"userProfile": "这是我的简介",
		"userRole": "user",
		"createTime": ""
	},
	"message": ""
}
```


## 获取当前登录用户


**接口地址**:`/api/user/get/login`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>从 session 中获取当前登录用户信息，未登录则报错</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseLoginUserVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||LoginUserVO|LoginUserVO|
|&emsp;&emsp;id|用户 ID|integer(int64)||
|&emsp;&emsp;userAccount|用户账号|string||
|&emsp;&emsp;userName|用户昵称|string||
|&emsp;&emsp;userAvatar|用户头像 URL|string||
|&emsp;&emsp;userProfile|用户简介|string||
|&emsp;&emsp;userRole|用户角色,可用值:user,admin|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"id": 123456789,
		"userAccount": "zhangsan",
		"userName": "张三",
		"userAvatar": "https://example.com/avatar.png",
		"userProfile": "这是我的简介",
		"userRole": "user",
		"createTime": "",
		"updateTime": ""
	},
	"message": ""
}
```


# app-controller


## updateApp


**接口地址**:`/api/app/update`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 0,
  "appName": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|appUpdateRequest|AppUpdateRequest|body|true|AppUpdateRequest|AppUpdateRequest|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;appName|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseBoolean|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## listMyAppVOByPage


**接口地址**:`/api/app/my/list/page/vo`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "pageNum": 1,
  "pageSize": 10,
  "sortField": "createTime",
  "sortOrder": "descend",
  "id": 0,
  "appName": "",
  "cover": "",
  "initPrompt": "",
  "codeGenType": "",
  "deployKey": "",
  "priority": 0,
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|appQueryRequest|AppQueryRequest|body|true|AppQueryRequest|AppQueryRequest|
|&emsp;&emsp;pageNum|当前页码，从 1 开始||false|integer(int32)||
|&emsp;&emsp;pageSize|每页大小||false|integer(int32)||
|&emsp;&emsp;sortField|排序字段名||false|string||
|&emsp;&emsp;sortOrder|排序方向,可用值:ascend,descend||false|string||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;appName|||false|string||
|&emsp;&emsp;cover|||false|string||
|&emsp;&emsp;initPrompt|||false|string||
|&emsp;&emsp;codeGenType|||false|string||
|&emsp;&emsp;deployKey|||false|string||
|&emsp;&emsp;priority|||false|integer(int32)||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponsePageAppVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||PageAppVO|PageAppVO|
|&emsp;&emsp;records||array|AppVO|
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;appName||string||
|&emsp;&emsp;&emsp;&emsp;cover||string||
|&emsp;&emsp;&emsp;&emsp;initPrompt||string||
|&emsp;&emsp;&emsp;&emsp;codeGenType||string||
|&emsp;&emsp;&emsp;&emsp;deployKey||string||
|&emsp;&emsp;&emsp;&emsp;deployedTime||string||
|&emsp;&emsp;&emsp;&emsp;priority||integer||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;updateTime||string||
|&emsp;&emsp;&emsp;&emsp;user|用户脱敏信息|UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|用户 ID|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAccount|用户账号|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName|用户昵称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar|用户头像 URL|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile|用户简介|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole|用户角色,可用值:user,admin|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;pageNumber||integer(int64)||
|&emsp;&emsp;pageSize||integer(int64)||
|&emsp;&emsp;totalPage||integer(int64)||
|&emsp;&emsp;totalRow||integer(int64)||
|&emsp;&emsp;optimizeCountQuery||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"records": [
			{
				"id": 0,
				"appName": "",
				"cover": "",
				"initPrompt": "",
				"codeGenType": "",
				"deployKey": "",
				"deployedTime": "",
				"priority": 0,
				"userId": 0,
				"createTime": "",
				"updateTime": "",
				"user": {
					"id": 123456789,
					"userAccount": "zhangsan",
					"userName": "张三",
					"userAvatar": "https://example.com/avatar.png",
					"userProfile": "这是我的简介",
					"userRole": "user",
					"createTime": ""
				}
			}
		],
		"pageNumber": 0,
		"pageSize": 0,
		"totalPage": 0,
		"totalRow": 0,
		"optimizeCountQuery": true
	},
	"message": ""
}
```


## listGoodAppVOByPage


**接口地址**:`/api/app/good/list/page/vo`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "pageNum": 1,
  "pageSize": 10,
  "sortField": "createTime",
  "sortOrder": "descend",
  "id": 0,
  "appName": "",
  "cover": "",
  "initPrompt": "",
  "codeGenType": "",
  "deployKey": "",
  "priority": 0,
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|appQueryRequest|AppQueryRequest|body|true|AppQueryRequest|AppQueryRequest|
|&emsp;&emsp;pageNum|当前页码，从 1 开始||false|integer(int32)||
|&emsp;&emsp;pageSize|每页大小||false|integer(int32)||
|&emsp;&emsp;sortField|排序字段名||false|string||
|&emsp;&emsp;sortOrder|排序方向,可用值:ascend,descend||false|string||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;appName|||false|string||
|&emsp;&emsp;cover|||false|string||
|&emsp;&emsp;initPrompt|||false|string||
|&emsp;&emsp;codeGenType|||false|string||
|&emsp;&emsp;deployKey|||false|string||
|&emsp;&emsp;priority|||false|integer(int32)||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponsePageAppVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||PageAppVO|PageAppVO|
|&emsp;&emsp;records||array|AppVO|
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;appName||string||
|&emsp;&emsp;&emsp;&emsp;cover||string||
|&emsp;&emsp;&emsp;&emsp;initPrompt||string||
|&emsp;&emsp;&emsp;&emsp;codeGenType||string||
|&emsp;&emsp;&emsp;&emsp;deployKey||string||
|&emsp;&emsp;&emsp;&emsp;deployedTime||string||
|&emsp;&emsp;&emsp;&emsp;priority||integer||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;updateTime||string||
|&emsp;&emsp;&emsp;&emsp;user|用户脱敏信息|UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|用户 ID|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAccount|用户账号|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName|用户昵称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar|用户头像 URL|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile|用户简介|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole|用户角色,可用值:user,admin|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;pageNumber||integer(int64)||
|&emsp;&emsp;pageSize||integer(int64)||
|&emsp;&emsp;totalPage||integer(int64)||
|&emsp;&emsp;totalRow||integer(int64)||
|&emsp;&emsp;optimizeCountQuery||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"records": [
			{
				"id": 0,
				"appName": "",
				"cover": "",
				"initPrompt": "",
				"codeGenType": "",
				"deployKey": "",
				"deployedTime": "",
				"priority": 0,
				"userId": 0,
				"createTime": "",
				"updateTime": "",
				"user": {
					"id": 123456789,
					"userAccount": "zhangsan",
					"userName": "张三",
					"userAvatar": "https://example.com/avatar.png",
					"userProfile": "这是我的简介",
					"userRole": "user",
					"createTime": ""
				}
			}
		],
		"pageNumber": 0,
		"pageSize": 0,
		"totalPage": 0,
		"totalRow": 0,
		"optimizeCountQuery": true
	},
	"message": ""
}
```


## deployApp


**接口地址**:`/api/app/deploy`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "appId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|appDeployRequest|AppDeployRequest|body|true|AppDeployRequest|AppDeployRequest|
|&emsp;&emsp;appId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||string||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": "",
	"message": ""
}
```


## deleteApp


**接口地址**:`/api/app/delete`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 123456789
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|deleteRequest|删除请求|body|true|DeleteRequest|DeleteRequest|
|&emsp;&emsp;id|要删除的记录 ID||true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseBoolean|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## updateAppByAdmin


**接口地址**:`/api/app/admin/update`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 0,
  "appName": "",
  "cover": "",
  "priority": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|appAdminUpdateRequest|AppAdminUpdateRequest|body|true|AppAdminUpdateRequest|AppAdminUpdateRequest|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;appName|||false|string||
|&emsp;&emsp;cover|||false|string||
|&emsp;&emsp;priority|||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseBoolean|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## listAppVOByPageByAdmin


**接口地址**:`/api/app/admin/list/page/vo`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "pageNum": 1,
  "pageSize": 10,
  "sortField": "createTime",
  "sortOrder": "descend",
  "id": 0,
  "appName": "",
  "cover": "",
  "initPrompt": "",
  "codeGenType": "",
  "deployKey": "",
  "priority": 0,
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|appQueryRequest|AppQueryRequest|body|true|AppQueryRequest|AppQueryRequest|
|&emsp;&emsp;pageNum|当前页码，从 1 开始||false|integer(int32)||
|&emsp;&emsp;pageSize|每页大小||false|integer(int32)||
|&emsp;&emsp;sortField|排序字段名||false|string||
|&emsp;&emsp;sortOrder|排序方向,可用值:ascend,descend||false|string||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;appName|||false|string||
|&emsp;&emsp;cover|||false|string||
|&emsp;&emsp;initPrompt|||false|string||
|&emsp;&emsp;codeGenType|||false|string||
|&emsp;&emsp;deployKey|||false|string||
|&emsp;&emsp;priority|||false|integer(int32)||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponsePageAppVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||PageAppVO|PageAppVO|
|&emsp;&emsp;records||array|AppVO|
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;appName||string||
|&emsp;&emsp;&emsp;&emsp;cover||string||
|&emsp;&emsp;&emsp;&emsp;initPrompt||string||
|&emsp;&emsp;&emsp;&emsp;codeGenType||string||
|&emsp;&emsp;&emsp;&emsp;deployKey||string||
|&emsp;&emsp;&emsp;&emsp;deployedTime||string||
|&emsp;&emsp;&emsp;&emsp;priority||integer||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;updateTime||string||
|&emsp;&emsp;&emsp;&emsp;user|用户脱敏信息|UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|用户 ID|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAccount|用户账号|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName|用户昵称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar|用户头像 URL|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile|用户简介|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole|用户角色,可用值:user,admin|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;pageNumber||integer(int64)||
|&emsp;&emsp;pageSize||integer(int64)||
|&emsp;&emsp;totalPage||integer(int64)||
|&emsp;&emsp;totalRow||integer(int64)||
|&emsp;&emsp;optimizeCountQuery||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"records": [
			{
				"id": 0,
				"appName": "",
				"cover": "",
				"initPrompt": "",
				"codeGenType": "",
				"deployKey": "",
				"deployedTime": "",
				"priority": 0,
				"userId": 0,
				"createTime": "",
				"updateTime": "",
				"user": {
					"id": 123456789,
					"userAccount": "zhangsan",
					"userName": "张三",
					"userAvatar": "https://example.com/avatar.png",
					"userProfile": "这是我的简介",
					"userRole": "user",
					"createTime": ""
				}
			}
		],
		"pageNumber": 0,
		"pageSize": 0,
		"totalPage": 0,
		"totalRow": 0,
		"optimizeCountQuery": true
	},
	"message": ""
}
```


## deleteAppByAdmin


**接口地址**:`/api/app/admin/delete`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 123456789
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|deleteRequest|删除请求|body|true|DeleteRequest|DeleteRequest|
|&emsp;&emsp;id|要删除的记录 ID||true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseBoolean|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## addApp


**接口地址**:`/api/app/add`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "initPrompt": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|appAddRequest|AppAddRequest|body|true|AppAddRequest|AppAddRequest|
|&emsp;&emsp;initPrompt|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseLong|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||integer(int64)|integer(int64)|
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"message": ""
}
```


## getAppVOById


**接口地址**:`/api/app/get/vo`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseAppVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||AppVO|AppVO|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;appName||string||
|&emsp;&emsp;cover||string||
|&emsp;&emsp;initPrompt||string||
|&emsp;&emsp;codeGenType||string||
|&emsp;&emsp;deployKey||string||
|&emsp;&emsp;deployedTime||string(date-time)||
|&emsp;&emsp;priority||integer(int32)||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;user|用户脱敏信息|UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;id|用户 ID|integer||
|&emsp;&emsp;&emsp;&emsp;userAccount|用户账号|string||
|&emsp;&emsp;&emsp;&emsp;userName|用户昵称|string||
|&emsp;&emsp;&emsp;&emsp;userAvatar|用户头像 URL|string||
|&emsp;&emsp;&emsp;&emsp;userProfile|用户简介|string||
|&emsp;&emsp;&emsp;&emsp;userRole|用户角色,可用值:user,admin|string||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"id": 0,
		"appName": "",
		"cover": "",
		"initPrompt": "",
		"codeGenType": "",
		"deployKey": "",
		"deployedTime": "",
		"priority": 0,
		"userId": 0,
		"createTime": "",
		"updateTime": "",
		"user": {
			"id": 123456789,
			"userAccount": "zhangsan",
			"userName": "张三",
			"userAvatar": "https://example.com/avatar.png",
			"userProfile": "这是我的简介",
			"userRole": "user",
			"createTime": ""
		}
	},
	"message": ""
}
```


## chatToGenCode


**接口地址**:`/api/app/chat/gen/code`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`text/event-stream`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|appId||query|true|integer(int64)||
|message||query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ServerSentEventString|


**响应参数**:


暂无


**响应示例**:
```javascript
[
	null
]
```


## getAppVOByIdByAdmin


**接口地址**:`/api/app/admin/get/vo`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseAppVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||AppVO|AppVO|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;appName||string||
|&emsp;&emsp;cover||string||
|&emsp;&emsp;initPrompt||string||
|&emsp;&emsp;codeGenType||string||
|&emsp;&emsp;deployKey||string||
|&emsp;&emsp;deployedTime||string(date-time)||
|&emsp;&emsp;priority||integer(int32)||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;user|用户脱敏信息|UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;id|用户 ID|integer||
|&emsp;&emsp;&emsp;&emsp;userAccount|用户账号|string||
|&emsp;&emsp;&emsp;&emsp;userName|用户昵称|string||
|&emsp;&emsp;&emsp;&emsp;userAvatar|用户头像 URL|string||
|&emsp;&emsp;&emsp;&emsp;userProfile|用户简介|string||
|&emsp;&emsp;&emsp;&emsp;userRole|用户角色,可用值:user,admin|string||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"id": 0,
		"appName": "",
		"cover": "",
		"initPrompt": "",
		"codeGenType": "",
		"deployKey": "",
		"deployedTime": "",
		"priority": 0,
		"userId": 0,
		"createTime": "",
		"updateTime": "",
		"user": {
			"id": 123456789,
			"userAccount": "zhangsan",
			"userName": "张三",
			"userAvatar": "https://example.com/avatar.png",
			"userProfile": "这是我的简介",
			"userRole": "user",
			"createTime": ""
		}
	},
	"message": ""
}
```


# static-resource-controller


## serveStaticResource


**接口地址**:`/api/static/{deployKey}/**`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|deployKey||path|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


# health-controller


## healthCheck


**接口地址**:`/api/health/`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||string||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": "",
	"message": ""
}
```