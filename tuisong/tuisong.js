function checkLogin() {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        alert("请先登录后使用内容推送功能");
        window.location.href = "../denglu-zhuce/denglu-zhuce.html";
        return false;
    }
    return true;
}

function updateNavigation() {
    const S = tuisongShared();
    if (S && S.updateTuisongNav) {
        S.updateTuisongNav();
        return;
    }
    const userLink = document.getElementById("user-link");
    if (!userLink) return;
    const currentUser = localStorage.getItem("currentUser");
    userLink.innerHTML = currentUser
        ? '<a href="../profile.html">个人主页</a>'
        : '<a href="../denglu-zhuce/denglu-zhuce.html">用户登录与注册</a>';
}

function getCurrentUser() {
    return localStorage.getItem("currentUser");
}

function readLsJson(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const v = JSON.parse(raw);
        return v == null ? fallback : v;
    } catch (e) {
        return fallback;
    }
}

function getUserTags() {
    const v = readLsJson("favoriteTags", []);
    return Array.isArray(v) ? v : [];
}

function getBrowseHistory() {
    const v = readLsJson("browseHistory", []);
    return Array.isArray(v) ? v : [];
}

function getSearchHistory() {
    const v = readLsJson("searchHistory", []);
    return Array.isArray(v) ? v : [];
}

function getUserAvatar() {
    const user = getCurrentUser();
    if (!user) return null;
    return localStorage.getItem(`avatar_${user}`);
}

function getUserInfo() {
    const user = getCurrentUser();
    if (!user) return {};
    const v = readLsJson(`userInfo_${user}`, {});
    return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
}

function tuisongShared() {
    return window.TUISONG_SHARED || null;
}

const PAGE_SIZE = 8;
let scoredItems = [];
let currentPageIndex = 0;
let routePageIndex = 0;

function flattenRobotItems() {
    const all = [];
    if (!window.ROBOT_TOPICS) return all;
    const S = tuisongShared();
    const defaultImg = (k, idx) =>
        S && S.resolveTopicItemImage ? S.resolveTopicItemImage(k, idx) : "../images/主页大背景.png";
    Object.keys(window.ROBOT_TOPICS).forEach((topicKey) => {
        const topic = window.ROBOT_TOPICS[topicKey];
        (topic.items || []).forEach((item, itemIdx) => {
            const rawDesc = item.desc || item.meta || topic.intro || "";
            const mainImage = item.mainImage || defaultImg(topicKey, itemIdx);
            all.push({
                name: item.title,
                description: rawDesc,
                category: topic.title,
                area: topic.title,
                topicKey,
                topicItemIndex: itemIdx,
                topicTitle: topic.title,
                mainImage,
                matchScore: 0
            });
        });
    });
    return all;
}

function calculateMatchScore(item, userTags, browseHistory, searchHistory) {
    let score = 20;
    if (userTags.some((tag) => item.category.includes(tag) || item.name.includes(tag))) {
        score += 45;
    }
    if (browseHistory.some((h) => (h.name || "").includes(item.name))) {
        score += 20;
    }
    if (searchHistory.some((h) => {
        const kw = (h.keyword || "").toLowerCase();
        return kw && (item.name.toLowerCase().includes(kw) || item.category.toLowerCase().includes(kw));
    })) {
        score += 15;
    }
    return Math.min(100, score);
}

function rebuildScores() {
    const tags = getUserTags();
    const browse = getBrowseHistory();
    const search = getSearchHistory();
    const flat = flattenRobotItems();
    scoredItems = flat
        .map((item) => ({
            ...item,
            matchScore: calculateMatchScore(item, tags, browse, search)
        }))
        .sort((a, b) => b.matchScore - a.matchScore);
}

function getRecommendationBatch() {
    if (!scoredItems.length) rebuildScores();
    if (!scoredItems.length) return [];
    const pages = Math.max(1, Math.ceil(scoredItems.length / PAGE_SIZE));
    if (currentPageIndex >= pages) currentPageIndex = 0;
    const start = currentPageIndex * PAGE_SIZE;
    const list = scoredItems.slice(start, start + PAGE_SIZE);
    if (list.length < PAGE_SIZE && scoredItems.length > list.length) {
        list.push(...scoredItems.slice(0, PAGE_SIZE - list.length));
    }
    return list;
}

function renderUserProfile() {
    const profileContainer = document.getElementById("userProfile");
    if (!profileContainer) return;

    const currentUser = getCurrentUser();
    const tags = getUserTags();
    const browse = getBrowseHistory();
    const search = getSearchHistory();
    const userInfo = getUserInfo();
    const avatar = getUserAvatar();
    const nickname = userInfo.nickname || currentUser || "游客";
    const avatarHtml = avatar
        ? `<img src="${avatar}" alt="用户头像" style="width:100%;height:100%;object-fit:cover;">`
        : '<i class="fas fa-user-circle" style="font-size:42px;color:#fff;"></i>';

    profileContainer.innerHTML = `
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #e5e7eb;">
            <div style="width:72px;height:72px;border-radius:50%;overflow:hidden;background:linear-gradient(135deg,#2a7fff,#59a4ff);display:flex;align-items:center;justify-content:center;">
                ${avatarHtml}
            </div>
            <div>
                <h2 style="margin:0 0 6px 0;">${escapeHtml(nickname)}</h2>
                <p style="margin:0;color:#4b5563;">账号：${escapeHtml(currentUser || "未登录")}</p>
            </div>
        </div>
        <div class="profile-title">你的机器人兴趣画像</div>
        <div style="margin-bottom:12px;">
            <div style="margin-bottom:8px;font-weight:600;">兴趣标签</div>
            <div class="tags-container">
                ${tags.length ? tags.map((tag) => `<span class="interest-tag">${escapeHtml(tag)}</span>`).join("") : '<span class="interest-tag">暂无标签，去个人主页添加后推荐会更精准</span>'}
            </div>
        </div>
        <div class="history-stats">
            <div class="stat-item"><div class="stat-label">浏览记录</div><div class="stat-value">${browse.length}</div></div>
            <div class="stat-item"><div class="stat-label">搜索记录</div><div class="stat-value">${search.length}</div></div>
            <div class="stat-item"><div class="stat-label">兴趣标签</div><div class="stat-value">${tags.length}</div></div>
        </div>
    `;
}

function renderRecommendationsWithList(list) {
    const container = document.getElementById("recommendationsList");
    if (!container) return;
    const S = tuisongShared();
    const summaryOf = (d) => (S && S.getDescriptionSummary ? S.getDescriptionSummary(d) : (d || "").slice(0, 80));
    const areaOf = (a) => (S && S.getCityDisplay ? S.getCityDisplay(a) : a || "机器人科普");
    const thumb = (topicKey, itemIdx) => (S && S.htmlTopicThumbnailImg ? S.htmlTopicThumbnailImg(topicKey, itemIdx) : "");

    if (!list.length) {
        container.innerHTML =
            '<div class="empty-state"><i class="fas fa-heart-broken"></i><h3>暂无推荐内容</h3><p>请先在个人主页添加兴趣标签，或浏览更多机器人内容。</p><a href="../fenleijiansuo/fenleijiansuo.html" style="color:#2a7fff;">去分类检索</a></div>';
        return;
    }
    container.innerHTML = list
        .map((item) => {
            const summary = escapeHtml(summaryOf(item.description));
            const cityDisplay = escapeHtml(areaOf(item.area));
            const imgInner = thumb(item.topicKey, typeof item.topicItemIndex === "number" ? item.topicItemIndex : 0);
            const matchScore = item.matchScore || Math.floor(Math.random() * 30 + 65);
            const scoreColor = matchScore >= 80 ? "#4caf50" : matchScore >= 60 ? "#ff9800" : "#9e9e9e";
            return `
        <div class="heritage-card" onclick="viewDetail('${encodeURIComponent(item.name)}','${item.topicKey}',${item.topicItemIndex})">
            <div class="card-image">
                ${imgInner}
                <span class="card-badge" style="background: ${scoreColor};">匹配度 ${matchScore}%</span>
            </div>
            <div class="card-content">
                <span class="card-category">${escapeHtml(item.category)}</span>
                <h3 class="card-title">${escapeHtml(item.name)}</h3>
                <p class="card-desc">${summary}</p>
                <div class="card-footer">
                    <span class="match-score"><i class="fas fa-folder-open"></i> ${cityDisplay}</span>
                    <a href="javascript:void(0)" class="read-more">查看详情 →</a>
                </div>
            </div>
        </div>`;
        })
        .join("");
}

function getRouteRecommendations() {
    const tags = getUserTags();
    const topics = window.ROBOT_TOPICS ? Object.entries(window.ROBOT_TOPICS) : [];
    if (!topics.length) return [];
    const withScore = topics.map(([topicKey, topic]) => {
        const tagMatched = tags.some((tag) => topic.title.includes(tag));
        const base = tagMatched ? 100 : 60;
        return {
            topicKey,
            title: topic.title,
            count: (topic.items || []).length,
            recommendDays: Math.min(3, Math.max(1, Math.ceil((topic.items || []).length / 4))),
            score: base + (topic.items || []).length
        };
    }).sort((a, b) => b.score - a.score);

    const start = (routePageIndex * 4) % withScore.length;
    const first = withScore.slice(start, start + 4);
    if (first.length < 4) {
        first.push(...withScore.slice(0, 4 - first.length));
    }
    return first;
}

function renderTravelRouteRecommendations() {
    const container = document.getElementById("routeRecommendationsList");
    if (!container) return;
    const routes = getRouteRecommendations();
    if (!routes.length) {
        container.innerHTML = '<div class="empty-state"><h3>暂无学习路线</h3></div>';
        return;
    }
    const S = tuisongShared();
    const routeThumb = (key) => (S && S.htmlTopicThumbnailImg ? S.htmlTopicThumbnailImg(key, 0) : "");

    container.innerHTML = routes.map((item) => {
        const imgInner = routeThumb(item.topicKey);
        return `
        <div class="route-card" onclick="goToRoutePage('${encodeURIComponent(item.topicKey)}', ${item.recommendDays})">
            <div class="card-image">
                ${imgInner}
                <span class="route-badge">${item.recommendDays}日路线</span>
            </div>
            <div class="card-content">
                <div class="card-title">${escapeHtml(item.title)} 学习路线</div>
                <div class="route-day">包含 ${item.count} 个知识点</div>
                <div class="route-info">
                    <span class="route-tag">分阶段学习</span>
                    <span class="route-tag">重点梳理</span>
                    <span class="route-tag">快速入门</span>
                </div>
            </div>
        </div>`;
    }).join("");
}

function refreshRecommendations() {
    if (!checkLogin()) return;
    currentPageIndex += 1;
    renderRecommendationsWithList(getRecommendationBatch());
}

function refreshRouteRecommendations() {
    if (!checkLogin()) return;
    routePageIndex += 1;
    renderTravelRouteRecommendations();
}

function goToRoutePage(topicKey, days) {
    window.location.href = `city-route.html?topic=${topicKey}&days=${days}`;
}

function viewDetail(nameEnc, topicKey, itemIdx) {
    if (!checkLogin()) return;
    const decoded = decodeURIComponent(nameEnc);
    const idx = typeof itemIdx === "number" && !Number.isNaN(itemIdx) ? itemIdx : 0;
    const topicPageMap = window.ROBOT_TOPIC_KEY_TO_FILE || {};
    const mappedTopicPage = topicKey && typeof topicKey === "string" ? topicPageMap[topicKey] : "";
    const targetUrl = mappedTopicPage
        ? mappedTopicPage
        : `../fenleijiansuo/fenleijiansuo.html?search=${encodeURIComponent(decoded)}`;
    const currentUser = getCurrentUser();
    let browseHistory = getBrowseHistory();
    const newRecord = {
        name: decoded,
        time: new Date().toLocaleString(),
        path: targetUrl
    };
    browseHistory = browseHistory.filter((r) => r.name !== decoded);
    browseHistory.unshift(newRecord);
    if (browseHistory.length > 50) browseHistory.pop();
    localStorage.setItem("browseHistory", JSON.stringify(browseHistory));
    if (currentUser) {
        localStorage.setItem(`browseHistory_${currentUser}`, JSON.stringify(browseHistory));
    }
    window.location.href = targetUrl;
}

document.addEventListener("DOMContentLoaded", function() {
    updateNavigation();
    if (!checkLogin()) return;
    rebuildScores();
    renderUserProfile();
    renderTravelRouteRecommendations();
    renderRecommendationsWithList(getRecommendationBatch());
});
