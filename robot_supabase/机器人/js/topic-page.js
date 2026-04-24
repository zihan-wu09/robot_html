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

  function twoDigits(n) {
    var s = String(n);
    return s.length < 2 ? '0' + s : s;
  }

  function buildTopicHero(topic, icon) {
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
        var detailHref =
          'topic-item-detail.html?topic=' +
          encodeURIComponent(topicKey) +
          '&item=' +
          idx;
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
          '<span class="topic-river-node-cta">进入图文详情 <i class="fas fa-arrow-right" aria-hidden="true"></i></span>' +
          '</a>'
        );
      })
      .join('');

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

  function buildPatentStrip(topicKey, items) {
    var inner = items
      .map(function (item, idx) {
        var detailHref =
          'topic-item-detail.html?topic=' + encodeURIComponent(topicKey) + '&item=' + idx;
        return (
          '<a class="topic-patent-stat" id="item-' +
          idx +
          '" href="' +
          detailHref +
          '" aria-label="查看：' +
          escapeHtml(item.title) +
          '">' +
          '<span class="topic-patent-value museum-num">' +
          escapeHtml(item.meta) +
          '</span>' +
          '<span class="topic-patent-label">' +
          escapeHtml(item.title) +
          '</span>' +
          '<span class="topic-patent-hint">' +
          escapeHtml(item.desc) +
          '</span></a>'
        );
      })
      .join('');
    return '<div class="topic-patents-strip">' + inner + '</div>';
  }

  function buildLabCard(topicKey, item, idx) {
    var detailHref =
      'topic-item-detail.html?topic=' + encodeURIComponent(topicKey) + '&item=' + idx;
    return (
      '<article class="topic-card topic-card--lab" id="item-' +
      idx +
      '" data-item-index="' +
      idx +
      '">' +
      '<a class="topic-card-link topic-card-link--lab" href="' +
      detailHref +
      '" aria-label="查看图文详情：' +
      escapeHtml(item.title) +
      '">' +
      '<div class="topic-card-body">' +
      '<h3>' +
      escapeHtml(item.title) +
      '</h3>' +
      '<p class="topic-lab-affiliation">' +
      escapeHtml(item.desc) +
      '</p>' +
      '<p class="topic-lab-focus">' +
      escapeHtml(item.meta) +
      '</p>' +
      '<span class="topic-card-more">图文详解 <i class="fas fa-arrow-right" aria-hidden="true"></i></span>' +
      '</div></a></article>'
    );
  }

  function buildDefaultCard(topicKey, item, idx, icon) {
    var detailHref =
      'topic-item-detail.html?topic=' +
      encodeURIComponent(topicKey) +
      '&item=' +
      idx;
    var cardClass = 'topic-card';
    if (topicKey === 'topic-domestic-stars') cardClass += ' topic-card--editorial';
    if (topicKey === 'topic-core-parts') cardClass += ' topic-card--spec';
    if (topicKey === 'topic-locomotion') cardClass += ' topic-card--mobility';
    if (topicKey === 'topic-fun-facts' && idx === 0) cardClass += ' topic-card--pull';

    var titleBlock = '';
    if (topicKey === 'topic-main-types' && item.kindLabel) {
      titleBlock =
        '<div class="topic-card-title-row"><span class="topic-kind-badge">' +
        escapeHtml(item.kindLabel) +
        '</span><h3>' +
        escapeHtml(item.title) +
        '</h3></div>';
    } else if (topicKey === 'topic-scenarios' && item.tag) {
      titleBlock =
        '<div class="topic-card-title-row"><span class="topic-scenario-tag">' +
        escapeHtml(item.tag) +
        '</span><h3>' +
        escapeHtml(item.title) +
        '</h3></div>';
    } else if (topicKey === 'topic-locomotion' && item.tag) {
      titleBlock =
        '<div class="topic-card-title-row"><span class="topic-terrain-tag">' +
        escapeHtml(item.tag) +
        '</span><h3>' +
        escapeHtml(item.title) +
        '</h3></div>';
    } else {
      titleBlock = '<h3>' + escapeHtml(item.title) + '</h3>';
    }

    if (topicKey === 'topic-domestic-stars') {
      titleBlock = '<h3>' + escapeHtml(item.title) + '</h3>';
    }

    var innerMain = '';

    if (topicKey === 'topic-fun-facts' && idx === 0) {
      innerMain =
        '<blockquote class="pull-quote">' +
        '<h3>' +
        escapeHtml(item.title) +
        '</h3>' +
        '<p class="topic-desc">' +
        escapeHtml(item.desc) +
        '</p>' +
        '<p class="topic-meta">' +
        escapeHtml(item.meta) +
        '</p></blockquote>';
    } else if (topicKey === 'topic-domestic-stars') {
      innerMain =
        titleBlock +
        '<p class="topic-editorial-lede">' +
        escapeHtml(item.desc) +
        '</p>' +
        '<p class="topic-meta">' +
        escapeHtml(item.meta) +
        '</p>';
    } else {
      innerMain =
        titleBlock +
        '<p class="topic-desc">' +
        escapeHtml(item.desc) +
        '</p>' +
        '<p class="topic-meta">' +
        escapeHtml(item.meta) +
        '</p>';
    }

    return (
      '<article class="' +
      cardClass +
      '" id="item-' +
      idx +
      '" data-item-index="' +
      idx +
      '">' +
      '<a class="topic-card-link" href="' +
      detailHref +
      '" aria-label="查看图文详情：' +
      escapeHtml(item.title) +
      '">' +
      '<div class="topic-card-visual" aria-hidden="true"><i class="fas ' +
      escapeHtml(icon) +
      '"></i></div>' +
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
    var icon = topic.icon || 'fa-cube';
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
    var prevFile = prevKey ? keyToFile[prevKey] : null;
    var nextFile = nextKey ? keyToFile[nextKey] : null;
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
      '<a class="topic-hub-link" href="机器人.html"><i class="fas fa-th-large" aria-hidden="true"></i> 九大主题总览</a>';
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

    var hero = buildTopicHero(topic, icon);
    var toc = wrapToc(tocItems);
    var cards = '';

    if (topicKey === 'topic-patents') {
      cards = buildPatentStrip(topicKey, items);
    } else if (topicKey === 'topic-labs') {
      cards = items
        .map(function (item, idx) {
          return buildLabCard(topicKey, item, idx);
        })
        .join('');
    } else {
      cards = items
        .map(function (item, idx) {
          return buildDefaultCard(topicKey, item, idx, icon);
        })
        .join('');
    }

    var cardsWrapClass = 'topic-cards';

    main.innerHTML =
      hero +
      '<div class="topic-layout">' +
      toc +
      '<div class="' +
      cardsWrapClass +
      '">' +
      cards +
      '</div></div>' +
      navHtml;

    syncTocDisclosure();
    window.addEventListener('resize', onTocResize);
  }

  function scrollToItem(topicKey) {
    var topics = window.ROBOT_TOPICS;
    if (!topics || !topics[topicKey]) return;
    var items = topics[topicKey].items || [];
    var q = parseItemQuery();
    var idx = -1;
    if (typeof q === 'number' && q >= 0) {
      idx = q;
    } else if (typeof q === 'string') {
      idx = findItemIndexByTitle(items, q);
    }
    if (idx < 0 || idx >= items.length) return;

    setTimeout(function () {
      var el = document.getElementById('item-' + idx);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('topic-highlight');
      setTimeout(function () {
        el.classList.remove('topic-highlight');
      }, 1200);
    }, 100);
  }

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
