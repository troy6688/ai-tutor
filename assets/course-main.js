"use strict";

var _$5, _$6;
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
var bootParams = new URLSearchParams(window.location.search);
var requestedStage = bootParams.get('stage');
var STAGE = window.STAGE_COURSE_DATA && window.STAGE_COURSE_DATA[requestedStage] ? requestedStage : currentStage();
if (window.store) store.set('ai_stage', STAGE);
document.title = STAGE + ' AI 通识 · 智课';
var COURSE_DATA = window.STAGE_COURSE_DATA[STAGE];
var units = COURSE_DATA.units;
var allTopics = units.flatMap(function (unit) {
  return unit.sections.flatMap(function (section) {
    return section.items.map(function (item) {
      return _extends({}, item, {
        unit: unit.title,
        section: section.title
      });
    });
  });
});
var byId = new Map(allTopics.map(function (item) {
  return [item.id, item];
}));
var firstId = allTopics[0].id;
var openUnits = new Set([units[0].title]);
var openSections = new Set([units[0].sections[0].title]);
var selectedId = firstId;
var chatHistory = [];
var nextQuestionSource = bootParams.get('from') === 'home' ? 'home' : 'course';
var $ = function $(id) {
  return document.getElementById(id);
};
// 挂到window上，确保兼容和跨脚本访问
if (!window.$) window.$ = $;
var make = function make(tag, className, text) {
  var node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
var itemName = function itemName(item) {
  return item.title.replace(/^知识点\s*[0-9.]+\s*[：:]?\s*/, '');
};
// 拼音首字母映射（常用AI相关词汇）
var PINYIN_MAP = {
  '算法': 'sf', '机器学习': 'jqxx', '深度学习': 'rdxx', '神经网络': 'sjwl',
  '人工智能': 'rgzn', '卷积': 'jj', '池化': 'ch', '聚类': 'jl', '分类': 'fl',
  '回归': 'hg', '梯度下降': 'tdxj', '感知机': 'gzj', '决策树': 'jcs',
  '随机森林': 'sjsl', '过拟合': 'gnh', '学习率': 'xxl', '自然语言': 'zryy',
  '语音识别': 'yysb', '图像识别': 'txsb', '强化学习': 'qhxx', '监督学习': 'jdxx',
  '无监督': 'wjd', '半监督': 'bjd', '数据': 'sj', '算力': 'sl', '算例': 'sl',
  '冒泡排序': 'mppx', '选择排序': 'xzpx', '快速排序': 'kspx',
  '广度优先': 'gdyx', '深度优先': 'sdyx', '前向传播': 'qxcb',
  '智能': 'zn', '知识': 'zs', '专家系统': 'zjxt', '图灵': 'tl',
  '机器人': 'jqr', '自动驾驶': 'zdjs', '大语言': 'dyy', '生成式': 'scs',
  '边缘计算': 'byjs', '联邦学习': 'lbxx', '迁移学习': 'qyxx',
  '注意力': 'yili', 'transformer': 'transformer', 'chatgpt': 'chatgpt',
  'ai': 'ai', 'ml': 'ml', 'dl': 'dl', 'cnn': 'cnn', 'rnn': 'rnn',
  'knn': 'knn', 'k-means': 'kmeans', 'svm': 'svm', 'gan': 'gan',
};
// 判断文本是否匹配搜索词（支持中文、拼音首字母、英文）
function matchesSearch(text, filter) {
  if (!filter) return true;
  var lower = text.toLowerCase();
  if (lower.includes(filter)) return true;
  // 检查拼音首字母映射
  var keys = Object.keys(PINYIN_MAP);
  for (var i = 0; i < keys.length; i++) {
    if (text.indexOf(keys[i]) >= 0 && PINYIN_MAP[keys[i]].indexOf(filter) >= 0) return true;
  }
  return false;
}
function renderDirectory() {
  var filter = $('searchInput').value.trim().toLowerCase();
  var root = $('directory');
  root.replaceChildren();
  var shown = 0;
  units.forEach(function (unit, uIndex) {
    var unitMatch = matchesSearch(unit.title, filter);
    var sections = unit.sections.map(function (section) {
      return _extends({}, section, {
        visible: section.items.filter(function (item) {
          return !filter || unitMatch || matchesSearch(section.title, filter) || matchesSearch(item.title, filter) || matchesSearch(item.keywords, filter);
        })
      });
    }).filter(function (section) {
      return section.visible.length;
    });
    if (!sections.length) return;
    var unitWrap = make('div', 'unit');
    var unitButton = make('button', 'unit-head');
    unitButton.type = 'button';
    var unitIsOpen = filter ? true : openUnits.has(unit.title);
    unitButton.setAttribute('aria-expanded', String(unitIsOpen));
    unitButton.append(make('span', 'unit-no', String(uIndex + 1).padStart(2, '0')), make('span', 'unit-name', unit.title), make('span', 'chevron', '▶'));
    unitButton.addEventListener('click', function () {
      if (openUnits.has(unit.title)) openUnits.delete(unit.title);else openUnits.add(unit.title);
      renderDirectory();
    });
    unitWrap.append(unitButton);
    if (unitIsOpen) {
      var body = make('div', 'unit-body');
      sections.forEach(function (section) {
        var sw = make('div', 'section');
        var sb = make('button', 'section-head');
        sb.type = 'button';
        var sectionKey = unit.title + '|' + section.title;
        var sectionIsOpen = filter ? true : openSections.has(sectionKey);
        sb.setAttribute('aria-expanded', String(sectionIsOpen));
        sb.append(make('span', '', section.title), make('span', 'section-count', String(section.visible.length)), make('span', 'chevron', '▶'));
        sb.addEventListener('click', function () {
          if (openSections.has(sectionKey)) openSections.delete(sectionKey);else openSections.add(sectionKey);
          renderDirectory();
        });
        sw.append(sb);
        if (sectionIsOpen) {
          var list = make('div', 'topic-list');
          section.visible.forEach(function (item) {
            shown++;
            var b = make('button', 'topic' + (selectedId === item.id ? ' active' : ''));
            b.type = 'button';
            b.setAttribute('aria-current', selectedId === item.id ? 'page' : 'false');
            b.append(make('span', 'topic-number', String(item.no || item.id)), make('span', '', itemName(item)));
            b.addEventListener('click', function () {
              return selectTopic(item.id);
            });
            list.append(b);
          });
          sw.append(list);
        } else shown += section.visible.length;
        body.append(sw);
      });
      unitWrap.append(body);
    } else shown += sections.reduce(function (n, s) {
      return n + s.visible.length;
    }, 0);
    root.append(unitWrap);
  });
  if (!root.children.length) root.append(make('div', 'empty-search', '没有找到匹配的课程'));
  $('directoryCount').textContent = filter ? shown + ' 条结果' : allTopics.length + ' 个知识点';
}
function selectTopic(id, _temp) {
  var _$;
  var _ref = _temp === void 0 ? {} : _temp,
    _ref$preserveChat = _ref.preserveChat,
    preserveChat = _ref$preserveChat === void 0 ? false : _ref$preserveChat;
  var item = byId.get(id);
  if (!item) return;
  selectedId = id;
  var sectionKey = item.unit + '|' + item.section;
  openUnits.add(item.unit);
  openSections.add(sectionKey);
  $('breadcrumb').textContent = item.unit + '  ›  ' + item.section;
  $('lessonTitle').textContent = itemName(item);
  if ($('lessonSubline')) $('lessonSubline').textContent = item.title + ' · ' + STAGE + ' AI 通识';
  $('explanation').textContent = item.explanation || '暂无讲解内容';
  (_$ = $('keywords')).replaceChildren.apply(_$, item.keywords.split(/[，,、]/).map(function (s) {
    return s.trim();
  }).filter(Boolean).map(function (s) {
    return make('span', 'keyword', s);
  }));
  var videoName = String(item.video || '').trim();
  var videoSrc = videoName ? /^(https?:|\/|assets\/)/.test(videoName) ? videoName : 'assets/videos/' + videoName : '';
  var hasVideo = Boolean(videoSrc);
  var video = $('lessonVideo');
  video.pause();
  if (hasVideo) {
    if (video.getAttribute('src') !== videoSrc) {
      video.src = videoSrc;
      video.load();
    }
    video.hidden = false;
    $('videoPlaceholder').hidden = true;
  } else {
    video.removeAttribute('src');
    video.load();
    video.hidden = true;
    $('videoPlaceholder').hidden = false;
  }
  $('videoStatus').textContent = hasVideo ? '视频已就绪' : '视频待制作';
  $('videoStatus').classList.toggle('wait', !hasVideo);
  // 统一隐藏视频标签，以动画为主要学习方式
  var videoTabEl = $('videoTab');
  if (videoTabEl) {
    videoTabEl.setAttribute('hidden', '');
  }
  // 预先隐藏动画标签，等 animation-studio 判断后再决定是否显示
  var animTabEl = $('animationTab');
  if (animTabEl) animTabEl.setAttribute('hidden', '');
  // 编程练习标签：有 coding 字段才显示
  var codingTabEl = $('codingTab');
  if (codingTabEl) {
    if (item.coding) {
      codingTabEl.removeAttribute('hidden');
    } else {
      codingTabEl.setAttribute('hidden', '');
    }
  }
  // 切换知识点时，如果当前在编程练习标签，切回默认（动画/文稿）
  // 防止上一个知识点的编程练习面板残留
  if (currentMediaTab === 'coding') {
    var _$2;
    var aTab = $('animationTab');
    var tTab = $('textTab');
    // 隐藏编程练习
    (_$2 = $('codingLesson')) == null || _$2.setAttribute('hidden', '');
    codingTabEl == null || codingTabEl.classList.remove('active');
    codingTabEl == null || codingTabEl.setAttribute('aria-selected', 'false');
    if (aTab && !aTab.hidden) {
      var _$3;
      currentMediaTab = 'animation';
      aTab.classList.add('active');
      aTab.setAttribute('aria-selected', 'true');
      (_$3 = $('animationPlayer')) == null || _$3.removeAttribute('hidden');
    } else {
      var _$4;
      currentMediaTab = 'text';
      tTab == null || tTab.classList.add('active');
      tTab == null || tTab.setAttribute('aria-selected', 'true');
      (_$4 = $('textLesson')) == null || _$4.removeAttribute('hidden');
      if (typeof renderTextLesson === 'function') renderTextLesson();
    }
  }
  // 加载编程练习内容（错误隔离，不影响其他功能）
  try {
    if (typeof loadCodingExercise === 'function') {
      loadCodingExercise(id);
    }
  } catch (e) {
    console.warn('编程练习加载失败:', e);
  }
  $('chatContext').textContent = item.unit + ' · ' + itemName(item);
  if (!preserveChat) resetChat();
  renderDirectory();
  requestApi('/api/points/' + id).then(function (detail) {
    var _window$animationStud;
    // 更新视频：后端有视频路径且和当前不同时，更新视频源（但不显示视频标签）
    if (detail && detail.video) {
      var vUrl = /^(https?:|\/|assets\/)/.test(detail.video) ? detail.video : 'assets/videos/' + detail.video;
      var video = $('lessonVideo');
      var currentSrc = video ? video.getAttribute('src') || '' : '';
      if (video && currentSrc.indexOf(vUrl) === -1 && vUrl.indexOf(currentSrc) === -1) {
        video.src = vUrl;
        video.load();
      }
      $('videoStatus').textContent = '视频已就绪';
      $('videoStatus').classList.remove('wait');
      if (!hasVideo) {
        video.hidden = false;
        $('videoPlaceholder').hidden = true;
      }
    }
    (_window$animationStud = window.animationStudio) == null || _window$animationStud.loadPoint({
      id: id,
      title: itemName(item),
      grade: detail.grade || STAGE,
      template: detail.animation || ''
    });
  }).catch(function () {});
  return {
    item: item,
    hasVideo: hasVideo
  };
}
// 聊天语音状态
var chatVoiceOn = true;
var chatAudio = null;
function stopChatVoice() {
  if (chatAudio) {
    try {
      chatAudio.pause();
      chatAudio.src = '';
    } catch (e) {}
    chatAudio = null;
  }
}
function speakChat(text) {
  if (!chatVoiceOn || !text) return;
  stopChatVoice();
  // 停止所有其他声音，避免重叠
  if (window.animationStudio && window.animationStudio._stopVoice) {
    window.animationStudio._stopVoice();
  }
  if (typeof stopTextRead === 'function') {
    stopTextRead();
  }
  // 去掉一些不适合朗读的符号，截断长度
  var clean = String(text).replace(/[*_`#>]/g, '').slice(0, 500);
  if (!clean.trim()) return;
  var url = ttsUrl(clean, 'xiaoxiao', '+10%');
  chatAudio = new Audio(url);
  chatAudio.play().catch(function () {});
}
function addMessage(kind, body, source, speak) {
  var wrap = make('div', 'msg ' + kind);
  wrap.classList.add('message-enter');
  if (kind === 'bot') wrap.append(make('div', 'mini-avatar', '✦'));
  wrap.append(make('div', 'bubble', body));
  $('messages').append(wrap);
  if (source) {
    var sourceNode = make('div', 'source', '资料来源：' + source);
    sourceNode.classList.add('message-enter');
    $('messages').append(sourceNode);
  }
  $('messages').scrollTop = $('messages').scrollHeight;
  if (kind === 'bot' && speak !== false) {
    speakChat(body);
  }
}
function addThinking() {
  var wrap = make('div', 'msg bot thinking-message');
  wrap.classList.add('message-enter');
  wrap.append(make('div', 'mini-avatar', '✦'));
  var bubble = make('div', 'bubble thinking-bubble');
  for (var i = 0; i < 3; i++) bubble.append(make('span', 'thinking-dot'));
  wrap.append(bubble);
  $('messages').append(wrap);
  $('messages').scrollTop = $('messages').scrollHeight;
  return wrap;
}
function addSwitchNotice(text) {
  var notice = make('div', 'switch-notice', text);
  notice.classList.add('message-enter');
  $('messages').append(notice);
  $('messages').scrollTop = $('messages').scrollHeight;
}
function resetChat() {
  chatHistory = [];
  $('messages').replaceChildren();
  addMessage('bot', '你好！我可以结合这份' + STAGE + ' AI 通识教材回答问题。你可以问本节内容，也可以让我举例说明。', null, false);
}
var compact = function compact(s) {
  return String(s || '').replace(/[\s“”‘’、，。！？：:；;（）()]/g, '').toLowerCase();
};
var grams = function grams(s) {
  var t = compact(s).replace(/什么|怎么|如何|请问|讲讲|一下|一个|哪些|为什么|能不能|可以吗|是什么/g, '');
  return [].concat(new Set([].concat(t).map(function (_, i) {
    return t.slice(i, i + 2);
  }).filter(function (x) {
    return x.length === 2;
  })));
};
function findRelatedTopic(query) {
  var q = compact(query);
  if (q.length < 2) return null;
  var core = q.replace(/请问|请|帮我|解释|介绍|讲讲|说说|一下|什么是|是什么|怎么|如何|为什么|有哪些|有何|可以吗|能不能|吗|呢/g, '');
  var queryGrams = grams(query);
  var ranked = allTopics.map(function (item) {
    var title = compact(itemName(item));
    var section = compact(item.section);
    var keywords = String(item.keywords || '').split(/[，,、;；\s]+/).map(compact).filter(function (term) {
      return term.length >= 2;
    });
    var score = 0;
    var direct = false;
    if (title && q.includes(title)) {
      score += 140;
      direct = true;
    }
    if (core.length >= 2 && (title.includes(core) || core.includes(title))) {
      score += 110;
      direct = true;
    }
    for (var _iterator = _createForOfIteratorHelperLoose(keywords), _step; !(_step = _iterator()).done;) {
      var term = _step.value;
      if (q.includes(term) || core === term) {
        score += Math.min(46, 18 + term.length * 4);
        if (core === term || term.length >= 3) direct = true;
      }
    }
    score += queryGrams.filter(function (g) {
      return title.includes(g);
    }).length * 5;
    score += queryGrams.filter(function (g) {
      return keywords.some(function (term) {
        return term.includes(g);
      });
    }).length * 2;
    if (section && q.includes(section)) score += 8;
    return {
      item: item,
      score: score,
      direct: direct
    };
  }).sort(function (a, b) {
    return b.score - a.score;
  });
  var best = ranked[0],
    second = ranked[1];
  if (!best || best.item.id === selectedId) return null;
  var margin = best.score - ((second == null ? void 0 : second.score) || 0);
  if (best.score < 28 || !best.direct && margin < 6) return null;
  return best.item;
}
function bestSentence(item, query) {
  var sentences = item.explanation.split(/(?<=[。！？])/).map(function (s) {
    return s.trim();
  }).filter(Boolean);
  var q = grams(query);
  var ranked = sentences.map(function (s, i) {
    return {
      s: s,
      i: i,
      score: q.reduce(function (n, g) {
        return n + (compact(s).includes(g) ? 1 : 0);
      }, 0)
    };
  }).sort(function (a, b) {
    return b.score - a.score || a.i - b.i;
  });
  var chosen = ranked.filter(function (x) {
    return x.score > 0;
  }).slice(0, 3);
  return (chosen.length ? chosen : ranked.slice(0, 2)).map(function (x) {
    return x.s;
  }).join('').slice(0, 280);
}
function answer(query) {
  var current = byId.get(selectedId);
  var q = compact(query);
  if (/练习|题目|测验|测试|做题/.test(q)) {
    var text = current.practice.slice(0, 450);
    return {
      body: text || '这节课暂时没有练习题。',
      source: current.title
    };
  }
  if (/关键词|重点|要点/.test(q)) return {
    body: '本节关键词：' + (current.keywords || '暂无') + '。你可以再问其中的某个词，我会从讲解资料里找相关内容。',
    source: current.title
  };
  if (/例子|举例/.test(q)) {
    var example = current.explanation.split(/(?<=[。！？])/).find(function (s) {
      return /例如|比如|举个例子|打个比方|生活中/.test(s);
    });
    return {
      body: (example || bestSentence(current, query)).slice(0, 280),
      source: current.title
    };
  }
  if (/这节课|本节|当前/.test(q)) return {
    body: bestSentence(current, query),
    source: current.title
  };
  if (selectedId === firstId && /摄像头|怎么看|如何看|用什么看/.test(q)) return {
    body: 'AI 可以通过摄像头获取图像，就像人用眼睛看东西。例如，手机拍照时识别人脸。',
    source: current.title
  };
  var g = grams(query);
  var best = current,
    bestScore = -1;
  var _loop = function _loop() {
    var item = _step2.value;
    var title = compact(item.title + ' ' + item.section);
    var keys = compact(item.keywords);
    var body = compact(item.explanation);
    var score = g.reduce(function (n, x) {
      return n + (title.includes(x) ? 5 : 0) + (keys.includes(x) ? 3 : 0) + (body.includes(x) ? .35 : 0);
    }, 0);
    if (item.id === selectedId) score += 2;
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  };
  for (var _iterator2 = _createForOfIteratorHelperLoose(allTopics), _step2; !(_step2 = _iterator2()).done;) {
    _loop();
  }
  if (bestScore < 2) return {
    body: '我在当前教材里还没有找到足够明确的答案。你可以换个说法，或在左侧选择相关知识点。',
    source: ''
  };
  return {
    body: bestSentence(best, query) || best.explanation.slice(0, 240),
    source: best.title
  };
}
function requestApi(_x, _x2) {
  return _requestApi.apply(this, arguments);
}
function _requestApi() {
  _requestApi = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(path, options) {
    var isLocal, response, result, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          if (options === void 0) {
            options = {};
          }
          if (!(typeof apiRequest === 'function')) {
            _context.n = 1;
            break;
          }
          return _context.a(2, apiRequest(path, options));
        case 1:
          isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && location.port !== '8000';
          _context.n = 2;
          return fetch((isLocal ? 'http://127.0.0.1:8000' : '') + path, options);
        case 2:
          response = _context.v;
          _context.p = 3;
          _context.n = 4;
          return response.json();
        case 4:
          result = _context.v;
          _context.n = 6;
          break;
        case 5:
          _context.p = 5;
          _t = _context.v;
          throw new Error('服务器响应格式错误');
        case 6:
          if (response.ok) {
            _context.n = 7;
            break;
          }
          throw new Error(result && (result.message || result.detail) || 'HTTP ' + response.status);
        case 7:
          if (!(!result || result.code !== 0)) {
            _context.n = 8;
            break;
          }
          throw new Error(result && (result.message || result.detail) || '后端返回错误');
        case 8:
          return _context.a(2, result.data);
      }
    }, _callee, null, [[3, 5]]);
  }));
  return _requestApi.apply(this, arguments);
}
function sendQuestion(_x3) {
  return _sendQuestion.apply(this, arguments);
}
function _sendQuestion() {
  _sendQuestion = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(text) {
    var q, sendButton, status, related, switched, thinking, current, message, recordSource, data, reply, fallback, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          q = String(text || '').trim();
          if (q) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2);
        case 1:
          addMessage('user', q);
          $('question').value = '';
          sendButton = $('sendButton');
          status = $('aiStatus');
          sendButton.disabled = true;
          status.textContent = 'AI 思考中';
          related = findRelatedTopic(q);
          if (related) {
            switched = selectTopic(related.id, {
              preserveChat: true
            });
            addSwitchNotice(switched.hasVideo ? '🔀 已为你切换到相关知识点：' + itemName(related) : '🔀 已为你切换到：' + itemName(related) + '（若视频待制作，可先看文字讲解和练习题）');
          }
          thinking = addThinking();
          _context2.p = 2;
          current = byId.get(selectedId);
          message = '当前知识点标题：' + itemName(current) + '\n讲解内容：' + (current.explanation || '暂无讲解内容') + '\n\n用户问题：' + q;
          recordSource = nextQuestionSource;
          nextQuestionSource = 'course';
          _context2.n = 3;
          return requestApi('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: message,
              question: q,
              grade: STAGE,
              history: chatHistory.slice(-8),
              source: recordSource,
              topic_id: selectedId,
              topic_title: itemName(current)
            })
          });
        case 3:
          data = _context2.v;
          reply = String(data && data.reply || '暂未收到有效回答').trim();
          thinking.remove();
          addMessage('bot', reply, current.title);
          chatHistory.push({
            role: 'user',
            content: q
          }, {
            role: 'assistant',
            content: reply
          });
          chatHistory = chatHistory.slice(-8);
          status.textContent = 'AI 在线';
          _context2.n = 5;
          break;
        case 4:
          _context2.p = 4;
          _t2 = _context2.v;
          thinking.remove();
          fallback = answer(q);
          addMessage('bot', fallback.body + '\n\n（AI 服务暂时不可用，以上为本地教材检索结果。）', fallback.source);
          status.textContent = '本地兜底';
        case 5:
          _context2.p = 5;
          if (thinking.isConnected) thinking.remove();
          sendButton.disabled = false;
          $('question').focus();
          return _context2.f(5);
        case 6:
          return _context2.a(2);
      }
    }, _callee2, null, [[2, 4, 5, 6]]);
  }));
  return _sendQuestion.apply(this, arguments);
}
function loadSavedHistory(_x4) {
  return _loadSavedHistory.apply(this, arguments);
}
function _loadSavedHistory() {
  _loadSavedHistory = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(recordId) {
    var record, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          _context3.n = 1;
          return requestApi('/api/chat/history/' + recordId);
        case 1:
          record = _context3.v;
          if (record.topic_id !== null && byId.has(Number(record.topic_id))) selectTopic(Number(record.topic_id), {
            preserveChat: true
          });
          $('messages').replaceChildren();
          chatHistory = [];
          addMessage('user', record.question || '');
          if (record.reply) {
            addMessage('bot', record.reply, record.topic_title || '历史记录', false);
            chatHistory = [{
              role: 'user',
              content: record.question || ''
            }, {
              role: 'assistant',
              content: record.reply
            }];
          } else addMessage('bot', '这条提问已经保存，但当时没有生成可保存的回答。你可以重新提问。', record.topic_title || '历史记录', false);
          $('aiStatus').textContent = '历史记录';
          _context3.n = 3;
          break;
        case 2:
          _context3.p = 2;
          _t3 = _context3.v;
          addSwitchNotice('历史记录加载失败，请返回首页后重试。');
        case 3:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 2]]);
  }));
  return _loadSavedHistory.apply(this, arguments);
}
var lessonVideo = $('lessonVideo');
var videoPlayButton = $('videoPlay');
var videoProgress = $('videoProgress');
var videoSeeking = false;
var formatVideoTime = function formatVideoTime(value) {
  var seconds = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  return String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
};
function syncVideoControls() {
  var duration = Number.isFinite(lessonVideo.duration) ? lessonVideo.duration : 0;
  var hasSource = Boolean(lessonVideo.currentSrc || lessonVideo.getAttribute('src'));
  videoProgress.max = duration || 100;
  if (!videoSeeking) videoProgress.value = duration ? Math.min(lessonVideo.currentTime, duration) : 0;
  videoProgress.disabled = !hasSource || !duration;
  videoPlayButton.disabled = !hasSource;
  videoPlayButton.textContent = lessonVideo.paused ? '▶' : '❚❚';
  videoPlayButton.setAttribute('aria-label', lessonVideo.paused ? '播放视频' : '暂停视频');
  var shownTime = videoSeeking ? Number(videoProgress.value) : lessonVideo.currentTime;
  $('videoTime').textContent = formatVideoTime(shownTime) + ' / ' + formatVideoTime(duration);
}
function toggleVideoPlayback() {
  return _toggleVideoPlayback.apply(this, arguments);
}
function _toggleVideoPlayback() {
  _toggleVideoPlayback = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          if (lessonVideo.currentSrc || lessonVideo.getAttribute('src')) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2);
        case 1:
          _context4.p = 1;
          if (!(lessonVideo.paused || lessonVideo.ended)) {
            _context4.n = 3;
            break;
          }
          if (lessonVideo.ended) lessonVideo.currentTime = 0;
          _context4.n = 2;
          return lessonVideo.play();
        case 2:
          _context4.n = 4;
          break;
        case 3:
          lessonVideo.pause();
        case 4:
          _context4.n = 6;
          break;
        case 5:
          _context4.p = 5;
          _t4 = _context4.v;
          console.warn('视频播放失败：', _t4);
        case 6:
          _context4.p = 6;
          syncVideoControls();
          return _context4.f(6);
        case 7:
          return _context4.a(2);
      }
    }, _callee4, null, [[1, 5, 6, 7]]);
  }));
  return _toggleVideoPlayback.apply(this, arguments);
}
function seekVideo(value) {
  var duration = lessonVideo.duration;
  if (!Number.isFinite(duration) || duration <= 0) return;
  var next = Math.max(0, Math.min(Number(value) || 0, duration));
  lessonVideo.currentTime = next;
  videoProgress.value = next;
  $('videoTime').textContent = formatVideoTime(next) + ' / ' + formatVideoTime(duration);
}
videoPlayButton.addEventListener('click', toggleVideoPlayback);
// 视频倍速
var videoRateBtn = $('videoRate');
var videoRates = [0.75, 1.0, 1.25, 1.5, 2.0];
var videoRateIndex = 1;
function setVideoRate(idx) {
  videoRateIndex = (idx + videoRates.length) % videoRates.length;
  var rate = videoRates[videoRateIndex];
  lessonVideo.playbackRate = rate;
  videoRateBtn.textContent = rate.toFixed(2).replace(/\.?0+$/, '') + '×';
}
videoRateBtn.addEventListener('click', function () {
  return setVideoRate(videoRateIndex + 1);
});
videoProgress.addEventListener('pointerdown', function () {
  videoSeeking = true;
});
videoProgress.addEventListener('input', function (event) {
  return seekVideo(event.currentTarget.value);
});
videoProgress.addEventListener('change', function (event) {
  seekVideo(event.currentTarget.value);
  videoSeeking = false;
  syncVideoControls();
});
videoProgress.addEventListener('pointerup', function () {
  videoSeeking = false;
  syncVideoControls();
});
videoProgress.addEventListener('pointercancel', function () {
  videoSeeking = false;
  syncVideoControls();
});
['loadedmetadata', 'durationchange', 'canplay', 'timeupdate', 'play', 'pause', 'seeking', 'seeked', 'ended', 'emptied'].forEach(function (type) {
  return lessonVideo.addEventListener(type, syncVideoControls);
});
$('searchInput').addEventListener('input', debounce(renderDirectory, 200));
$('sendButton').addEventListener('click', function () {
  return sendQuestion($('question').value);
});
$('question').addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendQuestion(e.currentTarget.value);
  }
});
$('suggestions').addEventListener('click', function (e) {
  if (e.target.tagName === 'BUTTON') sendQuestion(e.target.textContent);
});
(_$5 = $('answerEntry')) == null || _$5.addEventListener('click', function () {
  location.href = 'quiz.html?' + new URLSearchParams({
    stage: STAGE,
    point: String(selectedId)
  });
});
// 聊天语音开关
(_$6 = $('chatVoiceToggle')) == null || _$6.addEventListener('click', function () {
  chatVoiceOn = !chatVoiceOn;
  var btn = $('chatVoiceToggle');
  if (btn) {
    btn.textContent = chatVoiceOn ? '🔊' : '🔇';
    btn.classList.toggle('off', !chatVoiceOn);
    btn.title = chatVoiceOn ? '语音朗读已开启' : '语音朗读已关闭';
  }
  if (!chatVoiceOn) {
    stopChatVoice();
  }
});

// ====== 语音输入功能 ======
(function initVoiceInput() {
  var voiceBtn = $('voiceBtn');
  var questionInput = $('question');
  if (!voiceBtn || !questionInput) return;

  // 检测浏览器是否支持语音识别
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceBtn.style.display = 'none';
    return;
  }
  var recognition = null;
  var isRecording = false;
  var finalTranscript = '';
  var wasPlaying = false; // 记录录音前动画/视频是否在播放
  var wasVideoMuted = false; // 记录视频原来是否静音

  // 停止所有声音（防止和录音冲突）
  function stopAllSounds() {
    // 1. 停止聊天AI朗读
    if (typeof stopChatVoice === 'function') stopChatVoice();
    // 2. 停止文稿朗读
    if (typeof stopTextRead === 'function') stopTextRead();
    // 3. 停止动画语音（Edge-TTS）
    if (window.animationStudio && window.animationStudio._stopVoice) {
      window.animationStudio._stopVoice();
    }
    // 5. 视频静音
    var video = $('lessonVideo');
    if (video) {
      wasVideoMuted = video.muted;
      video.muted = true;
    }
  }

  // 恢复视频声音
  function restoreVideoSound() {
    var video = $('lessonVideo');
    if (video) {
      video.muted = wasVideoMuted;
    }
  }

  // 创建识别实例
  function createRecognition() {
    var rec = new SpeechRecognition();
    rec.lang = 'zh-CN';
    rec.continuous = false; // 单次识别，松手就结束
    rec.interimResults = true; // 显示中间结果
    rec.maxAlternatives = 1;
    rec.onstart = function () {
      isRecording = true;
      voiceBtn.classList.add('recording');
      finalTranscript = '';

      // 停止所有正在播放的声音（关键：避免和录音冲突）
      stopAllSounds();

      // 暂停动画或视频
      if (currentMediaTab === 'animation' && window.animationStudio) {
        wasPlaying = (window.animationStudio.isPlaying == null ? void 0 : window.animationStudio.isPlaying()) || false;
        if (wasPlaying) window.animationStudio.pause == null || window.animationStudio.pause();
      } else if (currentMediaTab === 'video') {
        var video = $('lessonVideo');
        wasPlaying = !video.paused;
        if (wasPlaying) video.pause();
      } else {
        wasPlaying = false;
      }
    };
    rec.onresult = function (event) {
      var interim = '';
      for (var i = event.resultIndex; i < event.results.length; i++) {
        var transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }
      questionInput.value = finalTranscript + interim;
      // 自动调整输入框高度
      questionInput.style.height = 'auto';
      questionInput.style.height = Math.min(questionInput.scrollHeight, 62) + 'px';
    };
    rec.onerror = function (event) {
      console.warn('语音识别错误:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        showMicHelp();
      }
    };
    rec.onend = function () {
      isRecording = false;
      voiceBtn.classList.remove('recording');
      // 如果有识别结果，光标移到末尾
      if (questionInput.value.trim()) {
        questionInput.focus();
        questionInput.setSelectionRange(questionInput.value.length, questionInput.value.length);
      }
    };
    return rec;
  }

  // 开始录音
  var micStream = null;
  var permissionGranted = false; // 是否已确认过麦克风权限

  function requestMicPermission() {
    return new Promise(function (resolve, reject) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        reject(new Error('浏览器不支持麦克风'));
        return;
      }
      navigator.mediaDevices.getUserMedia({
        audio: true
      }).then(function (stream) {
        micStream = stream;
        // 拿到权限后先关掉流，交给 SpeechRecognition 去用
        stream.getTracks().forEach(function (track) {
          return track.stop();
        });
        micStream = null;
        resolve(true);
      }).catch(function (err) {
        reject(err);
      });
    });
  }
  function startRecording() {
    if (isRecording) return;
    var doStart = function doStart() {
      try {
        recognition = createRecognition();
        recognition.start();
      } catch (e) {
        console.warn('启动语音识别失败:', e);
      }
    };

    // 如果支持 getUserMedia 且还没确认过权限，先请求一下
    // 这样可以确保浏览器弹出权限框，而不是直接静默失败
    if (!permissionGranted && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      voiceBtn.classList.add('recording');
      requestMicPermission().then(function () {
        permissionGranted = true;
        voiceBtn.classList.remove('recording');
        doStart();
      }).catch(function (err) {
        voiceBtn.classList.remove('recording');
        console.warn('getUserMedia 失败，改用 SpeechRecognition:', err);
        // 降级：直接用 SpeechRecognition 自己处理
        // SpeechRecognition 自己也会弹权限框
        doStart();
      });
    } else {
      doStart();
    }
  }

  // 显示麦克风权限帮助
  function showMicHelp() {
    var msg = '需要麦克风权限才能语音提问哦～\n\n' + '请点击浏览器地址栏左边的 🔒 或 ⓘ 图标，\n' + '找到「麦克风」设置，改为「允许」，\n' + '然后刷新页面就可以用啦！';
    alert(msg);
  }

  // 停止录音
  function stopRecording() {
    if (!isRecording || !recognition) return;
    try {
      recognition.stop();
    } catch (e) {}
  }

  // 鼠标事件（桌面端）
  voiceBtn.addEventListener('mousedown', function (e) {
    e.preventDefault();
    startRecording();
  });
  voiceBtn.addEventListener('mouseup', function (e) {
    e.preventDefault();
    stopRecording();
  });
  voiceBtn.addEventListener('mouseleave', function () {
    if (isRecording) stopRecording();
  });

  // 触摸事件（移动端）
  voiceBtn.addEventListener('touchstart', function (e) {
    e.preventDefault();
    startRecording();
  });
  voiceBtn.addEventListener('touchend', function (e) {
    e.preventDefault();
    stopRecording();
  });

  // 键盘快捷键：按住空格说话
  var spaceDown = false;
  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && !spaceDown && document.activeElement === questionInput) {
      // 只有输入框聚焦时才启用空格快捷键
      // 不打断用户输入，所以这里不实现
      // 如果需要可以再加
    }
  });
})();
$('videoTab').addEventListener('click', function () {
  showMediaTab('video');
});
$('animationTab').addEventListener('click', function () {
  showMediaTab('animation');
});
$('textTab').addEventListener('click', function () {
  showMediaTab('text');
});
var codingTabEl = $('codingTab');
if (codingTabEl) {
  codingTabEl.addEventListener('click', function () {
    try {
      showMediaTab('coding');
    } catch (e) {
      console.error('编程练习标签切换失败:', e);
    }
  });
}
var textReadBtnEl = $('textReadBtn');
if (textReadBtnEl) {
  textReadBtnEl.addEventListener('click', function () {
    toggleTextRead();
  });
}

// 标签统一切换逻辑
var currentMediaTab = 'animation';
var mediaSwitching = false;
function showMediaTab(mode) {
  if (mediaSwitching) return;
  if (mode === currentMediaTab) return;
  var videoWrap = $('videoWrap');
  var animPlayer = $('animationPlayer');
  var textLesson = $('textLesson');
  var codingLesson = $('codingLesson');
  var videoTab = $('videoTab');
  var animTab = $('animationTab');
  var textTab = $('textTab');
  var codingTab = $('codingTab');
  var tabMap = {
    video: videoWrap,
    animation: animPlayer,
    text: textLesson,
    coding: codingLesson
  };
  var tabBtnMap = {
    video: videoTab,
    animation: animTab,
    text: textTab,
    coding: codingTab
  };
  var oldEl = tabMap[currentMediaTab];
  var newEl = tabMap[mode];
  var oldTab = tabBtnMap[currentMediaTab];
  var newTab = tabBtnMap[mode];

  // 防御性检查：目标元素不存在就不切换
  if (!newEl) {
    return;
  }
  mediaSwitching = true;

  // 更新tab状态
  var tabKeys = Object.keys(tabBtnMap);
  for (var ti = 0; ti < tabKeys.length; ti++) {
    var tbn = tabBtnMap[tabKeys[ti]];
    if (tbn) {
      tbn.classList.remove('active');
      tbn.setAttribute('aria-selected', 'false');
    }
  }
  if (newTab) {
    newTab.classList.add('active');
    newTab.setAttribute('aria-selected', 'true');
  }

  // 丝滑过渡
  if (oldEl) {
    oldEl.style.transition = 'opacity .25s ease';
    oldEl.style.opacity = '0';
  }
  newEl.style.transition = 'opacity .3s ease';
  newEl.style.opacity = '0';
  newEl.removeAttribute('hidden');
  setTimeout(function () {
    if (oldEl) {
      oldEl.setAttribute('hidden', '');
      oldEl.style.opacity = '';
      oldEl.style.transition = '';
    }
    newEl.style.opacity = '1';
    setTimeout(function () {
      newEl.style.transition = '';
      newEl.style.opacity = '';
      mediaSwitching = false;
    }, 320);

    // 模式切换副作用
    if (mode === 'animation') {
      if (window.animationStudio) window.animationStudio.showMode('animation');
      stopTextRead();
    }
    if (mode === 'video') {
      if (window.animationStudio) window.animationStudio.showMode('video');
      stopTextRead();
    }
    if (mode === 'text') {
      renderTextLesson();
      stopTextRead();
    }
    if (mode === 'coding') {
      stopTextRead();
    }
  }, 260);
  currentMediaTab = mode;
}

// 渲染文稿教学内容
function renderTextLesson() {
  try {
    var _$7, _$8;
    var title = ((_$7 = $('lessonTitle')) == null || (_$7 = _$7.textContent) == null ? void 0 : _$7.trim()) || '';
    var explanation = ((_$8 = $('explanation')) == null || (_$8 = _$8.textContent) == null ? void 0 : _$8.trim()) || '';
    var keywordsEl = $('keywords');
    var keywords = [];
    if (keywordsEl) {
      var kwNodes = keywordsEl.querySelectorAll('.keyword');
      for (var ki = 0; ki < kwNodes.length; ki++) {
        var kwText = kwNodes[ki] && kwNodes[ki].textContent ? kwNodes[ki].textContent.trim() : '';
        if (kwText) keywords.push(kwText);
      }
    }
    $('textHeroTitle').textContent = title + ' · 精讲';
    $('textHeroSub').textContent = '文字版深度解析，慢慢看、反复学';

    // 把explanation的纯文本转成带格式的HTML
    var html = formatTextLesson(explanation);
    $('textBody').innerHTML = html;

    // 关键词
    if (keywords.length) {
      $('textKeywords').innerHTML = '<div class="kw-label">📌 核心关键词</div>' + keywords.map(function (k) {
        return '<span class="kw-tag">' + k + '</span>';
      }).join('');
    } else {
      $('textKeywords').innerHTML = '';
    }
  } catch (e) {
    console.warn('renderTextLesson error:', e);
    if ($('textBody') && !$('textBody').innerHTML) {
      var exp = ($('explanation') && $('explanation').textContent) || '暂无文稿内容';
      $('textBody').innerHTML = '<p>' + exp + '</p>';
    }
  }
}

// 格式化文稿：把纯文本的换行、编号等转成HTML
function formatTextLesson(text) {
  if (!text) return '<p>暂无文稿内容</p>';
  // 按段落分割
  var paras = text.split(/\n\s*\n/).filter(function (p) {
    return p.trim();
  });
  var html = '';
  paras.forEach(function (p) {
    p = p.trim();
    if (!p) return;
    // 检测是否是列表（一、二、三... 或 1. 2. 3.）
    if (/^[一二三四五六七八九十]+[、.]/.test(p) || /^\d+[.、)]/.test(p)) {
      var items = p.split(/\n/).filter(function (l) {
        return l.trim();
      });
      if (items.length > 1) {
        html += '<ul>' + items.map(function (item) {
          return '<li>' + formatInline(item.replace(/^[一二三四五六七八九十\d]+[、.)]\s*/, '')) + '</li>';
        }).join('') + '</ul>';
        return;
      }
    }
    // 检测是否是小标题（以"："结尾且较短）
    if (p.length < 20 && /[：:]$/.test(p)) {
      html += '<h3>' + p.replace(/[：:]$/, '') + '</h3>';
      return;
    }
    html += '<p>' + formatInline(p) + '</p>';
  });
  return html;
}

// 行内格式化：加粗关键词等
function formatInline(text) {
  // 把**xxx**转成strong
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // 把「xxx」标成重点
  text = text.replace(/「(.+?)」/g, '<em>$1</em>');
  return text;
}

// ===== 文稿朗读功能 =====
// ====== 文稿朗读 ======
var textAudio = null;
var textReading = false;
var textPaused = false;
var textReadVoice = 'xiaoxiao'; // 和动画、助手统一音色
var textReadRate = '+20%'; // 和动画默认语速一致

function getPlainText() {
  var titleEl = $('lessonTitle');
  var title = titleEl ? titleEl.textContent.trim() : '';
  var expEl = $('explanation');
  var explanation = expEl ? expEl.textContent.trim() : '';
  var keywordsEl = $('keywords');
  var keywords = [];
  if (keywordsEl) {
    var kwNodes = keywordsEl.querySelectorAll('.keyword');
    for (var ki = 0; ki < kwNodes.length; ki++) {
      var kwText = kwNodes[ki] && kwNodes[ki].textContent ? kwNodes[ki].textContent.trim() : '';
      if (kwText) keywords.push(kwText);
    }
  }
  var text = title + '。' + explanation;
  if (keywords.length) {
    text += '。核心关键词：' + keywords.join('、') + '。';
  }
  if (text.length > 900) {
    text = text.substring(0, 900) + '...';
  }
  return text;
}
function updateReadProgress() {
  var bar = $('textReadBarInner');
  if (!bar || !textAudio) return;
  var dur = textAudio.duration;
  if (dur && !isNaN(dur) && isFinite(dur) && dur > 0) {
    // 有精确时长，显示精确进度
    var pct = textAudio.currentTime / dur * 100;
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    bar.style.width = pct + '%';
  } else {
    // 没有精确时长，显示模拟进度（缓慢前进）
    var cur = parseFloat(bar.style.width) || 0;
    cur += 0.3;
    if (cur > 90) cur = 90;
    bar.style.width = cur + '%';
  }
}
function resetReadUI() {
  textReading = false;
  textPaused = false;
  var btn = $('textReadBtn');
  if (btn) {
    btn.textContent = '🔊 朗读全文';
    btn.classList.remove('playing');
    btn.classList.remove('paused');
  }
  var progress = $('textReadProgress');
  if (progress) progress.setAttribute('hidden', '');
  var bar = $('textReadBarInner');
  if (bar) bar.style.width = '0%';
}
function toggleTextRead() {
  var btn = $('textReadBtn');
  var progress = $('textReadProgress');
  var bar = $('textReadBarInner');
  if (!btn) return;

  // 如果正在朗读 → 暂停
  if (textReading && !textPaused) {
    if (textAudio) {
      try {
        textAudio.pause();
      } catch (e) {}
    }
    textPaused = true;
    btn.textContent = '▶ 继续朗读';
    btn.classList.remove('playing');
    btn.classList.add('paused');
    return;
  }

  // 如果暂停中 → 继续
  if (textReading && textPaused) {
    if (textAudio) {
      try {
        textAudio.play();
      } catch (e) {}
    }
    textPaused = false;
    btn.textContent = '⏸ 暂停朗读';
    btn.classList.add('playing');
    btn.classList.remove('paused');
    return;
  }

  // 开始新的朗读
  var text = getPlainText();
  if (!text) return;

  // 停止其他声音
  stopChatVoice();
  if (window.animationStudio && window.animationStudio._stopVoice) {
    window.animationStudio._stopVoice();
  }

  // 清理旧的
  if (textAudio) {
    try {
      textAudio.pause();
    } catch (e) {}
    try {
      textAudio.src = '';
    } catch (e) {}
    textAudio = null;
  }
  textReading = true;
  textPaused = false;
  btn.textContent = '⏳ 加载中...';
  btn.classList.add('playing');
  if (progress) progress.removeAttribute('hidden');
  if (bar) bar.style.width = '0%';

  // 创建音频
  var url = ttsUrl(text, textReadVoice, textReadRate);
  textAudio = new Audio();
  textAudio.preload = 'auto';
  var startedPlaying = false;

  // 数据一开始加载就尝试播放（减少开头停顿）
  textAudio.addEventListener('loadeddata', function () {
    if (!startedPlaying && textReading && !textPaused) {
      startedPlaying = true;
      btn.textContent = '⏸ 暂停朗读';
      try {
        textAudio.play();
      } catch (e) {}
    }
  });

  // 备用：canplay 后也尝试
  textAudio.addEventListener('canplay', function () {
    if (!startedPlaying && textReading && !textPaused) {
      startedPlaying = true;
      btn.textContent = '⏸ 暂停朗读';
      try {
        textAudio.play();
      } catch (e) {}
    }
  });

  // 超时保护：2秒后如果还没开始，强制尝试播放
  setTimeout(function () {
    if (!startedPlaying && textReading && !textPaused && textAudio) {
      startedPlaying = true;
      btn.textContent = '⏸ 暂停朗读';
      var p = textAudio.play();
      if (p && p.catch) {
        p.catch(function () {
          resetReadUI();
        });
      }
    }
  }, 2000);
  textAudio.addEventListener('timeupdate', updateReadProgress);
  textAudio.addEventListener('ended', function () {
    if (bar) bar.style.width = '100%';
    setTimeout(function () {
      resetReadUI();
    }, 800);
  });
  textAudio.addEventListener('error', function () {
    // TTS 失败，重置UI
    resetReadUI();
  });
  textAudio.src = url;

  // 备用：如果 canplay 没触发，loadedmetadata 后也尝试播放
  textAudio.addEventListener('loadedmetadata', function () {
    if (!startedPlaying && textReading && !textPaused) {
      startedPlaying = true;
      btn.textContent = '⏸ 暂停朗读';
      var p = textAudio.play();
      if (p && p.catch) {
        p.catch(function () {
          resetReadUI();
        });
      }
    }
  });

}
function stopTextRead() {
  if (!textReading) return;
  if (textAudio) {
    try {
      textAudio.pause();
    } catch (e) {}
    try {
      textAudio.src = '';
    } catch (e) {}
    textAudio = null;
  }
  resetReadUI();
}

// ====== 进度条拖动 ======
function initTextSeekBar() {
  var progress = $('textReadProgress');
  var bar = $('textReadBarInner');
  if (!progress || !bar) return;
  var isDragging = false;
  function seekTo(e) {
    if (!textAudio || !textAudio.duration || isNaN(textAudio.duration)) return;
    var rect = progress.getBoundingClientRect();
    var clientX = e.clientX;
    if (!clientX && e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
    }
    var pct = (clientX - rect.left) / rect.width;
    if (pct < 0) pct = 0;
    if (pct > 1) pct = 1;
    try {
      textAudio.currentTime = pct * textAudio.duration;
      bar.style.width = pct * 100 + '%';
    } catch (err) {}
  }

  // 鼠标
  progress.addEventListener('mousedown', function (e) {
    if (!textAudio) return;
    isDragging = true;
    seekTo(e);
    e.preventDefault();
  });
  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    seekTo(e);
  });
  document.addEventListener('mouseup', function () {
    isDragging = false;
  });

  // 触摸
  progress.addEventListener('touchstart', function (e) {
    if (!textAudio) return;
    isDragging = true;
    seekTo(e);
    e.preventDefault();
  }, {
    passive: false
  });
  document.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    seekTo(e);
  }, {
    passive: false
  });
  document.addEventListener('touchend', function () {
    isDragging = false;
  });
}
setTimeout(initTextSeekBar, 800);

// 监听动画引擎就绪事件，决定默认显示哪个标签
window.addEventListener('animStudioReady', function (e) {
  var _$9, _$0, _$1, _$10;
  var _e$detail = e.detail,
    hasVideo = _e$detail.hasVideo,
    hasAnimation = _e$detail.hasAnimation,
    shouldDefaultToAnimation = _e$detail.shouldDefaultToAnimation;
  mediaSwitching = false;

  // 动画播放按钮样式升级
  try {
    var overlay = $('animPlayOverlay');
    if (overlay) {
      var inner = overlay.querySelector('div');
      if (inner && !inner.classList.contains('play-inner-upgraded')) {
        inner.classList.add('play-inner-upgraded');
        var btn = inner.querySelector('div');
        if (btn && btn.textContent.trim() === '▶') {
          btn.classList.add('play-btn-center');
        }
        var texts = inner.querySelectorAll('div');
        if (texts.length >= 2) {
          texts[1].classList.add('play-text');
        }
      }
    }
  } catch (err) {
    console.warn('播放按钮样式升级失败:', err);
  }
  var videoTab = $('videoTab');
  var animTab = $('animationTab');
  var textTab = $('textTab');
  var codingTab = $('codingTab');

  // 重置所有tab状态
  [videoTab, animTab, textTab, codingTab].forEach(function (t) {
    if (t) {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    }
  });
  // 隐藏所有内容
  (_$9 = $('videoWrap')) == null || _$9.setAttribute('hidden', '');
  (_$0 = $('animationPlayer')) == null || _$0.setAttribute('hidden', '');
  (_$1 = $('textLesson')) == null || _$1.setAttribute('hidden', '');
  (_$10 = $('codingLesson')) == null || _$10.setAttribute('hidden', '');
  if (shouldDefaultToAnimation) {
    var _$11, _window$animationStud2;
    // 没视频但有动画 → 默认显示动画
    currentMediaTab = 'animation';
    animTab == null || animTab.classList.add('active');
    animTab == null || animTab.setAttribute('aria-selected', 'true');
    (_$11 = $('animationPlayer')) == null || _$11.removeAttribute('hidden');
    (_window$animationStud2 = window.animationStudio) == null || _window$animationStud2.showMode('animation');
  } else if (hasVideo) {
    var _$12, _window$animationStud3;
    // 有视频 → 默认视频
    currentMediaTab = 'video';
    videoTab == null || videoTab.classList.add('active');
    videoTab == null || videoTab.setAttribute('aria-selected', 'true');
    (_$12 = $('videoWrap')) == null || _$12.removeAttribute('hidden');
    (_window$animationStud3 = window.animationStudio) == null || _window$animationStud3.showMode('video');
  } else {
    var _$13;
    // 都没有 → 默认文稿教学
    currentMediaTab = 'text';
    textTab == null || textTab.classList.add('active');
    textTab == null || textTab.setAttribute('aria-selected', 'true');
    (_$13 = $('textLesson')) == null || _$13.removeAttribute('hidden');
    renderTextLesson();
  }
});
var layout = document.querySelector('.layout');
var sidebar = document.querySelector('.sidebar');
var directoryBubble = $('directoryBubble');
var directoryCloseTimer;
var setDirectoryOpen = function setDirectoryOpen(open) {
  clearTimeout(directoryCloseTimer);
  layout.style.removeProperty('grid-template-columns');
  layout.style.removeProperty('transition');
  layout.classList.toggle('directory-open', open);
  directoryBubble.setAttribute('aria-expanded', String(open));
  directoryBubble.setAttribute('aria-label', open ? '收起课程目录' : '展开课程目录');
};
var scheduleDirectoryClose = function scheduleDirectoryClose() {
  clearTimeout(directoryCloseTimer);
  directoryCloseTimer = setTimeout(function () {
    if (sidebar.matches(':hover') || sidebar.contains(document.activeElement)) return;
    setDirectoryOpen(false);
  }, 85);
};
sidebar.classList.add('drawer-ready');
sidebar.addEventListener('pointerenter', function (event) {
  if (event.pointerType !== 'touch') setDirectoryOpen(true);
});
sidebar.addEventListener('pointerleave', function (event) {
  if (event.pointerType !== 'touch') scheduleDirectoryClose();
});
sidebar.addEventListener('focusin', function () {
  return setDirectoryOpen(true);
});
sidebar.addEventListener('focusout', function (event) {
  if (!sidebar.contains(event.relatedTarget)) scheduleDirectoryClose();
});
directoryBubble.addEventListener('click', function (event) {
  event.stopPropagation();
  if (event.pointerType === 'touch') setDirectoryOpen(!layout.classList.contains('directory-open'));else setDirectoryOpen(true);
});
document.addEventListener('pointerdown', function (event) {
  if (event.pointerType === 'touch' && !sidebar.contains(event.target)) setDirectoryOpen(false);
});
$('stageNav').textContent = STAGE + ' · 人工智能通识';
$('courseHeroTitle').textContent = STAGE + ' AI 通识学习空间';
$('unitStat').textContent = units.length + ' 个单元';
$('topicStat').textContent = allTopics.length + ' 个知识点';
var launchParams = bootParams;
var launchTopic = Number(launchParams.get('topic'));
var launchQuestion = (launchParams.get('q') || '').trim();
var launchHistoryId = Number(launchParams.get('historyId'));
var initialTopic = byId.has(launchTopic) ? launchTopic : firstId;
try {
  selectTopic(initialTopic);
} catch (e) {
  console.error('初始化失败:', e);
}
if (Number.isInteger(launchHistoryId) && launchHistoryId > 0) {
  loadSavedHistory(launchHistoryId);
} else if (launchQuestion) {
  // 首页问题会在课程页中继续成为本次 AI 对话的第一条问题。
  setTimeout(function () {
    return sendQuestion(launchQuestion);
  }, 80);
}

// ====== 编程练习 ======
var codingHintLeft = 3;
var codingRunning = false;
var codingCurrentId;
function loadCodingExercise(topicId) {
  var exercises = window.CODING_EXERCISES || {};
  var ex = exercises[topicId];
  if (!ex) {
    // 没有对应练习，显示默认
    $('codingHeroTitle').textContent = '编程练习';
    $('codingHeroSub').textContent = '该知识点暂无编程练习';
    $('codingDiff').textContent = '难度 -';
    $('codingDesc').innerHTML = '<p>该知识点的编程练习正在制作中，敬请期待～</p>';
    $('codingGoals').innerHTML = '<li>敬请期待</li>';
    $('codingEditor').value = '# 该知识点暂无编程练习\n# 可以试试其他有编程练习的知识点';
    $('codingOutput').textContent = '暂无练习';
    codingHintLeft = 0;
    updateCodingHints();
    updateCodingLineNumbers();
    return;
  }
  codingCurrentId = topicId;
  codingHintLeft = 3;

  // 标题
  $('codingHeroTitle').textContent = ex.title;
  $('codingHeroSub').textContent = ex.category || '编程练习';

  // 难度
  var diff = ex.difficulty || 1;
  var stars = '★'.repeat(diff) + '☆'.repeat(5 - diff);
  $('codingDiff').textContent = '难度 ' + stars;

  // 描述
  var descLines = ex.description.split('\n').filter(function (l) {
    return l.trim();
  });
  var descHtml = '';
  descLines.forEach(function (line, i) {
    if (i === 0) descHtml += '<p><strong>' + line + '</strong></p>';else descHtml += '<p>' + line + '</p>';
  });
  $('codingDesc').innerHTML = descHtml;

  // 学习目标
  var goalsHtml = (ex.goals || []).map(function (g) {
    return '<li>' + g + '</li>';
  }).join('');
  $('codingGoals').innerHTML = goalsHtml;

  // 代码
  $('codingEditor').value = ex.initialCode || '# 在这里写代码';
  updateCodingLineNumbers();

  // 提示
  $('codingHintContent').hidden = true;
  $('codingHintContent').innerHTML = '';
  updateCodingHints();

  // 输出
  $('codingStatusDot').className = 'coding-status-dot';
  $('codingOutput').textContent = '点击运行按钮查看结果';
}
function updateCodingHints() {
  var btn = $('codingHintBtn');
  var count = $('codingHintCount');
  if (codingHintLeft <= 0) {
    btn.disabled = true;
    btn.textContent = '提示已用完';
    count.textContent = '0 次机会';
  } else {
    btn.disabled = false;
    btn.textContent = codingHintLeft === 3 ? '查看提示' : '再看一个提示';
    count.textContent = codingHintLeft + ' 次机会';
  }
}
function updateCodingLineNumbers() {
  var editor = $('codingEditor');
  var lines = editor.value.split('\n');
  var html = '';
  for (var i = 1; i <= lines.length; i++) html += i + '\n';
  $('codingLineNumbers').textContent = html.trim();
}

// 编程练习事件绑定（用 try-catch 保护，出错不影响核心功能）
try {
  $('codingEditor').addEventListener('input', updateCodingLineNumbers);
  $('codingEditor').addEventListener('scroll', function () {
    $('codingLineNumbers').scrollTop = $('codingEditor').scrollTop;
  });
  $('codingEditor').addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      var ed = $('codingEditor');
      var start = ed.selectionStart,
        end = ed.selectionEnd;
      ed.value = ed.value.substring(0, start) + '    ' + ed.value.substring(end);
      ed.selectionStart = ed.selectionEnd = start + 4;
      updateCodingLineNumbers();
    }
  });

  // 提示按钮
  $('codingHintBtn').addEventListener('click', function () {
    if (codingHintLeft <= 0) return;
    var exercises = window.CODING_EXERCISES || {};
    var ex = exercises[codingCurrentId];
    if (!ex || !ex.hints || ex.hints.length === 0) return;
    codingHintLeft--;
    var showCount = 3 - codingHintLeft;
    var shown = ex.hints.slice(0, showCount);
    var html = '';
    shown.forEach(function (h, i) {
      html += '<strong>提示 ' + (i + 1) + '：</strong>' + h + '<br><br>';
    });
    $('codingHintContent').innerHTML = html;
    $('codingHintContent').hidden = false;
    updateCodingHints();
  });

  // 重置按钮
  $('codingResetBtn').addEventListener('click', function () {
    if (!confirm('确定要重置代码吗？')) return;
    var exercises = window.CODING_EXERCISES || {};
    var ex = exercises[codingCurrentId];
    if (ex) {
      $('codingEditor').value = ex.initialCode || '';
      updateCodingLineNumbers();
    }
    $('codingStatusDot').className = 'coding-status-dot';
    $('codingOutput').textContent = '点击运行按钮查看结果';
  });

  // 运行按钮
  $('codingRunBtn').addEventListener('click', function () {
    if (codingRunning) return;
    codingRunning = true;
    var code = $('codingEditor').value;
    var runBtn = $('codingRunBtn');
    $('codingStatusDot').className = 'coding-status-dot running';
    $('codingOutput').innerHTML = '<span style="color:#818cf8">正在运行...</span>';
    runBtn.disabled = true;
    setTimeout(function () {
      var result = checkCodingCode(code);
      if (result.success) {
        $('codingStatusDot').className = 'coding-status-dot success';
        $('codingOutput').innerHTML = result.output.split('\n').map(function (l) {
          return '<span style="color:#86efac">' + escapeHtml2(l) + '</span>';
        }).join('\n');
      } else {
        $('codingStatusDot').className = 'coding-status-dot error';
        $('codingOutput').innerHTML = result.output.split('\n').map(function (l) {
          return l.startsWith('Traceback') || l.startsWith('  File') || l.startsWith('    ') ? '<span style="color:#fde68a">' + escapeHtml2(l) + '</span>' : '<span style="color:#fca5a5">' + escapeHtml2(l) + '</span>';
        }).join('\n');
      }
      codingRunning = false;
      runBtn.disabled = false;
    }, 700);
  });
} catch (codingErr) {
  console.error('编程练习事件绑定失败:', codingErr);
  // 出错时隐藏编程练习标签，避免用户点了没反应
  try {
    var ct = $('codingTab');
    if (ct) ct.setAttribute('hidden', '');
  } catch (e) {}
}
function escapeHtml2(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
function checkCodingCode(code) {
  var trimmed = code.trim();
  var exercises = window.CODING_EXERCISES || {};
  var ex = exercises[codingCurrentId];
  var id = codingCurrentId;
  if (!trimmed || trimmed.startsWith('# 在这里')) {
    return {
      success: false,
      output: '代码还没有写内容哦，试试看吧！'
    };
  }

  // 通用检查逻辑
  var checks = getCodingChecks(id);
  if (!checks.syntax(trimmed)) {
    return {
      success: false,
      output: checks.syntaxError || '代码好像有问题，再检查一下吧～'
    };
  }
  var checkResult = checks.check(trimmed);
  if (!checkResult.pass) {
    return {
      success: false,
      output: checkResult.message
    };
  }
  return {
    success: true,
    output: checks.successOutput || '运行成功！代码通过了测试 ✅'
  };
}
function getCodingChecks(id) {
  var checks = {
    default: {
      syntax: function syntax() {
        return true;
      },
      check: function check(c) {
        if (/print\s*\(/.test(c) && /["']/.test(c)) return {
          pass: true
        };
        return {
          pass: false,
          message: '试试用 print() 输出一些内容吧！'
        };
      },
      successOutput: 'Hello, AI!\n\n运行成功！'
    }
  };
  var sortCheck = {
    syntax: function syntax(c) {
      if (c.includes('def ') && !c.includes(':')) return false;
      return true;
    },
    check: function check(c) {
      var hasDef = /def\s+(bubble|selection)_sort\s*\(/.test(c);
      var hasLoop = /for\s+.*\s+in\s+range/.test(c);
      var hasSwap = /,\s*.*\s*=\s*.*,\s*/.test(c) || /tmp\s*=/.test(c);
      if (!hasDef) return {
        pass: false,
        message: '记得定义排序函数哦！\n函数名应该是 bubble_sort 或 selection_sort'
      };
      if (!hasLoop) return {
        pass: false,
        message: '函数定义好了，接下来写循环来实现排序吧！\n提示：需要两层 for 循环'
      };
      if (!hasSwap) return {
        pass: false,
        message: '有循环了，再加上元素交换的逻辑就更好了！\n提示：如果前一个比后一个大，就交换它们'
      };
      return {
        pass: true
      };
    },
    successOutput: '排序结果: [1, 2, 3, 5, 8, 9]\n\n✅ 所有测试通过！'
  };
  checks['339'] = sortCheck;
  checks['340'] = sortCheck;
  var searchCheck = {
    syntax: function syntax() {
      return true;
    },
    check: function check(c) {
      var hasDef = /def\s+(bfs|dfs)\s*\(/.test(c);
      var hasLoop = /for\s+.*\s+in\s+/.test(c);
      if (!hasDef) return {
        pass: false,
        message: '请定义 bfs 或 dfs 函数来实现搜索算法'
      };
      if (!hasLoop) return {
        pass: false,
        message: '函数定义好了，接下来写遍历逻辑吧！\n提示：用队列(BFS)或栈(DFS)来存待访问节点'
      };
      return {
        pass: true
      };
    },
    successOutput: "BFS访问顺序: ['A', 'B', 'C', 'D', 'E', 'F']\n\n✅ 所有测试通过！"
  };
  checks['268'] = searchCheck;
  checks['269'] = searchCheck;
  var mlCheck = function mlCheck(funcName, hint) {
    return {
      syntax: function syntax() {
        return true;
      },
      check: function check(c) {
        var hasDef = new RegExp('def\\s+' + funcName + '\\s*\\(').test(c);
        if (!hasDef) return {
          pass: false,
          message: '请定义 ' + funcName + ' 函数哦～'
        };
        if (!/for\s+/.test(c) && !/import/.test(c)) return {
          pass: false,
          message: hint
        };
        return {
          pass: true
        };
      },
      successOutput: '运行成功！函数定义正确 ✅\n\n（完整的测试需要更多数据验证）'
    };
  };
  checks['288'] = mlCheck('knn_predict', '提示：计算距离、排序、投票，三步实现 KNN');
  checks['287'] = mlCheck('kmeans', '提示：随机中心点 → 分配 → 更新中心，反复迭代');
  checks['285'] = mlCheck('linear_regression', '提示：用最小二乘法计算斜率和截距');
  checks['280'] = mlCheck('entropy', '提示：熵 = -Σ(p * log2(p))，先算每个类别的比例');
  checks['293'] = mlCheck('perceptron', '提示：加权求和 + 阶跃激活函数');
  checks['292'] = mlCheck('sigmoid', '提示：sigmoid(x) = 1 / (1 + exp(-x))');
  checks['301'] = mlCheck('gradient_descent', '提示：w = w - lr * 梯度，反复迭代');
  checks['313'] = mlCheck('convolve2d', '提示：双重循环滑动卷积核，对应位置相乘相加');
  checks['252'] = mlCheck('word_frequency', '提示：用字典统计每个词出现的次数');
  checks['228'] = mlCheck('char_frequency', '提示：遍历字符串，用字典统计每个字符的次数');
  checks['328'] = mlCheck('train_gan', '提示：生成器和判别器交替训练，相互博弈');
  return checks[id] || checks.default;
}

// 全局错误捕获，防止某个功能出错导致全页瘫痪
window.addEventListener('error', function (e) {
  console.error('页面错误:', e.error || e.message);
});
