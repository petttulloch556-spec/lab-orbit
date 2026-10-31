# 002 第一阶段：「实验数据」与「仪器」两个新版块（演示版）

## 目标

给 Zeng Group 网站加两个新版块，先做**前端 + 演示数据**（演示模式下用 localStorage 的模拟接口），发布到 GitHub Pages 给组里试用。
**本阶段不写真实后端**（FastAPI / Cloudflare 都不动），但前端调用的接口路径和数据结构要按下文「接口约定」写，第二阶段后端照此实现。

背景：课题组希望把每天的实验数据和实验记录留在网站上，组内可公开讨论、可与 AI 分析，多年后毕业生的数据和分析仍能被师弟师妹查到；仪器操作说明也沉淀在网站上，防止实验室传承断代。

## 用户已确认的规则（必须遵守）

1. **仪器单独成一个版块**「仪器」，不放在「实验数据」里面。
2. **实验记录默认仅自己可见**，作者手动点「公开给组内」后组内成员可见；可以再改回私有。**管理员（导师）始终能看到所有记录**（只读，不能改别人的记录）。
3. **记录格式按传统实验记录本**：标题、实验日期、样品、所用仪器、标签 + 一段自由书写的正文（Markdown + LaTeX 公式 + 图片），不强制分栏模板。
4. **AI 对话只在用户手动点「保存到记录」时保存**；不点就不保存（离开页面即消失）。保存的对话对能看到这条记录的人可见。
5. **上传者可以删除自己的记录**（二次确认）。别人（包括管理员）不能删。
6. 所有内容必须登录后才能看（沿用现有的 `requiresAuth`）。

## 范围

### A. 路由与导航

- 新路由（`meta: { requiresAuth: true }`，懒加载）：
  - `/experiments` 实验数据列表，`/experiments/:id` 记录详情
  - `/instruments` 仪器列表，`/instruments/:id` 仪器详情
- 桌面侧边栏 `components/Navbar.vue`：在「资料库」后面加「实验数据」「仪器」两项。
- 手机底栏 `components/MobileNavBar.vue`：加「实验数据」一项（放在「资料库」前面）。「仪器」在手机上从实验数据页顶部的入口进入，不占底栏。
- 图标按 `design.md` 第七部分规范新增或复用 `AppIcon`。
- 同步更新 `components/SidebarCustomIcons.test.js` 里对导航项的断言（改断言，不删测试）。

### B. 实验数据列表 `/experiments`

- 顶部分段切换：**我的记录 / 组内公开**（管理员额外有 **全部**）。
- 筛选：关键词（匹配标题、样品、标签、正文）、仪器、作者、年份；按实验日期倒序。
- 卡片显示：标题、日期、作者、样品、仪器标签、附件数、讨论数、可见性徽标（私有 / 组内公开）。
- 「新建记录」按钮 → 编辑弹窗（遵守 vibe-coding skill「弹窗防误关黄金规则」）：标题、实验日期（默认今天）、样品、仪器（多选，来自仪器列表）、标签、正文（Markdown 编辑 + 预览）、附件（多选上传）、可见性（默认私有）。

### C. 记录详情 `/experiments/:id`

- 头部：标题、日期、作者、样品、仪器（可点进仪器详情）、标签、可见性。作者可：编辑、切换「公开给组内 / 设为私有」、删除（二次确认后回到列表）。
- 正文渲染：复用现有 Markdown + KaTeX 渲染工具（`utils/markdown.js`、`LatexText.vue`）。
- **附件区**：列出文件名、大小、类型、上传人；图片显示缩略图；文本类（.csv .dat .txt .tsv）可点「预览」看前 200 行。
- **讨论区**（记录公开后才出现；私有时显示提示“公开后组内成员才能讨论”）：
  - 一条记录下可以开多个**讨论话题**（标题 + 首帖）。每个话题是一串帖子，帖子支持 Markdown/公式和附件。
  - 能看到记录的人都能开话题、回帖；帖子作者可删除自己的帖子。话题和帖子永久保留。
- **AI 分析面板**（侧栏或可展开面板）：
  - 用户配置的 AI（`services/aiService.js` 的 `loadAiConfig` / `isAiAssistantReady` / `sendChatMessageStream`）。未配置时显示提示和去 `/assistant` 配置的入口。
  - 发送前把上下文拼给 AI：记录的标题、日期、样品、仪器、标签、正文，以及文本类附件的前 200 行（总长度截到约 20000 字符，超出处注明“已截断”）。二进制文件只给文件名。
  - **第一次发送前弹出提示**：“将把这条记录的内容发送到你配置的 AI 服务商，未发表数据请谨慎；可在设置中改用本地 Ollama 模型。”并可勾选“不再提示”。
  - 对话默认不保存。面板上有「保存到记录」按钮：输入标题后，把这段对话（消息列表、保存人、保存时间、模型名）存到记录里。
  - 详情页有「已保存的 AI 分析」列表，可展开查看；保存人可删除自己保存的对话。
- 系统提示词沿用领域设定（凝聚态物理与材料器件），增加一句：“你在协助分析课题组的实验记录与数据，请结合数据给出物理解释、可能的问题和下一步建议，指出不确定之处。”

### D. 仪器列表 `/instruments` 与详情 `/instruments/:id`

- 列表卡片：名称、型号/厂商、位置、负责人、状态（正常 / 维护中 / 故障）。所有成员可新建仪器。
- 详情页分区（每区是可编辑的 Markdown，像 wiki，显示“最后编辑：某人 · 时间”）：**操作说明**、**注意事项**、**常见问题与踩坑**。
- **维护与维修日志**：按时间倒序的条目（日期、记录人、内容、附件），所有成员可追加，作者可删除自己的条目。
- **手册与文件**：上传 PDF/Word/图片等说明书、SOP。
- **相关实验记录**：自动列出所用仪器包含本仪器、且当前用户有权看到的实验记录（链接到详情）。
- 仪器的编辑：所有成员可编辑文字分区；删除仪器只允许创建者或管理员。

### E. 接口约定（前端调用这些路径；本阶段由 `mock/demoAdapter.js` 实现，第二阶段后端照做）

```
GET    /api/experiments?scope=mine|group|all&q=&instrument_id=&author_id=&year=
POST   /api/experiments
GET    /api/experiments/:id
PUT    /api/experiments/:id                    # 仅作者
DELETE /api/experiments/:id                    # 仅作者
PUT    /api/experiments/:id/visibility         # body {visibility: 'private'|'group'}，仅作者
POST   /api/experiments/:id/attachments        # multipart，仅作者
DELETE /api/experiments/:id/attachments/:aid   # 仅作者
POST   /api/experiments/:id/ai-chats           # 保存一段 AI 对话
DELETE /api/experiments/:id/ai-chats/:cid      # 仅保存人
POST   /api/experiments/:id/threads            # 开话题（含首帖）
POST   /api/experiments/:id/threads/:tid/posts
DELETE /api/experiments/:id/threads/:tid/posts/:pid   # 仅帖子作者
GET    /api/instruments
POST   /api/instruments
GET    /api/instruments/:id                    # 含 related_experiments（按权限过滤）
PUT    /api/instruments/:id
DELETE /api/instruments/:id                    # 创建者或管理员
POST   /api/instruments/:id/logs
DELETE /api/instruments/:id/logs/:lid          # 仅作者
POST   /api/instruments/:id/files
```

- 权限判断写成**一个可单测的纯函数模块**（如 `utils/experimentAccess.js`）：`canView(record, user)`、`canEdit`、`canDelete`、`canDiscuss` 等，mock 适配器和页面都用它。第二阶段后端会照这套规则实现。
- 演示模式下的附件：文本类且 ≤ 200 KB 的文件把内容存进 localStorage（供预览和 AI 使用）；其他文件只存文件名、大小、类型，并在界面标注“演示版不保存文件内容”。单个文件上限 50 MB（超过直接拒绝并提示）。允许类型：pdf、png/jpg/webp/gif/tif、csv/tsv/txt/dat、xlsx/xls、docx/doc、pptx/ppt、opj/opju、zip。
- 在 `STORAGE_KEYS` 里新增 `EXPERIMENTS`、`INSTRUMENTS`，并把 `initDemoStorage` 的版本号加一，保证老访客也能拿到新的演示数据。

### F. 演示数据（写在 `mock/demoData.js`，新建 `DEMO_EXPERIMENTS`、`DEMO_INSTRUMENTS`）

内容要专业、像真实二维磁性/器件课题组（日期以 `DEMO_BASE_DATE_STR` 为基准用 `formatOffsetDate` 生成；“往年”的记录可写固定日期）：

- 仪器（5 台）：PPMS（Quantum Design DynaCool 9 T，含 VSM 选件）、磁控溅射系统、显微拉曼光谱仪、管式炉（CVT 生长用）、探针台与光电测试系统。至少 PPMS 的三个文字分区和 2 条维护日志写得充实（如：降温前检查样品杆、液氦/冷头状态、霍尔测量接线与反对称化、磁场扫描速率建议、常见“温度不稳定”排查）。
- 实验记录（6 条）：
  1. Daisy：CrSBr/Pt 异质结 2–300 K 反常霍尔与磁电阻（PPMS），**组内公开**，附一个 .dat 文本片段（几十行真实格式的 T、H、R_xx、R_xy 列），带 1 个讨论话题（2–3 条回帖，含 DOG001 和曾的意见）和 1 段已保存的 AI 分析。
  2. Daisy：同一器件的光照下磁光响应初测，**私有**。
  3. DOG002：Fe 掺杂 SnSe2 的 CVT 生长日志（管式炉，温区设置、输运剂、生长周期、出炉形貌），组内公开，附显微照片占位。
  4. DOG001：α-In2Se3 光电晶体管的光脉冲突触可塑性测试（探针台），组内公开。
  5. 曾：Pt 薄膜溅射速率与厚度标定（磁控溅射），组内公开。
  6. 一位**已毕业学长**的往年记录（作者名如“张远（2024届博士 · 已毕业）”，`author_id` 用一个不在成员列表里的 ID，界面要能正常显示），内容是 PPMS 低温霍尔测量的接触电阻问题排查经验，组内公开，带 1 个讨论话题。用来体现“毕业后数据仍可查”。
- 顺带把 `mock/demoAdapter.js` 里残留的邀请码 `ASTRO-2026` 改为 `ZENG-2026`。

## 不做的

- 不写 FastAPI / Cloudflare 后端，不改 `backend/`、`frontend/functions/`，不改现有 `/api/files` 的限制。
- 不做毕业生账号管理、记录模板、全文检索引擎、版本历史。
- 不改已有版块的功能和数据（组名、成员名、已有演示内容保持不变）。
- 不 `git commit`、不 `git push`（审查方负责提交）。

## 设计要求

- 动手前先读 `design.md` 和 `.agents/skills/vibe-coding-lab-orbit/SKILL.md`（尤其第三、五、八部分），严格使用 `frontend/src/index.css` 的设计变量和现有通用组件（`BaseDialog`、`FileField`、`UserAvatar`、`AttachmentLink`、`SlidingSegmented` 等），风格与现有页面一致。
- 手机和桌面都要可用（参照 design.md 的断点）。
- 所有界面文字用简体中文。

## 验收

1. 新增单元测试：权限纯函数（作者/他人/管理员 × 私有/公开 的各种组合）、mock 接口（新建、公开切换、删除、开话题、回帖、保存 AI 对话、仪器相关记录过滤）。
2. `npm --prefix frontend test` 全部通过（现有 698 个 + 新增）。若沙箱无法运行测试，在汇报里说明，审查方会补跑。
3. `npm --prefix frontend run build` 能通过（同上，跑不了就说明）。
4. 演示模式下：切换“曾 / Daisy”两个身份，私有记录、公开记录、管理员可见性表现符合上面的规则。

## 汇报

- 新增/修改了哪些文件，各做了什么。
- 权限规则最终怎么实现的（列出 `canView` 等函数的判断逻辑）。
- 测试和构建结果。
- 与本说明不一致或拿不准的地方。
