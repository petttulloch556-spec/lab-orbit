# 001 把演示内容从“天体物理”换成“二维材料 / 磁性材料 / 感存算器件”

## 背景

本仓库是 LabOrbit 的 fork，给深圳大学物理与光电工程学院曾老师课题组（Zeng Group）用。
上一次提交已把组名改为 `Zeng Group`、管理员演示身份改为“曾”、普通成员改为“Daisy”，并删除了水印。
现在所有演示内容、示例文字、占位提示和 AI 提示词仍然是天体物理/宇宙学题材，要整体换成本组的研究方向。

## 课题组研究方向（内容素材）

用下面这些方向写内容，术语要专业、准确，像真实凝聚态/器件课题组的日常：

1. **二维材料**：范德华材料机械剥离、CVD/CVT 生长，过渡金属硫族化合物（MoS2、WSe2、SnSe2、In2Se3），异质结与转角堆叠，拉曼/PL/AFM/TEM 表征，二维铁电（α-In2Se3、CuInP2S6）。
2. **磁性材料与自旋电子学**：二维磁体（CrSBr、CrI3、Fe3GeTe2、CrCl3、CoCl2 及掺杂体系、Fe 掺杂 SnSe/SnSe2），反常霍尔效应（AHE）、自旋霍尔磁电阻（SMR）、磁近邻效应（如 X/Pt 异质结），磁光克尔、VSM/SQUID、PPMS 低温强磁场输运，居里温度调控。
3. **感存算一体器件**：光电探测器、磁光响应（magneto-photoresponse）、铁电光晶体管、忆阻器/神经形态器件、存内计算、视觉传感器内计算（in-sensor computing）、突触可塑性模拟、光电逻辑。

常用设备/场景可用：PPMS、VSM、磁控溅射、电子束曝光（EBL）、手套箱、干法转移平台、探针台、拉曼光谱仪、洁净间、低温恒温器。地点可用“物理楼”“洁净间”“微纳加工平台”“腾讯会议”等，不要再出现“天文楼”。

## 要改的范围

### A. 演示数据（主体）

- `frontend/src/mock/demoData.js`：成员简介 `bio`、组会/报告题目与摘要、论文推荐（标题、作者、摘要、分类）、学术会议、资源库条目（教材、软件、数据库）、通知、邮件样例、评论、收藏夹名称等，凡是天体物理/宇宙学/天文观测内容全部换成上面三个方向。文件头注释“天文与物理交叉科学课题组”也改掉。
- `frontend/src/mock/demoAdapter.js`：其中的模拟论文（如 JWST 星系成团那篇）、`astro-ph.*` 分类、“暗物质晕数值模拟”收藏夹、“天文台报告”注释等，一并换掉。arXiv 分类改用 `cond-mat.mtrl-sci`、`cond-mat.mes-hall`、`cond-mat.str-el`、`physics.app-ph` 等。
- 成员分工建议：曾（导师）= 二维磁性与自旋电子学、感存算器件；Daisy（博士生）= 二维磁体/Pt 异质结反常霍尔与磁光响应；王思齐（博士后）= 二维铁电与感存算一体光电器件；赵子涵（硕士生）= CVT 晶体生长与掺杂磁性半导体表征。
- 资源库示例教材换成如 Kittel《固体物理导论》、Coey *Magnetism and Magnetic Materials*、Sze *Physics of Semiconductor Devices*、Datta *Electronic Transport in Mesoscopic Systems* 之类；软件/数据库换成 VASP、Materials Project、ICSD、Gwyddion、OriginLab、COMSOL 等。

### B. 页面上的示例、占位提示、默认兜底内容

- `frontend/src/views/HomeView.vue`：英文副标题兜底 `'Astrophysics and Interdisciplinary Science Research Group'` 改为 `'2D Materials, Magnetism & Sensing-Memory-Computing Devices'`（或同等含义）。
- `frontend/src/views/StyleView.vue`：字体预览里的英文副标题同上；数字示例行 `Redshift z = 2.45 · Lambda-CDM Cosmology` 换成本领域示例（如 `T_C = 342 K · H = 9 T · R_xy = 1.25 Ω`）。上传提示里的“天文/高位深科学图像”改为“显微/高位深科学图像”。
- `frontend/src/components/widgets/HomeWidgetRenderer.vue`：天气卡片默认文案（“深度巡天数据标定与天文观测”）、文献/资源/推荐卡片的兜底示例条目。
- `frontend/src/composables/useHomeGridEngine.js`：天气组件描述里的“天文视宁度观测适宜度”。
- `frontend/src/components/SmartPasteImportModal.vue`、`frontend/src/components/TalkManager.vue`、`frontend/src/views/MailboxView.vue`、`frontend/src/views/ResourceHubView.vue`：输入框 placeholder 里的会议名、地点、主办方、资源示例。
- `frontend/src/utils/schedule.js`：.ics 导出时的默认地点 `'天文楼'` 改为 `'物理楼'`。
- `frontend/src/views/AssistantView.vue`：快捷提示词（论文梳理、公式推导、代码示例）换成本领域，例如：梳理一篇二维磁性论文的创新点与表征链条；推导反常霍尔电阻率与磁化强度关系（含 skew scattering / side jump / intrinsic 三种机制的标度律）；用 Python 处理 PPMS 霍尔数据（反对称化、扣除正常霍尔、画 R_xy–H 回线）。底部免责声明里的“天文实际数据”改为“实验数据”。

### C. AI 提示词（`frontend/src/services/aiService.js`）

- 论文研读角色“资深天文与天体物理学者” → “资深凝聚态物理与材料器件学者”。
- 学术翻译提示词改为凝聚态/材料/器件方向，术语示例换成：anomalous Hall effect → 反常霍尔效应，spin Hall magnetoresistance → 自旋霍尔磁电阻，magnetic proximity effect → 磁近邻效应，van der Waals heterostructure → 范德华异质结，Curie temperature → 居里温度，memristor → 忆阻器，in-sensor computing → 感内计算，photoresponsivity → 光响应度。
- 会议信息抽取提示词中“天文课题组”“引力透镜与宇宙学前沿研讨会”换成本领域示例。

## 不要改的

- 功能代码和解析逻辑：`utils/latex.js` 的天文宏预处理、`utils/talkEmail.js` 的邮件解析正则、`ScheduleOverview.vue`/`HomeView.vue` 里剥离标题前缀的正则、`siteSearchService.js` 的注释——这些是通用功能，保留原样。
- 视觉主题：`useThemeStyle.js`、`ForecastAtmosphere.vue`、`libs/liquidglass` 里的 “galaxy/宇宙星空” 是背景动画主题名，不是研究内容，保留。
- 组名 `Zeng Group`、演示身份“曾”“Daisy”、已删除的水印，不要回退。
- 不要改数据结构、字段名、ID、日期偏移逻辑；只换文字内容。条目数量保持不变。
- 不要编造真实存在的人的言论；报告人、作者用虚构的中文/英文名字（组内成员除外）。论文是演示用的虚构论文，arXiv 号保持原有格式即可。
- 不要 `git push`，不要改 `design.md`。

## 验收

1. `npm --prefix frontend test` 全部通过。若有测试断言了旧的天文文字，把断言同步改成新文字（不要删测试）。
2. 在 `frontend/src` 中（排除上面“不要改的”文件和 `*.test.js`）执行：
   `grep -rnE "天体|宇宙学|引力透镜|星系|巡天|黑洞|天文|暗物质|脉冲星|多信使|射电|lensing|cosmolog|JWST|astro-ph|Astrophysics|Dodelson|Bartelmann" frontend/src --include=*.js --include=*.vue`
   结果中只允许出现“不要改的”那几个文件。
3. 内容读起来像一个真实的二维磁性/器件课题组：组会题目、论文、会议、资源彼此一致，时间线合理。

## 汇报

- 改了哪些文件，每个文件大致改了什么。
- 第 2 条 grep 的最终输出。
- 测试结果（通过数量）。
- 你保留未改、但拿不准的地方。
