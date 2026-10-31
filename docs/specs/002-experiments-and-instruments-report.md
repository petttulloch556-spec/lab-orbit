# 002 实现交接

本阶段仅实现前端和 localStorage 演示接口。未修改 backend/、frontend/functions/ 或原 /api/files；未执行 commit、push 或对外发布。

## 文件与功能

- `frontend/src/views/ExperimentsView.vue`、`ExperimentDetailView.vue`：我的 / 组内 / 管理员全部范围，组合筛选，日期倒序，记录详情、可见性、附件、话题、回复和已保存 AI 分析。
- `frontend/src/views/InstrumentsView.vue`、`InstrumentDetailView.vue`：仪器列表与基础信息，三个 Markdown wiki 分区及编辑人 / 时间，维护日志及附件、手册、按访问权限过滤的相关记录。
- `frontend/src/components/ExperimentEditor.vue`、`InstrumentEditor.vue`：基于 BaseDialog 的编辑表单，提交期间禁止关闭，记录默认私有。记录正文保存后若附件失败，会保留已创建 ID 并允许重试，不重复新建记录。
- `frontend/src/components/ExperimentAiPanel.vue`：复用现有 AI 配置、就绪判断与流式服务；首次发送提示与“不再提示”；上下文拼接；仅手动保存对话；离开记录中止请求并丢弃未保存对话。
- `frontend/src/components/NotebookMarkdown.vue`、`NotebookFilePicker.vue`、`NotebookAttachments.vue`：复用 Markdown / KaTeX，预览编辑、多附件选择、文本前 200 行预览和下载、图片会话缩略图及刷新后占位。
- `frontend/src/utils/experimentAccess.js`、`experimentFiles.js`：共用权限纯函数、附件限制、AI 上下文。`frontend/src/mock/experimentAdapter.js` 由原 `demoAdapter.js` 分发全部约定接口；客户端通过 `api/client.js` 调用。
- `frontend/src/mock/demoData.js`：5 台仪器、6 条记录；含私有记录、已毕业作者、专业 PPMS 文档与两条维护日志、讨论和已保存分析。所有数据均为演示虚构。
- `frontend/src/mock/demoAdapter.js`：新增存储键，版本 4.5 → 4.6；从 4.5 升级只追加新模块，保留已有模块的存储。邀请码改为 ZENG-2026。
- `frontend/src/router/index.js`、`components/Navbar.vue`、`MobileNavBar.vue`、`MobileHeader.vue`：四条懒加载鉴权路由与桌面 / 手机入口。
- `frontend/src/views/notebook.css`、根目录 `design.md`：共用设计变量、响应式卡片与筛选、长文本折行规则。
- `frontend/src/utils/experimentAccess.test.js`、`experimentFiles.test.js`、`mock/experimentAdapter.test.js`：新增 28 个单元测试；`SidebarCustomIcons.test.js` 保留并扩充原导航断言。
- `frontend/scripts/check-experiments.mjs`：不启动子进程的替代编译及直接接口检查。运行：`node frontend/scripts/check-experiments.mjs`。

## 权限判断

页面与演示接口共用 `experimentAccess.js`；接口每次请求重新读取当前演示身份并检查权限，不依赖按钮隐藏。

| 函数 | 判断 |
| --- | --- |
| `canView(record, user)` | 必须登录；作者、管理员或组内公开记录可读 |
| `canEdit` / `canDelete` | 必须是记录作者；管理员没有代改、代删权限 |
| `canDiscuss` | 有权查看且记录已组内公开；私有记录不能新建话题或回复 |
| `canDeletePost` | 仅帖子作者；接口先检查记录读取权限 |
| `canDeleteChat` | 仅保存人；接口先检查记录读取权限 |
| `canEditInstrument` | 全体登录成员 |
| `canDeleteInstrument` | 创建者或管理员 |

AI 保存允许有权查看记录的成员操作，保存人、作者、编辑人均取当前身份，请求体不能伪造。维护日志仅其作者可删除。私有 / 公开切换保留历史话题和已保存分析。仪器详情只返回当前身份可读的相关实验。

## 第二阶段数据约定

- 实验：`id, author_id, author_name, created_at, title, date (YYYY-MM-DD), sample, instrument_ids[], tags[], content, visibility (private|group), attachments[], threads[], ai_chats[]`。
- 话题：`id, title, author_id, author_name, created_at, posts[]`；帖子：`id, content, author_id, author_name, created_at, attachments[]`。
- AI 分析：`id, title, messages[{role,content}], model, saved_by, saved_by_name, saved_at`。
- 仪器：`id, name, model, manufacturer, location, manager, status (正常|维护中|故障), created_by, sections, logs[], files[]`。`sections.operation/precautions/faq` 各为 `{content, edited_by, edited_at}`；PUT 中 sections 各值为 Markdown 字符串。
- 仪器日志：`id, date, content, author_id, author_name, created_at, attachments[]`。仪器 GET 详情额外返回 `related_experiments[]`。
- 附件：`id, name, size (字节), type (MIME), author_id, author_name, created_at`；仅不超过 200 KB 的 `.csv/.tsv/.txt/.dat` 有 `content`。单文件不超过 50 MB。记录附件、仪器文件通过 multipart 的 `files` 多值字段上传；带附件的帖子 / 日志通过 `payload` JSON 字符串字段加 `files` 上传。
- 记录列表和仪器列表返回数组；创建 / 更新返回条目；子资源操作返回更新后的记录或仪器；删除记录 / 仪器返回 `{success:true}`。错误通过 HTTP 状态与 `{detail}` 返回。

## 验证结果与限制

- `npm.cmd --prefix frontend test`：Vitest 加载 Vite 配置时因 esbuild `spawn EPERM` 失败，未执行测试用例。
- `npm.cmd --prefix frontend run build`：同样因 esbuild `spawn EPERM` 失败。额外尝试绕过配置打包后，仍在 Vite define 转换阶段被同一限制阻断。
- 设置 `GITHUB_PAGES=true`、`VITE_DEMO_MODE=true` 后执行同一构建：同样在配置加载阶段报 `spawn EPERM`。
- PowerShell 的 `npm` 别名受到脚本执行策略限制，因此使用同一 npm 的 `npm.cmd`，未修改执行策略。
- 替代检查：24 个 Vue / JS 文件完成 SFC 脚本、模板、样式编译或 JS 解析，共用 CSS 解析成功；70 项直接权限 / API / 附件检查通过，含曾 / Daisy / 其他成员可见性、CRUD、讨论、AI 保存、仪器关联过滤和升级保留数据。
- 未完成真实浏览器的桌面 / 手机视觉验收，未向真实 AI 服务发送实验数据。AI 配置和流式调用复用现有服务，需审查方在配置好的环境中验证。
- 审查方需补跑标准测试、标准构建和 Pages Demo 构建，并在桌面 / 手机检查交互。

## 说明差异

- 原 FileField 固定走 15 MB 上传接口，与本任务的多文件、50 MB、纯演示规则不同；使用专用选择器，未改变已有附件功能。AttachmentLink 不支持无内容的演示元数据及本地文本，故由专用附件组件展示，不生成虚假的远程下载链接。
- 图片二进制不写入 localStorage：新上传图片在当前会话有缩略图，刷新后及种子图片显示占位，并明确标注“演示版不保存文件内容”。Markdown 正文仍支持图片链接。
- `design.md` 当前第七部分是收藏与反馈；图标复用现有 AppIcon，遵循项目 Skill 第七部分，不新增另一套图标。
- 未发布 GitHub Pages，遵循本轮只改文件、由审查方提交的指示。
