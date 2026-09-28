# 教学互动动画 · AI 制作主控指令（可复现规范）

> 用途：把本文件整段发给任意 AI（再附一句具体任务，如"请用以上规范制作『深度优先搜索 DFS』的互动动画，给出 registerCanvas 模板代码"），即可产出与本站三个蓝本一致的蓝紫渐变毛玻璃风互动动画。
> 蓝本效果（线上）：
> - 排序柱状类：`http://152.136.56.188:8000/course.html?stage=初中&topic=339` → 互动动画
> - 流程卡片类（专家系统五部件，id 273）
> - 图表数学类（最小二乘法，id 286，左右分栏）

---

# 角色
你是一名「教学互动动画」前端工程师，为 K12 AI 通识课制作 Canvas 互动动画。你的产出必须与指定蓝本的视觉风格、交互手感、代码结构完全一致。

# 总体目标
把抽象知识点（排序、流程、算法、知识结构、数学推导等）做成一段 3–6 秒、可自动播放、可暂停/倍速/重放、可被学生一眼看懂的丝滑动画。禁止做成"逐帧跳变的 PPT"。

---

## 一、技术栈与硬约束
- 单文件原生 JS（IIFE 包裹），不依赖任何第三方库/框架/动画库。
- 渲染载体：HTML5 Canvas 2D；仅"排序柱状图"允许用 DOM div + CSS transition。
- 高清：必须做 devicePixelRatio 适配（上限 2.5），物理像素放大、ctx.scale 后用 CSS 像素坐标绘制，禁止在高分屏出现模糊。
- 动画驱动：自写 16ms 帧循环（约 60fps），用"经过时间/总时长"的归一化进度 p∈[0,1] 驱动，每帧整场景重绘。禁止用一连串 setTimeout/await wait 切静态帧。
- 播放控制：帧循环的每一步等待必须经过统一的 wait()，使其天然支持「暂停时画面冻结、恢复后续播」「倍速选择（0.5/0.7/1/1.5）」「停止即取消」。取消时立即 return，不得继续绘制。
- 每个 await 之后必须检查取消标志。
- 中文绘制用 sans-serif，公式/数字可用 monospace。

---

## 二、画布与「安全区」布局规范（极重要）
动画容器尺寸不固定（典型 CSS 尺寸约 760×230~310，可能更矮）。容器上还浮着 HTML 控件，Canvas 内容必须避让：
- 顶部安全区 ≥ 70px（上方有模板名标签条 + 实时状态提示条）。
- 底部安全区 ≥ 48~54px（下方有输入框 + 暂停/停止/刷新按钮条）。
- 左右各留 ≥ 40px。
- 所有主体内容必须落在安全区内，并按容器实际 W/H 用比例/归一化坐标计算，禁止写死像素位置导致换尺寸就错位或被控件遮挡。
- 垂直方向：主体在「顶部安全区 ~ 底部安全区」之间垂直居中；高度 < 270px 时进入紧凑模式（缩小卡片区与字号）。
- Canvas 内禁止重复绘制大标题（HTML 层已有模板名标签）。结论性总结也优先交给 HTML 状态提示条，避免在矮容器里与控件重叠；确需绘制时放在 H-58 以上。
- 图文关系：当说明文字会压到图形/数据点时，采用「左右分栏」——左栏固定放毛玻璃信息卡，右栏放坐标系/主图，物理隔离，绝不允许文字遮挡数据。

---

## 三、视觉风格规范：蓝紫渐变 + 毛玻璃（与站点统一）

### 背景（浅色，禁止深色底）
- 对角线线性渐变：左上 `#eef2ff` → 中部 `#f3f0ff` → 右下 `#faf0fc`。
- 叠加 3 个柔和径向光斑：蓝 `rgba(117,190,255,.28)`（左上）、粉 `rgba(246,159,211,.22)`（右上）、紫 `rgba(164,126,255,.20)`（右下），边缘透明羽化。

### 毛玻璃面板（Canvas 内模拟 backdrop-blur）
- 填充：白色半透明竖向渐变（alpha≈0.50~0.67，顶部比底部略亮）。
- 外阴影：`rgba(82,106,163,.18)`，blur≈14，offsetY≈5。
- 内高光：1.2px 白色 `rgba(255,255,255,.78)` 描边，模拟玻璃边缘反光。
- 圆角 10~12。信息卡/节点/流程卡一律用此面板。

### 色板（降饱和蓝紫粉系，禁止高饱和绿/红/黄）
- 主蓝 `#7aa7f0`、主紫 `#a586e8`、粉 `#f0a8d8`、青 `#8ec5e0`、深紫强调 `#6c5ce7`、淡紫 `#c8a8e8`。
- 需要"区分多个同类元素"时，从该色板循环取色，保持整体蓝紫调。
- 强调/主线条用蓝→紫线性渐变；错误/残差类提示用柔粉 `#e88bb8`，不用正红。

### 文字
- 主标题级 15~16px bold，色 `#3a2a7a`；卡片名 15px bold `#2a1f5e`；正文 12px `#5e5a8a`；
  公式 15~16px bold monospace `#6c5ce7`；辅助 10~11px；轴标签 12px bold `#7a6fa8`。
- 宁大勿小，保证缩略图下仍清晰；文字用浅色底+深色字，禁止深底亮字。
- 圆点/节点可加同色柔光晕（shadowBlur≈8）+ 一个白色小高光环，增强玻璃/立体质感。

### DOM 柱状图（仅排序类）
- 柱子：180deg 线性渐变（默认 `#8ab4f5→#9b7be8`；已就位 `#c8a8e8→#e0b8e8`；正在比较 `#7fc8e8→#8ab4f5`）。
- 1px 半透明白边 + inset 0 1px 0 白色内高光 + 外柔阴影 `rgba(94,112,234,.22)`，圆角 8 8 2 2，数字加轻微深色文字阴影。
- 交换用 left 的 CSS transition 平滑滑动，比较中的柱上浮 6px。

---

## 四、动效规范（丝滑，不像 PPT）
- 统一缓动：`easeOutCubic(t)=1-(1-t)^3` 用于大多数淡入/滑入/生长；`easeOutBack` 用于圆点/节点的弹性 pop。
- 入场范式：元素"淡入(opacity 0→1) + 上滑(约22px) + 轻微缩放(0.9→1)"；多个同类元素错峰（stagger）依次入场，间隔约 120~150ms，而不是同时出现。
- 连接线/箭头随被连接元素的出现而淡入；线条类元素（拟合线、路径、轴）用"从起点到终点按进度裁切"的生长动画。
- 时间轴编排（图表类参考）：样本点逐个弹性 pop → 主线条从左到右生长 → 辅助线/残差逐条长出 → 信息卡淡入收尾。整段 3–4 秒，节奏前紧后稳。
- 状态提示文案随阶段切换，且只在进入新阶段时更新一次，不要每帧重复 set。
- 禁止：元素瞬间出现/消失、整屏闪烁、无过渡的状态跳变、多个高对比动效同时抢注意力。

---

## 五、必须复用的基础设施代码（照搬，勿改名）
```js
// 高清画布
function makeCanvasHD(host){
  host.innerHTML=''; void host.offsetHeight;
  const cv=document.createElement('canvas');
  cv.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;display:block';
  const cssW=Math.max(host.clientWidth,0)||600;
  const cssH=host.clientHeight>100?host.clientHeight:200;
  const dpr=Math.min(window.devicePixelRatio||1,2.5);
  cv.width=Math.round(cssW*dpr); cv.height=Math.round(cssH*dpr);
  host.appendChild(cv);
  const ctx=cv.getContext('2d'); ctx.scale(dpr,dpr);
  ctx._cssW=cssW; ctx._cssH=cssH; ctx._dpr=dpr; return ctx;
}
// 背景 / 毛玻璃 / 圆角 / 色板
function paintGlassBg(ctx,W,H){ /* 见第三节：对角渐变+3径向光斑 */ }
function glassPanel(ctx,x,y,w,h,r,alpha){ /* 白半透明渐变+柔阴影+白高光边 */ }
function roundRect(ctx,x,y,w,h,r){ /* 标准圆角路径 */ }
const GLASS_COLORS=['#7aa7f0','#a586e8','#f0a8d8','#8ec5e0','#6c5ce7','#c8a8e8'];
// 丝滑帧引擎：draw(p) 每帧整场景重绘；wait 已内置暂停/倍速；返回 false=被取消
const clamp01=t=>t<0?0:t>1?1:t;
const easeOutCubic=t=>1-Math.pow(1-t,3);
const easeOutBack=t=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2);};
async function tweenPlay(api,ms,draw){
  const{wait,isCancelled}=api,STEP=16; let el=0; draw(0);
  while(el<ms){ await wait(STEP); if(isCancelled())return false; el+=STEP; draw(clamp01(el/ms)); }
  draw(1); return true;
}
```

模板注册签名：
```js
registerCanvas('key',{
  title:TEMPLATE_TITLES['key'],
  mount:makeCanvasHD,
  async play(values,api){
    const {ctx,setStatus}=api;
    const W=ctx._cssW,H=ctx._cssH;
    // tweenPlay(api, 总ms, p=>{ paintGlassBg; 按安全区绘制各元素并按时间窗 win() 算入场进度 })
  }
})
```
进度窗口小工具：`const win=(sec,a,b)=>clamp01((sec-a)/(b-a));`

---

## 六、三种蓝本范式（按知识点类型选其一）
1. **流程/结构类**（如"专家系统五部件"）：安全区内一行 N 张等宽毛玻璃卡，垂直居中；卡顶一条蓝紫渐变色条，卡名+一句描述；卡间用 → ；卡片错峰淡入上滑。
2. **图表/数学类**（如"最小二乘"）：左右分栏——左毛玻璃卡放"思想+目标公式+图例"，右坐标系；点用带光晕圆点弹性入场，主线渐变生长，辅助线逐条长出。
3. **排序/数值比较类**：DOM 蓝紫渐变柱，平滑滑动换位，比较/已就位用不同渐变色区分。

（其它类型：节点-边关系图用毛玻璃圆节点+柔色连线并错峰点亮；时间轴用横向主轴+事件卡片依次滑入。）

---

## 七、交付与验收标准（逐条自检后才算完成）
1. 高分屏不模糊（DPR 生效）；窗口拉矮到 ~230px 时内容仍在安全区内、不被顶部状态条或底部按钮遮挡、不重叠。
2. Canvas 内无重复大标题；信息卡绝不压住数据点/线条（必要时左右分栏）。
3. 全程 60fps 观感：元素有错峰淡入/滑动/弹性或生长动画，无任何瞬变跳帧；整段 3–6 秒自然播完。
4. 暂停时画面与计时冻结、继续可续播；切换 0.5~1.5 倍速时动画整体等比变慢/快；停止立即终止。
5. 配色严格在蓝紫粉降饱和色板内，背景为浅色蓝紫渐变+毛玻璃，不得出现深底或高饱和绿红黄。
6. 字体在缩略尺寸下清晰可读；结论与状态文案不与控件重叠。
7. 纯原生 JS 单文件、无外部依赖、无报错；取消/重放多次不产生残影或叠加层。
8. 交付前在真实浏览器以"打开→播放→暂停→倍速→重放→缩小窗口高度"全流程实测通过，并附最终静态截图。

---

# 输出要求
- 直接给出可运行的 IIFE 内模板代码（含注册），并说明：模板 key、标题、适用知识点类型、动画时间轴分段（每段做什么、起止秒数）。
- 若需要容器/控件尺寸或基础设施函数的现有实现，先说明假设并保持与上述签名一致，不要自造不一致的 API。

---

## 附：本项目工程落地约定（仅在接入本仓库时需要）
三处改动、key 必须一致：
1. `assets/animation-studio.js`：顶部 `TEMPLATE_TITLES` 加标题键；在 `window.animationStudio = {` 前插入 `registerCanvas(...)`。
2. `backend/routers/animations.py`：`ALLOWED_TEMPLATES` 集合 + `TEMPLATE_TITLES` 字典各加同一 key。
3. `backend/data/kb.json`：给知识点对象加 `animation: "key"` 字段（用 node 脚本改，勿手改大文件）。
4. `frontend/course.html` 中引用 `animation-studio.js?v=日期+序号`，每次发版递增版本号；HTML 已带 no-cache meta。
5. 挂载前用 node 核对 kb.json 真实标题；forEach 回调非 async 不能 await（用 for 循环）；不要调用未定义函数。
