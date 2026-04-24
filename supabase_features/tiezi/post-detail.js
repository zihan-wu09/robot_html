// 默认头像（与 haoyouhudong.js / anhui_feiyi post-detail 一致）
function getDefaultAvatarDataUrl(size) {
    const s = size || 40;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 48 48"><rect fill="#eceff1" width="48" height="48"/><circle cx="24" cy="17" r="7" fill="#78909c"/><path fill="#78909c" d="M10 41c0-7.7 6.3-14 14-14s14 6.3 14 14"/></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
function avatarOrDefault(url, size) {
    const u = url && String(url).trim();
    if (!u) return getDefaultAvatarDataUrl(size);
    if (/^https?:\/\//i.test(u) || /^data:image\//i.test(u) || /^\//.test(u)) return u;
    return getDefaultAvatarDataUrl(size);
}

const postId = localStorage.getItem('currentPostId');
let currentPost = null;
let currentUser = null;
let isLiked = false;

// 评论弹窗相关变量
let currentComment = null;
let commentAction = null;

// 页面初始化
async function initDetailPage() {
    if (!postId) {
        alert('无效的帖子ID');
        history.back();
        return;
    }

    // 获取当前登录用户
    const localUser = localStorage.getItem('currentUser');
    const { data: { user } } = await window.SupabaseAPI.supabase.auth.getUser();
    currentUser = user;
    if (!localUser || !currentUser) {
        if (currentUser && !localUser && window.SupabaseAPI?.supabase?.auth) {
            await window.SupabaseAPI.supabase.auth.signOut();
        }
        alert('请先登录或注册后再使用帖子功能');
        location.href = '../../denglu-zhuce/denglu-zhuce.html';
        return;
    }

    // 获取帖子详情（包含用户信息）
    const { data: post, error } = await window.SupabaseAPI.supabase
        .from('posts')
        .select('*, user_profiles(nickname, avatar)')
        .eq('id', postId)
        .maybeSingle();

    if (error || !post) {
        console.error(error);
        alert('加载帖子失败');
        history.back();
        return;
    }

    currentPost = post;
    await loadLikesAndComments();
    renderPostDetail();
}

// 加载点赞和评论数据
async function loadLikesAndComments() {
    // 加载点赞列表
    const { data: likes } = await window.SupabaseAPI.supabase
        .from('likes')
        .select('user_id, user_profiles(nickname, avatar)')
        .eq('post_id', postId);

    // 加载评论列表（包含 parent_id 关联）
    const { data: comments } = await window.SupabaseAPI.supabase
        .from('comments')
        .select('id, content, user_id, parent_id, user_profiles(nickname, avatar)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    currentPost.likes = likes || [];
    currentPost.comments = comments || [];
    isLiked = (currentPost.likes || []).some(like => like.user_id === currentUser.id);
}

// 渲染帖子详情
function renderPostDetail() {
    // 渲染用户信息
    document.getElementById('avatar').src = avatarOrDefault(currentPost.user_profiles?.avatar, 44);
    document.getElementById('avatar').alt = '';
    document.getElementById('nickname').innerText = currentPost.user_profiles?.nickname || '匿名用户';
    document.getElementById('content').innerText = currentPost.content || '';
    document.getElementById('time').innerText = new Date(currentPost.created_at).toLocaleString();

    // 渲染图片
    const imgContainer = document.getElementById('images');
    imgContainer.innerHTML = '';
    if (currentPost.images && currentPost.images.length > 0) {
        currentPost.images.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            imgContainer.appendChild(img);
        });
    }

    // 渲染点赞状态
    const likeCount = currentPost.likes?.length || 0;
    document.getElementById('likeText').innerText = isLiked ? `已点赞(${likeCount})` : `点赞(${likeCount})`;
    document.getElementById('likeBtn').classList.toggle('liked', isLiked);

    // 渲染点赞用户列表
    const likeUsersContainer = document.getElementById('likeUsers');
    likeUsersContainer.innerHTML = '';
    if (currentPost.likes && currentPost.likes.length > 0) {
        currentPost.likes.forEach(like => {
            const user = like.user_profiles;
            const div = document.createElement('div');
            div.className = 'like-user';
            div.innerHTML = `
                <img src="${avatarOrDefault(user?.avatar, 24)}" class="like-avatar" alt="">
                <span>${user?.nickname || '用户'}</span>
            `;
            likeUsersContainer.appendChild(div);
        });
    } else {
        likeUsersContainer.innerHTML = '<span style="color:#999;">暂无点赞</span>';
    }

    // 渲染评论区（支持层级回复展示）
    const commentList = document.getElementById('commentList');
    commentList.innerHTML = '';
    if (currentPost.comments && currentPost.comments.length > 0) {
        currentPost.comments.forEach(c => {
            const isReply = !!c.parent_id;
            const item = document.createElement('div');
            item.className = `comment-item ${isReply ? 'reply-item' : ''}`;
            item.onclick = () => onCommentClick(c);
            item.innerHTML = `
                <img src="${avatarOrDefault(c.user_profiles?.avatar, 36)}" class="comment-avatar" alt="">
                <div class="comment-content">
                    <div class="comment-nickname">${c.user_profiles?.nickname || '匿名'}</div>
                    <div class="comment-text">
                        <i class="fa-solid fa-reply"></i>
                        ${c.content}
                    </div>
                </div>
            `;
            commentList.appendChild(item);
        });
    } else {
        commentList.innerHTML = '<div style="color:#999;padding:10px 0;">暂无评论</div>';
    }

    // 显示删除按钮（仅作者可见）
    if (currentUser && currentPost && currentUser.id === currentPost.user_id) {
        document.getElementById('deleteBtn').style.display = 'inline-block';
    } else {
        document.getElementById('deleteBtn').style.display = 'none';
    }
}

// ====================== 评论点击弹窗功能 ======================
function onCommentClick(comment) {
    currentComment = comment;
    if (currentUser.id === comment.user_id) {
        // 自己的评论：删除
        document.getElementById('modalPrimaryBtn').innerText = '删除';
        document.getElementById('modalPrimaryBtn').className = 'modal-btn danger';
        commentAction = 'delete';
    } else {
        // 别人的评论：回复
        document.getElementById('modalPrimaryBtn').innerText = '回复';
        document.getElementById('modalPrimaryBtn').className = 'modal-btn primary';
        commentAction = 'reply';
    }
    document.getElementById('commentModal').style.display = 'flex';
}

function closeCommentModal() {
    document.getElementById('commentModal').style.display = 'none';
    currentComment = null;
    commentAction = null;
}

async function handleCommentAction() {
    const input = document.getElementById('commentInput');
    
    if (commentAction === 'delete') {
        // 删除评论（同时删除该评论作为 parent_id 的所有子回复）
        await window.SupabaseAPI.supabase.from('comments').delete().eq('id', currentComment.id);
        await window.SupabaseAPI.supabase.from('comments').delete().eq('parent_id', currentComment.id);
    } 
    else if (commentAction === 'reply') {
        // 回复：激活输入框，记录回复目标
        const replyName = currentComment.user_profiles?.nickname || currentComment.user_profiles?.username || '用户';
        input.placeholder = `回复 ${replyName}：`;
        input.dataset.replyUser = replyName;
        input.dataset.replyId = currentComment.id; // 关联 parent_id
        input.focus();
    }
    
    closeCommentModal();
    await loadLikesAndComments();
    renderPostDetail();
}

// 切换点赞状态
async function toggleLike() {
    if (isLiked) {
        await window.SupabaseAPI.supabase.from('likes').delete().eq('post_id', postId).eq('user_id', currentUser.id);
        isLiked = false;
    } else {
        await window.SupabaseAPI.supabase.from('likes').insert([{ post_id: postId, user_id: currentUser.id }]);
        isLiked = true;
    }
    await loadLikesAndComments();
    renderPostDetail();
}

// 发送评论（支持普通评论 + 回复评论）
async function sendComment() {
    const input = document.getElementById('commentInput');
    const content = input.value.trim();
    if (!content) return;

    let finalContent = content;
    const insertData = {
        post_id: postId,
        user_id: currentUser.id,
        content: finalContent
    };

    // 如果是回复评论，拼接 @ 格式并关联 parent_id
    if (input.dataset.replyUser && input.dataset.replyId) {
        finalContent = `@${input.dataset.replyUser}：${content}`;
        insertData.content = finalContent;
        insertData.parent_id = input.dataset.replyId; // 关联原评论ID
    }

    // 插入数据库
    await window.SupabaseAPI.supabase.from('comments').insert([insertData]);

    // 重置输入框状态
    input.value = '';
    input.placeholder = '说点什么...';
    delete input.dataset.replyUser;
    delete input.dataset.replyId;

    await loadLikesAndComments();
    renderPostDetail();
}

// 页面返回
function goBack() {
    history.back();
}

// 删除弹窗控制
function openModal() {
    document.getElementById('deleteModal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

// 删除帖子
async function deletePost() {
    await window.SupabaseAPI.supabase.from('comments').delete().eq('post_id', postId);
    await window.SupabaseAPI.supabase.from('likes').delete().eq('post_id', postId);
    await window.SupabaseAPI.supabase.from('posts').delete().eq('id', postId);
    closeModal();
    history.back();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initDetailPage);