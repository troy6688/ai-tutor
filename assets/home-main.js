if(!getToken()){location.href='index.html';}
try{var u=currentUser();if(u&&u.name)document.getElementById('userName').textContent='你好，'+u.name;}catch(e){}
var stage=currentStage();
var stageData=(window.STAGE_COURSE_DATA&&window.STAGE_COURSE_DATA[stage])||window.STAGE_COURSE_DATA['小学'];

// 用 ES5 方式生成 LESSON_INDEX（替代 flatMap + 展开运算符）
var LESSON_INDEX=[];
(function(){
  var units=stageData.units||[];
  for(var i=0;i<units.length;i++){
    var unit=units[i];
    var sections=unit.sections||[];
    for(var j=0;j<sections.length;j++){
      var section=sections[j];
      var items=section.items||[];
      for(var k=0;k<items.length;k++){
        var item=items[k];
        var newItem={};
        for(var key in item){if(item.hasOwnProperty(key))newItem[key]=item[key];}
        newItem.unit=unit.title;
        newItem.section=section.title;
        LESSON_INDEX.push(newItem);
      }
    }
  }
})();

document.getElementById('stagePill').textContent=stage+'阶段';
document.getElementById('stageCopy').textContent='当前为'+stage+'学习空间 · 我会理解你的问题，并自动进入最相关的课程知识点';

function normalizeText(s){
  return String(s||'').toLowerCase().replace(/[\s"''、，。！？：:；;（）()\-—_]/g,'');
}
function meaningfulQuery(s){
  return normalizeText(s).replace(/请问|可以|能不能|帮我|我想|想知道|什么是|是什么|怎么|如何|为什么|介绍一下|讲一下|讲讲|一下/g,'');
}
function grams(s,n){
  if(n===undefined)n=2;
  var t=normalizeText(s);
  var out=[];
  for(var i=0;i<=t.length-n;i++)out.push(t.slice(i,i+n));
  // 去重（替代 [...new Set(out)]）
  var unique=[];
  var seen={};
  for(var i=0;i<out.length;i++){
    if(!seen[out[i]]){seen[out[i]]=true;unique.push(out[i]);}
  }
  return unique;
}
function matchLesson(question){
  var raw=normalizeText(question);
  var q=meaningfulQuery(question);
  var qgrams=grams(q||raw,2);
  var best=LESSON_INDEX[0];
  var bestScore=-Infinity;
  for(var i=0;i<LESSON_INDEX.length;i++){
    var item=LESSON_INDEX[i];
    var cleanTitle=normalizeText(item.title.replace(/^知识点\s*[0-9.]+\s*[：:]?/,'').trim());
    var keysStr=String(item.keywords||'');
    var keys=keysStr.split(/[，,、]/).map(normalizeText).filter(function(k){return !!k;});
    var section=normalizeText(item.section);
    var unit=normalizeText(item.unit);
    var body=normalizeText(item.explanation);
    var score=0;
    if(cleanTitle && (raw.indexOf(cleanTitle)!==-1||q.indexOf(cleanTitle)!==-1)) score+=72;
    for(var k=0;k<keys.length;k++){
      var key=keys[k];
      if(raw.indexOf(key)!==-1||q.indexOf(key)!==-1) score+=Math.min(56,18+key.length*5);
      else if(key.length>=2 && q && (key.indexOf(q)!==-1||q.indexOf(key)!==-1)) score+=12;
    }
    if(section && (raw.indexOf(section)!==-1||q.indexOf(section)!==-1)) score+=24;
    if(unit && (raw.indexOf(unit)!==-1||q.indexOf(unit)!==-1)) score+=18;
    for(var g=0;g<qgrams.length;g++){
      if(cleanTitle.indexOf(qgrams[g])!==-1) score+=5;
      var keyHas=false;
      for(var kk=0;kk<keys.length;kk++){if(keys[kk].indexOf(qgrams[g])!==-1){keyHas=true;break;}}
      if(keyHas) score+=3;
      if(body.indexOf(qgrams[g])!==-1) score+=0.35;
    }
    if((raw==='ai'||raw==='人工智能'||raw==='什么是人工智能') && i===0) score+=100;
    if(/学习|训练|模型/.test(question) && /学习|训练|模型/.test((item.keywords||'')+item.title)) score+=18;
    if(/图灵/.test(question) && /图灵/.test(item.title+(item.keywords||''))) score+=32;
    if(/隐私|个人信息|信息安全/.test(question) && /隐私|信息安全|个人信息/.test(item.title+(item.keywords||''))) score+=28;
    if(/伦理|责任|公平|偏见/.test(question) && /伦理|责任|公平|偏见/.test(item.title+(item.keywords||''))) score+=24;
    if(score>bestScore){bestScore=score;best=item;}
  }
  return best;
}
function enterCourse(question){
  var q=String(question||'').trim();
  if(!q)return;
  var item=matchLesson(q);
  var params='stage='+encodeURIComponent(stage)+'&topic='+encodeURIComponent(String(item.id))+'&q='+encodeURIComponent(q)+'&from=home';
  window.location.href='course.html?'+params;
}
function openChat(title){enterCourse(title)}
function newChat(){
  document.getElementById('homeInput').value='';
  document.getElementById('thread').classList.remove('active');
  document.getElementById('threadCompose').classList.add('hidden');
  document.getElementById('homeInput').focus();
  var ch=document.querySelector('.chat-home');
  if(ch)ch.scrollTop = 0;
}
function submitHome(){enterCourse(document.getElementById('homeInput').value)}
function sendThread(){enterCourse(document.getElementById('threadInput').value)}
bindEnter('homeInput',function(v){enterCourse(v)});
bindEnter('threadInput',function(v){enterCourse(v)});

// ====== 删除历史记录 ======
function deleteHistory(e, id) {
  e.stopPropagation();
  if (!confirm('确定要删除这条对话记录吗？')) return;
  var item = document.querySelector('.history-item[data-id="' + id + '"]');
  if (item) {
    item.style.transition = 'all 0.3s';
    item.style.opacity = '0';
    item.style.height = item.offsetHeight + 'px';
    setTimeout(function() {
      item.style.height = '0';
      item.style.padding = '0';
      item.style.margin = '0';
      item.style.overflow = 'hidden';
      setTimeout(function() {
        item.remove();
        var groups = document.querySelectorAll('.history-group');
        for(var g=0;g<groups.length;g++){
          var items = groups[g].querySelectorAll('.history-item');
          if (items.length === 0) groups[g].remove();
        }
        var histEl = document.getElementById('history');
        var allItems = histEl.querySelectorAll('.history-item');
        if (allItems.length === 0) {
          histEl.innerHTML = '<div style="text-align:center;padding:30px 10px;color:#9ca3af;font-size:13px"><div style="font-size:32px;margin-bottom:8px;opacity:0.5">📭</div>暂无对话记录</div>';
        }
      }, 300);
    }, 100);
  }
}

// ====== 个性化推荐 ======
(function() {
  var hour = new Date().getHours();
  var greeting = hour < 6 ? '夜深了，注意休息哦' :
                   hour < 12 ? '早上好，开启今天的学习吧' :
                   hour < 14 ? '中午好，休息一下再学习吧' :
                   hour < 18 ? '下午好，继续加油学习' :
                   '晚上好，今天学得怎么样';
  document.getElementById('searchGreeting').textContent = greeting;

  function findLessonById(id) {
    for(var i=0;i<LESSON_INDEX.length;i++){
      if(String(LESSON_INDEX[i].id)===String(id))return LESSON_INDEX[i];
    }
    return null;
  }

  function getLessonDesc(lesson) {
    if (!lesson) return '';
    var exp = lesson.explanation || '';
    return exp.replace(/<[^>]+>/g, '').slice(0, 50) + '…';
  }

  function generateRecommendations() {
    return apiRequest('/api/stats').then(function(stats) {
      var recent = stats.recent || [];
      var cardsContainer = document.getElementById('recommendCards');
      cardsContainer.innerHTML = '';
      var cards = [];

      // 1. 继续学习：最近学过的知识点
      if (recent.length > 0) {
        var lastLesson = findLessonById(recent[0].topic_id) || findLessonById(recent[0].lesson_id);
        if (lastLesson) {
          var progressPct = stats.by_grade && lastLesson.grade ?
            Math.round((stats.by_grade[lastLesson.grade]?.done || 0) / (stats.by_grade[lastLesson.grade]?.total || 1) * 100) : 0;
          cards.push({
            tag: 'continue',
            tagText: '继续学习',
            title: lastLesson.title,
            desc: getLessonDesc(lastLesson),
            meta: '上次得分 ' + (recent[0].score !== undefined ? recent[0].score + '分' : '继续上次进度') + ' · 进度 ' + progressPct + '%',
            lessonId: lastLesson.id
          });
        }
      }

      // 2. 薄弱知识点复习（得分低于70分的优先推荐）
      var weakLessons = [];
      if (recent.length > 0) {
        var sorted = recent.slice().sort(function(a, b) { return (a.score || 0) - (b.score || 0); });
        for (var w = 0; w < sorted.length && w < 2; w++) {
          if ((sorted[w].score || 0) < 70) {
            var weakLesson = findLessonById(sorted[w].topic_id) || findLessonById(sorted[w].lesson_id);
            if (weakLesson) weakLessons.push({ lesson: weakLesson, score: sorted[w].score || 0 });
          }
        }
      }

      // 根据时间段调整推荐策略
      var hour = new Date().getHours();
      var isReviewTime = hour >= 19 || hour < 6; // 晚上/深夜适合复习
      var isMorningTime = hour >= 6 && hour < 12; // 早上适合学新内容

      // 2a. 复习时段优先推薄弱知识点
      if (isReviewTime && weakLessons.length > 0) {
        for (var wi = 0; wi < weakLessons.length && cards.length < 3; wi++) {
          var wl = weakLessons[wi];
          var alreadyIn = false;
          for(var c2=0;c2<cards.length;c2++){if(String(cards[c2].lessonId)===String(wl.lesson.id)){alreadyIn=true;break;}}
          if (!alreadyIn) {
            cards.push({
              tag: 'review',
              tagText: '建议复习',
              title: wl.lesson.title,
              desc: '正确率 ' + wl.score + ' 分，趁睡前巩固一下',
              meta: '薄弱知识点 · ' + wl.lesson.section,
              lessonId: wl.lesson.id
            });
          }
        }
      }

      // 3. 下一步推荐：找到下一个未学的知识点
      var learnedIds = recent.map(function(r) { return String(r.point_id || r.lesson_id); });
      var nextLesson = null;
      // 优先找有互动动画的下一个知识点
      for (var i = 0; i < LESSON_INDEX.length; i++) {
        if (learnedIds.indexOf(String(LESSON_INDEX[i].id)) === -1) {
          if (!nextLesson) nextLesson = LESSON_INDEX[i];
          // 如果有互动动画，直接选这个
          if (LESSON_INDEX[i].animation) {
            nextLesson = LESSON_INDEX[i];
            break;
          }
        }
      }

      // 如果都学完了，推荐正确率最低的知识点复习
      if (!nextLesson && recent.length > 0) {
        var sorted2 = recent.slice().sort(function(a, b) { return (a.score || 0) - (b.score || 0); });
        var worstLesson = findLessonById(sorted2[0].topic_id) || findLessonById(sorted2[0].lesson_id);
        if (worstLesson) {
          var alreadyIn2 = false;
          for(var c3=0;c3<cards.length;c3++){if(String(cards[c3].lessonId)===String(worstLesson.id)){alreadyIn2=true;break;}}
          if (!alreadyIn2) {
            cards.push({
              tag: 'review',
              tagText: '建议复习',
              title: worstLesson.title,
              desc: '正确率 ' + (sorted2[0].score || 0) + ' 分，建议再巩固一下',
              meta: '薄弱知识点 · 重点复习',
              lessonId: worstLesson.id
            });
          }
        }
      } else if (nextLesson) {
        var alreadyIn3 = false;
        for(var c4=0;c4<cards.length;c4++){if(String(cards[c4].lessonId)===String(nextLesson.id)){alreadyIn3=true;break;}}
        if (!alreadyIn3) {
          var hasAnim = !!nextLesson.animation;
          cards.push({
            tag: 'next',
            tagText: isMorningTime ? '今日新学' : '下一步学习',
            title: nextLesson.title,
            desc: getLessonDesc(nextLesson),
            meta: nextLesson.section + (hasAnim ? ' · 互动动画' : ''),
            lessonId: nextLesson.id
          });
        }
      }

      // 3. 如果卡片不够，用热门/入门知识点补
      if (cards.length < 2) {
        var fallbackLessons = LESSON_INDEX.slice(0, 3);
        for (var i = 0; i < fallbackLessons.length && cards.length < 2; i++) {
          var lesson = fallbackLessons[i];
          var alreadyIn = false;
          for(var c=0;c<cards.length;c++){if(String(cards[c].lessonId)===String(lesson.id)){alreadyIn=true;break;}}
          if (!alreadyIn) {
            cards.push({
              tag: 'suggest',
              tagText: '推荐入门',
              title: lesson.title,
              desc: getLessonDesc(lesson),
              meta: lesson.section + ' · 基础必学',
              lessonId: lesson.id
            });
          }
        }
      }

      // 更新推荐数量
      var recCountEl = document.getElementById('recCount');
      if (recCountEl) {
        recCountEl.textContent = '共 ' + cards.length + ' 个推荐';
      }

      // 渲染卡片
      for(var idx=0;idx<cards.length;idx++){
        var card = cards[idx];
        var div = document.createElement('div');
        div.className = 'rec-card';
        div.style.animationDelay = (idx * 0.1) + 's';
        div.onclick = (function(c){
          return function(){
            var p='stage='+encodeURIComponent(stage)+'&topic='+encodeURIComponent(String(c.lessonId))+'&from=recommend';
            window.location.href='course.html?'+p;
          };
        })(card);
        div.innerHTML =
          '<span class="tag ' + card.tag + '">' + escapeHtml(card.tagText) + '</span>' +
          '<h4>' + escapeHtml(card.title) + '</h4>' +
          '<p>' + escapeHtml(card.desc) + '</p>' +
          '<div class="card-footer">' +
            '<span class="meta">' + escapeHtml(card.meta) + '</span>' +
            '<span class="arrow">→</span>' +
          '</div>';
        cardsContainer.appendChild(div);
      }

      // 更多推荐
      var moreRec = document.getElementById('moreRec');
      var moreList = document.getElementById('moreRecList');
      var moreItems = [];
      for (var i = 0; i < LESSON_INDEX.length && moreItems.length < 3; i++) {
        var les = LESSON_INDEX[i];
        var inCards = false;
        for(var c=0;c<cards.length;c++){if(String(cards[c].lessonId)===String(les.id)){inCards=true;break;}}
        var isLearned = learnedIds.indexOf(String(les.id)) !== -1;
        if (!inCards && !isLearned) moreItems.push(les);
      }
      for (var i = 0; i < LESSON_INDEX.length && moreItems.length < 3; i++) {
        var les = LESSON_INDEX[i];
        var inCards2 = false;
        for(var c=0;c<cards.length;c++){if(String(cards[c].lessonId)===String(les.id)){inCards2=true;break;}}
        var inMore = false;
        for(var m=0;m<moreItems.length;m++){if(String(moreItems[m].id)===String(les.id)){inMore=true;break;}}
        if (!inCards2 && !inMore) moreItems.push(les);
      }
      if (moreItems.length > 0 && moreRec && moreList) {
        moreRec.style.display = 'block';
        for(var i=0;i<moreItems.length;i++){
          var les = moreItems[i];
          var div = document.createElement('div');
          div.className = 'more-rec-item';
          div.onclick = (function(l){
            return function(){
              var p='stage='+encodeURIComponent(stage)+'&topic='+encodeURIComponent(String(l.id))+'&from=recommend';
              window.location.href='course.html?'+p;
            };
          })(les);
          div.innerHTML = '<h5>' + les.title + '</h5><span>' + les.section + '</span>';
          moreList.appendChild(div);
        }
      }
    }).catch(function(e) {
      console.error('推荐加载失败:', e);
      showDefaultRecommendations();
    });
  }

  function showDefaultRecommendations() {
    var cardsContainer = document.getElementById('recommendCards');
    var defaultCards = LESSON_INDEX.slice(0, 2);
    cardsContainer.innerHTML = '';
    var tags = [
      { tag: 'suggest', tagText: '推荐入门', meta: '基础必学' },
      { tag: 'next', tagText: '进阶学习', meta: '深入理解' }
    ];
    for(var idx=0;idx<defaultCards.length;idx++){
      var lesson = defaultCards[idx];
      var t = tags[idx] || tags[0];
      var div = document.createElement('div');
      div.className = 'rec-card';
      div.onclick = (function(l,tag){
        return function(){
          var p='stage='+encodeURIComponent(stage)+'&topic='+encodeURIComponent(String(l.id))+'&from=recommend';
          window.location.href='course.html?'+p;
        };
      })(lesson,t);
      div.innerHTML =
        '<span class="tag ' + t.tag + '">' + t.tagText + '</span>' +
        '<h4>' + escapeHtml(lesson.title) + '</h4>' +
        '<p>' + escapeHtml(getLessonDesc(lesson)) + '</p>' +
        '<div class="card-footer">' +
          '<span class="meta">' + escapeHtml(lesson.section) + ' · ' + t.meta + '</span>' +
          '<span class="arrow">→</span>' +
        '</div>';
      cardsContainer.appendChild(div);
    }
  }

  // 初始化推荐
  generateRecommendations().catch(function(e) {
    console.warn('推荐加载失败:', e);
    var rc = document.getElementById('recCount');
    if(rc)rc.textContent = '加载失败';
  });
})();
