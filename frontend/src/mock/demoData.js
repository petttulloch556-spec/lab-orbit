/**
 * LabOrbit 在线演示高拟真模拟数据集
 * 模拟一个正常活跃运行数月的二维材料、磁性与感存算器件课题组；论文、报告与交流场景均为虚构演示
 */

export const DEMO_MEMBERS = [
  {
    id: 1,
    name: '曾 (导师 / 管理员)',
    real_name: '曾',
    email: 'lihua@lab.edu',
    role: 'admin',
    identity: 'teacher',
    bio: '研究方向：二维磁性与自旋电子学、磁近邻效应及感存算一体器件。',
    can_manage_seminars: true,
    is_tutorial_completed: false,
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 2,
    name: 'Daisy (博士生 / 普通成员)',
    real_name: 'Daisy',
    email: 'chenchen@lab.edu',
    role: 'member',
    identity: 'student',
    bio: '三年级博士生，研究二维磁体/Pt 异质结的反常霍尔效应、自旋霍尔磁电阻与磁光响应。',
    can_manage_seminars: true,
    is_tutorial_completed: false,
    created_at: '2026-03-01T09:00:00Z'
  },
  {
    id: 3,
    name: 'DOG001 (博士后)',
    real_name: 'DOG001',
    email: 'dog001@lab.edu',
    role: 'member',
    identity: 'postdoc',
    bio: '研究二维铁电 α-In2Se3、CuInP2S6 与感存算一体光电器件，关注极化调控与突触可塑性。',
    can_manage_seminars: true,
    is_tutorial_completed: true,
    created_at: '2026-02-15T10:00:00Z'
  },
  {
    id: 4,
    name: 'DOG002 (硕士生)',
    real_name: 'DOG002',
    email: 'dog002@lab.edu',
    role: 'member',
    identity: 'student',
    bio: '研二在读，专注 CVT 晶体生长、Fe 掺杂 SnSe/SnSe2 及结构、磁性与低温输运表征。',
    can_manage_seminars: false,
    is_tutorial_completed: true,
    created_at: '2026-05-20T14:30:00Z'
  }
]

export const DEMO_SITE_CONFIG = {
  initialized: true,
  lab_name: 'Zeng Group',
  lab_short_name: 'LabOrbit',
  invite_code_enabled: true,
  public_feed_enabled: true,
  version: '2.5.0-demo'
}

// 在线演示/展示界面的时间基准冻结在 2026-09-10（仅用于展示界面，正式代码设计中不用冻结）
export const DEMO_BASE_DATE_STR = '2026-09-10'

function formatOffsetDate(daysOffset = 0) {
  const d = new Date(`${DEMO_BASE_DATE_STR}T12:00:00+08:00`)
  d.setDate(d.getDate() + daysOffset)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const wikiSection = content => ({ content, edited_by: '曾', edited_at: `${DEMO_BASE_DATE_STR}T08:00:00Z` })
export const DEMO_INSTRUMENTS = [
  { id: 1, name: 'PPMS 综合物性测量系统', model: 'DynaCool 9 T（含 VSM 选件）', manufacturer: 'Quantum Design', location: '低温物性实验室 105', manager: 'Daisy', status: '正常', created_by: 1,
    sections: {
      operation: wikiSection('### 上机与降温\n1. 检查样品杆、O 形圈和接插件，确认样品固定牢靠、导线绝缘，杆上无松散碎屑。\n2. 确认冷头、压缩机、冷却水及真空状态。DynaCool 为无液氦系统；其他液氦平台需单独核对液位，不照搬补液流程。\n3. 室温测量各电极电阻，记录接线图与激励电流；插杆后执行抽空与置换，再按设备 SOP 降温。\n4. 霍尔测量在正负场均采集数据，使用 $R_{xy}^{odd}(H)=[R_{xy}(H)-R_{xy}(-H)]/2$ 抑制纵向混入，保留原始数据。\n5. 先以 10–20 Oe/s 做低场试扫；正式速率按温度稳定性、样品响应和设备手册确定。VSM 测量应先检查样品居中与支架背景。'),
      precautions: wikiSection('### 安全与数据质量\n- 强磁场区域禁止铁磁工具、银行卡及不兼容的植入设备进入。\n- 拔杆前回零场、回到规定温度并按 SOP 放气；禁止强行拔插。\n- 避免用过大电流造成焦耳热，先做电流依赖性测试。低温接触电阻可能显著变化。\n- 每次记录样品、杆号、桥路、接线、温度稳定判据、磁场扫描方向和速率。反对称化不能替代接触与漏电排查。'),
      faq: wikiSection('### 温度不稳定怎么办？\n先检查冷却水流量、压缩机告警和腔体真空，再检查样品热锚与激励功率。减小电流，增加等待时间；比较设定温度、腔体读数与样品电阻漂移，稳定后再采点。\n\n### 霍尔曲线不对称或跳变\n核查电极定义和电流换向，测量零场接触电阻，检查粘接线与引线受力。对正反扫分别反对称化；不能把单次曲线偏移直接当成交换偏置。\n\n### VSM 背景过大\n使用同批支架空白、记录装样方向与质量；检查居中扫描，必要时联系负责人，不直接扣一条任意直线。') },
    logs: [
      { id: 2, date: formatOffsetDate(-2), author_id: 2, author_name: 'Daisy', content: '冷头运行噪声与压缩机压力正常，检查冷却水过滤器与流量；清洁样品杆密封面并更换老化 O 形圈。抽空后保压检查通过。用标准电阻做 300–10 K 温度循环，平台稳定后记录漂移；继续观察低温段。', attachments: [] },
      { id: 1, date: formatOffsetDate(-16), author_id: 1, author_name: '曾', content: '桥路 2 低温间歇跳变：定位到样品杆接插件接触不良。重新插接并对线束作应力释放，室温及 20 K 连续监测均未再跳变。原故障曲线保留作排查参考；下一次上机先测各电极接触电阻。', attachments: [] }
    ], files: [] },
  { id: 2, name: '磁控溅射系统', model: '多靶位直流 / 射频', manufacturer: '实验室定制', location: '薄膜制备室 108', manager: '曾', status: '正常', created_by: 1, sections: { operation: wikiSection('确认冷却水与本底真空，预溅射后再开挡板。记录 Ar 压强、功率、时间和靶基距；按 SOP 缓慢放气。'), precautions: wikiSection('高压与真空设备须培训后操作。靶材冷却异常时停止沉积。'), faq: wikiSection('速率漂移先检查靶面状态与压强；用独立厚度测量重新标定。') }, logs: [], files: [] },
  { id: 3, name: '显微拉曼光谱仪', model: '共焦 532 / 633 nm', manufacturer: 'Horiba', location: '光谱室 203', manager: 'DOG001', status: '维护中', created_by: 3, sections: { operation: wikiSection('硅峰校准后，从最低功率开始采谱，记录物镜、积分时间和光栅。'), precautions: wikiSection('二维材料易受激光加热损伤，比较功率依赖并记录焦点。'), faq: wikiSection('峰位变化先排除校准、温漂和加热，不唯一归因于掺杂位点。') }, logs: [], files: [] },
  { id: 4, name: '管式炉（CVT 生长）', model: '双温区石英管炉', manufacturer: '科晶', location: '晶体生长室 101', manager: 'DOG002', status: '正常', created_by: 4, sections: { operation: wikiSection('核对石英安瓿封管、称量与温区校准，按升温程序运行并自然冷却。'), precautions: wikiSection('密封管有爆裂风险，使用防护屏；含碘输运剂在通风柜称量。'), faq: wikiSection('成核过密时记录并比较温差、输运剂负载和源料形貌。') }, logs: [], files: [] },
  { id: 5, name: '探针台与光电测试系统', model: '屏蔽探针台 / 源表 / 脉冲光源', manufacturer: 'Keithley 等', location: '器件测试室 205', manager: 'DOG001', status: '正常', created_by: 3, sections: { operation: wikiSection('暗态稳定后接入光脉冲，记录波长、功率密度、脉宽、偏压与采样率。'), precautions: wikiSection('控制栅漏电，避免探针划伤器件；使用相应波段的激光防护。'), faq: wikiSection('基线漂移与光响应幅度分别评估，采用局部暗态基线提取净光电流。') }, logs: [], files: [] }
]

const demoDat = '# 虚构演示数据，非真实测量\nT_K\tH_T\tR_xx_ohm\tR_xy_ohm\n' + [2, 20, 100, 300].flatMap(t => Array.from({ length: 11 }, (_, i) => { const h = i - 5; return `${t}\t${h.toFixed(2)}\t${(1200 + t * 0.3 + h * h * 0.8).toFixed(3)}\t${(h * 0.12 + 0.4 * Math.tanh(h)).toFixed(5)}` })).join('\n')
const demoRecord = (id, author_id, author_name, title, offset, instrument_ids, content, extra = {}) => ({ id, author_id, author_name, title, date: formatOffsetDate(offset), instrument_ids, sample: '', tags: [], content, visibility: 'group', attachments: [], threads: [], ai_chats: [], ...extra })
export const DEMO_EXPERIMENTS = [
  demoRecord(1, 2, 'Daisy', 'CrSBr/Pt 异质结 2–300 K 反常霍尔与磁电阻', -1, [1], '器件 CP-07，四端纵向与横向桥路同步采集，先确认暗态温度稳定。每个温度点测量正反磁场分支，保留原始接线定义。\n\n使用 $R_{xy}^{odd}(H)=[R_{xy}(H)-R_{xy}(-H)]/2$ 提取奇分量；纵向分量做对称化。低温非线性横向信号尚需排除接触混入及普通霍尔多带贡献。\n\n附件仅为虚构演示片段；下一步补电流依赖、空白 Pt 和角度对照，不据此认定磁近邻效应。', {
    sample: 'CP-07 · CrSBr/Pt', tags: ['霍尔', '磁电阻', '低温'], attachments: [{ id: 1, name: 'CP07_demo_transport.dat', size: demoDat.length, type: 'text/plain', content: demoDat, author_id: 2, author_name: 'Daisy' }],
    threads: [{ id: 1, title: '低场非线性信号的对照方案', author_id: 2, author_name: 'Daisy', created_at: `${DEMO_BASE_DATE_STR}T08:00:00Z`, posts: [
      { id: 1, author_id: 2, author_name: 'Daisy', created_at: `${DEMO_BASE_DATE_STR}T08:17:00Z`, content: '低场横向分量有非线性，建议先比较正反扫的重复性。', attachments: [] },
      { id: 2, author_id: 3, author_name: 'DOG001', created_at: `${DEMO_BASE_DATE_STR}T09:34:00Z`, content: '请加入电流换向并分别处理两条扫描分支，检查热电势与纵向混入。', attachments: [] },
      { id: 3, author_id: 1, author_name: '曾', created_at: `${DEMO_BASE_DATE_STR}T09:51:00Z`, content: '先做 Pt 空白与角度依赖，记录温度稳定时间。曲线形状本身还不能确定机制。', attachments: [] }
    ] }], ai_chats: [{ id: 1, title: '霍尔预处理与对照建议', saved_by: 2, saved_by_name: 'Daisy', saved_at: `${DEMO_BASE_DATE_STR}T09:00:00Z`, model: '演示模型', messages: [{ role: 'user', content: '如何检查该横向非线性信号？' }, { role: 'assistant', content: '先保留原始分支，再做反对称化并核对接线。通过电流换向、Pt 空白和角度依赖检验伪信号。当前演示片段不足以确定反常霍尔机制。' }] }] }),
  demoRecord(2, 2, 'Daisy', 'CP-07 光照下磁光响应初测', 0, [1, 5], '同一器件在固定磁场节点下进行暗–光–暗序列。记录光源波长、功率及腔体温度，以局部暗态基线求 $I_{ph}=I_{light}-I_{dark}$。\n\n温度仍在缓慢弛豫，暂不解释为本征磁光耦合；后续补等温对照与光功率依赖。', { visibility: 'private', sample: 'CP-07 · CrSBr/Pt', tags: ['光响应', '初测'] }),
  demoRecord(3, 4, 'DOG002', 'Fe 掺杂 SnSe2 的 CVT 生长日志', -3, [4], '名义 Fe 加料比 3%，仅作生长批次标签。碘输运剂约 5 mg/cm³，双温区源端 750 ℃、生长端 650 ℃，保温 7 天后自然冷却（虚构演示参数，实际操作依设备 SOP）。\n\n出炉见片状金色晶体及少量细碎晶粒。记录安瓿尺寸、源料批次与温区位置；后续用 XRD/EDS 检查物相与成分，不能用加料比代替实际掺杂量。', { sample: 'FS2-CVT-09', tags: ['CVT', '生长'], attachments: [{ id: 1, name: 'FS2_microscope_placeholder.jpg', size: 145820, type: 'image/jpeg', author_id: 4, author_name: 'DOG002' }] }),
  demoRecord(4, 3, 'DOG001', 'α-In2Se3 光电晶体管的光脉冲突触可塑性测试', -4, [5], '固定读出偏压，用 532 nm 脉冲比较脉宽和间隔依赖。每次脉冲前后保留暗态弛豫段。\n\n分别报告原始电流、局部基线与净光响应；缓慢基线漂移不直接等同于习惯化。下一步补保持、复位、栅漏电与重复周期测试。', { sample: 'IS3-FET-12', tags: ['光脉冲', '器件'] }),
  demoRecord(5, 1, '曾', 'Pt 薄膜溅射速率与厚度标定', -7, [2], 'Ar 压强 0.4 Pa，直流功率 20 W；预溅射 3 min，开挡板后分 30/60/120 s 沉积在同批基片上（虚构演示）。\n\n以台阶仪厚度对沉积时间拟合，速率约 0.05 nm/s。检查零点截距及重复样品误差；更换靶材后重新标定，保存功率、靶基距和本底真空。', { sample: 'Pt-cal-09', tags: ['Pt', '标定'] }),
  demoRecord(6, 99, '张远（2024届博士 · 已毕业）', 'PPMS 低温霍尔测量接触电阻排查经验', -900, [1], '降温后横向电压偶发跳变。先停扫并降低激励，逐对检查接触电阻；发现一根电压引线在热收缩时接触不稳。\n\n重新键合并留应力弯，室温与低温复测。对照记录表明异常与接触相关；不要仅靠数据平滑掩盖跳变。接线图、杆号及排查顺序应随记录长期保存。', { date: '2024-05-12', sample: '旧批次 Hall-04', tags: ['经验', '接触电阻'], threads: [{ id: 1, title: '新样品上机前的接线检查', author_id: 3, author_name: 'DOG001', posts: [{ id: 1, author_id: 3, author_name: 'DOG001', created_at: `${DEMO_BASE_DATE_STR}T10:08:00Z`, content: '已把逐对接触电阻与应力释放加入上机检查，感谢往年经验。', attachments: [] }] }] })
]

export const DEMO_SEMINARS = [
  {
    id: 101,
    date: formatOffsetDate(2),
    time: '14:30',
    location: '物理楼 302 会议室 / 腾讯会议：982-334-112',
    presenter_id: 2,
    presenter_name: 'Daisy (博士生 / 普通成员)',
    topic: '二维磁体/Pt 异质结的反常霍尔与磁光响应：测量流程及对照实验',
    abstract: '汇报机械剥离、手套箱内干法转移与 Pt 磁控溅射流程，以及 PPMS 变温霍尔和磁光响应测量进展。对比霍尔反对称化、正常霍尔背景扣除与磁化数据，讨论 SMR 和磁近邻效应的判别条件。',
    slides_url: 'https://example.com/slides/demo_hall_photoresponse.pdf',
    status: 'upcoming',
    created_at: '2026-09-01T10:00:00Z',
    presentations: [
      {
        id: 201,
        seminar_id: 101,
        position: 0,
        presenter_id: 2,
        presenter_name: 'Daisy (博士生 / 普通成员)',
        arxiv_id: '2403.08852',
        slides_url: ''
      },
      {
        id: 202,
        seminar_id: 101,
        position: 1,
        presenter_id: 4,
        presenter_name: 'DOG002 (硕士生)',
        arxiv_id: '2405.12984',
        slides_url: ''
      }
    ]
  },
  {
    id: 102,
    date: formatOffsetDate(9),
    time: '10:00',
    location: '物理楼 208 报告厅',
    presenter_id: 3,
    presenter_name: 'DOG001 (博士后)',
    topic: 'α-In2Se3 铁电光晶体管的极化调控与感内计算',
    abstract: '介绍 α-In2Se3 铁电光晶体管的制备与极化写入读出，结合拉曼、AFM 和电学对照区分极化调控与界面俘获。展示光脉冲响应和突触可塑性模拟，讨论感内计算的保持、耐久性及功耗评估。',
    slides_url: '',
    status: 'upcoming',
    created_at: '2026-09-05T12:00:00Z',
    presentations: [
      {
        id: 203,
        seminar_id: 102,
        position: 0,
        presenter_id: 3,
        presenter_name: 'DOG001 (博士后)',
        arxiv_id: '2312.04512',
        slides_url: ''
      },
      {
        id: 204,
        seminar_id: 102,
        position: 1,
        presenter_id: 1,
        presenter_name: '曾 (导师 / 管理员)',
        arxiv_id: '2401.10992',
        slides_url: ''
      }
    ]
  },
  {
    id: 103,
    date: formatOffsetDate(16),
    time: '14:30',
    location: '物理楼 302 会议室',
    presenter_id: 1,
    presenter_name: '曾 (导师 / 管理员)',
    topic: '二维磁性与感存算器件阶段进展：异质结制备及测量任务细化',
    abstract: '承接年度研究计划，梳理 CrSBr、CrI3、Fe3GeTe2 与 Pt 异质结的制备进展，安排磁光克尔、VSM 和 PPMS 交叉测量，细化铁电光晶体管与磁光响应器件的对照实验及论文节点。',
    slides_url: 'https://example.com/slides/group_annual_plan.pdf',
    status: 'upcoming',
    created_at: '2026-09-10T09:00:00Z',
    presentations: [
      {
        id: 205,
        seminar_id: 103,
        position: 0,
        presenter_id: 1,
        presenter_name: '曾 (导师 / 管理员)',
        arxiv_id: '2405.12984',
        slides_url: ''
      }
    ]
  },
  {
    id: 100,
    date: formatOffsetDate(-5),
    time: '14:30',
    location: '物理楼 302 会议室',
    presenter_id: 1,
    presenter_name: '曾 (导师 / 管理员)',
    topic: '二维材料生长、磁性表征与感存算器件年度研究计划',
    abstract: '围绕 CVT/CVD 生长、机械剥离、EBL 器件加工及低温输运制定年度计划，明确二维磁体/Pt、铁电光电器件与掺杂磁性半导体的分工、仪器培训和数据归档要求。',
    slides_url: 'https://example.com/slides/group_annual_plan.pdf',
    status: 'completed',
    created_at: '2026-08-20T09:00:00Z',
    presentations: []
  },
  {
    id: 99,
    date: formatOffsetDate(-12),
    time: '15:00',
    location: '线上腾讯会议',
    presenter_id: 4,
    presenter_name: 'DOG002 (硕士生)',
    topic: 'Fe 掺杂 SnSe2 的 CVT 生长与磁性表征：成分、结构和输运对照',
    abstract: '文献精读与实验进展：比较 CVT 输运温区和 Fe 投料比例对 SnSe2 晶体成分与结构的影响，结合 XRD、EDS、VSM 及 PPMS 数据讨论杂相、掺杂均匀性与磁响应来源，保留占位和机制问题。',
    slides_url: 'https://example.com/slides/cvt_magnetic_characterization.pdf',
    status: 'completed',
    created_at: '2026-08-10T14:00:00Z',
    presentations: []
  }
]

export const DEMO_ARXIV_PAPERS = [
  {
    id: 301,
    arxiv_id: '2403.08852',
    title: 'Anomalous Hall and Magneto-Photoresponse Measurements in Two-Dimensional Magnet/Pt Heterostructures',
    authors: 'Daisy, Mira Linwood, Evan Qorrel, Tessa Norvale',
    journal: '虚构演示预印本 / arXiv:2403.08852',
    primary_category: 'cond-mat.mes-hall',
    published_date: formatOffsetDate(-3),
    source_url: 'https://arxiv.org/abs/2403.08852',
    pdf_url: 'https://arxiv.org/pdf/2403.08852.pdf',
    abstract: 'We present a demonstration study combining field-dependent Hall transport, magnetometry and magneto-photoresponse in two-dimensional magnet/Pt heterostructures. Antisymmetrization and ordinary Hall subtraction are compared across temperature and field sweep protocols. Interface and thermal controls are used to assess possible magnetic contributions without assigning a unique microscopic mechanism.',
    recommender: {
      id: 2,
      name: 'Daisy (博士生 / 普通成员)',
      real_name: 'Daisy',
      identity: 'student',
      role: 'member'
    },
    recommended_by: 'Daisy (博士生 / 普通成员)',
    recommended_at: formatOffsetDate(-2),
    notes: '精读重点：霍尔背景扣除、磁化与光响应的测量链条，以及 Pt 厚度和非磁性参照对照。',
    likes_count: 7,
    user_liked: true,
    is_liked_by_me: true,
    read: true,
    is_read_by_me: true,
    comments: [
      {
        id: 501,
        paper_id: 301,
        user_id: 1,
        user_name: '曾 (导师 / 管理员)',
        user_nickname: '曾',
        content: '下次组会上请 Daisy 重点讨论霍尔反对称化与背景扣除，并与磁化回线交叉比较。',
        created_at: formatOffsetDate(-2) + ' 16:20:00'
      },
      {
        id: 502,
        paper_id: 301,
        user_id: 3,
        user_name: 'DOG001 (博士后)',
        user_nickname: '思齐',
        content: '建议补充同批次非磁性参照和光照温升记录，再讨论磁光响应的来源。',
        created_at: formatOffsetDate(-1) + ' 09:45:00'
      }
    ]
  },
  {
    id: 302,
    arxiv_id: '2405.12984',
    title: 'Correlating CVT Growth, Fe Distribution and Low-Temperature Transport in SnSe2 Crystals',
    authors: 'Zihan Zhao, Nora Kelwyn, Ilan Veycroft, Evan Qorrel',
    journal: '虚构演示预印本 / arXiv:2405.12984',
    primary_category: 'cond-mat.mtrl-sci',
    published_date: formatOffsetDate(-6),
    source_url: 'https://arxiv.org/abs/2405.12984',
    pdf_url: 'https://arxiv.org/pdf/2405.12984.pdf',
    abstract: 'We compare CVT growth conditions and Fe distributions in SnSe2 crystals using X-ray diffraction, energy-dispersive spectroscopy and low-temperature transport. Magnetometry and composition maps are examined together to assess sample variation and possible secondary phases. Nominal Fe loading alone does not establish lattice occupation or intrinsic magnetism.',
    recommender: {
      id: 1,
      name: '曾 (导师 / 管理员)',
      real_name: '曾',
      identity: 'teacher',
      role: 'admin'
    },
    recommended_by: '曾 (导师 / 管理员)',
    recommended_at: formatOffsetDate(-5),
    notes: '关注 CVT 温区、Fe 分布与磁性来源的对应关系，避免用名义掺杂比例代替实际成分。',
    likes_count: 12,
    user_liked: false,
    is_liked_by_me: false,
    read: false,
    is_read_by_me: false,
    comments: [
      {
        id: 503,
        paper_id: 302,
        user_id: 2,
        user_name: 'Daisy (博士生 / 普通成员)',
        user_nickname: 'Daisy',
        content: '已整理 CVT 生长记录、XRD 与 EDS 数据，下一步会对照 VSM 和 PPMS 测量检查批次差异。',
        created_at: formatOffsetDate(-4) + ' 11:30:00'
      }
    ]
  },
  {
    id: 303,
    arxiv_id: '2312.04512',
    title: 'Polarization-Controlled Synaptic Photoresponse in alpha-In2Se3 Ferroelectric Phototransistors',
    authors: 'Siqi Wang, Tessa Norvale, Leo Fenwicke',
    journal: '虚构演示预印本 / arXiv:2312.04512',
    primary_category: 'physics.app-ph',
    published_date: formatOffsetDate(-10),
    source_url: 'https://arxiv.org/abs/2312.04512',
    pdf_url: 'https://arxiv.org/pdf/2312.04512.pdf',
    abstract: 'We examine polarization-controlled optical response and synaptic plasticity in alpha-In2Se3 ferroelectric phototransistors. Raman, AFM and electrical controls connect device structure to pulse-dependent conductance, while retention, endurance and trap-mediated relaxation are evaluated for in-sensor computing.',
    recommender: {
      id: 3,
      name: 'DOG001 (博士后)',
      real_name: 'DOG001',
      identity: 'postdoc',
      role: 'member'
    },
    recommended_by: 'DOG001 (博士后)',
    recommended_at: formatOffsetDate(-8),
    notes: '关注极化写入、陷阱弛豫与光脉冲响应的区分，以及感内计算所需的保持与耐久性。',
    likes_count: 5,
    user_liked: true,
    is_liked_by_me: true,
    read: true,
    is_read_by_me: true,
    comments: []
  },
  {
    id: 304,
    arxiv_id: '2401.10992',
    title: 'Distinguishing Spin Hall Magnetoresistance and Magnetic Proximity Signals in van der Waals Magnet/Pt Devices',
    authors: 'Mira Linwood, Ilan Veycroft',
    journal: '虚构演示预印本 / arXiv:2401.10992',
    primary_category: 'cond-mat.str-el',
    published_date: formatOffsetDate(-15),
    source_url: 'https://arxiv.org/abs/2401.10992',
    pdf_url: 'https://arxiv.org/pdf/2401.10992.pdf',
    abstract: 'We compare angular magnetoresistance, Hall transport and magnetometry in van der Waals magnet/Pt devices. Thickness, temperature and nonmagnetic reference measurements are used to examine spin Hall magnetoresistance and possible proximity contributions. Hall hysteresis alone does not determine the interfacial magnetic mechanism.',
    recommender: {
      id: 4,
      name: 'DOG002 (硕士生)',
      real_name: 'DOG002',
      identity: 'student',
      role: 'member'
    },
    recommended_by: 'DOG002 (硕士生)',
    recommended_at: formatOffsetDate(-12),
    notes: '比较角度依赖和厚度对照，梳理 SMR 与磁近邻贡献的证据边界。',
    likes_count: 3,
    user_liked: false,
    is_liked_by_me: false,
    read: false,
    is_read_by_me: false,
    comments: []
  }
]

export const DEMO_NOTICES = [
  {
    id: 401,
    title: '【学术讲座】二维铁电与感存算一体光电器件专题报告',
    content: '各位老师、同学：\n课题组将于近期在物理楼举行学术交流活动，邀请林若岑研究员（虚构演示报告人）分享二维铁电极化调控与感内计算器件的测量方法。具体时间见报告排期，请会前阅读相关文献。',
    category: 'academic',
    importance: 'high',
    start_date: formatOffsetDate(-2),
    end_date: formatOffsetDate(5),
    created_by_name: '曾 (导师)',
    created_at: formatOffsetDate(-2) + ' 09:00:00',
    attachments: [
      {
        id: 'att-1',
        filename: '学术报告邀请函.pdf',
        url: 'https://example.com/notice_poster.pdf',
        size: 1024 * 340
      }
    ]
  },
  {
    id: 402,
    title: '【重要提醒】国家自然科学基金与研究生创新基金结题/申报节点',
    content: '请各位参与二维磁性与感存算器件项目的博士后、博士生，于本月底前将阶段研究报告初稿发送至课题组公共邮箱，核对原始数据、样品编号及图表来源。',
    category: 'general',
    importance: 'normal',
    start_date: formatOffsetDate(-5),
    end_date: formatOffsetDate(10),
    created_by_name: '曾 (导师)',
    created_at: formatOffsetDate(-5) + ' 15:00:00',
    attachments: []
  },
  {
    id: 403,
    title: '【实验室安全】PPMS 维护与低温强磁场实验培训通知',
    content: 'PPMS 将于本周日 02:00–06:00 进行例行维护，请提前结束测量并保存原始数据。新成员须完成低温、强磁场与电气安全培训后再预约上机；微纳加工平台 EBL 和手套箱培训安排另行通知。',
    category: 'security',
    importance: 'normal',
    start_date: formatOffsetDate(-1),
    end_date: formatOffsetDate(3),
    created_by_name: 'Daisy (博士生 / 体验官)',
    created_at: formatOffsetDate(-1) + ' 17:30:00',
    attachments: []
  }
]

export const DEMO_RESOURCES_CATEGORIES = [
  { id: 1, name: '教材', is_default: true },
  { id: 2, name: '工具', is_default: true },
  { id: 3, name: '网站', is_default: true }
]

export const DEMO_BOOKS = [
  {
    id: 1,
    title: 'Introduction to Solid State Physics（固体物理导论）',
    authors: 'Charles Kittel',
    category: '教材',
    description: '固体物理基础教材，涵盖晶体结构、能带、声子和磁性，供二维材料与低温输运入门研读。',
    cover_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=400&q=80',
    url: 'https://www.wiley.com/en-us/Introduction+to+Solid+State+Physics%2C+8th+Edition-p-9780471415268',
    tutorial_url: '',
    exercise_url: '',
    github_url: '',
    favorite_count: 18,
    is_favorited: true,
    created_at: '2026-02-10T08:00:00Z'
  },
  {
    id: 2,
    title: 'Magnetism and Magnetic Materials',
    authors: 'J. M. D. Coey',
    category: '教材',
    description: '磁性材料教材，系统介绍交换相互作用、磁各向异性、磁畴与磁性测量，配合 VSM、SQUID 和磁光克尔实验学习。',
    cover_url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80',
    url: 'https://doi.org/10.1017/CBO9780511845000',
    tutorial_url: '',
    exercise_url: '',
    github_url: '',
    favorite_count: 24,
    is_favorited: true,
    created_at: '2026-02-15T09:00:00Z'
  },
  {
    id: 3,
    title: 'Physics of Semiconductor Devices',
    authors: 'S. M. Sze, Yiming Li & Kwok K. Ng',
    category: '教材',
    description: '半导体器件教材，涵盖载流子输运、结与场效应器件，为光电探测器、铁电光晶体管和忆阻器设计提供基础。',
    cover_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
    url: 'https://www.wiley.com/en-us/Physics+of+Semiconductor+Devices%2C+4th+Edition-p-9781119429111',
    tutorial_url: '',
    exercise_url: '',
    github_url: '',
    favorite_count: 12,
    is_favorited: false,
    created_at: '2026-03-01T10:00:00Z'
  },
  {
    id: 4,
    title: 'VASP：第一性原理材料计算',
    authors: 'VASP Software GmbH',
    category: '工具',
    description: '第一性原理计算软件，用于结构、能带及磁性模型研究；计算需检查收敛性与模型假设，并遵守软件授权要求。',
    cover_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
    url: 'https://www.vasp.at/',
    tutorial_url: 'https://www.vasp.at/wiki/',
    exercise_url: '',
    github_url: '',
    favorite_count: 32,
    is_favorited: true,
    created_at: '2026-01-20T11:00:00Z'
  },
  {
    id: 5,
    title: 'Gwyddion：AFM 形貌数据处理',
    authors: 'Gwyddion 开发团队',
    category: '工具',
    description: '扫描探针显微数据处理工具，用于 AFM 图像校平、截线及粗糙度分析；处理时保留原始数据与操作记录。',
    cover_url: '',
    url: 'https://gwyddion.net/',
    tutorial_url: 'https://gwyddion.net/documentation/',
    exercise_url: '',
    github_url: '',
    favorite_count: 19,
    is_favorited: false,
    created_at: '2026-03-10T14:00:00Z'
  },
  {
    id: 6,
    title: 'Materials Project：材料结构与计算性质数据库',
    authors: 'Materials Project 团队',
    category: '网站',
    description: '材料结构与计算性质检索平台，可辅助筛选 MoS2、WSe2、SnSe2 和 In2Se3 等候选结构；计算条目需与实验物相核对。',
    cover_url: '',
    url: 'https://next-gen.materialsproject.org/',
    tutorial_url: 'https://docs.materialsproject.org/',
    exercise_url: '',
    github_url: '',
    favorite_count: 45,
    is_favorited: true,
    created_at: '2026-01-05T08:00:00Z'
  },
  {
    id: 7,
    title: 'ICSD：无机晶体结构数据库',
    authors: 'FIZ Karlsruhe',
    category: '网站',
    description: '无机晶体结构数据库，用于晶体结构查询与 XRD 物相对照；按机构授权访问，掺杂占位仍需结合实验确认。',
    cover_url: '',
    url: 'https://icsd.products.fiz-karlsruhe.de/',
    tutorial_url: 'https://icsd.products.fiz-karlsruhe.de/en/support',
    exercise_url: '',
    github_url: '',
    favorite_count: 50,
    is_favorited: true,
    created_at: '2026-01-01T08:00:00Z'
  }
]

export const DEMO_LIBRARY_PAPERS = [
  {
    id: 1,
    arxiv_id: '2403.08852',
    title: 'Anomalous Hall and Magneto-Photoresponse Measurements in Two-Dimensional Magnet/Pt Heterostructures',
    authors: ['Daisy', 'Mira Linwood', 'Evan Qorrel', 'Tessa Norvale'],
    journal: '虚构演示预印本 / arXiv:2403.08852',
    primary_category: 'cond-mat.mes-hall',
    published_date: formatOffsetDate(-3),
    source_url: 'https://arxiv.org/abs/2403.08852',
    pdf_url: 'https://arxiv.org/pdf/2403.08852.pdf',
    abstract: 'We present a demonstration study combining field-dependent Hall transport, magnetometry and magneto-photoresponse in two-dimensional magnet/Pt heterostructures. Antisymmetrization and ordinary Hall subtraction are compared across temperature and field sweep protocols. Interface and thermal controls are used to assess possible magnetic contributions without assigning a unique microscopic mechanism.',
    from_recommendation: true,
    from_seminar: true,
    seminar_id: 101,
    metadata_status: 'ready',
    created_at: formatOffsetDate(-3)
  },
  {
    id: 2,
    arxiv_id: '2405.12984',
    title: 'Correlating CVT Growth, Fe Distribution and Low-Temperature Transport in SnSe2 Crystals',
    authors: ['Zihan Zhao', 'Nora Kelwyn', 'Ilan Veycroft', 'Evan Qorrel'],
    journal: '虚构演示预印本 / arXiv:2405.12984',
    primary_category: 'cond-mat.mtrl-sci',
    published_date: formatOffsetDate(-6),
    source_url: 'https://arxiv.org/abs/2405.12984',
    pdf_url: 'https://arxiv.org/pdf/2405.12984.pdf',
    abstract: 'We compare CVT growth conditions and Fe distributions in SnSe2 crystals using X-ray diffraction, energy-dispersive spectroscopy and low-temperature transport. Magnetometry and composition maps are examined together to assess sample variation and possible secondary phases. Nominal Fe loading alone does not establish lattice occupation or intrinsic magnetism.',
    from_recommendation: true,
    from_seminar: false,
    seminar_id: null,
    metadata_status: 'ready',
    created_at: formatOffsetDate(-6)
  },
  {
    id: 3,
    arxiv_id: '2312.04512',
    title: 'Polarization-Controlled Synaptic Photoresponse in alpha-In2Se3 Ferroelectric Phototransistors',
    authors: ['Siqi Wang', 'Tessa Norvale', 'Leo Fenwicke'],
    journal: '虚构演示预印本 / arXiv:2312.04512',
    primary_category: 'physics.app-ph',
    published_date: formatOffsetDate(-10),
    source_url: 'https://arxiv.org/abs/2312.04512',
    pdf_url: 'https://arxiv.org/pdf/2312.04512.pdf',
    abstract: 'We examine polarization-controlled optical response and synaptic plasticity in alpha-In2Se3 ferroelectric phototransistors. Raman, AFM and electrical controls connect device structure to pulse-dependent conductance, while retention, endurance and trap-mediated relaxation are evaluated for in-sensor computing.',
    from_recommendation: false,
    from_seminar: true,
    seminar_id: 102,
    metadata_status: 'ready',
    created_at: formatOffsetDate(-10)
  },
  {
    id: 4,
    arxiv_id: '2401.10992',
    title: 'Distinguishing Spin Hall Magnetoresistance and Magnetic Proximity Signals in van der Waals Magnet/Pt Devices',
    authors: ['Mira Linwood', 'Ilan Veycroft'],
    journal: '虚构演示预印本 / arXiv:2401.10992',
    primary_category: 'cond-mat.str-el',
    published_date: formatOffsetDate(-15),
    source_url: 'https://arxiv.org/abs/2401.10992',
    pdf_url: 'https://arxiv.org/pdf/2401.10992.pdf',
    abstract: 'We compare angular magnetoresistance, Hall transport and magnetometry in van der Waals magnet/Pt devices. Thickness, temperature and nonmagnetic reference measurements are used to examine spin Hall magnetoresistance and possible proximity contributions. Hall hysteresis alone does not determine the interfacial magnetic mechanism.',
    from_recommendation: true,
    from_seminar: false,
    seminar_id: null,
    metadata_status: 'ready',
    created_at: formatOffsetDate(-15)
  }
]

export const DEMO_PENDING_IMPORTS = [
  {
    id: 601,
    raw_text: '学术报告通知\n主讲人：林若岑 研究员（材料器件前沿中心，虚构演示）\n题目：二维磁体/Pt 异质结中的磁光响应与界面对照\n时间：2026年9月24日 14:00\n地点：物理楼 302 会议室',
    inferred_type: 'talk',
    parsed_data: {
      title: '二维磁体/Pt 异质结中的磁光响应与界面对照',
      speaker: '林若岑 研究员',
      date: formatOffsetDate(14),
      time: '14:00',
      location: '物理楼 302 会议室',
      notes: '邀请校外学者来访交流'
    },
    image_urls: [],
    file_attachments: [],
    status: 'pending',
    created_by_id: 2,
    created_by_name: 'Daisy (博士生 / 体验官)',
    created_at: formatOffsetDate(-1) + ' 10:00:00'
  }
]

export const DEMO_TALKS = [
  {
    id: 701,
    title: '二维铁电极化调控与光脉冲突触可塑性',
    speaker: 'DOG001 博士后',
    date: formatOffsetDate(4),
    time: '10:00',
    location: '物理楼 216 学术研讨室',
    notes: '组内前沿交流：比较极化调控、陷阱弛豫与光脉冲响应。',
    event_type: 'talk',
    poster_url: '',
    source: '智能导入 (Daisy)'
  },
  {
    id: 707,
    title: '有序钙钛矿氧化物的高压制备与物性',
    speaker: '龙有文 研究员（中国科学院物理研究所）',
    date: '2026-10-16',
    time: '10:30',
    city: '深圳',
    location: '粤海校区南校区致原楼 1206',
    organizer: '物理与光电工程学院暨广东省光电子器件与系统教育部重点实验室',
    notes: '2026年度物理与光电工程学院暨广东省光电子器件与系统教育部重点实验室高水平学术报告48。邀请人：曾昱嘉 教授。\n\n报告摘要：温度、压力与化学组分是决定材料热力学状态的三个重要参数。由于常压下能够形成的固体材料是有限的，高压高温等超常规条件通过稳定特殊的晶体结构与化合价态，正成为新材料制备的重要源泉。ABO₃钙钛矿是磁电功能材料与物理研究的重要结构载体，但具有磁电活性的过渡金属离子往往只分布在B位。本报告将利用高压把磁性过渡金属离子同时稳定到钙钛矿的A位和B位，制备化学式为AA′₃B₄O₁₂的A位有序以及化学式为AA′₃B₂B′₂O₁₂的A、B位同时有序四重有序钙钛矿氧化物。这些体系除了具有常见的B/B′位相互作用外，也会产生A′位以及A′-B/B′位间的磁电相互作用新途径，为新颖物理性质与优越性能的发现提供了机会。本次报告具体汇报利用高压高温制备的新型磁电多铁性材料、高温磁性半金属、自旋序驱使的金属-绝缘体相变及相关物理问题。',
    event_type: 'talk',
    poster_url: '',
    source: '学院通知'
  },
  {
    id: 702,
    title: '2026 二维材料生长与范德华异质结学术研讨会',
    speaker: '',
    date: formatOffsetDate(18),
    end_date: formatOffsetDate(21),
    time: '全天',
    city: '上海',
    location: '张江材料与器件交流中心 国际学术报告厅',
    organizer: '二维材料生长与加工交流组（虚构演示）',
    event_type: 'conference',
    sub_type: '学术研讨会',
    abstract_deadline: formatOffsetDate(4),
    registration_deadline: formatOffsetDate(14),
    notes: '交流 CVT/CVD 生长、机械剥离、转角堆叠与手套箱干法转移，结合拉曼、PL、AFM 和 TEM 核对界面质量。',
    source: '会议通知'
  },
  {
    id: 703,
    title: '2026 二维磁性与自旋电子学国际研讨会 (2D Spin 2026)',
    speaker: '',
    date: formatOffsetDate(8),
    end_date: formatOffsetDate(11),
    time: '全天',
    city: '北京',
    location: '中关村学术交流中心 报告厅',
    organizer: '二维磁性与自旋输运交流组（虚构演示）',
    event_type: 'conference',
    sub_type: '国际会议',
    abstract_deadline: formatOffsetDate(-3),
    registration_deadline: formatOffsetDate(3),
    notes: '讨论 CrSBr、CrI3、Fe3GeTe2、CrCl3 和 CoCl2 的磁性、AHE、SMR 与磁近邻效应，重点交流 VSM/SQUID、磁光克尔及 PPMS 测量对照。',
    source: '邮件导入'
  },
  {
    id: 704,
    title: '2026 感存算一体光电器件前沿学术论坛',
    speaker: '',
    date: formatOffsetDate(25),
    end_date: formatOffsetDate(28),
    time: '全天',
    city: '成都',
    location: '天府国际会议中心 蜀都厅',
    organizer: '感存算光电器件学术交流组（虚构演示）',
    event_type: 'conference',
    sub_type: '学术年会',
    abstract_deadline: formatOffsetDate(10),
    registration_deadline: formatOffsetDate(18),
    notes: '聚焦磁光响应、铁电光晶体管与光电逻辑，讨论忆阻器、存内计算和视觉感内计算的测量指标。',
    source: '会议通知'
  },
  {
    id: 705,
    title: '二维材料表征与 PPMS 输运数据处理秋季讲习班',
    speaker: '',
    date: formatOffsetDate(32),
    end_date: formatOffsetDate(37),
    time: '全天',
    city: '杭州',
    location: '未来科技城国际学术交流中心',
    organizer: '材料表征与输运方法交流组（虚构演示）',
    event_type: 'conference',
    sub_type: '讲习班',
    abstract_deadline: formatOffsetDate(15),
    registration_deadline: formatOffsetDate(22),
    notes: '面向青年学者与研究生，讲解拉曼/PL/AFM 数据处理、PPMS 霍尔反对称化、正常霍尔背景扣除及 Python 绘图。',
    source: '教务通知'
  },
  {
    id: 706,
    title: '2026 范德华铁电与神经形态器件国际研讨会',
    speaker: '',
    date: formatOffsetDate(42),
    end_date: formatOffsetDate(46),
    time: '全天',
    city: '广州',
    location: '大学城国际学术会议中心',
    organizer: '范德华铁电与神经形态器件交流组（虚构演示）',
    event_type: 'conference',
    sub_type: '国际会议',
    abstract_deadline: formatOffsetDate(20),
    registration_deadline: formatOffsetDate(30),
    notes: '交流 α-In2Se3、CuInP2S6 铁电异质结与神经形态器件，关注极化稳定性、保持、耐久性及突触可塑性模拟。',
    source: '国际会议'
  }
]

export const DEMO_EMAILS = [
  {
    id: 801,
    msg_uid: 'uid-801',
    subject: '【学术讲座】二维磁体/Pt 异质结的磁光响应与输运对照',
    sender_name: '前沿交叉学术委员会',
    sender_email: 'academic@example.edu',
    from_addr: '前沿交叉学术委员会 <academic@example.edu>',
    from_name: '前沿交叉学术委员会',
    recipient: 'lab_demo@example.edu',
    to_addr: 'lab_demo@example.edu',
    date_str: formatOffsetDate(-1) + ' 09:30:00',
    created_at: formatOffsetDate(-1) + ' 09:30:00',
    snippet: '各位老师同学：兹定于近期举行二维磁体/Pt 异质结磁光响应线上线下联合报告会。主讲人：林若岑 研究员（材料器件前沿中心，虚构演示）。时间：' + formatOffsetDate(3) + ' 14:30。地点：物理楼三楼报告厅 / 腾讯会议：882-910-334。重点讨论反常霍尔、SMR 与光照温升对照。',
    body_text: '各位老师同学：兹定于近期举行二维磁体/Pt 异质结磁光响应线上线下联合报告会。主讲人：林若岑 研究员（材料器件前沿中心，虚构演示）。时间：' + formatOffsetDate(3) + ' 14:30。地点：物理楼三楼报告厅 / 腾讯会议：882-910-334。',
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 680px;">
      <h2 style="color: #0f172a; border-bottom: 2px solid #38bdf8; padding-bottom: 10px; margin-top: 0;">二维磁体/Pt 异质结磁光响应专题报告通知</h2>
      <p><strong>主讲人：</strong>林若岑 研究员（材料器件前沿中心，虚构演示）</p>
      <p><strong>时间：</strong>${formatOffsetDate(3)} 14:30 - 16:30</p>
      <p><strong>地点：</strong>物理楼三楼报告厅 / 腾讯会议：882-910-334</p>
      <p><strong>报告摘要：</strong>本报告介绍二维磁体/Pt 异质结的干法转移与磁控溅射工艺，结合 PPMS 变温霍尔、磁光克尔和光脉冲响应测量，讨论反常霍尔、SMR 与磁近邻贡献的判别条件。通过 Pt 厚度、非磁性参照和温升记录检查界面与热效应。</p>
      <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 12px 16px; margin: 18px 0; border-radius: 6px;">
        <p style="margin: 0; font-size: 13px; color: #166534;">※ 会前建议阅读霍尔背景扣除、SMR 角度依赖和磁光响应测量方法，欢迎携带器件加工与测量记录交流。</p>
      </div>
    </div>`,
    has_attachments: true,
    attachments: [
      {
        id: 'att-email-1',
        filename: '学术报告邀请函与海报.pdf',
        url: 'https://example.com/poster.pdf',
        size: 1024 * 480
      }
    ],
    is_read: true
  },
  {
    id: 802,
    msg_uid: 'uid-802',
    subject: '感存算光电器件 2026 年学术年会第一轮通知及征文启事',
    sender_name: '感存算光电器件演示年会秘书处',
    sender_email: 'conference@example.edu',
    from_addr: '感存算光电器件演示年会秘书处 <conference@example.edu>',
    from_name: '感存算光电器件演示年会秘书处',
    recipient: 'lab_demo@example.edu',
    to_addr: 'lab_demo@example.edu',
    date_str: formatOffsetDate(-2) + ' 14:15:00',
    created_at: formatOffsetDate(-2) + ' 14:15:00',
    snippet: '各位学者、学界同仁：感存算光电器件 2026 年学术年会拟定于 10 月上旬举行。现启动分会场征文与大会口头报告申请，涵盖二维铁电、磁光响应、忆阻器与视觉感内计算等前沿专题。',
    body_text: '各位学者、学界同仁：感存算光电器件 2026 年学术年会拟定于 10 月上旬召开。本届年会涵盖二维铁电、光电探测器、忆阻器和感内计算等专题分会场，现启动征文与大会口头报告申请。',
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b;">
      <h2 style="color: #0f172a; border-bottom: 2px solid #818cf8; padding-bottom: 8px;">感存算光电器件 2026 年学术年会第一轮通知</h2>
      <p>各位学者、学界同仁：</p>
      <p>感存算光电器件 2026 年学术年会拟定于今年 10 月上旬举行。现就有关事项通知如下：</p>
      <ul>
        <li><strong>会议时间：</strong>${formatOffsetDate(25)} 至 ${formatOffsetDate(29)}</li>
        <li><strong>摘要提交截止日期：</strong>${formatOffsetDate(12)}</li>
        <li><strong>主要专题：</strong>铁电光晶体管、磁光响应、忆阻器与突触可塑性、视觉感内计算</li>
      </ul>
      <p>请拟参会人员在截止日期前通过会议官网完成注册及摘要提交。</p>
    </div>`,
    has_attachments: false,
    attachments: [],
    is_read: true
  },
  {
    id: 803,
    msg_uid: 'uid-803',
    subject: '【基金委提醒】2026 年度国家自然科学基金重点项目进展报告提交提醒',
    sender_name: '国家自然科学基金委员会',
    sender_email: 'report@nsfc.gov.cn',
    from_addr: '国家自然科学基金委员会 <report@nsfc.gov.cn>',
    from_name: '国家自然科学基金委员会',
    recipient: 'lihua@lab.edu',
    to_addr: 'lihua@lab.edu',
    date_str: formatOffsetDate(-3) + ' 11:00:00',
    created_at: formatOffsetDate(-3) + ' 11:00:00',
    snippet: '尊敬的曾教授：您负责的重点项目《二维磁体异质结的磁光响应与感存算器件研究》（项目号：12233005）2026 年度进展报告填报通道已开放，请组织项目组成员系统梳理本年度代表性成果并在线提交。',
    body_text: '尊敬的曾教授：您负责的重点项目（项目批准号：12233005）年度进展报告现已开放填报，请登录科学基金网络信息系统在线填写并于规定时间前提交依托单位审核。',
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b;">
      <h3 style="color: #0f172a;">国家自然科学基金委员会 业务提醒函</h3>
      <p>尊敬的 <strong>曾</strong> 教授：</p>
      <p>您主持的重点项目《二维磁体异质结的磁光响应与感存算器件研究》（项目批准号：12233005）2026 年度进展报告填报通道已正式开放。</p>
      <p>请组织项目组成员系统梳理本年度代表性成果、论文发表及经费执行情况，通过科学基金网络信息系统在线完成填报。</p>
      <p style="color: #64748b; font-size: 13px;">（系统自动发送邮件，请勿直接回复）</p>
    </div>`,
    has_attachments: false,
    attachments: [],
    is_read: true
  },
  {
    id: 804,
    msg_uid: 'uid-804',
    subject: 'Demo Materials Devices Letters: Decision on Manuscript #DMDL-108291',
    sender_name: 'Demo Materials Devices Editorial Office',
    sender_email: 'editor@materials-demo.example.org',
    from_addr: 'Demo Materials Devices Letters <editor@materials-demo.example.org>',
    from_name: 'Demo Materials Devices Editorial Office',
    recipient: 'lihua@lab.edu',
    to_addr: 'lihua@lab.edu',
    date_str: formatOffsetDate(-4) + ' 16:45:00',
    created_at: formatOffsetDate(-4) + ' 16:45:00',
    snippet: 'Dear Prof. Zeng: We have received the referee report for your manuscript #DMDL-108291 "Anomalous Hall and Magneto-Photoresponse Measurements in Two-Dimensional Magnet/Pt Heterostructures". The referee recommends Minor Revision. Please check attached referee comments and submit your revised manuscript within 30 days.',
    body_text: 'Dear Prof. Zeng, We have received the referee report for your manuscript "Anomalous Hall and Magneto-Photoresponse Measurements in Two-Dimensional Magnet/Pt Heterostructures". The referee recommends minor revision...',
    body_html: `<div style="font-family: Georgia, serif; line-height: 1.7; color: #1e293b;">
      <h3 style="font-family: sans-serif; color: #0f172a;">Demo Materials Devices Letters - Editorial Decision</h3>
      <p>Dear Prof. Zeng,</p>
      <p>We are pleased to inform you that the review of your manuscript <strong>"Anomalous Hall and Magneto-Photoresponse Measurements in Two-Dimensional Magnet/Pt Heterostructures"</strong> (MS #DMDL-108291) is now complete.</p>
      <p>The referee requests clearer Hall background subtraction, nonmagnetic references and illumination temperature controls. The recommendation is <strong>Minor Revision</strong>.</p>
      <p>Please refer to the referee comments attached and submit your revised manuscript within 30 days.</p>
      <p>Sincerely,<br/><em>The Editors, Demo Materials Devices Letters</em></p>
    </div>`,
    has_attachments: true,
    attachments: [
      {
        id: 'att-email-2',
        filename: 'Referee_Report_DMDL-108291.pdf',
        url: 'https://example.com/referee_report.pdf',
        size: 1024 * 145
      }
    ],
    is_read: false
  }
]

export const DEMO_FEEDBACK_ITEMS = [
  {
    id: 1,
    title: '建议在组会日历导出中增加提醒提前量设置',
    content: '目前的 .ics 日历文件导入手机或 Mac 默认是准点提醒。希望能在导出时支持选择提前 15 分钟或提前 1 天提醒，这样更方便提前准备汇报和课件。',
    author: 'Daisy (博士生 / 普通成员)',
    author_id: 2,
    page: '/seminars',
    resolved: true,
    created_at: formatOffsetDate(-3) + 'T10:15:00',
    replies: [
      {
        id: 101,
        author: '曾 (导师 / 管理员)',
        content: '非常实用的建议！已经在排期管理模块中更新了日历提醒规则，现在下载的 .ics 会自动携带提前 30 分钟和提前 1 天的双重响铃提醒。',
        created_at: formatOffsetDate(-2) + 'T16:40:00',
        read_at: formatOffsetDate(-1) + 'T09:00:00'
      }
    ]
  },
  {
    id: 2,
    title: '文献推荐卡片能否增加批量复制 BibTeX 引用的功能？',
    content: '在文献推荐流里看到好文章时经常想直接贴进 Overleaf 里引用，如果卡片上有个一键复制 BibTeX 的小按钮会极大提升写作效率。',
    author: 'DOG002 (硕士生)',
    author_id: 4,
    page: '/arxiv',
    resolved: false,
    created_at: formatOffsetDate(-1) + 'T14:20:00',
    replies: [
      {
        id: 102,
        author: '曾 (导师 / 管理员)',
        content: '收到，这个功能很棒，已记录在下一步系统迭代需求清单中，近期版本会支持直接解析 arXiv API 生成标准 BibTeX 格式。',
        created_at: formatOffsetDate(0) + 'T09:30:00',
        read_at: null
      }
    ]
  }
]

export const DEMO_FAVORITES = [
  {
    kind: 'paper',
    target: '2403.08852',
    saved_at: '2026-09-08T10:00:00Z',
    item: DEMO_ARXIV_PAPERS[0]
  },
  {
    kind: 'book',
    target: '1',
    saved_at: '2026-09-09T14:00:00Z',
    item: DEMO_BOOKS[0]
  },
  {
    kind: 'book',
    target: '2',
    saved_at: '2026-09-09T15:30:00Z',
    item: DEMO_BOOKS[1]
  },
  {
    kind: 'book',
    target: '4',
    saved_at: '2026-09-10T09:00:00Z',
    item: DEMO_BOOKS[3]
  }
]

