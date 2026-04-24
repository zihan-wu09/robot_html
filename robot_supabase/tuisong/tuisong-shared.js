/**
 * 内容推送共享：图片路径、导航、详情顶图绑定
 * 资源：../images/robot/topics/{topicKey}/item-{n}/gallery-{g}.ext（另试 ../image/ 根）
 */
(function (global) {
    var TOPIC_ROOTS = ["../images/robot/topics", "../image/robot/topics"];
    var IMAGE_EXTENSIONS = ["jpg", "png", "jpeg", "webp"];
    var MAX_GALLERY_INDEX = 16;
    var FALLBACK_IMAGE = "../images/主页大背景.png";

    function escAttr(s) {
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;");
    }

    function itemDirPath(root, topicKey, itemIndex0Based) {
        var idx = typeof itemIndex0Based === "number" && itemIndex0Based >= 0 ? itemIndex0Based : 0;
        return root + "/" + topicKey + "/item-" + idx + "/";
    }

    function getTopicItemImageCandidates(topicKey, itemIndex0Based) {
        if (!topicKey) {
            return [FALLBACK_IMAGE];
        }
        var out = [];
        for (var r = 0; r < TOPIC_ROOTS.length; r++) {
            var dir = itemDirPath(TOPIC_ROOTS[r], topicKey, itemIndex0Based);
            for (var g = 0; g < MAX_GALLERY_INDEX; g++) {
                for (var e = 0; e < IMAGE_EXTENSIONS.length; e++) {
                    out.push(dir + "gallery-" + g + "." + IMAGE_EXTENSIONS[e]);
                }
            }
        }
        var seen = {};
        var dedup = [];
        for (var i = 0; i < out.length; i++) {
            if (!seen[out[i]]) {
                seen[out[i]] = 1;
                dedup.push(out[i]);
            }
        }
        dedup.push(FALLBACK_IMAGE);
        return dedup;
    }

    function topicImagePayload(topicKey, itemIndex0Based) {
        var cands = getTopicItemImageCandidates(topicKey, itemIndex0Based);
        return { first: cands[0] || FALLBACK_IMAGE, allJoined: cands.join("|") };
    }

    function resolveTopicItemImage(topicKey, itemIndex0Based) {
        return topicImagePayload(topicKey, itemIndex0Based).first;
    }

    /** 将候选链绑定到已有 <img>（详情页与脚本内复用） */
    function bindTopicImageElement(el, topicKey, itemIndex0Based) {
        if (!el || !topicKey) {
            return;
        }
        var p = topicImagePayload(topicKey, itemIndex0Based);
        el.src = p.first;
        el.setAttribute("data-all", p.allJoined);
        el.setAttribute("data-ci", "0");
        el.onerror = function () {
            if (global.__tuisongTryNextImg) {
                global.__tuisongTryNextImg(this);
            }
        };
    }

    function htmlTopicThumbnailImg(topicKey, itemIndex0Based) {
        var p = topicImagePayload(topicKey, itemIndex0Based);
        return (
            '<img class="card-image-media" src="' +
            escAttr(p.first) +
            '" alt="" decoding="async" loading="lazy" data-ci="0" data-all="' +
            escAttr(p.allJoined) +
            '" onerror="window.__tuisongTryNextImg(this)">'
        );
    }

    global.__tuisongTryNextImg = function (img) {
        var raw = img.getAttribute("data-all");
        if (!raw) {
            img.onerror = null;
            img.src = FALLBACK_IMAGE;
            return;
        }
        var parts = raw.split("|");
        var ci = parseInt(img.getAttribute("data-ci") || "0", 10) + 1;
        img.setAttribute("data-ci", String(ci));
        if (ci < parts.length) {
            if (ci === parts.length - 1) {
                img.onerror = null;
            }
            img.src = parts[ci];
        } else {
            img.onerror = null;
            img.src = FALLBACK_IMAGE;
        }
    };

    function updateTuisongNav() {
        var el = document.getElementById("user-link");
        if (!el) {
            return;
        }
        var u = localStorage.getItem("currentUser");
        el.innerHTML = u
            ? '<a href="../profile.html">个人主页</a>'
            : '<a href="../denglu-zhuce/denglu-zhuce.html">用户登录与注册</a>';
    }

    function getDescriptionSummary(description) {
        if (!description) {
            return "暂无描述";
        }
        var text = String(description).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        return text.length > 80 ? text.substring(0, 80) + "..." : text;
    }

    function getImagePath(heritage) {
        if (heritage && heritage.mainImage) {
            return heritage.mainImage;
        }
        return FALLBACK_IMAGE;
    }

    function getCityDisplay(area) {
        if (!area) {
            return "机器人科普";
        }
        return String(area).split("、")[0];
    }

    global.TUISONG_SHARED = {
        getTopicItemImageCandidates: getTopicItemImageCandidates,
        resolveTopicItemImage: resolveTopicItemImage,
        bindTopicImageElement: bindTopicImageElement,
        htmlTopicThumbnailImg: htmlTopicThumbnailImg,
        updateTuisongNav: updateTuisongNav,
        getDescriptionSummary: getDescriptionSummary,
        getImagePath: getImagePath,
        getCityDisplay: getCityDisplay
    };
})(typeof window !== "undefined" ? window : globalThis);
