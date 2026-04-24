/**
 * 九大主题条目详情页：本地配图路径（与 机器人数据/download_topic_site_images.py 输出一致）
 *
 * 目录（相对站点根 images/）：
 *   images/robot/topics/{topicKey}/item-{itemIndex}/gallery-0.jpg … gallery-2.jpg
 *
 * 从 机器人/topic-item-detail.html 引用时使用 ../images/robot/topics/...
 *
 * 说明：与「机器人数据」部位维度图 images/hand/... 为两套体系；仅 topic-core-parts 与零部件知识在语义上部分重叠。
 */
(function (global) {
  var BASE = '../images/robot/topics';

  /**
   * @param {string} topicKey 如 topic-main-types
   * @param {number} itemIndex 条目下标 0起
   * @param {number} slot 图文延展第几张 0..2
   */
  function getTopicSiteGalleryPath(topicKey, itemIndex, slot) {
    slot = slot || 0;
    return (
      BASE + '/' + topicKey + '/item-' + itemIndex + '/gallery-' + slot + '.jpg'
    );
  }

  /** 是否用本地路径覆盖 robot-item-details 中的外链图（缺省 true；可在页面前置脚本设为 false） */
  global.TOPIC_SITE_USE_LOCAL_IMAGES =
    typeof global.TOPIC_SITE_USE_LOCAL_IMAGES === 'boolean'
      ? global.TOPIC_SITE_USE_LOCAL_IMAGES
      : true;

  global.TOPIC_SITE_GALLERY_SLOTS =
    typeof global.TOPIC_SITE_GALLERY_SLOTS === 'number'
      ? global.TOPIC_SITE_GALLERY_SLOTS
      : 6;
  global.getTopicSiteGalleryPath = getTopicSiteGalleryPath;
})(typeof window !== 'undefined' ? window : globalThis);
