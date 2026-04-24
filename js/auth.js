// auth.js - 统一导航栏动态更新（无需 jQuery）
(function () {
    function getPrefixByPathDepth() {
        var pathname = window.location.pathname || '';
        var normalized = pathname.replace(/\\/g, '/').replace(/\/+/g, '/');
        var parts = normalized.split('/').filter(Boolean);
        if (parts.length <= 1) return '';
        var depth = parts.length - 1;
        return '../'.repeat(depth);
    }

    function updateUserNav() {
        var userLink = document.querySelector('#user-link a');
        if (!userLink) return;

        var currentUser = localStorage.getItem('currentUser');
        var pathname = (window.location.pathname || '').replace(/\\/g, '/');
        var prefix = getPrefixByPathDepth();

        if (currentUser) {
            userLink.textContent = '个人主页';
            userLink.setAttribute('href', prefix + 'profile.html');
        } else {
            userLink.textContent = '用户登录与注册';
            userLink.setAttribute('href', prefix + 'denglu-zhuce/denglu-zhuce.html');
        }

        if (pathname.indexOf('denglu-zhuce/denglu-zhuce.html') !== -1 && !currentUser) {
            userLink.setAttribute('href', '#');
        }
        if (pathname.indexOf('profile.html') !== -1 && currentUser) {
            userLink.setAttribute('href', '#');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateUserNav);
    } else {
        updateUserNav();
    }
})();