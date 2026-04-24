import sys, re, time, argparse, shutil, random
from pathlib import Path
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parent
REPO_ROOT = PROJECT_ROOT.parent
IMAGES_ROOT = REPO_ROOT / "images"

# ====================== 【核心修改】嵌入完整的116项数据 ======================
ROBOT_TOPICS = {
    'topic-main-types': {
        'title': '主要种类',
        'items': [
            {'title': '工业机器人', 'kindLabel': '工业', 'desc': '焊接、装配、喷涂', 'meta': '应用最广，高精度多轴控制'},
            {'title': '服务机器人', 'kindLabel': '服务', 'desc': '人机交互、智能导航', 'meta': '家用、商用、情感陪伴'},
            {'title': '特种机器人', 'kindLabel': '特种', 'desc': '防爆耐高温', 'meta': '消防、侦察、水下作业'},
            {'title': '协作机器人', 'kindLabel': '协作', 'desc': '轻量化、人机协作', 'meta': '柔性装配、精密操作'},
            {'title': '医疗机器人', 'kindLabel': '医疗', 'desc': '手术导航、康复辅助', 'meta': '微创介入、远程诊疗'},
            {'title': '教育机器人', 'kindLabel': '教育', 'desc': '编程教育、STEAM教学', 'meta': '激发创新思维'},
            {'title': '物流机器人', 'kindLabel': '物流', 'desc': 'AGV/AMR技术', 'meta': '智能仓储、无人配送'},
            {'title': '农业机器人', 'kindLabel': '农业', 'desc': '植保喷洒、采摘播种', 'meta': '智慧种植、无人农场'},
            {'title': '建筑机器人', 'kindLabel': '工程', 'desc': '砌墙焊接、测量巡检', 'meta': '高危作业、精准施工'},
            {'title': '外骨骼机器人', 'kindLabel': '可穿戴', 'desc': '康复助力、负重辅助', 'meta': '医疗康复、工业防护'}
        ]
    },
    'topic-development': {
        'title': '发展阶段',
        'items': [
            {'title': '萌芽期（理论探索）', 'desc': '1950s-1960s', 'meta': '机器人基础理论、控制算法雏形'},
            {'title': '产业化初期（工业应用）', 'desc': '1970s-1980s', 'meta': '汽车制造、点焊喷涂'},
            {'title': '智能化起步（传感器融合）', 'desc': '1990s-2010s', 'meta': '视觉、力觉集成，初步自主'},
            {'title': 'AI爆发期（自主决策）', 'desc': '2020s至今', 'meta': '深度学习、多模态交互、云端协同'}
        ]
    },
    'topic-scenarios': {
        'title': '应用场景',
        'items': [
            {'title': '智慧交通', 'tag': '交通', 'desc': '自动驾驶、车路协同', 'meta': '交通管控、无人驾驶'},
            {'title': '智慧医疗', 'tag': '医疗', 'desc': '手术机器人、康复辅助', 'meta': '远程诊疗、精准医疗'},
            {'title': '智慧农业', 'tag': '农业', 'desc': '精准喷洒、无人播种', 'meta': '作物监测、智能灌溉'},
            {'title': '工业质检', 'tag': '制造', 'desc': '机器视觉缺陷检测', 'meta': '自动分拣、质量控制'},
            {'title': '家庭服务', 'tag': '消费', 'desc': '扫地机器人、智能清洁', 'meta': '语音控制、自主导航'},
            {'title': '安防巡检', 'tag': '安防', 'desc': '防爆巡检、热成像监测', 'meta': '预警、环境感知'},
            {'title': '智慧物流', 'tag': '物流', 'desc': '仓储分拣、无人配送', 'meta': '智能调度、货到人系统'},
            {'title': '智能餐饮', 'tag': '商用', 'desc': '送餐、烹饪、后厨辅助', 'meta': '降本增效、标准化服务'},
            {'title': '建筑施工', 'tag': '工程', 'desc': '砌墙、焊接、测量巡检', 'meta': '高危作业、精准施工'},
            {'title': '能源电力', 'tag': '能源', 'desc': '电站巡检、线路检测', 'meta': '无人值守、故障预警'},
            {'title': '教育实训', 'tag': '教育', 'desc': '实验教学、编程实训', 'meta': '沉浸式学习、技能培养'},
            {'title': '商超零售', 'tag': '零售', 'desc': '导购、盘点、库存管理', 'meta': '数字化运营、客流分析'},
            {'title': '养老助残', 'tag': '康养', 'desc': '陪伴护理、行动辅助', 'meta': '生活照料、健康监测'},
            {'title': '环保环卫', 'tag': '环保', 'desc': '道路清扫、垃圾分拣、河道清污', 'meta': '无人保洁、生态治理'}
        ]
    },
    'topic-domestic-stars': {
        'title': '国产机器人明星',
        'items': [
            {'title': '新松机器人', 'desc': '工业机器人领军企业', 'meta': '中国机器人产业龙头，特种机器人代表'},
            {'title': '优必选', 'desc': '人形机器人先锋', 'meta': 'AI教育、消费级机器人，春晚明星'},
            {'title': '大疆创新', 'desc': '无人机及视觉导航王者', 'meta': '全球消费级无人机霸主，进军机器人'},
            {'title': '科大讯飞', 'desc': '机器人语音交互方案', 'meta': '多模态AI，智能语音领跑者'},
            {'title': '埃夫特', 'desc': '工业机器人新锐', 'meta': '喷涂、焊接机器人，国产替代先锋'},
            {'title': '哈工大机器人', 'desc': '产学研结合典范', 'meta': '空间机器人、医疗机器人技术领先'},
            {'title': '猎户星空', 'desc': '服务机器人创新者', 'meta': '智能接待、递送机器人，AI赋能'},
            {'title': '宇树科技', 'desc': '四足与人形机器人', 'meta': '高机动平台与通用具身方案'},
            {'title': '蔚蓝智能', 'desc': '农业与巡检机器人', 'meta': '复杂地形作业与自主导航'},
            {'title': '极智嘉', 'desc': '物流仓储机器人', 'meta': 'AMR调度与智能仓储'},
            {'title': '普渡科技', 'desc': '商用服务机器人', 'meta': '餐饮配送与室内导航'},
            {'title': '节卡机器人', 'desc': '协作机器人品牌', 'meta': '轻量化与人机协作安全'},
            {'title': '遨博智能', 'desc': '协作机器人方案商', 'meta': '柔性装配与精密操作'},
            {'title': '新时达', 'desc': '工业与控制系统', 'meta': '运动控制与机器人系统'}
        ]
    },
    'topic-core-parts': {
        'title': '核心零部件',
        'items': [
            {'title': '伺服电机', 'desc': '高动态响应', 'meta': '精准运动控制核心'},
            {'title': '减速器', 'desc': '谐波/RV减速器', 'meta': '高刚度低背隙传动'},
            {'title': '控制器', 'desc': '运动控制核心', 'meta': '实时性、开放性'},
            {'title': '高精度编码器', 'desc': '位置速度反馈', 'meta': '闭环控制核心元件'},
            {'title': '末端执行器', 'desc': '夹爪/灵巧手', 'meta': '作业执行终端部件'},
            {'title': '激光雷达', 'desc': '高精度3D感知', 'meta': '自动驾驶、导航定位'},
            {'title': '视觉传感器', 'desc': '工业相机', 'meta': '机器视觉缺陷检测'},
            {'title': '力控传感器', 'desc': '六维力觉感知', 'meta': '精密装配、人机协作'},
            {'title': 'IMU惯性测量单元', 'desc': '姿态运动感知', 'meta': '定位导航、姿态稳定'},
            {'title': '工业通信模块', 'desc': '实时总线传输', 'meta': '多部件协同控制'},
            {'title': '功能安全模块', 'desc': '碰撞检测与防护', 'meta': '人机安全合规保障'},
            {'title': '电池模组', 'desc': '高能量密度', 'meta': '移动机器人动力核心'}
        ]
    },
    'topic-locomotion': {
        'title': '行动方式种类',
        'items': [
            {'title': '轮式机器人', 'tag': '平坦路面', 'desc': '移动速度快', 'meta': '适用于室内外平坦路面，如AGV'},
            {'title': '履带式机器人', 'tag': '越野地形', 'desc': '越野能力强', 'meta': '适应复杂地形，如救援机器人'},
            {'title': '足式机器人', 'tag': '崎岖/台阶', 'desc': '仿生行走', 'meta': '四足、双足机器人，如波士顿动力'},
            {'title': '爬壁式机器人', 'tag': '垂直立面', 'desc': '壁面吸附行走', 'meta': '幕墙检测、船舶除锈、储罐探伤'},
            {'title': '轨道式机器人', 'tag': '固定轨线', 'desc': '沿轨精准移动', 'meta': '管廊巡检、变电站监测、机房运维'},
            {'title': '蠕动式机器人', 'tag': '狭小空间', 'desc': '柔性蠕动行进', 'meta': '管道内窥、肠道检测、缝隙勘探'},
            {'title': '水下推进式机器人', 'tag': '水下环境', 'desc': '螺旋桨喷泵推进', 'meta': '水下勘探、海洋科考、管道检测'},
            {'title': '仿生式机器人', 'tag': '特种环境', 'desc': '模仿生物运动', 'meta': '蛇形、鱼形、昆虫机器人'},
            {'title': '飞行式机器人', 'tag': '空中', 'desc': '空中作业', 'meta': '无人机、旋翼机器人'},
            {'title': '复合式机器人', 'tag': '多模态', 'desc': '多种方式组合', 'meta': '轮履复合、飞行爬行等'}
        ]
    },
    'topic-patents': {
        'title': '专利数量',
        'items': [
            {'title': '控制与算法', 'desc': '运动规划/SLAM/力控', 'meta': '控制学派与 AI 路线交汇'},
            {'title': '感知与导航', 'desc': '视觉/雷达/多传感融合', 'meta': '环境理解与路径生成'},
            {'title': '人机协作安全', 'desc': '安全标准与机制', 'meta': '碰撞检测/协作等级/功能安全'},
            {'title': '末端执行与触觉', 'desc': '夹持/灵巧手/触觉', 'meta': '抓取策略与触觉阵列'},
            {'title': '材料与制造工艺', 'desc': '结构/减速/电机', 'meta': '轻量化与高刚度制造'},
            {'title': '专利质量与引证', 'desc': '授权率/引证网络', 'meta': '同族规模与影响力'},
            {'title': '主要申请人布局', 'desc': '头部企业/高校', 'meta': '专利组合与研发路径'},
            {'title': '地域与同族分布', 'desc': '全球/区域差异', 'meta': '同族覆盖与市场策略'},
            {'title': '授权与维持年限', 'desc': '专利寿命与价值', 'meta': '生命周期与续费行为'},
            {'title': '热点与趋势', 'desc': '近五年增长热点', 'meta': '技术拐点与投资偏好'},
            {'title': '特种机器人', 'desc': '防爆救援等领域', 'meta': '军用与消防场景专利增长'},
            {'title': '家用机器人', 'desc': '清洁与陪伴', 'meta': '智能家居生态带动布局'},
            {'title': '教育机器人', 'desc': '编程与教具', 'meta': '软硬件一体方案专利上升'},
            {'title': '物流机器人', 'desc': 'AGV/AMR系统', 'meta': '调度算法与路径规划'},
            {'title': '医疗机器人', 'desc': '手术与康复', 'meta': '精准医疗与辅助机器人'},
            {'title': '农业机器人', 'desc': '植保与采摘', 'meta': '智慧农业与无人农场'}
        ]
    },
    'topic-labs': {
        'title': '国家级实验室',
        'items': [
            {'title': '机器人学国家重点实验室', 'desc': '中科院沈阳自动化所', 'meta': '机器人基础理论与核心应用研究'},
            {'title': '机器人技术与系统国家重点实验室', 'desc': '哈尔滨工业大学', 'meta': '空间机器人、医疗机器人技术研发'},
            {'title': '先进机器人实验室', 'desc': '清华大学', 'meta': '仿生机器人、AI智能控制技术'},
            {'title': '机器人技术与系统国家重点实验室', 'desc': '北京航空航天大学', 'meta': '机器人先进控制与系统集成'},
            {'title': '智能制造系统国家重点实验室', 'desc': '华中科技大学', 'meta': '智能制造装备与机器人系统研发'},
            {'title': '机器人与智能装备创新中心', 'desc': '上海', 'meta': '机器人核心装备与关键部件攻关'},
            {'title': '工业自动化与信息系统实验室', 'desc': '西安', 'meta': '自动化控制与工业互联网融合'},
            {'title': '信息与控制国家重点实验室', 'desc': '浙江大学', 'meta': '机器人运动控制与多传感融合'},
            {'title': '模式识别国家重点实验室', 'desc': '中科院自动化所', 'meta': '机器视觉识别与自主导航技术'},
            {'title': '智能感知与计算实验室', 'desc': '中国科学技术大学', 'meta': '多模态感知与机器人智能计算'},
            {'title': '人工智能与机器人联合实验室', 'desc': '上海人工智能实验室', 'meta': '具身智能与人机交互技术研发'},
            {'title': '机械系统与振动国家重点实验室', 'desc': '上海交通大学', 'meta': '机器人动力学、振动控制与性能优化'},
            {'title': '复杂系统智能控制与决策国家重点实验室', 'desc': '北京理工大学', 'meta': '无人系统、机器人智能决策与自主控制'},
            {'title': '机械制造系统工程国家重点实验室', 'desc': '西安交通大学', 'meta': '智能制造机器人、精密加工与装备集成'},
            {'title': '机械传动国家重点实验室', 'desc': '重庆大学', 'meta': '机器人传动系统、精密减速器核心技术研发'},
            {'title': '国家机器人创新中心', 'desc': '中科院沈阳自动化所牵头', 'meta': '机器人关键共性技术攻关与产业落地转化'}
        ]
    },
    'topic-fun-facts': {
        'title': '有趣知识',
        'items': [
            {'title': '第一个机器人', 'desc': '1921年捷克剧作家恰佩克', 'meta': '“机器人”一词首次出现于《罗素姆万能机器人》'},
            {'title': '机器人三定律', 'desc': '阿西莫夫提出', 'meta': '保护人类、服从命令、自我保存'},
            {'title': '会跳舞的机器人', 'desc': '波士顿动力Atlas', 'meta': '后空翻、跑酷，震惊世界'},
            {'title': '机器人会做梦吗', 'desc': 'AI自我学习', 'meta': '强化学习模型会“梦境训练”'},
            {'title': '仿生机器人', 'desc': '模仿动物', 'meta': '机器狗、机器鱼、机器鸟'},
            {'title': '太空机器人', 'desc': '火星车、机械臂', 'meta': '好奇号、祝融号都是机器人'},
            {'title': '医疗机器人', 'desc': '达芬奇手术系统', 'meta': '微创手术，精准操作'},
            {'title': '机器人奥运会', 'desc': 'RoboCup', 'meta': '足球机器人、救援机器人比赛'},
            {'title': '软体机器人', 'desc': '柔性材料', 'meta': '抓取易碎物品，医疗康复'},
            {'title': '情感机器人', 'desc': 'Pepper、索菲亚', 'meta': '能识别情绪，与人交流'},
            {'title': 'DARPA挑战赛', 'desc': '国际顶级机器人赛事', 'meta': '真实灾害场景下的多步任务'},
            {'title': '协作机器人起源', 'desc': '人机安全共线', 'meta': '力控与碰撞检测让机器人走出围栏'},
            {'title': '具身智能', 'desc': 'AI大模型与机器人融合', 'meta': '感知—决策—执行闭环'},
            {'title': '人形机器人破局年', 'desc': '产业走向真实场景', 'meta': '从实验室走向工厂与物流'},
            {'title': '机器人伦理', 'desc': '隐私与责任', 'meta': '如何在公共空间安全、合规地运行'},
            {'title': '世界首台工业机器人', 'desc': '1959年Unimate', 'meta': '全球首台量产工业机器人，落地通用汽车压铸车间'},
            {'title': '中国RoboCup世界冠军', 'desc': '中科大蓝鹰队', 'meta': '首支夺得机器人世界杯冠军的中国队伍'},
            {'title': '万米深海机器人', 'desc': '奋斗者号搭载作业机械臂', 'meta': '突破马里亚纳海沟万米极限，完成深海精准作业'},
            {'title': '核事故救灾机器人', 'desc': '福岛核泄漏应急机器人', 'meta': '首次大规模用特种机器人处理极端核辐射场景'},
            {'title': '书画机器人', 'desc': 'AI驱动的智能书画机械臂', 'meta': '可复刻名家笔法，完成毫米级高精度书画创作'}
        ]
    }
}

# 主题顺序（与原代码保持一致）
ROBOT_TOPIC_ORDER = [
    'topic-main-types',
    'topic-development',
    'topic-scenarios',
    'topic-domestic-stars',
    'topic-core-parts',
    'topic-locomotion',
    'topic-patents',
    'topic-labs',
    'topic-fun-facts'
]

# 发展阶段特殊图片计划（保留原逻辑）
DEVELOPMENT_IMAGE_PLAN = {
    0: [
        "1940s 控制论 实验室 控制台 自动 控制 系统",
        "1948 控制论 Norbert Wiener 书籍 实验室",
        "1954 George Devol 可编程 机械臂 专利 图纸",
        "1956 Unimation 工业 机器人 公司 早期 工厂",
        "1961 Unimate 通用 汽车 产线 工业 机器人 焊接",
        "1963 Rancho Arm 遥操作 机械臂 康复 辅助"
    ],
    1: [
        "1970s 工业 机器人 汽车 焊接 生产线",
        "1974 ABB IRB6 工业 机器人 汽车 工厂",
        "日本 工业 机器人 产线 1970s 1980s",
        "发那科 工业 机器人 喷涂 焊接 车身",
        "安川 工业 机器人 焊接 车间",
        "工业 机器人 汽车 车身 焊装 早期 产线"
    ],
    2: [
        "1990s SCARA 电子 装配 产线 机器人",
        "激光 雷达 导航 移动 机器人 仓储 1990s",
        "达芬奇 手术 机器人 手术 室",
        "iRobot Roomba 扫地 机器人 家庭 场景",
        "Kiva 仓储 机器人 电商 仓库",
        "ROS 机器人 实验室 传感器 融合"
    ],
    3: [
        "特斯拉 Optimus 人形 机器人 工厂",
        "Boston Dynamics Atlas 跑酷 动态 机器人",
        "四足 机器人 工业 巡检 现场",
        "工业 视觉 质检 机器人 深度 学习",
        "具身 智能 机器人 数字 孪生 仿真",
        "协作 机器人 AI 工厂 人机 协作 工位"
    ]
}

def is_chinese(s):
    return bool(re.search(r'[\u4e00-\u9fff]', s or ""))

def sanitize(s):
    s = re.sub(r'[\\/:*?"<>|\r\n]+', "_", str(s or ""))
    s = re.sub(r'_{2,}', "_", s)
    return s.strip("_") or "unnamed"

# ====================== 【核心修改】直接返回嵌入的数据 ======================
def read_topics():
    out = {}
    for k in ROBOT_TOPIC_ORDER:
        topic = ROBOT_TOPICS[k]
        items = []
        for item in topic.get('items', []):
            items.append({"title": item.get('title', '')})
        out[k] = items
    return out

def build_keywords(topic_key, title):
    base = []
    if topic_key == "topic-main-types":
        base = [title, "机器人 " + title]
    elif topic_key == "topic-development":
        if "萌芽期" in title or "理论探索" in title:
            base = [
                "工业机器人 萌芽期 实验室 控制论 1950s 1960s",
                "乔治 德沃尔 Unimate 早期 工业机器人",
                "控制论 伺服 实验室 早期 机器人"
            ]
        elif "产业化初期" in title or "工业应用" in title:
            base = [
                "工业机器人 1970s 1980s 汽车 焊接 喷涂 产线",
                "汽车制造 工业机器人 点焊 喷涂 生产线",
                "ABB IRB6 工业机器人 汽车 焊装"
            ]
        elif "智能化起步" in title or "传感器融合" in title:
            base = [
                "工业机器人 视觉 伺服 力控 传感器 融合 1990s",
                "SCARA 电子 装配 机器人 产线",
                "达芬奇 手术 机器人 Roomba 仓储 机器人 SLAM"
            ]
        elif "AI爆发期" in title or "自主决策" in title:
            base = [
                "AI 机器人 人形 机器人 工厂 2020s",
                "工业 机器人 AI 视觉 质检 深度 学习",
                "具身 智能 机器人 数字 孪生 工业"
            ]
        else:
            base = [title, "机器人 " + title + " 发展 阶段"]
    elif topic_key == "topic-scenarios":
        base = ["机器人 " + title, title + " 机器人"]
    elif topic_key == "topic-domestic-stars":
        base = [title + " 机器人", title + " 公司 机器人", title + " 产品 机器人"]
    elif topic_key == "topic-labs":
        base = [title, title + " 机器人", title + " 实验室 机器人"]
    elif topic_key == "topic-patents":
        base = [
            title + " 机器人 专利",
            "机器人 " + title + " 专利",
            title + " 技术 机器人 专利",
            title + " 趋势 机器人 专利",
        ]
    elif topic_key == "topic-core-parts":
        base = ["机器人 " + title, title + " 模块 机器人", title + " 应用 机器人"]
    elif topic_key == "topic-locomotion":
        base = ["机器人 " + title, title + " 场景 机器人"]
    elif topic_key == "topic-fun-facts":
        base = ["机器人 " + title, title + " 介绍 机器人"]
    else:
        base = [title, "机器人 " + title]
    seen = set()
    out = []
    for q in base:
        q = q.strip()
        if q and q not in seen:
            seen.add(q); out.append(q)
    return out

def ensure_dir(p):
    p.mkdir(parents=True, exist_ok=True)

def filter_files(files, min_w=960, min_h=540):
    kept = []
    for f in files:
        try:
            img = Image.open(f)
            if img.width >= min_w and img.height >= min_h:
                kept.append(f)
        except Exception:
            continue
    return kept

def save_jpeg(src, dest):
    try:
        img = Image.open(src)
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")
        img.save(dest, "JPEG", quality=88)
        return True
    except Exception:
        try:
            shutil.copy2(src, dest)
            return True
        except Exception:
            return False

def download_with_baidu(q, out_dir, max_num):
    try:
        from icrawler.builtin import BaiduImageCrawler
    except Exception:
        return []
    ensure_dir(out_dir)
    c = BaiduImageCrawler(storage={"root_dir": str(out_dir)}, parser_threads=1, downloader_threads=1)
    c.crawl(keyword=q, max_num=max_num)
    time.sleep(2)
    return list(out_dir.glob("*.*"))

def download_with_bing(q, out_dir, max_num):
    try:
        from icrawler.builtin import BingImageCrawler
    except Exception:
        return []
    ensure_dir(out_dir)
    c = BingImageCrawler(storage={"root_dir": str(out_dir)}, parser_threads=1, downloader_threads=1)
    c.crawl(keyword=q, max_num=max_num)
    time.sleep(2)
    return list(out_dir.glob("*.*"))

def download_one_item(topic_key, item_index, title, slots, delay):
    dest_folder = IMAGES_ROOT / "robot" / "topics" / topic_key / f"item-{item_index}"
    ensure_dir(dest_folder)
    tmp = PROJECT_ROOT / "_site_tmp" / f"{sanitize(topic_key)}_{item_index}"
    ensure_dir(tmp)
    
    # 检查是否已存在图片，避免重复爬取（可选，根据需要开启）
    # if len(list(dest_folder.glob("*.jpg"))) >= slots:
    #     print(f"  [跳过] 已存在: {dest_folder}")
    #     return

    if topic_key == "topic-development" and item_index in DEVELOPMENT_IMAGE_PLAN:
        events = DEVELOPMENT_IMAGE_PLAN[item_index][:slots]
        for i, q in enumerate(events):
            out_dir = tmp / f"dev_{item_index}_{i}"
            if is_chinese(q):
                batch = download_with_baidu(q, out_dir, max_num=6)
            else:
                batch = download_with_bing(q, out_dir, max_num=6)
            batch = filter_files(batch, 960, 540)
            if not batch:
                continue
            dest = dest_folder / f"gallery-{i}.jpg"
            save_jpeg(batch[0], dest)
            time.sleep(delay)
    else:
        keywords = build_keywords(topic_key, title)
        files = []
        for q in keywords:
            if len(files) >= slots: break
            if is_chinese(q):
                batch = download_with_baidu(q, tmp / f"baidu_{abs(hash(q))}", max_num=slots * 3)
            else:
                batch = download_with_bing(q, tmp / f"bing_{abs(hash(q))}", max_num=slots * 3)
            batch = filter_files(batch, 960, 540)
            for f in batch:
                if len(files) >= slots: break
                files.append(f)
            time.sleep(delay)
        for i in range(slots):
            dest = dest_folder / f"gallery-{i}.jpg"
            if i < len(files):
                save_jpeg(files[i], dest)
    try:
        shutil.rmtree(tmp)
    except Exception:
        pass

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--topic", help="指定单个主题，例如 topic-main-types")
    ap.add_argument("--max-items", type=int, default=999, help="每个主题最多处理多少项")
    ap.add_argument("--slots", type=int, default=6, help="每个卡片保存几张图")
    ap.add_argument("--delay", type=float, default=2.0, help="请求间隔(秒)")
    ap.add_argument("--dry-run", action="store_true", help="仅打印计划，不实际下载")
    args = ap.parse_args()
    
    topics = read_topics()
    
    if args.topic:
        topics = {args.topic: topics.get(args.topic, [])}
    
    total_items = sum(len(v) for v in topics.values())
    print(f">>> 准备开始爬取，共 {len(topics)} 个主题，预计 {total_items} 个卡片")
    
    for tk, items in topics.items():
        print(f"\n=== 处理主题: {tk} ({len(items)} 项) ===")
        for idx, item in enumerate(items[: args.max_items]):
            kws = build_keywords(tk, item["title"])
            folder = IMAGES_ROOT / "robot" / "topics" / tk / f"item-{idx}"
            
            if args.dry_run:
                print(f"  [{idx}] {folder}")
                print(f"      关键词: {', '.join(kws[:3])}")
                continue
                
            print(f"  [{idx}/{len(items)-1}] 正在爬取: {item['title']}")
            download_one_item(tk, idx, item["title"], args.slots, args.delay)

if __name__ == "__main__":
    main()