/**
 * 九大主题知识数据与 slug 映射（与分类检索 category 字段一致）
 */
(function (global) {
  var ROBOT_TOPICS = {
    'topic-main-types': {
      title: '主要种类',
      shortLabel: '主要种类',
      icon: 'fa-robot',
      statBadge: '7',
      hubBlurb: '按产业角色浏览协作、医疗、物流等类型',
      intro: '从工业机器人到服务、特种、协作等类型，覆盖制造、医疗、物流等核心赛道，是认识机器人谱系的入口。',
      items: [
        { title: '工业机器人', kindLabel: '工业', desc: '焊接、装配、喷涂', meta: '应用最广，高精度多轴控制' },
        { title: '服务机器人', kindLabel: '服务', desc: '人机交互、智能导航', meta: '家用、商用、情感陪伴' },
        { title: '特种机器人', kindLabel: '特种', desc: '防爆耐高温', meta: '消防、侦察、水下作业' },
        { title: '协作机器人', kindLabel: '协作', desc: '轻量化、人机协作', meta: '柔性装配、精密操作' },
        { title: '医疗机器人', kindLabel: '医疗', desc: '手术导航、康复辅助', meta: '微创介入、远程诊疗' },
        { title: '教育机器人', kindLabel: '教育', desc: '编程教育、STEAM教学', meta: '激发创新思维' },
        { title: '物流机器人', kindLabel: '物流', desc: 'AGV/AMR技术', meta: '智能仓储、无人配送' }
      ]
    },
    'topic-development': {
      title: '发展阶段',
      shortLabel: '发展阶段',
      icon: 'fa-chart-line',
      statBadge: '4',
      hubBlurb: '沿时间轴从理论探索走到智能决策',
      intro: '从理论萌芽到 AI 与多模态融合，机器人产业经历了四代演进，理解阶段有助于把握技术节奏与产业机会。',
      items: [
        { title: '萌芽期（理论探索）', desc: '1950s-1960s', meta: '机器人基础理论、控制算法雏形' },
        { title: '产业化初期（工业应用）', desc: '1970s-1980s', meta: '汽车制造、点焊喷涂' },
        { title: '智能化起步（传感器融合）', desc: '1990s-2010s', meta: '视觉、力觉集成，初步自主' },
        { title: 'AI爆发期（自主决策）', desc: '2020s至今', meta: '深度学习、多模态交互、云端协同' }
      ]
    },
    'topic-scenarios': {
      title: '应用场景',
      shortLabel: '应用场景',
      icon: 'fa-industry',
      statBadge: '12+',
      hubBlurb: '交通、医疗、农业等真实落地行业',
      intro: '交通、医疗、农业、家庭……机器人已嵌入千行百业，下列为典型落地场景梳理。',
      items: [
        { title: '智慧交通', tag: '交通', desc: '自动驾驶、车路协同', meta: '交通管控、无人驾驶' },
        { title: '智慧医疗', tag: '医疗', desc: '手术机器人、康复辅助', meta: '远程诊疗、精准医疗' },
        { title: '智慧农业', tag: '农业', desc: '精准喷洒、无人播种', meta: '作物监测、智能灌溉' },
        { title: '工业质检', tag: '制造', desc: '机器视觉缺陷检测', meta: '自动分拣、质量控制' },
        { title: '家庭服务', tag: '消费', desc: '扫地机器人、智能清洁', meta: '语音控制、自主导航' },
        { title: '安防巡检', tag: '安防', desc: '防爆巡检、热成像监测', meta: '预警、环境感知' }
      ]
    },
    'topic-domestic-stars': {
      title: '国产机器人明星',
      shortLabel: '国产明星',
      icon: 'fa-star',
      statBadge: '15+',
      hubBlurb: '重点企业与创新产品线速览',
      intro: '从工业机器人龙头到人形与无人机创新，国产品牌在全球产业链中占据越来越重要的位置。',
      items: [
        { title: '新松机器人', desc: '工业机器人领军企业', meta: '中国机器人产业龙头，特种机器人代表' },
        { title: '优必选', desc: '人形机器人先锋', meta: 'AI教育、消费级机器人，春晚明星' },
        { title: '大疆创新', desc: '无人机及视觉导航王者', meta: '全球消费级无人机霸主，进军机器人' },
        { title: '科大讯飞', desc: '机器人语音交互方案', meta: '多模态AI，智能语音领跑者' },
        { title: '埃夫特', desc: '工业机器人新锐', meta: '喷涂、焊接机器人，国产替代先锋' },
        { title: '哈工大机器人', desc: '产学研结合典范', meta: '空间机器人、医疗机器人技术领先' },
        { title: '猎户星空', desc: '服务机器人创新者', meta: '智能接待、递送机器人，AI赋能' },
        { title: '宇树科技', desc: '四足与人形机器人', meta: '高机动平台与通用具身方案' },
        { title: '蔚蓝智能', desc: '农业与巡检机器人', meta: '复杂地形作业与自主导航' },
        { title: '极智嘉', desc: '物流仓储机器人', meta: 'AMR调度与智能仓储' },
        { title: '普渡科技', desc: '商用服务机器人', meta: '餐饮配送与室内导航' },
        { title: '节卡机器人', desc: '协作机器人品牌', meta: '轻量化与人机协作安全' },
        { title: '遨博智能', desc: '协作机器人方案商', meta: '柔性装配与精密操作' },
        { title: '新时达', desc: '工业与控制系统', meta: '运动控制与机器人系统' }
      ]
    },
    'topic-core-parts': {
      title: '核心零部件',
      shortLabel: '核心零部件',
      icon: 'fa-microchip',
      statBadge: '320+',
      hubBlurb: '伺服、感知、能源等关键模块',
      intro: '伺服、减速器、感知与能源模块构成机器人的「筋骨与感官」，是国产突破的关键环节。',
      items: [
        { title: '伺服电机', desc: '高动态响应', meta: '精准控制核心' },
        { title: '减速器', desc: '谐波减速器', meta: '高刚度低背隙' },
        { title: '控制器', desc: '运动控制核心', meta: '实时性、开放性' },
        { title: '激光雷达', desc: '高精度3D感知', meta: '自动驾驶、导航' },
        { title: '视觉传感器', desc: '工业相机', meta: '机器视觉检测' },
        { title: '力控传感器', desc: '六维力觉感知', meta: '精密装配' },
        { title: '电池模组', desc: '高能量密度', meta: '移动机器人动力' }
      ]
    },
    'topic-locomotion': {
      title: '行动方式种类',
      shortLabel: '行动方式',
      icon: 'fa-shoe-prints',
      statBadge: '6',
      hubBlurb: '轮履足飞：机动性与地形匹配',
      intro: '轮式、履带、足式与飞行等构型决定了机器人的适用地形与任务边界。',
      items: [
        { title: '轮式机器人', tag: '平坦路面', desc: '移动速度快', meta: '适用于室内外平坦路面，如AGV' },
        { title: '履带式机器人', tag: '越野地形', desc: '越野能力强', meta: '适应复杂地形，如救援机器人' },
        { title: '足式机器人', tag: '崎岖/台阶', desc: '仿生行走', meta: '四足、双足机器人，如波士顿动力' },
        { title: '仿生式机器人', tag: '特种环境', desc: '模仿生物运动', meta: '蛇形、鱼形、昆虫机器人' },
        { title: '飞行式机器人', tag: '空中', desc: '空中作业', meta: '无人机、旋翼机器人' },
        { title: '复合式机器人', tag: '多模态', desc: '多种方式组合', meta: '轮履复合、飞行爬行等' }
      ]
    },
    'topic-patents': {
      title: '专利数量',
      shortLabel: '专利数量',
      icon: 'fa-file-alt',
      statBadge: '概览',
      hubBlurb: '机器人关键方向的专利态势与质量维度',
      intro: '聚焦专利维度本身（质量、同族、引证、主要申请人与地域分布等），避免与种类分类重合，以 IP 视角理解技术与产业竞争格局。',
      items: [
        { title: '控制与算法', desc: '运动规划/SLAM/力控', meta: '控制学派与 AI 路线交汇' },
        { title: '感知与导航', desc: '视觉/雷达/多传感融合', meta: '环境理解与路径生成' },
        { title: '人机协作安全', desc: '安全标准与机制', meta: '碰撞检测/协作等级/功能安全' },
        { title: '末端执行与触觉', desc: '夹持/灵巧手/触觉', meta: '抓取策略与触觉阵列' },
        { title: '材料与制造工艺', desc: '结构/减速/电机', meta: '轻量化与高刚度制造' },
        { title: '专利质量与引证', desc: '授权率/引证网络', meta: '同族规模与影响力' },
        { title: '主要申请人布局', desc: '头部企业/高校', meta: '专利组合与研发路径' },
        { title: '地域与同族分布', desc: '全球/区域差异', meta: '同族覆盖与市场策略' },
        { title: '授权与维持年限', desc: '专利寿命与价值', meta: '生命周期与续费行为' },
        { title: '热点与趋势', desc: '近五年增长热点', meta: '技术拐点与投资偏好' },
        { title: '特种机器人', desc: '防爆救援等领域', meta: '军用与消防场景专利增长' },
        { title: '家用机器人', desc: '清洁与陪伴', meta: '智能家居生态带动布局' },
        { title: '特种机器人', desc: '防爆救援等领域', meta: '军用与消防场景专利增长' },
        { title: '家用机器人', desc: '清洁与陪伴', meta: '智能家居生态带动布局' },
        { title: '教育机器人', desc: '编程与教具', meta: '软硬件一体方案专利上升' },
        { title: '物流机器人', desc: 'AGV/AMR系统', meta: '调度算法与路径规划' }
      ]
    },
    'topic-labs': {
      title: '国家级实验室',
      shortLabel: '国家级实验室',
      icon: 'fa-flask',
      statBadge: '30+',
      hubBlurb: '国家级平台与研究方向导读',
      intro: '国家级科研平台承担基础理论与关键共性技术攻关，是产业创新的重要源头。',
      items: [
        { title: '机器人学国家重点实验室', desc: '中科院沈阳自动化所', meta: '机器人基础理论与应用' },
        { title: '智能机器人实验室', desc: '哈尔滨工业大学', meta: '空间机器人、医疗机器人' },
        { title: '先进机器人实验室', desc: '清华大学', meta: '仿生机器人、AI控制' },
        { title: '机器人技术与系统国家重点实验室', desc: '北京航空航天大学', meta: '机器人控制与系统集成' },
        { title: '智能制造系统国家重点实验室', desc: '华中科技大学', meta: '智能制造与装备' },
        { title: '机器人与智能装备创新中心', desc: '上海', meta: '装备与关键部件' },
        { title: '工业自动化与信息系统实验室', desc: '西安', meta: '自动化控制与工业互联网' },
        { title: '信息与控制国家重点实验室', desc: '浙江大学', meta: '运动控制与感知融合' },
        { title: '模式识别国家重点实验室', desc: '中科院自动化所', meta: '视觉识别与导航' },
        { title: '智能感知与计算实验室', desc: '中国科学技术大学', meta: '多模态感知与机器人计算' },
        { title: '人工智能与机器人联合实验室', desc: '上海人工智能实验室', meta: '具身智能与人机交互' }
      ]
    },
    'topic-fun-facts': {
      title: '有趣知识',
      shortLabel: '有趣知识',
      icon: 'fa-lightbulb',
      statBadge: '15',
      hubBlurb: '轶事、赛事与概念冷知识',
      intro: '从词汇起源到赛事与软体机器人，用轻松条目拓宽对机器人的想象。',
      items: [
        { title: '第一个机器人', desc: '1921年捷克剧作家恰佩克', meta: '“机器人”一词首次出现于《罗素姆万能机器人》' },
        { title: '机器人三定律', desc: '阿西莫夫提出', meta: '保护人类、服从命令、自我保存' },
        { title: '会跳舞的机器人', desc: '波士顿动力Atlas', meta: '后空翻、跑酷，震惊世界' },
        { title: '机器人会做梦吗', desc: 'AI自我学习', meta: '强化学习模型会“梦境训练”' },
        { title: '仿生机器人', desc: '模仿动物', meta: '机器狗、机器鱼、机器鸟' },
        { title: '太空机器人', desc: '火星车、机械臂', meta: '好奇号、祝融号都是机器人' },
        { title: '医疗机器人', desc: '达芬奇手术系统', meta: '微创手术，精准操作' },
        { title: '机器人奥运会', desc: 'RoboCup', meta: '足球机器人、救援机器人比赛' },
        { title: '软体机器人', desc: '柔性材料', meta: '抓取易碎物品，医疗康复' },
        { title: '情感机器人', desc: 'Pepper、索菲亚', meta: '能识别情绪，与人交流' },
        { title: 'DARPA挑战赛', desc: '国际顶级机器人赛事', meta: '真实灾害场景下的多步任务' },
        { title: '协作机器人起源', desc: '人机安全共线', meta: '力控与碰撞检测让机器人走出围栏' },
        { title: '具身智能', desc: 'AI大模型与机器人融合', meta: '感知—决策—执行闭环' },
        { title: '人形机器人破局年', desc: '产业走向真实场景', meta: '从实验室走向工厂与物流' },
        { title: '机器人伦理', desc: '隐私与责任', meta: '如何在公共空间安全、合规地运行' }
      ]
    }
  };

  /** 中文分类名 -> 主题页文件名（用于旧链接 ?category= 重定向） */
  var CATEGORY_TO_TOPIC_FILE = {
    主要种类: 'topic-main-types.html',
    发展阶段: 'topic-development.html',
    应用场景: 'topic-scenarios.html',
    国产机器人明星: 'topic-domestic-stars.html',
    核心零部件: 'topic-core-parts.html',
    行动方式种类: 'topic-locomotion.html',
    专利数量: 'topic-patents.html',
    国家级实验室: 'topic-labs.html',
    有趣知识: 'topic-fun-facts.html'
  };

  var TOPIC_KEY_TO_FILE = {
    'topic-main-types': 'topic-main-types.html',
    'topic-development': 'topic-development.html',
    'topic-scenarios': 'topic-scenarios.html',
    'topic-domestic-stars': 'topic-domestic-stars.html',
    'topic-core-parts': 'topic-core-parts.html',
    'topic-locomotion': 'topic-locomotion.html',
    'topic-patents': 'topic-patents.html',
    'topic-labs': 'topic-labs.html',
    'topic-fun-facts': 'topic-fun-facts.html'
  };

  global.ROBOT_TOPICS = ROBOT_TOPICS;
  global.ROBOT_CATEGORY_TO_TOPIC_FILE = CATEGORY_TO_TOPIC_FILE;
  global.ROBOT_TOPIC_KEY_TO_FILE = TOPIC_KEY_TO_FILE;

  /** 门户九宫格语义化 SVG（内联，24×24，无 emoji） */
  global.ROBOT_HUB_SVGS = {
    'topic-main-types':
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    'topic-development':
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 18V6l4 4 4-6 4 5 4-3v12"/></svg>',
    'topic-scenarios':
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 19h16"/><rect x="5" y="12" width="4" height="5" rx="0.8"/><rect x="10" y="8" width="4" height="9" rx="0.8"/><rect x="15" y="5" width="4" height="12" rx="0.8"/></svg>',
    'topic-domestic-stars':
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3l2.2 5.6L20 10l-5 3.2L17 20l-5-3.2L7 20l2-6.8L4 10l5.8-1.4z"/></svg>',
    'topic-core-parts':
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1"/><path d="M7 12H4M20 12h-3M12 7V4M12 20v-3"/></svg>',
    'topic-locomotion':
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="7" cy="17" r="2.5"/><circle cx="17" cy="17" r="2.5"/><path d="M9.5 17h5M12 5v7"/></svg>',
    'topic-patents':
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 4h12v16H6z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
    'topic-labs':
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 3h6l1 9a4 4 0 11-8 0z"/><path d="M10 20h4"/></svg>',
    'topic-fun-facts':
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3v1M12 20v1M5 12H4M20 12h-1"/><circle cx="12" cy="12" r="4"/><path d="M12 10v2.5l2 1"/></svg>'
  };

  /** 门户九宫格展示顺序 */
  global.ROBOT_TOPIC_ORDER = [
    'topic-main-types',
    'topic-development',
    'topic-scenarios',
    'topic-domestic-stars',
    'topic-core-parts',
    'topic-locomotion',
    'topic-patents',
    'topic-labs',
    'topic-fun-facts'
  ];
})(typeof window !== 'undefined' ? window : globalThis);
