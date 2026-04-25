(function () {
  'use strict';

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function getTopicKey() {
    var body = document.body;
    return body.getAttribute('data-topic') || '';
  }

  function getTopicLayout() {
    return document.body.getAttribute('data-topic-layout') || '';
  }

  function isFromTuisong() {
    var p = new URLSearchParams(window.location.search);
    return p.get('from') === 'tuisong';
  }

  function appendFromTuisong(url) {
    if (!isFromTuisong()) return url;
    var joiner = url.indexOf('?') === -1 ? '?' : '&';
    return url + joiner + 'from=tuisong';
  }

  function buildBackToTuisongLink() {
    if (!isFromTuisong()) return '';
    return (
      '<a class="topic-return-link" href="../tuisong/tuisong.html">' +
      '<i class="fas fa-arrow-left" aria-hidden="true"></i> 返回为你推荐</a>'
    );
  }

  function twoDigits(n) {
    var s = String(n);
    return s.length < 2 ? '0' + s : s;
  }

  function buildTopicHero(topic, icon) {
    // icon 参数仍保留，但 Hero 区域的小图标可以继续用 FontAwesome（或者也可换成图片，看您需要）
    return (
      '<section class="topic-hero"><div class="topic-hero-inner">' +
      '<div class="topic-hero-badge"><i class="fas ' +
      escapeHtml(icon) +
      '" aria-hidden="true"></i> ' +
      escapeHtml(topic.shortLabel || topic.title) +
      '</div>' +
      '<h1>' +
      escapeHtml(topic.title) +
      '</h1>' +
      '<p>' +
      escapeHtml(topic.intro) +
      '</p></div></section>'
    );
  }

  function wrapToc(tocItems) {
    return (
      '<details class="topic-toc-disclosure">' +
      '<summary class="topic-toc-summary"><span>本页目录</span></summary>' +
      '<nav class="topic-toc" aria-label="本页目录">' +
      '<h2 class="topic-toc-heading">目录</h2><ul>' +
      tocItems +
      '</ul></nav></details>'
    );
  }

  function syncTocDisclosure() {
    var d = document.querySelector('.topic-toc-disclosure');
    if (!d) return;
    d.open = window.matchMedia('(min-width: 901px)').matches;
  }

  function onTocResize() {
    syncTocDisclosure();
  }

  function renderRiverSection(topicKey, topic, icon, items, navHtml) {
    var nodes = items
      .map(function (item, idx) {
        // ========== 第1处修改：适配你的目录结构，补全路径 ==========
        var detailHref =
          '../公共渲染页面/公共卡片页面/detail.html?topic=' +
          encodeURIComponent(topicKey) +
          '&item=' +
          idx;
        detailHref = appendFromTuisong(detailHref);
        return (
          '<a role="listitem" id="item-' +
          idx +
          '" class="topic-river-node" href="' +
          detailHref +
          '" aria-label="进入阶段：' +
          escapeHtml(item.title) +
          '">' +
          '<span class="topic-river-node-index">' +
          twoDigits(idx + 1) +
          '</span>' +
          '<span class="topic-river-node-time">' +
          escapeHtml(item.desc) +
          '</span>' +
          '<strong class="topic-river-node-title">' +
          escapeHtml(item.title) +
          '</strong>' +
          '<p class="topic-river-node-meta">' +
          escapeHtml(item.meta) +
          '</p>' +
          '<span class="topic-river-node-cta">进入图文详解 <i class="fas fa-arrow-right" aria-hidden="true"></i></span>' +
          '</a>'
        );
      })
      .join('');

    return (
      buildBackToTuisongLink() +
      '<section class="topic-hero"><div class="topic-hero-inner">' +
      '<div class="topic-hero-badge"><i class="fas ' +
      escapeHtml(icon) +
      '" aria-hidden="true"></i> ' +
      escapeHtml(topic.shortLabel || topic.title) +
      '</div>' +
      '<h1>' +
      escapeHtml(topic.title) +
      '</h1>' +
      '<p>' +
      escapeHtml(topic.intro) +
      '</p></div></section>' +
      '<div class="topic-river-wrap">' +
      '<p class="topic-river-hint">沿时间长河依次浏览，点击任一阶段进入图文详解</p>' +
      '<div class="topic-river-flow">' +
      '<div class="topic-river-branch topic-river-branch--a" aria-hidden="true"></div>' +
      '<div class="topic-river-branch topic-river-branch--b" aria-hidden="true"></div>' +
      '<div class="topic-river-track" role="list">' +
      nodes +
      '</div></div></div>' +
      navHtml
    );
  }

  function findItemIndexByTitle(items, title) {
    if (!title) return -1;
    var decoded = title;
    try {
      decoded = decodeURIComponent(title);
    } catch (e) {}
    for (var i = 0; i < items.length; i++) {
      if (items[i].title === decoded) return i;
    }
    return -1;
  }

  function parseItemQuery() {
    var p = new URLSearchParams(window.location.search);
    var raw = p.get('item');
    if (raw === null || raw === '') return -1;
    var n = parseInt(raw, 10);
    if (!isNaN(n) && String(n) === raw.trim()) return n;
    return raw;
  }

  // ===== 卡片图标换成自定义图片 =====
  function getCardImage(topicKey, item, idx) {
  // 如果条目本身有 img，优先用
  if (item.img) return item.img;
  // 否则自动使用本地对应 item 的第一张 gallery 图片
  return '../images/robot/topics/' + topicKey + '/item-' + idx + '/gallery-0.jpg';
}

  function buildDefaultCard(topicKey, item, idx, topic) {
    // ========== 第2处修改：适配你的目录结构，补全路径 ==========
    var detailHref =
      '../公共渲染页面/公共卡片页面/detail.html?topic=' +
      encodeURIComponent(topicKey) +
      '&item=' +
      idx;
    detailHref = appendFromTuisong(detailHref);

    var cardClass = 'topic-card';
    if (topicKey === 'topic-domestic-stars') cardClass += ' topic-card--editorial';
    if (topicKey === 'topic-core-parts') cardClass += ' topic-card--spec';
    if (topicKey === 'topic-locomotion') cardClass += ' topic-card--mobility';
    if (topicKey === 'topic-patents') cardClass += ' topic-card--patent';
    if (topicKey === 'topic-labs') cardClass += ' topic-card--lab';
    if (topicKey === 'topic-fun-facts' && idx === 0) cardClass += ' topic-card--pull';

    var titleBlock = '<h3>' + escapeHtml(item.title) + '</h3>';

    var innerMain = '';
    if (topicKey === 'topic-fun-facts' && idx === 0) {
      innerMain =
        '<blockquote class="pull-quote">' +
        '<h3>' + escapeHtml(item.title) + '</h3>' +
        '<p class="topic-desc">' + escapeHtml(item.desc) + '</p>' +
        '<p class="topic-meta">' + escapeHtml(item.meta) + '</p></blockquote>';
    } else {
      innerMain =
        titleBlock +
        '<p class="topic-desc">' + escapeHtml(item.desc) + '</p>' +
        '<p class="topic-meta">' + escapeHtml(item.meta) + '</p>';
    }

    // 获取图片路径
    var imgSrc = getCardImage(topicKey, item, idx);

    return (
      '<article class="' + cardClass + '" id="item-' + idx + '" data-item-index="' + idx + '">' +
      '<a class="topic-card-link" href="' + detailHref + '" aria-label="查看图文详情：' + escapeHtml(item.title) + '">' +
      '<div class="topic-card-visual" aria-hidden="true">' +
      '<img src="' + escapeHtml(imgSrc) + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius: 18px;" loading="lazy">' +
      '</div>' +
      '<div class="topic-card-body">' +
      innerMain +
      '<span class="topic-card-more">图文详解 <i class="fas fa-arrow-right" aria-hidden="true"></i></span>' +
      '</div></a></article>'
    );
  }

  function render(topicKey) {
    var topics = typeof window !== 'undefined' ? window.ROBOT_TOPICS : null;
    var order = typeof window !== 'undefined' ? window.ROBOT_TOPIC_ORDER : [];
    var keyToFile = typeof window !== 'undefined' ? window.ROBOT_TOPIC_KEY_TO_FILE : {};

    if (!topics || !topics[topicKey]) {
      console.warn('未知主题:', topicKey);
      return;
    }

    var topic = topics[topicKey];
    var icon = topic.icon || 'fa-cube';   // 仍可用于 Hero 小图标
    var items = topic.items || [];

    document.title = topic.title + ' - 科普智枢';

    var tocItems = items
      .map(function (item, idx) {
        return (
          '<li><a href="#item-' +
          idx +
          '"><span class="topic-toc-num">' +
          (idx + 1) +
          '</span>' +
          escapeHtml(item.title) +
          '</a></li>'
        );
      })
      .join('');

    var ix = order.indexOf(topicKey);
    var prevKey = ix > 0 ? order[ix - 1] : null;
    var nextKey = ix >= 0 && ix < order.length - 1 ? order[ix + 1] : null;
    var prevFile = prevKey ? appendFromTuisong(keyToFile[prevKey]) : null;
    var nextFile = nextKey ? appendFromTuisong(keyToFile[nextKey]) : null;
    var prevTitle = prevKey && topics[prevKey] ? topics[prevKey].title : '';
    var nextTitle = nextKey && topics[nextKey] ? topics[nextKey].title : '';

    var navHtml = '<nav class="topic-nav-footer" aria-label="主题切换">';
    navHtml += '<div class="topic-nav-side">';
    if (prevFile) {
      navHtml +=
        '<a class="topic-nav-prev" href="' +
        escapeHtml(prevFile) +
        '"><i class="fas fa-chevron-left" aria-hidden="true"></i> ' +
        escapeHtml(prevTitle) +
        '</a>';
    }
    navHtml += '</div>';
    navHtml +=
      '<a class="topic-hub-link" href="' + appendFromTuisong('../机器人九大主题/机器人九大主题.html') + '"><i class="fas fa-th-large" aria-hidden="true"></i> 九大主题总览</a>';
    navHtml += '<div class="topic-nav-side topic-nav-side--end">';
    if (nextFile) {
      navHtml +=
        '<a class="topic-nav-next" href="' +
        escapeHtml(nextFile) +
        '">' +
        escapeHtml(nextTitle) +
        ' <i class="fas fa-chevron-right" aria-hidden="true"></i></a>';
    }
    navHtml += '</div></nav>';

    var main = document.getElementById('topic-root');
    if (!main) return;

    if (getTopicLayout() === 'river' && topicKey === 'topic-development') {
      main.innerHTML = renderRiverSection(topicKey, topic, icon, items, navHtml);
      return;
    }

    var hero = buildBackToTuisongLink() + buildTopicHero(topic, icon);
    var toc = wrapToc(tocItems);
    
    var cards = items
      .map(function (item, idx) {
        return buildDefaultCard(topicKey, item, idx, topic);
      })
      .join('');

    main.innerHTML =
      hero +
      '<div class="topic-layout">' +
      toc +
      '<div class="topic-cards">' +
      cards +
      '</div></div>' +
      navHtml;

    syncTocDisclosure();
    window.addEventListener('resize', onTocResize);
  }

  function scrollToItem(topicKey) { /* 保持不变 */ }

  function init() {
    var topicKey = getTopicKey();
    if (!topicKey) return;
    render(topicKey);
    scrollToItem(topicKey);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();