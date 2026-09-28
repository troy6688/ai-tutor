/* AI 智课 · 互动动画 Studio（纯 JS 冒泡排序可视化）
 * 数据驱动：只渲染 currentPoint.template 非空的知识点；
 * 后端 /api/animations/preview 做模板归属校验。
 */
(function () {
  const TEMPLATE_TITLES = { 'bubble-sort': '冒泡排序：让数字排好队' };
  let currentPoint = null;
  let playToken = 0;

  const $ = (id) => document.getElementById(id);
  const supportsAnimation = () => !!(currentPoint && currentPoint.template);

  function setStatus(text, level) {
    const el = document.getElementById('animStatus');
    if (!el) return;
    el.textContent = text;
    el.style.color = level === 'error' ? '#c05a5a' : '#6c78a1';
  }

  function scenePayload() {
    return {
      template: currentPoint.template,
      knowledge_point_id: currentPoint.id,
      title: TEMPLATE_TITLES[currentPoint.template] || currentPoint.title,
      values: readValues(),
      grade: currentPoint.grade || '小学高年级',
      theme: 'light',
      narration: false,
    };
  }

  function readValues() {
    const raw = (document.getElementById('animInput')?.value || '').trim();
    if (!raw) return [];
    const arr = raw.split(/[,\s，、]+/).map(Number).filter(n => Number.isFinite(n));
    return arr.slice(0, 12);
  }

  function showMode(mode) {
    if (mode === 'animation' && !supportsAnimation()) mode = 'video';
    const videoHost = document.getElementById('videoWrap');
    const animHost = document.getElementById('animationPlayer');
    const videoTab = document.getElementById('videoTab');
    const animTab = document.getElementById('animationTab');
    if (!videoHost || !animHost) return;
    const isAnim = mode === 'animation';
    videoHost.style.display = isAnim ? 'none' : '';
    animHost.style.display = isAnim ? '' : 'none';
    if (videoTab) videoTab.setAttribute('aria-selected', String(!isAnim));
    if (animTab) animTab.setAttribute('aria-selected', String(isAnim));
    if (isAnim) refresh();
  }

  function buildShell(host) {
    host.innerHTML = `
      <div style="padding:16px;background:#fafbff;border-radius:12px">
        <div style="font-weight:800;color:#2b3a63;margin-bottom:10px" id="animTitle">互动动画</div>
        <div id="animStage" style="display:flex;align-items:flex-end;gap:10px;height:180px;padding:10px 6px;border-bottom:2px solid #dfe4ee"></div>
        <div style="display:flex;gap:8px;margin-top:12px;align-items:center">
          <input id="animInput" placeholder="如 9,1,7,3,2" style="flex:1;border:1px solid #dfe4ee;border-radius:8px;padding:7px 10px;font-size:13px">
          <button id="animRefresh" style="border:0;background:#6e63ff;color:#fff;border-radius:8px;padding:8px 14px;font-size:13px;cursor:pointer">刷新动画</button>
        </div>
        <div id="animStatus" style="margin-top:10px;font-size:12px;color:#6c78a1">准备加载…</div>
      </div>`;
    document.getElementById('animRefresh').addEventListener('click', () => refresh());
  }

  function drawBars(values, opts) {
    const stage = document.getElementById('animStage');
    const max = Math.max(...values, 1);
    const n = values.length;
    stage.innerHTML = '';
    values.forEach((v, i) => {
      const bar = document.createElement('div');
      const h = Math.round(40 + (v / max) * 130);
      const color = opts.done.includes(i) ? '#28a865'
        : (opts.compare && opts.compare.includes(i) ? '#ff9f2e' : '#6e63ff');
      bar.style.cssText = `flex:1;height:${h}px;background:${color};border-radius:6px 6px 0 0;display:flex;align-items:flex-end;justify-content:center;color:#fff;font-size:12px;font-weight:700;transition:height .3s,background .25s;padding-bottom:4px;min-width:22px`;
      bar.textContent = v;
      stage.append(bar);
    });
  }

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  async function playBubble(values) {
    const token = ++playToken;
    const arr = [...values];
    const n = arr.length;
    const done = [];
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        if (token !== playToken) return;
        setStatus(`第 ${i + 1} 轮：比较 ${arr[j]} 和 ${arr[j + 1]}`);
        drawBars(arr, { compare: [j, j + 1], done });
        await sleep(550);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setStatus(`${arr[j + 1]} 更大，交换位置`);
          drawBars(arr, { compare: [j, j + 1], done });
          await sleep(450);
        }
      }
      done.push(n - 1 - i);
      setStatus(`第 ${i + 1} 轮结束，${arr[n - 1 - i]} 已就位`);
      drawBars(arr, { done });
      await sleep(350);
    }
    setStatus('✓ 排序完成！', 'ok');
  }

  async function refresh() {
    if (!supportsAnimation()) return;
    const host = document.getElementById('animationPlayer');
    if (!host) return;
    if (!host.firstChild) buildShell(host);
    setStatus('请求动画场景…');
    try {
      const res = await fetch('/api/animations/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scenePayload()),
      });
      const json = await res.json();
      if (!res.ok || json.code !== 0) throw new Error(json.detail || '动画加载失败');
      const d = json.data;
      document.getElementById('animTitle').textContent = d.title;
      const input = document.getElementById('animInput');
      if (input && !input.value) input.value = d.values.join(',');
      playBubble(d.values);
    } catch (e) {
      setStatus('动画加载失败：' + e.message, 'error');
    }
  }

  function loadPoint(point) {
    currentPoint = point;
    playToken++;
    const tab = document.getElementById('animationTab');
    const host = document.getElementById('animationPlayer');
    if (supportsAnimation()) {
      if (tab) tab.removeAttribute('hidden');
      setStatus('切换到互动动画后加载', 'idle');
    } else {
      if (tab) tab.setAttribute('hidden', '');
      if (host) host.replaceChildren();
      setStatus('本知识点暂无互动动画', 'idle');
    }
    showMode('video');
  }

  window.animationStudio = { loadPoint, showMode, supportsAnimation };
})();
