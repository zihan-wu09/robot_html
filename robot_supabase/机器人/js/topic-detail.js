(function () {
  'use strict';

  var SKIN_BY_TOPIC = {
    'topic-main-types': 'industrial',
    'topic-development': 'timeline',
    'topic-scenarios': 'scenarios',
    'topic-domestic-stars': 'brand',
    'topic-core-parts': 'circuit',
    'topic-locomotion': 'motion',
    'topic-patents': 'patent',
    'topic-labs': 'lab',
    'topic-fun-facts': 'fun'
  };

  var LABELS_BY_TOPIC = {
    'topic-main-types': ['现场', '机理', '实物', '演示', '应用', '延伸'],
    'topic-development': ['阶段', '装置', '机理', '应用', '事件', '延伸'],
    'topic-scenarios': ['现场', '流程', '装置', '部署', '效果', '延伸'],
    'topic-domestic-stars': ['现场', '产品线', '发布', '应用', '工厂', '延伸'],
    'topic-core-parts': ['构型', '机理', '参数', '应用', '系统', '延伸'],
    'topic-locomotion': ['现场', '机理', '地形', '平台', '任务', '延伸'],
    'topic-patents': ['概览', '分布', '质量', '申请人', '热点', '延伸'],
    'topic-labs': ['实验室', '方向', '装置', '项目', '团队', '延伸'],
    'topic-fun-facts': ['起源', '事件', '装置', '概念', '延伸', '拓展']
  };

  var SUMMARY_BY_TOPIC_ITEM = {
    'topic-main-types': {
      '工业机器人': '以六轴关节臂为主，具备高刚度与轨迹精度，广泛用于焊接、装配、喷涂与搬运；遵循安全标准（如ISO 10218），在产线通过示教或离线编程实现重复作业。',
      '服务机器人': '面向家用与商用场景，结合导航、语音交互与感知，完成清洁、递送、导览等任务；强调人机交互友好与对环境的自适应能力。',
      '特种机器人': '在消防、核辐射、水下等极端环境执行任务，通常采用遥操作或半自治控制，具备防爆、防水、高温耐受与冗余安全设计。',
      '协作机器人': '与人共线作业，核心在力/功率限制、碰撞检测与功能安全（如ISO/TS 15066）；适合柔性装配与小批量多变工艺。',
      '医疗机器人': '以手术机器人、康复与辅助手段为主，强调微创、稳定与可重复性；常见体系含主从遥操作、术中导航与术前规划。',
      '教育机器人': '面向编程与科创教育，模块化硬件结合图形化/文本化编程，强调动手实践与跨学科STEM融合。',
      '物流机器人': 'AGV/AMR在仓储与配送中承担搬运与拣选；核心为路径规划、调度与多机器人协同，提升仓内效率与安全。'
    },
    'topic-scenarios': {
      '智慧交通': '以自动驾驶与车路协同为代表，融合视觉/雷达感知与高精地图，实现环境理解、轨迹规划与纵横向控制；路侧设施提供信号与状态协同。',
      '智慧医疗': '涵盖手术机器人、康复与远程诊疗；通过精细操作、术中影像与力觉反馈提升安全与疗效，并满足医疗流程合规要求。',
      '智慧农业': '在播种、喷洒与采收环节采用自主平台与多传感器融合，降低人力与农药使用；常结合精准农业数据闭环优化产量。',
      '工业质检': '机器视觉检测外观缺陷与尺寸偏差，结合分拣执行端实现自动分级；部署重点在光源控制、相机标定与生产节拍匹配。',
      '家庭服务': '以清洁与看护场景为主，依赖室内地图与障碍物识别；强调低噪音、路径覆盖率与与家庭IoT的协同。',
      '安防巡检': '面向园区与特殊设施的常态巡检，结合热成像与气体传感实现异常预警；支持夜间与复杂天气下的稳定运行。'
    },
    'topic-domestic-stars': {
      '新松机器人': '覆盖工业与特种领域，产品线含多关节、SCARA与移动平台；在系统集成与行业解决方案上沉淀深厚。',
      '优必选': '聚焦人形与教育场景，提供消费级与教学平台，推进具身智能与人机交互体验。',
      '大疆创新': '从无人机延展至机器人平台，优势在视觉导航与稳定控制；面向教育与行业应用推出模块化产品。',
      '科大讯飞': '以语音与多模态AI见长，为机器人赋能自然语言理解与表达，促进人机自然交互。',
      '埃夫特': '专注工业焊接、喷涂等工艺型机器人与系统集成，推动国产替代与工艺库积累。',
      '哈工大机器人': '产学研结合，面向空间与医疗等前沿方向，强调关键技术突破与工程化能力。',
      '猎户星空': '在商用服务机器人落地广泛，包含接待与配送，侧重场景适配与稳定运营。',
      '宇树科技': '以四足与人形平台著称，关注高机动与通用性，探索真实场景的具身智能。',
      '蔚蓝智能': '面向农业巡检与复杂地形作业，提升平台耐候性与自主导航能力。',
      '极智嘉': '仓储AMR与调度系统方案商，强调系统级协同与柔性扩展。',
      '普渡科技': '专注餐饮与商用配送机器人，聚焦室内场景导航与稳定服务体验。',
      '节卡机器人': '协作机器人品牌，强调安全、人机共线与易用性部署。',
      '遨博智能': '协作方案落地于装配与检测场景，提升工位柔性与友好操作。',
      '新时达': '在运动控制与机器人系统方面布局完整链条，融合驱控一体化。'
    },
    'topic-core-parts': {
      '伺服电机': '提供高动态与高精度的闭环驱动，是关节与直线轴的核心动力源；与编码器与驱动器协同实现精准控制。',
      '减速器': '常用谐波与RV结构，特点是高刚度、低背隙与高承载，决定机械臂的定位精度与稳定性。',
      '控制器': '负责运动规划、插补与实时总线管理，开放性与实时性是评价核心；与安全功能协同保障系统可靠。',
      '激光雷达': '通过TOF或频率调制获取距离与形状，形成环境点云；在导航与避障中提供关键几何信息。',
      '视觉传感器': '工业相机与镜头配合光源构建成像链；经由算法完成检测、识别与定位任务。',
      '力控传感器': '六维力觉用于装配与打磨等工艺，结合控制实现恒力与自适应接触。',
      '电池模组': '为移动平台提供高能量密度与安全管理，涉及热管理、BMS与循环寿命。'
    },
    'topic-locomotion': {
      '轮式机器人': '适用于平坦地形，结构简单、效率高；常见于AGV/AMR与室内巡检平台。',
      '履带式机器人': '抓地与越障能力强，适合复杂户外与灾害救援；转向多采用差速与摆动结构。',
      '足式机器人': '通过步态规划适应崎岖地形，仿生四足与双足可在台阶与障碍场景行走；对控制与感知要求较高。',
      '仿生式机器人': '模仿动物形态与运动机理，如蛇形、鱼形与昆虫平台；拓展特种环境的机动性。',
      '飞行式机器人': '以无人机为主，完成空中测绘、巡检与运输；核心在姿态控制与航迹规划。',
      '复合式机器人': '组合轮/履/足/飞等多模态，提高适应性与任务覆盖，适合复杂任务需求。'
    },
    'topic-patents': {
      '控制与算法': '涵盖轨迹规划、SLAM、力控与自适应控制等方向；与AI融合推动自主决策能力。',
      '感知与导航': '涉及视觉、雷达与多传感融合，目标检测与定位是核心；用于环境建图与路径生成。',
      '人机协作安全': '围绕安全等级、碰撞检测与功能安全展开，规范协作场景的风险控制。',
      '末端执行与触觉': '关注夹持构型、灵巧手与触觉阵列，提升抓取稳定性与多样化操作。',
      '材料与制造工艺': '围绕轻量高强结构、减速与电机制造工艺优化，支撑精度与可靠性提升。',
      '专利质量与引证': '从授权率、引证网络与同族规模评价专利影响力与技术路线成熟度。',
      '主要申请人布局': '分析企业与高校的专利组合与研发路径，反映产业竞争与合作格局。',
      '地域与同族分布': '比较各区域与同族覆盖策略，体现市场化落地与全球化运营差异。',
      '授权与维持年限': '关注生命周期与维持费用，结合续费行为评估专利价值与策略。',
      '热点与趋势': '近五年的技术增长热点，观察资本与技术拐点，识别新赛道。',
      '特种机器人': '面向极端场景的技术布局，强调防护与遥操作能力，专利聚焦可靠性与任务适配。',
      '家用机器人': '围绕清洁与看护场景的专利，突出导航、交互与家居生态协同。',
      '教育机器人': '软硬件教具与课程体系相关专利，支持图形化编程与模块化扩展。',
      '物流机器人': '调度与路径规划是核心专利方向，关注与仓储管理系统的协同。'
    },
    'topic-labs': {
      '机器人学国家重点实验室': '聚焦机器人基础理论与关键技术，承担国家级项目与工程化示范，推动学术与产业结合。',
      '智能机器人实验室': '覆盖空间与医疗机器人等方向，强调复杂环境下的可靠控制与精密操作。',
      '先进机器人实验室': '在仿生与AI控制等方面布局，探索具身智能与新型构型。',
      '机器人技术与系统国家重点实验室': '研究机器人控制、系统集成与应用技术，推进标准化与工程落地。',
      '智能制造系统国家重点实验室': '面向智能制造与装备技术，融合感知、控制与信息系统。',
      '机器人与智能装备创新中心': '以装备与关键部件为抓手，推进产业链协同与集成应用。',
      '工业自动化与信息系统实验室': '关注自动化控制与工业互联网融合，提升生产系统的智能化水平。',
      '信息与控制国家重点实验室': '在运动控制与感知融合方面积累深厚，开展高性能控制研究。',
      '模式识别国家重点实验室': '机器视觉与模式识别研究基地，支撑导航与检测等应用。',
      '智能感知与计算实验室': '多模态感知与机器人计算方向，探索跨模态信息融合。',
      '人工智能与机器人联合实验室': '推进具身智能、人机交互与开放平台，连接科研与产业生态。'
    },
    'topic-fun-facts': {
      '第一个机器人': '“Robot”一词源于捷克剧作家恰佩克在1921年的戏剧《罗素姆万能机器人》，含义为“强制劳动”。',
      '机器人三定律': '阿西莫夫提出三定律：机器人不得伤害人类；必须服从人类命令；在不违背前两条的前提下保护自身。',
      '会跳舞的机器人': '波士顿动力的Atlas完成跑酷与舞蹈演示，展示动态平衡、轨迹优化与整机协同能力。',
      '机器人会做梦吗': '强化学习中常用“梦境”或虚拟回放训练，提高样本效率与泛化能力。',
      '仿生机器人': '模仿动物结构与运动机理，如机器狗、鱼与鸟；用于复杂地形与特种任务。',
      '太空机器人': '火星车与空间机械臂执行探测与维护任务，需要高可靠与在轨长寿命设计。',
      '医疗机器人': '达芬奇系统通过主从遥操作与器械末端化实现微创手术的精细操作。',
      '机器人奥运会': 'RoboCup倡导以足球等任务推动机器人研究，涉及感知、协作与策略。',
      '软体机器人': '采用柔性材料与气动/液压驱动，适合抓取易碎物品与贴合人体康复。',
      '情感机器人': 'Pepper与人形机器人可识别情绪并进行互动，探索社会化场景应用。',
      'DARPA挑战赛': '面向灾害场景的复杂任务竞赛，检验机器人在真实环境下的综合能力。',
      '协作机器人起源': '通过力控与碰撞检测实现人机共线，提升安全与柔性制造能力。',
      '具身智能': 'AI与机器人结合，以感知—决策—执行闭环学习提升在真实世界的能力。',
      '人形机器人破局年': '近年人形平台加速走向工厂与物流场景，验证大规模应用可行性。',
      '机器人伦理': '关注隐私、安全与责任边界，规范机器人在公共空间的使用。'
    }
  };

  function hintByTopic(topicKey) {
    switch (topicKey) {
      case 'topic-main-types':
        return '聚焦类别特征、典型平台与应用示例。';
      case 'topic-scenarios':
        return '结合部署流程、设备与效果展示。';
      case 'topic-domestic-stars':
        return '呈现产品线、发布与落地场景。';
      case 'topic-core-parts':
        return '强调构型、机理、关键参数与应用。';
      case 'topic-locomotion':
        return '关注平台、地形适应与任务演示。';
      case 'topic-patents':
        return '概览分布、质量、主要申请人与热点趋势。';
      case 'topic-labs':
        return '展示研究方向、装置与代表项目。';
      case 'topic-fun-facts':
        return '选取起源、事件与概念的轻知识。';
      default:
        return '配合图文卡片理解要点与应用。';
    }
  }

  function escapeHtml(s) {
    if (s == null) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function pic(seed, w, h) {
    w = w || 960;
    h = h || 540;
    return 'https://picsum.photos/seed/' + encodeURIComponent(String(seed)) + '/' + w + '/' + h;
  }

  function defaultGallery(topicKey, idx, item) {
    var t = item.title;
    var base = topicKey + '-d-' + idx;
    return [
      {
        src: pic(base + '-1'),
        caption: t + ' · 场景',
        sub: (item.desc || '').trim()
      },
      {
        src: pic(base + '-2', 880, 1100),
        caption: t + ' · 要点',
        sub: (item.meta || '').trim()
      },
      {
        src: pic(base + '-3'),
        caption: t + ' · 延伸',
        sub: '更多资料可查阅产品与案例。'
      }
    ];
  }

  function applyLocalTopicGalleryPaths(topicKey, itemIndex, detailRow, gallery) {
    if (!gallery || !gallery.length) return gallery;
    if (detailRow && detailRow.useLocalTopicImages === false) return gallery;
    if (typeof window === 'undefined' || window.TOPIC_SITE_USE_LOCAL_IMAGES === false) {
      return gallery;
    }
    if (typeof window.getTopicSiteGalleryPath !== 'function') return gallery;
    var slots = typeof window.TOPIC_SITE_GALLERY_SLOTS === 'number' ? window.TOPIC_SITE_GALLERY_SLOTS : gallery.length;
    var base = gallery.slice();
    var out = [];

    if (topicKey === 'topic-development') {
      var count = Math.min(slots, base.length);
      for (var di = 0; di < count; di++) {
        var b = base[di] || {};
        out.push({
          src: window.getTopicSiteGalleryPath(topicKey, itemIndex, di),
          caption: b.caption || '',
          sub: b.sub || ''
        });
      }
      return out;
    }

    var titleSeed = String((base[0] && base[0].caption) || '').split(' · ')[0] || '';
    var labels = (LABELS_BY_TOPIC[topicKey] || ['现场', '机理', '装置', '应用', '演示', '延伸']).slice();
    while (labels.length < slots) labels.push('延伸');
    var fallbackSubs = ['现场示意', '关键机理', '现场装置', '典型应用', '发布与演示', '延伸资料'];
    var subs = [];
    for (var si = 0; si < slots; si++) {
      subs.push(fallbackSubs[si % fallbackSubs.length]);
    }
    for (var i = 0; i < slots; i++) {
      out.push({
        src: window.getTopicSiteGalleryPath(topicKey, itemIndex, i),
        caption: (titleSeed || (base[i % base.length] && base[i % base.length].caption) || '').split(' · ')[0] + ' · ' + labels[i],
        sub: subs[i]
      });
    }
    return out;
  }

  function defaultSummary(topicKey, item) {
    return (
      '<p>' +
      escapeHtml(item.meta) +
      '</p><p>' +
      escapeHtml(item.desc) +
      '。' +
      escapeHtml(hintByTopic(topicKey)) +
      '</p>'
    );
  }

  function buildHighlights(detailRow, item) {
    var lines = [];
    if (detailRow.highlights && detailRow.highlights.length) {
      lines = detailRow.highlights.slice();
    } else {
      if (item.meta) lines.push(item.meta);
      if (item.desc && lines.indexOf(item.desc) < 0) lines.push(item.desc);
      if (lines.length < 2) {
        lines.push('可结合图文延展区的示意配图，建立对「' + item.title + '」的直观印象。');
      }
      lines = lines.slice(0, 3);
    }
    return (
      '<div class="detail-highlights-wrap"><h2 class="detail-highlights-title">要点</h2><ul class="detail-highlights">' +
      lines
        .map(function (line) {
          return '<li>' + escapeHtml(String(line)) + '</li>';
        })
        .join('') +
      '</ul></div>'
    );
  }

  function stripBoilerplate(s) {
    var t = String(s || '');
    var patterns = [
      /趣闻类内容重在激发好奇[^。]*。?/g,
      /延伸阅读建议(结合|参考)[^。]*。?/g,
      /阅读时可(联想|将|结合)[^。]*。?/g,
      /(下文|下面|以下)[^。]*(图片|配图|图片块)[^。]*。?/g,
      /版式采用[^。]*。?/g,
      /正式(展出|宣发)可(替换|采用)[^。]*。?/g,
      /这里暂用[^。]*。?/g,
      /占位影像[^。]*。?/g,
      /建议(逐步)?替换[^。]*。?/g
    ];
    patterns.forEach(function (re) {
      t = t.replace(re, '');
    });
    return t.trim();
  }

  function formatSummary(detailRow, item, topicKey) {
    if (detailRow.summaryHtml) return detailRow.summaryHtml;
    if (detailRow.summary) {
      if (Object.prototype.toString.call(detailRow.summary) === '[object Array]') {
        return detailRow.summary
          .map(function (p) {
            return '<p>' + escapeHtml(stripBoilerplate(String(p).trim())) + '</p>';
          })
          .join('');
      }
      return detailRow.summary
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map(function (p) {
          return '<p>' + escapeHtml(stripBoilerplate(p.trim())) + '</p>';
        })
        .join('');
    }
    var dict = SUMMARY_BY_TOPIC_ITEM[topicKey] || {};
    var text = dict[item.title] || '';
    if (text) {
      return '<p>' + escapeHtml(text) + '</p>';
    }
    return defaultSummary(topicKey, item);
  }

  function parseQuery() {
    var p = new URLSearchParams(window.location.search);
    var topic = p.get('topic') || '';
    var itemRaw = p.get('item');
    if (!topic || itemRaw === null || itemRaw === '') return { topic: topic, index: -1 };

    var n = parseInt(itemRaw, 10);
    if (!isNaN(n) && String(n) === String(itemRaw).trim()) {
      return { topic: topic, index: n };
    }

    var topics = window.ROBOT_TOPICS;
    if (!topics || !topics[topic]) return { topic: topic, index: -1 };
    var items = topics[topic].items || [];
    var decoded = itemRaw;
    try {
      decoded = decodeURIComponent(itemRaw);
    } catch (e) {}
    for (var i = 0; i < items.length; i++) {
      if (items[i].title === decoded) return { topic: topic, index: i };
    }
    return { topic: topic, index: -1 };
  }

  function resolveLayout(topicKey, detail) {
    if (detail && detail.layout) return detail.layout;
    if (topicKey === 'topic-development') return 'timeline';
    return 'carousel';
  }

  function renderGallery(gallery, layout) {
    if (layout === 'timeline') {
      var html =
        '<ul class="detail-timeline" role="list">' +
        gallery
          .map(function (g, i) {
            var flip = i % 2 === 1 ? ' detail-timeline-item--flip' : '';
            return (
              '<li class="detail-timeline-item' +
              flip +
              '">' +
              '<div class="detail-timeline-copy"><strong>' +
              escapeHtml(g.caption) +
              '</strong><p>' +
              escapeHtml(String(g.sub || '').replace(/占位影像；可替换为自有素材或授权图库。?/g, '').replace(/示意图来自占位图库，后续可替换为官方实拍、示意图或授权素材。?/g, '').replace(/下文配图为示意延展，便于快速建立印象；正式宣发请替换为自有或已获授权的图片素材。?/g, '')) +
              '</p></div>' +
              '<figure class="detail-gallery-card detail-gallery-card--visual">' +
              '<div class="detail-gallery-media"><img src="' +
              escapeHtml(g.src) +
              '" alt="' +
              escapeHtml(g.caption) +
              '" loading="lazy" decoding="async" /></div></figure></li>'
            );
          })
          .join('') +
        '</ul>';
      return html;
    }

    if (layout === 'carousel') {
      var cards = gallery
        .map(function (g) {
          return (
            '<figure class="detail-carousel-card detail-gallery-card">' +
            '<div class="detail-gallery-media"><img src="' +
            escapeHtml(g.src) +
            '" alt="' +
            escapeHtml(g.caption) +
            '" loading="lazy" decoding="async" width="960" height="540" /></div>' +
            '<figcaption class="detail-gallery-cap"><strong>' +
            escapeHtml(g.caption) +
            '</strong><span>' +
            escapeHtml(String(g.sub || '').replace(/占位影像；可替换为自有素材或授权图库。?/g, '').replace(/示意图来自占位图库，后续可替换为官方实拍、示意图或授权素材。?/g, '').replace(/下文配图为示意延展，便于快速建立印象；正式宣发请替换为自有或已获授权的图片素材。?/g, '')) +
            '</span></figcaption></figure>'
          );
        })
        .join('');
      return (
        '<div class="detail-carousel" data-detail-carousel="">' +
        '<div class="detail-carousel-toolbar">' +
        '<span class="detail-carousel-hint" id="detail-carousel-hint">左右滑动或使用按钮浏览延展配图</span>' +
        '<div class="detail-carousel-actions">' +
        '<button type="button" class="detail-carousel-btn detail-carousel-prev" aria-controls="detail-carousel-track" aria-describedby="detail-carousel-hint" aria-label="延展配图向左滑动">' +
        '<i class="fas fa-chevron-left" aria-hidden="true"></i></button>' +
        '<button type="button" class="detail-carousel-btn detail-carousel-next" aria-controls="detail-carousel-track" aria-describedby="detail-carousel-hint" aria-label="延展配图向右滑动">' +
        '<i class="fas fa-chevron-right" aria-hidden="true"></i></button>' +
        '</div></div>' +
        '<div class="detail-carousel-wrapper">' +
        '<div class="detail-carousel-track" id="detail-carousel-track" role="region" aria-label="延展配图">' +
        cards +
        '</div></div></div>'
      );
    }

    var cls = 'detail-gallery layout-bento';
    return (
      '<div class="' +
      cls +
      '">' +
      gallery
        .map(function (g) {
          return (
            '<figure class="detail-gallery-card"><div class="detail-gallery-media"><img src="' +
            escapeHtml(g.src) +
            '" alt="' +
            escapeHtml(g.caption) +
            '" loading="lazy" width="960" height="540" /></div>' +
            '<figcaption class="detail-gallery-cap"><strong>' +
            escapeHtml(g.caption) +
            '</strong><span>' +
            escapeHtml(String(g.sub || '').replace(/占位影像；可替换为自有素材或授权图库。?/g, '').replace(/示意图来自占位图库，后续可替换为官方实拍、示意图或授权素材。?/g, '').replace(/下文配图为示意延展，便于快速建立印象；正式宣发请替换为自有或已获授权的图片素材。?/g, '')) +
            '</span></figcaption></figure>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function bindDetailCarousel(root) {
    var track = root.querySelector('.detail-carousel-track');
    if (!track) return;

    function stepSize() {
      var c = track.querySelector('.detail-carousel-card');
      if (!c) return 336;
      var st = window.getComputedStyle(track);
      var gapStr = st.columnGap || st.gap || '20px';
      var gap = parseFloat(gapStr) || 20;
      return Math.round(c.getBoundingClientRect().width + gap);
    }

    function smoothBehavior() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    }

    root.addEventListener('click', function (e) {
      var prev = e.target.closest('.detail-carousel-prev');
      var next = e.target.closest('.detail-carousel-next');
      if (!prev && !next) return;
      e.preventDefault();
      var step = stepSize();
      track.scrollBy({ left: next ? step : -step, behavior: smoothBehavior() });
    });
  }

  // ========== 动态生成百度搜索链接 ==========
  function buildDynamicReadMore(topicTitle, itemTitle) {
    var searchTerm = '机器人 ' + topicTitle + ' ' + itemTitle;
    var searchUrl = 'https://www.baidu.com/s?wd=' + encodeURIComponent(searchTerm);
    return '<p class="detail-read-more-wrap"><a class="detail-read-more" href="' + searchUrl + '" target="_blank" rel="noopener noreferrer">🔍 百度搜索：“' + escapeHtml(searchTerm) + '”</a></p>';
  }

  function init() {
    var q = parseQuery();
    var topicKey = q.topic;
    var index = q.index;
    var topics = window.ROBOT_TOPICS;
    var extra = window.ROBOT_ITEM_DETAILS || {};

    document.body.setAttribute('data-detail-skin', SKIN_BY_TOPIC[topicKey] || 'industrial');

    if (!topics || !topics[topicKey] || index < 0 || index >= (topics[topicKey].items || []).length) {
      var main = document.getElementById('detail-root');
      if (main) {
        main.innerHTML =
          '<div class="detail-error"><p>未找到对应条目，请从主题列表进入。</p><a class="detail-back" href="机器人.html">返回九大主题</a></div>';
      }
      document.title = '未找到 - 科普智枢';
      return;
    }

    var topic = topics[topicKey];
    var item = topic.items[index];
    var detailRow = extra[topicKey] && extra[topicKey][index] ? extra[topicKey][index] : {};
    var summaryHtml = formatSummary(detailRow, item, topicKey);
    var highlightsHtml = buildHighlights(detailRow, item);
    // 动态扩展阅读链接（百度搜索，基于主题和条目名称）
    var readMoreHtml = buildDynamicReadMore(topic.title, item.title);

    var galleryRaw =
      detailRow.gallery && detailRow.gallery.length ? detailRow.gallery : defaultGallery(topicKey, index, item);
    var gallery = applyLocalTopicGalleryPaths(topicKey, index, detailRow, galleryRaw);
    var layout = resolveLayout(topicKey, detailRow);
    var heroImage = null;
    if (gallery && gallery.length) {
      var heroIndex = Math.floor(Math.random() * gallery.length);
      heroImage = gallery[heroIndex];
    }

    document.title = item.title + ' · ' + topic.title + ' - 科普智枢';

    var backHref = topicKey ? (window.ROBOT_TOPIC_KEY_TO_FILE && window.ROBOT_TOPIC_KEY_TO_FILE[topicKey]) || '' : '';
    if (!backHref) backHref = '机器人.html';
    var backLabel = '返回「' + topic.title + '」';

    var icon = topic.icon || 'fa-cube';

    var mainEl = document.getElementById('detail-root');
    if (!mainEl) return;

    mainEl.innerHTML =
      '<a class="detail-back" href="' +
      escapeHtml(backHref) +
      '#item-' +
      index +
      '"><i class="fas fa-arrow-left" aria-hidden="true"></i> ' +
      escapeHtml(backLabel) +
      '</a>' +
      '<section class="detail-hero" role="banner">' +
      '<div class="detail-hero-inner">' +
      '<div class="detail-hero-copy">' +
      '<div class="detail-kicker"><i class="fas ' +
      escapeHtml(icon) +
      '" aria-hidden="true"></i> ' +
      escapeHtml(topic.title) +
      '</div>' +
      '<h1>' +
      escapeHtml(item.title) +
      '</h1>' +
      '<div class="detail-summary">' +
      summaryHtml +
      '</div>' +
      highlightsHtml +
      readMoreHtml +
      '</div>' +
      (heroImage && heroImage.src
        ? '<figure class="detail-hero-visual"><div class="detail-hero-media"><img src="' +
          escapeHtml(heroImage.src) +
          '" alt="' +
          escapeHtml(heroImage.caption || item.title) +
          '" loading="lazy" decoding="async" /></div></figure>'
        : '') +
      '</div>' +
      '</section>' +
      '<section class="detail-extend" aria-labelledby="detail-extend-title">' +
      '<h2 id="detail-extend-title" class="detail-section-title">图文延展</h2>' +
      renderGallery(gallery, layout) +
      '</section>';

    bindDetailCarousel(mainEl);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
