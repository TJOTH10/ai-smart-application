# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

鱼皮 AI 零代码应用生成平台前端——用户通过与 AI 对话创建网站应用、实时预览生成效果、部署应用到云端、管理个人应用。

## 技术栈
前端技术栈
| 类别 | 技术 | 版本 |
|------|------|------|
| 前端框架 | Vue 3 + TypeScript | vue ^3.5.17 / typescript ~5.8.0 |
| UI 组件库 | Ant Design Vue | ^4.2.6 |
| 路由 | Vue Router | ^4.5.1 |
| 状态管理 | Pinia | ^3.0.3 |
| 构建工具 | Vite | ^7.0.0 |
| HTTP 客户端 | Axios | ^1.11.0 |
| Markdown 渲染 | markdown-it + highlight.js | ^14.1.0 / ^11.11.1 |
| 时间处理 | Day.js | — |
| 代码检查 | ESLint | ^9.29.0 |
| 代码格式化 | Prettier | 3.5.3 |
| API 代码生成 | @umijs/openapi | ^1.13.15 |

后端技术栈
- **后端**: Spring Boot 3.5.4 + Java 21 + Maven + MyBatis-Flex 1.11.0 + MySQL
- **API 文档**: Knife4j 4.4.0（Swagger UI 增强），开发时访问 `http://localhost:8123/api/doc.html`

## 常用命令

```sh
npm install          # 安装依赖
npm run dev          # 启动开发服务器（Vite dev server）
npm run build        # 类型检查 + 构建
npm run build-only   # 仅构建，跳过类型检查
npm run type-check   # 仅类型检查（vue-tsc）
npm run lint         # ESLint 检查并自动修复
npm run format       # Prettier 格式化 src/ 目录
npm run openapi2ts   # 从后端 OpenAPI 文档生成前端 API 代码和 TS 类型
```

## 项目结构

```
src/
├── api/                     # API 层——由 openapi2ts 从后端 Swagger 自动生成
│   ├── typings.d.ts         #   请求/响应类型（API 命名空间）
│   ├── index.ts             #   按模块聚合导出
│   └── *Controller.ts       #   每个后端 Controller 对应一个文件
├── config/
│   └── env.ts               # 环境变量封装（VITE_* 前缀变量）
├── request.ts               # Axios 实例：baseURL、withCredentials、401 拦截跳转登录
├── router/
│   └── index.ts             # Vue Router：history 模式，路由定义
├── access.ts                # 路由守卫（beforeEach）：首次获取用户、/admin 校验角色
├── stores/
│   └── loginUser.ts         # 登录用户 Pinia store
├── components/              # 可复用组件（GlobalHeader、GlobalFooter、AppCard、MarkdownRenderer 等）
├── layouts/
│   └── BasicLayout.vue      # 基础布局（header + router-view + footer）
├── pages/
│   ├── HomePage.vue         # 主页：创建应用 + 我的应用 + 精选应用列表
│   ├── app/                 # 应用对话页 + 应用编辑页
│   ├── admin/               # 管理后台：用户管理、应用管理、对话管理
│   └── user/                # 登录/注册
├── utils/
│   ├── codeGenTypes.ts      # 代码生成类型枚举（HTML / multi_file / vue_project）
│   ├── time.ts              # dayjs 时间格式化
│   └── visualEditor.ts      # iframe 可视化编辑器：向生成的网页注入编辑脚本
└── main.ts                  # 应用入口
```

## 编码规范

- 使用 Vue 3 `<script setup lang="ts">` Composition API
- 路径别名 `@` 映射 `src/`（vite.config.ts + tsconfig.app.json）
- API 接口返回统一格式：`{ code: number, data: T, message: string }`，`code === 0` 成功，`code === 40100` 未登录
- `src/api/` 目录下的文件由 `openapi2ts` 自动生成，不要手动修改
- Prettier：无分号、单引号、100 字符宽度
- ESLint：`@vue/eslint-config-typescript` + `plugin:vue/essential`

### Ant Design Vue 4.x 用法

版本 `^4.2.6`，使用 Vue 3 Composition API 风格。

**全局注册**（推荐，避免每个组件重复 import）：

```ts
// main.ts
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'  // 4.x 使用 reset.css

app.use(Antd)
```

全局注册后，模板中可直接使用 `<a-button>`、`<a-table>` 等组件，无需手动导入。

**按需导入**（tree-shaking，适合大项目）：

```ts
import { Button, Table, Form } from 'ant-design-vue'
// 在组件中 components: { ... } 或直接在 <script setup> 中使用
```

**常用组件模式**：

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message, notification } from 'ant-design-vue'
import type { FormInstance, TableColumnsType } from 'ant-design-vue'

// 表格
const columns: TableColumnsType = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '名称', dataIndex: 'name', key: 'name' },
]

// 表单
const formRef = ref<FormInstance>()
const formState = reactive({ name: '', email: '' })

// 消息提示（命令式调用）
const handleSubmit = async () => {
  try {
    await submitData()
    message.success('提交成功')
  } catch {
    message.error('提交失败')
  }
}
</script>
```

**常用命令式 API**（无需注册组件，直接 import 调用）：

- `message.success/error/warning/info()` — 全局消息提示
- `notification.open/success/error()` — 通知提醒框
- `Modal.confirm()` — 确认对话框
- `Modal.info/success/error/warning()` — 模态框

**与 Element Plus 的区别**：

| 场景 | Ant Design Vue | Element Plus |
|------|---------------|--------------|
| 组件前缀 | `a-`（如 `a-button`） | `el-`（如 `el-button`） |
| 图标 | `@ant-design/icons-vue` | `@element-plus/icons-vue` |
| 表单验证 | `rules` prop + `validate()` | 同模式，API 略有差异 |
| 表格 | `columns` + `data-source` | `columns` + `data`，属性名不同 |

**注意事项**：

- 4.x 版本 CSS 入口为 `ant-design-vue/dist/reset.css`（3.x 是 `antd.css`）
- `DatePicker`、`Select` 等使用 `dayjs` 驱动，已内置无需额外安装
- 表格 `rowKey` 必须唯一标识，通常用 `id`
- 表单 `a-form-model` 已废弃，4.x 统一用 `a-form`

## 关键设计

### 认证流程
- Cookie-based（`withCredentials: true`），不手动管理 token
- `access.ts` 路由守卫在首次加载时调用 `fetchLoginUser()` 获取用户信息
- `request.ts` 响应拦截器检测 `40100` 自动跳转登录页
- `/admin` 路由仅 `userRole === 'admin'` 可访问

### AI 对话
- 通过 SSE（Server-Sent Events）流式推送 AI 生成内容
- 前端用 `MarkdownRenderer.vue`（markdown-it）实时渲染 markdown

### 代码生成三种模式
- HTML 模式：单文件页面
- 多文件模式：原生多文件项目
- Vue 项目模式：静态资源路径自动追加 `dist/index.html`

### 开发代理
Vite dev server 将 `/api` 代理到 `http://localhost:8123`（后端服务）。

## 当前开发状态

- 教程第 14 期——微服务改造完成，大仓包含完整单体项目代码
- 上一版本（HEAD~1）为 Dubbo + Nacos 跨服务调用的中间态提交，会影响单体项目，不要单独使用

## 注意事项

- `.env.development` 和 `.env.production` 中的配置区分环境，不要提交包含敏感信息的环境变量到 Git
- `src/api/` 下的代码是自动生成的，需要修改接口时先改后端，再运行 `openapi2ts`

## 可用 Skills

Skills 位于 `.claude/skills/` 目录，每个 skill 有独立的 `SKILL.md` 文件。

- **brainstorming**: 在任何创造性工作之前必须使用此技能——创建功能、构建组件、添加功能或修改行为。在实现之前先探索用户意图、需求和设计。
- **chinese-code-review**: 中文 review 沟通参考——话术模板、分级标注（必须修复/建议修改/仅供参考）、国内团队常见反模式应对。仅在用户显式 /chinese-code-review 时调用，不要根据上下文自动触发。
- **chinese-commit-conventions**: 中文 commit 与 changelog 配置参考——Conventional Commits 中文适配、commitlint/husky/commitizen 中文模板、conventional-changelog 中文配置。仅在用户显式 /chinese-commit-conventions 时调用，不要根据上下文自动触发。
- **chinese-documentation**: 中文文档排版参考——中英文空格、全半角标点、术语保留、链接格式、中文文案排版指北约定。仅在用户显式 /chinese-documentation 时调用，不要根据上下文自动触发。
- **chinese-git-workflow**: 国内 Git 平台配置参考——Gitee、Coding.net、极狐 GitLab、CNB 的 SSH/HTTPS/凭据/CI 接入差异与镜像同步配置。仅在用户显式 /chinese-git-workflow 时调用，不要根据上下文自动触发。
- **dispatching-parallel-agents**: 当面对 2 个以上可以独立进行、无共享状态或顺序依赖的任务时使用
- **executing-plans**: 当你有一份书面实现计划需要在单独的会话中执行，并设有审查检查点时使用
- **finishing-a-development-branch**: 当实现完成、所有测试通过、需要决定如何集成工作时使用——通过提供合并、PR 或清理等结构化选项来引导开发工作的收尾
- **mcp-builder**: MCP 服务器构建方法论 — 系统化构建生产级 MCP 工具，让 AI 助手连接外部能力
- **receiving-code-review**: 收到代码审查反馈后、实施建议之前使用，尤其当反馈不明确或技术上有疑问时——需要技术严谨性和验证，而非敷衍附和或盲目执行
- **requesting-code-review**: 完成任务、实现重要功能或合并前使用，用于验证工作成果是否符合要求
- **subagent-driven-development**: 当在当前会话中执行包含独立任务的实现计划时使用
- **systematic-debugging**: 遇到任何 bug、测试失败或异常行为时使用，在提出修复方案之前执行
- **test-driven-development**: 在实现任何功能或修复 bug 时使用，在编写实现代码之前
- **using-git-worktrees**: 当需要开始与当前工作区隔离的功能开发，或在执行实现计划之前使用——通过原生工具或 git worktree 回退机制确保隔离工作区存在
- **using-superpowers**: 在开始任何对话时使用——确立如何查找和使用技能，要求在任何响应（包括澄清性问题）之前调用 Skill 工具
- **verification-before-completion**: 在宣称工作完成、已修复或测试通过之前使用，在提交或创建 PR 之前——必须运行验证命令并确认输出后才能声称成功；始终用证据支撑断言
- **workflow-runner**: 在 Claude Code / OpenClaw / Cursor 中直接运行 agency-orchestrator YAML 工作流——无需 API key，使用当前会话的 LLM 作为执行引擎。当用户提供 .yaml 工作流文件或要求多角色协作完成任务时触发。
- **writing-plans**: 当你有规格说明或需求用于多步骤任务时使用，在动手写代码之前
- **writing-skills**: 当创建新技能、编辑现有技能或在部署前验证技能是否有效时使用

## 如何使用

当任务匹配某个 skill 时，使用 `Skill` 工具加载对应 skill 并严格遵循其流程。绝不要用 Read 工具读取 SKILL.md 文件。

如果你认为哪怕只有 1% 的可能性某个 skill 适用于你正在做的事情，你必须调用该 skill 检查。
<!-- superpowers-zh:end -->