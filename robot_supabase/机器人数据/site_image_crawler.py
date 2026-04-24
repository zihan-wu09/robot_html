import sys, re, time, argparse, shutil, random
from pathlib import Path
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parent
REPO_ROOT = PROJECT_ROOT.parent
IMAGES_ROOT = REPO_ROOT / "images"
TOPIC_JS = REPO_ROOT / "机器人" / "js" / "robot-topics-data.js"

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

def read_topics():
    t = TOPIC_JS.read_text(encoding="utf-8")
    m = list(re.finditer(r"'(topic-[a-z-]+)'\s*:\s*\{", t))
    out = {}
    for i, mm in enumerate(m):
        k = mm.group(1)
        s = mm.end()
        e = m[i + 1].start() if i + 1 < len(m) else len(t)
        body = t[s:e]
        if "items:" not in body: 
            continue
        part = body.split("items:", 1)[1]
        depth = 0
        for j, ch in enumerate(part):
            if ch == "[": depth += 1
            elif ch == "]":
                depth -= 1
                if depth == 0:
                    part = part[: j + 1]; break
        items = []
        rx = re.finditer(r"\{\s*title:\s*'((?:\\'|[^'])*)'(.*?)}", part, re.S)
        for im in rx:
            title = im.group(1).replace("\\'", "'")
            items.append({"title": title})
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
    ap.add_argument("--topic", help="")
    ap.add_argument("--max-items", type=int, default=999)
    ap.add_argument("--slots", type=int, default=6)
    ap.add_argument("--delay", type=float, default=2.0)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    topics = read_topics()
    if args.topic:
        topics = {args.topic: topics.get(args.topic, [])}
    for tk, items in topics.items():
        for idx, item in enumerate(items[: args.max_items]):
            kws = build_keywords(tk, item["title"])
            folder = IMAGES_ROOT / "robot" / "topics" / tk / f"item-{idx}"
            if args.dry_run:
                print(str(folder))
                print("keywords:", ", ".join(kws[:6]))
                continue
            download_one_item(tk, idx, item["title"], args.slots, args.delay)

if __name__ == "__main__":
    main()
