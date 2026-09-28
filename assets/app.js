/* ====== 本地存储 ====== */
var store = {
  set: function(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
  get: function(k, f) {
    if (f === undefined) f = null;
    try {
      var v = JSON.parse(localStorage.getItem(k));
      if (v === null || v === undefined) return f;
      return v;
    } catch(e) { return f; }
  }
};

function go(url) { location.href = url; }

function setStage(stage) { store.set('ai_stage', stage); go('home.html'); }
function currentStage() { return store.get('ai_stage', '小学'); }

function bindEnter(id, fn) {
  var el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); fn(el.value); }
  });
}

/* HTML 转义，防止 XSS */
function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* 防抖：延迟 wait 毫秒后执行 fn，期间再次调用则重置计时 */
function debounce(fn, wait) {
  var timer = null;
  return function() {
    var ctx = this, args = arguments;
    if (timer) clearTimeout(timer);
    timer = setTimeout(function() {
      timer = null;
      fn.apply(ctx, args);
    }, wait);
  };
}

/* 节流：每隔 wait 毫秒最多执行一次 fn */
function throttle(fn, wait) {
  var last = 0, timer = null;
  return function() {
    var ctx = this, args = arguments;
    var now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(ctx, args);
    } else if (!timer) {
      timer = setTimeout(function() {
        timer = null;
        last = Date.now();
        fn.apply(ctx, args);
      }, wait - (now - last));
    }
  };
}

/* 生成带 token 的 TTS URL（因为 audio src 不带 Authorization header） */
function ttsUrl(text, voice, rate) {
  var url = '/api/tts?text=' + encodeURIComponent(text || '');
  if (voice) url += '&voice=' + encodeURIComponent(voice);
  if (rate) url += '&rate=' + encodeURIComponent(rate);
  var t = getToken();
  if (t) url += '&token=' + encodeURIComponent(t);
  return url;
}

/* ====== 用户登录态 ====== */
function getToken() { return store.get('ai_token', null); }
function currentUser() { return store.get('ai_user', null); }
function setSession(token, user) { store.set('ai_token', token); store.set('ai_user', user); }
function requireLogin() { if (!getToken()) { go('index.html'); return false; } return true; }

/* ====== 轻量 Toast 提示 ====== */
var _toastTimer = null;
function showToast(msg, type) {
  if (!type) type = 'info';
  var toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:99999;padding:10px 20px;border-radius:10px;font-size:14px;opacity:0;transition:opacity .3s,top .3s;pointer-events:none;max-width:80%;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.15);';
    document.body.appendChild(toast);
  }
  var bg = {
    info: 'rgba(59,130,246,.95)',
    success: 'rgba(34,197,94,.95)',
    error: 'rgba(239,68,68,.95)',
    warn: 'rgba(245,158,11,.95)'
  };
  toast.style.background = bg[type] || bg.info;
  toast.style.color = '#fff';
  toast.textContent = msg;
  toast.style.top = '20px';
  toast.style.opacity = '1';
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.top = '10px';
  }, 2500);
}

function logout() {
  var token = getToken() || '';
  try {
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token }
    }).catch(function(){});
  } catch(e) {}
  localStorage.removeItem('ai_token');
  localStorage.removeItem('ai_user');
  go('index.html');
}

function authCall(path, username, password) {
  return apiRequest(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, password: password })
  });
}

function loginUser(u, p) {
  return authCall('/api/auth/login', u, p).then(function(d) {
    setSession(d.token, d.user);
    return d.user;
  });
}

function registerUser(u, p) {
  return authCall('/api/auth/register', u, p).then(function(d) {
    setSession(d.token, d.user);
    return d.user;
  });
}

/* ====== API 请求 ====== */
var API_BASE = '';

function apiRequest(path, options) {
  if (!options) options = {};
  if (!options.headers) options.headers = {};
  var t = getToken();
  if (t) options.headers['Authorization'] = 'Bearer ' + t;
  // POST/PUT 等带 body 的请求默认 JSON 格式
  if (options.method && options.method.toUpperCase() !== 'GET' && options.body) {
    if (!options.headers['Content-Type']) {
      options.headers['Content-Type'] = 'application/json';
    }
  }

  return fetch(API_BASE + path, options).then(function(response) {
    return response.json().then(function(result) {
      if (response.status === 401) {
        localStorage.removeItem('ai_token');
        localStorage.removeItem('ai_user');
        go('index.html');
        throw new Error('请先登录');
      }
      if (!response.ok) {
        var msg = (result && result.message) || (result && result.detail) || ('HTTP 请求失败（状态码 ' + response.status + '）');
        throw new Error('请求失败：' + msg);
      }
      if (result && result.code !== 0) {
        var msg2 = (result && result.message) || (result && result.detail) || '后端返回错误';
        throw new Error('请求失败：' + msg2);
      }
      return result.data;
    }).catch(function(e) {
      if (e && e.message && e.message.indexOf('请先登录') !== -1) throw e;
      throw new Error('响应数据格式错误');
    });
  }).catch(function(error) {
    if (error && error.message && error.message.indexOf('请求失败') !== -1) throw error;
    if (error && error.message && error.message.indexOf('请先登录') !== -1) throw error;
    if (error && error.message && error.message.indexOf('响应数据格式错误') !== -1) throw error;
    throw new Error('网络请求失败：' + ((error && error.message) || '无法连接服务器'));
  });
}

/* ====== 移动端汉堡菜单 ====== */
(function initMobileMenu() {
  if (typeof document === 'undefined') return;

  function init() {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    // 创建遮罩
    var overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    overlay.addEventListener('click', closeMobileMenu);
    document.body.appendChild(overlay);

    // 给 topbar 的 brand 前面加汉堡按钮
    var brand = document.querySelector('.topbar .brand');
    if (brand) {
      var btn = document.createElement('button');
      btn.className = 'mobile-menu-btn';
      btn.innerHTML = '☰';
      btn.setAttribute('aria-label', '菜单');
      btn.addEventListener('click', toggleMobileMenu);
      brand.parentNode.insertBefore(btn, brand);
    }

    // 点击侧边栏链接后自动关闭
    var links = sidebar.querySelectorAll('.side-link, .history-item, .new-chat');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function() {
        setTimeout(closeMobileMenu, 100);
      });
    }
  }

  function toggleMobileMenu() {
    var sidebar = document.querySelector('.sidebar');
    var overlay = document.querySelector('.mobile-overlay');
    if (!sidebar) return;
    if (sidebar.classList.contains('mobile-open')) {
      closeMobileMenu();
    } else {
      sidebar.classList.add('mobile-open');
      if (overlay) overlay.classList.add('active');
    }
  }

  function closeMobileMenu() {
    var sidebar = document.querySelector('.sidebar');
    var overlay = document.querySelector('.mobile-overlay');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');
  }

  window.toggleMobileMenu = toggleMobileMenu;
  window.closeMobileMenu = closeMobileMenu;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ====== 全局错误边界 ======
   捕获未处理的 JS 错误和 Promise 异常，避免用户看到白屏而不知所措 */
(function setupErrorBoundary() {
  // 同步错误
  window.addEventListener('error', function(e) {
    console.error('[全局错误]', e.message, 'at', e.filename + ':' + e.lineno);
    // 开发环境弹提示，生产环境可以改成上报
    try {
      if (window.showToast) {
        window.showToast('页面出现了一点小问题，请刷新试试', 'error');
      }
    } catch(err) {}
    return false;
  });

  // 异步 Promise 错误（最容易静默失败的）
  window.addEventListener('unhandledrejection', function(e) {
    console.error('[未处理的Promise异常]', e.reason);
    try {
      if (window.showToast) {
        window.showToast('操作失败，请稍后再试', 'error');
      }
    } catch(err) {}
    // 阻止浏览器控制台输出默认的"uncaught"提示（我们已经自己打了）
    e.preventDefault();
  });
})();
