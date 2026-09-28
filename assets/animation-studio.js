/* AI 智课 · 互动动画 Studio
 * 架构：可插拔模板 + 适配器。
 *   - BarAdapter：DOM 柱状图（div + CSS transition），适用于排序类动画。
 *   - CanvasAdapter：真 <canvas> 适配器，处理坐标系/曲线/神经网络等复杂动画。
 * 注册新排序类模板：AnimationStudio.register('xxx', { title, async play(values, api) })。
 * 注册 canvas 类模板：AnimationStudio.registerCanvas('xxx', { title, mount(host)->ctx, async play(values, api) })，api.ctx 即 mount 返回的 2D 上下文。
 * 内置模板：bubble-sort、selection-sort（BarAdapter）；forward-prop（CanvasAdapter）。
 */
(function () {
  const TEMPLATE_TITLES = {
    'bubble-sort': '冒泡排序：让数字排好队',
    'selection-sort': '选择排序：每轮挑出最小值',
    'forward-prop': '神经网络前向传播：数值沿网络流动',
    'gradient-descent': '梯度下降：沿曲面滑向最低点',
    'conv-operation': '卷积运算：滑窗扫矩阵出特征图',
    'mlp-xor': '多层感知机：三层网络实现异或',
    'k-means': 'k均值聚类：质心迭代收敛',
    'decision-tree': '决策树：按特征分裂数据',
    'conv-stride': '步长与填充：控制特征图尺寸',
    'bfs-search': '广度优先搜索：逐层扩展访问',
    'knn-classify': 'k近邻：投票决定查询点类别',
    'pooling': '池化层：窗口滑动降维采样',
    'dfs-search': '深度优先搜索：一条路走到底回溯',
    'linear-regression': '线性回归：最小二乘拟合直线',
    'entropy': '信息熵：不确定性的度量',
    'astar-search': 'A*算法：启发式搜索估值函数f=g+h',
    'activation-functions': '激活函数：阶跃/Sigmoid/Tanh/ReLU 对比',
    'tsp-search': '旅行商问题：最近邻贪心访问所有城市',
    'overfitting-curve': '过拟合与泛化：训练误差续降，测试误差U形反弹',
    'random-forest': '随机森林：多棵决策树投票决定类别',
    'cross-entropy': '交叉熵损失：-Σy·log(ŷ) 随预测概率变化',
    'mse-loss': '均方误差损失：MSE=1/n·Σ(y-ŷ)²',
    'learning-rate': '学习率：太小慢、太大发散、适中收敛',
    'lenet5': 'LeNet-5：经典CNN架构数据流',
    'biological-neuron': '生物神经元：细胞体+树突+轴突+突触',
    'artificial-neuron': '人工神经元：加权求和→激活函数→输出',
    'perceptron-gates': '感知机逻辑门：AND/OR 真值表与决策边界',
    'perceptron-xor': 'XOR线性不可分：一条直线切不开',
    'neural-network-concept': '人工神经网络：多层全连接节点图',
    'sgd-minibatch': 'SGD vs BGD vs MBGD：三种梯度下降收敛对比',
    'cnn-concept': 'CNN概念：卷积→池化→全连接分类 pipeline',
    'alexnet': 'AlexNet：8层经典CNN架构（5卷积+3全连接）',
    'information-gain': '信息增益：分裂前后熵减少量',
    'gini-impurity': '基尼不纯度：G=1-Σp² 越小越纯',
    'interaction-overview': '人机交互技术：交互方式演进',
    'voice-pipeline': '语音交互四环节：采集→识别→理解→反馈',
    'multimodal-interaction': '多元新型交互方式：手势/眼动/脑机/VR/AR',
    'image-recognition': '图像识别：预处理→特征→分类→标签',
    'biometric-types': '生物特征识别：指纹/人脸/虹膜/声纹/静脉',
    'nlp-pipeline': '自然语言处理：分词→词性→句法→语义→生成',
    'ml-categories': '机器学习三大类：监督/无监督/强化学习',
    'ai-ml-dl': 'AI⊃ML⊃DL：深度学习是机器学习的子集',
    'single-layer-perceptron': '单层感知机：输入层→输出层（无隐藏层）',
    'deep-network': '深度网络：多隐藏层堆叠',
    'hierarchical-features': '层次化特征：边缘→纹理→部件→对象',
    'dl-triad': '深度学习三驾马车：数据+算法+算力',
    'dataset-zoo': '常用数据集：MNIST/CIFAR/ImageNet/COCO',
    'dataset-split': '数据集划分：训练/验证/测试集',
    'computation-graph': '计算图：节点=运算，边=张量流动',
    'framework-compare': '主流框架：TensorFlow/Keras/PyTorch',
    'relu-activation': 'ReLU激活函数：max(0,x) 及变体对比',
    'mnist-pipeline': 'MNIST手写数字识别：28×28→网络→10类',
    'cifar-classify': 'CIFAR-10图像分类：10类物体识别',
    'style-transfer': '图像风格迁移：内容+风格→生成图（VGG19）',
    'ai-platforms': '新一代AI开放创新平台对比',
    'tool-usage': '直接使用平台智能工具：输入→API→结果',
    'python-api-call': '编程调用智能工具：Python + API',
    'python-ecosystem': 'Python第三方库生态',
    'auto-driving-system': '智能驾驶系统：感知/决策/控制/执行',
    'sae-l0-l2': 'SAE自动驾驶分级 L0-L2：从无自动化到部分自动化',
    'sae-l3-l5': 'SAE自动驾驶分级 L3-L5：从条件自动化到完全自动化',
    'companion-robot': '智能陪伴机器人：对话/情感/语音/动作',
    'ai-art': 'AI绘画：文本→编码→生成→图像',
    'ai-music': 'AI音乐生成：旋律/和声/节奏',
    'gan-structure': 'GAN结构：生成器G与判别器D对抗',
    'gan-training': 'GAN对抗训练：D判别→G优化→迭代收敛',
    'safety-risk-1': 'AI安全隐患（一）：技术缺陷/黑箱/非法控制',
    'safety-risk-2': 'AI安全隐患（二）：隐私侵犯/技术滥用',
    'singularity': '技术奇点与经济奇点：AI能力随时间跃升',
    'ai-milestones': 'AI里程碑：沃森/AlphaGo/Libratus',
    'sophia-ethics': '机器人伦理：索菲亚与身份情感问题',
    'asimov-laws': '阿西莫夫机器人三定律',
    'asilomar-principles': '阿西洛马AI原则：安全/价值观/性能',
    'legal-accident': '法律挑战：交通事故责任划分',
    'legal-ip-privacy': '法律挑战：知识产权与隐私保护',
    'what-is-ai': '什么是人工智能：机器模拟人类智能',
    'ai-manifestations': 'AI的表现形式：听/看/说/想/学/行动',
    'ai-basic-abilities': 'AI基本能力：感知/推理/学习/行为',
    'dartmouth-meeting': '1956达特茅斯会议：AI术语诞生',
    'new-ai-features': '新一代AI特征：大数据+大算力+深度学习',
    'three-games': '三盘棋：人机博弈里程碑',
    'turing-test': '图灵测试：隔着屏幕分辨人与机器',
    'wu-method': '吴文俊与吴氏方法：数学机械化',
    'china-ai-contrib': '中国贡献：领先技术与产业应用',
    'industry-ai': 'AI+工业：质检/维护/排产/产线',
    'yangshan-port': '洋山深水港：全自动无人码头',
    'agriculture-ai': 'AI+农业：精准种植与智能装备',
    'medical-ai': 'AI+医疗：影像/诊疗/制药/健康',
    'security-ai': 'AI+安防：监控识别与预警',
    'smart-home-traffic': '智能家居与智能交通',
    'smart-edu-service': '智能教育与智能服务',
    'credit-score': '个人信用评估：数据→模型→信用分',
    'ai-positive-impact': 'AI的正面影响：经济/生活/科研/社会',
    'ai-challenges': 'AI带来的挑战：就业/伦理/鸿沟/安全',
    'info-social-duty': '信息社会责任：负责任地使用AI',
    'project-overview': '"智能交互益拓展"项目总览',
    'project-stage1': '阶段一：体验人机对话',
    'project-stage2': '阶段二：信息值守机器人开发',
    'knowledge-map': '人工智能知识脉络图',
    'concept-review': '关键概念速查与易混辨析',
    'intelligence-def': '斯腾博格三元智力：分析/创造/实践',
    'collective-intelligence': '集体智能：个体简单行为涌现群体智慧',
    'ai-early-history': 'AI的提出：从图灵之问到达特茅斯',
    'ai-interdisciplinary': 'AI是跨学科：计算机+数学+神经科学等',
    'nlp-tasks': 'NLP四个层次：词法/句法/语义/语用',
    'turing-test-method': '图灵测试方法：多轮问答与统计判定',
    'turing-test-limits': '图灵测试：现代实例与局限',
    'chinese-room': '中文屋思想实验：句法不等于语义',
    'captcha': 'CAPTCHA：区分人机的反向图灵测试',
    'agent-concept': '智能体Agent：感知-决策-行动闭环',
    'symbolism': '符号主义：用符号和逻辑实现智能',
    'connectionism': '连接主义：神经元连接构成网络',
    'behaviorism': '行为主义：感知-行动的仿生智能',
    'ai-branches-1': 'AI六大分支（上）：视觉/语言/认知推理',
    'ai-branches-2': 'AI六大分支（下）：机器人/博弈伦理/机器学习',
    'wave-1': '第一次浪潮：符号推理的黄金年代',
    'ai-winter': '两次AI冬天：狂热退潮与反思',
    'wave-2': '第二次浪潮：专家系统与知识工程',
    'wave-3': '第三次复兴：大数据与深度学习',
    'search-formalization': '搜索五要素：形式化定义一个问题',
    'p-np': 'P/NP/NP完全：问题的难度分类',
    'expert-system': '专家系统构成：五大部件协同',
    'production-rules': '产生式规则：IF 条件 THEN 结论',
    'semantic-network': '语义网络与框架：节点和边表示知识',
    'knowledge-graph': '知识图谱：三元组连成语义大网',
    'forward-reasoning': '正向推理：从事实出发推出结论',
    'backward-reasoning': '反向推理：从假设出发寻找证据',
    'ml-concept': '机器学习：从数据中学出模型',
    'supervised-unsupervised': '监督学习 vs 无监督学习',
    'least-squares': '最小二乘法：让残差平方和最小',
    'primary-ai-abilities': 'AI的三大能力：感知、决策与学习',
    'primary-ai-vs-machine': '人工智能与普通机器有什么不同',
    'primary-human-vs-ai': '人类智能与机器智能有什么不同',
    'primary-ai-learning': 'AI是怎样学习和变聪明的',
    'primary-weak-strong-ai': '弱人工智能与强人工智能',
    'primary-human-ai-team': '人机协作：人和AI各自擅长什么',
    'primary-robot-ai': '机器人与人工智能的关系',
    'primary-robot-body': '机器人的身体由什么组成',
    'primary-sensors': '传感器：机器人的眼睛和耳朵',
    'primary-controller': '控制器：机器人的大脑',
    'primary-motor': '电动机：机器人怎样产生动作',
    'primary-block-programming': '用图形化编程控制机器人',
    'primary-computer-vision': '计算机是怎样“看见”图像的',
    'primary-camera-signal': '摄像头怎样把画面传给计算机',
    'primary-pixel-resolution': '像素与分辨率',
    'primary-binary-gray': '二进制图像与灰度图像',
    'primary-rgb': 'RGB颜色是怎样组成的',
    'primary-image-preprocess': '图像为什么需要预处理',
    'primary-classify-detect': '图像分类与物体识别',
    'primary-face-detect-recognize': '人脸检测与人脸识别',
    'primary-ocr-handwriting': '手写数字识别与OCR文字识别',
    'primary-sound-digital': '声音怎样变成数字',
    'primary-speech-recognition': '语音识别怎样听懂我们说话',
    'primary-nlp': '自然语言处理怎样理解文字',
    'primary-chatbot': '聊天机器人怎样回答问题',
    'primary-next-word': '大语言模型怎样预测下一个词',
    'primary-text-generation': '生成式AI怎样生成文字',
    'primary-media-generation': '生成式AI怎样生成图片和视频',
    'primary-prompt': '怎样写出清楚有效的提示词',
    'primary-data-cards': '数据集、样本、特征与标签',
    'primary-train-test': '数据标注、模型训练与模型测试',
    'primary-hallucination-check': 'AI幻觉与信息核查',
  };

  let currentPoint = null;
  let playToken = 0;     // 播放令牌：每次 refresh/loadPoint 自增，旧播放循环靠它感知取消
  let voiceOn = true;
  let speed = 0.6;
  let paused = false;    // 暂停标志：true 时 api.wait() 阻塞，播放循环原地等待
  let lastVideoH = 0;    // 切换到动画前记录的视频区高度，用作 #animationPlayer 的显式高度
  let animSwitching = false; // 切换动画锁，防止快速点击重复触发

  // 互动价值分级：high=高价值（必做互动）/ medium=中价值（可选）/ low=低价值（纯播放即可）
  // 只有 high 和 medium 的模板才显示"互动动画"标签
  const INTERACTION_VALUE = {
    // 🔴 高价值：算法类/可视化类，调参数能显著提升理解
    'k-means': 'high',
    'knn-classify': 'high',
    'gradient-descent': 'high',
    'linear-regression': 'high',
    'bubble-sort': 'high',
    'selection-sort': 'high',
    'perceptron-gates': 'high',
    'perceptron-xor': 'high',
    'forward-prop': 'high',
    'cross-entropy': 'high',
    'mse-loss': 'high',
    'overfitting-curve': 'high',
    'learning-rate': 'high',
    'pooling': 'high',
    'conv-operation': 'high',
    'conv-stride': 'high',
    'bfs-search': 'high',
    'dfs-search': 'high',
    // 🟡 中价值：结构展示类/概念对比类，有互动锦上添花
    'lenet5': 'medium',
    'alexnet': 'medium',
    'gan-structure': 'medium',
    'gan-training': 'medium',
    'deep-network': 'medium',
    'single-layer-perceptron': 'medium',
    'artificial-neuron': 'medium',
    'activation-functions': 'medium',
    'relu-activation': 'medium',
    'information-gain': 'medium',
    'gini-impurity': 'medium',
    'entropy': 'medium',
    'random-forest': 'medium',
    'decision-tree': 'medium',
    'astar-search': 'medium',
    'tsp-search': 'medium',
    'sgd-minibatch': 'medium',
    'least-squares': 'medium',
    'computation-graph': 'medium',
    'cnn-concept': 'medium',
    'hierarchical-features': 'medium',
    'dataset-split': 'medium',
    'mnist-pipeline': 'medium',
    'voice-pipeline': 'medium',
    'image-recognition': 'medium',
    'nlp-pipeline': 'medium',
    'ml-categories': 'medium',
    'ai-ml-dl': 'medium',
    'dl-triad': 'medium',
    'cifar-classify': 'medium',
    'multimodal-interaction': 'medium',
    'framework-compare': 'medium',
    'auto-driving-system': 'medium',
    'sae-l0-l2': 'medium',
    'sae-l3-l5': 'medium',
    // 🟡 中价值：流程/结构展示类，有步骤讲解
    'semantic-network': 'medium',
    'expert-system': 'medium',
    'knowledge-graph': 'medium',
    'nlp-tasks': 'medium',
    'captcha': 'medium',
    'forward-reasoning': 'medium',
    'backward-reasoning': 'medium',
    'production-rules': 'medium',
    // ⚪ 低价值：概念介绍/历史类，播放型动画
    'what-is-ai': 'low',
    'intelligence-def': 'low',
    'ai-basic-abilities': 'low',
    'ai-interdisciplinary': 'low',
    'ai-manifestations': 'low',
    'ai-branches-1': 'low',
    'ai-branches-2': 'low',
    'wave-1': 'low',
    'wave-2': 'low',
    'wave-3': 'low',
    'ai-early-history': 'low',
    'turing-test': 'low',
    'turing-test-method': 'low',
    'turing-test-limits': 'low',
    'chinese-room': 'low',
    'dartmouth-meeting': 'low',
    'symbolism': 'low',
    'connectionism': 'low',
    'behaviorism': 'low',
    'ai-winter': 'low',
    'safety-risk-1': 'low',
    'safety-risk-2': 'low',
    'new-ai-features': 'low',
    'companion-robot': 'low',
    'agent-concept': 'low',
    'smart-edu-service': 'low',
    'smart-home-traffic': 'low',
    'yangshan-port': 'low',
    'industry-ai': 'low',
    'medical-ai': 'low',
    'agriculture-ai': 'low',
    'ai-art': 'low',
    'ai-music': 'low',
    'tool-usage': 'low',
    'security-ai': 'low',
    'asimov-laws': 'low',
    'singularity': 'low',
    'ai-positive-impact': 'low',
    'info-social-duty': 'low',
    'ai-challenges': 'low',
    'ai-milestones': 'low',
    'biometric-types': 'low',
    'ai-platforms': 'low',
    'python-api-call': 'low',
    'python-ecosystem': 'low',
    'credit-score': 'low',
    'project-overview': 'low',
    'project-stage1': 'low',
    'project-stage2': 'low',
    'knowledge-map': 'low',
    'concept-review': 'low',
    'collective-intelligence': 'low',
    'search-formalization': 'low',
    'p-np': 'low',
    'ml-concept': 'low',
    'supervised-unsupervised': 'low',
    'neural-network-concept': 'low',
    'interaction-overview': 'low',
    'china-ai-contrib': 'low',
    'three-games': 'low',
    'wu-method': 'low',
    'sophia-ethics': 'low',
    'legal-accident': 'low',
    'legal-ip-privacy': 'low',
    'asilomar-principles': 'low',
  };

  // —— 预设数据集：每种模板有3-4组预设数据，点击"换一组"随机切换 ——
  var PRESETS = {
    // —— 排序类：一维数组 ——
    'bubble-sort': [
      { name: '基础', values: [5, 2, 8, 1, 9] },
      { name: '逆序', values: [9, 7, 5, 3, 1] },
      { name: '近乎有序', values: [1, 2, 5, 3, 4] },
      { name: '随机', values: [6, 2, 8, 1, 4, 7, 3] },
    ],
    'selection-sort': [
      { name: '基础', values: [5, 2, 8, 1, 9] },
      { name: '小数组', values: [3, 1, 2] },
      { name: '逆序', values: [8, 6, 4, 2, 1] },
      { name: '随机', values: [7, 3, 9, 1, 5, 2, 8] },
    ],
    // —— 聚类/分类：场景编号 ——
    'k-means': [
      { name: '两簇分离', values: [1] },
      { name: '两簇靠近', values: [2] },
      { name: '三簇数据', values: [3] },
      { name: '随机分布', values: [4] },
    ],
    'knn-classify': [
      { name: '红蓝各半', values: [1] },
      { name: '边界查询', values: [2] },
      { name: '交错分布', values: [3] },
    ],
    // —— 优化/回归：场景编号 ——
    'gradient-descent': [
      { name: '单峰山谷', values: [1] },
      { name: '平缓山坡', values: [2] },
      { name: '靠近最小值', values: [3] },
      { name: '多峰地形', values: [4] },
    ],
    'linear-regression': [
      { name: '正相关强', values: [1] },
      { name: '正相关弱', values: [2] },
      { name: '负相关', values: [3] },
      { name: '离散分布', values: [4] },
    ],
    // —— 神经网络：场景编号 ——
    'perceptron-gates': [
      { name: 'AND门', values: [1] },
      { name: 'OR门', values: [2] },
      { name: 'NAND门', values: [3] },
      { name: 'NOR门', values: [4] },
    ],
    'perceptron-xor': [
      { name: 'XOR基础', values: [1] },
      { name: 'XOR多点', values: [2] },
      { name: '线性不可分', values: [3] },
    ],
    'forward-prop': [
      { name: '3→4→2网络', values: [1] },
      { name: '2→3→1小网络', values: [2] },
      { name: '4→5→3大网络', values: [3] },
      { name: '2→2→2对称', values: [4] },
    ],
    // —— 损失函数：场景编号 ——
    'cross-entropy': [
      { name: '预测准确', values: [1] },
      { name: '预测一般', values: [2] },
      { name: '预测较差', values: [3] },
      { name: '完全错误', values: [4] },
    ],
    'mse-loss': [
      { name: '误差小', values: [1] },
      { name: '误差中', values: [2] },
      { name: '误差大', values: [3] },
      { name: '极端误差', values: [4] },
    ],
    // —— 过拟合/学习率：场景编号 ——
    'overfitting-curve': [
      { name: '轻微过拟合', values: [1] },
      { name: '严重过拟合', values: [2] },
      { name: '正常拟合', values: [3] },
      { name: '欠拟合', values: [4] },
    ],
    'learning-rate': [
      { name: '太小(慢)', values: [1] },
      { name: '太大(发散)', values: [2] },
      { name: '适中(刚好)', values: [3] },
    ],
    // —— 卷积/池化：场景编号 ——
    'conv-operation': [
      { name: '3×3卷积', values: [1] },
      { name: '边缘检测', values: [2] },
      { name: '模糊核', values: [3] },
      { name: '锐化核', values: [4] },
    ],
    'conv-stride': [
      { name: '步长=1', values: [1] },
      { name: '步长=2', values: [2] },
      { name: '步长=3', values: [3] },
      { name: '对比组', values: [4] },
    ],
    'pooling': [
      { name: '最大池化', values: [1] },
      { name: '平均池化', values: [2] },
      { name: '5×5池化', values: [3] },
      { name: '大步长', values: [4] },
    ],
    // —— 搜索算法：场景编号 ——
    'bfs-search': [
      { name: '简单直通', values: [1] },
      { name: '蜿蜒通道', values: [2] },
      { name: '死胡同多', values: [3] },
      { name: '开阔迷宫', values: [4] },
    ],
    'dfs-search': [
      { name: '简单直通', values: [1] },
      { name: '蜿蜒通道', values: [2] },
      { name: '死胡同多', values: [3] },
      { name: '开阔迷宫', values: [4] },
    ],
  };
  // 当前预设索引
  var currentPresetIndex = 0;

  const $ = (id) => document.getElementById(id);
  const supportsAnimation = () => {
    if (!currentPoint || !currentPoint.template) return false;
    const value = INTERACTION_VALUE[currentPoint.template];
    return value === 'high' || value === 'medium';
  };
  // 兼容旧接口：判断是否有动画模板（不管价值高低）
  const hasAnyAnimation = () => !!(currentPoint && currentPoint.template);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const wait = (base) => sleep(base / speed);

  // Edge-TTS 语音播放器（微软神经网络语音，只用这个，不用浏览器自带语音）
  let ttsAudio = null;
  // 当前语音的 Promise（resolved 时表示播完）
  let speakPromise = Promise.resolve();
  let speakResolved = true;
  let speakJustTriggered = false; // 刚触发了新语音，需要等它播完（用于 tweenPlay 同步）
  let speakVersion = 0; // 语音版本号：防止旧音频的事件干扰新语音状态（移动端关键修复）
  
  function speak(text) {
    if (!voiceOn || !text) {
      speakPromise = Promise.resolve();
      speakResolved = true;
      return speakPromise;
    }
    // 版本号递增：旧版本的事件回调将被忽略（移动端关键修复）
    const myVersion = ++speakVersion;
    // 创建新的语音 Promise
    let resolveFn;
    speakPromise = new Promise(resolve => { resolveFn = resolve; });
    speakResolved = false;
    speakJustTriggered = true;
    
    // 清理旧音频：先移除事件监听器，再暂停和清空
    if (ttsAudio) {
      try {
        ttsAudio.onended = null;
        ttsAudio.onerror = null;
        ttsAudio.pause();
        ttsAudio.src = '';
      } catch (e) {}
      ttsAudio = null;
    }
    
    // 完成函数：只有当前版本才生效
    const finish = () => {
      if (myVersion !== speakVersion) return;
      speakResolved = true;
      speakJustTriggered = false;
      resolveFn && resolveFn();
    };
    
    // 计算语速
    let rate;
    if (speed <= 0.5) rate = '-30%';
    else if (speed <= 0.6) rate = '-15%';
    else if (speed <= 0.8) rate = '+5%';
    else if (speed <= 1.2) rate = '+20%';
    else if (speed <= 1.75) rate = '+40%';
    else rate = '+60%';
    const url = '/api/tts?text=' + encodeURIComponent(text.slice(0, 300)) + '&voice=xiaoxiao&rate=' + encodeURIComponent(rate);
    
    // 带重试的播放函数（只重试，不降级到浏览器语音）
    let retryCount = 0;
    const maxRetries = 2; // 失败重试2次
    
    const tryPlay = () => {
      // 如果版本已经变了（被新语音打断），直接退出
      if (myVersion !== speakVersion) return;
      
      try {
        const audio = new Audio();
        audio.preload = 'auto';
        ttsAudio = audio;
        
        let finished = false;
        const onEnd = () => {
          if (finished) return;
          finished = true;
          finish();
        };
        const onErr = () => {
          if (finished) return;
          finished = true;
          // 失败重试
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(tryPlay, 300);
          } else {
            // Edge-TTS 失败：直接结束，不降级到浏览器语音
            finish();
          }
        };
        
        audio.addEventListener('ended', onEnd);
        audio.addEventListener('error', onErr);
        
        audio.src = url;
        
        const p = audio.play();
        if (p && p.catch) {
          p.catch(() => {
            if (!finished) {
              finished = true;
              if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(tryPlay, 300);
              } else {
                finish();
              }
            }
          });
        }
      } catch (e) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(tryPlay, 300);
        } else {
          finish();
        }
      }
    };
    
    // 启动播放
    tryPlay();
    return speakPromise;
  }
  function stopSpeak() {
    if (ttsAudio) {
      try {
        ttsAudio.onended = null;
        ttsAudio.onerror = null;
        ttsAudio.pause();
        ttsAudio.src = '';
      } catch (e) {}
      ttsAudio = null;
    }
    speakVersion++; // 中断当前语音，版本号递增使旧回调失效
    speakResolved = true;
    speakJustTriggered = false;
    speakPromise = Promise.resolve();
  }

  function setStatus(text, level) {
    const el = document.getElementById('animStatus');
    if (!el) return;
    el.textContent = text;
    el.style.color = level === 'error' ? '#d06a96' : (level === 'ok' ? '#8ec5e0' : '#6e6890');
    if (level !== 'idle') speak(text);
    // 完成状态时，进度条设为100%
    if (level === 'ok') {
      const bar = document.getElementById('animProgressBar');
      const txt = document.getElementById('animProgressText');
      const wrap = document.getElementById('animProgressWrap');
      if (bar) bar.style.width = '100%';
      if (txt) txt.textContent = '已完成';
      if (wrap) wrap.style.display = 'flex';
    }
  }

  // —— 播放进度条（时间估算型，平滑且暂停同步）——
  let progressTimer = null;
  let progressToken = 0;
  let progressPaused = false;
  let progressLastTick = 0;
  let progressElapsed = 0; // 已播放秒数（按1倍速计算）
  const PROGRESS_ESTIMATED = 16; // 预估总时长16秒（大多数动画约12-20秒）
  
  function startProgressTimer(token) {
    // 重置进度条
    const bar = document.getElementById('animProgressBar');
    const txt = document.getElementById('animProgressText');
    const wrap = document.getElementById('animProgressWrap');
    if (bar) bar.style.width = '0%';
    if (txt) txt.textContent = '准备中';
    if (wrap) wrap.style.display = 'flex';
    
    progressToken = token;
    progressElapsed = 0;
    progressPaused = false;
    progressLastTick = performance.now();
    
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
    
    // 每100ms更新一次，配合CSS过渡实现丝滑效果
    progressTimer = setInterval(() => {
      if (progressToken !== token) return; // 已取消
      if (progressPaused) { progressLastTick = performance.now(); return; }
      
      const now = performance.now();
      const delta = (now - progressLastTick) / 1000;
      progressLastTick = now;
      
      // 按当前速度累加"有效播放时间"
      progressElapsed += delta * speed;
      
      // 限制在预估时长的95%（留余量，等真正完成时跳到100%）
      const pct = Math.min(95, Math.max(0, (progressElapsed / PROGRESS_ESTIMATED) * 100));
      if (bar) bar.style.width = pct.toFixed(1) + '%';
      
      // 显示时间
      const curSec = Math.floor(progressElapsed);
      const totalSec = PROGRESS_ESTIMATED;
      const fmt = (s) => Math.floor(s / 60) + ':' + (s % 60).toString().padStart(2, '0');
      if (txt) txt.textContent = fmt(Math.min(curSec, totalSec)) + ' / ' + fmt(totalSec);
    }, 100);
  }
  
  function pauseProgressTimer(pause) {
    progressPaused = pause;
    if (!pause) progressLastTick = performance.now();
  }
  
  function stopProgressTimer(finished) {
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
    if (finished) {
      const bar = document.getElementById('animProgressBar');
      const txt = document.getElementById('animProgressText');
      if (bar) bar.style.width = '100%';
      if (txt) txt.textContent = '已完成';
    }
  }

  function scenePayload() {
    return {
      template: currentPoint.template,
      knowledge_point_id: currentPoint.id,
      title: TEMPLATE_TITLES[currentPoint.template] || currentPoint.title,
      values: readValues(),
      grade: currentPoint.grade || '小学高年级',
      theme: 'light', narration: false,
    };
  }

  function readValues() {
    var raw = (document.getElementById('animInput')?.value || '').trim();
    if (!raw) return [];
    return raw.split(/[,\s，、]+/).map(Number).filter(function (n) { return Number.isFinite(n); }).slice(0, 12);
  }

  // 构建预设数据按钮（方格形式的小按钮）
  function buildPresetButtons(tplName) {
    var wrap = document.getElementById('animPresetWrap');
    if (!wrap) return;
    var presets = PRESETS[tplName];
    if (!presets || presets.length === 0) return;
    
    // 清空旧按钮（保留 input）
    var oldBtns = wrap.querySelectorAll('.anim-preset-btn');
    for (var i = 0; i < oldBtns.length; i++) {
      oldBtns[i].remove();
    }
    
    // 添加新按钮
    for (var j = 0; j < presets.length; j++) {
      var btn = document.createElement('button');
      btn.className = 'anim-preset-btn';
      btn.textContent = presets[j].name;
      btn.style.cssText = 'border:1px solid #d3d8ee;background:#fff;color:#6e6890;border-radius:6px;padding:5px 10px;font-size:11px;cursor:pointer;white-space:nowrap;transition:all .2s;';
      if (j === currentPresetIndex % presets.length) {
        btn.style.background = '#eef2ff';
        btn.style.borderColor = '#6e63ff';
        btn.style.color = '#6e63ff';
        btn.style.fontWeight = '600';
      }
      (function (idx) {
        btn.addEventListener('click', function () {
          currentPresetIndex = idx;
          var inputEl = document.getElementById('animInput');
          if (inputEl) inputEl.value = presets[idx].values.join(',');
          paused = false;
          hasUserGesture = true;
          refresh();
        });
      })(j);
      wrap.appendChild(btn);
    }
  }

  function showMode(mode) {
    if (animSwitching) return; // 防止快速重复切换
    if (mode === 'animation' && !hasAnyAnimation()) mode = 'video';
    const videoHost = document.getElementById('videoWrap');
    const animHost = document.getElementById('animationPlayer');
    const videoTab = document.getElementById('videoTab');
    const animTab = document.getElementById('animationTab');
    if (!videoHost || !animHost) return;
    const isAnim = mode === 'animation';
    const currentAnim = !animHost.hasAttribute('hidden');
    const hasContent = animHost.firstChild && animHost.querySelector('#animStage');
    
    // 如果已经是目标状态且有内容，不用切换
    if (isAnim === currentAnim && hasContent) return;
    // 如果已经是动画模式但内容为空，需要加载内容（不做过渡动画）
    if (isAnim && currentAnim && !hasContent) {
      refresh();
      return;
    }
    
    animSwitching = true;
    
    if (isAnim) {
      // 记录视频高度
      const vh = videoHost.getBoundingClientRect().height;
      if (vh > 50) lastVideoH = vh;
      // 计算动画区高度
      let h = lastVideoH > 50 ? Math.max(lastVideoH, 340) : 0;
      if (!(h > 50)) {
        const w = animHost.clientWidth || (animHost.parentElement && animHost.parentElement.clientWidth) || 0;
        h = w > 0 ? Math.max(Math.round(w * 9 / 16), 230) : 300;
      }
      animHost.style.height = Math.round(h) + 'px';
      animHost.style.flex = '0 0 auto';
      
      // 丝滑切换：视频淡出 → 动画淡入
      videoHost.style.transition = 'opacity 0.25s ease';
      animHost.style.transition = 'opacity 0.3s ease';
      videoHost.style.opacity = '0';
      animHost.style.opacity = '0';
      animHost.removeAttribute('hidden');
      
      setTimeout(() => {
        videoHost.setAttribute('hidden', '');
        videoHost.style.opacity = '';
        animHost.style.opacity = '1';
        setTimeout(() => {
          animHost.style.transition = '';
          animHost.style.opacity = '';
          animSwitching = false;
        }, 320);
        refresh();
      }, 260);
    } else {
      // 切回视频：动画淡出 → 视频淡入
      animHost.style.transition = 'opacity 0.25s ease';
      videoHost.style.transition = 'opacity 0.3s ease';
      animHost.style.opacity = '0';
      videoHost.style.opacity = '0';
      videoHost.removeAttribute('hidden');
      
      setTimeout(() => {
        animHost.setAttribute('hidden', '');
        animHost.style.opacity = '';
        animHost.style.transition = '';
        videoHost.style.opacity = '1';
        setTimeout(() => {
          videoHost.style.transition = '';
          videoHost.style.opacity = '';
          animSwitching = false;
        }, 320);
        stopSpeak();
      }, 260);
    }
    
    if (videoTab) {
      videoTab.setAttribute('aria-selected', String(!isAnim));
      videoTab.classList.toggle('active', !isAnim);
    }
    if (animTab) {
      animTab.setAttribute('aria-selected', String(isAnim));
      animTab.classList.toggle('active', isAnim);
    }
  }

  function buildShell(host) {
    const keepH = host.style.height, keepF = host.style.flex;
    host.style.cssText='position:relative;flex:1 1 0%;width:100%;min-height:0;align-self:stretch;padding:0;overflow:hidden';
    if (keepH) { host.style.height = keepH; host.style.flex = keepF || '0 0 auto'; }
    host.innerHTML = `
      <div id="animStage" style="position:absolute;inset:0;width:100%;height:100%;padding:10px 6px;border-bottom:2px solid #d3d8ee;box-sizing:border-box"></div>
      <div style="position:absolute;top:8px;left:12px;right:12px;display:flex;justify-content:space-between;align-items:center;z-index:3;pointer-events:none">
        <div style="font-weight:800;color:#6c5ce7;background:rgba(250,251,255,.88);padding:3px 10px;border-radius:8px" id="animTitle">互动动画</div>
        <div style="display:flex;gap:6px;align-items:center;background:rgba(250,251,255,.88);padding:3px 8px;border-radius:8px;pointer-events:auto">
          <label style="font-size:11px;color:#6e6890;cursor:pointer;display:flex;align-items:center;gap:3px">
            <input type="checkbox" id="voiceToggle" checked style="accent-color:#6e63ff">语音
          </label>
          <select id="speedSel" style="border:1px solid #d3d8ee;border-radius:6px;padding:3px 6px;font-size:11px;color:#6e6890">
            <option value="0.5">很慢</option>
            <option value="0.6" selected>慢速</option>
            <option value="0.8">稍慢</option>
            <option value="1">正常</option>
            <option value="1.5">快速</option>
          </select>
        </div>
      </div>
      <div id="animStatus" style="position:absolute;top:46px;left:18px;font-size:12px;color:#6e6890;z-index:3;pointer-events:none;background:rgba(250,251,255,.78);padding:2px 8px;border-radius:6px">点击播放按钮开始</div>
      <div id="animPlayOverlay" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:5;background:rgba(250,251,255,.5);backdrop-filter:blur(2px);cursor:pointer">
        <div style="text-align:center">
          <div style="font-size:48px;margin-bottom:12px">▶</div>
          <div style="font-size:14px;font-weight:600;color:#4338ca">点击开始播放</div>
          <div style="font-size:11px;color:#6e6890;margin-top:4px">动画 + 语音讲解同步播放</div>
        </div>
      </div>
      <div id="animProgressWrap" style="position:absolute;bottom:48px;left:16px;right:16px;display:none;align-items:center;gap:10px;z-index:2;pointer-events:none">
        <div style="flex:1;height:4px;background:rgba(110,99,255,.12);border-radius:2px;overflow:hidden">
          <div id="animProgressBar" style="height:100%;width:0%;background:linear-gradient(90deg,#6e63ff,#a855f7);border-radius:2px;transition:width .15s ease-out;box-shadow:0 0 8px rgba(110,99,255,.4)"></div>
        </div>
        <span id="animProgressText" style="font-size:11px;color:#6e6890;font-weight:600;white-space:nowrap;min-width:52px;text-align:right">准备中</span>
      </div>
      <div style="position:absolute;bottom:8px;left:12px;right:12px;display:flex;gap:8px;align-items:center;z-index:3;flex-wrap:wrap">
        <div id="animPresetWrap" style="flex:1;display:flex;gap:6px;flex-wrap:wrap;align-items:center;min-width:0">
          <input id="animInput" placeholder="如 9,1,7,3,2" style="flex:1;min-width:100px;border:1px solid #d3d8ee;border-radius:8px;padding:7px 10px;font-size:13px;background:#fff">
        </div>
        <span id="animAutoHint" hidden style="flex:1;align-self:center;font-size:12px;font-weight:600;color:#9a94bf;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">自动演示动画，可暂停 / 倍速 / 换一组观看</span>
        <button id="animPause" style="border:0;background:#7aa7f0;color:#fff;border-radius:8px;padding:8px 14px;font-size:13px;cursor:pointer">暂停</button>
        <button id="animStop" style="border:0;background:#d06a96;color:#fff;border-radius:8px;padding:8px 14px;font-size:13px;cursor:pointer">停止</button>
        <button id="animRefresh" style="border:0;background:#6e63ff;color:#fff;border-radius:8px;padding:8px 14px;font-size:13px;cursor:pointer">换一组</button>
      </div>`;
    // 换一组：切换到下一个预设数据
    document.getElementById('animRefresh').addEventListener('click', function () {
      paused = false;
      hasUserGesture = true;
      var tpl = currentPoint ? currentPoint.template : '';
      var presets = PRESETS[tpl];
      if (presets && presets.length > 0) {
        currentPresetIndex = (currentPresetIndex + 1) % presets.length;
        var preset = presets[currentPresetIndex];
        var inputEl = document.getElementById('animInput');
        if (inputEl) inputEl.value = preset.values.join(',');
      }
      refresh();
    });
    document.getElementById('animPause').addEventListener('click', (e) => {
      paused = !paused;
      e.currentTarget.textContent = paused ? '继续' : '暂停';
      if (paused) {
        stopSpeak();
        pauseProgressTimer(true);
        setStatus('已暂停，点击「继续」恢复播放', 'idle');
      } else {
        pauseProgressTimer(false);
        setStatus('继续播放', 'idle');
      }
    });
    document.getElementById('animStop').addEventListener('click', () => {
      playToken++;                       // 取消当前播放循环（api.isCancelled() 将返回 true）
      paused = false;                    // 重置暂停状态，避免下次残留
      const pb = document.getElementById('animPause'); if (pb) pb.textContent = '暂停';
      stopSpeak();
      setStatus('已停止，点击「刷新动画」重新播放', 'idle');
    });
    document.getElementById('voiceToggle').addEventListener('change', e => {
      voiceOn = e.target.checked;
      if (!voiceOn) { stopSpeak(); }
    });
    document.getElementById('speedSel').addEventListener('change', e => { speed = Number(e.target.value); });
  }

  // —— GridAdapter：方格数组渲染（数字在方格里，交换时方格平滑滑动）——
  function renderGrid(values, opts) {
    opts = opts || {};
    var stage = document.getElementById('animStage');
    var n = values.length;
    var stageW = stage.clientWidth - 40;
    // 计算方格大小：自适应宽度
    var maxCellW = Math.min(70, Math.floor(stageW / n) - 8);
    var cellSize = Math.max(36, maxCellW);
    var gap = Math.max(4, Math.min(8, cellSize * 0.15));
    var totalW = n * cellSize + (n - 1) * gap;
    var startX = (stage.clientWidth - totalW) / 2;
    var startY = (stage.clientHeight - cellSize - 30) / 2;

    var existing = {};
    var cells = stage.querySelectorAll('.anim-grid-cell');
    for (var i = 0; i < cells.length; i++) {
      existing[cells[i].dataset.idx] = cells[i];
    }
    var used = {};

    var BG_DEFAULT = 'linear-gradient(135deg,#eef2ff 0%,#e0e7ff 100%)';
    var BG_DONE = 'linear-gradient(135deg,#fce7f3 0%,#fbcfe8 100%)';
    var BG_COMPARE = 'linear-gradient(135deg,#dbeafe 0%,#bfdbfe 100%)';
    var BG_MIN = 'linear-gradient(135deg,#dcfce7 0%,#bbf7d0 100%)';
    var BG_PIVOT = 'linear-gradient(135deg,#fef3c7 0%,#fde68a 100%)';

    for (var i = 0; i < values.length; i++) {
      var v = values[i];
      var cell = existing[String(i)];
      if (!cell) {
        cell = document.createElement('div');
        cell.className = 'anim-grid-cell';
        cell.dataset.idx = i;
        cell.style.cssText = 'position:absolute;display:flex;align-items:center;justify-content:center;font-weight:700;color:#374151;border-radius:10px;border:2px solid rgba(255,255,255,.8);box-shadow:0 3px 10px rgba(99,102,241,.15),inset 0 1px 0 rgba(255,255,255,.9);transition:all .45s cubic-bezier(.4,0,.2,1);user-select:none;';
        // 索引标签
        var idxLabel = document.createElement('div');
        idxLabel.className = 'anim-grid-idx';
        idxLabel.style.cssText = 'position:absolute;bottom:-22px;left:50%;transform:translateX(-50%);font-size:10px;color:#9ca3af;font-weight:500;';
        cell.appendChild(idxLabel);
        stage.appendChild(cell);
      }
      used[String(i)] = true;

      var bg = BG_DEFAULT;
      var borderColor = 'rgba(255,255,255,.8)';
      var scale = '1';
      var shadow = '0 3px 10px rgba(99,102,241,.15)';

      if (opts.done && opts.done.indexOf(i) >= 0) {
        bg = BG_DONE;
        borderColor = 'rgba(244,114,182,.5)';
      }
      if (opts.compare && opts.compare.indexOf(i) >= 0) {
        bg = BG_COMPARE;
        borderColor = 'rgba(59,130,246,.6)';
        scale = '1.08';
        shadow = '0 6px 20px rgba(59,130,246,.3)';
      }
      if (opts.min === i) {
        bg = BG_MIN;
        borderColor = 'rgba(34,197,94,.6)';
        scale = '1.05';
        shadow = '0 6px 20px rgba(34,197,94,.3)';
      }
      if (opts.pivot === i) {
        bg = BG_PIVOT;
        borderColor = 'rgba(245,158,11,.6)';
        scale = '1.08';
        shadow = '0 6px 20px rgba(245,158,11,.3)';
      }

      cell.style.width = cellSize + 'px';
      cell.style.height = cellSize + 'px';
      cell.style.left = (startX + i * (cellSize + gap)) + 'px';
      cell.style.top = startY + 'px';
      cell.style.background = bg;
      cell.style.borderColor = borderColor;
      cell.style.transform = 'scale(' + scale + ')';
      cell.style.boxShadow = shadow;
      cell.style.fontSize = Math.max(12, Math.floor(cellSize * 0.35)) + 'px';

      // 更新数字（保留索引标签）
      var idxEl = cell.querySelector('.anim-grid-idx');
      // 清空除索引外的内容
      while (cell.firstChild) {
        cell.removeChild(cell.firstChild);
      }
      var numSpan = document.createElement('span');
      numSpan.textContent = v;
      cell.appendChild(numSpan);
      cell.appendChild(idxEl);

      idxEl.textContent = i;
    }

    // 移除多余的
    var keys = Object.keys(existing);
    for (var k = 0; k < keys.length; k++) {
      if (!used[keys[k]]) existing[keys[k]].remove();
    }
  }

  // —— BarAdapter：通用 DOM 柱状图渲染（FLIP：柱子绝对定位，交换时真正滑动）——
  function renderBars(values, opts) {
    const stage = document.getElementById('animStage');
    const max = Math.max(...values, 1);
    const n = values.length;
    const slotW = stage.clientWidth / n;
    const barW = Math.min(slotW * 0.62, 48);
    const existing = {};
    stage.querySelectorAll('.anim-bar').forEach(b => { existing[b.dataset.idx] = b; });
    const used = new Set();
    // 蓝紫渐变柱 + 毛玻璃质感（内白高光 + 外柔阴影 + 白边）
    const GRAD_DEFAULT = 'linear-gradient(180deg,#8ab4f5 0%,#9b7be8 100%)';
    const GRAD_DONE = 'linear-gradient(180deg,#c8a8e8 0%,#e0b8e8 100%)';
    const GRAD_COMPARE = 'linear-gradient(180deg,#7fc8e8 0%,#8ab4f5 100%)';
    values.forEach((v, i) => {
      let bar = existing[i];
      if (!bar) {
        bar = document.createElement('div');
        bar.className = 'anim-bar';
        bar.dataset.idx = i;
        bar.style.cssText = 'position:absolute;bottom:10px;display:flex;align-items:flex-end;justify-content:center;color:#fff;font-size:12px;font-weight:700;padding-bottom:4px;border-radius:8px 8px 2px 2px;border:1px solid rgba(255,255,255,.55);box-shadow:inset 0 1px 0 rgba(255,255,255,.6),0 6px 16px rgba(94,112,234,.22);text-shadow:0 1px 2px rgba(60,42,122,.45);transition:left .55s cubic-bezier(.4,0,.2,1),height .4s ease,background .25s,transform .25s;';
        stage.append(bar);
      }
      used.add(String(i));
      const h = Math.round(40 + (v / max) * Math.max(120, stage.clientHeight - 60));
      let bg = GRAD_DEFAULT;
      if (opts.done.includes(i)) bg = GRAD_DONE;
      if (opts.compare && opts.compare.includes(i)) bg = GRAD_COMPARE;
      bar.style.height = h + 'px';
      bar.style.width = barW + 'px';
      bar.style.left = (i * slotW + (slotW - barW) / 2) + 'px';
      bar.style.background = bg;
      bar.style.transform = opts.compare && opts.compare.includes(i) ? 'translateY(-6px)' : 'translateY(0)';
      bar.textContent = v;
    });
    Object.keys(existing).forEach(k => { if (!used.has(k)) existing[k].remove(); });
  }

  // 模板播放 API：注入给模板的 helpers，封装对引擎资源的访问，便于后续切换适配器
  // ctx 仅 canvas 模板用到（由 registerCanvas 的 mount 返回）；BarAdapter 模板忽略它
  // wait 已包装暂停逻辑：paused 时原地阻塞，恢复后继续推进，对所有模板透明生效。
  function makePlayApi(token, ctx) {
    const isCancelled = () => token !== playToken;
    const localWait = async (base) => {
      // 暂停期间轮询等待恢复；取消时立即放行
      while (paused && !isCancelled()) await sleep(60);
      // 动画时间和语音并行：谁慢等谁，衔接最紧凑
      // （语音在 setStatus 时就开始了，这里只需要一起等结束）
      const animPromise = sleep(base / speed);
      if (voiceOn && !speakResolved) {
        await Promise.all([animPromise, speakPromise]);
      } else {
        await animPromise;
      }
    };
    // 进度条控制
    const updateProgress = (cur, total, label) => {
      const bar = document.getElementById('animProgressBar');
      const txt = document.getElementById('animProgressText');
      const wrap = document.getElementById('animProgressWrap');
      if (!bar || !txt) return;
      if (wrap) wrap.style.display = 'flex';
      if (total > 0) {
        const pct = Math.min(100, Math.round((cur / total) * 100));
        bar.style.width = pct + '%';
        txt.textContent = label || (cur + ' / ' + total);
      } else {
        bar.style.width = '0%';
        txt.textContent = label || '准备中';
      }
    };
    return {
      renderBars,
      renderGrid,
      setStatus,
      sleep,
      wait: localWait,
      get speed() { return speed; },
      isCancelled,
      ctx,
      // 进度条：setProgress(当前步, 总步数, 可选文字)
      setProgress(cur, total, label) {
        updateProgress(cur, total, label);
      },
      // 便捷：从stageNames初始化进度条，并返回原数组
      initStages(names) {
        updateProgress(0, names.length, names.length + ' 步');
        return names;
      },
      // 便捷：跳转到第N步（索引从0开始），同步更新状态文字
      gotoStage(idx, name) {
        updateProgress(idx + 1, null, name || ('第 ' + (idx + 1) + ' 步'));
        if (name) setStatus(name);
      },
    };
  }

  // —— 模板注册表 ——
  const templates = {};
  function register(name, impl) {
    if (!impl || typeof impl.play !== 'function') {
      console.warn('[animation-studio] 模板 ' + name + ' 缺少 play，已忽略');
      return;
    }
    templates[name] = { title: impl.title || name, play: impl.play };
  }

  // —— Canvas 适配器：处理坐标系/曲线/神经网络等复杂动画 ——
  // impl 约定: { title, mount(host)->CanvasRenderingContext2D, async play(values, api) }
  //   host 为 #animStage 容器；mount 负责创建 <canvas> 并返回 2D 上下文，play 通过 api.ctx 取用。
  // refresh 分发时优先查 BarAdapter 的 templates，未命中再查 canvasTemplates。
  const canvasTemplates = {};
  function registerCanvas(name, impl) {
    if (!impl || typeof impl.play !== 'function' || typeof impl.mount !== 'function') {
      console.warn('[animation-studio] canvas 模板 ' + name + ' 缺少 mount/play，已忽略');
      return;
    }
    canvasTemplates[name] = { title: impl.title || name, mount: impl.mount, play: impl.play };
    console.info('[animation-studio] canvas 模板已登记:', name);
  }

  async function refresh() {
    if (!hasAnyAnimation()) return;
    const host = document.getElementById('animationPlayer');
    if (!host) return;
    if (!host.firstChild) buildShell(host);
    
    // 显示播放遮罩，等待用户点击（解决浏览器自动播放限制）
    const overlay = document.getElementById('animPlayOverlay');
    if (overlay) overlay.style.display = 'flex';
    setStatus('点击开始播放', 'idle');
    
    try {
      const res = await fetch('/api/animations/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scenePayload()),
      });
      const json = await res.json();
      if (!res.ok || json.code !== 0) throw new Error(json.detail || '动画加载失败');
      const d = json.data;
      
      // 等用户点击播放后才开始
      await waitForPlayClick();
      
      const token = ++playToken;            // 新播放令牌：旧循环据此感知取消
      const stage = document.getElementById('animStage');
      // 切换模板前清空 stage，避免旧画布/元素叠加
      if (stage) stage.replaceChildren();
      // 隐藏播放遮罩
      if (overlay) overlay.style.display = 'none';
      // 分发：先查 BarAdapter（DOM 柱状图）模板，未命中再查 canvas 模板
      const tpl = templates[d.template];
      const inputEl = document.getElementById('animInput');
      const hintEl = document.getElementById('animAutoHint');
      if (tpl) {
        if (inputEl) inputEl.hidden = false;
        if (hintEl) hintEl.hidden = true;
        document.getElementById('animTitle').textContent = tpl.title || d.title;
        var input = document.getElementById('animInput');
        // 如果有预设数据，优先使用预设
        var tplName = d.template;
        var presets = PRESETS[tplName];
        if (presets && presets.length > 0) {
          var preset = presets[currentPresetIndex % presets.length];
          if (input) input.value = preset.values.join(',');
          // 构建预设按钮
          buildPresetButtons(tplName);
        } else if (input && !input.value) {
          input.value = d.values.join(',');
        }
        startProgressTimer(token);
        await tpl.play(d.values, makePlayApi(token));
        stopProgressTimer(true);
      } else {
        if (inputEl) inputEl.hidden = true;
        if (hintEl) hintEl.hidden = false;
        var ctpl = canvasTemplates[d.template];
        if (!ctpl) throw new Error('不支持的动画模板: ' + d.template);
        document.getElementById('animTitle').textContent = ctpl.title || d.title;
        // canvas 模板也显示预设按钮（如果有的话）
        var canvasPresets = PRESETS[d.template];
        if (canvasPresets && canvasPresets.length > 0) {
          buildPresetButtons(d.template);
          if (hintEl) hintEl.hidden = true;
        }
        var ctx = ctpl.mount(stage);      // canvas 模板挂载：创建画布并返回 2D 上下文
        startProgressTimer(token);
        await ctpl.play(d.values, makePlayApi(token, ctx));
        stopProgressTimer(true);
      }
    } catch (e) {
      setStatus('动画加载失败：' + e.message, 'error');
      const overlay = document.getElementById('animPlayOverlay');
      if (overlay) overlay.style.display = 'none';
    }
  }
  
  // 等待用户点击播放（解决浏览器自动播放限制）
  // 如果是从刷新按钮触发的（已有用户交互），直接通过
  let hasUserGesture = false;
  // 移动端音频预热：播放一个极短的静音，解锁音频播放权限
  function unlockAudio() {
    try {
      // 创建 0.01 秒的静音 wav（base64 编码）
      const silentWav = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
      const unlockAudio = new Audio(silentWav);
      unlockAudio.volume = 0;
      unlockAudio.play().catch(() => {});
      // 兼容处理：也尝试用 AudioContext
      if (window.AudioContext || window.webkitAudioContext) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      }
    } catch (e) {}
  }
  function waitForPlayClick() {
    return new Promise((resolve) => {
      if (hasUserGesture) { resolve(); return; }
      const overlay = document.getElementById('animPlayOverlay');
      if (!overlay) { resolve(); return; }
      
      const done = () => {
        overlay.removeEventListener('click', done);
        hasUserGesture = true;
        unlockAudio(); // 移动端音频解锁
        resolve();
      };
      overlay.addEventListener('click', done);
    });
  }

  function loadPoint(point) {
    currentPoint = point;
    playToken++;                          // 取消可能正在播放的旧动画
    stopSpeak();
    // 重置预设索引
    currentPresetIndex = 0;
    var tab = document.getElementById('animationTab');
    const videoTab = document.getElementById('videoTab');
    const host = document.getElementById('animationPlayer');
    const videoWrap = document.getElementById('videoWrap');
    const hasAnim = hasAnyAnimation();
    const hasValue = supportsAnimation(); // 高/中价值
    const value = currentPoint ? INTERACTION_VALUE[currentPoint.template] : null;
    
    // 检查视频标签是否存在（判断当前知识点有没有视频）
    const videoHidden = videoTab ? videoTab.hasAttribute('hidden') : true;
    
    if (tab && hasAnim) {
      tab.removeAttribute('hidden');
      // 根据互动价值设置按钮文字
      if (hasValue) {
        tab.textContent = '互动动画';
        tab.dataset.type = 'interactive';
      } else {
        tab.textContent = '动画';
        tab.dataset.type = 'playback';
      }
      // 加个淡入动画
      tab.style.opacity = '0';
      tab.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      requestAnimationFrame(() => {
        tab.style.opacity = '1';
      });
    } else if (tab) {
      tab.setAttribute('hidden', '');
    }
    
    if (hasAnim) {
      setStatus(hasValue ? '切换到互动动画后加载' : '点击播放动画', 'idle');
    } else {
      if (host) host.replaceChildren();
      setStatus('本知识点暂无动画', 'idle');
    }
    // 重置切换状态
    animSwitching = false;
    if (host) {
      host.style.opacity = '';
      host.style.transition = '';
    }
    
    // 通知外部（course.html）默认显示哪个标签
    // - 有视频 → 默认视频
    // - 没视频但有动画 → 直接显示动画
    // - 都没有 → 显示文稿教学
    const event = new CustomEvent('animStudioReady', {
      detail: {
        hasVideo: !videoHidden,
        hasAnimation: hasAnim,
        isInteractive: hasValue,
        shouldDefaultToAnimation: videoHidden && hasAnim,
      }
    });
    window.dispatchEvent(event);
    
    // 如果当前已经在动画模式下切换知识点，直接刷新内容（不需要切换标签）
    const _animHost = document.getElementById('animationPlayer');
    if (hasAnim && _animHost && !_animHost.hasAttribute('hidden') && host && host.querySelector('#animStage')) {
      playToken++;
      setStatus('加载中…', 'idle');
      setTimeout(() => refresh(), 50);
    }
  }

  // —— 内置模板 1：冒泡排序（与旧版视觉/行为一致，零回归）——
  register('bubble-sort', {
    title: TEMPLATE_TITLES['bubble-sort'],
    async play(values, api) {
      var arr = values.slice();
      var n = arr.length;
      var done = [];
      // 初始展示
      api.setStatus('冒泡排序开始，共 ' + n + ' 个数字');
      api.renderGrid(arr, {});
      await api.wait(600);
      
      for (var i = 0; i < n - 1; i++) {
        for (var j = 0; j < n - 1 - i; j++) {
          if (api.isCancelled()) return;
          api.setStatus('第 ' + (i + 1) + ' 轮，比较 ' + arr[j] + ' 和 ' + arr[j + 1]);
          api.renderGrid(arr, { compare: [j, j + 1], done: done });
          await api.wait(800);
          if (arr[j] > arr[j + 1]) {
            api.setStatus(arr[j] + ' 比 ' + arr[j + 1] + ' 大，交换位置');
            var tmp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = tmp;
            api.renderGrid(arr, { compare: [j, j + 1], done: done });
            await api.wait(600);
          } else {
            api.setStatus(arr[j] + ' ≤ ' + arr[j + 1] + '，不用交换');
            await api.wait(400);
          }
        }
        done.push(n - 1 - i);
        api.setStatus('第 ' + (i + 1) + ' 轮结束，' + arr[n - 1 - i] + ' 已经"冒泡"到最后');
        api.renderGrid(arr, { done: done });
        await api.wait(500);
      }
      api.setStatus('排序完成，所有数字都排好队了', 'ok');
      var allIdx = [];
      for (var k = 0; k < arr.length; k++) allIdx.push(k);
      api.renderGrid(arr, { done: allIdx });
    },
  });

  // —— 内置模板 2：选择排序（每轮找最小值并与区间首交换）——
  register('selection-sort', {
    title: TEMPLATE_TITLES['selection-sort'],
    async play(values, api) {
      var arr = values.slice();
      var n = arr.length;
      var done = [];
      api.setStatus('选择排序开始，共 ' + n + ' 个数字');
      api.renderGrid(arr, {});
      await api.wait(600);
      
      for (var i = 0; i < n - 1; i++) {
        var minIdx = i;
        api.setStatus('第 ' + (i + 1) + ' 轮：从位置 ' + i + ' 开始找最小值');
        api.renderGrid(arr, { compare: [minIdx], done: done });
        await api.wait(500);
        for (var j = i + 1; j < n; j++) {
          if (api.isCancelled()) return;
          api.setStatus('比较：当前最小 ' + arr[minIdx] + ' 与位置 ' + j + ' 的 ' + arr[j]);
          api.renderGrid(arr, { compare: [minIdx, j], min: minIdx, done: done });
          await api.wait(650);
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
            api.setStatus('发现更小的 ' + arr[minIdx] + '，更新最小值位置');
            api.renderGrid(arr, { min: minIdx, done: done });
            await api.wait(450);
          }
        }
        if (minIdx !== i) {
          api.setStatus('把最小值 ' + arr[minIdx] + ' 与位置 ' + i + ' 的 ' + arr[i] + ' 交换');
          var tmp = arr[i];
          arr[i] = arr[minIdx];
          arr[minIdx] = tmp;
          api.renderGrid(arr, { compare: [i], done: done });
          await api.wait(650);
        } else {
          api.setStatus(arr[i] + ' 已是最小，无需交换');
          await api.wait(400);
        }
        done.push(i);
        api.setStatus('第 ' + (i + 1) + ' 轮结束，' + arr[i] + ' 已就位');
        api.renderGrid(arr, { done: done });
        await api.wait(450);
      }
      done.push(n - 1);
      api.setStatus('排序完成，所有数字都排好队了', 'ok');
      var allIdx = [];
      for (var k = 0; k < arr.length; k++) allIdx.push(k);
      api.renderGrid(arr, { done: allIdx });
    },
  });

  // —— 内置 canvas 模板 1：神经网络前向传播（数值沿网络逐层流动）——
  // 网络 3→4→2，固定演示权重；演示重点在"加权和+激活后逐层向前"，故输入用固定值而非外部 values。
  registerCanvas('forward-prop', {
    title: TEMPLATE_TITLES['forward-prop'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const sigmoid = (x) => 1 / (1 + Math.exp(-x));

      // 固定演示网络 3→4→2（权重固定，便于讲清"前向流动"本身）
      const inputs = [0.7, 0.2, 0.9];
      const W_ih = [[0.5, -0.3, 0.8], [-0.6, 0.4, 0.2], [0.3, 0.7, -0.5], [0.1, -0.2, 0.6]];
      const b_h = [0.1, -0.1, 0.05, 0.0];
      const W_ho = [[0.4, -0.5, 0.3, 0.6], [-0.3, 0.7, 0.2, -0.4]];
      const b_o = [0.0, 0.05];

      // 计算各层激活值
      const hidden = [0, 0, 0, 0].map((_, hh) => {
        let sum = b_h[hh];
        for (let i = 0; i < 3; i++) sum += W_ih[hh][i] * inputs[i];
        return sigmoid(sum);
      });
      const output = [0, 0].map((_, o) => {
        let sum = b_o[o];
        for (let hh = 0; hh < 4; hh++) sum += W_ho[o][hh] * hidden[hh];
        return sigmoid(sum);
      });

      const layers = [inputs, hidden, output];
      const layerNames = ['输入层', '隐藏层', '输出层'];
      const R = 15;

      // 布局：层标签固定在顶部安全区，节点整体在标签下方垂直居中，避免与标签重叠
      const topSafe = 80, botSafe = H - 58;
      const labelY = topSafe - 8;
      const nodeTop = topSafe + 26, nodeBot = botSafe;
      const midY = (nodeTop + nodeBot) / 2;
      const cols = [0.16, 0.5, 0.84];
      const nodePos = layers.map((layer, li) => {
        const x = cols[li] * W, n = layer.length;
        const spread = Math.min(0.22 * H, (nodeBot - nodeTop) * 0.32);
        return Array.from({ length: n }, (_, i) => ({ x, y: midY + (i - (n - 1) / 2) * spread }));
      });

      // 时间轴（秒）
      const T_IN = 0.8;          // 输入层入场
      const T_H = 0.9;           // 每个隐藏神经元计算
      const T_O = 0.9;           // 每个输出神经元计算
      const T_OUT = 0.9;         // 输出层入场
      const TOTAL = T_IN + 4 * T_H + 2 * T_O + T_OUT + 0.5;

      let stage = 0;
      const stageNames = [
        '输入层接收数据：' + inputs.map(v => v.toFixed(2)).join('，'),
        ...hidden.map((v, i) => `隐藏神经元 ${i + 1}：加权和 → sigmoid 激活 ${v.toFixed(2)}`),
        ...output.map((v, i) => `输出神经元 ${i + 1}：加权和 → sigmoid 激活 ${v.toFixed(2)}`),
        `前向传播完成，输出：${output.map(v => v.toFixed(2)).join('，')}`,
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 确定当前阶段（用于状态文案）
        let curStage = 0;
        if (sec > T_IN) {
          const hSec = sec - T_IN;
          const hIdx = Math.floor(hSec / T_H);
          if (hIdx < 4) curStage = 1 + hIdx;
          else {
            const oSec = hSec - 4 * T_H;
            const oIdx = Math.floor(oSec / T_O);
            if (oIdx < 2) curStage = 5 + oIdx;
            else curStage = 7;
          }
        }
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 边：输入→隐藏，隐藏→输出
        for (let li = 0; li < 2; li++) {
          const a = nodePos[li], b = nodePos[li + 1];
          for (let fi = 0; fi < a.length; fi++) {
            for (let ti = 0; ti < b.length; ti++) {
              let alpha = 0.25, width = 1;
              let actP = 0;
              if (li === 0) {
                // 输入→隐藏：随隐藏神经元逐个激活
                const hStart = T_IN + fi * 0.05 + ti * 0.03;
                actP = easeOutCubic(win(sec, hStart, hStart + 0.4));
                if (sec > T_IN + ti * T_H) { alpha = 0.9; width = 2.2; }
              } else {
                // 隐藏→输出：随输出神经元逐个激活
                const oStart = T_IN + 4 * T_H + fi * 0.05 + ti * 0.03;
                actP = easeOutCubic(win(sec, oStart, oStart + 0.4));
                if (sec > T_IN + 4 * T_H + ti * T_O) { alpha = 0.9; width = 2.2; }
              }
              const from = a[fi], to = b[ti];
              const ex = from.x + (to.x - from.x) * actP;
              const ey = from.y + (to.y - from.y) * actP;
              ctx.strokeStyle = li === 0 ? `rgba(108,92,231,${alpha})` : `rgba(165,134,232,${alpha})`;
              ctx.lineWidth = width;
              ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(ex, ey); ctx.stroke();
              // 流动小圆点
              if (actP > 0 && actP < 1) {
                ctx.fillStyle = li === 0 ? '#6c5ce7' : '#a586e8';
                ctx.beginPath(); ctx.arc(ex, ey, 4, 0, Math.PI * 2); ctx.fill();
              }
            }
          }
        }

        // 节点
        nodePos.forEach((layer, li) => {
          layer.forEach((p, ni) => {
            let popP = 0, lit = false;
            if (li === 0) {
              popP = easeOutBack(win(sec, 0.1 + ni * 0.12, 0.5 + ni * 0.12));
              lit = sec > 0.4 + ni * 0.12;
            } else if (li === 1) {
              const t0 = T_IN + ni * T_H;
              popP = easeOutBack(win(sec, t0, t0 + 0.5));
              lit = sec > t0 + 0.35;
            } else {
              const t0 = T_IN + 4 * T_H + ni * T_O;
              popP = easeOutBack(win(sec, t0, t0 + 0.5));
              lit = sec > t0 + 0.35;
            }
            if (popP <= 0) return;
            const s = Math.max(0, popP);
            ctx.save();
            ctx.translate(p.x, p.y); ctx.scale(s, s);
            ctx.shadowColor = 'rgba(124,99,224,0.35)'; ctx.shadowBlur = 8;
            ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2);
            ctx.fillStyle = lit ? '#6c5ce7' : '#fff';
            ctx.strokeStyle = lit ? '#6c5ce7' : '#a5b0d8';
            ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
            ctx.shadowColor = 'transparent';
            // 白色高光
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.beginPath(); ctx.arc(-3, -3, R * 0.28, 0, Math.PI * 2); ctx.fill();
            // 数值
            const val = layers[li][ni];
            if (val !== undefined && val !== null) {
              ctx.fillStyle = lit ? '#fff' : '#6c5ce7';
              ctx.font = 'bold 12px sans-serif';
              ctx.fillText(Number(val).toFixed(2), 0, 0);
            }
            ctx.restore();
          });
        });

        // 层标签（安全区上方）
        ctx.fillStyle = '#6e6890'; ctx.font = '13px sans-serif';
        layerNames.forEach((lab, li) => ctx.fillText(lab, cols[li] * W, labelY));
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 2：梯度下降（沿损失曲面下滑到最低点）——
  // 损失 L(w)=(w-2)^2+0.5，从 w=-0.5 起按梯度反方向更新，约 20 步收敛到 w≈2。
  function makeCanvasHD(host) {
    host.innerHTML = '';
    // 强制浏览器完成 layout：读 offsetHeight 触发重排，避免 hidden→visible 切换瞬间 clientHeight 为 0 或过小
    void host.offsetHeight;
    const cv = document.createElement('canvas');
    cv.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;display:block';
    // 兜底：切 tab 时机可能导致 clientHeight 过小（race condition），用合理下限保证画布可用
    const cssW = Math.max(host.clientWidth, 0) || 600;
    const cssH = host.clientHeight > 100 ? host.clientHeight : 340;
    // 高清适配：物理像素 ×dpr（上限2.5），ctx scale 后所有旧模板仍按 CSS 像素坐标绘制
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    cv.width = Math.round(cssW * dpr);
    cv.height = Math.round(cssH * dpr);
    host.appendChild(cv);
    const ctx = cv.getContext('2d');
    ctx.scale(dpr, dpr);
    // 让旧模板读到的 cv.width/height 仍是 CSS 尺寸（位图保持物理尺寸不变）
    Object.defineProperty(cv, 'width', { value: cssW, configurable: true });
    Object.defineProperty(cv, 'height', { value: cssH, configurable: true });
    ctx._cssW = cssW; ctx._cssH = cssH; ctx._dpr = dpr;
    return ctx;
  }
  // 高清画布（DPR 适配）：物理像素 ×dpr，ctx 已 scale，绘制坐标用 _cssW/_cssH（CSS 尺寸）
  // 模板里用 const W = ctx._cssW, H = ctx._cssH; 取代 cv.width/cv.height
  function makeCanvasHD(host) {
    host.innerHTML = '';
    void host.offsetHeight;
    const cv = document.createElement('canvas');
    cv.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;display:block';
    const cssW = Math.max(host.clientWidth, 0) || 600;
    const cssH = host.clientHeight > 100 ? host.clientHeight : 340;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    cv.width = Math.round(cssW * dpr);
    cv.height = Math.round(cssH * dpr);
    host.appendChild(cv);
    const ctx = cv.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx._cssW = cssW; ctx._cssH = cssH; ctx._dpr = dpr;
    return ctx;
  }
  // 蓝紫渐变浅底 + 多色径向光斑（与网站风格一致）
  function paintGlassBg(ctx, W, H) {
    // 主渐变背景
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#eef2ff');
    g.addColorStop(0.5, '#f3f0ff');
    g.addColorStop(1, '#faf0fc');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // 彩色光斑（增强版：更多光斑、更柔和）
    const spots = [
      [W * 0.12, H * 0.18, W * 0.45, 'rgba(117,190,255,0.32)'],
      [W * 0.88, H * 0.12, W * 0.40, 'rgba(246,159,211,0.26)'],
      [W * 0.72, H * 0.92, W * 0.46, 'rgba(164,126,255,0.22)'],
      [W * 0.20, H * 0.85, W * 0.32, 'rgba(138,201,255,0.18)'],
      [W * 0.50, H * 0.50, W * 0.55, 'rgba(200,180,255,0.12)'],
    ];
    for (const [x, y, r, c] of spots) {
      const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, c); rg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
    }
    // 顶部细高光条
    const topGlow = ctx.createLinearGradient(0, 0, 0, H * 0.08);
    topGlow.addColorStop(0, 'rgba(255,255,255,0.5)');
    topGlow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = topGlow; ctx.fillRect(0, 0, W, H * 0.08);
    // 全局内容玻璃容器：柔和的底层玻璃，统一所有模板的视觉基底
    const pad = 10, topPad = 56, botPad = 44;
    ctx.save();
    ctx.shadowColor = 'rgba(82,106,163,0.12)';
    ctx.shadowBlur = 16; ctx.shadowOffsetY = 3;
    const panelG = ctx.createLinearGradient(0, topPad, 0, H - botPad);
    panelG.addColorStop(0, 'rgba(255,255,255,0.30)');
    panelG.addColorStop(1, 'rgba(255,255,255,0.18)');
    ctx.fillStyle = panelG;
    roundRect(ctx, pad, topPad, W - pad * 2, H - topPad - botPad, 16); ctx.fill();
    ctx.shadowColor = 'transparent';
    // 细微内描边，增加精致感
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 1;
    roundRect(ctx, pad + 0.5, topPad + 0.5, W - pad * 2 - 1, H - topPad - botPad - 1, 15.5); ctx.stroke();
    ctx.restore();
  }
  // 毛玻璃面板：半透明白渐变 + 外柔阴影 + 内高光边（Canvas 内模拟 backdrop-blur 质感）
  function glassPanel(ctx, x, y, w, h, r, fillAlpha) {
    if (fillAlpha == null) fillAlpha = 0.55;
    ctx.save();
    ctx.shadowColor = 'rgba(82,106,163,0.22)';
    ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
    const g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, 'rgba(255,255,255,' + (fillAlpha + 0.12) + ')');
    g.addColorStop(1, 'rgba(255,255,255,' + (fillAlpha - 0.05) + ')');
    ctx.fillStyle = g;
    roundRect(ctx, x, y, w, h, r); ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(255,255,255,0.78)';
    ctx.lineWidth = 1.2;
    roundRect(ctx, x + 0.6, y + 0.6, w - 1.2, h - 1.2, Math.max(0, r - 0.6)); ctx.stroke();
    ctx.restore();
  }
  // 蓝紫粉降饱和色板（替代原 #8ec5e0/#7aa7f0/#f0a8d8/#a586e8）
  const GLASS_COLORS = ['#7aa7f0', '#a586e8', '#f0a8d8', '#8ec5e0', '#6c5ce7', '#c8a8e8'];
  // ===== 丝滑动画工具（rAF 式帧循环，暂停时冻结、倍速时加速）=====
  const clamp01 = t => (t < 0 ? 0 : t > 1 ? 1 : t);
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const easeInCubic = t => t * t * t;
  const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOutBack = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  const easeOutSine = t => Math.sin((t * Math.PI) / 2);
  const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
  const lerp = (a, b, t) => a + (b - a) * t;
  // 内容区域计算：给定目标宽高比，返回居中的绘制区域（保证完全可见）
  function fitRect(W, H, aspectRatio, topPad, botPad, leftPad, rightPad) {
    if (topPad == null) topPad = 60;
    if (botPad == null) botPad = 50;
    if (leftPad == null) leftPad = 30;
    if (rightPad == null) rightPad = 30;
    const availW = W - leftPad - rightPad;
    const availH = H - topPad - botPad;
    let w, h;
    if (availW / availH > aspectRatio) {
      // 空间更宽，以高度为准
      h = availH;
      w = h * aspectRatio;
    } else {
      // 空间更高，以宽度为准
      w = availW;
      h = w / aspectRatio;
    }
    return {
      x: (W - w) / 2,
      y: topPad + (availH - h) / 2,
      w: w,
      h: h,
      cx: W / 2,
      cy: topPad + availH / 2,
    };
  }
  // draw(progress:0→1) 每帧重绘整场景；返回 false 表示被取消。
  // 用 requestAnimationFrame 对齐显示器刷新率 + 真实 deltaTime×speed 推进，
  // 替代旧版固定 16ms 步长 + setTimeout 轮询，消除帧间隔抖动与跳变。
  async function tweenPlay(api, ms, draw) {
    const { isCancelled } = api;
    return new Promise((resolve) => {
      let rafId = 0, lastTs = 0, elapsed = 0, done = false;
      let waitingForVoice = false;
      
      const tick = (ts) => {
        if (done) return;
        if (isCancelled()) { done = true; cancelAnimationFrame(rafId); resolve(false); return; }
        if (!lastTs) lastTs = ts;
        
        // 情况1：正在等语音播完
        if (waitingForVoice) {
          if (speakResolved) {
            // 语音播完了，恢复动画
            waitingForVoice = false;
            lastTs = ts;
          } else {
            // 还在等，继续刷帧保持画面
            lastTs = ts;
            rafId = requestAnimationFrame(tick);
            return;
          }
        }
        
        // 情况2：刚触发了新语音，启动等待
        if (voiceOn && speakJustTriggered && !waitingForVoice) {
          waitingForVoice = true;
          speakJustTriggered = false; // 消费掉标记
          lastTs = ts;
          rafId = requestAnimationFrame(tick);
          return;
        }
        
        // 情况3：用户暂停
        if (paused) {
          lastTs = ts;
          rafId = requestAnimationFrame(tick);
          return;
        }
        
        // 正常推进时间
        const real = Math.min(ts - lastTs, 100);
        lastTs = ts;
        elapsed += real * speed;
        const p = clamp01(elapsed / ms);
        draw(p);
        if (p >= 1) { done = true; draw(1); cancelAnimationFrame(rafId); resolve(true); return; }
        rafId = requestAnimationFrame(tick);
      };
      draw(0);
      rafId = requestAnimationFrame(tick);
    });
  }
  // 通用辅助：圆角矩形路径（只构建路径，不绘制，调用方负责 fill/stroke）
  function roundRect(ctx, x, y, w, h, r) {
    // 防御：负宽高会导致 arcTo 负半径报错并中断整段动画；钳到 0 退化为直角矩形
    if (w < 0) { x += w; w = -w; }
    if (h < 0) { y += h; h = -h; }
    const rr = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }
  // 通用辅助：中文自动换行绘制（按字符宽度近似，居中对齐）
  function wrapText(ctx, text, cx, y, maxW, lineH) {
    const chars = String(text).split('');
    let line = '';
    let yy = y;
    const draw = () => { ctx.fillText(line, cx, yy); };
    for (let i = 0; i < chars.length; i++) {
      const test = line + chars[i];
      if (ctx.measureText(test).width > maxW && line) {
        draw();
        line = chars[i];
        yy += lineH;
      } else {
        line = test;
      }
    }
    if (line) draw();
  }
  registerCanvas('gradient-descent', {
    title: TEMPLATE_TITLES['gradient-descent'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const L = (w) => (w - 2) ** 2 + 0.5;
      const grad = (w) => 2 * (w - 2);
      const wMin = -1, wMax = 5, Lmin = 0, Lmax = 4.5;
      const eta = 0.15;

      // 布局：安全区内左右分栏——左信息卡，右坐标系
      const compact = H < 270;
      const PANEL_W = compact ? 190 : 220;
      const ox = 40 + PANEL_W + 24;
      const oy = H - 58;
      const axW = W - ox - 40;
      const axH = H - 104 - 58;   // 顶部留足 98px：轴标签 L(w) 落在安全区内，不被状态条遮挡
      const xPx = (w) => ox + (w - wMin) / (wMax - wMin) * axW;
      const yPx = (l) => oy - (l - Lmin) / (Lmax - Lmin) * axH;

      // 时间轴（秒）
      const T_AXES = 0.5;   // 坐标轴入场
      const T_CURVE = 0.9;  // 曲线生长
      const T_BALL = 0.4;   // 起点球入场
      const T_STEP = 0.55;  // 每步滚动
      const T_MIN = 0.6;    // 最低点标记
      const T_CARD = 0.5;   // 信息卡淡入
      const steps = [];
      let w0 = -0.5;
      for (let i = 0; i < 30; i++) {
        const g = grad(w0), wNew = w0 - eta * g;
        steps.push({ w: w0, g, wNew });
        w0 = wNew;
        if (Math.abs(g) < 0.04) break;
      }
      const TOTAL = T_AXES + T_CURVE + T_BALL + steps.length * T_STEP + T_MIN + T_CARD + 0.4;

      let stage = 0;
      const stageNames = [
        '绘制损失曲线 L(w) = (w−2)² + 0.5',
        '小球从起点 w=−0.5 出发，沿梯度反方向滚动',
        ...steps.map((s, i) => `第 ${i + 1} 步：梯度 ${s.g.toFixed(2)} → 更新 w: ${s.w.toFixed(2)} → ${s.wNew.toFixed(2)}`),
        '收敛！到达最低点 w=2',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 当前阶段
        let curStage = 0;
        if (sec > T_AXES + T_CURVE) {
          const rollSec = sec - T_AXES - T_CURVE - T_BALL;
          if (rollSec < 0) curStage = 1;
          else {
            const idx = Math.floor(rollSec / T_STEP);
            if (idx < steps.length) curStage = 2 + idx;
            else curStage = 2 + steps.length;
          }
        }
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 坐标轴
        const axP = easeOutCubic(win(sec, 0, T_AXES));
        if (axP > 0) {
          ctx.save(); ctx.globalAlpha = axP;
          ctx.strokeStyle = 'rgba(94,112,234,0.55)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(ox, oy); ctx.lineTo(ox + axW + 8, oy);
          ctx.moveTo(ox, oy); ctx.lineTo(ox, oy - axH - 8);
          ctx.stroke();
          ctx.fillStyle = '#7a6fa8'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText('w', ox + axW + 16, oy + 4);
          ctx.fillText('L(w)', ox - 14, oy - axH - 12);
          ctx.restore();
        }

        // 损失曲线（从左到右生长）
        const curveP = easeOutCubic(win(sec, T_AXES, T_AXES + T_CURVE));
        if (curveP > 0) {
          const lg = ctx.createLinearGradient(ox, 0, ox + axW, 0);
          lg.addColorStop(0, '#7aa7f0'); lg.addColorStop(1, '#6c5ce7');
          ctx.strokeStyle = lg; ctx.lineWidth = 3; ctx.lineCap = 'round';
          ctx.beginPath();
          const n = Math.floor(120 * curveP);
          for (let i = 0; i <= n; i++) {
            const w = wMin + (wMax - wMin) * i / 120;
            const x = xPx(w), y = yPx(L(w));
            i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          }
          ctx.stroke();
        }

        // 小球滚动路径
        let curW = -0.5;
        if (sec > T_AXES + T_CURVE + T_BALL) {
          const rollSec = sec - T_AXES - T_CURVE - T_BALL;
          const idx = Math.min(Math.floor(rollSec / T_STEP), steps.length - 1);
          const stepP = easeOutCubic(win(rollSec, idx * T_STEP, (idx + 1) * T_STEP));
          const s = steps[idx];
          curW = s.w + (s.wNew - s.w) * stepP;
        }

        // 最低点标记
        const minP = easeOutBack(win(sec, T_AXES + T_CURVE + T_BALL + steps.length * T_STEP, T_AXES + T_CURVE + T_BALL + steps.length * T_STEP + T_MIN));
        if (minP > 0) {
          const mx = xPx(2), my = yPx(L(2));
          ctx.save();
          ctx.globalAlpha = minP;
          ctx.translate(mx, my); ctx.scale(Math.max(0, minP), Math.max(0, minP));
          ctx.shadowColor = 'rgba(142,197,224,0.5)'; ctx.shadowBlur = 10;
          ctx.fillStyle = '#8ec5e0';
          ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = '#fff';
          ctx.beginPath(); ctx.arc(-2, -2, 2, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          ctx.fillStyle = '#5f8aa8'; ctx.font = 'bold 13px sans-serif';
          const minLabel = '最低点 w=2', mlW = ctx.measureText(minLabel).width + 14;
          roundRect(ctx, mx - mlW / 2, my - 29, mlW, 17, 8.5);
          ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill();
          ctx.strokeStyle = '#8ec5e0'; ctx.lineWidth = 1; ctx.stroke();
          ctx.fillStyle = '#5f8aa8';
          ctx.fillText(minLabel, mx, my - 20);
        }

        // 小球
        const ballP = easeOutBack(win(sec, T_AXES + T_CURVE, T_AXES + T_CURVE + T_BALL));
        if (ballP > 0) {
          const bx = xPx(curW), by = yPx(L(curW));
          ctx.save();
          ctx.translate(bx, by); ctx.scale(Math.max(0, ballP), Math.max(0, ballP));
          ctx.shadowColor = 'rgba(165,134,232,0.5)'; ctx.shadowBlur = 10;
          ctx.fillStyle = '#a586e8';
          ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = '#e88bb8'; ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.beginPath(); ctx.arc(-3, -3, 2.5, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          // 梯度方向箭头（滚动时显示）
          if (sec > T_AXES + T_CURVE + T_BALL && curW !== 2) {
            const g = grad(curW), dir = -g;
            const arrLen = Math.min(42, Math.abs(dir) * 18 + 12);
            const arrEndX = bx + Math.sign(dir) * arrLen;
            ctx.strokeStyle = '#e88bb8'; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(arrEndX, by); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(arrEndX, by);
            ctx.lineTo(arrEndX - Math.sign(dir) * 8, by - 5);
            ctx.lineTo(arrEndX - Math.sign(dir) * 8, by + 5);
            ctx.closePath(); ctx.fillStyle = '#e88bb8'; ctx.fill();
          }
        }

        // 左侧信息卡
        const cardP = easeOutCubic(win(sec, T_AXES + T_CURVE + T_BALL + steps.length * T_STEP + T_MIN, T_AXES + T_CURVE + T_BALL + steps.length * T_STEP + T_MIN + T_CARD));
        if (cardP > 0) {
          const cw = PANEL_W, ch = compact ? 70 : 88;
          const cx = 40, cy = compact ? 76 : 84;
          ctx.save(); ctx.globalAlpha = cardP;
          glassPanel(ctx, cx, cy, cw, ch, 12, 0.62);
          ctx.textAlign = 'left';
          ctx.fillStyle = '#5e5a8a'; ctx.font = compact ? '12px sans-serif' : '13px sans-serif';
          wrapText(ctx, '沿梯度反方向更新参数，使损失最小', cx + 12, cy + 18, cw - 24, 14);
          ctx.fillStyle = '#6c5ce7'; ctx.font = compact ? 'bold 14px monospace' : 'bold 16px monospace';
          ctx.fillText('w ← w − η·∇L', cx + 12, cy + (compact ? 38 : 46));
          ctx.fillStyle = '#e88bb8'; ctx.font = compact ? '11px sans-serif' : '12px sans-serif';
          ctx.fillText(`η = ${eta}，起点 w = −0.5`, cx + 12, cy + (compact ? 56 : 68));
          ctx.textAlign = 'center';
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(`收敛！w=${steps[steps.length - 1].wNew.toFixed(2)}，损失 L=${L(steps[steps.length - 1].wNew).toFixed(2)}（最优 w=2）`, 'ok');
    },
  });

  // —— 内置 canvas 模板 3：卷积运算（3×3 核扫 5×5 输入，得 3×3 特征图）——
  registerCanvas('conv-operation', {
    title: TEMPLATE_TITLES['conv-operation'],
    mount: makeCanvasHD,
    async play(values, api) {
      var ctx = api.ctx, setStatus = api.setStatus;
      var W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      var win = function (sec, a, b) { return clamp01((sec - a) / (b - a)); };

      // 根据预设选择场景
      var sceneIdx = (values && values.length > 0) ? Math.floor(values[0]) : 1;
      if (sceneIdx < 1) sceneIdx = 1;
      if (sceneIdx > 4) sceneIdx = 4;
      
      var input = [
        [1, 2, 0, 3, 1],
        [0, 1, 4, 2, 0],
        [2, 0, 1, 3, 2],
        [1, 2, 0, 1, 0],
        [0, 1, 2, 3, 1],
      ];
      var CONV_SCENES = {
        1: {  // 3×3普通卷积
          kernel: [[1,0,-1],[1,0,-1],[1,0,-1]],
          name: '垂直边缘检测',
        },
        2: {  // 边缘检测（Sobel）
          kernel: [[-1,-2,-1],[0,0,0],[1,2,1]],
          name: 'Sobel边缘检测',
        },
        3: {  // 模糊核（均值模糊）
          kernel: [[1,1,1],[1,1,1],[1,1,1]],
          name: '均值模糊',
        },
        4: {  // 锐化核
          kernel: [[0,-1,0],[-1,5,-1],[0,-1,0]],
          name: '锐化增强',
        },
      };
      var sc = CONV_SCENES[sceneIdx];
      var kernel = sc.kernel.map(function (row) { return row.slice(); });
      var kernelName = sc.name;

      // 预计算所有窗口的卷积结果
      const out = [[null, null, null], [null, null, null], [null, null, null]];
      const windowResults = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          let sum = 0;
          for (let di = 0; di < 3; di++) for (let dj = 0; dj < 3; dj++) sum += input[i + di][j + dj] * kernel[di][dj];
          out[i][j] = sum;
          windowResults.push({ i, j, sum });
        }
      }

      // 布局：安全区内垂直居中，输入/核/输出横向排列
      const topSafe = 80, botSafe = H - 58;
      const cs = Math.min(26, (botSafe - topSafe - 40) / 5);
      const os = Math.min(34, (botSafe - topSafe - 40) / 3);
      const inX = 44, inY = topSafe + (botSafe - topSafe - 5 * cs) / 2;
      const kX = inX + 5 * cs + 28, kY = topSafe + (botSafe - topSafe - 3 * cs) / 2;
      const outX = kX + 3 * cs + 36, outY = topSafe + (botSafe - topSafe - 3 * os) / 2;

      // 时间轴（秒）
      const T_INTRO = 0.7;       // 输入/核/输出标签入场
      const T_WIN = 0.55;        // 每个窗口扫描
      const T_CALC = 0.35;       // 每个乘加计算
      const T_OUT = 0.4;         // 输出格点亮
      const T_END = 0.5;         // 收尾
      const TOTAL = T_INTRO + 9 * (T_WIN + 9 * T_CALC + T_OUT) + T_END;

      let stage = 0;
      const stageNames = [
        '准备开始卷积：3×3 核扫描 5×5 输入',
        ...windowResults.map(w => `窗口 (${w.i + 1},${w.j + 1})：扫描输入 3×3 区域`),
        '卷积完成，特征图 3×3 已生成',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 当前阶段
        let curStage = 0;
        if (sec > T_INTRO) {
          const t = sec - T_INTRO;
          const winDur = T_WIN + 9 * T_CALC + T_OUT;
          const idx = Math.floor(t / winDur);
          if (idx < 9) curStage = 1 + idx;
          else curStage = 10;
        }
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 标签
        const labP = easeOutCubic(win(sec, 0, T_INTRO));
        ctx.save(); ctx.globalAlpha = labP;
        ctx.fillStyle = '#3a2a7a'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('输入 5×5', inX, inY - 10);
        ctx.fillText('卷积核 3×3', kX, kY - 10);
        ctx.fillText('特征图 3×3', outX, outY - 10);
        ctx.restore();

        // 输入矩阵
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 5; j++) {
            const cellP = easeOutCubic(win(sec, 0.05 + (i * 5 + j) * 0.01, 0.35 + (i * 5 + j) * 0.01));
            if (cellP <= 0) continue;
            ctx.save(); ctx.globalAlpha = cellP;
            // 判断是否在激活窗口内
            let inWin = false;
            if (sec > T_INTRO) {
              const t = sec - T_INTRO;
              const winDur = T_WIN + 9 * T_CALC + T_OUT;
              const idx = Math.floor(t / winDur);
              if (idx < 9) {
                const wi = windowResults[idx].i, wj = windowResults[idx].j;
                inWin = (i >= wi && i < wi + 3 && j >= wj && j < wj + 3);
              }
            }
            ctx.fillStyle = inWin ? 'rgba(165,134,232,0.18)' : 'rgba(255,255,255,0.72)';
            ctx.strokeStyle = inWin ? '#a586e8' : '#d3d8ee';
            ctx.lineWidth = inWin ? 1.6 : 1;
            roundRect(ctx, inX + j * cs, inY + i * cs, cs - 2, cs - 2, 4);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#6c5ce7'; ctx.font = '12px sans-serif';
            ctx.fillText(input[i][j], inX + j * cs + cs / 2 - 1, inY + i * cs + cs / 2);
            ctx.restore();
          }
        }

        // 激活窗口框
        if (sec > T_INTRO) {
          const t = sec - T_INTRO;
          const winDur = T_WIN + 9 * T_CALC + T_OUT;
          const idx = Math.min(Math.floor(t / winDur), 8);
          const winSec = t - idx * winDur;
          const winP = easeOutCubic(win(winSec, 0, T_WIN));
          if (winP > 0) {
            const wi = windowResults[idx].i, wj = windowResults[idx].j;
            const wx = inX + wj * cs, wy = inY + wi * cs;
            ctx.save();
            ctx.globalAlpha = winP;
            ctx.strokeStyle = '#a586e8'; ctx.lineWidth = 2.5;
            ctx.setLineDash([6, 4]);
            roundRect(ctx, wx - 2, wy - 2, cs * 3 + 2, cs * 3 + 2, 6);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
          }
        }

        // 卷积核
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const kp = easeOutBack(win(sec, 0.2 + (i * 3 + j) * 0.04, 0.5 + (i * 3 + j) * 0.04));
            if (kp <= 0) continue;
            const s = Math.max(0, kp);
            ctx.save();
            ctx.translate(kX + j * cs + cs / 2, kY + i * cs + cs / 2);
            ctx.scale(s, s);
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.strokeStyle = '#6e63ff'; ctx.lineWidth = 1.2;
            roundRect(ctx, -cs / 2, -cs / 2, cs - 2, cs - 2, 4);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
            ctx.fillText(kernel[i][j], -1, 0);
            ctx.restore();
          }
        }

        // 乘加过程（当前窗口内）
        if (sec > T_INTRO) {
          const t = sec - T_INTRO;
          const winDur = T_WIN + 9 * T_CALC + T_OUT;
          const idx = Math.floor(t / winDur);
          if (idx < 9) {
            const winSec = t - idx * winDur;
            const calcStart = T_WIN;
            const calcIdx = Math.floor((winSec - calcStart) / T_CALC);
            if (calcIdx >= 0 && calcIdx < 9) {
              const wi = windowResults[idx].i, wj = windowResults[idx].j;
              const di = Math.floor(calcIdx / 3), dj = calcIdx % 3;
              const a = input[wi + di][wj + dj], b = kernel[di][dj];
              const p = a * b;
              const cp = easeOutCubic(win(winSec, calcStart + calcIdx * T_CALC, calcStart + (calcIdx + 1) * T_CALC));
              if (cp > 0) {
                ctx.save();
                ctx.globalAlpha = cp;
                // 高亮当前计算格子
                ctx.fillStyle = 'rgba(108,92,231,0.25)';
                roundRect(ctx, inX + (wj + dj) * cs - 2, inY + (wi + di) * cs - 2, cs + 2, cs + 2, 4);
                ctx.fill();
                ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px monospace';
                ctx.fillText(`${a}×${b}=${p}`, kX + cs * 3 + 12, kY + di * cs + dj * 12 + 6);
                ctx.restore();
              }
            }
          }
        }

        // 输出特征图
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            let op = 0;
            if (sec > T_INTRO) {
              const t = sec - T_INTRO;
              const winDur = T_WIN + 9 * T_CALC + T_OUT;
              const idx = i * 3 + j;
              const outStart = idx * winDur + T_WIN + 9 * T_CALC;
              op = easeOutBack(win(t, outStart, outStart + T_OUT));
            }
            if (op <= 0) {
              // 未激活的空格
              ctx.fillStyle = 'rgba(255,255,255,0.5)';
              ctx.strokeStyle = '#d3d8ee'; ctx.lineWidth = 1;
              roundRect(ctx, outX + j * os, outY + i * os, os - 2, os - 2, 4);
              ctx.fill(); ctx.stroke();
              continue;
            }
            const s = Math.max(0, op);
            ctx.save();
            ctx.translate(outX + j * os + os / 2, outY + i * os + os / 2);
            ctx.scale(s, s);
            ctx.fillStyle = 'rgba(165,134,232,0.2)';
            ctx.strokeStyle = '#a586e8'; ctx.lineWidth = 1.6;
            roundRect(ctx, -os / 2, -os / 2, os - 2, os - 2, 4);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 16px sans-serif';
            ctx.fillText(out[i][j], 0, 0);
            ctx.restore();
          }
        }

        // 公式卡（底部安全区上方）
        if (sec > T_INTRO) {
          const t = sec - T_INTRO;
          const winDur = T_WIN + 9 * T_CALC + T_OUT;
          const idx = Math.min(Math.floor(t / winDur), 8);
          const outStart = idx * winDur + T_WIN + 9 * T_CALC;
          const op = easeOutCubic(win(t, outStart, outStart + T_OUT));
          if (op > 0) {
            const cw = 180, ch = 32;
            const cx = outX + os * 3 + 20, cy = outY + os * 3 + 8;
            ctx.save(); ctx.globalAlpha = op;
            glassPanel(ctx, cx, cy, cw, ch, 8, 0.6);
            ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px monospace'; ctx.textAlign = 'left';
            ctx.fillText(`Σ = ${windowResults[idx].sum}`, cx + 10, cy + ch / 2);
            ctx.restore();
          }
        }
      });
      if (!ok) return;
      setStatus('卷积完成，特征图 3×3 已生成', 'ok');
    },
  });

  // —— 内置 canvas 模板 4：多层感知机 XOR（隐藏 NAND/OR + 输出 AND）——
  registerCanvas('mlp-xor', {
    title: TEMPLATE_TITLES['mlp-xor'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const compact = H < 270;

      const cols = [0.13, 0.38, 0.56];
      const topSafe = 80, botSafe = H - 58;
      const midY = (topSafe + botSafe) / 2;
      const nodePos = [
        [{ x: cols[0] * W, y: midY - 30 }, { x: cols[0] * W, y: midY + 30 }],
        [{ x: cols[1] * W, y: midY - 34 }, { x: cols[1] * W, y: midY + 34 }],
        [{ x: cols[2] * W, y: midY }],
      ];
      const labels = [['x1', 'x2'], ['s1', 's2'], ['y']];
      const R = 15;
      const NAND = (a, b) => (a === 1 && b === 1) ? 0 : 1;
      const OR = (a, b) => (a === 1 || b === 1) ? 1 : 0;
      const AND = (a, b) => (a === 1 && b === 1) ? 1 : 0;

      // 预计算真值表
      const rows = [
        { x1: 0, x2: 0, s1: null, s2: null, y: null },
        { x1: 0, x2: 1, s1: null, s2: null, y: null },
        { x1: 1, x2: 0, s1: null, s2: null, y: null },
        { x1: 1, x2: 1, s1: null, s2: null, y: null },
      ];
      for (const r of rows) { r.s1 = NAND(r.x1, r.x2); r.s2 = OR(r.x1, r.x2); r.y = AND(r.s1, r.s2); }

      // 时间轴（秒）
      const T_NODE = 0.45;   // 节点弹性入场
      const T_EDGE = 0.4;    // 连线生长
      const T_ROW = 0.9;     // 每行真值表传播
      const T_END = 0.5;     // 结论卡
      const TOTAL = T_NODE + T_EDGE + 4 * T_ROW + T_END + 0.3;

      let stage = 0;
      const stageNames = [
        'XOR 三层感知机：隐藏 s1=NAND、s2=OR，输出 y=AND',
        ...rows.map((r, i) => `输入 x1=${r.x1}，x2=${r.x2} → s1=${r.s1}，s2=${r.s2} → y=${r.y}`),
        '真值表填完：y 恰为 XOR(x1,x2)！三层感知机解决了线性不可分问题',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 当前阶段
        let curStage = 0;
        if (sec > T_NODE + T_EDGE) {
          const t = sec - T_NODE - T_EDGE;
          const idx = Math.floor(t / T_ROW);
          if (idx < 4) curStage = 1 + idx;
          else curStage = 5;
        }
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 连线（按阶段生长）
        for (let li = 0; li < 2; li++) {
          const a = nodePos[li], b = nodePos[li + 1];
          for (let fi = 0; fi < a.length; fi++) {
            for (let ti = 0; ti < b.length; ti++) {
              let lp = 0, on = false;
              const edgeStart = T_NODE + (li * 2 + fi) * 0.08 + ti * 0.05;
              lp = easeOutCubic(win(sec, edgeStart, edgeStart + T_EDGE));
              if (sec > T_NODE + T_EDGE + 0.1) on = true;
              if (lp <= 0) continue;
              const ax = a[fi].x, ay = a[fi].y;
              const bx = b[ti].x, by = b[ti].y;
              const ex = ax + (bx - ax) * lp, ey = ay + (by - ay) * lp;
              ctx.strokeStyle = on ? 'rgba(108,92,231,0.9)' : 'rgba(163,177,224,0.6)';
              ctx.lineWidth = on ? 2.4 : 1; ctx.lineCap = 'round';
              ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ex, ey); ctx.stroke();
              if (lp >= 1 && on) {
                ctx.fillStyle = '#7aa7f0';
                ctx.beginPath();
                ctx.moveTo(bx, by); ctx.lineTo(bx - 7, by - 4.5); ctx.lineTo(bx - 7, by + 4.5);
                ctx.closePath(); ctx.fill();
              }
            }
          }
        }

        // 节点（弹性 pop）
        nodePos.forEach((layer, li) => {
          layer.forEach((p, ni) => {
            const popP = easeOutBack(win(sec, 0.1 + (li * 2 + ni) * 0.1, 0.4 + (li * 2 + ni) * 0.1));
            if (popP <= 0) return;
            const s = Math.max(0, popP);
            ctx.save();
            ctx.translate(p.x, p.y); ctx.scale(s, s);
            ctx.shadowColor = 'rgba(124,99,224,0.35)'; ctx.shadowBlur = 8;
            ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#a5b0d8';
            ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.beginPath(); ctx.arc(-3, -3, R * 0.28, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
            // 标签
            ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif';
            ctx.fillText(labels[li][ni], p.x, p.y - R - 9);
          });
        });

        // 右侧真值表（左右分栏）；紧凑行距，保证表+结论卡全部落在底部安全区之上
        const tx = cols[2] * W + 38, ty = topSafe + (compact ? 2 : 4);
        const cw = compact ? 18 : 22, rh = compact ? 12 : 15;
        const headers = ['x1', 'x2', 's1', 's2', 'y'];
        // 表头
        const headP = easeOutCubic(win(sec, 0.2, 0.55));
        if (headP > 0) {
          ctx.save(); ctx.globalAlpha = headP;
          headers.forEach((h, j) => {
            ctx.fillStyle = 'rgba(200,168,232,0.35)';
            roundRect(ctx, tx + j * cw, ty, cw - 2, rh - 2, 3); ctx.fill();
            ctx.strokeStyle = '#6e63ff'; ctx.lineWidth = 1; ctx.stroke();
            ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 11px sans-serif';
            ctx.fillText(h, tx + j * cw + cw / 2 - 1, ty + rh / 2);
          });
          ctx.restore();
        }
        // 数据行
        for (let ri = 0; ri < rows.length; ri++) {
          const rowP = easeOutCubic(win(sec, T_NODE + T_EDGE + ri * T_ROW, T_NODE + T_EDGE + ri * T_ROW + 0.45));
          if (rowP <= 0) continue;
          const r = rows[ri];
          const vals = [r.x1, r.x2, r.s1, r.s2, r.y];
          const isCur = (curStage === ri + 1);
          const yOff = ty + (ri + 1) * rh + (1 - rowP) * 14;
          ctx.save(); ctx.globalAlpha = rowP;
          vals.forEach((v, j) => {
            ctx.fillStyle = isCur ? 'rgba(165,134,232,0.2)' : 'rgba(255,255,255,0.7)';
            ctx.strokeStyle = isCur ? '#a586e8' : '#d3d8ee'; ctx.lineWidth = isCur ? 1.5 : 1;
            roundRect(ctx, tx + j * cw, yOff, cw - 2, rh - 2, 3); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#6c5ce7'; ctx.font = isCur ? 'bold 12px sans-serif' : '11px sans-serif';
            ctx.fillText(v, tx + j * cw + cw / 2 - 1, yOff + rh / 2);
          });
          ctx.restore();
          // 当前行激活连线
          if (isCur) {
            const actP = easeOutCubic(win(sec, T_NODE + T_EDGE + ri * T_ROW + 0.25, T_NODE + T_EDGE + ri * T_ROW + 0.55));
            if (actP > 0) {
              // 输入→隐藏1
              ctx.strokeStyle = `rgba(108,92,231,${actP})`; ctx.lineWidth = 2.4;
              const a0 = nodePos[0][0], a1 = nodePos[0][1];
              const b0 = nodePos[1][0];
              ctx.beginPath(); ctx.moveTo(a0.x, a0.y); ctx.lineTo(b0.x, b0.y); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(b0.x, b0.y); ctx.stroke();
              // 隐藏2
              const b1 = nodePos[1][1];
              ctx.beginPath(); ctx.moveTo(a0.x, a0.y); ctx.lineTo(b1.x, b1.y); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(b1.x, b1.y); ctx.stroke();
              // 隐藏→输出
              const c0 = nodePos[2][0];
              ctx.beginPath(); ctx.moveTo(b0.x, b0.y); ctx.lineTo(c0.x, c0.y); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(b1.x, b1.y); ctx.lineTo(c0.x, c0.y); ctx.stroke();
              // 当前值在节点内显示
              ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 15px sans-serif';
              ctx.fillText(r.x1, nodePos[0][0].x, nodePos[0][0].y);
              ctx.fillText(r.x2, nodePos[0][1].x, nodePos[0][1].y);
              ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif';
              ctx.fillText(r.s1, nodePos[1][0].x, nodePos[1][0].y);
              ctx.fillText(r.s2, nodePos[1][1].x, nodePos[1][1].y);
              ctx.fillStyle = '#fff'; ctx.font = 'bold 16px sans-serif';
              ctx.fillText(r.y, nodePos[2][0].x, nodePos[2][0].y);
            }
          }
        }

        // 结论信息卡（真值表下方）；极矮容器（H<230）下结论已由状态条/语音承载，不再画卡防遮挡
        const endP = easeOutCubic(win(sec, T_NODE + T_EDGE + 4 * T_ROW, T_NODE + T_EDGE + 4 * T_ROW + T_END));
        if (endP > 0 && !(compact && H < 230)) {
          const cw2 = compact ? 160 : 190, ch2 = compact ? 34 : 48;
          const cxx = tx, cyy = ty + 5 * rh + (compact ? 4 : 6);
          ctx.save(); ctx.globalAlpha = endP;
          glassPanel(ctx, cxx, cyy, cw2, ch2, 10, 0.62);
          ctx.fillStyle = '#5e5a8a'; ctx.font = compact ? '11px sans-serif' : '12px sans-serif'; ctx.textAlign = 'left';
          wrapText(ctx, '隐藏层引入非线性，使 XOR 可分', cxx + 10, cyy + (compact ? 12 : 14), cw2 - 20, 13);
          ctx.fillStyle = '#6c5ce7'; ctx.font = compact ? 'bold 13px monospace' : 'bold 14px monospace';
          ctx.fillText('y = AND(NAND, OR)', cxx + 10, cyy + (compact ? 25 : 36));
          ctx.textAlign = 'center';
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('真值表填完：y 恰为 XOR(x1,x2)！三层感知机解决了线性不可分问题', 'ok');
    },
  });

  // —— 内置 canvas 模板 7：k均值聚类（二维散点+2质心迭代收敛）——
  // 固定8点，初始质心 c1=左下 c2=右上，迭代3-4轮直到质心稳定，每轮先分配点再移动质心。
  registerCanvas('k-means', {
    title: TEMPLATE_TITLES['k-means'],
    mount: makeCanvasHD,
    async play(values, api) {
      var ctx = api.ctx, setStatus = api.setStatus;
      var W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      var win = function (sec, a, b) { return clamp01((sec - a) / (b - a)); };
      var compact = H < 270;

      // 根据预设选择不同的数据场景
      var sceneIdx = (values && values.length > 0) ? Math.floor(values[0]) : 1;
      if (sceneIdx < 1) sceneIdx = 1;
      if (sceneIdx > 4) sceneIdx = 4;
      
      var KMEANS_SCENES = {
        1: {  // 两簇分离
          points: [
            { x: 0.15, y: 0.25 }, { x: 0.20, y: 0.30 }, { x: 0.25, y: 0.20 }, { x: 0.18, y: 0.35 },
            { x: 0.70, y: 0.65 }, { x: 0.75, y: 0.70 }, { x: 0.80, y: 0.60 }, { x: 0.72, y: 0.75 },
          ],
          c1: { x: 0.10, y: 0.10 }, c2: { x: 0.90, y: 0.90 },
        },
        2: {  // 两簇靠近
          points: [
            { x: 0.35, y: 0.40 }, { x: 0.40, y: 0.45 }, { x: 0.45, y: 0.35 }, { x: 0.38, y: 0.50 },
            { x: 0.55, y: 0.55 }, { x: 0.60, y: 0.60 }, { x: 0.65, y: 0.50 }, { x: 0.58, y: 0.65 },
          ],
          c1: { x: 0.25, y: 0.25 }, c2: { x: 0.75, y: 0.75 },
        },
        3: {  // 三簇数据（演示2均值，但有3簇结构）
          points: [
            { x: 0.15, y: 0.20 }, { x: 0.20, y: 0.25 }, { x: 0.18, y: 0.15 },
            { x: 0.50, y: 0.70 }, { x: 0.55, y: 0.75 }, { x: 0.45, y: 0.72 },
            { x: 0.80, y: 0.30 }, { x: 0.85, y: 0.35 }, { x: 0.78, y: 0.25 },
          ],
          c1: { x: 0.10, y: 0.10 }, c2: { x: 0.90, y: 0.90 },
        },
        4: {  // 随机分布
          points: [
            { x: 0.20, y: 0.60 }, { x: 0.40, y: 0.30 }, { x: 0.60, y: 0.70 }, { x: 0.80, y: 0.40 },
            { x: 0.30, y: 0.80 }, { x: 0.50, y: 0.50 }, { x: 0.70, y: 0.20 }, { x: 0.90, y: 0.60 },
          ],
          c1: { x: 0.15, y: 0.15 }, c2: { x: 0.85, y: 0.85 },
        },
      };
      var scene = KMEANS_SCENES[sceneIdx];
      var points = scene.points.map(function (p) { return { x: p.x, y: p.y }; });
      var c1 = { x: scene.c1.x, y: scene.c1.y };
      var c2 = { x: scene.c2.x, y: scene.c2.y };
      // 绘图区严格落在安全区内（顶88 / 底H-62 / 左右44），避免点和标签侵入状态条或按钮区
      const PLOT_L = 44, PLOT_R = W - 44, PLOT_T = 88, PLOT_B = H - 62;
      const xPx = (u) => PLOT_L + u * (PLOT_R - PLOT_L);
      const yPx = (v) => PLOT_T + v * (PLOT_B - PLOT_T);

      // 预计算所有轮次
      const rounds = [];
      let prevC1 = null, prevC2 = null;
      for (let round = 1; round <= 5; round++) {
        const labels = points.map(p => {
          const d1 = (p.x - c1.x) ** 2 + (p.y - c1.y) ** 2;
          const d2 = (p.x - c2.x) ** 2 + (p.y - c2.y) ** 2;
          return d1 <= d2 ? 1 : 0;
        });
        const reds = points.filter((_, i) => labels[i] === 1);
        const blues = points.filter((_, i) => labels[i] === 0);
        const mean = (arr) => arr.length ? { x: arr.reduce((s, p) => s + p.x, 0) / arr.length, y: arr.reduce((s, p) => s + p.y, 0) / arr.length } : null;
        const nr = mean(reds), nb = mean(blues);
        if (nr) prevC1 = { ...c1 };
        if (nb) prevC2 = { ...c2 };
        if (nr) c1 = nr;
        if (nb) c2 = nb;
        rounds.push({ labels, c1: { ...c1 }, c2: { ...c2 }, prevC1, prevC2, round });
        const moved = (prevC1 && (Math.abs(c1.x - prevC1.x) > 0.001 || Math.abs(c1.y - prevC1.y) > 0.001))
          || (prevC2 && (Math.abs(c2.x - prevC2.x) > 0.001 || Math.abs(c2.y - prevC2.y) > 0.001));
        if (!moved) break;
      }
      const finalLabels = rounds.length ? rounds[rounds.length - 1].labels : points.map(() => 0);

      // 时间轴（秒）
      const T_INIT = 0.6;      // 散点入场
      const T_CENTROID = 0.5;  // 质心入场
      const T_ROUND = 1.6;     // 每轮：分配+移动
      const T_END = 0.5;
      const TOTAL = T_INIT + T_CENTROID + rounds.length * T_ROUND + T_END + 0.3;

      let stage = 0;
      const stageNames = [
        '初始化：8个数据点 + 2个质心（红/蓝X标记）',
        ...rounds.map(r => `第${r.round}轮：按最近质心分配点（红${r.labels.filter(v => v === 1).length}个，蓝${r.labels.filter(v => v === 0).length}个）`),
        'k均值收敛：2个簇已形成，质心位置稳定',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 当前阶段
        let curStage = 0;
        if (sec > T_INIT + T_CENTROID) {
          const t = sec - T_INIT - T_CENTROID;
          const idx = Math.floor(t / T_ROUND);
          if (idx < rounds.length) curStage = 1 + idx;
          else curStage = 1 + rounds.length;
        }
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 网格虚线
        ctx.strokeStyle = 'rgba(200,200,235,0.4)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
        for (let i = 1; i < 5; i++) {
          ctx.beginPath(); ctx.moveTo(PLOT_L + i * (PLOT_R - PLOT_L) / 5, PLOT_T); ctx.lineTo(PLOT_L + i * (PLOT_R - PLOT_L) / 5, PLOT_B); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(PLOT_L, PLOT_T + i * (PLOT_B - PLOT_T) / 5); ctx.lineTo(PLOT_R, PLOT_T + i * (PLOT_B - PLOT_T) / 5); ctx.stroke();
        }
        ctx.setLineDash([]);

        // 确定当前显示状态
        let curLabels = null, curC1 = c1, curC2 = c2;
        let showAssign = false, moveP = 0;
        if (sec > T_INIT + T_CENTROID) {
          const t = sec - T_INIT - T_CENTROID;
          const idx = Math.min(Math.floor(t / T_ROUND), rounds.length - 1);
          const roundSec = t - idx * T_ROUND;
          const r = rounds[idx];
          if (roundSec < T_ROUND * 0.45) {
            // 分配阶段：显示当前标签
            curLabels = r.labels;
            curC1 = r.prevC1 || c1; curC2 = r.prevC2 || c2;
            showAssign = true;
          } else {
            // 移动阶段：质心从旧位置移动到新位置
            moveP = easeOutCubic(win(roundSec, T_ROUND * 0.45, T_ROUND * 0.75));
            curLabels = r.labels;
            const o1 = r.prevC1 || c1, o2 = r.prevC2 || c2;
            curC1 = { x: o1.x + (r.c1.x - o1.x) * moveP, y: o1.y + (r.c1.y - o1.y) * moveP };
            curC2 = { x: o2.x + (r.c2.x - o2.x) * moveP, y: o2.y + (r.c2.y - o2.y) * moveP };
          }
        }

        // 散点（弹性 pop 入场）
        points.forEach((pt, i) => {
          const popP = easeOutBack(win(sec, 0.05 + i * 0.06, 0.4 + i * 0.06));
          if (popP <= 0) return;
          const s = Math.max(0, popP);
          let color = '#a5b0d8';
          if (curLabels) color = curLabels[i] ? '#e88bb8' : '#7aa7f0';
          ctx.save();
          ctx.translate(xPx(pt.x), yPx(pt.y)); ctx.scale(s, s);
          ctx.shadowColor = 'rgba(124,99,224,0.3)'; ctx.shadowBlur = 6;
          ctx.fillStyle = color;
          ctx.beginPath(); ctx.arc(0, 0, 5.5, 0, Math.PI * 2); ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.beginPath(); ctx.arc(-1.5, -1.5, 1.5, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        });

        // 质心（X标记，带光晕）
        const centP = easeOutBack(win(sec, T_INIT, T_INIT + T_CENTROID));
        if (centP > 0) {
          [['#e88bb8', curC1], ['#7aa7f0', curC2]].forEach(([color, c]) => {
            const cx = xPx(c.x), cy = yPx(c.y);
            ctx.save();
            ctx.globalAlpha = centP;
            ctx.translate(cx, cy); ctx.scale(Math.max(0, centP), Math.max(0, centP));
            ctx.shadowColor = color + '80'; ctx.shadowBlur = 10;
            ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(-9, -9); ctx.lineTo(9, 9); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-9, 9); ctx.lineTo(9, -9); ctx.stroke();
            ctx.shadowColor = 'transparent';
            // 标签放✕右侧并加白底药丸，避免与✕/散点重叠
            ctx.textAlign = 'left';
            ctx.font = 'bold 12px sans-serif';
            const lab = '质心', lx = 13, ly = -11;
            const tw = ctx.measureText(lab).width;
            ctx.fillStyle = 'rgba(250,251,255,0.9)';
            roundRect(ctx, lx - 4, ly - 7, tw + 8, 14, 5); ctx.fill();
            ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.stroke();
            ctx.fillStyle = color;
            ctx.fillText(lab, lx, ly);
            ctx.textAlign = 'center';
            ctx.restore();
          });
        }
      });
      if (!ok) return;
      setStatus('k均值收敛：2个簇已形成，质心位置稳定', 'ok');
    },
  });

  // —— 内置 canvas 模板 8：决策树（按特征分裂数据到叶节点纯）——
  // 8样本[是否专业人士,是否首次参观]→体验(1好/0一般)。固定分裂：根→按特征0→左叶纯(好) + 右子→按特征1→左叶纯(一般)+右子叶(混合)。
  registerCanvas('decision-tree', {
    title: TEMPLATE_TITLES['decision-tree'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const compact = H < 270;

      // 节点布局：安全区内垂直居中
      const topSafe = 80, botSafe = H - 58;
      const midY = (topSafe + botSafe) / 2;
      const nodes = {
        root:    { x: 0.50 * W, y: midY - (botSafe - topSafe) * 0.32, w: 96, h: 38, label: '8 样本\n好3/一般5' },
        leftL:   { x: 0.26 * W, y: midY, w: 96, h: 38, label: '专业人士=1\n3样本全"好"' },
        rightN:  { x: 0.74 * W, y: midY, w: 96, h: 38, label: '专业人士=0\n5样本[一般4 好1]' },
        midLeft: { x: 0.58 * W, y: midY + (botSafe - topSafe) * 0.32, w: 96, h: 38, label: '首次=1\n2样本全"一般"' },
        midRight:{ x: 0.88 * W, y: midY + (botSafe - topSafe) * 0.32, w: 96, h: 38, label: '首次=0\n3样本[一般2 好1]' },
      };
      const nodeKeys = ['root', 'leftL', 'rightN', 'midLeft', 'midRight'];
      const edges = [
        { key: 'e1', a: nodes.root, b: nodes.leftL, label: '是' },
        { key: 'e2', a: nodes.root, b: nodes.rightN, label: '否' },
        { key: 'e3', a: nodes.rightN, b: nodes.midLeft, label: '是' },
        { key: 'e4', a: nodes.rightN, b: nodes.midRight, label: '否' },
      ];

      // 时间轴（秒）
      const T_ROOT = 0.5;    // 根节点入场
      const T_LVL1 = 0.9;    // 第一层分裂
      const T_LVL2 = 0.9;    // 第二层分裂
      const T_END = 0.5;
      const TOTAL = T_ROOT + T_LVL1 + T_LVL2 + T_END + 0.3;

      let stage = 0;
      const stageNames = [
        '根节点：8个样本（3个"好"，5个"一般"），纯度不足，需分裂',
        "按特征'是否专业人士'分裂：左支3样本全'好'（纯，变叶节点），右支5样本待继续分裂",
        "右子节点继续按'是否首次参观'分裂：左2样本全'一般'（纯），右3样本接近纯",
        '决策树构建完成：3个叶节点纯度100%，可用于预测新样本体验',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 当前阶段
        let curStage = 0;
        if (sec > T_ROOT) {
          if (sec < T_ROOT + T_LVL1) curStage = 1;
          else if (sec < T_ROOT + T_LVL1 + T_LVL2) curStage = 2;
          else curStage = 3;
        }
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 连线生长
        edges.forEach((e, i) => {
          let start;
          if (i < 2) start = T_ROOT + i * 0.15;
          else start = T_ROOT + T_LVL1 + (i - 2) * 0.15;
          const lp = easeOutCubic(win(sec, start, start + 0.4));
          if (lp <= 0) return;
          const ax = e.a.x, ay = e.a.y + e.a.h / 2;
          const bx = e.b.x, by = e.b.y - e.b.h / 2;
          const ex = ax + (bx - ax) * lp, ey = ay + (by - ay) * lp;
          ctx.strokeStyle = 'rgba(122,167,240,0.9)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ex, ey); ctx.stroke();
          if (lp >= 1 && e.label) {
            const mx = (ax + bx) / 2, my = (ay + by) / 2;
            ctx.fillStyle = '#5e5a8a'; ctx.font = '12px sans-serif';
            ctx.fillText(e.label, mx + 8, my);
          }
        });

        // 节点（错峰淡入上滑）
        nodeKeys.forEach((key, i) => {
          let start;
          if (key === 'root') start = 0;
          else if (i <= 2) start = T_ROOT + (i - 1) * 0.2;
          else start = T_ROOT + T_LVL1 + (i - 3) * 0.2;
          const np = easeOutCubic(win(sec, start, start + 0.45));
          if (np <= 0) return;
          const n = nodes[key];
          const isLeaf = key !== 'root' && key !== 'rightN';
          const y = n.y + (1 - np) * 22;
          ctx.save();
          ctx.globalAlpha = np;
          ctx.translate(n.x, y);
          ctx.scale(0.9 + 0.1 * np, 0.9 + 0.1 * np);
          glassPanel(ctx, -n.w / 2, -n.h / 2, n.w, n.h, 10, isLeaf ? 0.6 : 0.68);
          const g = ctx.createLinearGradient(-n.w / 2, -n.h / 2, n.w / 2, -n.h / 2);
          g.addColorStop(0, isLeaf ? '#8ec5e0' : '#6c5ce7');
          g.addColorStop(1, isLeaf ? '#a586e8' : '#a586e8');
          ctx.fillStyle = g;
          roundRect(ctx, -n.w / 2, -n.h / 2, n.w, 4, 2); ctx.fill();
          ctx.fillStyle = isLeaf ? '#2a1f5e' : '#2a1f5e';
          ctx.font = compact ? '11px sans-serif' : '12px sans-serif';
          n.label.split('\n').forEach((line, li) => ctx.fillText(line, 0, -2 + li * 12));
          ctx.restore();
        });
      });
      if (!ok) return;
      setStatus('决策树构建完成：3个叶节点纯度100%，可用于预测新样本体验', 'ok');
    },
  });

  // —— 内置 canvas 模板 9：步长与填充（演示3种 stride/padding 组合对输出尺寸的影响）——
  // 复用 conv-operation 的5×5输入和3×3核，顺序播放3场景：步长1无填充→3×3、步长2无填充→2×2、步长1 padding=1→3×3。
  registerCanvas('conv-stride', {
    title: TEMPLATE_TITLES['conv-stride'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const compact = H < 270;

      const input = [[1, 2, 0, 3, 1], [0, 1, 4, 2, 0], [2, 0, 1, 3, 2], [1, 2, 0, 1, 0], [0, 1, 2, 3, 1]];
      const kernel = [[1, 0, -1], [1, 0, -1], [1, 0, -1]];

      // 布局：安全区内垂直居中；格宽受高度约束，列间间隙在窄宽下自动压缩，右边距恒 ≥40
      const topSafe = 80, botSafe = H - 58;
      const availH = botSafe - topSafe - 18;
      const cs = Math.min(compact ? 14 : 18, availH / 7);
      const os = Math.min(compact ? 20 : 26, availH / 3);
      const inX = 40;
      const inY = topSafe + 9 + (availH - 7 * cs) / 2;
      let gap1 = 24, gap2 = 30;
      const inW = 7 * cs, kW = 3 * cs, outW = 3 * os;
      const overflow = inX + inW + gap1 + kW + gap2 + outW + 40 - W;
      if (overflow > 0) {
        const cut = overflow / 2 + 2;
        gap1 = Math.max(10, gap1 - cut);
        gap2 = Math.max(12, gap2 - cut);
      }
      const kX = inX + inW + gap1, kY = inY + (7 * cs - 3 * cs) / 2;
      const outX = kX + kW + gap2, outY = inY;

      // 场景定义
      const scenes = [
        { title: '场景1：步长1 无填充 → 输出3×3', stride: 1, pad: 0, outSize: 3, label: '步长1无填充' },
        { title: '场景2：步长2 无填充 → 输出2×2（步长大跨度大，输出变小）', stride: 2, pad: 0, outSize: 2, label: '步长2无填充' },
        { title: '场景3：步长1 padding=1 → 输入补零7×7 → 输出3×3（填充保持尺寸）', stride: 1, pad: 1, outSize: 3, label: '步长1+padding1' },
      ];

      function convAt(inMat, oi, oj, pad) {
        let sum = 0;
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
          const r = oi - pad + i, c = oj - pad + j;
          if (r >= 0 && r < inMat.length && c >= 0 && c < inMat[0].length) sum += inMat[r][c] * kernel[i][j];
        }
        return sum;
      }

      // 时间轴（秒）
      const T_SCENE_IN = 0.5;    // 场景入场
      const T_SCAN = 0.45;       // 每格扫描
      const T_FORMULA = 0.5;     // 公式卡
      const T_SCENE_OUT = 0.4;   // 场景切换
      const sceneDur = T_SCENE_IN + (9 * T_SCAN) + T_FORMULA + T_SCENE_OUT;
      const TOTAL = scenes.length * sceneDur + 0.3;

      let stage = 0;
      const stageNames = scenes.map(s => s.title);

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 当前场景
        const sceneIdx = Math.min(Math.floor(sec / sceneDur), scenes.length - 1);
        const sceneSec = sec - sceneIdx * sceneDur;
        const sc = scenes[sceneIdx];
        if (sceneIdx !== stage) { stage = sceneIdx; setStatus(stageNames[stage]); }

        // 场景切换过渡（最后一场播完定格，不淡出）
        let sceneAlpha = 1;
        if (sceneSec < T_SCENE_IN) sceneAlpha = easeOutCubic(win(sceneSec, 0, T_SCENE_IN));
        else if (sceneIdx < scenes.length - 1 && sceneSec > sceneDur - T_SCENE_OUT) sceneAlpha = easeOutCubic(win(sceneDur - sceneSec, 0, T_SCENE_OUT));
        if (sceneAlpha <= 0) return;

        // 输入矩阵
        let inMat = input;
        let inDrawX = inX, inDrawY = inY;
        if (sc.pad > 0) {
          inMat = Array.from({ length: 7 }, () => Array(7).fill(0));
          for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) inMat[i + 1][j + 1] = input[i][j];
        }
        const matN = inMat.length;
        const inP = easeOutCubic(win(sceneSec, 0, T_SCENE_IN));
        ctx.save(); ctx.globalAlpha = sceneAlpha * inP;
        ctx.fillStyle = '#3a2a7a'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText(sc.pad > 0 ? `输入 ${matN}×${matN}（补零）` : '输入 5×5', inDrawX, inDrawY - 8);
        for (let i = 0; i < matN; i++) {
          for (let j = 0; j < matN; j++) {
            const cp = easeOutCubic(win(sceneSec, 0.05 + (i * matN + j) * 0.008, 0.35 + (i * matN + j) * 0.008));
            if (cp <= 0) continue;
            ctx.save(); ctx.globalAlpha = sceneAlpha * cp;
            // 判断是否在激活窗口内
            let inWin = false;
            if (sceneSec > T_SCENE_IN) {
              const scanT = sceneSec - T_SCENE_IN;
              const idx = Math.floor(scanT / T_SCAN);
              if (idx < sc.outSize * sc.outSize) {
                const oi = Math.floor(idx / sc.outSize), oj = idx % sc.outSize;
                const r0 = oi - sc.pad, c0 = oj - sc.pad;
                inWin = (i >= r0 && i < r0 + 3 && j >= c0 && j < c0 + 3);
              }
            }
            ctx.fillStyle = inWin ? 'rgba(165,134,232,0.18)' : 'rgba(255,255,255,0.72)';
            ctx.strokeStyle = inWin ? '#a586e8' : '#d3d8ee';
            ctx.lineWidth = inWin ? 1.6 : 1;
            roundRect(ctx, inDrawX + j * cs, inDrawY + i * cs, cs - 2, cs - 2, 3);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#6c5ce7'; ctx.font = compact ? '10px sans-serif' : '12px sans-serif';
            ctx.fillText(inMat[i][j], inDrawX + j * cs + cs / 2 - 1, inDrawY + i * cs + cs / 2);
            ctx.restore();
          }
        }
        ctx.restore();

        // 激活窗口框
        if (sceneSec > T_SCENE_IN) {
          const scanT = sceneSec - T_SCENE_IN;
          const idx = Math.min(Math.floor(scanT / T_SCAN), sc.outSize * sc.outSize - 1);
          const oi = Math.floor(idx / sc.outSize), oj = idx % sc.outSize;
          const r0 = oi - sc.pad, c0 = oj - sc.pad;
          const wx = inDrawX + c0 * cs, wy = inDrawY + r0 * cs;
          const wp = easeOutCubic(win(scanT, idx * T_SCAN, idx * T_SCAN + 0.25));
          ctx.save();
          ctx.globalAlpha = sceneAlpha * wp;
          ctx.strokeStyle = '#a586e8'; ctx.lineWidth = 2.4;
          ctx.setLineDash([5, 3]);
          roundRect(ctx, wx - 2, wy - 2, cs * 3 + 2, cs * 3 + 2, 4);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }

        // 卷积核
        const kP = easeOutBack(win(sceneSec, 0.15, 0.45));
        ctx.save(); ctx.globalAlpha = sceneAlpha * kP;
        ctx.fillStyle = '#3a2a7a'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('核 3×3', kX, kY - 8);
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const kp = easeOutBack(win(sceneSec, 0.15 + (i * 3 + j) * 0.03, 0.4 + (i * 3 + j) * 0.03));
            if (kp <= 0) continue;
            const s = Math.max(0, kp);
            ctx.save();
            ctx.translate(kX + j * cs + cs / 2, kY + i * cs + cs / 2);
            ctx.scale(s, s);
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.strokeStyle = '#6e63ff'; ctx.lineWidth = 1.2;
            roundRect(ctx, -cs / 2, -cs / 2, cs - 2, cs - 2, 3);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold ' + (cs < 20 ? 12 : 13) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(kernel[i][j], 0, 0);
            ctx.restore();
          }
        }
        ctx.restore();

        // 输出特征图
        const outP = easeOutCubic(win(sceneSec, 0.1, 0.4));
        ctx.save(); ctx.globalAlpha = sceneAlpha * outP;
        ctx.fillStyle = '#3a2a7a'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText(`输出 ${sc.outSize}×${sc.outSize}`, outX, outY - 8);
        for (let i = 0; i < sc.outSize; i++) {
          for (let j = 0; j < sc.outSize; j++) {
            const idx = i * sc.outSize + j;
            const outStart = T_SCENE_IN + idx * T_SCAN;
            const op = easeOutBack(win(sceneSec, outStart, outStart + T_SCAN * 0.7));
            if (op <= 0) {
              ctx.fillStyle = 'rgba(255,255,255,0.5)';
              ctx.strokeStyle = '#d3d8ee'; ctx.lineWidth = 1;
              roundRect(ctx, outX + j * os, outY + i * os, os - 2, os - 2, 4);
              ctx.fill(); ctx.stroke();
              continue;
            }
            const s = Math.max(0, op);
            ctx.save();
            ctx.translate(outX + j * os + os / 2, outY + i * os + os / 2);
            ctx.scale(s, s);
            ctx.fillStyle = 'rgba(165,134,232,0.2)';
            ctx.strokeStyle = '#a586e8'; ctx.lineWidth = 1.6;
            roundRect(ctx, -os / 2, -os / 2, os - 2, os - 2, 4);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold ' + (os < 22 ? 13 : 15) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(convAt(inMat, i, j, sc.pad), 0, 0);
            ctx.restore();
          }
        }
        ctx.restore();

        // 公式卡
        const fw = sc.pad > 0 ? `(5-3+2×${sc.pad})/${sc.stride}+1=${sc.outSize}` : `(5-3+0)/${sc.stride}+1=${sc.outSize}`;
        const fP = easeOutCubic(win(sceneSec, T_SCENE_IN + sc.outSize * sc.outSize * T_SCAN, T_SCENE_IN + sc.outSize * sc.outSize * T_SCAN + T_FORMULA));
        if (fP > 0) {
          const cw = Math.min(210, W - 40 - outX), ch = 36;
          const cx = outX, cy = outY + sc.outSize * os + 12;
          ctx.save(); ctx.globalAlpha = sceneAlpha * fP;
          glassPanel(ctx, cx, cy, cw, ch, 10, 0.62);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold ' + (cw < 190 ? 14 : 15) + 'px monospace'; ctx.textAlign = 'left';
          ctx.fillText(`输出尺寸 = ${fw}`, cx + 10, cy + ch / 2);
          ctx.textAlign = 'center';
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('对比完成：步长↑→输出↓，padding↑→输出↑。公式 (W-F+2P)/S+1', 'ok');
    },
  });

  // —— 内置 canvas 模板 10：广度优先搜索 BFS（树形逐层扩展，队列驱动访问）——
  // 固定二叉树：A根→B,C→D,E,F,G。访问顺序 A→B→C→D→E→F→G，每步出队访问、子节点入队。
  // —— 内置 canvas 模板：BFS 广度优先搜索（迷宫方格版）——
  registerCanvas('bfs-search', {
    title: TEMPLATE_TITLES['bfs-search'],
    mount: makeCanvasHD,
    async play(values, api) {
      var ctx = api.ctx, setStatus = api.setStatus;
      var W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      var win = function (sec, a, b) { return clamp01((sec - a) / (b - a)); };

      // 4 种迷宫预设
      var MAZES = {
        1: {  // 简单直通
          name: '简单直通',
          grid: [
            [2,0,0,0,0,0],
            [0,1,1,0,1,0],
            [0,0,0,0,0,0],
            [0,1,0,1,1,0],
            [0,0,0,0,0,3],
          ],
          start: [0,0], end: [4,5],
        },
        2: {  // 蜿蜒通道
          name: '蜿蜒通道',
          grid: [
            [2,0,1,0,0,0],
            [1,0,1,0,1,0],
            [0,0,0,0,1,0],
            [0,1,1,1,1,0],
            [0,0,0,0,0,3],
          ],
          start: [0,0], end: [4,5],
        },
        3: {  // 死胡同多
          name: '死胡同多',
          grid: [
            [2,0,0,1,0,0],
            [0,1,0,1,0,1],
            [0,1,0,0,0,0],
            [0,0,0,1,1,0],
            [1,1,0,0,0,3],
          ],
          start: [0,0], end: [4,5],
        },
        4: {  // 开阔迷宫
          name: '开阔迷宫',
          grid: [
            [2,0,0,0,0,0],
            [0,0,1,0,0,0],
            [0,0,0,0,1,0],
            [0,1,0,0,0,0],
            [0,0,0,1,0,3],
          ],
          start: [0,0], end: [4,5],
        },
      };

      var sceneIdx = (values && values.length > 0) ? Math.floor(values[0]) : 1;
      if (sceneIdx < 1) sceneIdx = 1;
      if (sceneIdx > 4) sceneIdx = 4;
      var maze = MAZES[sceneIdx];
      var grid = maze.grid;
      var rows = grid.length, cols = grid[0].length;
      var start = maze.start, end = maze.end;

      // 计算 BFS 搜索过程
      function bfsSteps() {
        var visited = {};
        var queue = [];
        var steps = [];
        var parent = {};
        var startKey = start[0] + ',' + start[1];
        var endKey = end[0] + ',' + end[1];

        queue.push(start);
        visited[startKey] = true;
        steps.push({ type: 'enqueue', r: start[0], c: start[1], label: '起点入队，开始搜索' });

        var dirs = [[-1,0],[1,0],[0,-1],[0,1]]; // 上下左右
        var found = false;

        while (queue.length > 0 && !found) {
          var cur = queue.shift();
          var r = cur[0], c = cur[1];
          var curKey = r + ',' + c;
          steps.push({ type: 'visit', r: r, c: c, label: '出队访问 (' + r + ',' + c + ')' });

          if (r === end[0] && c === end[1]) {
            found = true;
            break;
          }

          var neighbors = [];
          for (var d = 0; d < 4; d++) {
            var nr = r + dirs[d][0], nc = c + dirs[d][1];
            var nKey = nr + ',' + nc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== 1 && !visited[nKey]) {
              visited[nKey] = true;
              parent[nKey] = curKey;
              queue.push([nr, nc]);
              neighbors.push('(' + nr + ',' + nc + ')');
            }
          }
          if (neighbors.length > 0) {
            steps.push({ type: 'enqueue', r: -1, c: -1, label: '邻居 ' + neighbors.join(' ') + ' 入队' });
          }
        }

        // 回溯路径
        if (found) {
          var path = [];
          var key = endKey;
          while (key) {
            var parts = key.split(',');
            path.unshift([parseInt(parts[0]), parseInt(parts[1])]);
            key = parent[key];
          }
          steps.push({ type: 'path', path: path, label: '找到终点！最短路径 ' + path.length + ' 步' });
        } else {
          steps.push({ type: 'fail', label: '搜索完成：没有到达终点的路径' });
        }

        return { steps: steps, found: found, pathLen: found ? (steps[steps.length-1].path ? steps[steps.length-1].path.length : 0) : 0 };
      }

      var result = bfsSteps();
      var steps = result.steps;
      var T_IN = 0.8;
      var T_STEP = 0.55;
      var TOTAL = T_IN + steps.length * T_STEP + 0.8;

      var topSafe = 70, botSafe = H - 55, leftSafe = 30, rightSafe = W - 30;
      var availW = rightSafe - leftSafe;
      var availH = botSafe - topSafe;
      var cellSize = Math.min(availW / cols, availH / rows);
      var gridW = cellSize * cols;
      var gridH = cellSize * rows;
      var gridX = (W - gridW) / 2;
      var gridY = topSafe + (availH - gridH) / 2;

      var stage = -1;
      var stageNames = ['迷宫：' + maze.name + '。BFS = 队列，像水波一样逐层扩散'];
      for (var si = 0; si < steps.length; si++) stageNames.push(steps[si].label);

      var ok = await tweenPlay(api, TOTAL * 1000, function (p) {
        var sec = p * TOTAL;
        paintGlassBg(ctx, W, H);

        // 计算当前状态
        var visitedCells = {};
        var queueCells = {};
        var pathCells = {};
        var curStage = 0;
        var qArr = [];

        if (sec < T_IN) {
          curStage = 0;
        } else {
          var t = sec - T_IN;
          var idx = Math.min(Math.floor(t / T_STEP), steps.length - 1);
          curStage = 1 + idx;

          var curQ = [];
          for (var i = 0; i <= idx; i++) {
            var s = steps[i];
            if (s.type === 'enqueue') {
              // 找到 enqueue 对应的格子（这一步可能是批量入队）
              // 我们重新模拟
            }
          }
          // 重新模拟到当前步
          var simVisited = {};
          var simQueue = [];
          var step_i = 0;
          var visitPtr = 0; // 指向 visit 步骤
          var enqueuePtr = 0; // 指向 enqueue 步骤
          // 简化：我们按步骤类型重新播放
          var realSteps = [];
          for (var si = 0; si <= idx; si++) {
            realSteps.push(steps[si]);
          }
          // 模拟 BFS
          simVisited[start[0] + ',' + start[1]] = true;
          simQueue = [start.slice()];
          var q_ptr = 0;

          // 重新走一遍
          var simDirs = [[-1,0],[1,0],[0,-1],[0,1]];
          var currentStepIdx = 0;
          var simSteps = [];
          // 重新计算
          var simQ = [start.slice()];
          var simV = {};
          simV[start[0]+','+start[1]] = true;
          var simParent = {};
          var foundSim = false;
          var pathResult = null;

          var stepCount = 0;
          for (var si = 0; si < realSteps.length; si++) {
            var s2 = realSteps[si];
            if (s2.type === 'enqueue') {
              // 入队步骤：标记队列为当前 simQ
            } else if (s2.type === 'visit') {
              // 出队访问
              var curCell = simQ.shift();
              if (curCell) {
                var cr = curCell[0], cc = curCell[1];
                if (cr === end[0] && cc === end[1]) {
                  foundSim = true;
                  // 回溯路径
                  var pp = [];
                  var kk = cr + ',' + cc;
                  while (kk) {
                    var pp2 = kk.split(',');
                    pp.unshift([parseInt(pp2[0]), parseInt(pp2[1])]);
                    kk = simParent[kk];
                  }
                  pathResult = pp;
                }
                if (!foundSim) {
                  for (var dd = 0; dd < 4; dd++) {
                    var nnr = cr + simDirs[dd][0], nnc = cc + simDirs[dd][1];
                    var nk = nnr + ',' + nnc;
                    if (nnr >= 0 && nnr < rows && nnc >= 0 && nnc < cols && grid[nnr][nnc] !== 1 && !simV[nk]) {
                      simV[nk] = true;
                      simParent[nk] = cr + ',' + cc;
                      simQ.push([nnr, nnc]);
                    }
                  }
                }
              }
            } else if (s2.type === 'path') {
              pathResult = s2.path;
            }
          }
          // 填充显示状态
          for (var vk in simV) { visitedCells[vk] = true; }
          for (var qi = 0; qi < simQ.length; qi++) { queueCells[simQ[qi][0]+','+simQ[qi][1]] = true; }
          // 起点不显示在队列里（已访问）
          delete queueCells[start[0]+','+start[1]];
          if (pathResult) {
            for (var pi = 0; pi < pathResult.length; pi++) {
              pathCells[pathResult[pi][0]+','+pathResult[pi][1]] = true;
            }
          }
        }

        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 绘制迷宫方格
        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < cols; c++) {
            var x = gridX + c * cellSize;
            var y = gridY + r * cellSize;
            var key = r + ',' + c;
            var val = grid[r][c];

            // 背景
            ctx.save();
            var fillColor = '#ffffff';
            var strokeColor = '#d0d7e8';
            var isWall = val === 1;
            var isStart = val === 2;
            var isEnd = val === 3;
            var isVisited = visitedCells[key] && !isStart && !isEnd;
            var isQueued = queueCells[key];
            var isPath = pathCells[key];

            if (isWall) {
              fillColor = '#6e7a9e';
              strokeColor = '#54608a';
            } else if (isPath) {
              fillColor = '#ffd54f';
              strokeColor = '#ffb300';
            } else if (isStart) {
              fillColor = '#81c784';
              strokeColor = '#4caf50';
            } else if (isEnd) {
              fillColor = '#ef5350';
              strokeColor = '#e53935';
            } else if (isVisited) {
              fillColor = '#8ec5e0';
              strokeColor = '#5aa8c4';
            } else if (isQueued) {
              fillColor = '#e8f0fe';
              strokeColor = '#7aa7f0';
            }

            // 入场动画
            var appearT = 0.1 + (r * cols + c) * 0.025;
            var appearP = easeOutBack(win(sec, appearT, appearT + 0.4));
            if (appearP <= 0) { ctx.restore(); continue; }

            ctx.translate(x + cellSize/2, y + cellSize/2);
            ctx.scale(appearP, appearP);

            // 方格
            ctx.fillStyle = fillColor;
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 1.5;
            var pad = 2;
            var radius = Math.min(6, cellSize * 0.15);
            roundRect(ctx, -cellSize/2 + pad, -cellSize/2 + pad, cellSize - pad*2, cellSize - pad*2, radius);
            ctx.fill();
            ctx.stroke();

            // 文字
            ctx.fillStyle = isWall || isStart || isEnd ? '#ffffff' : '#5a4bb0';
            ctx.font = 'bold ' + Math.floor(cellSize * 0.3) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            if (isStart) ctx.fillText('S', 0, 0);
            else if (isEnd) ctx.fillText('E', 0, 0);

            ctx.restore();
          }
        }

        // 队列面板
        var qP = easeOutCubic(win(sec, 0.3, 0.8));
        if (qP > 0) {
          var qCount = 0;
          for (var qk in queueCells) if (queueCells[qk]) qCount++;
          var qText = '队列: ' + qCount + ' 个格子待访问';
          var tw = Math.min(280, W - 60), th = 26;
          var tx = (W - tw) / 2, ty = gridY - 40;
          ctx.save(); ctx.globalAlpha = qP;
          glassPanel(ctx, tx, ty, tw, th, 8, 0.75);
          ctx.fillStyle = '#5a4bb0'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(qText, W / 2, ty + th / 2);
          ctx.restore();
        }

        // 已访问计数
        var vP = easeOutCubic(win(sec, 0.5, 1.0));
        if (vP > 0) {
          var vCount = 0;
          for (var vkk in visitedCells) if (visitedCells[vkk]) vCount++;
          var vText = '已访问: ' + vCount + ' 格';
          var vtw = 120, vth = 26;
          var vtx = W - vtw - 30, vty = gridY - 40;
          ctx.save(); ctx.globalAlpha = vP;
          glassPanel(ctx, vtx, vty, vtw, vth, 8, 0.75);
          ctx.fillStyle = '#3a7ca5'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(vText, vtx + vtw/2, vty + vth / 2);
          ctx.restore();
        }
      });

      if (!ok) return;
      var finalMsg = result.found
        ? 'BFS 完成：找到最短路径 ' + result.pathLen + ' 步（广度优先保证最短）'
        : 'BFS 完成：没有可达路径';
      setStatus(finalMsg, 'ok');
    },
  });

  // —— 内置 canvas 模板 11：k近邻 kNN（查询点投票分类）——
  // 固定10个已分类点(5红5蓝) + 查询点(黄)，K=3，找最近3个投票决定查询点类别。
  registerCanvas('knn-classify', {
    title: TEMPLATE_TITLES['knn-classify'],
    mount: makeCanvasHD,
    async play(values, api) {
      var ctx = api.ctx, setStatus = api.setStatus;
      var W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      var win = function (sec, a, b) { return clamp01((sec - a) / (b - a)); };
      var topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      
      // 根据预设选择场景
      var sceneIdx = (values && values.length > 0) ? Math.floor(values[0]) : 1;
      if (sceneIdx < 1) sceneIdx = 1;
      if (sceneIdx > 3) sceneIdx = 3;
      
      var KNN_SCENES = {
        1: {  // 红蓝各半（明显可分）
          reds: [{x:.20,y:.20},{x:.30,y:.25},{x:.22,y:.40},{x:.35,y:.15},{x:.28,y:.35}],
          blues: [{x:.70,y:.70},{x:.75,y:.75},{x:.80,y:.65},{x:.68,y:.80},{x:.82,y:.72}],
          query: { x: .45, y: .45 },
          k: 3,
        },
        2: {  // 边界查询（靠近分界线）
          reds: [{x:.15,y:.30},{x:.25,y:.20},{x:.30,y:.40},{x:.20,y:.50},{x:.35,y:.35}],
          blues: [{x:.65,y:.60},{x:.75,y:.50},{x:.70,y:.70},{x:.80,y:.65},{x:.60,y:.75}],
          query: { x: .48, y: .48 },
          k: 3,
        },
        3: {  // 交错分布（难分）
          reds: [{x:.30,y:.60},{x:.40,y:.40},{x:.50,y:.70},{x:.35,y:.30},{x:.55,y:.50}],
          blues: [{x:.45,y:.55},{x:.55,y:.35},{x:.35,y:.70},{x:.60,y:.60},{x:.40,y:.45}],
          query: { x: .48, y: .52 },
          k: 5,
        },
      };
      var sc = KNN_SCENES[sceneIdx];
      var reds = sc.reds.map(function (p) { return { x: p.x, y: p.y }; });
      var blues = sc.blues.map(function (p) { return { x: p.x, y: p.y }; });
      var query = { x: sc.query.x, y: sc.query.y };
      var K = sc.k;
      
      var all = reds.map(function (p) { return { x: p.x, y: p.y, c: 1 }; }).concat(
        blues.map(function (p) { return { x: p.x, y: p.y, c: 0 }; })
      );
      var xPx = function (u) { return leftSafe + u * (rightSafe - leftSafe); };
      var yPx = function (v) { return topSafe + v * (botSafe - topSafe); };
      var qx = xPx(query.x), qy = yPx(query.y);
      var dists = all.map(function (p, i) { return { i: i, d: Math.hypot(p.x - query.x, p.y - query.y) }; });
      var sorted = dists.slice().sort(function (a, b) { return a.d - b.d; });
      var knn = sorted.slice(0, K);
      var redCnt = knn.filter(function (k) { return all[k.i].c === 1; }).length;
      var blueCnt = K - redCnt;
      var result = redCnt >= blueCnt ? '红' : '蓝';
      var resultColor = redCnt >= blueCnt ? '#d06a96' : '#6c8ff0';
      // 时间轴
      const T_KNOWN = 0.8, T_QUERY = 0.6, T_DIST = 1.0, T_KNN = 1.0, T_VOTE = 0.8, T_END = 0.5;
      const TOTAL = T_KNOWN + T_QUERY + T_DIST + T_KNN + T_VOTE + T_END;
      var stage = -1;
      var stageNames = [
        '已知数据：' + reds.length + '个红点 + ' + blues.length + '个蓝点（已分类）',
        '查询点(★)出现：类别未知，用kNN判断。取K=' + K,
        '计算查询点到每个已知点的距离',
        '选出最近' + K + '个邻居并高亮',
        '投票：红' + redCnt + ' vs 蓝' + blueCnt + ' → 查询点判定为"' + result + '"类',
      ];
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        // 阶段
        let curStage = 0;
        if (sec > T_KNOWN) curStage = 1;
        if (sec > T_KNOWN + T_QUERY) curStage = 2;
        if (sec > T_KNOWN + T_QUERY + T_DIST) curStage = 3;
        if (sec > T_KNOWN + T_QUERY + T_DIST + T_KNN) curStage = 4;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }
        // 网格
        ctx.strokeStyle = 'rgba(165,176,216,0.35)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
        for (let i = 1; i < 5; i++) {
          const gx = leftSafe + i * (rightSafe - leftSafe) / 5;
          const gy = topSafe + i * (botSafe - topSafe) / 5;
          ctx.beginPath(); ctx.moveTo(gx, topSafe); ctx.lineTo(gx, botSafe); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(leftSafe, gy); ctx.lineTo(rightSafe, gy); ctx.stroke();
        }
        ctx.setLineDash([]);
        // 已知点
        all.forEach((p, pi) => {
          const popP = easeOutBack(win(sec, 0.05 + pi * 0.06, 0.45 + pi * 0.06));
          if (popP <= 0) return;
          const cx = xPx(p.x), cy = yPx(p.y);
          const isKnn = curStage >= 3 && knn.some(k => k.i === pi);
          const isVote = curStage >= 4;
          ctx.save(); ctx.translate(cx, cy); ctx.scale(popP, popP);
          const baseColor = p.c === 1 ? '#d06a96' : '#6c8ff0';
          const fillColor = isVote && isKnn ? baseColor : baseColor;
          const strokeColor = isKnn ? (p.c === 1 ? '#d06a96' : '#6c8ff0') : '#fff';
          ctx.shadowColor = 'rgba(124,99,224,0.25)'; ctx.shadowBlur = 6;
          ctx.beginPath(); ctx.arc(0, 0, isKnn ? 7 : 6, 0, Math.PI * 2);
          ctx.fillStyle = fillColor; ctx.fill();
          ctx.strokeStyle = strokeColor; ctx.lineWidth = isKnn ? 2.6 : 1.8; ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.beginPath(); ctx.arc(-2, -2, 2, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        });
        // 查询点
        const qPop = easeOutBack(win(sec, T_KNOWN, T_KNOWN + T_QUERY));
        if (qPop > 0) {
          ctx.save(); ctx.translate(qx, qy); ctx.scale(qPop, qPop);
          ctx.shadowColor = 'rgba(122,167,240,0.5)'; ctx.shadowBlur = 10;
          ctx.fillStyle = '#7aa7f0';
          ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = '#fff';
          ctx.beginPath(); ctx.arc(-2, -2, 2.5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#5a4bb0'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('★', 0, -14);
          ctx.restore();
        }
        // 距离虚线
        if (curStage >= 2 && curStage < 3) {
          const dP = easeOutCubic(win(sec, T_KNOWN + T_QUERY, T_KNOWN + T_QUERY + T_DIST));
          ctx.strokeStyle = `rgba(211,216,238,${dP * 0.7})`; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
          dists.forEach(({ i }) => {
            const px = xPx(all[i].x), py = yPx(all[i].y);
            const ex = qx + (px - qx) * dP;
            const ey = qy + (py - qy) * dP;
            ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(ex, ey); ctx.stroke();
          });
          ctx.setLineDash([]);
        }
        // 最近3个高亮连线
        if (curStage >= 3) {
          const kP = easeOutCubic(win(sec, T_KNOWN + T_QUERY + T_DIST, T_KNOWN + T_QUERY + T_DIST + T_KNN));
          knn.forEach(k => {
            const px = xPx(all[k.i].x), py = yPx(all[k.i].y);
            ctx.strokeStyle = `rgba(122,167,240,${kP})`; ctx.lineWidth = 2.2; ctx.setLineDash([5, 3]);
            ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(qx + (px - qx) * kP, qy + (py - qy) * kP); ctx.stroke();
            ctx.setLineDash([]);
          });
        }
        // 投票结果标签
        if (curStage >= 4) {
          const vP = easeOutBack(win(sec, T_KNOWN + T_QUERY + T_DIST + T_KNN, T_KNOWN + T_QUERY + T_DIST + T_KNN + T_VOTE));
          if (vP > 0) {
            ctx.save(); ctx.globalAlpha = vP;
            const label = `红${redCnt} : 蓝${blueCnt} → ${result}类`;
            ctx.font = 'bold 14px sans-serif';
            const tw = ctx.measureText(label).width + 24;
            const th = 30;
            const tx = Math.min(Math.max(qx, leftSafe + tw / 2), rightSafe - tw / 2);
            const ty = qy - 42;
            glassPanel(ctx, tx - tw / 2, ty - th / 2, tw, th, 10, 0.85);
            ctx.fillStyle = resultColor; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(label, tx, ty);
            ctx.restore();
          }
        }
      });
      if (!ok) return;
      setStatus('kNN完成：K=' + K + '，投票红' + redCnt + ' vs 蓝' + blueCnt + '，查询点判定为"' + result + '"类', 'ok');
    },
  });

  // —— 内置 canvas 模板 12：池化层（2×2窗口最大池化降维）——
  // 4×4输入，2×2窗口步长2，输出2×2。每步高亮窗口、取最大值填入输出。
  registerCanvas('pooling', {
    title: TEMPLATE_TITLES['pooling'],
    mount: makeCanvasHD,
    async play(values, api) {
      var ctx = api.ctx, setStatus = api.setStatus;
      var W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      var win = function (sec, a, b) { return clamp01((sec - a) / (b - a)); };
      var topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      
      // 根据预设选择场景
      var sceneIdx = (values && values.length > 0) ? Math.floor(values[0]) : 1;
      if (sceneIdx < 1) sceneIdx = 1;
      if (sceneIdx > 4) sceneIdx = 4;
      
      var POOL_SCENES = {
        1: {  // 最大池化 4×4
          input: [[1, 3, 2, 4], [5, 6, 8, 7], [2, 9, 3, 1], [4, 2, 5, 6]],
          type: 'max',
          label: '最大池化',
        },
        2: {  // 平均池化 4×4
          input: [[1, 3, 2, 4], [5, 6, 8, 7], [2, 9, 3, 1], [4, 2, 5, 6]],
          type: 'avg',
          label: '平均池化',
        },
        3: {  // 5×5 池化
          input: [[1,2,3,4,5],[5,4,3,2,1],[2,3,1,5,4],[4,1,5,2,3],[3,5,2,4,1]],
          type: 'max',
          label: '5×5最大池化',
        },
        4: {  // 大步长 6×6 stride=3
          input: [[1,2,3,4,5,6],[6,5,4,3,2,1],[2,4,6,1,3,5],[5,3,1,6,4,2],[1,3,5,2,4,6],[6,4,2,5,3,1]],
          type: 'max',
          label: '大步长池化',
        },
      };
      var sc = POOL_SCENES[sceneIdx];
      var input = sc.input.map(function (row) { return row.slice(); });
      var poolType = sc.type;
      var poolLabel = sc.label;
      var inSize = input.length;
      var outSize = Math.floor(inSize / 2);
      const cs = Math.min(32, (botSafe - topSafe - 40) / 4, (rightSafe - leftSafe - 120) / 4);
      const os = Math.min(40, cs * 1.25);
      const inX = leftSafe, inY = topSafe + 12;
      const outX = Math.min(rightSafe - 2 * os, inX + 4 * cs + 70), outY = inY + (4 * cs - 2 * os) / 2;
      const arrowX1 = inX + 4 * cs + 12, arrowX2 = outX - 12, arrowY = inY + 2 * cs;
      // 时间轴
      const T_IN = 0.5, T_SCAN = 0.65, T_FORMULA = 0.7, T_END = 0.3;
      const TOTAL = T_IN + 4 * T_SCAN + T_FORMULA + T_END;
      let stage = -1;
      const stageNames = [
        '最大池化：2×2窗口 步长2，4×4输入→2×2输出（尺寸减半）',
        '窗口(0,0)：扫描4个数 → 最大值 = 6',
        '窗口(0,1)：扫描4个数 → 最大值 = 8',
        '窗口(1,0)：扫描4个数 → 最大值 = 9',
        '窗口(1,1)：扫描4个数 → 最大值 = 6',
        '输出尺寸 = (4-2)/2+1 = 2，保留主要特征并降维',
      ];
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        // 内容容器玻璃面板
        glassPanel(ctx, 28, topSafe - 8, W - 56, botSafe - topSafe + 24, 16, 0.55);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        // 阶段
        let curStage = 0;
        if (sec > T_IN) {
          const idx = Math.min(Math.floor((sec - T_IN) / T_SCAN), 3);
          curStage = 1 + idx;
          if (sec > T_IN + 4 * T_SCAN) curStage = 5;
        }
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }
        const winIdx = curStage >= 1 && curStage <= 4 ? curStage - 1 : -1;
        const winP = winIdx >= 0 ? easeOutCubic(win(sec, T_IN + winIdx * T_SCAN, T_IN + winIdx * T_SCAN + 0.25)) : 0;
        const fillP = winIdx >= 0 ? easeOutCubic(win(sec, T_IN + winIdx * T_SCAN + 0.35, T_IN + winIdx * T_SCAN + 0.6)) : 0;
        const oi = winIdx >= 0 ? Math.floor(winIdx / 2) : -1, oj = winIdx >= 0 ? winIdx % 2 : -1;
        // 输入矩阵
        ctx.fillStyle = '#3a2a7a'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('输入 4×4', inX, inY - 10);
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
          const cp = easeOutCubic(win(sec, 0.03 + (i * 4 + j) * 0.02, 0.3 + (i * 4 + j) * 0.02));
          if (cp <= 0) continue;
          const cx = inX + j * cs, cy = inY + i * cs;
          const inWin = winIdx >= 0 && i >= oi * 2 && i < oi * 2 + 2 && j >= oj * 2 && j < oj * 2 + 2;
          ctx.save(); ctx.globalAlpha = cp;
          ctx.fillStyle = inWin ? 'rgba(122,167,240,0.18)' : '#fff';
          ctx.strokeStyle = inWin ? '#7aa7f0' : '#a5b0d8'; ctx.lineWidth = inWin ? 2.2 : 1.2;
          ctx.fillRect(cx, cy, cs, cs); ctx.strokeRect(cx, cy, cs, cs);
          ctx.fillStyle = inWin ? '#5a4bb0' : '#6c5ce7'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(String(input[i][j]), cx + cs / 2, cy + cs / 2);
          ctx.restore();
        }
        // 窗口高亮
        if (winIdx >= 0 && winP > 0) {
          const wx = inX + oj * 2 * cs, wy = inY + oi * 2 * cs;
          ctx.save(); ctx.globalAlpha = winP;
          ctx.strokeStyle = '#7aa7f0'; ctx.lineWidth = 3; ctx.setLineDash([6, 4]);
          ctx.strokeRect(wx - 2, wy - 2, cs * 2 + 4, cs * 2 + 4);
          ctx.setLineDash([]);
          ctx.restore();
        }
        // 箭头
        ctx.strokeStyle = '#6c5ce7'; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(arrowX1, arrowY); ctx.lineTo(arrowX2, arrowY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(arrowX2, arrowY); ctx.lineTo(arrowX2 - 8, arrowY - 5); ctx.lineTo(arrowX2 - 8, arrowY + 5); ctx.closePath(); ctx.fillStyle = '#6c5ce7'; ctx.fill();
        ctx.fillStyle = '#6e6890'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('2×2 最大池化', (arrowX1 + arrowX2) / 2, arrowY - 14);
        // 输出
        ctx.fillStyle = '#3a2a7a'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('输出 2×2', outX, outY - 10);
        for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
          const ox = outX + j * os, oy = outY + i * os;
          let val = null, fillAlpha = 0.08;
          if (winIdx >= 0) {
            if (i * 2 + j < winIdx) {
              // 已完成
              let mx = -Infinity;
              for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) mx = Math.max(mx, input[i * 2 + a][j * 2 + b]);
              val = mx; fillAlpha = 1;
            } else if (i * 2 + j === winIdx && fillP > 0) {
              let mx = -Infinity;
              for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) mx = Math.max(mx, input[i * 2 + a][j * 2 + b]);
              val = mx; fillAlpha = fillP;
            }
          }
          ctx.save(); ctx.globalAlpha = Math.max(fillAlpha, 0.08);
          ctx.fillStyle = '#8ec5e0'; ctx.fillRect(ox, oy, os, os);
          ctx.strokeStyle = '#a5b0d8'; ctx.lineWidth = 1.4; ctx.strokeRect(ox, oy, os, os);
          if (val !== null) {
            ctx.fillStyle = '#fff'; ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(String(val), ox + os / 2, oy + os / 2);
          }
          ctx.restore();
        }
        // 公式
        const fP = easeOutCubic(win(sec, T_IN + 4 * T_SCAN, T_IN + 4 * T_SCAN + T_FORMULA));
        if (fP > 0) {
          ctx.save(); ctx.globalAlpha = fP;
          ctx.fillStyle = '#5a4bb0'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('输出尺寸 = (4−2)/2+1 = 2', (inX + outX + 2 * os) / 2, botSafe - 8);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('池化完成：4×4→2×2，保留主要特征并降维。最大池化取局部最大值', 'ok');
    },
  });

  // —— 内置 canvas 模板 13：深度优先搜索 DFS（一条路走到底，回溯）——
  // 复用 BFS 的同一棵二叉树：A→B,C；B→D,E；C→F,G。DFS 用栈（前序）：A→B→D→E→C→F→G
  // —— 内置 canvas 模板：DFS 深度优先搜索（迷宫方格版）——
  registerCanvas('dfs-search', {
    title: TEMPLATE_TITLES['dfs-search'],
    mount: makeCanvasHD,
    async play(values, api) {
      var ctx = api.ctx, setStatus = api.setStatus;
      var W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      var win = function (sec, a, b) { return clamp01((sec - a) / (b - a)); };

      // 4 种迷宫（与 BFS 相同，便于对比）
      var MAZES = {
        1: {
          name: '简单直通',
          grid: [
            [2,0,0,0,0,0],
            [0,1,1,0,1,0],
            [0,0,0,0,0,0],
            [0,1,0,1,1,0],
            [0,0,0,0,0,3],
          ],
          start: [0,0], end: [4,5],
        },
        2: {
          name: '蜿蜒通道',
          grid: [
            [2,0,1,0,0,0],
            [1,0,1,0,1,0],
            [0,0,0,0,1,0],
            [0,1,1,1,1,0],
            [0,0,0,0,0,3],
          ],
          start: [0,0], end: [4,5],
        },
        3: {
          name: '死胡同多',
          grid: [
            [2,0,0,1,0,0],
            [0,1,0,1,0,1],
            [0,1,0,0,0,0],
            [0,0,0,1,1,0],
            [1,1,0,0,0,3],
          ],
          start: [0,0], end: [4,5],
        },
        4: {
          name: '开阔迷宫',
          grid: [
            [2,0,0,0,0,0],
            [0,0,1,0,0,0],
            [0,0,0,0,1,0],
            [0,1,0,0,0,0],
            [0,0,0,1,0,3],
          ],
          start: [0,0], end: [4,5],
        },
      };

      var sceneIdx = (values && values.length > 0) ? Math.floor(values[0]) : 1;
      if (sceneIdx < 1) sceneIdx = 1;
      if (sceneIdx > 4) sceneIdx = 4;
      var maze = MAZES[sceneIdx];
      var grid = maze.grid;
      var rows = grid.length, cols = grid[0].length;
      var start = maze.start, end = maze.end;

      // 计算 DFS 搜索过程（迭代版，用栈）
      function dfsSteps() {
        var visited = {};
        var stack = [];
        var steps = [];
        var parent = {};
        var startKey = start[0] + ',' + start[1];
        var endKey = end[0] + ',' + end[1];

        stack.push(start);
        visited[startKey] = true;
        steps.push({ type: 'push', r: start[0], c: start[1], label: '起点入栈，开始搜索' });

        var dirs = [[-1,0],[0,-1],[1,0],[0,1]]; // 上左下右（逆序入栈→正序出栈）
        var found = false;

        while (stack.length > 0 && !found) {
          var cur = stack.pop();
          var r = cur[0], c = cur[1];
          var curKey = r + ',' + c;
          steps.push({ type: 'visit', r: r, c: c, label: '出栈访问 (' + r + ',' + c + ')，沿此方向深入' });

          if (r === end[0] && c === end[1]) {
            found = true;
            break;
          }

          var pushed = [];
          // 逆序入栈，保证出栈顺序是 上→左→下→右
          for (var d = dirs.length - 1; d >= 0; d--) {
            var nr = r + dirs[d][0], nc = c + dirs[d][1];
            var nKey = nr + ',' + nc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== 1 && !visited[nKey]) {
              visited[nKey] = true;
              parent[nKey] = curKey;
              stack.push([nr, nc]);
              pushed.push('(' + nr + ',' + nc + ')');
            }
          }
          if (pushed.length > 0) {
            steps.push({ type: 'push', r: -1, c: -1, label: '邻居 ' + pushed.join(' ') + ' 入栈（右先入→先出左）' });
          } else {
            steps.push({ type: 'backtrack', r: r, c: c, label: '死胡同！回溯，退回上一个岔路口' });
          }
        }

        // 回溯路径
        if (found) {
          var path = [];
          var key = endKey;
          while (key) {
            var parts = key.split(',');
            path.unshift([parseInt(parts[0]), parseInt(parts[1])]);
            key = parent[key];
          }
          steps.push({ type: 'path', path: path, label: '找到终点！路径长 ' + path.length + ' 步（DFS 不保证最短）' });
        } else {
          steps.push({ type: 'fail', label: '搜索完成：没有到达终点的路径' });
        }

        return { steps: steps, found: found, pathLen: found ? (steps[steps.length-1].path ? steps[steps.length-1].path.length : 0) : 0 };
      }

      var result = dfsSteps();
      var steps = result.steps;
      var T_IN = 0.8;
      var T_STEP = 0.5;
      var TOTAL = T_IN + steps.length * T_STEP + 0.8;

      var topSafe = 70, botSafe = H - 55, leftSafe = 30, rightSafe = W - 30;
      var availW = rightSafe - leftSafe;
      var availH = botSafe - topSafe;
      var cellSize = Math.min(availW / cols, availH / rows);
      var gridW = cellSize * cols;
      var gridH = cellSize * rows;
      var gridX = (W - gridW) / 2;
      var gridY = topSafe + (availH - gridH) / 2;

      var stage = -1;
      var stageNames = ['迷宫：' + maze.name + '。DFS = 栈，一条路走到底再回溯'];
      for (var si = 0; si < steps.length; si++) stageNames.push(steps[si].label);

      var ok = await tweenPlay(api, TOTAL * 1000, function (p) {
        var sec = p * TOTAL;
        paintGlassBg(ctx, W, H);

        // 计算当前状态 - 重新模拟 DFS 到当前步
        var visitedCells = {};
        var stackCells = {};
        var pathCells = {};
        var curStage = 0;

        if (sec < T_IN) {
          curStage = 0;
        } else {
          var t = sec - T_IN;
          var idx = Math.min(Math.floor(t / T_STEP), steps.length - 1);
          curStage = 1 + idx;

          // 重新模拟 DFS
          var simV = {};
          var simStack = [];
          var simParent = {};
          var foundSim = false;
          var pathResult = null;
          var simDirs = [[-1,0],[0,-1],[1,0],[0,1]];

          simV[start[0]+','+start[1]] = true;
          simStack = [start.slice()];

          var stepCount = 0;
          for (var si = 0; si <= idx; si++) {
            var s2 = steps[si];
            if (s2.type === 'push') {
              // 入栈步骤：不推进模拟（push 已经在 visit 里做了）
            } else if (s2.type === 'visit' || s2.type === 'backtrack') {
              // 出栈访问
              if (simStack.length > 0) {
                var curCell = simStack.pop();
                var cr = curCell[0], cc = curCell[1];
                if (cr === end[0] && cc === end[1]) {
                  foundSim = true;
                  var pp = [];
                  var kk = cr + ',' + cc;
                  while (kk) {
                    var pp2 = kk.split(',');
                    pp.unshift([parseInt(pp2[0]), parseInt(pp2[1])]);
                    kk = simParent[kk];
                  }
                  pathResult = pp;
                }
                if (!foundSim) {
                  for (var d = simDirs.length - 1; d >= 0; d--) {
                    var nnr = cr + simDirs[d][0], nnc = cc + simDirs[d][1];
                    var nk = nnr + ',' + nnc;
                    if (nnr >= 0 && nnr < rows && nnc >= 0 && nnc < cols && grid[nnr][nnc] !== 1 && !simV[nk]) {
                      simV[nk] = true;
                      simParent[nk] = cr + ',' + cc;
                      simStack.push([nnr, nnc]);
                    }
                  }
                }
              }
            } else if (s2.type === 'path') {
              pathResult = s2.path;
            }
          }

          // 填充显示状态
          for (var vk in simV) { visitedCells[vk] = true; }
          for (var qi = 0; qi < simStack.length; qi++) { stackCells[simStack[qi][0]+','+simStack[qi][1]] = true; }
          delete stackCells[start[0]+','+start[1]];
          if (pathResult) {
            for (var pi = 0; pi < pathResult.length; pi++) {
              pathCells[pathResult[pi][0]+','+pathResult[pi][1]] = true;
            }
          }
        }

        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 绘制迷宫方格（与 BFS 相同的视觉风格）
        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < cols; c++) {
            var x = gridX + c * cellSize;
            var y = gridY + r * cellSize;
            var key = r + ',' + c;
            var val = grid[r][c];

            ctx.save();
            var fillColor = '#ffffff';
            var strokeColor = '#d0d7e8';
            var isWall = val === 1;
            var isStart = val === 2;
            var isEnd = val === 3;
            var isVisited = visitedCells[key] && !isStart && !isEnd;
            var isStacked = stackCells[key];
            var isPath = pathCells[key];

            if (isWall) {
              fillColor = '#6e7a9e';
              strokeColor = '#54608a';
            } else if (isPath) {
              fillColor = '#ffd54f';
              strokeColor = '#ffb300';
            } else if (isStart) {
              fillColor = '#81c784';
              strokeColor = '#4caf50';
            } else if (isEnd) {
              fillColor = '#ef5350';
              strokeColor = '#e53935';
            } else if (isVisited) {
              fillColor = '#ce93d8';
              strokeColor = '#ab47bc';
            } else if (isStacked) {
              fillColor = '#f3e5f5';
              strokeColor = '#ba68c8';
            }

            var appearT = 0.1 + (r * cols + c) * 0.025;
            var appearP = easeOutBack(win(sec, appearT, appearT + 0.4));
            if (appearP <= 0) { ctx.restore(); continue; }

            ctx.translate(x + cellSize/2, y + cellSize/2);
            ctx.scale(appearP, appearP);

            ctx.fillStyle = fillColor;
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 1.5;
            var pad = 2;
            var radius = Math.min(6, cellSize * 0.15);
            roundRect(ctx, -cellSize/2 + pad, -cellSize/2 + pad, cellSize - pad*2, cellSize - pad*2, radius);
            ctx.fill(); ctx.stroke();

            ctx.fillStyle = isWall || isStart || isEnd ? '#ffffff' : '#5a4bb0';
            ctx.font = 'bold ' + Math.floor(cellSize * 0.3) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            if (isStart) ctx.fillText('S', 0, 0);
            else if (isEnd) ctx.fillText('E', 0, 0);

            ctx.restore();
          }
        }

        // 栈面板
        var sP = easeOutCubic(win(sec, 0.3, 0.8));
        if (sP > 0) {
          var sCount = 0;
          for (var sk in stackCells) if (stackCells[sk]) sCount++;
          var sText = '栈: ' + sCount + ' 个格子待探索';
          var tw = Math.min(280, W - 60), th = 26;
          var tx = (W - tw) / 2, ty = gridY - 40;
          ctx.save(); ctx.globalAlpha = sP;
          glassPanel(ctx, tx, ty, tw, th, 8, 0.75);
          ctx.fillStyle = '#7b1fa2'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(sText, W / 2, ty + th / 2);
          ctx.restore();
        }

        // 已访问计数
        var vP = easeOutCubic(win(sec, 0.5, 1.0));
        if (vP > 0) {
          var vCount = 0;
          for (var vkk in visitedCells) if (visitedCells[vkk]) vCount++;
          var vText = '已访问: ' + vCount + ' 格';
          var vtw = 120, vth = 26;
          var vtx = W - vtw - 30, vty = gridY - 40;
          ctx.save(); ctx.globalAlpha = vP;
          glassPanel(ctx, vtx, vty, vtw, vth, 8, 0.75);
          ctx.fillStyle = '#6a1b9a'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(vText, vtx + vtw/2, vty + vth / 2);
          ctx.restore();
        }
      });

      if (!ok) return;
      var finalMsg = result.found
        ? 'DFS 完成：找到路径 ' + result.pathLen + ' 步（深度优先，不保证最短）'
        : 'DFS 完成：没有可达路径';
      setStatus(finalMsg, 'ok');
    },
  });

  // —— 内置 canvas 模板 14：线性回归（最小二乘 + 梯度下降拟合直线）——
  // 8 个散点近似 y=2x+1（带噪声），从水平线起迭代收敛到拟合直线
  registerCanvas('linear-regression', {
    title: TEMPLATE_TITLES['linear-regression'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const pts = [[0.1,1.3],[0.2,1.5],[0.3,1.6],[0.4,1.9],[0.5,2.0],[0.6,2.2],[0.7,2.3],[0.8,2.6]];
      const xMean = pts.reduce((s, p) => s + p[0], 0) / pts.length;
      const yMean = pts.reduce((s, p) => s + p[1], 0) / pts.length;
      const lr = 0.08;
      // 预计算迭代序列
      const steps = [{ a: yMean, b: 0 }];
      for (let i = 1; i <= 18; i++) {
        let { a, b } = steps[i - 1];
        let da = 0, db = 0;
        pts.forEach(([x, y]) => {
          const r = y - (a + b * x);
          da += -r; db += -r * x;
        });
        steps.push({ a: a - lr * da / pts.length, b: b - lr * db / pts.length });
      }
      const finalA = steps[steps.length - 1].a, finalB = steps[steps.length - 1].b;
      const toX = x => leftSafe + x * (rightSafe - leftSafe);
      const toY = y => botSafe - y * (botSafe - topSafe) / 3;
      function lossAt(a, b) {
        return pts.reduce((s, [x, y]) => s + 0.5 * (y - (a + b * x)) ** 2, 0);
      }
      // 时间轴：散点入场 → 初始线 → 18步压缩为6大步 → 结果
      const T_PTS = 0.7, T_INIT = 0.6, T_ITER = 0.55, T_RESULT = 0.8, T_END = 0.4;
      const ITER_STEPS = 6;
      const TOTAL = T_PTS + T_INIT + ITER_STEPS * T_ITER + T_RESULT + T_END;
      let stage = -1;
      const stageNames = [
        '8个散点近似 y≈2x+1（带噪声）',
        `初始：截距 a=${yMean.toFixed(2)}，斜率 b=0，损失 ${lossAt(yMean, 0).toFixed(3)}（水平线，未拟合）`,
        ...Array.from({length: ITER_STEPS}, (_, i) => {
          const s = steps[Math.min((i + 1) * 3, steps.length - 1)];
          return `迭代 ${Math.min((i + 1) * 3, 18)} 步：a=${s.a.toFixed(3)} b=${s.b.toFixed(3)} 损失=${lossAt(s.a, s.b).toFixed(3)}`;
        }),
        `线性回归收敛：y = ${finalA.toFixed(2)} + ${finalB.toFixed(2)}x`,
      ];
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        // 阶段
        let curStage = 0;
        if (sec > T_PTS) curStage = 1;
        if (sec > T_PTS + T_INIT) {
          const idx = Math.min(Math.floor((sec - T_PTS - T_INIT) / T_ITER), ITER_STEPS - 1);
          curStage = 2 + idx;
          if (sec > T_PTS + T_INIT + ITER_STEPS * T_ITER) curStage = 2 + ITER_STEPS;
        }
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }
        // 当前参数
        let curA = yMean, curB = 0;
        if (curStage >= 2) {
          const iterIdx = curStage - 2;
          const stepIdx = Math.min(iterIdx * 3, steps.length - 1);
          if (iterIdx < ITER_STEPS) {
            const t0 = T_PTS + T_INIT + iterIdx * T_ITER;
            const t1 = t0 + T_ITER;
            const prog = easeOutCubic(win(sec, t0, t1));
            const prevIdx = Math.max(0, stepIdx - 3);
            const prev = steps[prevIdx], next = steps[stepIdx];
            curA = prev.a + (next.a - prev.a) * prog;
            curB = prev.b + (next.b - prev.b) * prog;
          } else {
            curA = finalA; curB = finalB;
          }
        }
        // 坐标轴
        ctx.strokeStyle = 'rgba(165,176,216,0.6)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(leftSafe, topSafe); ctx.lineTo(leftSafe, botSafe); ctx.lineTo(rightSafe, botSafe);
        ctx.stroke();
        // 刻度
        ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        [0, 1, 2, 3].forEach(yv => ctx.fillText(String(yv), leftSafe - 8, toY(yv)));
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        [0, 0.2, 0.4, 0.6, 0.8, 1].forEach(xv => ctx.fillText(String(xv), toX(xv), botSafe + 6));
        ctx.textBaseline = 'alphabetic';
        // 误差虚线
        pts.forEach(([x, y]) => {
          const yhat = curA + curB * x;
          ctx.strokeStyle = 'rgba(232,139,184,0.45)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(toX(x), toY(y));
          ctx.lineTo(toX(x), toY(yhat));
          ctx.stroke();
          ctx.setLineDash([]);
        });
        // 散点
        pts.forEach(([x, y], i) => {
          const popP = easeOutBack(win(sec, 0.05 + i * 0.05, 0.4 + i * 0.05));
          if (popP <= 0) return;
          ctx.save(); ctx.translate(toX(x), toY(y)); ctx.scale(popP, popP);
          ctx.shadowColor = 'rgba(124,99,224,0.35)'; ctx.shadowBlur = 6;
          ctx.fillStyle = '#6c5ce7';
          ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = '#3b3264'; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.beginPath(); ctx.arc(-1.5, -1.5, 1.5, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        });
        // 拟合直线
        const lineP = easeOutCubic(win(sec, T_PTS, T_PTS + T_INIT));
        if (lineP > 0) {
          ctx.strokeStyle = curStage >= 2 + ITER_STEPS ? '#8ec5e0' : '#7aa7f0'; ctx.lineWidth = 2.8; ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(toX(0), toY(curA + curB * 0));
          ctx.lineTo(toX(lineP), toY(curA + curB * lineP));
          ctx.stroke();
        }
        // 方程标签
        ctx.fillStyle = '#5a4bb0'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText(`y = ${curA.toFixed(2)} + ${curB.toFixed(2)}x`, leftSafe + 8, topSafe + 8);
        // 收敛标记
        if (curStage >= 2 + ITER_STEPS) {
          const rP = easeOutBack(win(sec, T_PTS + T_INIT + ITER_STEPS * T_ITER, T_PTS + T_INIT + ITER_STEPS * T_ITER + T_RESULT));
          if (rP > 0) {
            ctx.save(); ctx.globalAlpha = rP;
            const label = `收敛：y = ${finalA.toFixed(2)} + ${finalB.toFixed(2)}x`;
            ctx.font = 'bold 14px sans-serif';
            const tw = ctx.measureText(label).width + 24;
            const th = 30;
            const tx = (leftSafe + rightSafe) / 2, ty = topSafe + 42;
            glassPanel(ctx, tx - tw / 2, ty - th / 2, tw, th, 10, 0.85);
            ctx.fillStyle = '#8ec5e0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(label, tx, ty);
            ctx.restore();
          }
        }
      });
      if (!ok) return;
      setStatus(`线性回归收敛：y = ${finalA.toFixed(2)} + ${finalB.toFixed(2)}x（最小二乘+梯度下降拟合）`, 'ok');
    },
  });

  // —— 内置 canvas 模板 15：信息熵（对比3种分布的不确定性度量）——
  // 场景1 [0,0,0,8] H=0；场景2 [4,4,0,0] H=1；场景3 [2,2,2,2] H=2
  registerCanvas('entropy', {
    title: TEMPLATE_TITLES['entropy'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const scenarios = [
        { name: '场景 1：全部集中在类别 4', counts: [0, 0, 0, 8], desc: '完全确定' },
        { name: '场景 2：两类各 4 个', counts: [4, 4, 0, 0], desc: '中等不确定性' },
        { name: '场景 3：四类均匀分布', counts: [2, 2, 2, 2], desc: '最大不确定性' },
      ];
      const maxCount = 8;
      const barW = Math.min(48, (rightSafe - leftSafe) * 0.10);
      const gap = (rightSafe - leftSafe) / 4;
      const barX = [leftSafe + gap * 0.5, leftSafe + gap * 1.5, leftSafe + gap * 2.5, leftSafe + gap * 3.5];
      function calcEntropy(counts) {
        const total = counts.reduce((s, c) => s + c, 0);
        if (total === 0) return 0;
        let h = 0;
        counts.forEach(c => { if (c > 0) { const p = c / total; h -= p * Math.log2(p); } });
        return h;
      }
      // 时间轴
      const T_SCENE = 2.0, T_SUM = 0.6, T_END = 0.3;
      const TOTAL = scenarios.length * T_SCENE + T_SUM + T_END;
      let stage = -1;
      const stageNames = scenarios.map(s => s.name + '：' + s.desc);
      stageNames.push('熵衡量不确定性：确定时为 0，均匀分布时取最大值 log₂(类别数)');
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const sceneIdx = Math.min(Math.floor(sec / T_SCENE), scenarios.length - 1);
        const sceneSec = sec - sceneIdx * T_SCENE;
        const sc = scenarios[sceneIdx];
        const H_val = calcEntropy(sc.counts);
        let curStage = sceneIdx;
        if (sec > scenarios.length * T_SCENE) curStage = scenarios.length;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }
        // 场景标题
        ctx.fillStyle = '#5a4bb0'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText(sc.name, leftSafe, topSafe - 30);
        // 基线
        const baseY = botSafe - 10;
        ctx.strokeStyle = 'rgba(165,176,216,0.6)'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(leftSafe, baseY); ctx.lineTo(rightSafe, baseY); ctx.stroke();
        // 柱子
        sc.counts.forEach((c, i) => {
          const barH = (c / maxCount) * (baseY - topSafe - 20);
          const x = barX[i] - barW / 2;
          const y = baseY - barH;
          const growP = easeOutCubic(win(sceneSec, 0.05 + i * 0.08, 0.5 + i * 0.08));
          if (growP <= 0) return;
          const curH = barH * growP;
          const curY = baseY - curH;
          ctx.save();
          ctx.shadowColor = 'rgba(124,99,224,0.3)'; ctx.shadowBlur = 6;
          ctx.fillStyle = c > 0 ? '#6c5ce7' : 'rgba(241,243,252,0.6)';
          ctx.strokeStyle = c > 0 ? '#3b3264' : '#a5b0d8'; ctx.lineWidth = 1.6;
          if (curH > 0) {
            roundRect(ctx, x, curY, barW, curH, 4);
            ctx.fill(); ctx.stroke();
          } else {
            ctx.fillRect(x, baseY - 3, barW, 3);
            ctx.strokeRect(x, baseY - 3, barW, 3);
          }
          ctx.shadowColor = 'transparent';
          // 计数
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
          ctx.fillText(String(c), barX[i], curY - 4);
          // 类别
          ctx.fillStyle = '#6e6890'; ctx.font = '12px sans-serif'; ctx.textBaseline = 'top';
          ctx.fillText('类' + (i + 1), barX[i], baseY + 6);
          ctx.restore();
        });
        // 熵值
        const eP = easeOutBack(win(sceneSec, 0.5, 0.9));
        if (eP > 0) {
          ctx.save(); ctx.globalAlpha = eP;
          const label = `熵 H = ${H_val.toFixed(2)} bit`;
          ctx.font = 'bold 16px sans-serif';
          const tw = ctx.measureText(label).width + 24;
          const th = 32;
          const tx = rightSafe - tw / 2, ty = topSafe - 14;
          glassPanel(ctx, tx - tw / 2, ty - th / 2, tw, th, 10, 0.85);
          ctx.fillStyle = H_val === 0 ? '#8ec5e0' : '#7aa7f0';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(label, tx, ty);
          ctx.restore();
        }
        // 总结
        if (curStage >= scenarios.length) {
          const sP = easeOutCubic(win(sec, scenarios.length * T_SCENE, scenarios.length * T_SCENE + T_SUM));
          if (sP > 0) {
            ctx.save(); ctx.globalAlpha = sP;
            ctx.fillStyle = '#5a4bb0'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('对比：确定时 H=0，均匀时 H=log₂(类别数) 取最大值', (leftSafe + rightSafe) / 2, baseY + 26);
            ctx.restore();
          }
        }
      });
      if (!ok) return;
      setStatus('熵衡量不确定性：确定时为 0，均匀分布时取最大值 log₂(类别数)', 'ok');
    },
  });

  // —— 内置 canvas 模板 16：A* 启发式搜索（估值函数 f = g + h）——
  // 8×6 网格，左下角 S 起点 → 右上角 G 终点，中间 L 形障碍墙。h 用曼哈顿距离。
  registerCanvas('astar-search', {
    title: TEMPLATE_TITLES['astar-search'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const COLS = 8, ROWS = 6;
      const CS = Math.min(28, Math.floor((rightSafe - leftSafe) / COLS), Math.floor((botSafe - topSafe) / ROWS));
      const gridOX = leftSafe + ((rightSafe - leftSafe) - COLS * CS) / 2;
      const gridOY = topSafe + ((botSafe - topSafe) - ROWS * CS) / 2;
      const blocks = new Set(['3,1', '3,2', '3,3', '5,3', '5,4']);
      const start = { x: 0, y: 5 }, goal = { x: 7, y: 0 };
      const key = p => p.x + ',' + p.y;
      const manh = p => Math.abs(p.x - goal.x) + Math.abs(p.y - goal.y);
      // 预计算 A* 完整搜索过程
      const nodes = {};
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
        nodes[x + ',' + y] = { x, y, g: Infinity, h: manh({ x, y }), f: Infinity, parent: null, state: 'idle' };
      }
      const sN = nodes[key(start)];
      sN.g = 0; sN.f = sN.h; sN.state = 'open';
      const open = [sN];
      const expandOrder = [];
      while (open.length) {
        open.sort((a, b) => a.f - b.f || a.h - b.h);
        const cur = open.shift();
        cur.state = 'closed';
        expandOrder.push(cur);
        if (cur.x === goal.x && cur.y === goal.y) break;
        const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        for (const [dx, dy] of dirs) {
          const nx = cur.x + dx, ny = cur.y + dy;
          if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;
          const nKey = nx + ',' + ny;
          if (blocks.has(nKey)) continue;
          const n = nodes[nKey];
          if (n.state === 'closed') continue;
          const tg = cur.g + 1;
          if (tg < n.g) {
            n.g = tg; n.f = tg + n.h; n.parent = cur;
            if (n.state !== 'open') { n.state = 'open'; open.push(n); }
          }
        }
      }
      const path = [];
      let cur = nodes[key(goal)];
      while (cur) { path.unshift(cur); cur.state = 'path'; cur = cur.parent; }
      // 时间轴：压缩为8步
      const T_INIT = 0.6, T_STEP = 0.55, T_PATH = 0.9, T_END = 0.4;
      const SHOW_STEPS = Math.min(8, expandOrder.length);
      const stepEvery = Math.ceil(expandOrder.length / SHOW_STEPS);
      const shownSteps = [];
      for (let i = 0; i < expandOrder.length; i += stepEvery) shownSteps.push(expandOrder[i]);
      if (shownSteps[shownSteps.length - 1] !== expandOrder[expandOrder.length - 1]) shownSteps.push(expandOrder[expandOrder.length - 1]);
      const TOTAL = T_INIT + shownSteps.length * T_STEP + T_PATH + T_END;
      let stage = -1;
      const stageNames = [
        '初始化：8×6 网格，S→G，中间有障碍墙。A* 用 f=g+h 启发式搜索',
        ...shownSteps.map((n, i) => `第 ${i + 1} 步：扩展 (${n.x},${n.y})，g=${n.g} h=${n.h} f=${n.f}`),
        `A* 完成：共扩展 ${expandOrder.length} 个节点，最优路径长度 ${path.length - 1} 步`,
      ];
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        // 内容容器玻璃面板
        glassPanel(ctx, 28, topSafe - 8, W - 56, botSafe - topSafe + 24, 16, 0.55);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        // 阶段
        let curStage = 0;
        if (sec > T_INIT) {
          const idx = Math.min(Math.floor((sec - T_INIT) / T_STEP), shownSteps.length - 1);
          curStage = 1 + idx;
          if (sec > T_INIT + shownSteps.length * T_STEP) curStage = 1 + shownSteps.length;
        }
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }
        // 计算到当前步为止的节点状态
        const nState = {};
        for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) nState[x + ',' + y] = 'idle';
        const curOpen = [];
        const curClosed = [];
        const curPathSet = new Set();
        if (curStage >= 1) {
          const showIdx = Math.min(curStage - 1, shownSteps.length - 1);
          // 重放 expandOrder 到 shownSteps[showIdx]
          const targetNode = shownSteps[showIdx];
          const targetIdx = expandOrder.indexOf(targetNode);
          for (let i = 0; i <= targetIdx; i++) {
            const n = expandOrder[i];
            curClosed.push(n);
          }
          // 重新模拟 open
          const simNodes = {};
          for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
            simNodes[x + ',' + y] = { x, y, g: Infinity, h: manh({ x, y }), f: Infinity, parent: null, state: 'idle' };
          }
          const simS = simNodes[key(start)];
          simS.g = 0; simS.f = simS.h; simS.state = 'open';
          const simOpen = [simS];
          while (simOpen.length) {
            simOpen.sort((a, b) => a.f - b.f || a.h - b.h);
            const c = simOpen.shift();
            c.state = 'closed';
            if (c === simNodes[key(targetNode)]) break;
            const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
            for (const [dx, dy] of dirs) {
              const nx = c.x + dx, ny = c.y + dy;
              if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;
              const nk = nx + ',' + ny;
              if (blocks.has(nk)) continue;
              const n = simNodes[nk];
              if (n.state === 'closed') continue;
              const tg = c.g + 1;
              if (tg < n.g) {
                n.g = tg; n.f = tg + n.h; n.parent = c;
                if (n.state !== 'open') { n.state = 'open'; simOpen.push(n); }
              }
            }
          }
          Object.keys(simNodes).forEach(k => { nState[k] = simNodes[k].state; });
          simOpen.forEach(n => curOpen.push(n));
        }
        if (curStage >= 1 + shownSteps.length) {
          // 最终路径
          path.forEach(n => curPathSet.add(key(n)));
          // 全部 closed
          expandOrder.forEach(n => { nState[key(n)] = 'closed'; });
          curOpen.forEach(n => { if (!curPathSet.has(key(n))) nState[key(n)] = 'open'; });
          path.forEach(n => nState[key(n)] = 'path');
        }
        // 网格
        for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
          const px = gridOX + x * CS, py = gridOY + y * CS;
          const k = x + ',' + y;
          const st = nState[k];
          let fill = 'rgba(241,243,252,0.6)';
          if (blocks.has(k)) fill = '#6c5ce7';
          else if (st === 'open') fill = 'rgba(122,167,240,0.25)';
          else if (st === 'closed') fill = 'rgba(142,197,224,0.35)';
          else if (st === 'path') fill = 'rgba(208,106,150,0.5)';
          // 当前高亮
          if (curStage >= 1 && curStage <= shownSteps.length) {
            const hn = shownSteps[curStage - 1];
            if (hn.x === x && hn.y === y) fill = '#7aa7f0';
          }
          ctx.fillStyle = fill; ctx.strokeStyle = '#a5b0d8'; ctx.lineWidth = 1;
          ctx.fillRect(px, py, CS, CS); ctx.strokeRect(px, py, CS, CS);
          // f 值
          if (!blocks.has(k) && (st === 'open' || st === 'closed' || st === 'path')) {
            let fv = Infinity;
            if (curStage >= 1 + shownSteps.length) {
              const orig = nodes[k];
              if (orig.f < Infinity) fv = orig.f;
            } else if (curStage >= 1) {
              const targetNode = shownSteps[Math.min(curStage - 1, shownSteps.length - 1)];
              const targetIdx = expandOrder.indexOf(targetNode);
              // 找该节点在预计算中的 f
              const orig = nodes[k];
              if (orig.f < Infinity && orig.g <= expandOrder[targetIdx].g + 4) fv = orig.f;
            }
            if (fv < Infinity) {
              ctx.fillStyle = '#5a4bb0'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
              ctx.fillText(String(fv), px + CS / 2, py + CS / 2);
            }
          }
        }
        // 起点终点
        const sP = { x: gridOX + start.x * CS + CS / 2, y: gridOY + start.y * CS + CS / 2 };
        const gP = { x: gridOX + goal.x * CS + CS / 2, y: gridOY + goal.y * CS + CS / 2 };
        const sgPop = easeOutBack(win(sec, 0.05, 0.4));
        if (sgPop > 0) {
          ctx.save(); ctx.translate(sP.x, sP.y); ctx.scale(sgPop, sgPop);
          ctx.shadowColor = 'rgba(108,143,240,0.5)'; ctx.shadowBlur = 8;
          ctx.fillStyle = '#6c8ff0'; ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('S', 0, 0);
          ctx.restore();
          ctx.save(); ctx.translate(gP.x, gP.y); ctx.scale(sgPop, sgPop);
          ctx.shadowColor = 'rgba(208,106,150,0.5)'; ctx.shadowBlur = 8;
          ctx.fillStyle = '#d06a96'; ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('G', 0, 0);
          ctx.restore();
        }
        // 路径连线
        if (curStage >= 1 + shownSteps.length) {
          const pP = easeOutCubic(win(sec, T_INIT + shownSteps.length * T_STEP, T_INIT + shownSteps.length * T_STEP + T_PATH));
          if (pP > 0 && path.length > 1) {
            ctx.strokeStyle = '#d06a96'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.beginPath();
            const n = Math.max(2, Math.floor(path.length * pP));
            for (let i = 0; i < n; i++) {
              const px = gridOX + path[i].x * CS + CS / 2, py = gridOY + path[i].y * CS + CS / 2;
              if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
          }
        }
        // 图例
        ctx.fillStyle = '#6e6890'; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText('f=g+h (g=起点实距, h=曼哈顿估距)  橙=当前  浅蓝=待选  浅青=已扩展  红=最优路径', leftSafe, botSafe - 8);
      });
      if (!ok) return;
      setStatus(`A* 完成：共扩展 ${expandOrder.length} 个节点，找到最优路径长度 ${path.length - 1} 步`, 'ok');
    },
  });

  // —— 内置 canvas 模板 17：激活函数对比（阶跃/Sigmoid/Tanh/ReLU）——
  // 同一坐标系画 4 条曲线，逐步叠加。x∈[-6,6]，y∈[-1.5,1.5]
  registerCanvas('activation-functions', {
    title: TEMPLATE_TITLES['activation-functions'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const xMin = -6, xMax = 6, yMin = -1.5, yMax = 1.5;
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const padL = leftSafe, padR = W - rightSafe, padT = topSafe, padB = H - botSafe;
      const toX = x => padL + (x - xMin) / (xMax - xMin) * (W - padL - padR);
      const toY = y => H - padB - (y - yMin) / (yMax - yMin) * (H - padT - padB);
      const funcs = [
        { name: '阶跃 step', color: '#6c8ff0', fn: x => x >= 0 ? 1 : 0, desc: '硬切换，输出 0 或 1，感知机早期使用' },
        { name: 'Sigmoid σ', color: '#7aa7f0', fn: x => 1 / (1 + Math.exp(-x)), desc: 'S 形，输出 (0,1)，平滑但易饱和' },
        { name: 'Tanh', color: '#a586e8', fn: x => Math.tanh(x), desc: 'S 形，输出 (-1,1)，零中心更好' },
        { name: 'ReLU', color: '#8ec5e0', fn: x => Math.max(0, x), desc: 'max(0,x)，计算简单，深度学习最常用' },
      ];
      // 时间轴
      const T_AXES = 0.5, T_CURVE = 0.9, T_END = 0.4;
      const TOTAL = T_AXES + funcs.length * T_CURVE + T_END;
      let stage = -1;
      const stageNames = [
        '初始化：坐标系 x∈[-6,6] y∈[-1.5,1.5]。将依次画出 4 种激活函数对比',
        ...funcs.map(f => `${f.name}：${f.desc}`),
      ];
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        // 内容容器玻璃面板
        glassPanel(ctx, 28, topSafe - 8, W - 56, botSafe - topSafe + 24, 16, 0.55);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        // 阶段
        let curStage = 0;
        if (sec > T_AXES) {
          const idx = Math.min(Math.floor((sec - T_AXES) / T_CURVE), funcs.length - 1);
          curStage = 1 + idx;
        }
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }
        // 坐标轴
        const axP = easeOutCubic(win(sec, 0, T_AXES));
        if (axP > 0) {
          ctx.save(); ctx.globalAlpha = axP;
          ctx.strokeStyle = 'rgba(165,176,216,0.6)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(padL, padT); ctx.lineTo(padL, H - padB); ctx.lineTo(W - padR, H - padB);
          ctx.stroke();
          ctx.strokeStyle = 'rgba(211,216,238,0.5)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(toX(0), padT); ctx.lineTo(toX(0), H - padB);
          ctx.moveTo(padL, toY(0)); ctx.lineTo(W - padR, toY(0));
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          for (let x = -6; x <= 6; x += 2) ctx.fillText(String(x), toX(x), H - padB + 6);
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          for (let y = -1; y <= 1; y += 1) ctx.fillText(y.toFixed(0), padL - 6, toY(y));
          ctx.restore();
        }
        // 曲线
        funcs.forEach((f, fi) => {
          if (fi > curStage - 1) return;
          const cP = easeOutCubic(win(sec, T_AXES + fi * T_CURVE, T_AXES + (fi + 1) * T_CURVE));
          if (cP <= 0) return;
          ctx.strokeStyle = f.color; ctx.lineWidth = 2.8; ctx.lineCap = 'round';
          ctx.beginPath();
          let first = true;
          const n = Math.floor(120 * cP);
          for (let i = 0; i <= n; i++) {
            const x = xMin + (xMax - xMin) * i / 120;
            let y = f.fn(x);
            if (y < yMin) y = yMin; if (y > yMax) y = yMax;
            const px = toX(x), py = toY(y);
            if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
          }
          ctx.stroke();
          // 图例标签
          ctx.fillStyle = f.color; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.fillText(f.name, W - padR - 70, padT + 14 + fi * 20);
        });
      });
      if (!ok) return;
      setStatus('激活函数对比完成：阶跃硬切换 / Sigmoid 平滑但饱和 / Tanh 零中心 / ReLU 简单高效', 'ok');
    },
  });

  // —— 内置 canvas 模板 18：旅行商问题 TSP（最近邻贪心访问所有城市再回起点）——
  // 6 城市 A-F 固定坐标，从 A 出发，每步去最近未访问城市，最后回 A。
  registerCanvas('tsp-search', {
    title: TEMPLATE_TITLES['tsp-search'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      // 6 城市固定相对坐标（映射进安全区）
      const rel = {
        A: [0.10, 0.28], B: [0.35, 0.14], C: [0.58, 0.36],
        D: [0.88, 0.18], E: [0.72, 0.84], F: [0.24, 0.90],
      };
      const R = 16;
      const cities = {};
      Object.keys(rel).forEach(k => {
        cities[k] = {
          x: leftSafe + rel[k][0] * (rightSafe - leftSafe),
          y: topSafe + 34 + rel[k][1] * (botSafe - topSafe - 68),
        };
      });
      const order = ['A', 'B', 'C', 'D', 'E', 'F'];
      const dist = (a, b) => Math.hypot(cities[a].x - cities[b].x, cities[a].y - cities[b].y);
      // 贪心最近邻求访问顺序
      const path = ['A'];
      {
        const visited = new Set(['A']);
        let cur = 'A';
        while (visited.size < 6) {
          let best = null, bestD = Infinity;
          for (const c of order) {
            if (!visited.has(c)) {
              const d = dist(cur, c);
              if (d < bestD) { bestD = d; best = c; }
            }
          }
          path.push(best); visited.add(best); cur = best;
        }
        path.push('A'); // 回起点
      }
      const segLens = path.slice(1).map((c, i) => dist(path[i], c));
      const totalLen = segLens.reduce((s, d) => s + d, 0);
      // 时间轴：入场 → 每步(扫描候选+移动) ×6 → 定格
      const T_IN = 0.9, T_SCAN = 0.42, T_MOVE = 0.5, T_END = 0.7;
      const T_STEP = T_SCAN + T_MOVE;
      const TOTAL = T_IN + 6 * T_STEP + T_END;
      let stage = -1;
      const stageNames = [
        '初始化：6 个城市 A-F，起点 A。贪心最近邻：每步去最近的未访问城市',
        ...path.slice(1).map((c, i) => i < 5
          ? `第 ${i + 1} 步：从 ${path[i]} 走向最近的未访问城市 ${c}（距离 ${segLens[i].toFixed(0)} px）`
          : `最后一步：从 ${path[i]} 回到起点 ${c}（距离 ${segLens[i].toFixed(0)} px），闭环完成`),
        `TSP 贪心完成：${path.join('→')}，总长 ${totalLen.toFixed(0)} px（贪心快但不保证最优）`,
      ];
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        // 当前阶段：0 入场；1..6 各步；7 定格
        let curStage = 0;
        if (sec >= T_IN + 6 * T_STEP) curStage = 7;
        else if (sec >= T_IN) curStage = Math.min(Math.floor((sec - T_IN) / T_STEP) + 1, 6);
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }
        const doneSegs = curStage === 0 ? 0 : (curStage === 7 ? 6 : curStage - 1);
        let moveP = 0, scanP = 0;
        if (curStage >= 1 && curStage <= 6) {
          const t0 = T_IN + (curStage - 1) * T_STEP;
          scanP = easeOutCubic(win(sec, t0, t0 + T_SCAN));
          moveP = easeOutCubic(win(sec, t0 + T_SCAN, t0 + T_SCAN + T_MOVE));
        }
        // 已访问城市集合
        const visitedSet = new Set(path.slice(0, doneSegs + 1));
        if (curStage >= 1 && curStage <= 6 && moveP >= 1) visitedSet.add(path[curStage]);
        // 候选扫描虚线（从当前城市到各未访问城市）
        if (curStage >= 1 && curStage <= 6 && scanP > 0 && moveP < 1) {
          const from = cities[path[curStage - 1]];
          let cands = order.filter(c => !visitedSet.has(c));
          if (!cands.length) cands = ['A']; // 最后一步回起点
          const target = path[curStage];
          cands.forEach(c => {
            const isBest = c === target;
            ctx.strokeStyle = isBest ? `rgba(108,92,231,${0.75 * scanP})` : `rgba(165,176,216,${0.45 * scanP})`;
            ctx.lineWidth = isBest ? 2 : 1.4;
            ctx.setLineDash([5, 4]);
            ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(cities[c].x, cities[c].y); ctx.stroke();
            ctx.setLineDash([]);
            const mx = (from.x + cities[c].x) / 2, my = (from.y + cities[c].y) / 2;
            ctx.fillStyle = isBest ? '#5a4bb0' : '#8a84b0';
            ctx.font = isBest ? 'bold 11px sans-serif' : '11px sans-serif';
            ctx.globalAlpha = scanP;
            ctx.fillText(dist(path[curStage - 1], c).toFixed(0), mx, my - 8);
            ctx.globalAlpha = 1;
          });
        }
        // 已完成路径段
        for (let i = 1; i <= doneSegs; i++) {
          const a = cities[path[i - 1]], b = cities[path[i]];
          ctx.strokeStyle = 'rgba(108,92,231,0.85)'; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          // 段中距离标签（垂直偏移避免压线）
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
          const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
          ctx.fillStyle = '#5a4bb0'; ctx.font = 'bold 11px sans-serif';
          ctx.fillText(segLens[i - 1].toFixed(0), mx - dy / len * 13, my + dx / len * 13);
        }
        // 当前移动中的段
        if (curStage >= 1 && curStage <= 6) {
          const a = cities[path[curStage - 1]], b = cities[path[curStage]];
          const ex = a.x + (b.x - a.x) * moveP, ey = a.y + (b.y - a.y) * moveP;
          if (moveP > 0) {
            ctx.strokeStyle = 'rgba(165,134,232,0.9)'; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(ex, ey); ctx.stroke();
            // 移动小球（旅行商）
            ctx.shadowColor = 'rgba(165,134,232,0.5)'; ctx.shadowBlur = 8;
            ctx.fillStyle = '#a586e8';
            ctx.beginPath(); ctx.arc(ex, ey, 6, 0, Math.PI * 2); ctx.fill();
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.beginPath(); ctx.arc(ex - 2, ey - 2, 2, 0, Math.PI * 2); ctx.fill();
          }
        }
        // 城市节点（入场弹入）
        order.forEach((c, k) => {
          const popP = easeOutBack(win(sec, 0.08 + k * 0.1, 0.5 + k * 0.1));
          if (popP <= 0) return;
          const p = cities[c];
          const isStart = c === 'A';
          const isVisited = visitedSet.has(c);
          let fill = '#fff', stroke = '#a5b0d8', txt = '#6e6890';
          if (isVisited) { fill = '#7aa7f0'; stroke = '#5a4bb0'; txt = '#fff'; }
          if (isStart) { fill = '#6c5ce7'; stroke = '#5a4bb0'; txt = '#fff'; }
          ctx.save(); ctx.translate(p.x, p.y); ctx.scale(Math.max(0, popP), Math.max(0, popP));
          ctx.shadowColor = 'rgba(124,99,224,0.35)'; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2);
          ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = 2.4;
          ctx.fill(); ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.beginPath(); ctx.arc(-4, -4, R * 0.28, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = txt; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(c, 0, 0);
          ctx.restore();
        });
        // 起点小旗标
        const flagP = easeOutBack(win(sec, 0.6, 1.0));
        if (flagP > 0) {
          ctx.save(); ctx.globalAlpha = flagP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 11px sans-serif';
          ctx.fillText('起点', cities.A.x, cities.A.y - R - 10);
          ctx.restore();
        }
        // 顶部信息面板：路径 + 累计长度
        const panelP = easeOutCubic(win(sec, 0.4, 0.9));
        if (panelP > 0) {
          let acc = 0;
          for (let i = 0; i < doneSegs; i++) acc += segLens[i];
          if (curStage >= 1 && curStage <= 6) acc += segLens[curStage - 1] * moveP;
          const shownPath = path.slice(0, doneSegs + 1 + ((curStage >= 1 && curStage <= 6 && moveP >= 1) ? 1 : 0)).join('→');
          const label = curStage === 7
            ? `闭环 ${path.join('→')} · 总长 ${totalLen.toFixed(0)} px`
            : `路径 ${shownPath} · 已走 ${acc.toFixed(0)} px`;
          ctx.font = 'bold 12px sans-serif';
          const pw = Math.max(240, ctx.measureText(label).width + 28), ph = 26;
          const px = (W - pw) / 2, py = topSafe + 2;
          ctx.save(); ctx.globalAlpha = panelP;
          glassPanel(ctx, px, py, pw, ph, 10, 0.8);
          ctx.fillStyle = '#5a4bb0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(label, W / 2, py + ph / 2);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 19：过拟合与模型泛化（训练/测试误差曲线对比）——
  // x=模型复杂度(1~20)，训练误差指数下降，测试误差U形反弹，最佳复杂度处标注
  registerCanvas('overfitting-curve', {
    title: TEMPLATE_TITLES['overfitting-curve'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const xMin = 1, xMax = 20, yMin = 0, yMax = 1;
      const padL = leftSafe + 14;              // y 轴刻度留位
      const plotR = rightSafe - 96;            // 右侧留图例条
      const plotT = topSafe + 14, plotB = botSafe;
      const toX = x => padL + (x - xMin) / (xMax - xMin) * (plotR - padL);
      const toY = y => plotB - (y - yMin) / (yMax - yMin) * (plotB - plotT);
      // 训练误差：0.9 * exp(-0.22*(x-1)) + 0.05，从 0.95 降到 0.06
      // 测试误差：先降后升，最佳在 x=8 附近（最低 0.18），右端反弹到 0.55
      const trainErr = x => 0.9 * Math.exp(-0.22 * (x - 1)) + 0.05;
      const testErr = x => {
        const base = 0.9 * Math.exp(-0.28 * (x - 1)) + 0.18;  // 下降部分
        const rise = 0.5 / (1 + Math.exp(-(x - 11) * 0.6));    // 上升部分（sigmoid）
        return Math.min(0.95, base + rise * 0.45);
      };
      // 找最佳复杂度（测试误差最低点）
      let bestX = 1, bestE = 1;
      for (let x = 1; x <= xMax; x += 0.5) {
        const e = testErr(x);
        if (e < bestE) { bestE = e; bestX = x; }
      }
      // 时间轴：坐标轴 → 训练曲线 → 测试曲线 → 最佳点 → 过拟合区 → 定格
      const T_AXES = 0.6, T_TRAIN = 1.5, T_TEST = 1.7, T_BEST = 1.0, T_OVER = 1.0, T_END = 0.7;
      const s1 = T_AXES, s2 = s1 + T_TRAIN, s3 = s2 + T_TEST, s4 = s3 + T_BEST, s5 = s4 + T_OVER;
      const TOTAL = s5 + T_END;
      let stage = -1;
      const stageNames = [
        '坐标系：横轴=模型复杂度，纵轴=误差。将对比训练误差与测试误差',
        '训练误差：随复杂度增加单调下降（模型越复杂，训练集拟合越好）',
        '测试误差：先降后升呈 U 形——复杂度过高时反而变差',
        `最佳复杂度 x≈${bestX.toFixed(0)}：测试误差最低 ${bestE.toFixed(2)}，泛化最好`,
        '右侧过拟合区：训练误差继续下降，但测试误差反弹上升',
      ];
      // 曲线生长绘制（prog 0→1 从左到右）
      function drawCurve(fn, color, prog, lw) {
        if (prog <= 0) return;
        ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath();
        const xEnd = xMin + (xMax - xMin) * prog;
        let first = true;
        for (let x = xMin; x <= xEnd + 0.001; x += 0.2) {
          const xx = Math.min(x, xEnd);
          const px = toX(xx), py = toY(fn(xx));
          if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
          if (xx >= xEnd) break;
        }
        ctx.stroke();
      }
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        // 阶段
        let curStage = 0;
        if (sec >= s1) curStage = 1;
        if (sec >= s2) curStage = 2;
        if (sec >= s3) curStage = 3;
        if (sec >= s4) curStage = 4;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }
        const axP = easeOutCubic(win(sec, 0, T_AXES));
        // 网格 + 坐标轴
        ctx.save(); ctx.globalAlpha = axP;
        [0.2, 0.4, 0.6, 0.8, 1].forEach(y => {
          ctx.strokeStyle = 'rgba(165,176,216,0.18)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(padL, toY(y)); ctx.lineTo(plotR, toY(y)); ctx.stroke();
        });
        ctx.strokeStyle = 'rgba(165,176,216,0.75)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(padL, plotT - 6); ctx.lineTo(padL, plotB); ctx.lineTo(plotR + 6, plotB);
        ctx.stroke();
        // 刻度
        ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let x = 1; x <= 20; x += 2) ctx.fillText(String(x), toX(x), plotB + 6);
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        [0, 0.2, 0.4, 0.6, 0.8, 1].forEach(y => ctx.fillText(y.toFixed(1), padL - 7, toY(y)));
        // 轴含义（收进右条，避免越界）
        ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('横轴：模型复杂度', plotR + 12, plotT + 76);
        ctx.fillText('纵轴：误差', plotR + 12, plotT + 92);
        ctx.restore();
        // 过拟合区（先铺底，再画曲线）
        const overP = easeOutCubic(win(sec, s4, s5));
        if (overP > 0) {
          ctx.save(); ctx.globalAlpha = overP;
          ctx.fillStyle = 'rgba(240,168,216,0.14)';
          ctx.fillRect(toX(13), plotT, plotR - toX(13), plotB - plotT);
          ctx.fillStyle = '#d06a96'; ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('过拟合区', (toX(13) + plotR) / 2, plotB - 16);
          ctx.restore();
        }
        // 训练误差曲线
        const trainP = easeOutCubic(win(sec, s1, s2));
        drawCurve(trainErr, '#7aa7f0', trainP, 2.8);
        // 测试误差曲线
        const testP = easeOutCubic(win(sec, s2, s3));
        drawCurve(testErr, '#f0a8d8', testP, 2.8);
        // 图例（随曲线入场）
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        if (trainP > 0.3) {
          ctx.save(); ctx.globalAlpha = win(trainP, 0.3, 0.8);
          ctx.strokeStyle = '#7aa7f0'; ctx.lineWidth = 2.8; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(plotR + 12, plotT + 16); ctx.lineTo(plotR + 32, plotT + 16); ctx.stroke();
          ctx.fillStyle = '#5a7fd0'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('训练误差', plotR + 38, plotT + 16);
          ctx.restore();
        }
        if (testP > 0.3) {
          ctx.save(); ctx.globalAlpha = win(testP, 0.3, 0.8);
          ctx.strokeStyle = '#f0a8d8'; ctx.lineWidth = 2.8; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(plotR + 12, plotT + 38); ctx.lineTo(plotR + 32, plotT + 38); ctx.stroke();
          ctx.fillStyle = '#d06a96'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('测试误差', plotR + 38, plotT + 38);
          ctx.restore();
        }
        // 最佳复杂度标注
        const bestLineP = easeOutCubic(win(sec, s3, s3 + 0.45));
        if (bestLineP > 0) {
          ctx.save(); ctx.globalAlpha = bestLineP;
          ctx.strokeStyle = 'rgba(142,197,224,0.95)'; ctx.lineWidth = 1.8; ctx.setLineDash([5, 4]);
          ctx.beginPath();
          ctx.moveTo(toX(bestX), plotB);
          ctx.lineTo(toX(bestX), plotB - (plotB - plotT) * bestLineP);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }
        const bestDotP = easeOutBack(win(sec, s3 + 0.3, s3 + 0.8));
        if (bestDotP > 0) {
          const bx = toX(bestX), by = toY(bestE);
          ctx.save();
          ctx.translate(bx, by); ctx.scale(Math.max(0, bestDotP), Math.max(0, bestDotP));
          ctx.shadowColor = 'rgba(142,197,224,0.55)'; ctx.shadowBlur = 10;
          ctx.fillStyle = '#8ec5e0';
          ctx.beginPath(); ctx.arc(0, 0, 6.5, 0, Math.PI * 2); ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = '#5aa8c4'; ctx.lineWidth = 2; ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.beginPath(); ctx.arc(-2, -2, 2.2, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          // 标注面板
          const l1 = `最佳复杂度 x≈${bestX.toFixed(0)}`, l2 = `测试误差最低 ${bestE.toFixed(2)}`;
          ctx.font = 'bold 12px sans-serif';
          const pw = Math.max(ctx.measureText(l1).width, ctx.measureText(l2).width) + 24;
          const ph = 40;
          const px = Math.min(Math.max(bx - pw / 2, leftSafe), plotR - pw);
          const py = plotT + 8;
          ctx.save(); ctx.globalAlpha = Math.max(0, bestDotP);
          glassPanel(ctx, px, py, pw, ph, 10, 0.85);
          ctx.fillStyle = '#4e93ad'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(l1, px + pw / 2, py + 12);
          ctx.fillText(l2, px + pw / 2, py + 28);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(`过拟合对比完成：训练误差单调降、测试误差 U 形；最佳复杂度 x≈${bestX.toFixed(0)}，右侧进入过拟合区`, 'ok');
    },
  });

  // —— 内置 canvas 模板 20：随机森林（3 棵决策树投票决定查询样本类别）——
  // 3 棵小决策树水平排列，固定查询样本 (f1=4, f2=3)，每棵树给出分类，多数投票
  registerCanvas('random-forest', {
    title: TEMPLATE_TITLES['random-forest'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      // 3 棵树定义（每棵树是嵌套结构：{feat, thresh, left, right}，叶子是 '红'/'蓝'）
      const trees = [
        { name: '树1', feat: 'f1', thresh: 5, left: '蓝', right: { feat: 'f2', thresh: 3, left: '红', right: '蓝' } },
        { name: '树2', feat: 'f2', thresh: 4, left: { feat: 'f1', thresh: 6, left: '红', right: '蓝' }, right: '蓝' },
        { name: '树3', feat: 'f1', thresh: 7, left: { feat: 'f2', thresh: 2, left: '蓝', right: '红' }, right: '红' },
      ];
      const sample = { f1: 4, f2: 3 };
      function classify(node, s) {
        let path = [];
        let cur = node;
        while (typeof cur !== 'string') {
          const val = s[cur.feat];
          const goLeft = val < cur.thresh;
          path.push({ feat: cur.feat, thresh: cur.thresh, val, goLeft });
          cur = goLeft ? cur.left : cur.right;
        }
        return { label: cur, path };
      }
      const results = trees.map(t => classify(t, sample));
      const votes = { 红: 0, 蓝: 0 };
      results.forEach(r => votes[r.label]++);
      const finalLabel = votes.红 > votes.蓝 ? '红' : '蓝';
      // 布局：3 列等宽，垂直向相对分布
      const treeW = (rightSafe - leftSafe) / 3;
      const nameY = topSafe + 40;
      const rootY = topSafe + 58;
      const leafY = botSafe - 76;
      const midY = (rootY + leafY) / 2;
      const badgeY = leafY + 26;
      const LEAF_R = 15;
      const clsColor = c => c === '红' ? { fill: '#f0a8d8', stroke: '#d06a96' } : { fill: '#7aa7f0', stroke: '#5a4bb0' };
      // 时间轴：入场 → 逐树分类 ×3 → 投票汇总 → 定格
      const T_IN = 1.1, T_TREE = 1.3, T_VOTE = 1.2, T_END = 0.5;
      const TOTAL = T_IN + 3 * T_TREE + T_VOTE + T_END;
      let stage = -1;
      const accVotes = [{ 红: 0, 蓝: 0 }];
      results.forEach(r => accVotes.push({ 红: accVotes[accVotes.length - 1].红 + (r.label === '红'), 蓝: accVotes[accVotes.length - 1].蓝 + (r.label === '蓝') }));
      const stageNames = [
        '初始化：3 棵决策树组成随机森林，查询样本 (f1=4, f2=3) 待分类',
        ...results.map((r, i) => {
          const pathStr = r.path.map(p => `${p.feat}=${p.val}${p.goLeft ? '<' : '≥'}${p.thresh}`).join(' → ');
          return `${trees[i].name}：${pathStr} → 叶子「${r.label}」（当前 红 ${accVotes[i + 1].红} 票 / 蓝 ${accVotes[i + 1].蓝} 票）`;
        }),
        `投票汇总：红 ${votes.红} 票 vs 蓝 ${votes.蓝} 票 → 最终分类「${finalLabel}」（多数投票）`,
      ];
      // 画单棵树；hl: -1 无高亮，0 根，1 第一层路径，2 到叶子；treeP: 入场弹入进度
      function drawTree(treeIdx, tree, hl, treeP) {
        const cx = leftSafe + treeIdx * treeW + treeW / 2;
        if (treeP <= 0) return;
        const r = results[treeIdx];
        // 树名
        ctx.save(); ctx.globalAlpha = clamp01(treeP);
        ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(tree.name, cx, nameY);
        ctx.restore();
        function drawNode(node, x, y, depth, pathDepth) {
          // pathDepth: 该节点在查询路径上的深度；-1 表示不在路径上
          const onPath = pathDepth >= 0 && hl >= pathDepth;
          const scale = Math.max(0, easeOutBack(clamp01(treeP)));
          if (typeof node === 'string') {
            // 叶子
            const col = clsColor(node);
            ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
            if (onPath) { ctx.shadowColor = 'rgba(124,99,224,0.4)'; ctx.shadowBlur = 8; }
            ctx.beginPath(); ctx.arc(0, 0, LEAF_R, 0, Math.PI * 2);
            ctx.fillStyle = onPath ? col.fill : '#fff';
            ctx.strokeStyle = col.stroke; ctx.lineWidth = onPath ? 2.6 : 1.8;
            ctx.fill(); ctx.stroke();
            ctx.shadowColor = 'transparent';
            if (!onPath) {
              ctx.fillStyle = 'rgba(255,255,255,0.85)';
              ctx.beginPath(); ctx.arc(-4, -4, LEAF_R * 0.28, 0, Math.PI * 2); ctx.fill();
            }
            ctx.fillStyle = onPath ? '#fff' : col.stroke;
            ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(node, 0, 0);
            ctx.restore();
          } else {
            // 内部节点（圆角矩形）
            const tw = 62, th = 20;
            ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
            if (onPath) { ctx.shadowColor = 'rgba(124,99,224,0.35)'; ctx.shadowBlur = 8; }
            roundRect(ctx, -tw / 2, -th / 2, tw, th, 9);
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = onPath ? '#6c5ce7' : '#a5b0d8';
            ctx.lineWidth = onPath ? 2.4 : 1.6;
            ctx.fill(); ctx.stroke();
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = '#5a4bb0'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(`${node.feat}<${node.thresh}?`, 0, 0);
            ctx.restore();
            // 子节点
            const dx = treeW * 0.21;
            const dy = depth === 0 ? midY - rootY : leafY - midY;
            const goLeft = r.path[depth] && r.path[depth].goLeft;
            const leftPD = hl > pathDepth && pathDepth >= 0 && goLeft ? pathDepth + 1 : -1;
            const rightPD = hl > pathDepth && pathDepth >= 0 && !goLeft ? pathDepth + 1 : -1;
            // 边（路径上的边加粗高亮）
            [[-dx, leftPD, node.left], [dx, rightPD, node.right]].forEach(([ddx, childPD, childNode]) => {
              const edgeOn = childPD >= 0 && hl >= childPD;
              ctx.strokeStyle = edgeOn ? '#7aa7f0' : 'rgba(165,176,216,0.7)';
              ctx.lineWidth = edgeOn ? 2.6 : 1.6; ctx.lineCap = 'round';
              ctx.beginPath(); ctx.moveTo(x + ddx * 0.18, y + th / 2); ctx.lineTo(x + ddx, y + dy - (typeof childNode === 'string' ? LEAF_R : 10)); ctx.stroke();
            });
            drawNode(node.left, x - dx, y + dy, depth + 1, leftPD);
            drawNode(node.right, x + dx, y + dy, depth + 1, rightPD);
          }
        }
        drawNode(tree, cx, rootY, 0, hl >= 0 ? 0 : -1);
      }
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        // 阶段：0 入场；1..3 各树分类；4 汇总
        let curStage = 0;
        if (sec >= T_IN + 3 * T_TREE) curStage = 4;
        else if (sec >= T_IN) curStage = Math.min(Math.floor((sec - T_IN) / T_TREE) + 1, 3);
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }
        // 顶部样本面板
        const sampleP = easeOutCubic(win(sec, 0, 0.5));
        if (sampleP > 0) {
          const label = `查询样本：f1=${sample.f1}，f2=${sample.f2}（待分类）`;
          ctx.font = 'bold 12px sans-serif';
          const pw = ctx.measureText(label).width + 28, ph = 26;
          ctx.save(); ctx.globalAlpha = sampleP;
          glassPanel(ctx, (W - pw) / 2, topSafe + 2, pw, ph, 10, 0.8);
          ctx.fillStyle = '#5a4bb0';
          ctx.fillText(label, W / 2, topSafe + 2 + ph / 2);
          ctx.restore();
        }
        // 3 棵树
        trees.forEach((t, i) => {
          const treeP = win(sec, 0.15 + i * 0.28, 0.55 + i * 0.28);
          let hl = -1;
          if (curStage === i + 1) {
            const t0 = T_IN + i * T_TREE, ts = sec - t0;
            if (ts > T_TREE * 0.72) hl = 2;
            else if (ts > T_TREE * 0.42) hl = 1;
            else if (ts > T_TREE * 0.12) hl = 0;
          } else if (curStage > i + 1 || curStage === 4) hl = 2;
          drawTree(i, t, hl, treeP);
          // 分类完成后的投票徽章
          const badgeP = (curStage > i + 1 || curStage === 4) ? 1
            : (curStage === i + 1 ? easeOutBack(win(sec, T_IN + i * T_TREE + T_TREE * 0.78, T_IN + i * T_TREE + T_TREE * 0.78 + 0.35)) : 0);
          if (badgeP > 0) {
            const cx = leftSafe + i * treeW + treeW / 2;
            const col = clsColor(results[i].label);
            const bw = 96, bh = 20;
            ctx.save();
            ctx.globalAlpha = clamp01(badgeP);
            ctx.translate(cx, badgeY); ctx.scale(Math.max(0.01, badgeP), Math.max(0.01, badgeP));
            glassPanel(ctx, -bw / 2, -bh / 2, bw, bh, 10, 0.85);
            ctx.fillStyle = col.stroke; ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(`→ 投票「${results[i].label}」`, 0, 0);
            ctx.restore();
          }
        });
        // 投票汇总
        const voteP = easeOutCubic(win(sec, T_IN + 3 * T_TREE, T_IN + 3 * T_TREE + T_VOTE));
        if (voteP > 0) {
          const total = votes.红 + votes.蓝;
          const barW = 110, barH = 11;
          const label = `投票汇总：红 ${votes.红} : 蓝 ${votes.蓝} → 最终「${finalLabel}」`;
          ctx.font = 'bold 13px sans-serif';
          const pw = Math.max(ctx.measureText(label).width + 30, barW + 30), ph = 32;
          const px = (W - pw) / 2, py = botSafe - ph;
          ctx.save(); ctx.globalAlpha = voteP;
          glassPanel(ctx, px, py, pw, ph, 10, 0.85);
          ctx.fillStyle = '#5a4bb0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(label, W / 2, py + 10);
          // 红蓝比例条（随进度生长）
          const bx = W / 2 - barW / 2, by = py + 17;
          const redW = (votes.红 / total) * barW * voteP;
          const blueW = (votes.蓝 / total) * barW * voteP;
          ctx.fillStyle = '#f0a8d8';
          if (redW > 0) { roundRect(ctx, bx, by, redW, barH, 4); ctx.fill(); }
          ctx.fillStyle = '#7aa7f0';
          if (blueW > 0) { roundRect(ctx, bx + redW, by, blueW, barH, 4); ctx.fill(); }
          ctx.strokeStyle = '#a5b0d8'; ctx.lineWidth = 1;
          roundRect(ctx, bx, by, barW, barH, 4); ctx.stroke();
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(`随机森林投票完成：红 ${votes.红} 票 vs 蓝 ${votes.蓝} 票 → 最终分类「${finalLabel}」（多数投票，集思广益）`, 'ok');
    },
  });

  // —— 内置 canvas 模板 21：交叉熵损失（两条曲线对比）——
  // y=1: L=-log(ŷ)；y=0: L=-log(1-ŷ)。横轴 ŷ∈(0,1)，纵轴 L∈[0,5]
  registerCanvas('cross-entropy', {
    title: TEMPLATE_TITLES['cross-entropy'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const xMin = 0, xMax = 1, yMin = 0, yMax = 5;
      const padL = leftSafe + 14;
      const plotR = rightSafe - 96;           // 右侧留图例条
      const plotT = topSafe + 14, plotB = botSafe;
      const toX = x => padL + (x - xMin) / (xMax - xMin) * (plotR - padL);
      const toY = y => plotB - (y - yMin) / (yMax - yMin) * (plotB - plotT);
      const yIs1 = x => x <= 0.005 ? yMax : Math.min(yMax, -Math.log(x));
      const yIs0 = x => x >= 0.995 ? yMax : Math.min(yMax, -Math.log(1 - x));
      // 时间轴：坐标轴 → y=1 曲线 → y=0 曲线 → 关键点 → 定格
      const T_AXES = 0.6, T_C1 = 1.7, T_C2 = 1.7, T_MARK = 1.6, T_END = 0.9;
      const s1 = T_AXES, s2 = s1 + T_C1, s3 = s2 + T_C2, s4 = s3 + T_MARK;
      const TOTAL = s4 + T_END;
      let stage = -1;
      const stageNames = [
        '坐标系：横轴=预测概率 ŷ∈(0,1)，纵轴=交叉熵损失 L',
        '真实标签 y=1：L=-log(ŷ)。ŷ→1 时 L→0（预测正确）；ŷ→0 时 L→∞（错得离谱）',
        '真实标签 y=0：L=-log(1-ŷ)，与 y=1 曲线关于 ŷ=0.5 对称',
        '关键点：预测越接近真值 L 越接近 0，偏离真值时损失急剧上升',
      ];
      // 曲线生长
      function drawCurve(fn, color, prog) {
        if (prog <= 0) return;
        ctx.strokeStyle = color; ctx.lineWidth = 2.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath();
        const xEnd = 0.01 + 0.98 * prog;
        let first = true;
        for (let x = 0.01; x <= xEnd + 0.0001; x += 0.01) {
          const xx = Math.min(x, xEnd);
          const px = toX(xx), py = toY(fn(xx));
          if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
          if (xx >= xEnd) break;
        }
        ctx.stroke();
      }
      // 关键点标记
      function drawMarker(x, loss, label, dx, dy, popP, color) {
        if (popP <= 0) return;
        const px = toX(x), py = toY(loss);
        ctx.save();
        ctx.globalAlpha = clamp01(popP);
        ctx.translate(px, py); ctx.scale(Math.max(0, popP), Math.max(0, popP));
        ctx.shadowColor = 'rgba(124,99,224,0.4)'; ctx.shadowBlur = 8;
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.8; ctx.stroke();
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = clamp01(popP);
        ctx.fillStyle = '#5a4bb0'; ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(label, px + dx, py + dy);
        ctx.restore();
      }
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        // 内容容器玻璃面板
        glassPanel(ctx, 28, topSafe - 8, W - 56, botSafe - topSafe + 24, 16, 0.55);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        // 阶段
        let curStage = 0;
        if (sec >= s1) curStage = 1;
        if (sec >= s2) curStage = 2;
        if (sec >= s3) curStage = 3;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }
        // 坐标轴 + 网格
        const axP = easeOutCubic(win(sec, 0, T_AXES));
        ctx.save(); ctx.globalAlpha = axP;
        [1, 2, 3, 4, 5].forEach(y => {
          ctx.strokeStyle = 'rgba(165,176,216,0.18)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(padL, toY(y)); ctx.lineTo(plotR, toY(y)); ctx.stroke();
        });
        ctx.strokeStyle = 'rgba(165,176,216,0.75)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(padL, plotT - 6); ctx.lineTo(padL, plotB); ctx.lineTo(plotR + 6, plotB);
        ctx.stroke();
        ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        [0, 0.2, 0.4, 0.6, 0.8, 1].forEach(x => ctx.fillText(x.toFixed(1), toX(x), plotB + 6));
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        [0, 1, 2, 3, 4, 5].forEach(y => ctx.fillText(String(y), padL - 7, toY(y)));
        ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('横轴：预测概率 ŷ', plotR + 12, plotT + 76);
        ctx.fillText('纵轴：损失 L', plotR + 12, plotT + 92);
        ctx.restore();
        // 两条曲线
        const c1P = easeOutCubic(win(sec, s1, s2));
        const c2P = easeOutCubic(win(sec, s2, s3));
        drawCurve(yIs1, '#7aa7f0', c1P);
        drawCurve(yIs0, '#f0a8d8', c2P);
        // 图例
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        if (c1P > 0.3) {
          ctx.save(); ctx.globalAlpha = win(c1P, 0.3, 0.8);
          ctx.strokeStyle = '#7aa7f0'; ctx.lineWidth = 2.8; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(plotR + 12, plotT + 16); ctx.lineTo(plotR + 32, plotT + 16); ctx.stroke();
          ctx.fillStyle = '#5a7fd0'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('L | y=1', plotR + 38, plotT + 16);
          ctx.restore();
        }
        if (c2P > 0.3) {
          ctx.save(); ctx.globalAlpha = win(c2P, 0.3, 0.8);
          ctx.strokeStyle = '#f0a8d8'; ctx.lineWidth = 2.8; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(plotR + 12, plotT + 38); ctx.lineTo(plotR + 32, plotT + 38); ctx.stroke();
          ctx.fillStyle = '#d06a96'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('L | y=0', plotR + 38, plotT + 38);
          ctx.restore();
        }
        // 关键点（交错弹入）
        const m1 = easeOutBack(win(sec, s3 + 0.1, s3 + 0.5));
        const m2 = easeOutBack(win(sec, s3 + 0.55, s3 + 0.95));
        const m3 = easeOutBack(win(sec, s3 + 1.0, s3 + 1.4));
        drawMarker(0.99, yIs1(0.99), 'ŷ→1, y=1：L→0', -52, -14, m1, '#8ec5e0');
        drawMarker(0.01, yIs0(0.01), 'ŷ→0, y=0：L→0', 52, -14, m2, '#8ec5e0');
        drawMarker(0.1, yIs1(0.1), 'ŷ=0.1, y=1：L=2.3', 66, -4, m3, '#f0a8d8');
      });
      if (!ok) return;
      setStatus('交叉熵特性：预测正确 L→0，预测错误 L→∞（陡峭惩罚），比均方误差更利于分类任务收敛', 'ok');
    },
  });

  // —— 内置 canvas 模板 22：均方误差 MSE（3 数据点残差 + 抛物线损失曲线）——
  // 横轴 ŷ∈[0,1]，纵轴 (y-ŷ)²。3 个数据点 y=0.2/0.5/0.8，画各点损失曲线 + 平均 MSE
  registerCanvas('mse-loss', {
    title: TEMPLATE_TITLES['mse-loss'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const ys = [0.2, 0.5, 0.8];
      const colors = ['#7aa7f0', '#a586e8', '#f0a8d8'];
      const txtColors = ['#5a7fd0', '#7c5cc9', '#d06a96'];
      const xMin = 0, xMax = 1, yMin = 0, yMax = 1;
      const padL = leftSafe + 14;
      const plotR = rightSafe - 96;           // 右侧留图例条
      const plotT = topSafe + 14, plotB = botSafe;
      const toX = x => padL + (x - xMin) / (xMax - xMin) * (plotR - padL);
      const toY = y => plotB - (y - yMin) / (yMax - yMin) * (plotB - plotT);
      const mseFn = x => ys.reduce((s, y) => s + (y - x) ** 2, 0) / ys.length;
      const bestYhat = ys.reduce((s, y) => s + y, 0) / ys.length;
      const bestMse = mseFn(bestYhat);
      // 时间轴：坐标轴 → 3 条单点曲线（交错）→ MSE 平均曲线 → 最优点 → 定格
      const T_AXES = 0.6, T_C0 = 0.8, T_CSTAG = 0.5, T_CDUR = 1.1, T_MSE = 1.6, T_MARK = 1.1, T_END = 1.0;
      const curveStart = i => T_AXES + T_C0 + i * T_CSTAG;
      const sMSE = curveStart(2) + T_CDUR + 0.2;
      const sMark = sMSE + T_MSE;
      const TOTAL = sMark + T_MARK + T_END;
      let stage = -1;
      const stageNames = [
        '坐标系：横轴=预测值 ŷ，纵轴=损失 (y-ŷ)²。3 个真实值 y=0.2 / 0.5 / 0.8',
        ...ys.map(y => `数据点 y=${y} 的损失曲线：开口向上的抛物线，最低点在 ŷ=${y}（损失=0）`),
        'MSE = (1/n)·Σ(y-ŷ)²：3 条抛物线的平均（深紫粗线）',
        `MSE 最小化：最优预测 ŷ=ȳ=${bestYhat.toFixed(1)}（数据均值），此时 MSE=${bestMse.toFixed(3)}`,
      ];
      // 曲线生长
      function drawCurve(fn, color, prog, lw) {
        if (prog <= 0) return;
        ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath();
        const xEnd = prog;
        let first = true;
        for (let x = 0; x <= xEnd + 0.0001; x += 0.02) {
          const xx = Math.min(x, xEnd);
          const px = toX(xx), py = toY(fn(xx));
          if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
          if (xx >= xEnd) break;
        }
        ctx.stroke();
      }
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        // 阶段
        let curStage = 0;
        if (sec >= sMark) curStage = 5;
        else if (sec >= sMSE) curStage = 4;
        else if (sec >= curveStart(2)) curStage = 3;
        else if (sec >= curveStart(1)) curStage = 2;
        else if (sec >= curveStart(0)) curStage = 1;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }
        // 坐标轴 + 网格
        const axP = easeOutCubic(win(sec, 0, T_AXES));
        ctx.save(); ctx.globalAlpha = axP;
        [0.2, 0.4, 0.6, 0.8, 1].forEach(y => {
          ctx.strokeStyle = 'rgba(165,176,216,0.18)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(padL, toY(y)); ctx.lineTo(plotR, toY(y)); ctx.stroke();
        });
        ctx.strokeStyle = 'rgba(165,176,216,0.75)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(padL, plotT - 6); ctx.lineTo(padL, plotB); ctx.lineTo(plotR + 6, plotB);
        ctx.stroke();
        ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        [0, 0.2, 0.4, 0.6, 0.8, 1].forEach(x => ctx.fillText(x.toFixed(1), toX(x), plotB + 6));
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        [0, 0.2, 0.4, 0.6, 0.8, 1].forEach(y => ctx.fillText(y.toFixed(1), padL - 7, toY(y)));
        ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('横轴：预测值 ŷ', plotR + 12, plotT + 112);
        ctx.fillText('纵轴：(y-ŷ)²', plotR + 12, plotT + 128);
        ctx.restore();
        // 3 条单点抛物线（交错生长）
        ys.forEach((y, i) => {
          const prog = easeOutCubic(win(sec, curveStart(i), curveStart(i) + T_CDUR));
          drawCurve(x => (y - x) ** 2, colors[i], prog, 2.4);
          // 该曲线最低点标记（ŷ=y 处损失=0）
          const minP = easeOutBack(win(sec, curveStart(i) + T_CDUR - 0.15, curveStart(i) + T_CDUR + 0.3));
          if (minP > 0) {
            ctx.save();
            ctx.globalAlpha = clamp01(minP);
            ctx.translate(toX(y), toY(0)); ctx.scale(Math.max(0, minP), Math.max(0, minP));
            ctx.fillStyle = colors[i];
            ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.6; ctx.stroke();
            ctx.restore();
            ctx.save();
            ctx.globalAlpha = clamp01(minP);
            ctx.fillStyle = txtColors[i]; ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.fillText(`ŷ=${y}`, toX(y), toY(0) - 9);
            ctx.restore();
          }
        });
        // MSE 平均曲线
        const mseP = easeOutCubic(win(sec, sMSE, sMark));
        drawCurve(mseFn, '#6c5ce7', mseP, 3.2);
        // 图例
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ys.forEach((y, i) => {
          const prog = win(sec, curveStart(i) + 0.3, curveStart(i) + 0.8);
          if (prog <= 0) return;
          ctx.save(); ctx.globalAlpha = prog;
          ctx.strokeStyle = colors[i]; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(plotR + 12, plotT + 14 + i * 20); ctx.lineTo(plotR + 30, plotT + 14 + i * 20); ctx.stroke();
          ctx.fillStyle = txtColors[i]; ctx.font = 'bold 11px sans-serif';
          ctx.fillText(`y=${y} 损失`, plotR + 36, plotT + 14 + i * 20);
          ctx.restore();
        });
        const mseLegP = win(sec, sMSE + 0.3, sMSE + 0.9);
        if (mseLegP > 0) {
          ctx.save(); ctx.globalAlpha = mseLegP;
          ctx.strokeStyle = '#6c5ce7'; ctx.lineWidth = 3.2; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(plotR + 12, plotT + 74); ctx.lineTo(plotR + 30, plotT + 74); ctx.stroke();
          ctx.fillStyle = '#5a4bb0'; ctx.font = 'bold 11px sans-serif';
          ctx.fillText('MSE 平均', plotR + 36, plotT + 74);
          ctx.restore();
        }
        // 最优点标注
        const bestP = easeOutBack(win(sec, sMark + 0.2, sMark + 0.75));
        if (bestP > 0) {
          const bx = toX(bestYhat), by = toY(bestMse);
          // 竖直虚线到 x 轴
          ctx.save(); ctx.globalAlpha = clamp01(bestP);
          ctx.strokeStyle = 'rgba(142,197,224,0.9)'; ctx.lineWidth = 1.8; ctx.setLineDash([5, 4]);
          ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, plotB); ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
          ctx.save();
          ctx.globalAlpha = clamp01(bestP);
          ctx.translate(bx, by); ctx.scale(Math.max(0, bestP), Math.max(0, bestP));
          ctx.shadowColor = 'rgba(142,197,224,0.55)'; ctx.shadowBlur = 10;
          ctx.fillStyle = '#8ec5e0';
          ctx.beginPath(); ctx.arc(0, 0, 6.5, 0, Math.PI * 2); ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = '#5aa8c4'; ctx.lineWidth = 2; ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.beginPath(); ctx.arc(-2, -2, 2.2, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          // 标注面板
          const l1 = `最优 ŷ=ȳ=${bestYhat.toFixed(1)}`, l2 = `MSE=${bestMse.toFixed(3)}（最小）`;
          ctx.font = 'bold 12px sans-serif';
          const pw = Math.max(ctx.measureText(l1).width, ctx.measureText(l2).width) + 24;
          const ph = 40;
          const px = Math.min(Math.max(bx - pw / 2, leftSafe), plotR - pw);
          const py = Math.max(by - 86, plotT + 4);
          ctx.save(); ctx.globalAlpha = clamp01(bestP);
          glassPanel(ctx, px, py, pw, ph, 10, 0.85);
          ctx.fillStyle = '#4e93ad'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(l1, px + pw / 2, py + 12);
          ctx.fillText(l2, px + pw / 2, py + 28);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(`MSE 最小化：最优预测 ŷ=ȳ=${bestYhat.toFixed(1)}（数据均值），此时 MSE=${bestMse.toFixed(3)}。回归任务常用损失`, 'ok');
    },
  });

  // —— 内置 canvas 模板 23：学习率对比（3 种 α 在 J=θ² 曲面上的梯度下降）——
  // 3 子图水平排列，α=0.1（太慢）/0.4（适中）/1.2（发散），θ 起点 -2.8
  registerCanvas('learning-rate', {
    title: TEMPLATE_TITLES['learning-rate'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const rates = [
        { alpha: 0.1, label: 'α=0.1（太小）', color: '#7aa7f0', desc: '步长小，收敛慢，需很多轮' },
        { alpha: 0.4, label: 'α=0.4（适中）', color: '#8ec5e0', desc: '步长合适，快速收敛到最低' },
        { alpha: 1.2, label: 'α=1.2（太大）', color: '#f0a8d8', desc: '步长过大，震荡发散，无法收敛' },
      ];
      const theta0 = -2.8;
      // 预计算每条轨迹（最多12步，足够演示）
      rates.forEach(r => {
        r.thetas = [theta0];
        let t = theta0;
        for (let i = 0; i < 12; i++) {
          t = t * (1 - 2 * r.alpha);  // J=θ², ∇J=2θ
          r.thetas.push(t);
        }
      });
      const subW = (rightSafe - leftSafe) / 3;
      const subPadL = 18, subPadR = 12;
      const xMin = -6, xMax = 6, yMin = 0, yMax = 9;
      const axW = subW - subPadL - subPadR;
      // 布局：子图面板占顶部到底部汇总条之上
      const panelTop = topSafe, panelBot = botSafe - 42;
      const axTop = panelTop + 48, axBot = panelBot - 24;
      const axH = axBot - axTop;
      // 时间轴：入场 → 三列同步下降（阶段 1..3 依次高亮讲解）→ 汇总 → 定格
      const T_AXES = 0.7, T_PHASE = 1.7, T_SUM = 1.0, T_END = 0.6;
      const STEP_DUR = 0.4;
      const s1 = T_AXES, s2 = s1 + T_PHASE, s3 = s2 + T_PHASE, s4 = s3 + T_PHASE;
      const TOTAL = s4 + T_SUM + T_END;
      let stage = -1;
      const stageNames = [
        '坐标系：3 种学习率 α 在同一损失曲面 J=θ² 上从 θ=-2.8 起梯度下降',
        'α=0.1 太小：步长小，收敛慢，需要很多轮才能到达最低点',
        'α=0.4 适中：步长合适，快速收敛到最低点（推荐范围）',
        'α=1.2 太大：步长过大，震荡发散，无法收敛',
        '学习率对比：α 太小收敛慢，适中快速到最低，太大震荡发散（需调超参数）',
      ];
      function drawSub(idx, stepCount, focus, introP) {
        const ox = leftSafe + idx * subW;
        const toX = t => ox + subPadL + (t - xMin) / (xMax - xMin) * axW;
        const toY = j => axBot - (Math.min(j, yMax) - yMin) / (yMax - yMin) * axH;
        ctx.save();
        ctx.globalAlpha = (focus ? 1 : 0.45) * introP;
        // 子图毛玻璃面板底
        glassPanel(ctx, ox + 3, panelTop, subW - 6, panelBot - panelTop, 12, focus ? 0.55 : 0.35);
        // 标题 + 描述
        ctx.fillStyle = rates[idx].color; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(rates[idx].label, ox + subW / 2, panelTop + 16);
        ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif';
        ctx.fillText(rates[idx].desc, ox + subW / 2, panelTop + 34);
        // 损失曲面 J=θ²（随入场生长）
        const curveP = easeOutCubic(clamp01(introP));
        if (curveP > 0) {
          ctx.strokeStyle = 'rgba(165,134,232,0.55)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
          ctx.beginPath();
          let first = true;
          const xEnd = xMin + (xMax - xMin) * curveP;
          for (let t = xMin; t <= xEnd + 0.001; t += 0.2) {
            const tx = Math.min(t, xEnd);
            const px = toX(tx), py = toY(tx * tx);
            if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
            if (tx >= xEnd) break;
          }
          ctx.stroke();
        }
        // x 轴
        ctx.strokeStyle = 'rgba(165,176,216,0.6)'; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(toX(xMin), toY(0)); ctx.lineTo(toX(xMax), toY(0));
        ctx.stroke();
        // 最低点
        ctx.fillStyle = '#8ec5e0';
        ctx.beginPath(); ctx.arc(toX(0), toY(0), 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#5aa8c4'; ctx.lineWidth = 1.6; ctx.stroke();
        // 轨迹（逐帧画到当前步，J 超出 yMax 的沿顶边截断表示发散）
        const ths = rates[idx].thetas;
        const maxStep = Math.min(Math.max(Math.floor(stepCount), 0), ths.length - 1);
        if (stepCount > 0) {
          ctx.strokeStyle = rates[idx].color; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
          ctx.beginPath();
          let drawn = false;
          for (let i = 0; i <= maxStep; i++) {
            const t = ths[i];
            if (Math.abs(t) > xMax) { drawn = false; continue; }
            const px = toX(t), py = toY(t * t);
            if (!drawn) { ctx.moveTo(px, py); drawn = true; } else ctx.lineTo(px, py);
          }
          ctx.stroke();
          // 当前点
          const curT = ths[maxStep];
          if (Math.abs(curT) <= xMax) {
            ctx.shadowColor = 'rgba(124,99,224,0.35)'; ctx.shadowBlur = 8;
            ctx.fillStyle = rates[idx].color;
            ctx.beginPath(); ctx.arc(toX(curT), toY(curT * curT), 6.5, 0, Math.PI * 2); ctx.fill();
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.beginPath(); ctx.arc(toX(curT) - 2, toY(curT * curT) - 2, 2.2, 0, Math.PI * 2); ctx.fill();
          }
        }
        // 步数标签
        const curT = ths[maxStep];
        ctx.fillStyle = '#6e6890'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const diverged = Math.abs(curT) > xMax;
        ctx.fillText(diverged ? `step ${maxStep}, |θ|→∞ 发散` : `step ${maxStep}, θ=${curT > 0 ? '+' : ''}${curT.toFixed(2)}`, ox + subW / 2, panelBot - 10);
        ctx.restore();
      }
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        // 阶段：0 入场；1..3 各列高亮讲解；4 汇总
        let curStage = 0;
        if (sec >= s4) curStage = 4;
        else if (sec >= s3) curStage = 3;
        else if (sec >= s2) curStage = 2;
        else if (sec >= s1) curStage = 1;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }
        // 三列同步步进
        const stepCount = sec >= T_AXES ? (sec - T_AXES) / STEP_DUR : 0;
        const introP = easeOutCubic(win(sec, 0, T_AXES));
        rates.forEach((_, i) => {
          const focus = curStage === 0 || curStage === 4 || curStage === i + 1;
          drawSub(i, stepCount, focus, introP);
        });
        // 底部汇总面板（阶段4）
        const sumP = easeOutCubic(win(sec, s4, s4 + T_SUM));
        if (sumP > 0) {
          const label = '学习率调参建议：太小→收敛慢，适中→快速收敛，太大→震荡发散';
          ctx.font = 'bold 13px sans-serif';
          const pw = ctx.measureText(label).width + 32, ph = 28;
          ctx.save(); ctx.globalAlpha = sumP;
          glassPanel(ctx, (W - pw) / 2, botSafe - 34, pw, ph, 10, 0.85);
          ctx.fillStyle = '#5a4bb0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(label, W / 2, botSafe - 34 + ph / 2);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('学习率对比完成：α 太小收敛慢，适中快速到最低，太大震荡发散（需调超参数）', 'ok');
    },
  });

  // —— 内置 canvas 模板 24：LeNet-5 架构（7 层数据流：输入→C1→S2→C3→S4→C5→F6→输出）——
  registerCanvas('lenet5', {
    title: TEMPLATE_TITLES['lenet5'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const layers = [
        { name: '输入', size: '32×32', type: 'input', color: '#a5b0d8', desc: '原始输入图像' },
        { name: 'C1 卷积', size: '6@28×28', type: 'conv', color: '#7aa7f0', desc: '卷积提取局部特征' },
        { name: 'S2 池化', size: '6@14×14', type: 'pool', color: '#8ec5e0', desc: '池化降维，保留显著特征' },
        { name: 'C3 卷积', size: '16@10×10', type: 'conv', color: '#7aa7f0', desc: '卷积提取更抽象特征' },
        { name: 'S4 池化', size: '16@5×5', type: 'pool', color: '#8ec5e0', desc: '再次池化降维' },
        { name: 'C5 全连接', size: '120', type: 'fc', color: '#a586e8', desc: '全连接整合特征' },
        { name: 'F6 全连接', size: '84', type: 'fc', color: '#a586e8', desc: '全连接分类' },
        { name: '输出', size: '10', type: 'output', color: '#f0a8d8', desc: '输出 10 类数字' },
      ];
      const typeNames = { input: '输入', conv: '卷积', pool: '池化', fc: '全连接', output: '输出' };
      const n = layers.length;
      const layerW = (rightSafe - leftSafe) / n;
      const boxW = Math.min(layerW - 8, 62), boxH = 54;
      const cy = (topSafe + 40 + botSafe - 24) / 2;
      // 时间轴：标题 → 逐层弹入 ×8（箭头随行）→ 数据流光点 → 定格
      const T_TITLE = 0.5, T_LAYER = 0.68, T_FLOW = 1.1, T_END = 0.5;
      const layerStart = i => T_TITLE + i * T_LAYER;
      const sFlow = T_TITLE + n * T_LAYER;
      const TOTAL = sFlow + T_FLOW + T_END;
      let stage = -1;
      const stageNames = [
        'LeNet-5 经典 CNN（1998 Yann LeCun），8 层结构逐层展开',
        ...layers.map((l, i) => `第 ${i + 1} 层：${l.name}，输出 ${l.size}（${l.desc}）`),
        'LeNet-5 完成：卷积+池化提取空间特征 → 全连接分类 → 输出。CNN 鼻祖架构',
      ];
      const layerCX = i => leftSafe + i * layerW + layerW / 2;
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        // 内容容器玻璃面板
        glassPanel(ctx, 28, topSafe - 8, W - 56, botSafe - topSafe + 24, 16, 0.55);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        // 阶段
        let curStage = 0;
        if (sec >= sFlow + T_FLOW) curStage = n + 1;
        else if (sec >= sFlow) curStage = n + 1;
        else if (sec >= T_TITLE) curStage = Math.min(Math.floor((sec - T_TITLE) / T_LAYER) + 1, n);
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }
        // 标题
        const titleP = easeOutCubic(win(sec, 0, T_TITLE));
        if (titleP > 0) {
          ctx.save(); ctx.globalAlpha = titleP;
          ctx.fillStyle = '#5a4bb0'; ctx.font = 'bold 15px sans-serif';
          ctx.fillText('LeNet-5 经典 CNN 架构（1998 Yann LeCun）', W / 2, topSafe + 8);
          ctx.restore();
        }
        // 箭头（随下一层入场画出）
        for (let i = 0; i < n - 1; i++) {
          const aP = easeOutCubic(win(sec, layerStart(i + 1) - 0.08, layerStart(i + 1) + 0.25));
          if (aP <= 0) continue;
          const x1 = layerCX(i) + boxW / 2, x2 = layerCX(i + 1) - boxW / 2;
          const xe = x1 + (x2 - x1) * aP;
          ctx.strokeStyle = 'rgba(110,104,144,0.75)'; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(x1 + 1, cy); ctx.lineTo(xe - (aP >= 1 ? 4 : 0), cy); ctx.stroke();
          if (aP >= 1) {
            ctx.fillStyle = 'rgba(110,104,144,0.9)';
            ctx.beginPath();
            ctx.moveTo(x2 - 1, cy); ctx.lineTo(x2 - 7, cy - 3.5); ctx.lineTo(x2 - 7, cy + 3.5);
            ctx.closePath(); ctx.fill();
          }
        }
        // 层方块（easeOutBack 弹入）
        layers.forEach((l, i) => {
          const popP = easeOutBack(win(sec, layerStart(i), layerStart(i) + 0.42));
          if (popP <= 0) return;
          const cx = layerCX(i);
          const s = Math.max(0, popP);
          ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
          ctx.shadowColor = 'rgba(124,99,224,0.3)'; ctx.shadowBlur = 10;
          roundRect(ctx, -boxW / 2, -boxH / 2, boxW, boxH, 10);
          ctx.fillStyle = l.color; ctx.globalAlpha = 0.92; ctx.fill();
          ctx.globalAlpha = 1;
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 1.6;
          roundRect(ctx, -boxW / 2 + 1, -boxH / 2 + 1, boxW - 2, boxH - 2, 9); ctx.stroke();
          // 顶部高光
          ctx.fillStyle = 'rgba(255,255,255,0.28)';
          roundRect(ctx, -boxW / 2 + 4, -boxH / 2 + 3, boxW - 8, boxH * 0.34, 6); ctx.fill();
          // 层名 + 尺寸
          ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif';
          ctx.fillText(l.name, 0, -8);
          ctx.font = '11px sans-serif';
          ctx.fillText(l.size, 0, 9);
          ctx.restore();
          // 类型标签（框上方）
          ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(typeNames[l.type], cx, cy - boxH / 2 - 12);
        });
        // 数据流光点（最后沿网络走一遍）
        const flowP = easeOutCubic(win(sec, sFlow, sFlow + T_FLOW));
        if (flowP > 0) {
          const fx = leftSafe + flowP * (rightSafe - leftSafe);
          ctx.save();
          ctx.shadowColor = 'rgba(240,168,216,0.6)'; ctx.shadowBlur = 12;
          ctx.fillStyle = '#f0a8d8';
          ctx.beginPath(); ctx.arc(fx, cy, 6, 0, Math.PI * 2); ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.beginPath(); ctx.arc(fx - 2, cy - 2, 2, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        // 底部图例
        const legP = easeOutCubic(win(sec, T_TITLE, T_TITLE + 0.6));
        if (legP > 0) {
          ctx.save(); ctx.globalAlpha = legP;
          ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('灰=输入   蓝=卷积层   青=池化层   紫=全连接   粉=输出', W / 2, botSafe - 6);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('LeNet-5 完成：卷积+池化提取空间特征 → 全连接分类 → 输出 10 类。CNN 鼻祖架构', 'ok');
    },
  });

  // —— 内置 canvas 模板 25：生物神经元结构（细胞体+树突+轴突+突触）——
  registerCanvas('biological-neuron', {
    title: TEMPLATE_TITLES['biological-neuron'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const cx = Math.max(leftSafe + 150, Math.round(W * 0.38));
      const cy = (topSafe + botSafe) / 2, r = 30;
      // 轴突长度自适应安全区（给突触与递质粒子留位）
      const axonSpan = Math.max(120, Math.min(220, rightSafe - 120 - (cx + r)));
      const dendrites = [
        { x: cx - 140, y: cy - 52 }, { x: cx - 150, y: cy - 16 },
        { x: cx - 146, y: cy + 26 }, { x: cx - 136, y: cy + 62 },
      ];
      const axonEnd = { x: cx + r + axonSpan, y: cy };
      const axonCtrl = { x: cx + r + axonSpan * 0.5, y: cy - 20 };
      const bulbs = [
        { x: axonEnd.x + 26, y: cy - 30 },
        { x: axonEnd.x + 26, y: cy },
        { x: axonEnd.x + 26, y: cy + 30 },
      ];
      // 二次贝塞尔工具
      const qPt = (p0, p1, p2, t) => ({
        x: (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x,
        y: (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y,
      });
      // 画部分二次曲线（从 p0 到 prog 比例处）
      function drawQPartial(p0, p1, p2, prog) {
        if (prog <= 0) return;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        const N = 28;
        for (let i = 1; i <= N * prog; i++) {
          const q = qPt(p0, p1, p2, i / N);
          ctx.lineTo(q.x, q.y);
        }
        ctx.stroke();
      }
      // 时间轴：结构入场 → 树突接收 → 细胞体发放 → 轴突传导 → 突触释放 → 定格
      const T_IN = 1.1, T_DEND = 1.5, T_FIRE = 0.6, T_AXON = 1.7, T_SYN = 1.3, T_END = 0.7;
      const s1 = T_IN, s2 = s1 + T_DEND, s3 = s2 + T_FIRE, s4 = s3 + T_AXON, s5 = s4 + T_SYN;
      const TOTAL = s5 + T_END;
      let stage = -1;
      const stageNames = [
        '生物神经元：神经系统的基本结构与功能单元（树突/细胞体/轴突/突触）',
        '信号从树突接收，传入细胞体',
        '细胞体整合输入信号，达到阈值后产生动作电位',
        '动作电位沿轴突向外传导',
        '信号到达突触末梢，释放神经递质传递给下一个神经元',
      ];
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        // 阶段
        let curStage = 0;
        if (sec >= s1) curStage = 1;
        if (sec >= s2) curStage = 2;
        if (sec >= s3) curStage = 3;
        if (sec >= s4) curStage = 4;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }
        // 细胞体发放脉冲（阶段2）
        const fireP = curStage === 2 ? Math.sin(win(sec, s2, s3) * Math.PI) : 0;
        const bodyR = r * (1 + 0.18 * fireP);
        // 树突（从尖端向细胞体生长，交错入场）
        dendrites.forEach((d, i) => {
          const gP = easeOutCubic(win(sec, 0.05 + i * 0.1, 0.5 + i * 0.1));
          if (gP <= 0) return;
          const ctrl = { x: (cx + d.x) / 2, y: d.y };
          ctx.strokeStyle = '#7aa7f0'; ctx.lineWidth = 3; ctx.lineCap = 'round';
          drawQPartial(d, ctrl, { x: cx - bodyR * 0.7, y: cy + (d.y - cy) * 0.28 }, gP);
          if (gP > 0.6) {
            ctx.fillStyle = '#7aa7f0';
            ctx.beginPath(); ctx.arc(d.x, d.y, 4.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.beginPath(); ctx.arc(d.x - 1.5, d.y - 1.5, 1.5, 0, Math.PI * 2); ctx.fill();
          }
        });
        // 树突→细胞体 信号光点（阶段1）
        if (curStage === 1) {
          dendrites.forEach((d, i) => {
            const tP = easeOutCubic(win(sec, s1 + i * 0.14, s1 + i * 0.14 + 0.85));
            if (tP <= 0 || tP >= 1) return;
            const ctrl = { x: (cx + d.x) / 2, y: d.y };
            const pos = qPt(d, ctrl, { x: cx - r * 0.7, y: cy + (d.y - cy) * 0.28 }, tP);
            ctx.shadowColor = 'rgba(165,134,232,0.5)'; ctx.shadowBlur = 8;
            ctx.fillStyle = '#a586e8';
            ctx.beginPath(); ctx.arc(pos.x, pos.y, 5.5, 0, Math.PI * 2); ctx.fill();
            ctx.shadowColor = 'transparent';
          });
        }
        // 细胞体（弹入 + 发放时放大）
        const bodyP = easeOutBack(win(sec, 0.35, 0.85));
        if (bodyP > 0) {
          ctx.save(); ctx.translate(cx, cy); ctx.scale(Math.max(0, bodyP) * (1 + 0.18 * fireP), Math.max(0, bodyP) * (1 + 0.18 * fireP));
          ctx.shadowColor = 'rgba(124,99,224,0.4)'; ctx.shadowBlur = 12;
          ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fillStyle = fireP > 0.3 ? '#a586e8' : '#7aa7f0'; ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = '#5a4bb0'; ctx.lineWidth = 2.6; ctx.stroke();
          // 细胞核
          ctx.beginPath(); ctx.arc(0, 0, r * 0.42, 0, Math.PI * 2);
          ctx.fillStyle = '#f1f3fc'; ctx.fill();
          ctx.strokeStyle = 'rgba(90,75,176,0.5)'; ctx.lineWidth = 1.4; ctx.stroke();
          // 高光
          ctx.fillStyle = 'rgba(255,255,255,0.55)';
          ctx.beginPath(); ctx.arc(-r * 0.32, -r * 0.32, r * 0.2, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          // 发放光环
          if (fireP > 0) {
            ctx.save(); ctx.globalAlpha = fireP * 0.7;
            ctx.strokeStyle = '#a586e8'; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(cx, cy, r + 10 + 14 * fireP, 0, Math.PI * 2); ctx.stroke();
            ctx.restore();
          }
        }
        // 轴突（生长）
        const axonP = easeOutCubic(win(sec, 0.55, 1.0));
        if (axonP > 0) {
          ctx.strokeStyle = '#8ec5e0'; ctx.lineWidth = 4.5; ctx.lineCap = 'round';
          drawQPartial({ x: cx + r * 0.9, y: cy }, axonCtrl, axonEnd, axonP);
        }
        // 轴突上的动作电位光点（阶段3）
        if (curStage === 3) {
          const tP = easeOutCubic(win(sec, s3, s4));
          if (tP > 0) {
            const pos = qPt({ x: cx + r * 0.9, y: cy }, axonCtrl, axonEnd, tP);
            ctx.fillStyle = 'rgba(240,168,216,0.28)';
            ctx.beginPath(); ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2); ctx.fill();
            ctx.shadowColor = 'rgba(240,168,216,0.6)'; ctx.shadowBlur = 12;
            ctx.fillStyle = '#f0a8d8';
            ctx.beginPath(); ctx.arc(pos.x, pos.y, 7.5, 0, Math.PI * 2); ctx.fill();
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.beginPath(); ctx.arc(pos.x - 2.5, pos.y - 2.5, 2.5, 0, Math.PI * 2); ctx.fill();
          }
        }
        // 突触末梢（弹入；阶段4 闪烁）
        const bulbP = easeOutBack(win(sec, 0.85, 1.1));
        if (bulbP > 0) {
          const flash = curStage === 4 ? Math.sin(win(sec, s4, s5) * Math.PI * 3) * 0.5 + 0.5 : 0;
          bulbs.forEach((s, i) => {
            // 连接线
            ctx.strokeStyle = '#d06a96'; ctx.lineWidth = 2; ctx.lineCap = 'round';
            const lp = clamp01(bulbP);
            ctx.beginPath(); ctx.moveTo(axonEnd.x, axonEnd.y);
            ctx.lineTo(axonEnd.x + (s.x - axonEnd.x) * lp, axonEnd.y + (s.y - axonEnd.y) * lp);
            ctx.stroke();
            const bs = Math.max(0, bulbP) * (1 + 0.25 * flash);
            ctx.save(); ctx.translate(s.x, s.y); ctx.scale(bs, bs);
            ctx.shadowColor = 'rgba(240,168,216,0.5)'; ctx.shadowBlur = 8;
            ctx.fillStyle = '#f0a8d8';
            ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
            ctx.shadowColor = 'transparent';
            ctx.strokeStyle = '#d06a96'; ctx.lineWidth = 2; ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.beginPath(); ctx.arc(-2, -2, 2, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
            // 递质粒子（阶段4）
            if (curStage === 4) {
              for (let k = 0; k < 5; k++) {
                const tP = win(sec, s4 + 0.12 * k, s4 + 0.12 * k + 0.8);
                if (tP <= 0 || tP >= 1) continue;
                const px = s.x + 6 + tP * 34;
                const py = s.y + (i - 1) * 3 + Math.sin(tP * Math.PI) * (k % 2 ? 5 : -5);
                ctx.save(); ctx.globalAlpha = (1 - tP) * 0.9;
                ctx.fillStyle = '#a586e8';
                ctx.beginPath(); ctx.arc(px, py, 2.8, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
              }
            }
          });
        }
        // 标签（随入场淡入）
        const labP = easeOutCubic(win(sec, 0.5, 1.1));
        if (labP > 0) {
          ctx.save(); ctx.globalAlpha = labP;
          ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillStyle = '#5a7fd0'; ctx.fillText('树突 Dendrite', cx - 122, cy - 76);
          ctx.fillStyle = '#5a4bb0'; ctx.fillText('细胞体', cx, cy + r + 18);
          ctx.fillStyle = '#4e93ad'; ctx.fillText('轴突 Axon', cx + r + axonSpan * 0.5, cy - 34);
          ctx.fillStyle = '#d06a96'; ctx.fillText('突触 Synapse', bulbs[1].x, cy + 56);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('生物神经元完成：树突接收 → 细胞体整合发放 → 轴突传导 → 突触释放递质（对应人工神经元的输入→求和→激活→输出）', 'ok');
    },
  });

  // —— 内置 canvas 模板 26：人工神经元数学模型（加权求和→激活→输出）——
  registerCanvas('artificial-neuron', {
    title: TEMPLATE_TITLES['artificial-neuron'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const sigmoid = (x) => 1 / (1 + Math.exp(-x));

      // 教学数据（与原模板一致）
      const inputs = [0.5, 0.8, 0.3, 1.0];
      const weights = [0.4, -0.6, 0.9, 0.7];
      const bias = -0.2;
      const total = inputs.reduce((s, x, i) => s + x * weights[i], 0) + bias;
      const y = sigmoid(total);

      // 布局（公式面板 y 84~124，主体内容 y∈[140, H-62]，x∈[44, W-44]）
      const topY = 140, botY = H - 62;
      const cy = (topY + botY) / 2;
      const spread = Math.min(40, (botY - topY - 34) / 3);
      const inX = 84;
      const inPos = inputs.map((_, i) => ({ x: inX, y: cy + (i - 1.5) * spread }));
      const sumPos = { x: W * 0.48, y: cy };
      const actPos = { x: W * 0.70, y: cy };
      const outPos = { x: W * 0.88, y: cy };

      // 白填充 + 彩色描边 + 阴影 + 高光的节点
      const drawNode = (p, r, color, label, popP, lit, fontPx) => {
        if (popP <= 0) return;
        const s = Math.max(0, popP);
        ctx.save();
        ctx.translate(p.x, p.y); ctx.scale(s, s);
        ctx.shadowColor = 'rgba(124,99,224,0.32)'; ctx.shadowBlur = 9;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = lit ? color : '#fff';
        ctx.strokeStyle = color; ctx.lineWidth = 2.2;
        ctx.fill(); ctx.stroke();
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = lit ? 'rgba(255,255,255,0.9)' : 'rgba(190,200,240,0.55)';
        ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.3, r * 0.22, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = lit ? '#fff' : color;
        ctx.font = 'bold ' + fontPx + 'px sans-serif';
        ctx.fillText(label, 0, 1);
        ctx.restore();
      };

      // 时间轴（秒）
      const T_EDGE = 0.55;
      const tEdge0 = 1.0;                       // 4 路输入依次流向 Σ
      const tSum = tEdge0 + 4 * T_EDGE + 0.25;  // 3.45 Σ 点亮汇总
      const tAct = tSum + 0.85;                 // 4.30 Σ→f
      const tOut = tAct + 1.05;                 // 5.35 f→y
      const TOTAL = tOut + 1.85;                // 7.2s

      let stage = -1;
      const stageNames = [
        '人工神经元数学模型：y = f(Σ wi·xi + b)，4 路输入就绪',
        ...inputs.map((x, i) => `信号 x${i + 1}=${x.toFixed(1)} 乘权重 w${i + 1}=${weights[i].toFixed(1)} 流入求和节点`),
        `加权求和：${inputs.map((x, i) => `${weights[i].toFixed(1)}×${x.toFixed(1)}`).join(' + ')} + (${bias.toFixed(1)}) = ${total.toFixed(2)}`,
        `激活函数 f=Sigmoid：f(${total.toFixed(2)}) = ${y.toFixed(3)}`,
        `输出 y = ${y.toFixed(3)}（Sigmoid 把结果压缩到 0~1 之间）`,
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段判定 → 状态文案
        let cur = 0;
        if (sec >= tOut) cur = 7;
        else if (sec >= tAct) cur = 6;
        else if (sec >= tSum) cur = 5;
        else if (sec >= tEdge0) cur = 1 + Math.min(3, Math.floor((sec - tEdge0) / T_EDGE));
        if (cur !== stage) { stage = cur; setStatus(stageNames[cur]); }

        // 顶部公式面板
        const pw = Math.min(W - 96, 400);
        glassPanel(ctx, (W - pw) / 2, 84, pw, 40, 12, 0.6);
        ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 14px sans-serif';
        ctx.fillText('人工神经元：y = f(Σ wi·xi + b)', W / 2, 105);

        // 输入 → Σ 的边（淡底 + 激活生长 + 流动光点 + 权重标签）
        inPos.forEach((pt, i) => {
          const a0 = tEdge0 + i * T_EDGE, a1 = a0 + T_EDGE * 0.85;
          const flow = easeOutCubic(win(sec, a0, a1));
          const done = sec >= a1, active = sec >= a0 && !done;
          ctx.strokeStyle = 'rgba(148,163,208,0.4)'; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(pt.x, pt.y); ctx.lineTo(sumPos.x, sumPos.y); ctx.stroke();
          const gp = done ? 1 : flow;
          if (gp > 0) {
            ctx.strokeStyle = 'rgba(108,92,231,0.85)'; ctx.lineWidth = 2.2;
            ctx.beginPath(); ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(pt.x + (sumPos.x - pt.x) * gp, pt.y + (sumPos.y - pt.y) * gp); ctx.stroke();
          }
          if (active && flow > 0 && flow < 1) {
            ctx.fillStyle = '#6c5ce7';
            ctx.beginPath(); ctx.arc(pt.x + (sumPos.x - pt.x) * flow, pt.y + (sumPos.y - pt.y) * flow, 4.5, 0, Math.PI * 2); ctx.fill();
          }
          const mx = pt.x * 0.42 + sumPos.x * 0.58, my = pt.y * 0.42 + sumPos.y * 0.58 - 11;
          ctx.fillStyle = done || active ? '#6c5ce7' : '#9aa3c8';
          ctx.font = (active ? 'bold ' : '') + '11px sans-serif';
          ctx.fillText(`w${i + 1}=${weights[i].toFixed(1)}`, mx, my);
        });

        // Σ → f 的边
        const sfFlow = easeOutCubic(win(sec, tAct, tAct + 0.55));
        ctx.strokeStyle = 'rgba(148,163,208,0.4)'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(sumPos.x, sumPos.y); ctx.lineTo(actPos.x, actPos.y); ctx.stroke();
        if (sfFlow > 0) {
          ctx.strokeStyle = 'rgba(165,134,232,0.9)'; ctx.lineWidth = 2.2;
          ctx.beginPath(); ctx.moveTo(sumPos.x, sumPos.y);
          ctx.lineTo(sumPos.x + (actPos.x - sumPos.x) * sfFlow, sumPos.y); ctx.stroke();
          if (sfFlow < 1) {
            ctx.fillStyle = '#a586e8';
            ctx.beginPath(); ctx.arc(sumPos.x + (actPos.x - sumPos.x) * sfFlow, sumPos.y, 4.5, 0, Math.PI * 2); ctx.fill();
          }
        }

        // f → y 的边
        const foFlow = easeOutCubic(win(sec, tOut, tOut + 0.5));
        ctx.strokeStyle = 'rgba(148,163,208,0.4)'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(actPos.x, actPos.y); ctx.lineTo(outPos.x, outPos.y); ctx.stroke();
        if (foFlow > 0) {
          ctx.strokeStyle = 'rgba(240,168,216,0.9)'; ctx.lineWidth = 2.2;
          ctx.beginPath(); ctx.moveTo(actPos.x, actPos.y);
          ctx.lineTo(actPos.x + (outPos.x - actPos.x) * foFlow, actPos.y); ctx.stroke();
          if (foFlow < 1) {
            ctx.fillStyle = '#f0a8d8';
            ctx.beginPath(); ctx.arc(actPos.x + (outPos.x - actPos.x) * foFlow, actPos.y, 4.5, 0, Math.PI * 2); ctx.fill();
          }
        }

        // 输入节点（弹入 + 数值标签）
        inPos.forEach((pt, i) => {
          const popP = easeOutBack(win(sec, 0.15 + i * 0.14, 0.6 + i * 0.14));
          drawNode(pt, 15, '#7aa7f0', 'x' + (i + 1), popP, sec > 0.55 + i * 0.14, 12);
          if (popP > 0.6) {
            ctx.fillStyle = '#6e6890'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'left';
            ctx.fillText(inputs[i].toFixed(1), pt.x + 22, pt.y);
            ctx.textAlign = 'center';
          }
        });

        // Σ 节点 + 实时部分和 + 偏置标签
        let completed = 0;
        for (let i = 0; i < 4; i++) if (sec >= tEdge0 + i * T_EDGE + T_EDGE * 0.85) completed = i + 1;
        let partial = 0;
        for (let i = 0; i < completed; i++) partial += inputs[i] * weights[i];
        if (completed === 4) partial += bias;
        drawNode(sumPos, 23, '#6c5ce7', 'Σ', easeOutBack(win(sec, 0.5, 0.95)), sec >= tSum, 17);
        if (completed > 0 || sec >= tSum) {
          ctx.fillStyle = sec >= tSum ? '#6c5ce7' : '#8a83b8';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText('Σ=' + partial.toFixed(2), sumPos.x, sumPos.y + 39);
        }
        const bP = easeOutCubic(win(sec, 0.7, 1.1));
        if (bP > 0) {
          ctx.save(); ctx.globalAlpha = bP;
          ctx.fillStyle = '#8a83b8'; ctx.font = '11px sans-serif';
          ctx.fillText('偏置 b=' + bias.toFixed(1), sumPos.x, sumPos.y - 36);
          ctx.restore();
        }

        // f 激活节点
        drawNode(actPos, 23, '#a586e8', 'f', easeOutBack(win(sec, tAct + 0.45, tAct + 0.9)), sec >= tAct + 0.8, 17);
        const actLabP = easeOutCubic(win(sec, tAct + 0.5, tAct + 1.0));
        if (actLabP > 0) {
          ctx.save(); ctx.globalAlpha = actLabP;
          ctx.fillStyle = '#8a83b8'; ctx.font = '11px sans-serif';
          ctx.fillText('f = Sigmoid', actPos.x, actPos.y + 39);
          ctx.restore();
        }

        // 输出节点（定格保留）
        const outLit = sec >= tOut + 0.75;
        drawNode(outPos, 17, '#f0a8d8', 'y', easeOutBack(win(sec, tOut + 0.4, tOut + 0.85)), outLit, 13);
        if (outLit) {
          ctx.fillStyle = '#d06a96'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText('y=' + y.toFixed(3), outPos.x, outPos.y + 36);
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 27：感知机逻辑门 AND/OR（决策边界）——
  registerCanvas('perceptron-gates', {
    title: TEMPLATE_TITLES['perceptron-gates'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      // 教学数据（与原模板一致）：AND / OR 两个已训练好的感知机
      const gates = [
        { name: 'AND 与门', truth: [{ x: 0, y: 0, v: 0 }, { x: 0, y: 1, v: 0 }, { x: 1, y: 0, v: 0 }, { x: 1, y: 1, v: 1 }], w: [0.6, 0.6], b: -0.9 },
        { name: 'OR 或门', truth: [{ x: 0, y: 0, v: 0 }, { x: 0, y: 1, v: 1 }, { x: 1, y: 0, v: 1 }, { x: 1, y: 1, v: 1 }], w: [1.2, 1.2], b: -0.4 },
      ];
      const C_POS = '#7aa7f0', C_NEG = '#f0a8d8'; // 输出 1 / 0 的配色

      // 绘图区（安全区内）：数据坐标 [-0.08, 1.08] 映射进绘图区
      const padL = 76, padR = 56, padT = 96, padB = 78;
      const xMin = -0.08, xMax = 1.08, yMin = -0.08, yMax = 1.08;
      const axisY = H - padB;
      const px = (x) => padL + (x - xMin) / (xMax - xMin) * (W - padL - padR);
      const py = (y) => axisY - (y - yMin) / (yMax - yMin) * (axisY - padT);

      // 决策边界 w1·x1 + w2·x2 + b = 0 与绘图区边界的交点
      const lineEnds = (w1, w2, b) => {
        const pts = [];
        const push = (x, y2) => {
          if (x >= xMin - 1e-6 && x <= xMax + 1e-6 && y2 >= yMin - 1e-6 && y2 <= yMax + 1e-6
            && !pts.some(q => Math.abs(q[0] - x) < 1e-6 && Math.abs(q[1] - y2) < 1e-6)) pts.push([x, y2]);
        };
        push(xMin, -(w1 * xMin + b) / w2);
        push(xMax, -(w1 * xMax + b) / w2);
        push((-b - w2 * yMin) / w1, yMin);
        push((-b - w2 * yMax) / w1, yMax);
        return [pts[0], pts[pts.length - 1]];
      };
      const corners = [[xMin, yMin], [xMax, yMin], [xMax, yMax], [xMin, yMax]];

      // 时间轴（秒）：两个门各占一幕
      const INTRO = 0.4, PER = 3.55;
      const TOTAL = INTRO + gates.length * PER + 0.2; // 7.7s

      let stage = -1;
      const stageNames = ['感知机逻辑门：AND / OR 的真值表与决策边界'];
      gates.forEach(g => {
        stageNames.push(
          `${g.name} 真值表：${g.truth.map(t => `(${t.x},${t.y})→${t.v}`).join('  ')}`,
          `${g.name}：训练好的权重 w1=${g.w[0]}，w2=${g.w[1]}，b=${g.b} 确定一条决策边界`,
          `${g.name}：边界把输出 0 / 1 两类点完全分开（线性可分）`,
        );
      });

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 当前幕与本幕内时间
        const gi = Math.min(gates.length - 1, Math.max(0, Math.floor((sec - INTRO) / PER)));
        const ls = sec - INTRO - gi * PER; // 本幕内秒数
        const g = gates[gi];
        let cur = 0;
        if (sec >= INTRO) cur = 1 + gi * 3 + (ls >= 2.4 ? 2 : ls >= 1.0 ? 1 : 0);
        if (cur !== stage) { stage = cur; setStatus(stageNames[cur]); }

        const [w1, w2] = g.w, b = g.b;
        const [e1, e2] = lineEnds(w1, w2, b);
        const lineP = easeOutCubic(win(ls, 1.0, 1.9));   // 边界线生长
        const shadeP = easeOutCubic(win(ls, 1.9, 2.5));  // 正类区域淡入

        // 输出 1 区域着色（凸多边形：边界两端 + 正类角点）
        if (shadeP > 0) {
          const posC = corners.filter(([cx2, cy2]) => w1 * cx2 + w2 * cy2 + b > 0);
          const poly = [e1, e2, ...posC];
          const mx = poly.reduce((s, q) => s + q[0], 0) / poly.length;
          const my = poly.reduce((s, q) => s + q[1], 0) / poly.length;
          poly.sort((q1, q2) => Math.atan2(q1[1] - my, q1[0] - mx) - Math.atan2(q2[1] - my, q2[0] - mx));
          ctx.save(); ctx.globalAlpha = shadeP;
          ctx.fillStyle = 'rgba(122,167,240,0.14)';
          ctx.beginPath();
          poly.forEach((q, i) => { const X = px(q[0]), Y = py(q[1]); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); });
          ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#5a7fd0'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('输出 1 区', px(mx), py(my));
          ctx.restore();
        }

        // 坐标轴
        ctx.strokeStyle = '#a5b0d8'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, axisY); ctx.lineTo(W - padR, axisY); ctx.stroke();
        ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif';
        ctx.fillText('0', padL, axisY + 16); ctx.fillText('1', px(1), axisY + 16);
        ctx.fillText('0', padL - 12, axisY); ctx.fillText('1', padL - 12, py(1));
        ctx.textAlign = 'left'; ctx.fillText('x1 →', W - padR - 30, axisY + 16);
        ctx.fillText('x2', padL - 12, padT - 10);
        ctx.textAlign = 'center';

        // 决策边界（虚线生长）
        if (lineP > 0) {
          const sx = px(e1[0]), sy = py(e1[1]), ex2 = px(e2[0]), ey2 = py(e2[1]);
          ctx.strokeStyle = '#6c5ce7'; ctx.lineWidth = 2.6;
          ctx.setLineDash([7, 5]);
          ctx.beginPath(); ctx.moveTo(sx, sy);
          ctx.lineTo(sx + (ex2 - sx) * lineP, sy + (ey2 - sy) * lineP); ctx.stroke();
          ctx.setLineDash([]);
          if (lineP > 0.6) {
            ctx.fillStyle = '#6c5ce7'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
            ctx.fillText(`${w1}·x1 + ${w2}·x2 + (${b}) = 0`, Math.min(sx, ex2) + 6, Math.min(sy, ey2) + 16);
            ctx.textAlign = 'center';
          }
        }

        // 真值表 4 个点（白填充 + 彩色描边 + 阴影 + 高光，弹入）
        g.truth.forEach((pt, i) => {
          const popP = easeOutBack(win(ls, 0.15 + i * 0.14, 0.6 + i * 0.14));
          if (popP <= 0) return;
          const X = px(pt.x), Y = py(pt.y);
          const color = pt.v ? C_POS : C_NEG;
          const s = Math.max(0, popP);
          ctx.save();
          ctx.translate(X, Y); ctx.scale(s, s);
          ctx.shadowColor = 'rgba(124,99,224,0.3)'; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2);
          ctx.fillStyle = '#fff'; ctx.fill();
          ctx.strokeStyle = color; ctx.lineWidth = 2.4; ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = 'rgba(190,200,240,0.55)';
          ctx.beginPath(); ctx.arc(-4.5, -4.5, 3.3, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = color; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(pt.v, 0, 1);
          ctx.restore();
          // 坐标标签（朝外）
          const dx = pt.x === 0 ? -1 : 1, dy = pt.y === 0 ? 1 : -1;
          ctx.fillStyle = '#8a83b8'; ctx.font = '11px sans-serif';
          ctx.fillText(`(${pt.x},${pt.y})`, X + dx * 24, Y + dy * 24);
          // 分类正确 ✓
          const chkP = easeOutBack(win(ls, 2.0 + i * 0.12, 2.35 + i * 0.12));
          if (chkP > 0) {
            ctx.save(); ctx.globalAlpha = clamp01(chkP);
            ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 14px sans-serif';
            ctx.fillText('✓', X + dx * 14, Y - dy * 2 - 14);
            ctx.restore();
          }
        });

        // 门名徽章（底部安全区上方）
        const badgeP = easeOutCubic(win(ls, 0.1, 0.5));
        if (badgeP > 0) {
          ctx.save(); ctx.globalAlpha = badgeP;
          glassPanel(ctx, padL + 10, axisY - 44, 150, 32, 10, 0.62);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left';
          ctx.fillText(`${g.name}（感知机）`, padL + 24, axisY - 27);
          ctx.restore();
          ctx.textAlign = 'center';
        }
      });
      if (!ok) return;
      setStatus('感知机通过调整权重实现逻辑门：决策边界把两类点分开', 'ok');
    },
  });

  // —— 内置 canvas 模板 28：XOR 线性不可分（一条直线切不开）——
  registerCanvas('perceptron-xor', {
    title: TEMPLATE_TITLES['perceptron-xor'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      // XOR 四个样本点（对角同号，教学数据与原模板一致）
      const pts = [
        { x: 0, y: 0, v: 0 }, { x: 0, y: 1, v: 1 },
        { x: 1, y: 0, v: 1 }, { x: 1, y: 1, v: 0 },
      ];
      // 三次尝试都失败的直线
      const lines = [
        { slope: 1, intercept: 0.5, label: 'x2 = x1 + 0.5' },
        { slope: -1, intercept: 1.5, label: 'x2 = -x1 + 1.5' },
        { slope: 0, intercept: 0.5, label: 'x2 = 0.5' },
      ];
      const C_POS = '#7aa7f0', C_NEG = '#f0a8d8';

      // 绘图区（安全区内）
      const padL = 76, padR = 56, padT = 96, padB = 78;
      const xMin = -0.12, xMax = 1.12, yMin = -0.12, yMax = 1.12;
      const axisY = H - padB;
      const px = (x) => padL + (x - xMin) / (xMax - xMin) * (W - padL - padR);
      const py = (y) => axisY - (y - yMin) / (yMax - yMin) * (axisY - padT);
      // 每条线在当前绘图区内的端点
      const lineEnds = lines.map(ln => {
        const x1a = xMin, x1b = xMax;
        return { sx: px(x1a), sy: py(ln.slope * x1a + ln.intercept), ex: px(x1b), ey: py(ln.slope * x1b + ln.intercept) };
      });

      // 时间轴（秒）
      const INTRO = 1.2, PER_LINE = 1.7, T_END = 1.7;
      const TOTAL = INTRO + lines.length * PER_LINE + T_END; // 8.0s
      const tConcl = INTRO + lines.length * PER_LINE;        // 结论入场

      let stage = -1;
      const stageNames = [
        'XOR 真值表：(0,0)→0 (0,1)→1 (1,0)→1 (1,1)→0，同类点在对角线上',
        ...lines.map((ln, i) => `尝试第 ${i + 1} 条直线：${ln.label}`),
        '三次尝试都失败：总有一类点被切到错误的一侧',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段判定
        let cur = 0;
        if (sec >= tConcl) cur = 4;
        else if (sec >= INTRO) cur = 1 + Math.min(2, Math.floor((sec - INTRO) / PER_LINE));
        if (cur !== stage) { stage = cur; setStatus(stageNames[cur]); }

        // 坐标轴
        ctx.strokeStyle = '#a5b0d8'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, axisY); ctx.lineTo(W - padR, axisY); ctx.stroke();
        ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif';
        ctx.fillText('0', padL, axisY + 16); ctx.fillText('1', px(1), axisY + 16);
        ctx.fillText('0', padL - 12, axisY); ctx.fillText('1', padL - 12, py(1));
        ctx.textAlign = 'left'; ctx.fillText('x1 →', W - padR - 30, axisY + 16);
        ctx.fillText('x2', padL - 12, padT - 10);
        ctx.textAlign = 'center';

        // 三次尝试的线：当前线生长→变红打✗；历史线淡红定格
        lines.forEach((ln, li) => {
          const t0 = INTRO + li * PER_LINE;
          const growP = easeOutCubic(win(sec, t0, t0 + 0.75));
          const failP = win(sec, t0 + 0.8, t0 + 1.1);
          const isCur = sec >= t0 && sec < t0 + PER_LINE;
          const isPast = sec >= t0 + PER_LINE;
          if (growP <= 0 && !isPast) return;
          const gp = isPast ? 1 : growP;
          const e = lineEnds[li];
          const alpha = isPast ? 0.35 : 0.95;
          const color = failP > 0 || isPast ? `rgba(224,112,154,${alpha})` : `rgba(122,167,240,${alpha})`;
          ctx.strokeStyle = color; ctx.lineWidth = isCur ? 2.6 : 2;
          ctx.setLineDash([7, 5]);
          ctx.beginPath(); ctx.moveTo(e.sx, e.sy);
          ctx.lineTo(e.sx + (e.ex - e.sx) * gp, e.sy + (e.ey - e.sy) * gp); ctx.stroke();
          ctx.setLineDash([]);
          // 线名标签（仅当前线）
          if (isCur && growP > 0.5) {
            ctx.fillStyle = failP > 0 ? '#d06a96' : '#5a7fd0';
            ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'left';
            ctx.fillText(ln.label + (failP > 0 ? '  ✗ 切不开' : ''), padL + 8, padT + 18);
            ctx.textAlign = 'center';
          }
          // 失败 ✗ 标记（线中点弹入，历史线保留淡色）
          const markP = isPast ? 1 : easeOutBack(failP);
          if (markP > 0) {
            ctx.save(); ctx.globalAlpha = (isPast ? 0.45 : 1) * clamp01(markP);
            const mx = (e.sx + e.ex) / 2, my = (e.sy + e.ey) / 2;
            ctx.translate(mx, my); ctx.scale(Math.max(0, markP), Math.max(0, markP));
            ctx.fillStyle = '#d06a96'; ctx.font = 'bold 20px sans-serif';
            ctx.fillText('✗', 0, 1);
            ctx.restore();
          }
        });

        // 4 个样本点（白填充 + 彩色描边 + 阴影 + 高光，弹入后定格）
        pts.forEach((pt, i) => {
          const popP = easeOutBack(win(sec, 0.15 + i * 0.16, 0.62 + i * 0.16));
          if (popP <= 0) return;
          const X = px(pt.x), Y = py(pt.y);
          const color = pt.v ? C_POS : C_NEG;
          ctx.save();
          ctx.translate(X, Y); ctx.scale(Math.max(0, popP), Math.max(0, popP));
          ctx.shadowColor = 'rgba(124,99,224,0.3)'; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2);
          ctx.fillStyle = '#fff'; ctx.fill();
          ctx.strokeStyle = color; ctx.lineWidth = 2.4; ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = 'rgba(190,200,240,0.55)';
          ctx.beginPath(); ctx.arc(-4.5, -4.5, 3.3, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = color; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(pt.v, 0, 1);
          ctx.restore();
          const dx = pt.x === 0 ? -1 : 1, dy = pt.y === 0 ? 1 : -1;
          ctx.fillStyle = '#8a83b8'; ctx.font = '11px sans-serif';
          ctx.fillText(`(${pt.x},${pt.y})`, X + dx * 24, Y + dy * 24);
        });

        // 图例（右上安全区内）
        const legP = easeOutCubic(win(sec, 0.3, 0.7));
        if (legP > 0) {
          ctx.save(); ctx.globalAlpha = legP;
          glassPanel(ctx, W - 176, padT + 2, 120, 48, 10, 0.6);
          ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
          ctx.fillStyle = C_POS; ctx.beginPath(); ctx.arc(W - 162, padT + 16, 5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#6e6890'; ctx.fillText('输出 1', W - 152, padT + 17);
          ctx.fillStyle = C_NEG; ctx.beginPath(); ctx.arc(W - 162, padT + 36, 5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#6e6890'; ctx.fillText('输出 0', W - 152, padT + 37);
          ctx.restore();
          ctx.textAlign = 'center';
        }

        // 结论面板（中央弹入并定格）
        const conP = easeOutBack(win(sec, tConcl + 0.15, tConcl + 0.75));
        if (conP > 0) {
          const cw = Math.min(W - 120, 400), ch = 48;
          const ccx = W / 2, ccy = (padT + axisY) / 2;
          ctx.save();
          ctx.translate(ccx, ccy); ctx.scale(Math.max(0, conP), Math.max(0, conP));
          glassPanel(ctx, -cw / 2, -ch / 2, cw, ch, 13, 0.72);
          ctx.fillStyle = '#d06a96'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('XOR 线性不可分：一条直线切不开', 0, -7);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('→ 需要多层感知机（隐藏层）', 0, 12);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('单条直线无法分开 XOR → 需要多层感知机（隐藏层）', 'ok');
    },
  });

  // —— 内置 canvas 模板 29：人工神经网络概念（多层全连接）——
  registerCanvas('neural-network-concept', {
    title: TEMPLATE_TITLES['neural-network-concept'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      // 网络结构（与原模板一致）：3 - 4 - 4 - 2 全连接
      const layers = [
        { name: '输入层', n: 3, color: '#7aa7f0' },
        { name: '隐藏层 1', n: 4, color: '#a586e8' },
        { name: '隐藏层 2', n: 4, color: '#6c5ce7' },
        { name: '输出层', n: 2, color: '#f0a8d8' },
      ];
      const R = 15;
      const labelY = 88;                       // 层标签（顶部安全区）
      const topY = 112, botY = H - 96;         // 节点活动区（底部留出结论行）
      const midY = (topY + botY) / 2;
      const layerX = layers.map((_, i) => 78 + i * (W - 156) / (layers.length - 1));
      const nodePos = layers.map((l, li) => {
        const spread = Math.min(52, (botY - topY) / Math.max(1, l.n - 1 || 1));
        return Array.from({ length: l.n }, (_, ni) => ({
          x: layerX[li], y: l.n === 1 ? midY : midY + (ni - (l.n - 1) / 2) * spread,
        }));
      });

      // 时间轴（秒）：输入层入场 → 三次层间传播 → 定格
      const T_IN = 0.9, T_TRANS = 1.5;
      const TOTAL = T_IN + 3 * T_TRANS + 1.7;  // 7.1s

      let stage = -1;
      const stageNames = [
        '人工神经网络：多层神经元通过加权连接组成（3-4-4-2 全连接）',
        '信号前向传播：输入层 → 隐藏层 1（每个神经元都与上一层全部相连）',
        '信号前向传播：隐藏层 1 → 隐藏层 2（逐层加权求和 + 激活）',
        '信号前向传播：隐藏层 2 → 输出层',
        '前向传播完成：多层网络可表达复杂函数',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段判定
        let cur = 0;
        if (sec >= T_IN) {
          const k = Math.floor((sec - T_IN) / T_TRANS);
          cur = k < 3 ? 1 + k : 4;
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[cur]); }

        // 当前传播进度：actK 表示正在进行的层间传播编号（-1 无）
        const actK = sec >= T_IN && cur >= 1 && cur <= 3 ? cur - 1 : -1;
        const transT = actK >= 0 ? (sec - T_IN - actK * T_TRANS) / T_TRANS : 0;

        // 边（全连接）：已建立的淡色常驻，当前传播的加粗生长 + 流动光点
        for (let li = 0; li < layers.length - 1; li++) {
          const estP = li === 0 ? win(sec, T_IN * 0.7, T_IN) : win(sec, T_IN + (li - 1) * T_TRANS + T_TRANS * 0.55, T_IN + li * T_TRANS);
          if (estP <= 0) continue;
          for (let ni = 0; ni < layers[li].n; ni++) {
            for (let nj = 0; nj < layers[li + 1].n; nj++) {
              const a = nodePos[li][ni], b = nodePos[li + 1][nj];
              const isAct = li === actK;
              const flow = isAct ? easeOutCubic(clamp01(transT / 0.62)) : 0;
              ctx.strokeStyle = isAct ? 'rgba(108,92,231,0.75)' : 'rgba(148,163,208,0.34)';
              ctx.lineWidth = isAct ? 1.8 : 1.2;
              const gp = isAct ? flow : 1;
              ctx.beginPath(); ctx.moveTo(a.x, a.y);
              ctx.lineTo(a.x + (b.x - a.x) * gp, a.y + (b.y - a.y) * gp); ctx.stroke();
              // 流动光点（错相流动）
              if (isAct && flow > 0 && flow < 1) {
                const ph = clamp01(transT / 0.62 + ((ni + nj) % 3) * 0.06 - 0.06);
                if (ph > 0 && ph < 1) {
                  ctx.fillStyle = 'rgba(108,92,231,0.9)';
                  ctx.beginPath(); ctx.arc(a.x + (b.x - a.x) * ph, a.y + (b.y - a.y) * ph, 3.5, 0, Math.PI * 2); ctx.fill();
                }
              }
            }
          }
        }

        // 节点（白填充 + 彩色描边 + 阴影 + 高光；传播到达时点亮）
        nodePos.forEach((layer, li) => {
          const baseT = li === 0 ? 0.12 : T_IN + (li - 1) * T_TRANS + T_TRANS * 0.42;
          layer.forEach((pt, ni) => {
            const popP = easeOutBack(win(sec, baseT + ni * 0.09, baseT + 0.42 + ni * 0.09));
            if (popP <= 0) return;
            const lit = li === 0 ? sec > 0.55 : sec > T_IN + (li - 1) * T_TRANS + T_TRANS * 0.92;
            const s = Math.max(0, popP);
            ctx.save();
            ctx.translate(pt.x, pt.y); ctx.scale(s, s);
            ctx.shadowColor = 'rgba(124,99,224,0.32)'; ctx.shadowBlur = 8;
            ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2);
            ctx.fillStyle = lit ? layers[li].color : '#fff';
            ctx.strokeStyle = layers[li].color; ctx.lineWidth = 2.2;
            ctx.fill(); ctx.stroke();
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = lit ? 'rgba(255,255,255,0.9)' : 'rgba(190,200,240,0.55)';
            ctx.beginPath(); ctx.arc(-R * 0.3, -R * 0.3, R * 0.24, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
          });
          // 层标签（顶部安全区，随本层入场淡入）
          const labP = easeOutCubic(win(sec, baseT, baseT + 0.5));
          if (labP > 0) {
            ctx.save(); ctx.globalAlpha = labP;
            ctx.fillStyle = layers[li].color; ctx.font = 'bold 13px sans-serif';
            ctx.fillText(layers[li].name, layerX[li], labelY);
            ctx.fillStyle = '#8a83b8'; ctx.font = '11px sans-serif';
            ctx.fillText(layers[li].n + ' 个神经元', layerX[li], labelY + 16);
            ctx.restore();
          }
        });

        // 底部结论（定格）
        const capP = easeOutCubic(win(sec, T_IN + 3 * T_TRANS + 0.2, T_IN + 3 * T_TRANS + 0.8));
        if (capP > 0) {
          ctx.save(); ctx.globalAlpha = capP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('全连接：每个神经元与上一层全部相连；层数越多，表达力越强', W / 2, H - 74);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('前向传播完成：输入→隐藏→输出，多层网络可表达复杂函数', 'ok');
    },
  });

  // —— 内置 canvas 模板 30：SGD vs BGD vs MBGD 三种梯度下降对比 ——
  registerCanvas('sgd-minibatch', {
    title: TEMPLATE_TITLES['sgd-minibatch'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      // 三种梯度下降（教学设定与原模板一致）
      const algos = [
        { name: 'BGD 全批量', color: '#7aa7f0', noise: 0, step: 0.13, desc: '稳但慢' },
        { name: 'MBGD 小批量', color: '#6c5ce7', noise: 0.10, step: 0.22, desc: '快且稳' },
        { name: 'SGD 单样本', color: '#f0a8d8', noise: 0.32, step: 0.28, desc: '最快但噪' },
      ];
      const N_ITER = 60;

      // 绘图区（安全区内）
      const padL = 64, padR = 40, padT = 92, padB = 80;
      const axisY = H - padB;
      const xPx = (i) => padL + i / N_ITER * (W - padL - padR);
      const yPx = (l) => axisY - l / 4 * (axisY - padT);

      // 确定性伪随机（每帧轨迹一致，避免闪烁）
      const rnd = (i, a) => { const s = Math.sin(i * 12.9898 + a * 78.233) * 43758.5453; return s - Math.floor(s) - 0.5; };
      // 预生成三条损失轨迹
      const traces = algos.map((a, ai) => {
        const arr = [];
        let l = 3.5;
        for (let i = 0; i <= N_ITER; i++) {
          arr.push(l);
          l = l - a.step * l + rnd(i, ai) * a.noise * Math.max(l, 0.35);
          if (l < 0.08) l = 0.08 + Math.abs(rnd(i * 3 + 1, ai)) * a.noise * 0.5;
        }
        return arr;
      });

      // 时间轴（秒）：坐标轴 → 三条曲线依次生长 → 定格对比
      const T_AXES = 0.6, T_CURVE = 1.85;
      const TOTAL = T_AXES + 0.2 + 3 * T_CURVE + 1.3; // 7.65s
      const tC0 = T_AXES + 0.2;

      let stage = -1;
      const stageNames = [
        '三种梯度下降对比：损失 L 随迭代次数下降（BGD / MBGD / SGD）',
        ...algos.map(a => `${a.name}：${a.desc}`),
        '对比完成：MBGD 小批量兼顾速度与稳定性，是深度学习最常用方式',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段判定
        let cur = 0;
        if (sec >= tC0 + 3 * T_CURVE) cur = 4;
        else if (sec >= tC0) cur = 1 + Math.min(2, Math.floor((sec - tC0) / T_CURVE));
        if (cur !== stage) { stage = cur; setStatus(stageNames[cur]); }

        // 坐标轴 + 刻度
        const axP = easeOutCubic(win(sec, 0, T_AXES));
        ctx.save(); ctx.globalAlpha = axP;
        ctx.strokeStyle = '#a5b0d8'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, axisY); ctx.lineTo(W - padR, axisY); ctx.stroke();
        ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right';
        [0, 1, 2, 3, 4].forEach(v => ctx.fillText(v.toFixed(0), padL - 8, yPx(v)));
        ctx.fillText('损失 L', padL - 8, padT - 10);
        ctx.fillText('迭代次数 →', W - padR, axisY + 16);
        ctx.restore();
        ctx.textAlign = 'center';

        // 三条曲线：逐条生长，已完成的全量定格
        algos.forEach((a, ai) => {
          const c0 = tC0 + ai * T_CURVE;
          const cp = easeOutCubic(win(sec, c0, c0 + T_CURVE * 0.78));
          if (cp <= 0) return;
          const jMax = Math.max(1, Math.round(cp * N_ITER));
          ctx.strokeStyle = a.color; ctx.lineWidth = 2.4; ctx.lineJoin = 'round';
          ctx.beginPath();
          for (let j = 0; j <= jMax; j++) {
            const X = xPx(j), Y = yPx(traces[ai][j]);
            j ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
          }
          ctx.stroke();
          // 生长端点
          if (cp < 1) {
            ctx.fillStyle = a.color;
            ctx.beginPath(); ctx.arc(xPx(jMax), yPx(traces[ai][jMax]), 5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.beginPath(); ctx.arc(xPx(jMax) - 1.5, yPx(traces[ai][jMax]) - 1.5, 1.8, 0, Math.PI * 2); ctx.fill();
          }
          // 完成后的终值标注（右上偏移，避免互相重叠）
          if (cp >= 1) {
            const endL = traces[ai][N_ITER];
            ctx.fillStyle = a.color; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'right';
            ctx.fillText('L=' + endL.toFixed(2), xPx(N_ITER) - 4, yPx(endL) - 10 - ai * 2);
            ctx.textAlign = 'center';
          }
        });

        // 图例面板（右上，随首条曲线入场）
        const legP = easeOutCubic(win(sec, tC0, tC0 + 0.5));
        if (legP > 0) {
          ctx.save(); ctx.globalAlpha = legP;
          glassPanel(ctx, W - padR - 168, padT + 8, 160, 78, 12, 0.62);
          algos.forEach((a, ai) => {
            const ly = padT + 26 + ai * 24;
            ctx.strokeStyle = a.color; ctx.lineWidth = 2.6;
            ctx.beginPath(); ctx.moveTo(W - padR - 154, ly); ctx.lineTo(W - padR - 136, ly); ctx.stroke();
            ctx.fillStyle = '#4a4570'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'left';
            ctx.fillText(a.name, W - padR - 130, ly);
            ctx.fillStyle = '#8a83b8'; ctx.font = '11px sans-serif';
            ctx.fillText(a.desc, W - padR - 52, ly);
          });
          ctx.restore();
          ctx.textAlign = 'center';
        }
      });
      if (!ok) return;
      setStatus('结论：MBGD 小批量兼顾速度与稳定性，是深度学习最常用的优化方式', 'ok');
    },
  });

  // —— 内置 canvas 模板 31：CNN 概念 pipeline（卷积→池化→全连接→分类）——
  registerCanvas('cnn-concept', {
    title: TEMPLATE_TITLES['cnn-concept'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      // 流水线各阶段（与原模板一致）
      const stages = [
        { name: '原图', sub: '32×32', color: '#8a83b8', type: 'input' },
        { name: '卷积', sub: '提取特征', color: '#7aa7f0', type: 'conv' },
        { name: '特征图', sub: '28×28×6', color: '#a586e8', type: 'feature' },
        { name: '池化', sub: '降维', color: '#8ec5e0', type: 'pool' },
        { name: '全连接', sub: '分类', color: '#6c5ce7', type: 'fc' },
        { name: '输出', sub: '10 类', color: '#f0a8d8', type: 'output' },
      ];
      const n = stages.length;
      const blockW = (W - 88) / n;
      const bw = Math.min(blockW - 14, 84), bh = 78;
      const cy = Math.min(Math.max(H * 0.5, 96 + bh / 2), H - 62 - bh / 2 - 26);

      // 各阶段迷你图标
      const drawIcon = (type, cx2, cy2, color) => {
        ctx.save();
        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1.6;
        if (type === 'input') {
          for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
            ctx.globalAlpha = 0.35 + ((r * 4 + c) % 3) * 0.25;
            ctx.fillRect(cx2 - 15 + c * 8, cy2 - 15 + r * 8, 5.5, 5.5);
          }
        } else if (type === 'conv') {
          ctx.globalAlpha = 0.9;
          for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
            ctx.strokeRect(cx2 - 14 + c * 9, cy2 - 14 + r * 9, 9, 9);
          }
          ctx.globalAlpha = 0.35; ctx.fillRect(cx2 - 14, cy2 - 14, 18, 18);
        } else if (type === 'feature') {
          for (let k = 0; k < 3; k++) {
            ctx.globalAlpha = 0.35 + k * 0.25;
            ctx.fillRect(cx2 - 14 + k * 6, cy2 - 12 + k * 4 - 6, 16, 20);
            ctx.globalAlpha = 0.9; ctx.strokeRect(cx2 - 14 + k * 6, cy2 - 12 + k * 4 - 6, 16, 20);
          }
        } else if (type === 'pool') {
          ctx.globalAlpha = 0.9;
          ctx.strokeRect(cx2 - 16, cy2 - 10, 9, 9); ctx.strokeRect(cx2 - 6, cy2 - 10, 9, 9);
          ctx.strokeRect(cx2 - 16, cy2, 9, 9); ctx.strokeRect(cx2 - 6, cy2, 9, 9);
          ctx.globalAlpha = 0.5; ctx.fillRect(cx2 + 8, cy2 - 5, 10, 10);
          ctx.globalAlpha = 0.9; ctx.strokeRect(cx2 + 8, cy2 - 5, 10, 10);
        } else if (type === 'fc') {
          for (let k = 0; k < 4; k++) {
            ctx.beginPath(); ctx.arc(cx2 - 8, cy2 - 12 + k * 8, 2.8, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(cx2 + 8, cy2 - 12 + k * 8, 2.8, 0, Math.PI * 2); ctx.fill();
          }
          ctx.globalAlpha = 0.4;
          for (let k = 0; k < 4; k++) {
            ctx.beginPath(); ctx.moveTo(cx2 - 8, cy2 - 12 + k * 8); ctx.lineTo(cx2 + 8, cy2 - 12 + ((k + 1) % 4) * 8); ctx.stroke();
          }
        } else {
          const hs = [8, 16, 24];
          hs.forEach((h, k) => {
            ctx.globalAlpha = 0.45 + k * 0.25;
            ctx.fillRect(cx2 - 14 + k * 11, cy2 + 12 - h, 7, h);
          });
        }
        ctx.restore();
      };

      // 时间轴（秒）：逐阶段弹入 + 信号流过
      const T_ST = 1.05, T0 = 0.45;
      const TOTAL = T0 + n * T_ST + 0.85; // 7.6s

      let stage = -1;
      const stageNames = [
        'CNN 动机：MLP 处理图像参数过多，CNN 用卷积共享权重提取局部特征',
        ...stages.map(s => `${s.name}：${s.sub}`),
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段判定
        let cur = 0;
        if (sec >= T0) cur = 1 + Math.min(n - 1, Math.floor((sec - T0) / T_ST));
        if (cur !== stage) { stage = cur; setStatus(stageNames[cur]); }

        // 箭头（已出现的相邻阶段之间；当前传播高亮 + 流动光点）
        for (let i = 0; i < n - 1; i++) {
          const t0 = T0 + i * T_ST;
          if (sec < t0 + 0.3) continue;
          const x1 = 44 + i * blockW + blockW / 2 + bw / 2;
          const x2 = 44 + (i + 1) * blockW + blockW / 2 - bw / 2;
          const flow = easeOutCubic(win(sec, t0 + 0.35, t0 + T_ST * 0.92));
          const isAct = sec >= t0 + 0.3 && flow < 1;
          ctx.strokeStyle = isAct ? 'rgba(108,92,231,0.9)' : 'rgba(148,163,208,0.55)';
          ctx.lineWidth = isAct ? 2.6 : 1.8;
          const gp = isAct ? flow : 1;
          ctx.beginPath(); ctx.moveTo(x1, cy); ctx.lineTo(x1 + (x2 - x1) * gp, cy); ctx.stroke();
          if (gp > 0.6) {
            const ax = x1 + (x2 - x1) * gp;
            ctx.fillStyle = isAct ? '#6c5ce7' : 'rgba(148,163,208,0.8)';
            ctx.beginPath(); ctx.moveTo(ax, cy); ctx.lineTo(ax - 7, cy - 4.5); ctx.lineTo(ax - 7, cy + 4.5); ctx.closePath(); ctx.fill();
          }
          if (isAct && flow > 0 && flow < 1) {
            ctx.fillStyle = '#6c5ce7';
            ctx.beginPath(); ctx.arc(x1 + (x2 - x1) * flow, cy, 4.5, 0, Math.PI * 2); ctx.fill();
          }
        }

        // 阶段方块（毛玻璃 + 彩色描边，easeOutBack 弹入，定格保留）
        stages.forEach((s, i) => {
          const t0 = T0 + i * T_ST;
          const popP = easeOutBack(win(sec, t0, t0 + 0.5));
          if (popP <= 0) return;
          const cx2 = 44 + i * blockW + blockW / 2;
          ctx.save();
          ctx.translate(cx2, cy); ctx.scale(Math.max(0, popP), Math.max(0, popP));
          glassPanel(ctx, -bw / 2, -bh / 2, bw, bh, 12, 0.6);
          ctx.strokeStyle = s.color; ctx.lineWidth = 2;
          roundRect(ctx, -bw / 2, -bh / 2, bw, bh, 12); ctx.stroke();
          drawIcon(s.type, 0, -12, s.color);
          ctx.fillStyle = '#4a4570'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(s.name, 0, 16);
          ctx.fillStyle = '#8a83b8'; ctx.font = '11px sans-serif';
          ctx.fillText(s.sub, 0, 31);
          ctx.restore();
        });

        // 底部结论（定格）
        const capP = easeOutCubic(win(sec, T0 + n * T_ST, T0 + n * T_ST + 0.5));
        if (capP > 0) {
          ctx.save(); ctx.globalAlpha = capP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('CNN：卷积提取局部特征 → 池化降维 → 全连接分类，是计算机视觉的基石', W / 2, Math.min(cy + bh / 2 + 24, H - 64));
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('CNN 完成：层次化提取特征 → 分类，是计算机视觉的基石', 'ok');
    },
  });

  // —— 内置 canvas 模板 32：AlexNet 架构（5 卷积+3 全连接）——
  registerCanvas('alexnet', {
    title: TEMPLATE_TITLES['alexnet'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      // 8 层结构（与原模板一致）：5 卷积（含 3 池化）+ 3 全连接
      const layers = [
        { name: 'Conv1', size: '55×55×96', kernel: '11×11', type: 'conv' },
        { name: 'MaxPool', size: '27×27×96', type: 'pool' },
        { name: 'Conv2', size: '27×27×256', kernel: '5×5', type: 'conv' },
        { name: 'MaxPool', size: '13×13×256', type: 'pool' },
        { name: 'Conv3', size: '13×13×384', kernel: '3×3', type: 'conv' },
        { name: 'Conv4', size: '13×13×384', kernel: '3×3', type: 'conv' },
        { name: 'Conv5', size: '13×13×256', kernel: '3×3', type: 'conv' },
        { name: 'MaxPool', size: '6×6×256', type: 'pool' },
        { name: 'FC1', size: '4096', type: 'fc' },
        { name: 'FC2', size: '4096', type: 'fc' },
        { name: 'FC3', size: '1000 类', type: 'fc' },
      ];
      const n = layers.length;
      const colors = { conv: '#7aa7f0', pool: '#8ec5e0', fc: '#a586e8' };

      // 布局（安全区内；顶部图例行 y≈88~100，底部总结行 y≤H-62）
      const blockW = (W - 88) / n;
      const bw = Math.min(blockW - 6, 52);
      const cy = Math.min(Math.max(H * 0.48, 150), H - 150);
      const bhOf = (t) => t === 'pool' ? 42 : t === 'fc' ? 58 : 66;

      // 时间轴（秒）：逐层弹入 + 箭头信号
      const T0 = 0.5, T_L = 0.58;
      const TOTAL = T0 + n * T_L + 1.0; // ≈7.9s

      let stage = -1;
      const stageNames = [
        'AlexNet：2012 ImageNet 冠军，8 层（5 卷积 + 3 全连接），开启深度学习时代',
        ...layers.map((l, i) => `第 ${i + 1} 层 ${l.name}：${l.size}${l.kernel ? '（卷积核 ' + l.kernel + '）' : l.type === 'pool' ? '（最大池化降维）' : '（全连接分类）'}`),
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段判定
        let cur = 0;
        if (sec >= T0) cur = 1 + Math.min(n - 1, Math.floor((sec - T0) / T_L));
        if (cur !== stage) { stage = cur; setStatus(stageNames[cur]); }

        // 顶部标题 + 图例（安全区顶边内）
        const headP = easeOutCubic(win(sec, 0, 0.5));
        if (headP > 0) {
          ctx.save(); ctx.globalAlpha = headP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'left';
          ctx.fillText('AlexNet：8 层经典 CNN', 44, 90);
          const legends = [['卷积 Conv', colors.conv], ['池化 Pool', colors.pool], ['全连接 FC', colors.fc]];
          let lx = W - 44;
          ctx.font = '11px sans-serif';
          for (let k = legends.length - 1; k >= 0; k--) {
            const wText = ctx.measureText(legends[k][0]).width;
            lx -= wText;
            ctx.fillStyle = '#6e6890'; ctx.textAlign = 'left';
            ctx.fillText(legends[k][0], lx, 90);
            lx -= 18;
            ctx.fillStyle = legends[k][1];
            roundRect(ctx, lx, 83, 12, 12, 3); ctx.fill();
            lx -= 14;
          }
          ctx.restore();
          ctx.textAlign = 'center';
        }

        // 箭头（层间；当前层前的箭头高亮 + 光点）
        for (let i = 0; i < n - 1; i++) {
          const t0 = T0 + i * T_L;
          if (sec < t0 + 0.2) continue;
          const x1 = 44 + i * blockW + blockW / 2 + bw / 2;
          const x2 = 44 + (i + 1) * blockW + blockW / 2 - bw / 2;
          const flow = easeOutCubic(win(sec, t0 + 0.2, t0 + T_L * 0.9));
          const isAct = flow < 1;
          ctx.strokeStyle = isAct ? 'rgba(108,92,231,0.9)' : 'rgba(148,163,208,0.5)';
          ctx.lineWidth = isAct ? 2.4 : 1.6;
          const gp = isAct ? flow : 1;
          ctx.beginPath(); ctx.moveTo(x1, cy); ctx.lineTo(x1 + (x2 - x1) * gp, cy); ctx.stroke();
          if (isAct && flow > 0 && flow < 1) {
            ctx.fillStyle = '#6c5ce7';
            ctx.beginPath(); ctx.arc(x1 + (x2 - x1) * flow, cy, 4, 0, Math.PI * 2); ctx.fill();
          }
        }

        // 层方块（毛玻璃 + 彩色描边，easeOutBack 弹入，定格保留）
        layers.forEach((l, i) => {
          const popP = easeOutBack(win(sec, T0 + i * T_L, T0 + i * T_L + 0.45));
          if (popP <= 0) return;
          const cx2 = 44 + i * blockW + blockW / 2;
          const bh = bhOf(l.type);
          ctx.save();
          ctx.translate(cx2, cy); ctx.scale(Math.max(0, popP), Math.max(0, popP));
          glassPanel(ctx, -bw / 2, -bh / 2, bw, bh, 10, 0.62);
          ctx.strokeStyle = colors[l.type]; ctx.lineWidth = 2;
          roundRect(ctx, -bw / 2, -bh / 2, bw, bh, 10); ctx.stroke();
          // 层名 + 尺寸 + 卷积核（密集排布用 10px）
          ctx.fillStyle = '#4a4570'; ctx.font = 'bold 10px sans-serif';
          ctx.fillText(l.name, 0, l.kernel ? -12 : -4);
          ctx.fillStyle = '#6e6890'; ctx.font = '10px sans-serif';
          ctx.fillText(l.size, 0, l.kernel ? 2 : 10);
          if (l.kernel) {
            ctx.fillStyle = colors.conv; ctx.font = 'bold 10px sans-serif';
            ctx.fillText(l.kernel, 0, 16);
          }
          ctx.restore();
        });

        // 底部总结（定格）
        const capP = easeOutCubic(win(sec, T0 + n * T_L + 0.1, T0 + n * T_L + 0.6));
        if (capP > 0) {
          ctx.save(); ctx.globalAlpha = capP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('数据流：227×227 输入 → 5 卷积（含 3 次池化）提取空间特征 → 3 全连接 → 1000 类输出', W / 2, Math.min(cy + 66, H - 74));
          ctx.fillStyle = '#8a83b8'; ctx.font = '12px sans-serif';
          ctx.fillText('关键技术：ReLU 激活 + Dropout + GPU 训练，ImageNet Top-5 错误率 15.3%', W / 2, Math.min(cy + 86, H - 62));
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('AlexNet 完成：ReLU+Dropout+GPU 训练，ImageNet Top-5 错误率 15.3%，开启深度学习时代', 'ok');
    },
  });

  // —— 内置 canvas 模板 33：信息增益（分裂前后熵减少量）——
  registerCanvas('information-gain', {
    title: TEMPLATE_TITLES['information-gain'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      // 教学数据（与原模板一致）：父 4正4负 H=1；左子 3正1负、右子 1正3负 H=0.811；IG=0.189
      const entropy = (pPos, n) => {
        if (n === 0) return 0;
        const p1 = pPos / n, p0 = 1 - p1;
        let h = 0;
        if (p1 > 0) h -= p1 * Math.log2(p1);
        if (p0 > 0) h -= p0 * Math.log2(p0);
        return h;
      };
      const parent = { pos: 4, neg: 4 };
      const H_parent = entropy(parent.pos, parent.pos + parent.neg);
      const children = [
        { pos: 3, neg: 1, label: '左子节点', edge: '特征 ≤ 阈值', color: '#7aa7f0' },
        { pos: 1, neg: 3, label: '右子节点', edge: '特征 > 阈值', color: '#a586e8' },
      ];
      const H_child = children.map(c => entropy(c.pos, c.pos + c.neg));
      const totalN = parent.pos + parent.neg;
      const weightedH = children.reduce((s, c, i) => s + (c.pos + c.neg) / totalN * H_child[i], 0);
      const IG = H_parent - weightedH;

      // 布局（安全区内；右侧为计算面板）
      const parentPos = { x: W * 0.27, y: 132 };
      const childPos = [
        { x: W * 0.13, y: 232 },
        { x: W * 0.41, y: 232 },
      ];
      const panelX = W * 0.56, panelY = 96, panelW = W - 44 - panelX, panelH = 162;
      const calcLines = [
        { t: '分裂前后熵的变化：', font: 'bold 12px sans-serif', color: '#4a4570' },
        { t: `H(父) = ${H_parent.toFixed(3)} bit`, font: '12px sans-serif', color: '#6e6890' },
        { t: `H(左) = H(右) = ${H_child[0].toFixed(3)} bit`, font: '12px sans-serif', color: '#6e6890' },
        { t: `加权 H(子) = ½×${H_child[0].toFixed(3)}×2 = ${weightedH.toFixed(3)}`, font: '12px sans-serif', color: '#6e6890' },
        { t: `IG = ${H_parent.toFixed(3)} − ${weightedH.toFixed(3)} = ${IG.toFixed(3)} bit`, font: 'bold 14px sans-serif', color: '#6c5ce7', key: true },
        { t: 'IG 越大越好 → 选此特征分裂', font: '11px sans-serif', color: '#8a83b8' },
      ];

      // 节点绘制：白填充 + 彩色描边 + 阴影 + 高光
      const drawNode = (p, r, color, line1, line2, popP, active) => {
        if (popP <= 0) return;
        const s = Math.max(0, popP);
        ctx.save();
        ctx.translate(p.x, p.y); ctx.scale(s, s);
        ctx.shadowColor = 'rgba(124,99,224,0.32)'; ctx.shadowBlur = 9;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; ctx.fill();
        ctx.strokeStyle = color; ctx.lineWidth = active ? 3.2 : 2.2; ctx.stroke();
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = 'rgba(190,200,240,0.55)';
        ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.3, r * 0.22, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#4a4570'; ctx.font = 'bold 12px sans-serif';
        ctx.fillText(line1, 0, -6);
        ctx.fillStyle = color; ctx.font = 'bold 12px sans-serif';
        ctx.fillText(line2, 0, 9);
        ctx.restore();
      };

      // 时间轴（秒）
      const T_PARENT = 1.0;   // 父节点弹入
      const T_EDGE = 1.0;     // 两条分裂边生长
      const T_CHILD = 1.1;    // 子节点弹入
      const T_CALC = 2.6;     // 计算面板逐行揭示
      const TOTAL = 0.2 + T_PARENT + T_EDGE + T_CHILD + T_CALC + 1.5; // 7.4s
      const tEdge = 0.2 + T_PARENT, tChild = tEdge + T_EDGE, tCalc = tChild + T_CHILD;

      let stage = -1;
      const stageNames = [
        '信息增益：选择使熵减少最多的特征进行分裂',
        `父节点：8 个样本（4 正 4 负），熵 H=${H_parent.toFixed(3)} bit（不确定性最大）`,
        '按特征「≤阈值 / >阈值」分裂为两个子节点',
        `左子 3 正 1 负、右子 1 正 3 负：各自熵降到 ${H_child[0].toFixed(3)} bit`,
        `加权子熵 = ½×${H_child[0].toFixed(3)} + ½×${H_child[1].toFixed(3)} = ${weightedH.toFixed(3)} bit`,
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段判定
        let cur = 0;
        if (sec >= tCalc) cur = 4;
        else if (sec >= tChild) cur = 3;
        else if (sec >= tEdge) cur = 2;
        else if (sec >= 0.2) cur = 1;
        if (cur !== stage) { stage = cur; setStatus(stageNames[cur]); }

        // 分裂边（父 → 左右子，依次生长 + 标签）
        children.forEach((c, i) => {
          const t0 = tEdge + i * 0.5;
          const gP = easeOutCubic(win(sec, t0, t0 + 0.45));
          if (gP <= 0) return;
          const from = { x: parentPos.x, y: parentPos.y + 28 };
          const to = { x: childPos[i].x, y: childPos[i].y - 26 };
          ctx.strokeStyle = 'rgba(108,92,231,0.8)'; ctx.lineWidth = 2.2;
          ctx.beginPath(); ctx.moveTo(from.x, from.y);
          ctx.lineTo(from.x + (to.x - from.x) * gP, from.y + (to.y - from.y) * gP); ctx.stroke();
          // 边标签（中点垂直偏移，避开另一条边）
          const labP = easeOutCubic(win(sec, t0 + 0.3, t0 + 0.6));
          if (labP > 0) {
            ctx.save(); ctx.globalAlpha = labP;
            ctx.fillStyle = '#8a83b8'; ctx.font = '11px sans-serif';
            const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
            ctx.fillText(c.edge, mx + (i === 0 ? -14 : 14), my + (i === 0 ? -6 : 12));
            ctx.restore();
          }
        });

        // 父节点
        drawNode(parentPos, 30, '#6c5ce7',
          `+${parent.pos} −${parent.neg}`, `H=${H_parent.toFixed(3)}`,
          easeOutBack(win(sec, 0.2, 0.75)), cur === 1);
        const pLabP = easeOutCubic(win(sec, 0.3, 0.7));
        if (pLabP > 0) {
          ctx.save(); ctx.globalAlpha = pLabP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('父节点（8 样本）', parentPos.x, parentPos.y - 44);
          ctx.restore();
        }

        // 子节点
        children.forEach((c, i) => {
          drawNode(childPos[i], 26, c.color,
            `+${c.pos} −${c.neg}`, `H=${H_child[i].toFixed(3)}`,
            easeOutBack(win(sec, tChild + i * 0.3, tChild + 0.55 + i * 0.3)), cur === 3);
          const cLabP = easeOutCubic(win(sec, tChild + i * 0.3 + 0.2, tChild + i * 0.3 + 0.55));
          if (cLabP > 0) {
            ctx.save(); ctx.globalAlpha = cLabP;
            ctx.fillStyle = c.color; ctx.font = 'bold 12px sans-serif';
            ctx.fillText(c.label, childPos[i].x, childPos[i].y - 38);
            ctx.restore();
          }
        });

        // 右侧计算面板（逐行揭示，IG 行高亮，定格保留）
        const panelP = easeOutCubic(win(sec, tCalc, tCalc + 0.4));
        if (panelP > 0) {
          ctx.save(); ctx.globalAlpha = panelP;
          glassPanel(ctx, panelX, panelY, panelW, panelH, 14, 0.62);
          calcLines.forEach((ln, li) => {
            const lnP = easeOutCubic(win(sec, tCalc + 0.25 + li * 0.38, tCalc + 0.55 + li * 0.38));
            if (lnP <= 0) return;
            ctx.save(); ctx.globalAlpha = lnP;
            // IG 行高亮条
            if (ln.key) {
              const pulse = 0.75 + 0.25 * Math.sin(sec * 4);
              ctx.fillStyle = `rgba(108,92,231,${0.12 * pulse})`;
              roundRect(ctx, panelX + 8, panelY + 22 + li * 23 - 10, panelW - 16, 20, 6); ctx.fill();
            }
            ctx.fillStyle = ln.color; ctx.font = ln.font; ctx.textAlign = 'left';
            ctx.fillText(ln.t, panelX + 14, panelY + 22 + li * 23);
            ctx.restore();
          });
          ctx.restore();
          ctx.textAlign = 'center';
        }
      });
      if (!ok) return;
      setStatus(`信息增益 IG = ${H_parent.toFixed(3)} − ${weightedH.toFixed(3)} = ${IG.toFixed(3)} bit：选择使熵减少最多的特征分裂`, 'ok');
    },
  });

  // —— 内置 canvas 模板 34：基尼不纯度（G=1-Σp²）——
  registerCanvas('gini-impurity', {
    title: TEMPLATE_TITLES['gini-impurity'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      // 三个对比场景（与原模板一致的数据）
      const scenarios = [
        { name: '场景 1：完全纯净', counts: [8, 0], g: 0, formula: 'G = 1 − 1² = 0', tag: '最纯' },
        { name: '场景 2：二类各半', counts: [4, 4], g: 0.5, formula: 'G = 1 − 2×0.5² = 0.50', tag: '' },
        { name: '场景 3：四类均匀', counts: [4, 4, 4, 4], g: 0.75, formula: 'G = 1 − 4×0.25² = 0.75', tag: '最乱' },
      ];
      const maxCount = 8;

      // 布局（安全区内）：顶部标题 + 三场景面板并排 + 底部结论
      const titleY = 90, summaryY = H - 68;
      const gap = 14;
      const panelW = (W - 88 - gap * 2) / 3;
      const panelTop = 106, panelBot = Math.max(summaryY - 16, panelTop + 150);
      const panelH = panelBot - panelTop;

      // 时间轴（秒）：面板依次弹入 → 柱生长 → G 计数上升 → 底部结论
      const T0 = 0.45, T_SC = 1.85;
      const TOTAL = T0 + 3 * T_SC + 1.2; // 7.2s

      let stage = -1;
      const stageNames = [
        '基尼不纯度 Gini：衡量数据集的混乱程度，CART 决策树用它选择分裂特征',
        '场景 1 完全纯净 [8,0]：G = 0，纯度最高',
        '场景 2 二类各半 [4,4]：G = 0.5',
        '场景 3 四类均匀 [4,4,4,4]：G = 0.75，混乱度最高',
        '对比结论：分布越均匀 G 越大；CART 选择使 G 最小的特征分裂',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段判定
        let cur = 0;
        if (sec >= T0 + 3 * T_SC) cur = 4;
        else if (sec >= T0) cur = 1 + Math.min(2, Math.floor((sec - T0) / T_SC));
        if (cur !== stage) { stage = cur; setStatus(stageNames[cur]); }

        // 顶部标题
        const headP = easeOutCubic(win(sec, 0, 0.4));
        if (headP > 0) {
          ctx.save(); ctx.globalAlpha = headP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText('基尼不纯度 Gini：三种分布对比', W / 2, titleY);
          ctx.restore();
        }

        // 场景面板
        scenarios.forEach((sc, si) => {
          const t0 = T0 + si * T_SC;
          const popP = easeOutBack(win(sec, t0, t0 + 0.5));
          if (popP <= 0) return;
          const px = 44 + si * (panelW + gap);
          const cxp = px + panelW / 2, cyp = (panelTop + panelBot) / 2;
          const isCur = cur === si + 1;
          const baseY = panelBot - 64;
          const barMaxH = baseY - (panelTop + 32);
          const n = sc.counts.length;
          const bw = Math.min(26, (panelW - 36) / n * 0.55);
          const s = Math.max(0, popP);
          ctx.save();
          ctx.translate(cxp, cyp); ctx.scale(s, s); ctx.translate(-cxp, -cyp);

          // 毛玻璃面板
          glassPanel(ctx, px, panelTop, panelW, panelH, 12, 0.62);
          ctx.strokeStyle = isCur ? '#6c5ce7' : 'rgba(148,163,208,0.7)';
          ctx.lineWidth = isCur ? 2.6 : 1.8;
          roundRect(ctx, px, panelTop, panelW, panelH, 12); ctx.stroke();

          // 面板标题
          ctx.fillStyle = '#4a4570'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(sc.name, cxp, panelTop + 16);

          // 基线
          const span = bw * 1.7 * n;
          ctx.strokeStyle = 'rgba(148,163,208,0.8)'; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(cxp - span / 2 - 10, baseY); ctx.lineTo(cxp + span / 2 + 10, baseY); ctx.stroke();

          // 柱子（依次生长，空类画虚线占位）
          sc.counts.forEach((c, i) => {
            const growP = easeOutCubic(win(sec, t0 + 0.35 + i * 0.1, t0 + 0.95 + i * 0.1));
            if (growP <= 0) return;
            const bx = cxp + (i - (n - 1) / 2) * bw * 1.7;
            const h = (c / maxCount) * barMaxH * growP;
            const color = GLASS_COLORS[i % GLASS_COLORS.length];
            if (c > 0) {
              ctx.save(); ctx.globalAlpha = 0.85;
              ctx.fillStyle = color;
              ctx.fillRect(bx - bw / 2, baseY - h, bw, h);
              ctx.restore();
              ctx.strokeStyle = color; ctx.lineWidth = 1.8;
              ctx.strokeRect(bx - bw / 2, baseY - h, bw, h);
              ctx.fillStyle = '#4a4570'; ctx.font = 'bold 12px sans-serif';
              ctx.fillText(String(c), bx, baseY - h - 9);
            } else {
              ctx.strokeStyle = 'rgba(148,163,208,0.8)'; ctx.lineWidth = 1.6;
              ctx.setLineDash([3, 3]);
              ctx.strokeRect(bx - bw / 2, baseY - 6, bw, 6);
              ctx.setLineDash([]);
              ctx.fillStyle = '#8a83b8'; ctx.font = 'bold 12px sans-serif';
              ctx.fillText('0', bx, baseY - 15);
            }
            ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif';
            ctx.fillText('类' + (i + 1), bx, baseY + 12);
          });

          // G 值（计数上升）+ 公式
          const gP = easeOutCubic(win(sec, t0 + 0.85, t0 + 1.55));
          if (gP > 0) {
            const gv = sc.g * gP;
            ctx.fillStyle = sc.g === 0 ? '#8ec5e0' : '#6c5ce7';
            ctx.font = 'bold 15px sans-serif';
            ctx.fillText(`G = ${gv.toFixed(2)}${sc.tag && gP >= 1 ? '（' + sc.tag + '）' : ''}`, cxp, panelBot - 42);
            ctx.fillStyle = '#8a83b8'; ctx.font = '11px sans-serif';
            ctx.fillText(sc.formula, cxp, panelBot - 22);
          }
          ctx.restore();
        });

        // 底部结论（定格保留）
        const capP = easeOutCubic(win(sec, T0 + 3 * T_SC, T0 + 3 * T_SC + 0.5));
        if (capP > 0) {
          ctx.save(); ctx.globalAlpha = capP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('纯净时 G=0，类别越多越均匀 G 越大 → CART 决策树选使 G 最小的特征分裂', W / 2, summaryY);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('基尼不纯度衡量混乱度：纯净时 G=0，CART 决策树用它选择分裂特征', 'ok');
    },
  });

  // —— 内置 canvas 模板 35：人机交互技术总述（交互方式演进时间轴）——
  registerCanvas('interaction-overview', {
    title: TEMPLATE_TITLES['interaction-overview'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      // 交互方式演进（与原模板一致）
      const steps = [
        { era: '1960s前', name: '手写/打孔', desc: '命令行前时代' },
        { era: '1960s末', name: '键盘命令行', desc: 'CLI 交互' },
        { era: '1970s', name: '鼠标GUI', desc: 'WIMP 图形界面' },
        { era: '2007', name: '触摸多点', desc: '智能手机时代' },
        { era: '2011', name: '语音助手', desc: 'Siri 等问世' },
        { era: '2015', name: '手势体感', desc: 'Kinect/Leap' },
        { era: '2020s', name: '脑机接口', desc: 'Neuralink 探索' },
      ];
      const n = steps.length;
      const startX = 60, endX = W - 60;
      const gapX = (endX - startX) / (n - 1);
      const axisY = Math.min(Math.max(H * 0.52, 168), H - 120);
      const titleY = 90, summaryY = H - 68;

      // 时间轴（秒）：轴线生长 → 节点依次弹入 → 结论定格
      const T0 = 0.45, T_ND = 0.85;
      const TOTAL = T0 + n * T_ND + 1.15; // ≈7.55s

      let stage = -1;
      const stageNames = [
        '人机交互方式演进：从打孔卡片到脑机接口',
        ...steps.map(s => `${s.era}：${s.name}（${s.desc}）`),
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        // 内容容器玻璃面板
        glassPanel(ctx, 28, topSafe - 8, W - 56, botSafe - topSafe + 24, 16, 0.55);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段判定
        let cur = 0;
        if (sec >= T0) cur = 1 + Math.min(n - 1, Math.floor((sec - T0) / T_ND));
        if (cur !== stage) { stage = cur; setStatus(stageNames[cur]); }

        // 顶部标题
        const headP = easeOutCubic(win(sec, 0, 0.4));
        if (headP > 0) {
          ctx.save(); ctx.globalAlpha = headP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText('人机交互方式演进时间轴', W / 2, titleY);
          ctx.restore();
        }

        // 轴线（随节点进度生长，末端箭头）
        const axisP = easeOutCubic(win(sec, 0.15, T0 + (n - 1) * T_ND + 0.3));
        if (axisP > 0) {
          ctx.strokeStyle = 'rgba(108,92,231,0.55)'; ctx.lineWidth = 2.4;
          ctx.beginPath(); ctx.moveTo(startX, axisY);
          ctx.lineTo(startX + (endX - startX) * axisP, axisY); ctx.stroke();
          if (axisP >= 1) {
            ctx.fillStyle = 'rgba(108,92,231,0.85)';
            ctx.beginPath(); ctx.moveTo(endX + 11, axisY); ctx.lineTo(endX + 1, axisY - 5.5); ctx.lineTo(endX + 1, axisY + 5.5); ctx.closePath(); ctx.fill();
          }
        }

        // 节点 + 名称/年代标签
        steps.forEach((s, i) => {
          const t0 = T0 + i * T_ND;
          const popP = easeOutBack(win(sec, t0, t0 + 0.45));
          if (popP <= 0) return;
          const x = startX + gapX * i;
          const isCur = cur === i + 1;
          const R = isCur ? 17 : 15;
          const color = GLASS_COLORS[i % GLASS_COLORS.length];
          ctx.save();
          ctx.translate(x, axisY); ctx.scale(Math.max(0, popP), Math.max(0, popP));
          ctx.shadowColor = 'rgba(124,99,224,0.35)'; ctx.shadowBlur = 9;
          ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2);
          ctx.fillStyle = isCur ? color : '#fff'; ctx.fill();
          ctx.strokeStyle = color; ctx.lineWidth = isCur ? 3 : 2.2; ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = isCur ? 'rgba(255,255,255,0.9)' : 'rgba(190,200,240,0.6)';
          ctx.beginPath(); ctx.arc(-R * 0.3, -R * 0.3, R * 0.24, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          // 标签（已弹入节点常驻）
          const labP = easeOutCubic(win(sec, t0 + 0.15, t0 + 0.5));
          if (labP > 0) {
            ctx.save(); ctx.globalAlpha = labP;
            ctx.fillStyle = isCur ? '#6c5ce7' : '#4a4570'; ctx.font = 'bold 12px sans-serif';
            ctx.fillText(s.name, x, axisY - 34);
            ctx.fillStyle = '#8a83b8'; ctx.font = '11px sans-serif';
            ctx.fillText(s.era, x, axisY - 51);
            ctx.restore();
          }
        });

        // 当前节点描述（轴线下方）
        if (cur >= 1) {
          const t0 = T0 + (cur - 1) * T_ND;
          const dP = easeOutCubic(win(sec, t0 + 0.25, t0 + 0.6));
          if (dP > 0) {
            ctx.save(); ctx.globalAlpha = dP;
            ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
            ctx.fillText(steps[cur - 1].desc, startX + gapX * (cur - 1), axisY + 34);
            ctx.restore();
          }
        }

        // 底部结论（定格保留）
        const capP = easeOutCubic(win(sec, T0 + n * T_ND, T0 + n * T_ND + 0.5));
        if (capP > 0) {
          ctx.save(); ctx.globalAlpha = capP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('从命令行到脑机：交互方式越来越自然、直观、无形', W / 2, summaryY);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('人机交互演进：让机器更懂人，交互越来越自然', 'ok');
    },
  });

  // —— 内置 canvas 模板 36：语音交互四环节（采集→识别→理解→反馈）——
  registerCanvas('voice-pipeline', {
    title: TEMPLATE_TITLES['voice-pipeline'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      // 语音交互四环节（与原模板一致）
      const stages = [
        { name: '语音采集', io: '声波 → 音频信号', detail: '麦克风采集模拟信号并数字化', icon: 'mic' },
        { name: 'ASR 识别', io: '音频 → 文字', detail: '自动语音识别转写为文本', icon: 'asr' },
        { name: 'NLU 理解', io: '文字 → 意图', detail: '自然语言理解抽取意图与槽位', icon: 'nlu' },
        { name: '反馈生成', io: '意图 → 回复', detail: '对话管理 + TTS 合成语音回复', icon: 'tts' },
      ];
      const n = stages.length;
      const blockW = (W - 88) / n;
      const bw = Math.min(blockW - 16, 118), bh = 112;
      const cy = Math.min(Math.max(H * 0.44, 100 + bh / 2), H - 62 - 44 - bh / 2);
      const titleY = 90, summaryY = H - 68;

      // 环节小图标
      const drawIcon = (type, cx2, cy2, color) => {
        ctx.save();
        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1.8;
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        if (type === 'mic') {
          roundRect(ctx, cx2 - 5, cy2 - 14, 10, 16, 5); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx2, cy2 + 2, 9, Math.PI * 0.12, Math.PI * 0.88); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2, cy2 + 11); ctx.lineTo(cx2, cy2 + 15); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2 - 6, cy2 + 15); ctx.lineTo(cx2 + 6, cy2 + 15); ctx.stroke();
        } else if (type === 'asr') {
          const hb = [6, 12, 18, 12, 6];
          hb.forEach((h, k) => {
            ctx.beginPath(); ctx.moveTo(cx2 - 11 + k * 5.5, cy2 - h / 2 - 4); ctx.lineTo(cx2 - 11 + k * 5.5, cy2 + h / 2 - 4); ctx.stroke();
          });
          ctx.beginPath(); ctx.moveTo(cx2 - 13, cy2 + 10); ctx.lineTo(cx2 + 13, cy2 + 10); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2 - 13, cy2 + 15); ctx.lineTo(cx2 + 4, cy2 + 15); ctx.stroke();
        } else if (type === 'nlu') {
          ctx.beginPath();
          ctx.moveTo(cx2, cy2 - 14); ctx.lineTo(cx2 + 12, cy2); ctx.lineTo(cx2, cy2 + 14); ctx.lineTo(cx2 - 12, cy2); ctx.closePath(); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2 - 5, cy2); ctx.lineTo(cx2 - 1, cy2 + 4); ctx.lineTo(cx2 + 6, cy2 - 5); ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(cx2 - 14, cy2 - 4); ctx.lineTo(cx2 - 9, cy2 - 4); ctx.lineTo(cx2 - 3, cy2 - 10);
          ctx.lineTo(cx2 - 3, cy2 + 10); ctx.lineTo(cx2 - 9, cy2 + 4); ctx.lineTo(cx2 - 14, cy2 + 4); ctx.closePath(); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx2 + 1, cy2, 6, -Math.PI / 3, Math.PI / 3); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx2 + 1, cy2, 11, -Math.PI / 3.2, Math.PI / 3.2); ctx.stroke();
        }
        ctx.restore();
      };

      // 时间轴（秒）：逐环节弹入 + 信号流过，最后闭环回路
      const T0 = 0.45, T_ST = 1.4;
      const tLoop = T0 + n * T_ST;
      const TOTAL = tLoop + 1.35; // ≈7.4s

      let stage = -1;
      const stageNames = [
        '语音交互四环节：声波 → 文字 → 意图 → 回复',
        ...stages.map((s, i) => `环节 ${i + 1}/4 ${s.name}：${s.io} — ${s.detail}`),
        '反馈生成后回到用户：四环节形成完整闭环',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段判定
        let cur = 0;
        if (sec >= tLoop) cur = n + 1;
        else if (sec >= T0) cur = 1 + Math.min(n - 1, Math.floor((sec - T0) / T_ST));
        if (cur !== stage) { stage = cur; setStatus(stageNames[cur]); }

        // 顶部标题
        const headP = easeOutCubic(win(sec, 0, 0.4));
        if (headP > 0) {
          ctx.save(); ctx.globalAlpha = headP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText('语音交互四环节流水线', W / 2, titleY);
          ctx.restore();
        }

        // 环节间箭头（当前传播高亮 + 流动光点）
        for (let i = 0; i < n - 1; i++) {
          const t0 = T0 + i * T_ST;
          if (sec < t0 + 0.35) continue;
          const x1 = 44 + i * blockW + blockW / 2 + bw / 2;
          const x2 = 44 + (i + 1) * blockW + blockW / 2 - bw / 2;
          const flow = easeOutCubic(win(sec, t0 + 0.4, t0 + T_ST * 0.92));
          const isAct = sec >= t0 + 0.35 && flow < 1;
          ctx.strokeStyle = isAct ? 'rgba(108,92,231,0.9)' : 'rgba(148,163,208,0.55)';
          ctx.lineWidth = isAct ? 2.6 : 1.8;
          const gp = isAct ? flow : 1;
          ctx.beginPath(); ctx.moveTo(x1, cy); ctx.lineTo(x1 + (x2 - x1) * gp, cy); ctx.stroke();
          if (gp > 0.6) {
            const ax = x1 + (x2 - x1) * gp;
            ctx.fillStyle = isAct ? '#6c5ce7' : 'rgba(148,163,208,0.8)';
            ctx.beginPath(); ctx.moveTo(ax + 3, cy); ctx.lineTo(ax - 5, cy - 4.5); ctx.lineTo(ax - 5, cy + 4.5); ctx.closePath(); ctx.fill();
          }
          if (isAct && flow > 0 && flow < 1) {
            ctx.fillStyle = '#6c5ce7';
            ctx.beginPath(); ctx.arc(x1 + (x2 - x1) * flow, cy, 4.5, 0, Math.PI * 2); ctx.fill();
          }
        }

        // 环节方块（毛玻璃 + 彩色描边，easeOutBack 弹入，定格保留）
        stages.forEach((s, i) => {
          const t0 = T0 + i * T_ST;
          const popP = easeOutBack(win(sec, t0, t0 + 0.5));
          if (popP <= 0) return;
          const cx2 = 44 + i * blockW + blockW / 2;
          const isCur = cur === i + 1;
          const color = GLASS_COLORS[i % GLASS_COLORS.length];
          ctx.save();
          ctx.translate(cx2, cy); ctx.scale(Math.max(0, popP), Math.max(0, popP));
          glassPanel(ctx, -bw / 2, -bh / 2, bw, bh, 12, 0.62);
          ctx.strokeStyle = isCur ? '#6c5ce7' : color; ctx.lineWidth = isCur ? 2.6 : 2;
          roundRect(ctx, -bw / 2, -bh / 2, bw, bh, 12); ctx.stroke();
          drawIcon(s.icon, 0, -26, color);
          ctx.fillStyle = '#4a4570'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(s.name, 0, 2);
          ctx.fillStyle = color; ctx.font = 'bold 12px sans-serif';
          ctx.fillText(s.io, 0, 20);
          ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif';
          wrapText(ctx, s.detail, 0, 36, bw - 12, 13);
          ctx.restore();
        });

        // 底部闭环回路（最后一环节回到第一环节）
        const loopP = easeOutCubic(win(sec, tLoop, tLoop + 0.8));
        if (loopP > 0) {
          const x1 = 44 + (n - 1) * blockW + blockW / 2;
          const x2 = 44 + blockW / 2;
          const y0 = cy + bh / 2 + 6, sagY = cy + bh / 2 + 30;
          const midX = (x1 + x2) / 2;
          ctx.strokeStyle = 'rgba(108,92,231,0.75)'; ctx.lineWidth = 2.2;
          ctx.beginPath();
          const Q = 48, kMax = Math.max(1, Math.floor(Q * loopP));
          for (let k = 0; k <= kMax; k++) {
            const t = k / Q;
            const qx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
            const qy = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * sagY + t * t * y0;
            if (k === 0) ctx.moveTo(qx, qy); else ctx.lineTo(qx, qy);
          }
          ctx.stroke();
          if (loopP >= 1) {
            ctx.fillStyle = 'rgba(108,92,231,0.85)';
            ctx.beginPath(); ctx.moveTo(x2, y0 - 8); ctx.lineTo(x2 - 5, y0 + 3); ctx.lineTo(x2 + 5, y0 + 3); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#8a83b8'; ctx.font = '11px sans-serif';
            ctx.fillText('闭环反馈', midX, sagY + 13);
          }
        }

        // 底部结论（定格保留）
        const capP = easeOutCubic(win(sec, tLoop + 0.5, tLoop + 1.0));
        if (capP > 0) {
          ctx.save(); ctx.globalAlpha = capP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('语音助手 = 采集 + ASR + NLU + 反馈，四环节闭环', W / 2, summaryY);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('语音交互四环节：声波→文字→意图→回复，闭环完成', 'ok');
    },
  });

  // —— 内置 canvas 模板 37：多元新型交互方式（手势/眼动/脑机/VR/AR）——
  registerCanvas('multimodal-interaction', {
    title: TEMPLATE_TITLES['multimodal-interaction'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      // 多元新型交互方式（与原模板一致）
      const modes = [
        { name: '手势识别', tech: '摄像头 + 深度传感', use: 'Kinect/Leap/手语翻译', icon: 'hand' },
        { name: '眼动追踪', tech: '红外摄像头注视点', use: '残障辅助/广告分析', icon: 'eye' },
        { name: '脑机接口', tech: 'EEG 电极信号', use: 'Neuralink/意念控制', icon: 'brain' },
        { name: 'VR 虚拟现实', tech: '头显 + 空间定位', use: '游戏/训练/仿真', icon: 'vr' },
        { name: 'AR 增强现实', tech: '叠加虚拟到现实', use: '导航/工业维修', icon: 'ar' },
      ];
      const n = modes.length;
      const blockW = (W - 88) / n;
      const bw = Math.min(blockW - 12, 118), bh = 140;
      const cy = Math.min(Math.max(H * 0.45, 100 + bh / 2), H - 62 - 40 - bh / 2);
      const titleY = 90, summaryY = H - 68;

      // 小图标
      const drawIcon = (type, cx2, cy2, color) => {
        ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1.6;
        if (type === 'hand') {
          roundRect(ctx, cx2 - 10, cy2 - 18, 20, 26, 4); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2 - 3, cy2 + 10); ctx.lineTo(cx2 - 3, cy2 + 20); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2 + 3, cy2 + 10); ctx.lineTo(cx2 + 3, cy2 + 20); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2 - 5, cy2 + 20); ctx.lineTo(cx2 + 5, cy2 + 20); ctx.stroke();
        } else if (type === 'eye') {
          ctx.beginPath(); ctx.ellipse(cx2, cy2, 16, 10, 0, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx2, cy2, 4, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx2, cy2 - 8, 2, 0, Math.PI * 2); ctx.fill();
        } else if (type === 'brain') {
          ctx.beginPath(); ctx.arc(cx2, cy2, 15, 0, Math.PI * 2); ctx.stroke();
          for (let i = 0; i < 3; i++) {
            ctx.beginPath(); ctx.arc(cx2 - 6 + i * 6, cy2 - 6 + i * 3, 3, 0, Math.PI * 2); ctx.stroke();
          }
        } else if (type === 'vr') {
          roundRect(ctx, cx2 - 16, cy2 - 8, 32, 18, 5); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2 - 2, cy2 + 10); ctx.lineTo(cx2 - 2, cy2 + 16); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2 + 2, cy2 + 10); ctx.lineTo(cx2 + 2, cy2 + 16); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2 - 14, cy2 + 16); ctx.lineTo(cx2 + 14, cy2 + 16); ctx.stroke();
        } else {
          roundRect(ctx, cx2 - 14, cy2 - 10, 28, 20, 4); ctx.stroke();
          ctx.strokeStyle = color; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(cx2 - 6, cy2 - 6); ctx.lineTo(cx2 + 6, cy2 + 6); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2 + 6, cy2 - 6); ctx.lineTo(cx2 - 6, cy2 + 6); ctx.stroke();
        }
        ctx.restore();
      };

      // 时间轴（秒）
      const T0 = 0.45, T_ST = 1.25;
      const TOTAL = T0 + n * T_ST + 0.9; // ≈7.1s

      let stage = -1;
      const stageNames = [
        '多元新型交互：突破键鼠限制，走向多模态自然交互',
        ...modes.map(m => `${m.name} — 技术：${m.tech}；用途：${m.use}`),
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let cur = 0;
        if (sec >= T0) cur = 1 + Math.min(n - 1, Math.floor((sec - T0) / T_ST));
        if (cur !== stage) { stage = cur; setStatus(stageNames[cur]); }

        // 顶部标题
        const headP = easeOutCubic(win(sec, 0, 0.4));
        if (headP > 0) {
          ctx.save(); ctx.globalAlpha = headP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText('多元新型交互方式', W / 2, titleY);
          ctx.restore();
        }

        // 卡片
        modes.forEach((m, i) => {
          const t0 = T0 + i * T_ST;
          const popP = easeOutBack(win(sec, t0, t0 + 0.5));
          if (popP <= 0) return;
          const cx2 = 44 + i * blockW + blockW / 2;
          const isCur = cur === i + 1;
          const color = GLASS_COLORS[i % GLASS_COLORS.length];
          ctx.save();
          ctx.translate(cx2, cy); ctx.scale(Math.max(0, popP), Math.max(0, popP));
          glassPanel(ctx, -bw / 2, -bh / 2, bw, bh, 12, 0.6);
          ctx.strokeStyle = isCur ? '#6c5ce7' : color; ctx.lineWidth = isCur ? 2.6 : 2;
          roundRect(ctx, -bw / 2, -bh / 2, bw, bh, 12); ctx.stroke();
          drawIcon(m.icon, 0, -42, color);
          ctx.fillStyle = '#4a4570'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(m.name, 0, -14);
          ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif';
          wrapText(ctx, m.tech, 0, 6, bw - 14, 13);
          ctx.fillStyle = color; ctx.font = 'bold 11px sans-serif';
          wrapText(ctx, '用途：' + m.use, 0, 32, bw - 14, 13);
          ctx.restore();
        });

        // 底部结论（定格保留）
        const capP = easeOutCubic(win(sec, T0 + n * T_ST, T0 + n * T_ST + 0.5));
        if (capP > 0) {
          ctx.save(); ctx.globalAlpha = capP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('多元交互让人类用更自然的方式（手势/眼/脑/身）与机器沟通', W / 2, summaryY);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('多元新型交互：突破键鼠限制，走向多模态自然交互', 'ok');
    },
  });

  // —— 内置 canvas 模板 38：图像识别（预处理→特征→分类→标签）——
  registerCanvas('image-recognition', {
    title: TEMPLATE_TITLES['image-recognition'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      // 图像识别流水线（与原模板一致）
      const stages = [
        { name: '图像输入', io: '原始像素', detail: 'RGB 矩阵 H×W×3', icon: 'input' },
        { name: '预处理', io: '归一化/去噪', detail: '缩放/灰度/直方图均衡', icon: 'prep' },
        { name: '特征提取', io: '边缘/纹理/形状', detail: 'SIFT/HOG 或 CNN 卷积', icon: 'feat' },
        { name: '分类判别', io: '特征→类别', detail: 'SVM/Softmax 分类器', icon: 'cls' },
        { name: '输出标签', io: '类别+置信度', detail: '"猫" 0.97', icon: 'tag' },
      ];
      const n = stages.length;
      const blockW = (W - 88) / n;
      const bw = Math.min(blockW - 8, 104), bh = 112;
      const cy = Math.min(Math.max(H * 0.46, 100 + bh / 2), H - 62 - 30 - bh / 2);
      const titleY = 90, summaryY = H - 68;

      // 阶段小图标
      const drawIcon = (type, cx2, cy2, color) => {
        ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1.6;
        if (type === 'input') {
          for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
            ctx.globalAlpha = 0.4 + ((r * 3 + c) % 3) * 0.25;
            ctx.fillRect(cx2 - 14 + c * 10, cy2 - 14 + r * 10, 7, 7);
          }
        } else if (type === 'prep') {
          for (let k = 0; k < 3; k++) {
            const yy = cy2 - 9 + k * 9;
            ctx.globalAlpha = 0.9;
            ctx.beginPath(); ctx.moveTo(cx2 - 14, yy); ctx.lineTo(cx2 + 14, yy); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx2 - 7 + k * 7, yy, 3, 0, Math.PI * 2); ctx.fill();
          }
        } else if (type === 'feat') {
          ctx.globalAlpha = 0.9;
          ctx.strokeRect(cx2 - 13, cy2 - 12, 18, 18);
          ctx.beginPath(); ctx.moveTo(cx2 - 13, cy2 + 6); ctx.lineTo(cx2 - 2, cy2 - 6); ctx.lineTo(cx2 + 5, cy2 + 2); ctx.stroke();
          ctx.globalAlpha = 0.45; ctx.fillRect(cx2 - 4, cy2 - 3, 18, 18);
          ctx.globalAlpha = 0.9; ctx.strokeRect(cx2 - 4, cy2 - 3, 18, 18);
        } else if (type === 'cls') {
          const hs = [8, 14, 20];
          hs.forEach((h, k) => {
            ctx.globalAlpha = 0.5 + k * 0.2;
            ctx.fillRect(cx2 - 13 + k * 10, cy2 + 12 - h, 6.5, h);
          });
          ctx.globalAlpha = 0.9; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(cx2 - 16, cy2 + 12); ctx.lineTo(cx2 + 16, cy2 + 12); ctx.stroke();
        } else {
          // 标签
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.moveTo(cx2 - 17, cy2 - 8); ctx.lineTo(cx2 + 8, cy2 - 8); ctx.lineTo(cx2 + 17, cy2);
          ctx.lineTo(cx2 + 8, cy2 + 8); ctx.lineTo(cx2 - 17, cy2 + 8); ctx.closePath(); ctx.stroke();
          ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('猫', cx2 - 5, cy2 + 0.5);
        }
        ctx.restore();
      };

      // 时间轴（秒）：逐阶段弹入 + 信号流过
      const T0 = 0.45, T_ST = 1.32;
      const TOTAL = T0 + n * T_ST + 0.9; // ≈7.95s

      let stage = -1;
      const stageNames = [
        '图像识别流水线：像素 → 特征 → 分类 → 标签',
        ...stages.map((s, i) => `阶段 ${i + 1}/5 ${s.name}：${s.io} — ${s.detail}`),
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let cur = 0;
        if (sec >= T0) cur = 1 + Math.min(n - 1, Math.floor((sec - T0) / T_ST));
        if (cur !== stage) { stage = cur; setStatus(stageNames[cur]); }

        // 顶部标题
        const headP = easeOutCubic(win(sec, 0, 0.4));
        if (headP > 0) {
          ctx.save(); ctx.globalAlpha = headP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText('图像识别流水线', W / 2, titleY);
          ctx.restore();
        }

        // 阶段间箭头（当前传播高亮 + 流动光点）
        for (let i = 0; i < n - 1; i++) {
          const t0 = T0 + i * T_ST;
          if (sec < t0 + 0.35) continue;
          const x1 = 44 + i * blockW + blockW / 2 + bw / 2;
          const x2 = 44 + (i + 1) * blockW + blockW / 2 - bw / 2;
          const flow = easeOutCubic(win(sec, t0 + 0.4, t0 + T_ST * 0.92));
          const isAct = sec >= t0 + 0.35 && flow < 1;
          ctx.strokeStyle = isAct ? 'rgba(108,92,231,0.9)' : 'rgba(148,163,208,0.55)';
          ctx.lineWidth = isAct ? 2.4 : 1.6;
          const gp = isAct ? flow : 1;
          ctx.beginPath(); ctx.moveTo(x1, cy); ctx.lineTo(x1 + (x2 - x1) * gp, cy); ctx.stroke();
          if (gp > 0.6) {
            const ax = x1 + (x2 - x1) * gp;
            ctx.fillStyle = isAct ? '#6c5ce7' : 'rgba(148,163,208,0.8)';
            ctx.beginPath(); ctx.moveTo(ax + 3, cy); ctx.lineTo(ax - 5, cy - 4.5); ctx.lineTo(ax - 5, cy + 4.5); ctx.closePath(); ctx.fill();
          }
          if (isAct && flow > 0 && flow < 1) {
            ctx.fillStyle = '#6c5ce7';
            ctx.beginPath(); ctx.arc(x1 + (x2 - x1) * flow, cy, 4, 0, Math.PI * 2); ctx.fill();
          }
        }

        // 阶段方块（毛玻璃 + 彩色描边，easeOutBack 弹入，定格保留）
        stages.forEach((s, i) => {
          const t0 = T0 + i * T_ST;
          const popP = easeOutBack(win(sec, t0, t0 + 0.5));
          if (popP <= 0) return;
          const cx2 = 44 + i * blockW + blockW / 2;
          const isCur = cur === i + 1;
          const color = GLASS_COLORS[i % GLASS_COLORS.length];
          ctx.save();
          ctx.translate(cx2, cy); ctx.scale(Math.max(0, popP), Math.max(0, popP));
          glassPanel(ctx, -bw / 2, -bh / 2, bw, bh, 12, 0.62);
          ctx.strokeStyle = isCur ? '#6c5ce7' : color; ctx.lineWidth = isCur ? 2.6 : 2;
          roundRect(ctx, -bw / 2, -bh / 2, bw, bh, 12); ctx.stroke();
          drawIcon(s.icon, 0, -28, color);
          ctx.fillStyle = '#4a4570'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(s.name, 0, -2);
          ctx.fillStyle = color; ctx.font = 'bold 11px sans-serif';
          ctx.fillText(s.io, 0, 16);
          ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif';
          wrapText(ctx, s.detail, 0, 32, bw - 10, 13);
          ctx.restore();
        });

        // 底部结论（定格保留）
        const capP = easeOutCubic(win(sec, T0 + n * T_ST, T0 + n * T_ST + 0.5));
        if (capP > 0) {
          ctx.save(); ctx.globalAlpha = capP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('图像识别：让机器"看懂"图片内容，输出语义标签', W / 2, summaryY);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('图像识别：像素→特征→分类→标签，机器视觉核心流程', 'ok');
    },
  });

  // —— 内置 canvas 模板 39：生物特征识别（指纹/人脸/虹膜/声纹/静脉）——
  registerCanvas('biometric-types', {
    title: TEMPLATE_TITLES['biometric-types'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      // 生物特征识别方式（与原模板一致）
      const types = [
        { name: '指纹识别', feat: '纹路端点/分叉点', use: '手机解锁/考勤', icon: 'finger' },
        { name: '人脸识别', feat: '五官几何+深度图', use: '支付/门禁', icon: 'face' },
        { name: '虹膜识别', feat: '虹膜纹理斑点', use: '高安全场景', icon: 'iris' },
        { name: '声纹识别', feat: '声道频率特征', use: '电话银行', icon: 'voice' },
        { name: '静脉识别', feat: '皮下血管红外图', use: '活体检测', icon: 'vein' },
      ];
      const n = types.length;
      const blockW = (W - 88) / n;
      const bw = Math.min(blockW - 10, 110), bh = 136;
      const cy = Math.min(Math.max(H * 0.46, 100 + bh / 2), H - 62 - 30 - bh / 2);
      const titleY = 90, summaryY = H - 68;

      // 小图标
      const drawIcon = (type, cx2, cy2, color) => {
        ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1.6;
        if (type === 'finger') {
          for (let k = 0; k < 4; k++) {
            ctx.beginPath(); ctx.arc(cx2 - 6 + k * 4, cy2 - 4, 3, 0, Math.PI * 2); ctx.stroke();
          }
          ctx.beginPath(); ctx.moveTo(cx2 - 8, cy2 + 10); ctx.lineTo(cx2 + 8, cy2 + 10); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2, cy2 - 14); ctx.lineTo(cx2, cy2 + 6); ctx.stroke();
        } else if (type === 'face') {
          ctx.beginPath(); ctx.arc(cx2, cy2, 14, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx2 - 4, cy2 - 4, 1.5, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx2 + 4, cy2 - 4, 1.5, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.moveTo(cx2 - 4, cy2 + 4); ctx.quadraticCurveTo(cx2, cy2 + 8, cx2 + 4, cy2 + 4); ctx.stroke();
        } else if (type === 'iris') {
          ctx.beginPath(); ctx.arc(cx2, cy2, 12, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx2, cy2, 5, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx2, cy2, 1.5, 0, Math.PI * 2); ctx.fill();
        } else if (type === 'voice') {
          const hb = [5, 10, 16, 10, 5];
          hb.forEach((h, k) => {
            ctx.beginPath(); ctx.moveTo(cx2 - 11 + k * 5.5, cy2 - h / 2 - 4); ctx.lineTo(cx2 - 11 + k * 5.5, cy2 + h / 2 - 4); ctx.stroke();
          });
        } else {
          // 静脉（简化为线条网络）
          ctx.beginPath(); ctx.arc(cx2, cy2, 12, 0, Math.PI * 2); ctx.stroke();
          ctx.globalAlpha = 0.55;
          for (let k = 0; k < 3; k++) {
            ctx.beginPath(); ctx.moveTo(cx2 - 8, cy2 - 8 + k * 8); ctx.bezierCurveTo(cx2 - 2, cy2 - 12 + k * 8, cx2 + 2, cy2 - 4 + k * 8, cx2 + 8, cy2 - 8 + k * 8); ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }
        ctx.restore();
      };

      // 时间轴（秒）
      const T0 = 0.45, T_ST = 1.25;
      const TOTAL = T0 + n * T_ST + 0.9; // ≈7.1s

      let stage = -1;
      const stageNames = [
        '生物特征识别：用身体"钥匙"做身份认证',
        ...types.map(t => `${t.name} — 特征：${t.feat}；用途：${t.use}`),
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let cur = 0;
        if (sec >= T0) cur = 1 + Math.min(n - 1, Math.floor((sec - T0) / T_ST));
        if (cur !== stage) { stage = cur; setStatus(stageNames[cur]); }

        // 顶部标题
        const headP = easeOutCubic(win(sec, 0, 0.4));
        if (headP > 0) {
          ctx.save(); ctx.globalAlpha = headP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText('生物特征识别方式', W / 2, titleY);
          ctx.restore();
        }

        // 卡片
        types.forEach((t, i) => {
          const t0 = T0 + i * T_ST;
          const popP = easeOutBack(win(sec, t0, t0 + 0.5));
          if (popP <= 0) return;
          const cx2 = 44 + i * blockW + blockW / 2;
          const isCur = cur === i + 1;
          const color = GLASS_COLORS[i % GLASS_COLORS.length];
          ctx.save();
          ctx.translate(cx2, cy); ctx.scale(Math.max(0, popP), Math.max(0, popP));
          glassPanel(ctx, -bw / 2, -bh / 2, bw, bh, 12, 0.6);
          ctx.strokeStyle = isCur ? '#6c5ce7' : color; ctx.lineWidth = isCur ? 2.6 : 2;
          roundRect(ctx, -bw / 2, -bh / 2, bw, bh, 12); ctx.stroke();
          drawIcon(t.icon, 0, -38, color);
          ctx.fillStyle = '#4a4570'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(t.name, 0, -14);
          ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif';
          wrapText(ctx, '特征：' + t.feat, 0, 6, bw - 12, 13);
          ctx.fillStyle = color; ctx.font = 'bold 11px sans-serif';
          wrapText(ctx, '用途：' + t.use, 0, 30, bw - 12, 13);
          ctx.restore();
        });

        // 底部结论（定格保留）
        const capP = easeOutCubic(win(sec, T0 + n * T_ST, T0 + n * T_ST + 0.5));
        if (capP > 0) {
          ctx.save(); ctx.globalAlpha = capP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('生物特征：唯一性+稳定性，身份认证更安全便捷', W / 2, summaryY);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('生物特征识别：用身体"钥匙"做身份认证', 'ok');
    },
  });

  // —— 内置 canvas 模板 40：自然语言处理（分词→词性→句法→语义→生成）——
  registerCanvas('nlp-pipeline', {
    title: TEMPLATE_TITLES['nlp-pipeline'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      // NLP 五阶段（与原模板一致）
      const stages = [
        { name: '分词', out: '我/喜欢/人工智能', detail: '切分词元 Tokenization', icon: 'tok' },
        { name: '词性标注', out: '代/动/名', detail: '标注每个词词性 POS', icon: 'pos' },
        { name: '句法分析', out: '主谓宾结构', detail: '依存/成分树 Syntax', icon: 'syn' },
        { name: '语义理解', out: '意图=偏好', detail: '抽取意图与实体 NLU', icon: 'sem' },
        { name: '文本生成', out: '回复文本', detail: 'NLG 生成自然回复', icon: 'gen' },
      ];
      const n = stages.length;
      const sample = '我喜欢人工智能';
      const blockW = (W - 88) / n;
      const bw = Math.min(blockW - 8, 104), bh = 112;
      const cy = Math.min(Math.max(H * 0.46, 100 + bh / 2), H - 62 - 30 - bh / 2);
      const titleY = 90, summaryY = H - 68;

      // 阶段小图标
      const drawIcon = (type, cx2, cy2, color) => {
        ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1.6;
        if (type === 'tok') {
          const ws = [10, 14, 18];
          let x0 = cx2 - (ws[0] + ws[1] + ws[2] + 8) / 2;
          ws.forEach(w => {
            roundRect(ctx, x0, cy2 - 8, w, 16, 4); ctx.stroke();
            x0 += w + 4;
          });
        } else if (type === 'pos') {
          ctx.beginPath();
          ctx.moveTo(cx2 - 14, cy2 - 9); ctx.lineTo(cx2 + 5, cy2 - 9); ctx.lineTo(cx2 + 14, cy2);
          ctx.lineTo(cx2 + 5, cy2 + 9); ctx.lineTo(cx2 - 14, cy2 + 9); ctx.closePath(); ctx.stroke();
          ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('词', cx2 - 3, cy2 + 0.5);
        } else if (type === 'syn') {
          ctx.beginPath(); ctx.arc(cx2, cy2 - 11, 3.5, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx2 - 9, cy2 + 8, 3.5, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx2 + 9, cy2 + 8, 3.5, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2 - 2, cy2 - 8); ctx.lineTo(cx2 - 7, cy2 + 5); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2 + 2, cy2 - 8); ctx.lineTo(cx2 + 7, cy2 + 5); ctx.stroke();
        } else if (type === 'sem') {
          ctx.beginPath();
          ctx.moveTo(cx2, cy2 - 13); ctx.lineTo(cx2 + 11, cy2); ctx.lineTo(cx2, cy2 + 13); ctx.lineTo(cx2 - 11, cy2); ctx.closePath(); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx2, cy2, 3, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.beginPath(); ctx.moveTo(cx2 - 13, cy2 - 7); ctx.lineTo(cx2 + 13, cy2 - 7); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2 - 13, cy2); ctx.lineTo(cx2 + 13, cy2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2 - 13, cy2 + 7); ctx.lineTo(cx2 + 2, cy2 + 7); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2 + 6, cy2 + 4); ctx.lineTo(cx2 + 13, cy2 + 11); ctx.stroke();
        }
        ctx.restore();
      };

      // 时间轴（秒）：逐阶段弹入 + 信号流过
      const T0 = 0.45, T_ST = 1.32;
      const TOTAL = T0 + n * T_ST + 0.9; // ≈7.95s

      let stage = -1;
      const stageNames = [
        `自然语言处理流水线（示例："${sample}"）`,
        ...stages.map((s, i) => `阶段 ${i + 1}/5 ${s.name} — 输出：${s.out}（${s.detail}）`),
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let cur = 0;
        if (sec >= T0) cur = 1 + Math.min(n - 1, Math.floor((sec - T0) / T_ST));
        if (cur !== stage) { stage = cur; setStatus(stageNames[cur]); }

        // 顶部标题
        const headP = easeOutCubic(win(sec, 0, 0.4));
        if (headP > 0) {
          ctx.save(); ctx.globalAlpha = headP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText(`自然语言处理流水线（示例："${sample}"）`, W / 2, titleY);
          ctx.restore();
        }

        // 阶段间箭头
        for (let i = 0; i < n - 1; i++) {
          const t0 = T0 + i * T_ST;
          if (sec < t0 + 0.35) continue;
          const x1 = 44 + i * blockW + blockW / 2 + bw / 2;
          const x2 = 44 + (i + 1) * blockW + blockW / 2 - bw / 2;
          const flow = easeOutCubic(win(sec, t0 + 0.4, t0 + T_ST * 0.92));
          const isAct = sec >= t0 + 0.35 && flow < 1;
          ctx.strokeStyle = isAct ? 'rgba(108,92,231,0.9)' : 'rgba(148,163,208,0.55)';
          ctx.lineWidth = isAct ? 2.4 : 1.6;
          const gp = isAct ? flow : 1;
          ctx.beginPath(); ctx.moveTo(x1, cy); ctx.lineTo(x1 + (x2 - x1) * gp, cy); ctx.stroke();
          if (gp > 0.6) {
            const ax = x1 + (x2 - x1) * gp;
            ctx.fillStyle = isAct ? '#6c5ce7' : 'rgba(148,163,208,0.8)';
            ctx.beginPath(); ctx.moveTo(ax + 3, cy); ctx.lineTo(ax - 5, cy - 4.5); ctx.lineTo(ax - 5, cy + 4.5); ctx.closePath(); ctx.fill();
          }
          if (isAct && flow > 0 && flow < 1) {
            ctx.fillStyle = '#6c5ce7';
            ctx.beginPath(); ctx.arc(x1 + (x2 - x1) * flow, cy, 4, 0, Math.PI * 2); ctx.fill();
          }
        }

        // 阶段方块
        stages.forEach((s, i) => {
          const t0 = T0 + i * T_ST;
          const popP = easeOutBack(win(sec, t0, t0 + 0.5));
          if (popP <= 0) return;
          const cx2 = 44 + i * blockW + blockW / 2;
          const isCur = cur === i + 1;
          const color = GLASS_COLORS[i % GLASS_COLORS.length];
          ctx.save();
          ctx.translate(cx2, cy); ctx.scale(Math.max(0, popP), Math.max(0, popP));
          glassPanel(ctx, -bw / 2, -bh / 2, bw, bh, 12, 0.62);
          ctx.strokeStyle = isCur ? '#6c5ce7' : color; ctx.lineWidth = isCur ? 2.6 : 2;
          roundRect(ctx, -bw / 2, -bh / 2, bw, bh, 12); ctx.stroke();
          drawIcon(s.icon, 0, -30, color);
          ctx.fillStyle = '#4a4570'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(s.name, 0, -4);
          ctx.fillStyle = color; ctx.font = 'bold 11px sans-serif';
          wrapText(ctx, s.out, 0, 12, bw - 10, 12);
          ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif';
          wrapText(ctx, s.detail, 0, 34, bw - 10, 12);
          ctx.restore();
        });

        // 底部结论（定格保留）
        const capP = easeOutCubic(win(sec, T0 + n * T_ST, T0 + n * T_ST + 0.5));
        if (capP > 0) {
          ctx.save(); ctx.globalAlpha = capP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('NLP：让机器理解与生成人类语言，从词到句到篇章', W / 2, summaryY);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('自然语言处理：分词→词性→句法→语义→生成', 'ok');
    },
  });

  // —— 内置 canvas 模板 41：机器学习三大类（监督/无监督/强化学习）——
  registerCanvas('ml-categories', {
    title: TEMPLATE_TITLES['ml-categories'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      // 机器学习三大类（与原模板一致）
      const cats = [
        { name: '监督学习', data: '有标签数据', algos: ['分类', '回归'], ex: '手写数字识别', icon: 'sup' },
        { name: '无监督学习', data: '无标签数据', algos: ['聚类', '降维'], ex: '用户分群', icon: 'unsup' },
        { name: '强化学习', data: '奖励信号', algos: ['策略梯度', 'Q学习'], ex: 'AlphaGo 下棋', icon: 'rl' },
      ];
      const n = cats.length;
      const gap = 18;
      const colW = (W - 88 - gap * (n - 1)) / n;
      const rootY = 104, rootW = 128, rootH = 32;
      const cardTop = 140, summaryY = H - 68;
      const cardBot = Math.max(summaryY - 14, cardTop + 120), cardH = cardBot - cardTop;

      // 类别小图标
      const drawIcon = (type, cx2, cy2, color) => {
        ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1.6;
        if (type === 'sup') {
          ctx.beginPath();
          ctx.moveTo(cx2 - 10, cy2 - 7); ctx.lineTo(cx2 + 3, cy2 - 7); ctx.lineTo(cx2 + 10, cy2);
          ctx.lineTo(cx2 + 3, cy2 + 7); ctx.lineTo(cx2 - 10, cy2 + 7); ctx.closePath(); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2 - 4, cy2); ctx.lineTo(cx2 - 1, cy2 + 3); ctx.lineTo(cx2 + 4, cy2 - 3); ctx.stroke();
        } else if (type === 'unsup') {
          [[-6, -4], [-3, -7], [-8, 1]].forEach(d => {
            ctx.beginPath(); ctx.arc(cx2 + d[0], cy2 + d[1], 2.4, 0, Math.PI * 2); ctx.fill();
          });
          [[6, 4], [3, 7], [8, -1]].forEach(d => {
            ctx.beginPath(); ctx.arc(cx2 + d[0], cy2 + d[1], 2.4, 0, Math.PI * 2); ctx.stroke();
          });
        } else {
          ctx.beginPath(); ctx.arc(cx2, cy2, 9, Math.PI * 0.35, Math.PI * 1.95); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx2 + 8.6, cy2 - 4.5); ctx.lineTo(cx2 + 11.5, cy2 + 3); ctx.lineTo(cx2 + 3.5, cy2 + 2); ctx.closePath(); ctx.fill();
          ctx.beginPath(); ctx.arc(cx2, cy2, 2.4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      };

      // 时间轴（秒）：根节点 → 连线生长 → 卡片依次弹入 → 结论
      const T0 = 0.45, T_LINE = 0.55, T_CD = 1.45;
      const tCard0 = T0 + T_LINE;
      const TOTAL = tCard0 + n * T_CD + 0.95; // ≈7.3s

      let stage = -1;
      const stageNames = [
        '机器学习三大类：按数据信号划分（标签 / 无标签 / 奖励）',
        ...cats.map(c => `${c.name} — 数据：${c.data}；算法：${c.algos.join('、')}；示例：${c.ex}`),
        '对比总结：监督学标签映射，无监督找数据结构，强化学习最大化奖励',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let cur = 0;
        if (sec >= tCard0 + n * T_CD) cur = n + 1;
        else if (sec >= tCard0) cur = 1 + Math.min(n - 1, Math.floor((sec - tCard0) / T_CD));
        if (cur !== stage) { stage = cur; setStatus(stageNames[cur]); }

        // 根节点（机器学习）
        const rootP = easeOutBack(win(sec, 0.05, 0.5));
        if (rootP > 0) {
          ctx.save();
          ctx.translate(W / 2, rootY); ctx.scale(Math.max(0, rootP), Math.max(0, rootP));
          ctx.shadowColor = 'rgba(124,99,224,0.35)'; ctx.shadowBlur = 10;
          glassPanel(ctx, -rootW / 2, -rootH / 2, rootW, rootH, 16, 0.75);
          ctx.strokeStyle = '#6c5ce7'; ctx.lineWidth = 2.2;
          roundRect(ctx, -rootW / 2, -rootH / 2, rootW, rootH, 16); ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 15px sans-serif';
          ctx.fillText('机器学习', 0, 1);
          ctx.restore();
        }

        // 根 → 卡片连线（依次生长）
        cats.forEach((c, i) => {
          const x1 = W / 2, y1 = rootY + rootH / 2;
          const x2 = 44 + i * (colW + gap) + colW / 2, y2 = cardTop;
          const gP = easeOutCubic(win(sec, T0 + i * 0.15, T0 + T_LINE + i * 0.15));
          if (gP <= 0) return;
          ctx.strokeStyle = 'rgba(108,92,231,0.6)'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x1, y1);
          ctx.lineTo(x1 + (x2 - x1) * gP, y1 + (y2 - y1) * gP); ctx.stroke();
        });

        // 类别卡片
        cats.forEach((c, i) => {
          const t0 = tCard0 + i * T_CD;
          const popP = easeOutBack(win(sec, t0, t0 + 0.5));
          if (popP <= 0) return;
          const x = 44 + i * (colW + gap);
          const cx2 = x + colW / 2;
          const isCur = cur === i + 1;
          const color = GLASS_COLORS[i % GLASS_COLORS.length];
          ctx.save();
          ctx.translate(cx2, (cardTop + cardBot) / 2);
          ctx.scale(Math.max(0, popP), Math.max(0, popP));
          ctx.translate(-cx2, -(cardTop + cardBot) / 2);
          glassPanel(ctx, x, cardTop, colW, cardH, 14, 0.62);
          ctx.strokeStyle = isCur ? '#6c5ce7' : color; ctx.lineWidth = isCur ? 2.8 : 2;
          roundRect(ctx, x, cardTop, colW, cardH, 14); ctx.stroke();
          // 图标圆
          ctx.beginPath(); ctx.arc(cx2, cardTop + 22, 15, 0, Math.PI * 2);
          ctx.fillStyle = '#fff'; ctx.fill();
          ctx.strokeStyle = color; ctx.lineWidth = 2.2; ctx.stroke();
          drawIcon(c.icon, cx2, cardTop + 22, color);
          // 文本
          ctx.fillStyle = '#4a4570'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText(c.name, cx2, cardTop + 48);
          ctx.fillStyle = '#6e6890'; ctx.font = '12px sans-serif';
          ctx.fillText('数据：' + c.data, cx2, cardTop + 68);
          ctx.fillStyle = color; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('算法：' + c.algos.join('、'), cx2, cardTop + 86);
          ctx.fillStyle = '#8a83b8'; ctx.font = '12px sans-serif';
          wrapText(ctx, '示例：' + c.ex, cx2, cardTop + 104, colW - 18, 14);
          ctx.restore();
        });

        // 底部结论（定格保留）
        const capP = easeOutCubic(win(sec, tCard0 + n * T_CD, tCard0 + n * T_CD + 0.5));
        if (capP > 0) {
          ctx.save(); ctx.globalAlpha = capP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('按是否有标签/奖励，机器学习分监督 / 无监督 / 强化三大类', W / 2, summaryY);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('机器学习三大类：监督/无监督/强化，按数据信号划分', 'ok');
    },
  });

  // —— 内置 canvas 模板 42：AI⊃ML⊃DL 三层包含关系 ——
  registerCanvas('ai-ml-dl', {
    title: TEMPLATE_TITLES['ai-ml-dl'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const cx = (leftSafe + rightSafe) / 2, cy = (topSafe + botSafe) / 2;
      const availR = Math.min((rightSafe - leftSafe) / 2, (botSafe - topSafe) / 2);
      const layers = [
        { name: 'AI', full: '人工智能', rx: availR * 0.94, ry: availR * 0.94, color: GLASS_COLORS[0], desc: '让机器具备智能的最广范畴' },
        { name: 'ML', full: '机器学习', rx: availR * 0.66, ry: availR * 0.66, color: GLASS_COLORS[4], desc: '从数据中学习规律' },
        { name: 'DL', full: '深度学习', rx: availR * 0.34, ry: availR * 0.34, color: GLASS_COLORS[2], desc: '多层神经网络' },
      ];
      const stageNames = [
        `AI（人工智能）：${layers[0].desc}`,
        `ML（机器学习）：${layers[1].desc}`,
        `DL（深度学习）：${layers[2].desc}`,
        'DL ⊂ ML ⊂ AI：深度学习是机器学习子集，机器学习是 AI 子集',
      ];
      const TOTAL = 7.0;
      let stage = -1;
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        // 内容容器玻璃面板
        glassPanel(ctx, 28, topSafe - 8, W - 56, botSafe - topSafe + 24, 16, 0.55);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        let curStage = 0;
        if (sec > 1.5) curStage = 1;
        if (sec > 3.0) curStage = 2;
        if (sec > 4.5) curStage = 3;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }
        // 由外到内画椭圆
        for (let i = 0; i < layers.length; i++) {
          const L = layers[i];
          const popP = easeOutBack(win(sec, 0.2 + i * 0.5, 0.9 + i * 0.5));
          if (popP <= 0) continue;
          const s = Math.max(0.01, popP);
          ctx.save();
          ctx.translate(cx, cy); ctx.scale(s, s);
          ctx.shadowColor = L.color + '55'; ctx.shadowBlur = 14;
          ctx.fillStyle = L.color + '22';
          ctx.strokeStyle = L.color; ctx.lineWidth = 2.2;
          ctx.beginPath(); ctx.ellipse(0, 0, L.rx, L.ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.restore();
        }
        // 标签
        const aiTagP = easeOutBack(win(sec, 0.7, 1.3));
        if (aiTagP > 0) {
          ctx.save(); ctx.globalAlpha = aiTagP;
          ctx.fillStyle = GLASS_COLORS[0]; ctx.font = 'bold 14px sans-serif';
          ctx.fillText('AI  人工智能', cx + layers[0].rx * 0.6, cy - layers[0].ry * 0.8);
          ctx.restore();
        }
        const mlTagP = easeOutBack(win(sec, 1.7, 2.3));
        if (mlTagP > 0) {
          ctx.save(); ctx.globalAlpha = mlTagP;
          ctx.fillStyle = GLASS_COLORS[4]; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('ML  机器学习', cx + layers[1].rx * 0.6, cy - layers[1].ry * 0.62);
          ctx.restore();
        }
        const dlTagP = easeOutBack(win(sec, 3.2, 3.8));
        if (dlTagP > 0) {
          ctx.save(); ctx.globalAlpha = dlTagP;
          ctx.fillStyle = GLASS_COLORS[2]; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('DL 深度学习', cx, cy);
          ctx.restore();
        }
        // 底部结论
        const sumP = easeOutCubic(win(sec, 4.8, 5.6));
        if (sumP > 0) {
          ctx.save(); ctx.globalAlpha = sumP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('DL ⊂ ML ⊂ AI：深度学习是机器学习子集，机器学习是 AI 子集', W / 2, botSafe - 10);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 43：单层感知机结构（输入层→输出层，无隐藏层）——
  registerCanvas('single-layer-perceptron', {
    title: TEMPLATE_TITLES['single-layer-perceptron'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const inputs = [
        { name: 'x1', val: 0.6 }, { name: 'x2', val: 0.9 }, { name: 'x3', val: 0.3 }, { name: 'x4', val: 0.8 },
      ];
      const weights = [0.5, -0.7, 0.4, 0.6];
      const bias = 0.1;
      const contrib = inputs.map((inp, i) => inp.val * weights[i]);
      const z = contrib.reduce((s, c) => s + c, 0) + bias;
      const y = z > 0 ? 1 : 0;
      const xIn = leftSafe + (rightSafe - leftSafe) * 0.22;
      const xOut = leftSafe + (rightSafe - leftSafe) * 0.80;
      const r = 17;
      const yTop = topSafe + 40, yBot = botSafe - 40;
      const inputYs = inputs.map((_, i) => yTop + i * (yBot - yTop) / (inputs.length - 1));
      const outY = (topSafe + botSafe) / 2;

      const T_IN = 1.2;
      const T_CONN = 0.6;
      const T_SUM = 1.0;
      const T_STEP = 1.0;
      const TOTAL = T_IN + inputs.length * T_CONN + T_SUM + T_STEP + 1.0;

      const stageNames = [
        '单层感知机：输入层 → 输出层（无隐藏层）',
        `输入 x=[${inputs.map(i => i.val).join(',')}]，权重 w=[${weights.join(',')}]，偏置 b=${bias}`,
        ...contrib.map((c, i) => `${inputs[i].name}·w${i + 1} = ${inputs[i].val}×${weights[i]} = ${c.toFixed(2)}`),
        `加权求和：z = Σwᵢxᵢ + b = ${z.toFixed(2)}`,
        `阶跃激活：z>0 → y = ${y}`,
        '单层感知机 = 一层权重的线性分类器，只能解决线性可分问题',
      ];
      let stage = -1;
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段
        let curStage = 0;
        if (sec > T_IN) curStage = 1;
        for (let i = 0; i < inputs.length; i++) {
          if (sec > T_IN + i * T_CONN) curStage = 2 + i;
        }
        if (sec > T_IN + inputs.length * T_CONN) curStage = 2 + inputs.length;
        if (sec > T_IN + inputs.length * T_CONN + T_SUM) curStage = 3 + inputs.length;
        if (sec > T_IN + inputs.length * T_CONN + T_SUM + T_STEP) curStage = 4 + inputs.length;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        const sumDone = sec > T_IN + inputs.length * T_CONN + T_SUM;
        const stepDone = sec > T_IN + inputs.length * T_CONN + T_SUM + T_STEP;

        // 连接线
        for (let i = 0; i < inputs.length; i++) {
          const connStart = T_IN + i * T_CONN;
          const active = sec > connStart && sec <= connStart + T_CONN;
          const connP = easeOutCubic(win(sec, connStart - 0.2, connStart + 0.3));
          const alpha = 0.25 + connP * 0.65;
          const wLine = active ? 2.4 : 1.6;
          ctx.strokeStyle = active ? `rgba(108,92,231,${alpha})` : `rgba(165,176,216,${alpha})`;
          ctx.lineWidth = wLine;
          ctx.beginPath(); ctx.moveTo(xIn + r, inputYs[i]); ctx.lineTo(xOut - r, outY); ctx.stroke();
          // 权重标签
          if (connP > 0.3) {
            ctx.save(); ctx.globalAlpha = clamp01((connP - 0.3) / 0.4);
            ctx.fillStyle = active ? '#6c5ce7' : '#6e6890';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText(`w${i + 1}=${weights[i]}`, (xIn + xOut) / 2, (inputYs[i] + outY) / 2 - 7);
            ctx.restore();
          }
          // 流动点
          if (active) {
            const fp = (sec - connStart) / T_CONN;
            const fx = xIn + r + (xOut - r - xIn - r) * fp;
            const fy = inputYs[i] + (outY - inputYs[i]) * fp;
            ctx.fillStyle = '#6c5ce7';
            ctx.beginPath(); ctx.arc(fx, fy, 4, 0, Math.PI * 2); ctx.fill();
          }
        }

        // 输入节点
        for (let i = 0; i < inputs.length; i++) {
          const popP = easeOutBack(win(sec, 0.1 + i * 0.12, 0.55 + i * 0.12));
          if (popP <= 0) continue;
          const s = Math.max(0, popP);
          const connStart = T_IN + i * T_CONN;
          const lit = sec > connStart;
          ctx.save();
          ctx.translate(xIn, inputYs[i]); ctx.scale(s, s);
          ctx.shadowColor = 'rgba(122,167,240,0.4)'; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fillStyle = lit ? GLASS_COLORS[0] : '#fff';
          ctx.strokeStyle = GLASS_COLORS[0]; ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.beginPath(); ctx.arc(-4, -4, r * 0.28, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = lit ? '#fff' : GLASS_COLORS[0];
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(inputs[i].name, 0, -1);
          ctx.fillStyle = lit ? '#e8f0ff' : '#7a6fa8';
          ctx.font = '11px sans-serif';
          ctx.fillText(inputs[i].val.toFixed(1), 0, r + 12);
          ctx.restore();
        }

        // 输出节点
        const outPop = easeOutBack(win(sec, 0.6, 1.1));
        if (outPop > 0) {
          const s = Math.max(0, outPop);
          ctx.save();
          ctx.translate(xOut, outY); ctx.scale(s, s);
          ctx.shadowColor = 'rgba(165,134,232,0.5)'; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.arc(0, 0, r + 2, 0, Math.PI * 2);
          ctx.fillStyle = stepDone ? GLASS_COLORS[4] : (sumDone ? GLASS_COLORS[2] : '#fff');
          ctx.strokeStyle = GLASS_COLORS[4]; ctx.lineWidth = 2.2; ctx.fill(); ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.beginPath(); ctx.arc(-4, -4, (r + 2) * 0.28, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = stepDone || sumDone ? '#fff' : GLASS_COLORS[4];
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText(stepDone ? `y=${y}` : 'y', 0, 0);
          ctx.restore();
        }

        // 层标签
        ctx.fillStyle = '#6e6890'; ctx.font = '13px sans-serif';
        ctx.fillText('输入层', xIn, topSafe + 12);
        ctx.fillText('输出层', xOut, topSafe + 12);

        // 底部公式卡
        const fP = easeOutCubic(win(sec, T_IN + inputs.length * T_CONN, T_IN + inputs.length * T_CONN + 0.6));
        if (fP > 0) {
          const cw = Math.min(W - 88, 360), ch = 38;
          const cx = (W - cw) / 2, cy = botSafe - ch - 6;
          ctx.save(); ctx.globalAlpha = fP;
          glassPanel(ctx, cx, cy, cw, ch, 10, 0.62);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px monospace';
          ctx.fillText(`z = Σwᵢxᵢ + b = ${z.toFixed(2)}   →   y = step(z) = ${y}`, W / 2, cy + ch / 2);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 44：深度网络（多隐藏层堆叠）——
  registerCanvas('deep-network', {
    title: TEMPLATE_TITLES['deep-network'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const layers = [
        { name: '输入层', n: 4, isInput: true },
        { name: '隐藏层1', n: 5 },
        { name: '隐藏层2', n: 5 },
        { name: '隐藏层3', n: 4 },
        { name: '输出层', n: 2, isOutput: true },
      ];
      const R = 15;
      const colX = layers.map((_, li) => leftSafe + (rightSafe - leftSafe) * li / (layers.length - 1));
      const yTop = topSafe + 44, yBot = botSafe - 20;
      const nodePos = layers.map(L => {
        const n = L.n;
        return Array.from({ length: n }, (_, i) => ({
          y: yTop + (n === 1 ? (yBot - yTop) / 2 : i * (yBot - yTop) / (n - 1)),
        }));
      });

      const T_LAYER = 0.9;
      const TOTAL = 1.0 + layers.length * T_LAYER + 1.0;
      const stageNames = [
        '深度神经网络：多隐藏层堆叠',
        ...layers.map((L, i) => `${L.name}：${L.n} 个神经元${L.isInput ? '（原始特征输入）' : L.isOutput ? '（最终预测输出）' : '（抽象特征变换）'}`),
        '多层堆叠 = "深度"，每层提取更抽象特征，这是"深度学习"的由来',
      ];
      let stage = -1;
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = 0;
        for (let i = 0; i < layers.length; i++) {
          if (sec > 1.0 + i * T_LAYER) curStage = i + 1;
        }
        if (sec > 1.0 + layers.length * T_LAYER) curStage = layers.length + 1;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 连接线
        for (let li = 0; li < layers.length - 1; li++) {
          const lit = sec > 1.0 + (li + 1) * T_LAYER;
          const flowP = lit ? 1 : easeOutCubic(win(sec, 1.0 + li * T_LAYER, 1.0 + (li + 1) * T_LAYER));
          for (let a = 0; a < layers[li].n; a++) {
            for (let b = 0; b < layers[li + 1].n; b++) {
              const from = { x: colX[li], y: nodePos[li][a].y };
              const to = { x: colX[li + 1], y: nodePos[li + 1][b].y };
              ctx.strokeStyle = lit ? `rgba(108,92,231,0.55)` : `rgba(165,176,216,${0.2 + flowP * 0.3})`;
              ctx.lineWidth = lit ? 1.4 : 1;
              ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke();
            }
          }
        }

        // 节点
        layers.forEach((L, li) => {
          const popP = easeOutBack(win(sec, 0.2 + li * 0.25, 0.8 + li * 0.25));
          if (popP <= 0) return;
          const s = Math.max(0, popP);
          const lit = sec > 1.0 + li * T_LAYER;
          const color = L.isInput ? GLASS_COLORS[0] : L.isOutput ? GLASS_COLORS[2] : GLASS_COLORS[4];
          nodePos[li].forEach((np, ni) => {
            ctx.save();
            ctx.translate(colX[li], np.y); ctx.scale(s, s);
            ctx.shadowColor = color + '66'; ctx.shadowBlur = lit ? 10 : 5;
            ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2);
            ctx.fillStyle = lit ? color : '#fff';
            ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.beginPath(); ctx.arc(-4, -4, R * 0.28, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
          });
          // 层标签
          const labP = clamp01(popP);
          if (labP > 0) {
            ctx.save(); ctx.globalAlpha = labP;
            ctx.fillStyle = lit ? '#6c5ce7' : '#6e6890';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText(L.name, colX[li], topSafe + 16);
            ctx.fillStyle = '#7a6fa8'; ctx.font = '11px sans-serif';
            ctx.fillText(`${L.n} 个`, colX[li], topSafe + 32);
            ctx.restore();
          }
        });

        // 底部结论
        const sumP = easeOutCubic(win(sec, 1.0 + layers.length * T_LAYER, 1.0 + layers.length * T_LAYER + 0.8));
        if (sumP > 0) {
          ctx.save(); ctx.globalAlpha = sumP;
          glassPanel(ctx, 44, botSafe - 30, W - 88, 24, 8, 0.6);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('多层堆叠 = "深度"，每层提取更抽象特征，这是"深度学习"的由来', W / 2, botSafe - 18);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 45：层次化特征（边缘→纹理→部件→对象）——
  registerCanvas('hierarchical-features', {
    title: TEMPLATE_TITLES['hierarchical-features'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const levels = [
        { name: 'L1 像素/边缘', feat: '线条、梯度', ex: '直线/拐角', color: GLASS_COLORS[3] },
        { name: 'L2 纹理', feat: '局部模式', ex: '网格/斑点', color: GLASS_COLORS[0] },
        { name: 'L3 部件', feat: '部件组合', ex: '眼睛/车轮', color: GLASS_COLORS[4] },
        { name: 'L4 对象', feat: '完整语义', ex: '人脸/汽车', color: GLASS_COLORS[2] },
      ];
      const n = levels.length;
      const gap = Math.min(18, (rightSafe - leftSafe) * 0.035);
      const boxW = ((rightSafe - leftSafe) - (n - 1) * gap) / n;
      const boxH = Math.min(botSafe - topSafe - 64, (botSafe - topSafe) * 0.62);
      const y = topSafe + 30;

      const T_BOX = 1.1;
      const TOTAL = 1.0 + n * T_BOX + 1.1;
      const stageNames = [
        '深度网络的层次化特征表示',
        ...levels.map((lv, i) => `第${i + 1}层：${lv.name} — ${lv.feat}（如 ${lv.ex}）`),
        '由低到高自动提取特征：从像素到对象，越深层越抽象',
      ];
      let stage = -1;
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = 0;
        for (let i = 0; i < n; i++) {
          if (sec > 1.0 + i * T_BOX) curStage = i + 1;
        }
        if (sec > 1.0 + n * T_BOX) curStage = n + 1;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        for (let i = 0; i < n; i++) {
          const x = leftSafe + i * (boxW + gap);
          const boxStart = 1.0 + i * T_BOX;
          const popP = easeOutBack(win(sec, boxStart - 0.3, boxStart + 0.4));
          if (popP <= 0) continue;
          const s = Math.max(0, popP);
          const lit = sec > boxStart;
          const lv = levels[i];
          ctx.save();
          ctx.translate(x + boxW / 2, y + boxH / 2); ctx.scale(s, s);
          ctx.shadowColor = lv.color + '55'; ctx.shadowBlur = lit ? 12 : 6;
          ctx.fillStyle = lit ? lv.color + '33' : 'rgba(255,255,255,0.72)';
          ctx.strokeStyle = lv.color; ctx.lineWidth = 2;
          roundRect(ctx, -boxW / 2, -boxH / 2, boxW, boxH, 10); ctx.fill(); ctx.stroke();
          ctx.shadowColor = 'transparent';
          // 内容
          ctx.fillStyle = lit ? lv.color : '#6c5ce7';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(lv.name, 0, -boxH / 2 + 22);
          ctx.fillStyle = lit ? '#4a3f80' : '#6e6890';
          ctx.font = '12px sans-serif';
          ctx.fillText('特征：' + lv.feat, 0, 2);
          ctx.fillStyle = lit ? lv.color : GLASS_COLORS[3];
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText('示例：' + lv.ex, 0, boxH / 2 - 22);
          ctx.restore();

          // 箭头到下一个
          if (i < n - 1) {
            const arrP = easeOutCubic(win(sec, boxStart + 0.3, boxStart + 0.7));
            if (arrP > 0) {
              ctx.save(); ctx.globalAlpha = arrP;
              const ax = x + boxW + 2, ay = y + boxH / 2;
              const ex = ax + gap - 4;
              ctx.strokeStyle = lit ? '#6c5ce7' : '#a5b0d8'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
              ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ex, ay); ctx.stroke();
              ctx.fillStyle = lit ? '#6c5ce7' : '#a5b0d8';
              ctx.beginPath(); ctx.moveTo(ex, ay); ctx.lineTo(ex - 7, ay - 5); ctx.lineTo(ex - 7, ay + 5); ctx.closePath(); ctx.fill();
              ctx.restore();
            }
          }
        }

        // 底部结论
        const sumP = easeOutCubic(win(sec, 1.0 + n * T_BOX, 1.0 + n * T_BOX + 0.8));
        if (sumP > 0) {
          ctx.save(); ctx.globalAlpha = sumP;
          glassPanel(ctx, 44, botSafe - 28, W - 88, 22, 8, 0.6);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('由低到高自动提取特征：从像素到对象，越深层越抽象', W / 2, botSafe - 17);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 46：深度学习三驾马车（数据+算法+算力）——
  registerCanvas('dl-triad', {
    title: TEMPLATE_TITLES['dl-triad'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const cx = (leftSafe + rightSafe) / 2, cy = (topSafe + botSafe) / 2 + 10;
      const R = Math.min((rightSafe - leftSafe) / 2, (botSafe - topSafe) / 2) * 0.72;
      const corners = [
        { name: '数据', desc: '大数据驱动', ex: 'ImageNet 千万级', x: cx, y: cy - R, color: GLASS_COLORS[0] },
        { name: '算法', desc: '深度网络模型', ex: 'CNN/RNN/Transformer', x: cx - R * 0.95, y: cy + R * 0.55, color: GLASS_COLORS[4] },
        { name: '算力', desc: 'GPU 并行', ex: 'NVIDIA/A100', x: cx + R * 0.95, y: cy + R * 0.55, color: GLASS_COLORS[2] },
      ];
      const T_CORNER = 1.5;
      const TOTAL = 1.0 + corners.length * T_CORNER + 1.5;
      const stageNames = [
        '深度学习三驾马车：数据 + 算法 + 算力',
        ...corners.map((c, i) => `支柱${i + 1}：${c.name} — ${c.desc}（如 ${c.ex}）`),
        '数据+算法+算力 缺一不可，共同驱动深度学习兴起',
      ];
      let stage = -1;
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = 0;
        for (let i = 0; i < corners.length; i++) {
          if (sec > 1.0 + i * T_CORNER) curStage = i + 1;
        }
        if (sec > 1.0 + corners.length * T_CORNER) curStage = corners.length + 1;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 三角形边
        const triP = easeOutCubic(win(sec, 0.2, 0.9));
        if (triP > 0) {
          ctx.save(); ctx.globalAlpha = triP;
          ctx.strokeStyle = 'rgba(108,92,231,0.4)'; ctx.lineWidth = 1.8; ctx.setLineDash([6, 5]);
          ctx.beginPath();
          corners.forEach((c, i) => { if (i === 0) ctx.moveTo(c.x, c.y); else ctx.lineTo(c.x, c.y); });
          ctx.closePath(); ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }

        // 中心圆
        const ctrP = easeOutBack(win(sec, 0.5, 1.1));
        if (ctrP > 0) {
          const s = Math.max(0, ctrP);
          ctx.save();
          ctx.translate(cx, cy); ctx.scale(s, s);
          ctx.shadowColor = 'rgba(142,197,224,0.5)'; ctx.shadowBlur = 12;
          ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI * 2);
          ctx.fillStyle = GLASS_COLORS[3] + '33';
          ctx.strokeStyle = GLASS_COLORS[3]; ctx.lineWidth = 2.2; ctx.fill(); ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = GLASS_COLORS[3]; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('深度', 0, -7);
          ctx.fillText('学习', 0, 9);
          ctx.restore();
        }

        // 三个顶点
        corners.forEach((c, i) => {
          const popP = easeOutBack(win(sec, 1.0 + i * T_CORNER - 0.2, 1.0 + i * T_CORNER + 0.5));
          if (popP <= 0) return;
          const s = Math.max(0, popP);
          const lit = sec > 1.0 + i * T_CORNER;
          ctx.save();
          ctx.translate(c.x, c.y); ctx.scale(s, s);
          ctx.shadowColor = c.color + '66'; ctx.shadowBlur = lit ? 14 : 7;
          ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2);
          ctx.fillStyle = lit ? c.color : '#fff';
          ctx.strokeStyle = c.color; ctx.lineWidth = 2.2; ctx.fill(); ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.beginPath(); ctx.arc(-5, -5, 5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = lit ? '#fff' : c.color;
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText(c.name, 0, 1);
          ctx.restore();
          // 描述文字（在节点外侧）
          if (lit) {
            const labelY = i === 0 ? c.y - 34 : c.y + 34;
            ctx.fillStyle = c.color; ctx.font = 'bold 12px sans-serif';
            ctx.fillText(c.desc, c.x, labelY);
            ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif';
            ctx.fillText(c.ex, c.x, labelY + (i === 0 ? -16 : 16));
          }
        });

        // 底部结论
        const sumP = easeOutCubic(win(sec, 1.0 + corners.length * T_CORNER, 1.0 + corners.length * T_CORNER + 0.8));
        if (sumP > 0) {
          ctx.save(); ctx.globalAlpha = sumP;
          glassPanel(ctx, 44, botSafe - 28, W - 88, 22, 8, 0.6);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('数据+算法+算力 缺一不可，共同驱动深度学习兴起', W / 2, botSafe - 17);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 47：常用数据集（MNIST/CIFAR/ImageNet/COCO）——
  registerCanvas('dataset-zoo', {
    title: TEMPLATE_TITLES['dataset-zoo'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const sets = [
        { name: 'MNIST', size: '7万张', cls: '10类', dim: '28×28 灰度', use: '手写数字识别', color: GLASS_COLORS[0] },
        { name: 'CIFAR-10', size: '6万张', cls: '10类', dim: '32×32 彩色', use: '图像分类入门', color: GLASS_COLORS[3] },
        { name: 'ImageNet', size: '1400万张', cls: '1000类', dim: '高分辨率', use: '大规模分类/预训练', color: GLASS_COLORS[4] },
        { name: 'COCO', size: '33万张', cls: '80类', dim: '复杂场景', use: '目标检测/分割', color: GLASS_COLORS[2] },
      ];
      const n = sets.length;
      const gap = Math.min(16, (rightSafe - leftSafe) * 0.03);
      const cardW = ((rightSafe - leftSafe) - (n - 1) * gap) / n;
      const cardH = Math.min(botSafe - topSafe - 50, (botSafe - topSafe) * 0.72);
      const y = topSafe + 18;

      const T_CARD = 1.1;
      const TOTAL = 1.0 + n * T_CARD + 1.1;
      const stageNames = [
        '深度学习常用公开数据集',
        ...sets.map(s => `${s.name}：${s.size}/${s.cls}，${s.dim} — 用途：${s.use}`),
        '公开数据集是深度学习的"燃料"，规模与质量决定模型上限',
      ];
      let stage = -1;
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = 0;
        for (let i = 0; i < n; i++) {
          if (sec > 1.0 + i * T_CARD) curStage = i + 1;
        }
        if (sec > 1.0 + n * T_CARD) curStage = n + 1;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        for (let i = 0; i < n; i++) {
          const x = leftSafe + i * (cardW + gap);
          const cardStart = 1.0 + i * T_CARD;
          const popP = easeOutBack(win(sec, cardStart - 0.3, cardStart + 0.4));
          if (popP <= 0) continue;
          const s = Math.max(0, popP);
          const lit = sec > cardStart;
          const st = sets[i];
          ctx.save();
          ctx.translate(x + cardW / 2, y + cardH / 2); ctx.scale(s, s);
          ctx.shadowColor = st.color + '55'; ctx.shadowBlur = lit ? 12 : 6;
          ctx.fillStyle = lit ? st.color + '22' : 'rgba(255,255,255,0.72)';
          ctx.strokeStyle = st.color; ctx.lineWidth = 2;
          roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 10); ctx.fill(); ctx.stroke();
          ctx.shadowColor = 'transparent';
          // 名称
          ctx.fillStyle = lit ? st.color : '#6c5ce7';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(st.name, 0, -cardH / 2 + 22);
          // 分隔线
          ctx.strokeStyle = st.color + '66'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(-cardW / 2 + 12, -cardH / 2 + 36); ctx.lineTo(cardW / 2 - 12, -cardH / 2 + 36); ctx.stroke();
          // 信息
          ctx.fillStyle = lit ? '#4a3f80' : '#6e6890';
          ctx.font = '11px sans-serif';
          ctx.fillText('规模：' + st.size, 0, -cardH / 2 + 56);
          ctx.fillText('类别：' + st.cls, 0, -cardH / 2 + 74);
          ctx.fillText('尺寸：' + st.dim, 0, -cardH / 2 + 92);
          // 用途
          ctx.fillStyle = lit ? st.color : GLASS_COLORS[3];
          ctx.font = 'bold 11px sans-serif';
          wrapText(ctx, st.use, 0, cardH / 2 - 26, cardW - 16, 13);
          ctx.restore();
        }

        // 底部结论
        const sumP = easeOutCubic(win(sec, 1.0 + n * T_CARD, 1.0 + n * T_CARD + 0.8));
        if (sumP > 0) {
          ctx.save(); ctx.globalAlpha = sumP;
          glassPanel(ctx, 44, botSafe - 28, W - 88, 22, 8, 0.6);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('公开数据集是深度学习的"燃料"，规模与质量决定模型上限', W / 2, botSafe - 17);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 48：数据集划分（训练/验证/测试集饼图）——
  registerCanvas('dataset-split', {
    title: TEMPLATE_TITLES['dataset-split'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const parts = [
        { name: '训练集', pct: 0.70, color: '#8ec5e0', use: '拟合模型参数' },
        { name: '验证集', pct: 0.15, color: '#7aa7f0', use: '调超参/早停' },
        { name: '测试集', pct: 0.15, color: '#d06a96', use: '最终评估泛化' },
      ];
      const cx = leftSafe + (rightSafe - leftSafe) * 0.34;
      const cy = (topSafe + botSafe) / 2;
      const R = Math.min((rightSafe - leftSafe) * 0.24, (botSafe - topSafe) * 0.40);

      const T_SLICE = 1.4;
      const TOTAL = 1.0 + parts.length * T_SLICE + 1.4;
      const stageNames = [
        '数据集划分：训练 / 验证 / 测试',
        ...parts.map(p => `${p.name} ${(p.pct * 100).toFixed(0)}% — 用途：${p.use}`),
        '训练拟合、验证调参、测试评估，三者互不混用',
      ];
      let stage = -1;
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = 0;
        for (let i = 0; i < parts.length; i++) {
          if (sec > 1.0 + i * T_SLICE) curStage = i + 1;
        }
        if (sec > 1.0 + parts.length * T_SLICE) curStage = parts.length + 1;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 饼图
        let start = -Math.PI / 2;
        parts.forEach((pt, i) => {
          const sliceStart = 1.0 + i * T_SLICE;
          const growP = easeOutCubic(win(sec, sliceStart, sliceStart + 0.7));
          if (growP <= 0) { start += pt.pct * Math.PI * 2; return; }
          const end = start + pt.pct * Math.PI * 2 * growP;
          const lit = sec > sliceStart;
          const active = sec > sliceStart && sec <= sliceStart + T_SLICE;
          const rOff = active ? 6 : 0;
          const ang = (start + end) / 2;
          const ox = Math.cos(ang) * rOff, oy = Math.sin(ang) * rOff;
          ctx.save();
          ctx.shadowColor = pt.color + '66'; ctx.shadowBlur = lit ? 10 : 4;
          ctx.fillStyle = pt.color;
          ctx.beginPath();
          ctx.moveTo(cx + ox, cy + oy);
          ctx.arc(cx + ox, cy + oy, R, start, end);
          ctx.closePath(); ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
          ctx.restore();
          // 百分比标签
          if (growP > 0.85) {
            const mid = (start + end) / 2;
            const lx = cx + ox + Math.cos(mid) * (R * 0.6);
            const ly = cy + oy + Math.sin(mid) * (R * 0.6);
            ctx.save(); ctx.globalAlpha = clamp01((growP - 0.85) / 0.15);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif';
            ctx.fillText((pt.pct * 100).toFixed(0) + '%', lx, ly);
            ctx.restore();
          }
          start = start + pt.pct * Math.PI * 2;
        });

        // 图例（右侧）
        const lx = leftSafe + (rightSafe - leftSafe) * 0.56;
        const itemH = Math.min(46, (botSafe - topSafe) / (parts.length + 0.5));
        parts.forEach((pt, i) => {
          const itemStart = 1.0 + i * T_SLICE + 0.3;
          const ip = easeOutCubic(win(sec, itemStart, itemStart + 0.5));
          if (ip <= 0) return;
          const iy = topSafe + 20 + i * itemH;
          ctx.save(); ctx.globalAlpha = ip;
          // 色块
          ctx.fillStyle = pt.color;
          roundRect(ctx, lx, iy, 16, 16, 4); ctx.fill();
          // 名称+百分比
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left';
          ctx.fillText(`${pt.name} ${(pt.pct * 100).toFixed(0)}%`, lx + 24, iy + 8);
          // 用途
          ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif';
          ctx.fillText('用途：' + pt.use, lx + 24, iy + 26);
          ctx.textAlign = 'center';
          ctx.restore();
        });

        // 底部结论
        const sumP = easeOutCubic(win(sec, 1.0 + parts.length * T_SLICE, 1.0 + parts.length * T_SLICE + 0.8));
        if (sumP > 0) {
          ctx.save(); ctx.globalAlpha = sumP;
          glassPanel(ctx, 44, botSafe - 28, W - 88, 22, 8, 0.6);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('训练拟合、验证调参、测试评估，三者互不混用', W / 2, botSafe - 17);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 49：计算图（节点=运算，边=张量流动）——
  registerCanvas('computation-graph', {
    title: TEMPLATE_TITLES['computation-graph'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const aW = rightSafe - leftSafe, aH = botSafe - topSafe;
      const a = 2, b = 3, c = 4;
      // 节点：a,b 输入 → d=a*b → e=d+c → out=e
      const nodes = [
        { name: 'a', val: a, grad: b, x: leftSafe + aW * 0.10, y: topSafe + aH * 0.22, kind: 'input' },
        { name: 'b', val: b, grad: a, x: leftSafe + aW * 0.10, y: topSafe + aH * 0.62, kind: 'input' },
        { name: 'a×b', val: a * b, grad: 1, x: leftSafe + aW * 0.36, y: topSafe + aH * 0.42, kind: 'op' },
        { name: 'c', val: c, grad: 1, x: leftSafe + aW * 0.36, y: topSafe + aH * 0.82, kind: 'input' },
        { name: '+c', val: a * b + c, grad: 1, x: leftSafe + aW * 0.64, y: topSafe + aH * 0.42, kind: 'op' },
        { name: 'out', val: a * b + c, grad: 1, x: leftSafe + aW * 0.90, y: topSafe + aH * 0.42, kind: 'output' },
      ];
      const edges = [[0, 2], [1, 2], [2, 4], [3, 4], [4, 5]]; // 前向顺序
      const bwdEdges = [[4, 5], [3, 4], [2, 4], [1, 2], [0, 2]]; // 反向顺序
      const R = 16;

      const T_NODE = 0.8;
      const T_EDGE = 0.55;
      const T_FWD_START = T_NODE;
      const T_FWD_END = T_FWD_START + edges.length * T_EDGE;
      const T_BWD_START = T_FWD_END + 0.5;
      const T_BWD_END = T_BWD_START + bwdEdges.length * T_EDGE;
      const TOTAL = T_BWD_END + 1.2;

      const stageNames = [
        '计算图：节点=运算，边=张量流动',
        '前向：a=2 沿边流向 d',
        '前向：b=3 流入 d，d = a×b = 6',
        '前向：d=6 沿边流向 e',
        '前向：c=4 流入 e，e = d+c = 10',
        '前向：e=10 流向 out，输出 = 10',
        '反向传播：从 out 出发，∂out/∂out = 1',
        '反向：e 收到梯度 1，∂out/∂e = 1',
        '反向：分流到 d 和 c，∂out/∂d = 1，∂out/∂c = 1',
        '反向：d=a×b 的梯度回传，∂out/∂a = b = 3，∂out/∂b = a = 2',
        '计算图：前向算输出，反向沿图求梯度（自动微分）',
      ];
      let stage = -1;
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段
        let curStage = 0;
        for (let i = 0; i < edges.length; i++) {
          if (sec > T_FWD_START + i * T_EDGE) curStage = i + 1;
        }
        for (let j = 0; j < bwdEdges.length; j++) {
          if (sec > T_BWD_START + j * T_EDGE) curStage = edges.length + 1 + j;
        }
        if (sec > T_BWD_END) curStage = edges.length + bwdEdges.length + 1;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        const bwdActive = sec > T_BWD_START;

        // 边（前向 + 反向）
        edges.forEach((e, ei) => {
          const from = nodes[e[0]], to = nodes[e[1]];
          const fwdStart = T_FWD_START + ei * T_EDGE;
          const fwdFlow = easeOutCubic(win(sec, fwdStart, fwdStart + T_EDGE * 0.8));
          const lit = sec > fwdStart;
          // 反向是否经过此边
          const bi = bwdEdges.findIndex(be => be[0] === e[0] && be[1] === e[1]);
          let bwdFlow = 0, bwdLit = false;
          if (bi >= 0) {
            const bwdStart = T_BWD_START + bi * T_EDGE;
            bwdFlow = easeOutCubic(win(sec, bwdStart, bwdStart + T_EDGE * 0.8));
            bwdLit = sec > bwdStart;
          }
          const alpha = Math.max(lit ? 0.8 : 0.2, bwdLit ? 0.8 : 0);
          ctx.strokeStyle = bwdLit ? `rgba(208,106,150,${alpha})` : `rgba(108,92,231,${alpha})`;
          ctx.lineWidth = (lit || bwdLit) ? 2.2 : 1.4;
          ctx.beginPath(); ctx.moveTo(from.x + R, from.y); ctx.lineTo(to.x - R, to.y); ctx.stroke();
          // 前向流动点
          if (fwdFlow > 0 && fwdFlow < 1) {
            const fx = from.x + R + (to.x - R - from.x - R) * fwdFlow;
            const fy = from.y + (to.y - from.y) * fwdFlow;
            ctx.fillStyle = '#6c5ce7';
            ctx.beginPath(); ctx.arc(fx, fy, 4, 0, Math.PI * 2); ctx.fill();
          }
          // 反向流动点（从 to 流向 from）
          if (bwdFlow > 0 && bwdFlow < 1) {
            const fx = to.x - R + (from.x + R - to.x + R) * bwdFlow;
            const fy = to.y + (from.y - to.y) * bwdFlow;
            ctx.fillStyle = '#d06a96';
            ctx.beginPath(); ctx.arc(fx, fy, 4, 0, Math.PI * 2); ctx.fill();
          }
          // 箭头（前向）
          if (lit) {
            const ang = Math.atan2(to.y - from.y, to.x - from.x);
            ctx.fillStyle = bwdLit ? '#d06a96' : '#6c5ce7';
            ctx.beginPath();
            ctx.moveTo(to.x - R, to.y);
            ctx.lineTo(to.x - R - 8 * Math.cos(ang - 0.4), to.y - 8 * Math.sin(ang - 0.4));
            ctx.lineTo(to.x - R - 8 * Math.cos(ang + 0.4), to.y - 8 * Math.sin(ang + 0.4));
            ctx.closePath(); ctx.fill();
          }
        });

        // 节点
        nodes.forEach((nd, i) => {
          const popP = easeOutBack(win(sec, 0.1 + i * 0.08, 0.6 + i * 0.08));
          if (popP <= 0) return;
          const s = Math.max(0, popP);
          // 前向到达：该节点是否已有输入
          const fwdArrived = edges.some(e => e[1] === i && sec > T_FWD_START + edges.indexOf(e) * T_EDGE) || nd.kind === 'input';
          // 反向到达：该节点是否已收到梯度
          let bwdArrived = i === nodes.length - 1 && sec > T_BWD_START;
          if (!bwdArrived) {
            bwdArrived = bwdEdges.some((be, bi) => be[1] === i && sec > T_BWD_START + bi * T_EDGE);
          }
          const color = nd.kind === 'input' ? GLASS_COLORS[0] : nd.kind === 'op' ? GLASS_COLORS[4] : GLASS_COLORS[2];
          ctx.save();
          ctx.translate(nd.x, nd.y); ctx.scale(s, s);
          ctx.shadowColor = color + '66'; ctx.shadowBlur = (fwdArrived || bwdArrived) ? 12 : 6;
          ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2);
          ctx.fillStyle = bwdArrived ? '#d06a96' : (fwdArrived ? color : '#fff');
          ctx.strokeStyle = color; ctx.lineWidth = 2.2; ctx.fill(); ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.beginPath(); ctx.arc(-4, -4, R * 0.28, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = (fwdArrived || bwdArrived) ? '#fff' : color;
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(nd.name, 0, 0);
          ctx.restore();
          // 值（前向到达后显示）
          if (fwdArrived) {
            ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
            ctx.fillText('=' + nd.val, nd.x, nd.y + R + 14);
          }
          // 梯度（反向到达后显示）
          if (bwdArrived) {
            ctx.fillStyle = '#d06a96'; ctx.font = 'bold 12px sans-serif';
            ctx.fillText('∂=' + nd.grad, nd.x, nd.y - R - 14);
          }
        });

        // 阶段标签卡（前向/反向）
        const modeX = W / 2, modeY = topSafe + 6;
        if (bwdActive) {
          ctx.fillStyle = '#d06a96'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('◀ 反向传播（梯度回传）', modeX, modeY);
        } else {
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('前向传播（张量流动） ▶', modeX, modeY);
        }

        // 底部结论
        const sumP = easeOutCubic(win(sec, T_BWD_END, T_BWD_END + 0.8));
        if (sumP > 0) {
          ctx.save(); ctx.globalAlpha = sumP;
          glassPanel(ctx, 44, botSafe - 28, W - 88, 22, 8, 0.6);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('计算图：前向算输出，反向沿图求梯度（自动微分）', W / 2, botSafe - 17);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 50：主流框架对比（TF/Keras/PyTorch）——
  registerCanvas('framework-compare', {
    title: TEMPLATE_TITLES['framework-compare'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const fws = [
        { name: 'TensorFlow', dev: 'Google', feat: '静态图+Keras高层API', scene: '工业部署/生产' },
        { name: 'Keras', dev: 'Google', feat: '高层简洁API', scene: '快速实验/教学' },
        { name: 'PyTorch', dev: 'Meta', feat: '动态图/Pythonic', scene: '学术研究/前沿' },
      ];
      const n = fws.length;
      const topY = 92, botY = H - 62;
      const colW = Math.max(40, (W - 88 - 24 * (n - 1)) / n);
      const colH = Math.max(40, botY - topY - 28);
      const gap = 24, startX = 44, y = topY;

      const T_IN = 0.9, T_STAGE = 1.6;
      const TOTAL = T_IN + n * T_STAGE + 0.8;

      const stageNames = [
        '主流深度学习框架对比：TensorFlow / Keras / PyTorch',
        ...fws.map(f => `${f.name}（${f.dev}）：${f.feat}；适用：${f.scene}`),
        '框架降低实现门槛，TF 主工业、PyTorch 主学术',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        ctx.fillStyle = '#4a3f8a'; ctx.font = 'bold 14px sans-serif';
        ctx.fillText('主流深度学习框架对比', W / 2, 52);

        let cur = 0;
        if (sec >= T_IN) {
          if (sec >= T_IN + n * T_STAGE) cur = n + 1;
          else cur = Math.floor((sec - T_IN) / T_STAGE) + 1;
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        for (let i = 0; i < n; i++) {
          const x = startX + i * (colW + gap);
          const popP = easeOutBack(win(sec, 0.1 + i * 0.18, T_IN + i * 0.18));
          if (popP <= 0) continue;
          const s = Math.max(0, popP);
          const on = stage === i + 1;
          const color = GLASS_COLORS[i];
          ctx.save();
          ctx.translate(x + colW / 2, y + colH / 2); ctx.scale(s, s);
          ctx.translate(-(x + colW / 2), -(y + colH / 2));
          if (on) {
            ctx.fillStyle = color;
            ctx.shadowColor = 'rgba(108,92,231,0.4)'; ctx.shadowBlur = 12;
            roundRect(ctx, x, y, colW, colH, 8); ctx.fill();
            ctx.shadowColor = 'transparent';
          } else {
            glassPanel(ctx, x, y, colW, colH, 8, 0.6);
            ctx.strokeStyle = 'rgba(165,134,232,0.5)'; ctx.lineWidth = 1.6;
            roundRect(ctx, x, y, colW, colH, 8); ctx.stroke();
          }
          ctx.fillStyle = on ? '#fff' : '#4a3f8a'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText(fws[i].name, x + colW / 2, y + 26);
          ctx.fillStyle = on ? 'rgba(255,255,255,0.9)' : '#6e6890'; ctx.font = '12px sans-serif';
          ctx.fillText('开发者：' + fws[i].dev, x + colW / 2, y + 50);
          ctx.fillStyle = on ? '#fff' : '#4a3f8a'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('特点：', x + colW / 2, y + 76);
          ctx.fillStyle = on ? 'rgba(255,255,255,0.92)' : '#6e6890'; ctx.font = '12px sans-serif';
          wrapText(ctx, fws[i].feat, x + colW / 2, y + 94, colW - 16, 14);
          ctx.fillStyle = on ? '#fff' : GLASS_COLORS[3]; ctx.font = 'bold 12px sans-serif';
          wrapText(ctx, '场景：' + fws[i].scene, x + colW / 2, y + colH - 30, colW - 16, 14);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 51：ReLU 激活函数（max(0,x) 及变体对比）——
  registerCanvas('relu-activation', {
    title: TEMPLATE_TITLES['relu-activation'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const funcs = [
        { name: 'ReLU', color: GLASS_COLORS[3], f: x => Math.max(0, x), desc: 'max(0,x)，简单高效' },
        { name: 'Leaky ReLU', color: GLASS_COLORS[0], f: x => x > 0 ? x : 0.1 * x, desc: '负区间小斜率，缓解神经元死亡' },
        { name: 'ELU', color: GLASS_COLORS[2], f: x => x > 0 ? x : Math.exp(x) - 1, desc: '负区间平滑指数，均值近0' },
      ];
      const n = funcs.length;
      const x0 = W * 0.12, y0 = H * 0.60;
      const xMax = W * 0.56;
      const sx = (xMax - x0) / 8;
      const sy = Math.max(10, (y0 - 92) / 4);

      const T_IN = 1.0, T_STAGE = 1.6;
      const TOTAL = T_IN + n * T_STAGE + 0.8;

      const stageNames = [
        'ReLU 激活函数及变体对比',
        ...funcs.map(f => `${f.name}：${f.desc}`),
        'ReLU：简单、计算快、缓解梯度消失，深度网络默认激活',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);

        ctx.fillStyle = '#4a3f8a'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('ReLU 激活函数及变体对比', W / 2, 52);

        let cur = 0;
        if (sec >= T_IN) {
          if (sec >= T_IN + n * T_STAGE) cur = n + 1;
          else cur = Math.floor((sec - T_IN) / T_STAGE) + 1;
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 坐标轴
        ctx.strokeStyle = '#9a92b8'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(x0, 92); ctx.lineTo(x0, y0); ctx.lineTo(xMax, y0); ctx.stroke();
        // x 刻度
        ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (let xv = -4; xv <= 4; xv++) {
          const px = x0 + xv * sx;
          if (px > x0 - 2 && px < xMax) ctx.fillText(String(xv), px, y0 + 14);
        }
        ctx.fillText('x', xMax + 12, y0 + 14);
        ctx.fillText('0', x0 - 10, y0 + 14);
        // y 刻度
        ctx.textAlign = 'right';
        for (let yv = 1; yv <= 4; yv++) {
          const py = y0 - yv * sy;
          if (py > 92) ctx.fillText(String(yv), x0 - 8, py);
        }

        // 曲线
        funcs.forEach((F, fi) => {
          const drawP = stage === 0 ? 0
            : stage === fi + 1 ? easeOutCubic(win(sec, T_IN + fi * T_STAGE, T_IN + fi * T_STAGE + 0.6))
            : stage > fi + 1 ? 1 : 0;
          if (drawP <= 0) return;
          const on = stage === fi + 1;
          ctx.strokeStyle = F.color; ctx.lineWidth = on ? 2.8 : 1.8;
          ctx.beginPath();
          const steps = Math.floor(160 * drawP);
          for (let k = 0; k <= steps; k++) {
            const xv = -4 + k * 0.05;
            const px = x0 + xv * sx;
            const py = y0 - F.f(xv) * sy;
            if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();
        });

        // 图例
        const lx = W * 0.64, ly = 96;
        const lw = Math.max(60, W - lx - 44);
        glassPanel(ctx, lx - 10, ly - 8, lw, n * 34 + 16, 8, 0.6);
        funcs.forEach((F, fi) => {
          const on = stage === fi + 1;
          ctx.fillStyle = F.color;
          roundRect(ctx, lx, ly + fi * 32, 18, 14, 3); ctx.fill();
          ctx.fillStyle = on ? '#4a3f8a' : '#6e6890'; ctx.font = on ? 'bold 12px sans-serif' : '12px sans-serif';
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.fillText(F.name, lx + 26, ly + fi * 32 + 7);
        });
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 52：MNIST 手写数字识别 pipeline ——
  registerCanvas('mnist-pipeline', {
    title: TEMPLATE_TITLES['mnist-pipeline'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const digit = [
        0,1,1,1,1,1,0,0,
        0,1,0,0,0,1,0,0,
        0,0,0,0,0,1,0,0,
        0,0,1,1,1,1,0,0,
        0,0,0,0,0,1,0,0,
        0,1,0,0,0,1,0,0,
        0,1,1,1,1,1,0,0,
        0,0,0,0,0,0,0,0,
      ];
      const gridSize = 8;
      const outLabels = ['0','1','2','3','4','5','6','7','8','9'];
      const probs = [0.02,0.01,0.03,0.88,0.01,0.01,0.01,0.01,0.01,0.01];
      const maxIdx = 3;

      const topY = 92, botY = H - 62;
      const midY = (topY + botY) / 2;
      const gridCell = Math.min(11, (botY - topY - 50) / gridSize);
      const gridW = gridCell * gridSize;
      const gridX = 60, gridY = midY - gridW / 2;
      const netX = W * 0.46;
      const outX = W - 70;

      const T_IN = 0.8, T_PHASE = 1.8;
      const TOTAL = T_IN + 3 * T_PHASE + 0.8;

      const stageNames = [
        'MNIST 手写数字识别 pipeline',
        '阶段1：输入 28×28 像素（手写"3"示意）',
        '阶段2：神经网络前向传播',
        '阶段3：Softmax 输出 10 类概率',
        '手写"3" → 识别为数字 3（置信度 0.88）',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        // 内容容器玻璃面板
        glassPanel(ctx, 28, topSafe - 8, W - 56, botSafe - topSafe + 24, 16, 0.55);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        ctx.fillStyle = '#4a3f8a'; ctx.font = 'bold 14px sans-serif';
        ctx.fillText('MNIST 手写数字识别 pipeline', W / 2, 52);

        let cur = 0;
        if (sec >= T_IN) {
          if (sec >= T_IN + 3 * T_PHASE) cur = 4;
          else cur = Math.floor((sec - T_IN) / T_PHASE) + 1;
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 连接线
        const a01 = stage >= 2 ? 0.9 : 0.3;
        const a12 = stage >= 3 ? 0.9 : 0.3;
        ctx.strokeStyle = `rgba(108,92,231,${a01})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(gridX + gridW, midY); ctx.lineTo(netX - 18, midY); ctx.stroke();
        ctx.strokeStyle = `rgba(165,134,232,${a12})`;
        ctx.beginPath(); ctx.moveTo(netX + 18, midY); ctx.lineTo(outX - 24, midY); ctx.stroke();

        // 输入网格
        const gridPop = easeOutBack(win(sec, 0.1, T_IN));
        if (gridPop > 0) {
          ctx.save();
          ctx.translate(gridX + gridW / 2, gridY + gridW / 2); ctx.scale(gridPop, gridPop);
          ctx.translate(-(gridX + gridW / 2), -(gridY + gridW / 2));
          ctx.fillStyle = '#4a3f8a'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('28×28 输入', gridX + gridW / 2, gridY - 16);
          for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
              ctx.fillStyle = digit[r * gridSize + c] ? '#6c5ce7' : '#e8e4f7';
              ctx.fillRect(gridX + c * gridCell, gridY + r * gridCell, gridCell - 1, gridCell - 1);
            }
          }
          ctx.strokeStyle = '#6c5ce7'; ctx.lineWidth = 1.6;
          ctx.strokeRect(gridX, gridY, gridW, gridW);
          ctx.restore();
        }

        // 网络节点
        const nodeR = 15;
        const netNodes = [midY - 40, midY, midY + 40];
        const netPop = easeOutBack(win(sec, T_IN + 0.1, T_IN + T_PHASE));
        if (netPop > 0) {
          ctx.fillStyle = '#4a3f8a'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('神经网络', netX, gridY - 16);
          netNodes.forEach((ny, i) => {
            const s = Math.max(0, easeOutBack(win(sec, T_IN + 0.1 + i * 0.15, T_IN + 0.6 + i * 0.15)));
            if (s <= 0) return;
            ctx.save(); ctx.translate(netX, ny); ctx.scale(s, s);
            const lit = stage >= 2;
            ctx.shadowColor = 'rgba(108,92,231,0.4)'; ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.arc(0, 0, nodeR, 0, Math.PI * 2);
            ctx.fillStyle = lit ? GLASS_COLORS[4] : '#fff';
            ctx.strokeStyle = GLASS_COLORS[4]; ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = lit ? '#fff' : '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
            ctx.fillText('N', 0, 0);
            ctx.restore();
          });
        }

        // 输出10类
        const outPop = easeOutBack(win(sec, T_IN + T_PHASE * 2 + 0.1, T_IN + T_PHASE * 2 + T_PHASE));
        if (outPop > 0) {
          ctx.fillStyle = '#4a3f8a'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('10类输出', outX, gridY - 16);
          const barH = Math.max(9, (botY - topY - 20) / 10 - 4);
          const barW = 36;
          for (let i = 0; i < 10; i++) {
            const oy = topY + 10 + i * (barH + 4);
            const on = i === maxIdx;
            const growP = easeOutCubic(win(sec, T_IN + T_PHASE * 2 + 0.2 + i * 0.07, T_IN + T_PHASE * 2 + 0.9));
            const w = Math.max(2, barW * probs[i] * 5 * growP);
            ctx.fillStyle = on ? GLASS_COLORS[3] : '#d8d4ec';
            roundRect(ctx, outX - barW / 2, oy, w, barH, 3); ctx.fill();
            ctx.fillStyle = on ? '#fff' : '#4a3f8a'; ctx.font = on ? 'bold 11px sans-serif' : '11px sans-serif'; ctx.textAlign = 'left';
            ctx.fillText(outLabels[i] + ':' + probs[i].toFixed(2), outX + barW / 2 + 6, oy + barH / 2);
          }
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 53：CIFAR-10 图像分类（10类物体）——
  registerCanvas('cifar-classify', {
    title: TEMPLATE_TITLES['cifar-classify'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const classes = ['飞机','汽车','鸟','猫','鹿','狗','蛙','马','船','卡车'];
      const n = classes.length;
      const topY = 92, botY = H - 62;
      const cardW = Math.max(28, (W - 88 - 6 * (n - 1)) / n);
      const cardH = Math.max(40, botY - topY - 30);
      const gap = 6, startX = 44, y = topY;

      const T_IN = 1.0, T_EACH = 0.5;
      const TOTAL = T_IN + n * T_EACH + 0.8;

      const stageNames = [
        'CIFAR-10：10 类物体分类',
        ...classes.map((c, i) => `类别 ${i}：${c}`),
        'CIFAR-10：6万张32×32彩色图，10类，图像分类基准数据集',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        ctx.fillStyle = '#4a3f8a'; ctx.font = 'bold 14px sans-serif';
        ctx.fillText('CIFAR-10：10 类物体分类', W / 2, 52);

        let cur = 0;
        if (sec >= T_IN) {
          if (sec >= T_IN + n * T_EACH) cur = n + 1;
          else cur = Math.floor((sec - T_IN) / T_EACH) + 1;
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        for (let i = 0; i < n; i++) {
          const x = startX + i * (cardW + gap);
          const popP = easeOutBack(win(sec, 0.1 + i * 0.05, T_IN + i * 0.05));
          if (popP <= 0) continue;
          const s = Math.max(0, popP);
          const on = stage === i + 1;
          const color = GLASS_COLORS[i % GLASS_COLORS.length];
          ctx.save();
          ctx.translate(x + cardW / 2, y + cardH / 2); ctx.scale(s, s);
          ctx.translate(-(x + cardW / 2), -(y + cardH / 2));
          if (on) {
            ctx.fillStyle = color;
            ctx.shadowColor = 'rgba(108,92,231,0.4)'; ctx.shadowBlur = 12;
            roundRect(ctx, x, y, cardW, cardH, 5); ctx.fill();
            ctx.shadowColor = 'transparent';
          } else {
            glassPanel(ctx, x, y, cardW, cardH, 5, 0.6);
            ctx.strokeStyle = 'rgba(165,134,232,0.5)'; ctx.lineWidth = 1.6;
            roundRect(ctx, x, y, cardW, cardH, 5); ctx.stroke();
          }
          ctx.fillStyle = on ? '#fff' : '#4a3f8a'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText(classes[i], x + cardW / 2, y + cardH / 2 - 6);
          ctx.fillStyle = on ? 'rgba(255,255,255,0.85)' : '#6e6890'; ctx.font = '11px sans-serif';
          ctx.fillText(String(i), x + cardW / 2, y + cardH / 2 + 14);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 54：图像风格迁移（内容+风格→生成，VGG19）——
  registerCanvas('style-transfer', {
    title: TEMPLATE_TITLES['style-transfer'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const boxes = [
        { name: '内容图', desc: '原始照片' },
        { name: '风格图', desc: '名画风格' },
        { name: 'VGG19', desc: '特征提取' },
        { name: '生成图', desc: '风格迁移结果' },
      ];
      const n = boxes.length;
      const topY = 92, botY = H - 62;
      const bw = Math.max(40, (W - 88 - 20 * (n - 1)) / n);
      const bh = Math.max(60, botY - topY - 36);
      const gap = 20, startX = 44, by = topY;

      const T_IN = 0.9, T_STAGE = 1.4;
      const TOTAL = T_IN + n * T_STAGE + 0.7;

      const stageNames = [
        '图像风格迁移（Gatys et al. / VGG19）',
        `${boxes[0].name}：${boxes[0].desc}`,
        `${boxes[1].name}：${boxes[1].desc}`,
        `${boxes[2].name}：${boxes[2].desc}（内容特征+风格特征）`,
        `${boxes[3].name}：${boxes[3].desc}`,
        '内容特征+风格特征→优化生成图，让照片拥有名画风格',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        ctx.fillStyle = '#4a3f8a'; ctx.font = 'bold 14px sans-serif';
        ctx.fillText('图像风格迁移（VGG19）', W / 2, 52);

        let cur = 0;
        if (sec >= T_IN) {
          if (sec >= T_IN + n * T_STAGE) cur = n + 1;
          else cur = Math.floor((sec - T_IN) / T_STAGE) + 1;
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 箭头
        for (let i = 0; i < n - 1; i++) {
          const x1 = startX + i * (bw + gap) + bw;
          const x2 = x1 + gap;
          const cy = by + bh / 2;
          const on = stage > i + 1;
          ctx.strokeStyle = on ? '#6c5ce7' : '#b8b0d8';
          ctx.lineWidth = on ? 2.4 : 1.6;
          ctx.beginPath(); ctx.moveTo(x1, cy); ctx.lineTo(x2, cy); ctx.stroke();
          ctx.fillStyle = on ? '#6c5ce7' : '#b8b0d8';
          ctx.beginPath(); ctx.moveTo(x2, cy); ctx.lineTo(x2 - 7, cy - 5); ctx.lineTo(x2 - 7, cy + 5); ctx.closePath(); ctx.fill();
        }

        for (let i = 0; i < n; i++) {
          const x = startX + i * (bw + gap);
          const popP = easeOutBack(win(sec, 0.1 + i * 0.15, T_IN + i * 0.15));
          if (popP <= 0) continue;
          const s = Math.max(0, popP);
          const on = stage === i + 1;
          const color = GLASS_COLORS[i % GLASS_COLORS.length];
          ctx.save();
          ctx.translate(x + bw / 2, by + bh / 2); ctx.scale(s, s);
          ctx.translate(-(x + bw / 2), -(by + bh / 2));
          if (on) {
            ctx.fillStyle = color;
            ctx.shadowColor = 'rgba(108,92,231,0.4)'; ctx.shadowBlur = 12;
            roundRect(ctx, x, by, bw, bh, 8); ctx.fill();
            ctx.shadowColor = 'transparent';
          } else {
            glassPanel(ctx, x, by, bw, bh, 8, 0.6);
            ctx.strokeStyle = 'rgba(165,134,232,0.5)'; ctx.lineWidth = 1.6;
            roundRect(ctx, x, by, bw, bh, 8); ctx.stroke();
          }
          ctx.fillStyle = on ? '#fff' : '#4a3f8a'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(boxes[i].name, x + bw / 2, by + 22);
          ctx.fillStyle = on ? 'rgba(255,255,255,0.9)' : '#6e6890'; ctx.font = '12px sans-serif';
          wrapText(ctx, boxes[i].desc, x + bw / 2, by + 46, bw - 16, 14);
          ctx.restore();
        }

        // VGG19 标注
        if (stage >= 3) {
          const vx = startX + 2 * (bw + gap) + bw / 2;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('内容特征 + 风格特征 → 优化合成', vx, by + bh + 18);
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 55：新一代 AI 开放创新平台对比 ——
  registerCanvas('ai-platforms', {
    title: TEMPLATE_TITLES['ai-platforms'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const plats = [
        { name: '百度飞桨', dev: '百度', feat: 'PaddlePaddle/文心', scene: '中文NLP/产业应用' },
        { name: '阿里PAI', dev: '阿里云', feat: 'PAI平台/通义', scene: '电商/云上AI' },
        { name: '华为ModelArts', dev: '华为云', feat: '一站式开发/盘古', scene: '政企/端侧' },
        { name: 'OpenAI API', dev: 'OpenAI', feat: 'GPT系列/通用', scene: '通用对话/创作' },
      ];
      const n = plats.length;
      const topY = 92, botY = H - 62;
      const colW = Math.max(36, (W - 88 - 16 * (n - 1)) / n);
      const colH = Math.max(40, botY - topY - 28);
      const gap = 16, startX = 44, y = topY;

      const T_IN = 1.0, T_STAGE = 1.3;
      const TOTAL = T_IN + n * T_STAGE + 0.7;

      const stageNames = [
        '新一代 AI 开放创新平台',
        ...plats.map(p => `${p.name}（${p.dev}）：${p.feat}；场景：${p.scene}`),
        '开放平台降低AI使用门槛，让开发者无需从零训练',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        ctx.fillStyle = '#4a3f8a'; ctx.font = 'bold 14px sans-serif';
        ctx.fillText('新一代 AI 开放创新平台', W / 2, 52);

        let cur = 0;
        if (sec >= T_IN) {
          if (sec >= T_IN + n * T_STAGE) cur = n + 1;
          else cur = Math.floor((sec - T_IN) / T_STAGE) + 1;
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        for (let i = 0; i < n; i++) {
          const x = startX + i * (colW + gap);
          const popP = easeOutBack(win(sec, 0.1 + i * 0.14, T_IN + i * 0.14));
          if (popP <= 0) continue;
          const s = Math.max(0, popP);
          const on = stage === i + 1;
          const color = GLASS_COLORS[i % GLASS_COLORS.length];
          ctx.save();
          ctx.translate(x + colW / 2, y + colH / 2); ctx.scale(s, s);
          ctx.translate(-(x + colW / 2), -(y + colH / 2));
          if (on) {
            ctx.fillStyle = color;
            ctx.shadowColor = 'rgba(108,92,231,0.4)'; ctx.shadowBlur = 12;
            roundRect(ctx, x, y, colW, colH, 8); ctx.fill();
            ctx.shadowColor = 'transparent';
          } else {
            glassPanel(ctx, x, y, colW, colH, 8, 0.6);
            ctx.strokeStyle = 'rgba(165,134,232,0.5)'; ctx.lineWidth = 1.6;
            roundRect(ctx, x, y, colW, colH, 8); ctx.stroke();
          }
          ctx.fillStyle = on ? '#fff' : '#4a3f8a'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(plats[i].name, x + colW / 2, y + 22);
          ctx.fillStyle = on ? 'rgba(255,255,255,0.9)' : '#6e6890'; ctx.font = '12px sans-serif';
          ctx.fillText('提供：' + plats[i].dev, x + colW / 2, y + 46);
          ctx.fillStyle = on ? '#fff' : '#4a3f8a'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('能力：', x + colW / 2, y + 70);
          ctx.fillStyle = on ? 'rgba(255,255,255,0.92)' : '#6e6890'; ctx.font = '12px sans-serif';
          wrapText(ctx, plats[i].feat, x + colW / 2, y + 88, colW - 16, 14);
          ctx.fillStyle = on ? '#fff' : GLASS_COLORS[3]; ctx.font = 'bold 12px sans-serif';
          wrapText(ctx, '场景：' + plats[i].scene, x + colW / 2, y + colH - 28, colW - 16, 14);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 56：直接使用平台智能工具（输入→API→结果）——
  registerCanvas('tool-usage', {
    title: TEMPLATE_TITLES['tool-usage'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const stages = [
        { name: '用户输入', io: '文本/图片/语音', detail: '在平台界面提交需求' },
        { name: 'API 调用', io: '请求→云模型', detail: '平台调度训练好的模型' },
        { name: '返回结果', io: '识别/生成内容', detail: '云端推理后返回给用户' },
      ];
      const n = stages.length;
      const topY = 92, botY = H - 62;
      const boxW = Math.max(48, (W - 88 - 24 * (n - 1)) / n);
      const boxH = Math.max(60, botY - topY - 28);
      const gap = 24, startX = 44, y = topY;

      const T_IN = 0.9, T_STAGE = 1.6;
      const TOTAL = T_IN + n * T_STAGE + 0.8;

      const stageNames = [
        '直接使用平台智能工具',
        `阶段1：${stages[0].name}（${stages[0].io}）— ${stages[0].detail}`,
        `阶段2：${stages[1].name}（${stages[1].io}）— ${stages[1].detail}`,
        `阶段3：${stages[2].name}（${stages[2].io}）— ${stages[2].detail}`,
        '无需训练：用户输入→平台API→直接拿结果，开箱即用',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        ctx.fillStyle = '#4a3f8a'; ctx.font = 'bold 14px sans-serif';
        ctx.fillText('直接使用平台智能工具', W / 2, 52);

        let cur = 0;
        if (sec >= T_IN) {
          if (sec >= T_IN + n * T_STAGE) cur = n + 1;
          else cur = Math.floor((sec - T_IN) / T_STAGE) + 1;
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 箭头
        for (let i = 0; i < n - 1; i++) {
          const x1 = startX + i * (boxW + gap) + boxW;
          const x2 = x1 + gap;
          const cy = y + boxH / 2;
          const on = stage > i + 1;
          ctx.strokeStyle = on ? '#6c5ce7' : '#b8b0d8';
          ctx.lineWidth = on ? 2.4 : 1.6;
          ctx.beginPath(); ctx.moveTo(x1, cy); ctx.lineTo(x2, cy); ctx.stroke();
          ctx.fillStyle = on ? '#6c5ce7' : '#b8b0d8';
          ctx.beginPath(); ctx.moveTo(x2, cy); ctx.lineTo(x2 - 7, cy - 5); ctx.lineTo(x2 - 7, cy + 5); ctx.closePath(); ctx.fill();
        }

        for (let i = 0; i < n; i++) {
          const x = startX + i * (boxW + gap);
          const popP = easeOutBack(win(sec, 0.1 + i * 0.16, T_IN + i * 0.16));
          if (popP <= 0) continue;
          const s = Math.max(0, popP);
          const on = stage === i + 1;
          const color = GLASS_COLORS[i % GLASS_COLORS.length];
          ctx.save();
          ctx.translate(x + boxW / 2, y + boxH / 2); ctx.scale(s, s);
          ctx.translate(-(x + boxW / 2), -(y + boxH / 2));
          if (on) {
            ctx.fillStyle = color;
            ctx.shadowColor = 'rgba(108,92,231,0.4)'; ctx.shadowBlur = 12;
            roundRect(ctx, x, y, boxW, boxH, 8); ctx.fill();
            ctx.shadowColor = 'transparent';
          } else {
            glassPanel(ctx, x, y, boxW, boxH, 8, 0.6);
            ctx.strokeStyle = 'rgba(165,134,232,0.5)'; ctx.lineWidth = 1.6;
            roundRect(ctx, x, y, boxW, boxH, 8); ctx.stroke();
          }
          ctx.fillStyle = on ? '#fff' : '#4a3f8a'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(stages[i].name, x + boxW / 2, y + 22);
          ctx.fillStyle = on ? '#fff' : GLASS_COLORS[3]; ctx.font = 'bold 12px sans-serif';
          ctx.fillText(stages[i].io, x + boxW / 2, y + 46);
          ctx.fillStyle = on ? 'rgba(255,255,255,0.92)' : '#6e6890'; ctx.font = '12px sans-serif';
          wrapText(ctx, stages[i].detail, x + boxW / 2, y + 68, boxW - 16, 14);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 57：编程调用智能工具（Python + API）——
  registerCanvas('python-api-call', {
    title: TEMPLATE_TITLES['python-api-call'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const code = [
        'import requests',
        'url = "https://api..."',
        'data = {"input": "..."}',
        'r = requests.post(...)',
        'print(r.json())',
      ];
      const stages = [
        { name: '1.安装SDK', detail: 'pip install requests' },
        { name: '2.写代码', detail: '构造请求与参数' },
        { name: '3.调用API', detail: 'post 请求云服务' },
        { name: '4.解析返回', detail: 'json 解析结果' },
      ];
      const n = stages.length;
      const topY = 92, botY = H - 62;
      const codeX = 44, codeY = topY;
      const codeW = Math.max(80, W * 0.42);
      const codeH = Math.max(60, botY - topY);
      const fX = codeX + codeW + 24;
      const fW = Math.max(40, W - fX - 44);

      const T_IN = 0.9, T_STAGE = 1.3;
      const TOTAL = T_IN + n * T_STAGE + 0.8;

      const stageNames = [
        '编程调用智能工具（Python + API）',
        ...stages.map(s => `${s.name}：${s.detail}`),
        '几行Python代码即可调用云端AI能力，灵活集成到应用',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);

        ctx.fillStyle = '#4a3f8a'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('编程调用智能工具（Python + API）', W / 2, 52);

        let cur = 0;
        if (sec >= T_IN) {
          if (sec >= T_IN + n * T_STAGE) cur = n + 1;
          else cur = Math.floor((sec - T_IN) / T_STAGE) + 1;
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 代码框
        const codePop = easeOutBack(win(sec, 0.1, T_IN));
        if (codePop > 0) {
          ctx.save();
          ctx.translate(codeX + codeW / 2, codeY + codeH / 2); ctx.scale(codePop, codePop);
          ctx.translate(-(codeX + codeW / 2), -(codeY + codeH / 2));
          ctx.fillStyle = '#1e2a44';
          ctx.shadowColor = 'rgba(30,42,68,0.4)'; ctx.shadowBlur = 12;
          roundRect(ctx, codeX, codeY, codeW, codeH, 8); ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = 'rgba(122,167,240,0.4)'; ctx.lineWidth = 1.6;
          roundRect(ctx, codeX, codeY, codeW, codeH, 8); ctx.stroke();
          ctx.fillStyle = '#8ec5e0'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'left';
          ctx.fillText('main.py', codeX + 12, codeY + 18);
          const lineH = Math.max(15, (codeH - 36) / code.length);
          code.forEach((line, i) => {
            const on = stage >= i + 1;
            ctx.fillStyle = on ? '#7aa7f0' : '#c9c4f0';
            ctx.font = '12px monospace';
            ctx.fillText(line, codeX + 12, codeY + 38 + i * lineH);
          });
          ctx.restore();
        }

        // 流程
        const fPop = easeOutBack(win(sec, 0.2, T_IN));
        if (fPop > 0) {
          ctx.save();
          ctx.translate(fX + fW / 2, (topY + botY) / 2); ctx.scale(fPop, fPop);
          ctx.translate(-(fX + fW / 2), -((topY + botY) / 2));
          ctx.fillStyle = '#4a3f8a'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'left';
          ctx.fillText('调用流程', fX, topY + 12);
          const fItemH = Math.max(30, (botY - topY - 30) / n);
          stages.forEach((s, i) => {
            const sy = topY + 28 + i * fItemH;
            const on = stage === i + 1;
            const color = GLASS_COLORS[i % GLASS_COLORS.length];
            if (on) {
              ctx.fillStyle = color;
              ctx.shadowColor = 'rgba(108,92,231,0.35)'; ctx.shadowBlur = 8;
              roundRect(ctx, fX, sy, fW, fItemH - 6, 6); ctx.fill();
              ctx.shadowColor = 'transparent';
            } else {
              glassPanel(ctx, fX, sy, fW, fItemH - 6, 6, 0.6);
              ctx.strokeStyle = 'rgba(165,134,232,0.5)'; ctx.lineWidth = 1.6;
              roundRect(ctx, fX, sy, fW, fItemH - 6, 6); ctx.stroke();
            }
            ctx.fillStyle = on ? '#fff' : '#4a3f8a'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'left';
            ctx.fillText(s.name + '：' + s.detail, fX + 10, sy + (fItemH - 6) / 2);
          });
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 58：Python 第三方库生态 ——
  registerCanvas('python-ecosystem', {
    title: TEMPLATE_TITLES['python-ecosystem'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;

      const libs = [
        { name: 'NumPy', feat: '数组与矩阵运算', color: GLASS_COLORS[0] },
        { name: 'Pandas', feat: '表格数据处理', color: GLASS_COLORS[1] },
        { name: 'PyTorch', feat: '深度学习框架', color: GLASS_COLORS[2] },
        { name: 'TensorFlow', feat: '深度学习框架', color: GLASS_COLORS[3] },
        { name: 'scikit-learn', feat: '传统机器学习', color: GLASS_COLORS[4] },
        { name: 'OpenCV', feat: '计算机视觉库', color: GLASS_COLORS[5] },
        { name: 'Matplotlib', feat: '数据可视化', color: GLASS_COLORS[0] },
        { name: 'NLTK', feat: '自然语言处理', color: GLASS_COLORS[1] },
      ];
      const n = libs.length;
      const cols = 4, rows = 2;
      const gap = Math.min(14, (rightSafe - leftSafe) * 0.03);
      const cardW = ((rightSafe - leftSafe) - (cols - 1) * gap) / cols;
      const rowGap = Math.min(16, (botSafe - topSafe) * 0.06);
      const cardH = Math.max(20, ((botSafe - topSafe) - rowGap) / rows - 6);
      const y0 = topSafe + 6;

      const T_CARD = 0.7;
      const TOTAL = 0.8 + n * T_CARD + 1.2;
      const stageNames = [
        'Python 第三方库生态',
        ...libs.map(l => `${l.name}：${l.feat}`),
        '丰富第三方库让 Python 成为 AI 第一语言',
      ];
      let stage = -1;
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = 0;
        for (let i = 0; i < n; i++) {
          if (sec > 0.8 + i * T_CARD) curStage = i + 1;
        }
        if (sec > 0.8 + n * T_CARD) curStage = n + 1;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        for (let i = 0; i < n; i++) {
          const r = Math.floor(i / cols), c = i % cols;
          const x = leftSafe + c * (cardW + gap);
          const y = y0 + r * (cardH + rowGap);
          const cardStart = 0.8 + i * T_CARD;
          const popP = easeOutBack(win(sec, cardStart - 0.3, cardStart + 0.4));
          if (popP <= 0) continue;
          const s = Math.max(0, popP);
          const lit = sec > cardStart;
          const lib = libs[i];
          ctx.save();
          ctx.translate(x + cardW / 2, y + cardH / 2); ctx.scale(s, s);
          ctx.shadowColor = lib.color + '55'; ctx.shadowBlur = lit ? 12 : 6;
          ctx.fillStyle = lit ? lib.color + '22' : 'rgba(255,255,255,0.72)';
          ctx.strokeStyle = lib.color; ctx.lineWidth = 2;
          roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 10); ctx.fill(); ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = lit ? lib.color : '#6c5ce7';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(lib.name, 0, -cardH / 2 + 22);
          ctx.strokeStyle = lib.color + '66'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(-cardW / 2 + 12, -cardH / 2 + 36); ctx.lineTo(cardW / 2 - 12, -cardH / 2 + 36); ctx.stroke();
          ctx.fillStyle = lit ? '#4a3f80' : '#6e6890';
          ctx.font = '12px sans-serif';
          wrapText(ctx, lib.feat, 0, 2, cardW - 16, 14);
          ctx.restore();
        }

        const sumP = easeOutCubic(win(sec, 0.8 + n * T_CARD, 0.8 + n * T_CARD + 0.8));
        if (sumP > 0) {
          ctx.save(); ctx.globalAlpha = sumP;
          glassPanel(ctx, 44, botSafe - 28, W - 88, 22, 8, 0.6);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('丰富第三方库让 Python 成为 AI 第一语言', W / 2, botSafe - 17);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // —— 内置 canvas 模板 59：智能驾驶系统组成（感知/决策/控制/执行）——
  registerCanvas('auto-driving-system', {
    title: TEMPLATE_TITLES['auto-driving-system'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;

      const mods = [
        { name: '环境感知', io: '摄像头/雷达/激光雷达', detail: '检测车道/行人/车辆/标志', color: GLASS_COLORS[0] },
        { name: '路径决策', io: '定位+地图+规划', detail: '高精地图匹配+路径规划', color: GLASS_COLORS[1] },
        { name: '行为控制', io: '决策→动作指令', detail: '转向/加减速/刹车指令', color: GLASS_COLORS[2] },
        { name: '底盘执行', io: '线控转向/油门', detail: '执行机构响应动作', color: GLASS_COLORS[3] },
      ];
      const n = mods.length;
      const arrowW = 26;
      const boxW = ((rightSafe - leftSafe) - (n - 1) * arrowW) / n;
      const boxH = Math.max(40, botSafe - topSafe - 50);
      const y = topSafe + 6;

      const T_BOX = 1.3;
      const TOTAL = 0.8 + n * T_BOX + 1.2;
      const stageNames = [
        '智能驾驶系统组成',
        ...mods.map(m => `模块：${m.name}（${m.io}）— ${m.detail}`),
        '感知→决策→控制→执行：智能驾驶的闭环链路',
      ];
      let stage = -1;
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = 0;
        for (let i = 0; i < n; i++) {
          if (sec > 0.8 + i * T_BOX) curStage = i + 1;
        }
        if (sec > 0.8 + n * T_BOX) curStage = n + 1;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 箭头
        for (let i = 0; i < n - 1; i++) {
          const boxStart = 0.8 + i * T_BOX;
          const arrP = easeOutCubic(win(sec, boxStart + 0.3, boxStart + 0.9));
          if (arrP <= 0) continue;
          const x = leftSafe + (i + 1) * boxW + i * arrowW;
          const cy = y + boxH / 2;
          ctx.save(); ctx.globalAlpha = arrP;
          ctx.strokeStyle = GLASS_COLORS[4]; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x + arrowW, cy); ctx.stroke();
          ctx.fillStyle = GLASS_COLORS[4];
          ctx.beginPath(); ctx.moveTo(x + arrowW, cy); ctx.lineTo(x + arrowW - 7, cy - 5); ctx.lineTo(x + arrowW - 7, cy + 5); ctx.closePath(); ctx.fill();
          ctx.restore();
        }

        for (let i = 0; i < n; i++) {
          const x = leftSafe + i * (boxW + arrowW);
          const boxStart = 0.8 + i * T_BOX;
          const popP = easeOutBack(win(sec, boxStart - 0.3, boxStart + 0.4));
          if (popP <= 0) continue;
          const s = Math.max(0, popP);
          const lit = sec > boxStart;
          const m = mods[i];
          ctx.save();
          ctx.translate(x + boxW / 2, y + boxH / 2); ctx.scale(s, s);
          ctx.shadowColor = m.color + '55'; ctx.shadowBlur = lit ? 12 : 6;
          ctx.fillStyle = lit ? m.color + '22' : 'rgba(255,255,255,0.72)';
          ctx.strokeStyle = m.color; ctx.lineWidth = 2;
          roundRect(ctx, -boxW / 2, -boxH / 2, boxW, boxH, 10); ctx.fill(); ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = lit ? m.color : '#6c5ce7';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(m.name, 0, -boxH / 2 + 22);
          ctx.strokeStyle = m.color + '66'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(-boxW / 2 + 10, -boxH / 2 + 36); ctx.lineTo(boxW / 2 - 10, -boxH / 2 + 36); ctx.stroke();
          ctx.fillStyle = lit ? m.color : GLASS_COLORS[3];
          ctx.font = 'bold 11px sans-serif';
          wrapText(ctx, m.io, 0, -boxH / 2 + 54, boxW - 14, 13);
          ctx.fillStyle = lit ? '#4a3f80' : '#6e6890';
          ctx.font = '12px sans-serif';
          wrapText(ctx, m.detail, 0, 4, boxW - 14, 14);
          ctx.restore();
        }

        const sumP = easeOutCubic(win(sec, 0.8 + n * T_BOX, 0.8 + n * T_BOX + 0.8));
        if (sumP > 0) {
          ctx.save(); ctx.globalAlpha = sumP;
          glassPanel(ctx, 44, botSafe - 28, W - 88, 22, 8, 0.6);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('感知→决策→控制→执行：智能驾驶的闭环链路', W / 2, botSafe - 17);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批12-1: SAE L0-L2 自动驾驶分级（id 323）=====
  registerCanvas('sae-l0-l2', {
    title: TEMPLATE_TITLES['sae-l0-l2'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;

      const levels = [
        { lv: 'L0', name: '无自动化', desc: '驾驶员全权操作', ex: '普通燃油车', color: GLASS_COLORS[0] },
        { lv: 'L1', name: '辅助驾驶', desc: '单一方向辅助', ex: '定速巡航/车道保持', color: GLASS_COLORS[3] },
        { lv: 'L2', name: '部分自动化', desc: '同时控制转向+加减速', ex: '高速公路辅助', color: GLASS_COLORS[2] },
      ];
      const n = levels.length;
      const gap = Math.min(16, (rightSafe - leftSafe) * 0.04);
      const colW = ((rightSafe - leftSafe) - (n - 1) * gap) / n;
      const cardH = Math.max(40, botSafe - topSafe - 50);
      const y = topSafe + 6;

      const T_LV = 1.6;
      const TOTAL = 0.8 + n * T_LV + 1.2;
      const stageNames = [
        'SAE自动驾驶分级 L0 - L2',
        ...levels.map(l => `${l.lv}：${l.name} — ${l.desc}`),
        '自动化程度：L0 < L1 < L2（人类始终需监控路况）',
      ];
      let stage = -1;
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = 0;
        for (let i = 0; i < n; i++) {
          if (sec > 0.8 + i * T_LV) curStage = i + 1;
        }
        if (sec > 0.8 + n * T_LV) curStage = n + 1;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        for (let i = 0; i < n; i++) {
          const x = leftSafe + i * (colW + gap);
          const lvStart = 0.8 + i * T_LV;
          const popP = easeOutBack(win(sec, lvStart - 0.3, lvStart + 0.4));
          if (popP <= 0) continue;
          const s = Math.max(0, popP);
          const lit = sec > lvStart;
          const lv = levels[i];
          ctx.save();
          ctx.translate(x + colW / 2, y + cardH / 2); ctx.scale(s, s);
          ctx.shadowColor = lv.color + '55'; ctx.shadowBlur = lit ? 12 : 6;
          ctx.fillStyle = lit ? lv.color + '18' : 'rgba(255,255,255,0.72)';
          ctx.strokeStyle = lv.color; ctx.lineWidth = 2;
          roundRect(ctx, -colW / 2, -cardH / 2, colW, cardH, 12); ctx.fill(); ctx.stroke();
          ctx.shadowColor = 'transparent';
          // 等级徽章
          ctx.shadowColor = lv.color + '66'; ctx.shadowBlur = lit ? 10 : 5;
          ctx.beginPath(); ctx.arc(0, -cardH / 2 + 30, 17, 0, Math.PI * 2);
          ctx.fillStyle = lit ? lv.color : '#fff'; ctx.fill();
          ctx.strokeStyle = lv.color; ctx.lineWidth = 2; ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = lit ? '#fff' : lv.color; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(lv.lv, 0, -cardH / 2 + 31);
          // 名称
          ctx.fillStyle = lit ? lv.color : '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(lv.name, 0, -cardH / 2 + 64);
          // 描述
          ctx.fillStyle = lit ? '#4a3f80' : '#6e6890'; ctx.font = '12px sans-serif';
          wrapText(ctx, lv.desc, 0, -cardH / 2 + 86, colW - 16, 14);
          // 示例
          ctx.fillStyle = lit ? lv.color : GLASS_COLORS[3]; ctx.font = 'bold 11px sans-serif';
          wrapText(ctx, '示例：' + lv.ex, 0, cardH / 2 - 30, colW - 16, 13);
          ctx.restore();
        }

        const sumP = easeOutCubic(win(sec, 0.8 + n * T_LV, 0.8 + n * T_LV + 0.8));
        if (sumP > 0) {
          ctx.save(); ctx.globalAlpha = sumP;
          glassPanel(ctx, 44, botSafe - 28, W - 88, 22, 8, 0.6);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('自动化程度：L0 < L1 < L2（人类始终需监控路况）', W / 2, botSafe - 17);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批12-2: SAE L3-L5 自动驾驶分级（id 324）=====
  registerCanvas('sae-l3-l5', {
    title: TEMPLATE_TITLES['sae-l3-l5'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;

      const levels = [
        { lv: 'L3', name: '条件自动化', desc: '特定场景脱手/脱眼', ex: '高速拥堵自动跟车', color: GLASS_COLORS[1] },
        { lv: 'L4', name: '高度自动化', desc: '限定区域全自动驾驶', ex: 'Robotaxi运营区', color: GLASS_COLORS[2] },
        { lv: 'L5', name: '完全自动化', desc: '全场景全天候无人', ex: '（研发目标）', color: GLASS_COLORS[4] },
      ];
      const n = levels.length;
      const gap = Math.min(16, (rightSafe - leftSafe) * 0.04);
      const colW = ((rightSafe - leftSafe) - (n - 1) * gap) / n;
      const cardH = Math.max(40, botSafe - topSafe - 50);
      const y = topSafe + 6;

      const T_LV = 1.6;
      const TOTAL = 0.8 + n * T_LV + 1.2;
      const stageNames = [
        'SAE自动驾驶分级 L3 - L5',
        ...levels.map(l => `${l.lv}：${l.name} — ${l.desc}`),
        '自动化程度：L3 < L4 < L5（L5为终极目标）',
      ];
      let stage = -1;
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = 0;
        for (let i = 0; i < n; i++) {
          if (sec > 0.8 + i * T_LV) curStage = i + 1;
        }
        if (sec > 0.8 + n * T_LV) curStage = n + 1;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        for (let i = 0; i < n; i++) {
          const x = leftSafe + i * (colW + gap);
          const lvStart = 0.8 + i * T_LV;
          const popP = easeOutBack(win(sec, lvStart - 0.3, lvStart + 0.4));
          if (popP <= 0) continue;
          const s = Math.max(0, popP);
          const lit = sec > lvStart;
          const lv = levels[i];
          ctx.save();
          ctx.translate(x + colW / 2, y + cardH / 2); ctx.scale(s, s);
          ctx.shadowColor = lv.color + '55'; ctx.shadowBlur = lit ? 12 : 6;
          ctx.fillStyle = lit ? lv.color + '18' : 'rgba(255,255,255,0.72)';
          ctx.strokeStyle = lv.color; ctx.lineWidth = 2;
          roundRect(ctx, -colW / 2, -cardH / 2, colW, cardH, 12); ctx.fill(); ctx.stroke();
          ctx.shadowColor = 'transparent';
          // 等级徽章
          ctx.shadowColor = lv.color + '66'; ctx.shadowBlur = lit ? 10 : 5;
          ctx.beginPath(); ctx.arc(0, -cardH / 2 + 30, 17, 0, Math.PI * 2);
          ctx.fillStyle = lit ? lv.color : '#fff'; ctx.fill();
          ctx.strokeStyle = lv.color; ctx.lineWidth = 2; ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = lit ? '#fff' : lv.color; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(lv.lv, 0, -cardH / 2 + 31);
          // 名称
          ctx.fillStyle = lit ? lv.color : '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(lv.name, 0, -cardH / 2 + 64);
          // 描述
          ctx.fillStyle = lit ? '#4a3f80' : '#6e6890'; ctx.font = '12px sans-serif';
          wrapText(ctx, lv.desc, 0, -cardH / 2 + 86, colW - 16, 14);
          // 示例
          ctx.fillStyle = lit ? lv.color : GLASS_COLORS[3]; ctx.font = 'bold 11px sans-serif';
          wrapText(ctx, '示例：' + lv.ex, 0, cardH / 2 - 30, colW - 16, 13);
          ctx.restore();
        }

        const sumP = easeOutCubic(win(sec, 0.8 + n * T_LV, 0.8 + n * T_LV + 0.8));
        if (sumP > 0) {
          ctx.save(); ctx.globalAlpha = sumP;
          glassPanel(ctx, 44, botSafe - 28, W - 88, 22, 8, 0.6);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('自动化程度：L3 < L4 < L5（L5为终极目标）', W / 2, botSafe - 17);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批12-3: 智能陪伴机器人（id 325）=====
  registerCanvas('companion-robot', {
    title: TEMPLATE_TITLES['companion-robot'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;

      const caps = [
        { name: '对话理解', detail: '识别语音→意图→回复', color: GLASS_COLORS[0] },
        { name: '情感识别', detail: '表情/语调/文本情绪', color: GLASS_COLORS[2] },
        { name: '语音合成', detail: '文本→自然语音输出', color: GLASS_COLORS[3] },
        { name: '动作行为', detail: '头部/手臂/移动交互', color: GLASS_COLORS[1] },
      ];
      const n = caps.length;
      const gap = Math.min(14, (rightSafe - leftSafe) * 0.03);
      const cardW = ((rightSafe - leftSafe) - (n - 1) * gap) / n;
      const cardH = Math.max(40, botSafe - topSafe - 120);
      const cx = W / 2;
      const cy = topSafe + 36;
      const cardY = topSafe + 100;

      const T_CAP = 1.4;
      const TOTAL = 0.8 + n * T_CAP + 1.2;
      const stageNames = [
        '智能陪伴机器人：四大能力',
        ...caps.map(c => `能力：${c.name} — ${c.detail}`),
        '对话+情感+语音+动作：四能力协同实现陪伴',
      ];
      let stage = -1;
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = 0;
        for (let i = 0; i < n; i++) {
          if (sec > 0.8 + i * T_CAP) curStage = i + 1;
        }
        if (sec > 0.8 + n * T_CAP) curStage = n + 1;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 中心机器人
        const ctrP = easeOutBack(win(sec, 0.2, 0.9));
        if (ctrP > 0) {
          const s = Math.max(0, ctrP);
          ctx.save();
          ctx.translate(cx, cy); ctx.scale(s, s);
          ctx.shadowColor = GLASS_COLORS[4] + '66'; ctx.shadowBlur = 12;
          ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2);
          ctx.fillStyle = GLASS_COLORS[4] + '33'; ctx.fill();
          ctx.strokeStyle = GLASS_COLORS[4]; ctx.lineWidth = 2.2; ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = GLASS_COLORS[4]; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('陪伴', 0, 1);
          ctx.restore();
        }

        // 连线
        for (let i = 0; i < n; i++) {
          const capStart = 0.8 + i * T_CAP;
          const lineP = easeOutCubic(win(sec, capStart, capStart + 0.6));
          if (lineP <= 0) continue;
          const x = leftSafe + i * (cardW + gap) + cardW / 2;
          ctx.save(); ctx.globalAlpha = lineP;
          ctx.strokeStyle = caps[i].color; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.moveTo(cx, cy + 20); ctx.lineTo(x, cardY); ctx.stroke();
          ctx.restore();
        }

        // 卡片
        for (let i = 0; i < n; i++) {
          const x = leftSafe + i * (cardW + gap);
          const capStart = 0.8 + i * T_CAP;
          const popP = easeOutBack(win(sec, capStart - 0.2, capStart + 0.4));
          if (popP <= 0) continue;
          const s = Math.max(0, popP);
          const lit = sec > capStart;
          const c = caps[i];
          ctx.save();
          ctx.translate(x + cardW / 2, cardY + cardH / 2); ctx.scale(s, s);
          ctx.shadowColor = c.color + '55'; ctx.shadowBlur = lit ? 12 : 6;
          ctx.fillStyle = lit ? c.color + '22' : 'rgba(255,255,255,0.72)';
          ctx.strokeStyle = c.color; ctx.lineWidth = 2;
          roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 10); ctx.fill(); ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = lit ? c.color : '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(c.name, 0, -cardH / 2 + 22);
          ctx.strokeStyle = c.color + '66'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(-cardW / 2 + 10, -cardH / 2 + 36); ctx.lineTo(cardW / 2 - 10, -cardH / 2 + 36); ctx.stroke();
          ctx.fillStyle = lit ? '#4a3f80' : '#6e6890'; ctx.font = '12px sans-serif';
          wrapText(ctx, c.detail, 0, 2, cardW - 14, 14);
          ctx.restore();
        }

        const sumP = easeOutCubic(win(sec, 0.8 + n * T_CAP, 0.8 + n * T_CAP + 0.8));
        if (sumP > 0) {
          ctx.save(); ctx.globalAlpha = sumP;
          glassPanel(ctx, 44, botSafe - 28, W - 88, 22, 8, 0.6);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('对话+情感+语音+动作：四能力协同实现陪伴', W / 2, botSafe - 17);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批12-4: AI绘画（id 326）=====
  registerCanvas('ai-art', {
    title: TEMPLATE_TITLES['ai-art'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;

      const stages = [
        { name: '文本提示', ex: '"一只戴墨镜的猫"', color: GLASS_COLORS[0] },
        { name: '文本编码', ex: 'CLIP编码→向量', color: GLASS_COLORS[3] },
        { name: '生成模型', ex: '扩散/生成网络', color: GLASS_COLORS[2] },
        { name: '生成图像', ex: '输出像素图像', color: GLASS_COLORS[1] },
      ];
      const n = stages.length;
      const arrowW = 26;
      const boxW = ((rightSafe - leftSafe) - (n - 1) * arrowW) / n;
      const boxH = Math.max(40, botSafe - topSafe - 50);
      const y = topSafe + 6;

      const T_STAGE = 1.4;
      const TOTAL = 0.8 + n * T_STAGE + 1.2;
      const stageNames = [
        'AI绘画pipeline：文本 → 编码 → 生成 → 图像',
        ...stages.map(s => `阶段：${s.name} — ${s.ex}`),
        '文本到图像：生成模型把语言描述变为视觉作品',
      ];
      let stage = -1;
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = 0;
        for (let i = 0; i < n; i++) {
          if (sec > 0.8 + i * T_STAGE) curStage = i + 1;
        }
        if (sec > 0.8 + n * T_STAGE) curStage = n + 1;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 箭头
        for (let i = 0; i < n - 1; i++) {
          const stStart = 0.8 + i * T_STAGE;
          const arrP = easeOutCubic(win(sec, stStart + 0.3, stStart + 0.9));
          if (arrP <= 0) continue;
          const x = leftSafe + (i + 1) * boxW + i * arrowW;
          const cy = y + boxH / 2;
          ctx.save(); ctx.globalAlpha = arrP;
          ctx.strokeStyle = GLASS_COLORS[4]; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x + arrowW, cy); ctx.stroke();
          ctx.fillStyle = GLASS_COLORS[4];
          ctx.beginPath(); ctx.moveTo(x + arrowW, cy); ctx.lineTo(x + arrowW - 7, cy - 5); ctx.lineTo(x + arrowW - 7, cy + 5); ctx.closePath(); ctx.fill();
          ctx.restore();
        }

        for (let i = 0; i < n; i++) {
          const x = leftSafe + i * (boxW + arrowW);
          const stStart = 0.8 + i * T_STAGE;
          const popP = easeOutBack(win(sec, stStart - 0.3, stStart + 0.4));
          if (popP <= 0) continue;
          const s = Math.max(0, popP);
          const lit = sec > stStart;
          const st = stages[i];
          ctx.save();
          ctx.translate(x + boxW / 2, y + boxH / 2); ctx.scale(s, s);
          ctx.shadowColor = st.color + '55'; ctx.shadowBlur = lit ? 12 : 6;
          ctx.fillStyle = lit ? st.color + '22' : 'rgba(255,255,255,0.72)';
          ctx.strokeStyle = st.color; ctx.lineWidth = 2;
          roundRect(ctx, -boxW / 2, -boxH / 2, boxW, boxH, 10); ctx.fill(); ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = lit ? st.color : '#6c5ce7';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(st.name, 0, -boxH / 2 + 26);
          ctx.strokeStyle = st.color + '66'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(-boxW / 2 + 10, -boxH / 2 + 40); ctx.lineTo(boxW / 2 - 10, -boxH / 2 + 40); ctx.stroke();
          ctx.fillStyle = lit ? '#4a3f80' : '#6e6890';
          ctx.font = '12px sans-serif';
          wrapText(ctx, st.ex, 0, 2, boxW - 14, 14);
          ctx.restore();
        }

        const sumP = easeOutCubic(win(sec, 0.8 + n * T_STAGE, 0.8 + n * T_STAGE + 0.8));
        if (sumP > 0) {
          ctx.save(); ctx.globalAlpha = sumP;
          glassPanel(ctx, 44, botSafe - 28, W - 88, 22, 8, 0.6);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('文本到图像：生成模型把语言描述变为视觉作品', W / 2, botSafe - 17);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批12-5: AI音乐生成（id 327）=====
  registerCanvas('ai-music', {
    title: TEMPLATE_TITLES['ai-music'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;

      const elements = [
        { name: '旋律', desc: '主旋律音符序列', color: GLASS_COLORS[0] },
        { name: '和声', desc: '多声部协调配置', color: GLASS_COLORS[2] },
        { name: '节奏', desc: '节拍强弱与速度', color: GLASS_COLORS[1] },
      ];
      const n = elements.length;
      const gap = Math.min(16, (rightSafe - leftSafe) * 0.04);
      const colW = ((rightSafe - leftSafe) - (n - 1) * gap) / n;
      const avail = botSafe - topSafe - 50;
      const cardH = Math.max(40, avail * 0.5);
      const waveH = Math.max(20, avail - cardH - 14);
      const y = topSafe + 6;
      const waveY = y + cardH + 14;

      const T_EL = 1.7;
      const TOTAL = 0.8 + n * T_EL + 1.2;
      const stageNames = [
        'AI音乐生成：三要素协同',
        ...elements.map(e => `要素：${e.name} — ${e.desc}`),
        '旋律+和声+节奏：模型学习乐理后生成新曲',
      ];
      let stage = -1;
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = 0;
        for (let i = 0; i < n; i++) {
          if (sec > 0.8 + i * T_EL) curStage = i + 1;
        }
        if (sec > 0.8 + n * T_EL) curStage = n + 1;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        for (let i = 0; i < n; i++) {
          const x = leftSafe + i * (colW + gap);
          const elStart = 0.8 + i * T_EL;
          const popP = easeOutBack(win(sec, elStart - 0.3, elStart + 0.4));
          if (popP <= 0) continue;
          const s = Math.max(0, popP);
          const lit = sec > elStart;
          const e = elements[i];
          ctx.save();
          ctx.translate(x + colW / 2, y + cardH / 2); ctx.scale(s, s);
          ctx.shadowColor = e.color + '55'; ctx.shadowBlur = lit ? 12 : 6;
          ctx.fillStyle = lit ? e.color + '22' : 'rgba(255,255,255,0.72)';
          ctx.strokeStyle = e.color; ctx.lineWidth = 2;
          roundRect(ctx, -colW / 2, -cardH / 2, colW, cardH, 10); ctx.fill(); ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = lit ? e.color : '#6c5ce7';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(e.name, 0, -cardH / 2 + 22);
          ctx.strokeStyle = e.color + '66'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(-colW / 2 + 12, -cardH / 2 + 36); ctx.lineTo(colW / 2 - 12, -cardH / 2 + 36); ctx.stroke();
          ctx.fillStyle = lit ? '#4a3f80' : '#6e6890';
          ctx.font = '12px sans-serif';
          wrapText(ctx, e.desc, 0, 2, colW - 14, 14);
          ctx.restore();

          // 波形
          const wvP = easeOutCubic(win(sec, elStart + 0.2, elStart + 0.7));
          if (wvP > 0) {
            ctx.save(); ctx.globalAlpha = wvP;
            ctx.strokeStyle = e.color; ctx.lineWidth = 1.8;
            ctx.beginPath();
            const steps = 40;
            for (let k = 0; k <= steps; k++) {
              const px = x + (colW - 20) * (k / steps);
              const phase = sec * 4 + i * 1.5 + k * 0.4;
              const yy = waveY + waveH / 2 + Math.sin(phase) * (waveH * 0.38) * (0.6 + 0.4 * Math.sin(phase * 0.7));
              if (k === 0) ctx.moveTo(px + 10, yy);
              else ctx.lineTo(px + 10, yy);
            }
            ctx.stroke();
            ctx.restore();
          }
        }

        const sumP = easeOutCubic(win(sec, 0.8 + n * T_EL, 0.8 + n * T_EL + 0.8));
        if (sumP > 0) {
          ctx.save(); ctx.globalAlpha = sumP;
          glassPanel(ctx, 44, botSafe - 28, W - 88, 22, 8, 0.6);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('旋律+和声+节奏：模型学习乐理后生成新曲', W / 2, botSafe - 17);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批12-6: GAN结构（id 328）=====
  registerCanvas('gan-structure', {
    title: TEMPLATE_TITLES['gan-structure'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      const topSafe = 82, botSafe = H - 62, leftSafe = 44, rightSafe = W - 44;
      const span = rightSafe - leftSafe;
      const midY = (topSafe + botSafe) / 2;

      // 节点：噪声z -> 生成器G -> 假图/真图 -> 判别器D -> 真/假
      const xs = [leftSafe + 0.08 * span, leftSafe + 0.26 * span, leftSafe + 0.48 * span, leftSafe + 0.48 * span, leftSafe + 0.70 * span, leftSafe + 0.92 * span];
      const R = 17;
      const panelW = Math.max(50, 0.16 * span);
      const panelH = Math.max(60, (botSafe - topSafe) * 0.42);

      const nodes = [
        { lbl: '噪声 z', color: GLASS_COLORS[3], isPanel: false },
        { lbl: '生成器 G', sub: 'G(z)', color: GLASS_COLORS[0], isPanel: true },
        { lbl: '假图 G(z)', color: GLASS_COLORS[2], isPanel: false },
        { lbl: '真图 x', color: GLASS_COLORS[5], isPanel: false },
        { lbl: '判别器 D', sub: 'D(x)', color: GLASS_COLORS[1], isPanel: true },
        { lbl: '真/假', color: GLASS_COLORS[4], isPanel: false },
      ];
      const nys = [midY, midY, midY - 48, midY + 48, midY, midY];
      // 边：z->G, G->假图, G->真图, 假图->D, 真图->D, D->输出
      const edges = [[0, 1], [1, 2], [1, 3], [2, 4], [3, 4], [4, 5]];

      const T_NODE = 0.95;
      const TOTAL = 0.8 + nodes.length * T_NODE + 1.2;
      const stageNames = [
        'GAN结构：生成器G与判别器D对抗',
        '噪声 z：随机向量作为生成器输入',
        '生成器 G：把噪声映射为假图 G(z)',
        '假图 G(z)：生成器产出的样本',
        '真图 x：来自训练集的真实样本',
        '判别器 D：区分真图与假图',
        '真/假：判别器输出概率',
        'G与D博弈：相互提升直到假图逼近真图',
      ];
      let stage = -1;
      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = 0;
        for (let i = 0; i < nodes.length; i++) {
          if (sec > 0.8 + i * T_NODE) curStage = i + 1;
        }
        if (sec > 0.8 + nodes.length * T_NODE) curStage = nodes.length + 1;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 边（带流动）
        edges.forEach(([a, b], ei) => {
          const aStart = 0.8 + a * T_NODE;
          const bStart = 0.8 + b * T_NODE;
          const lineP = easeOutCubic(win(sec, Math.min(aStart, bStart) + 0.2, Math.max(aStart, bStart) + 0.6));
          if (lineP <= 0) return;
          const ax = nodes[a].isPanel ? xs[a] + panelW / 2 : xs[a];
          const ay = nys[a];
          const bx = nodes[b].isPanel ? xs[b] - panelW / 2 : xs[b];
          const by = nys[b];
          ctx.save(); ctx.globalAlpha = lineP;
          ctx.strokeStyle = GLASS_COLORS[4]; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
          // 流动小圆点
          const flowT = ((sec * 0.8 + ei * 0.3) % 1);
          if (flowT > 0.05 && flowT < 0.95) {
            const fx = ax + (bx - ax) * flowT;
            const fy = ay + (by - ay) * flowT;
            ctx.fillStyle = GLASS_COLORS[4];
            ctx.beginPath(); ctx.arc(fx, fy, 3.5, 0, Math.PI * 2); ctx.fill();
          }
          ctx.restore();
        });

        // 节点
        nodes.forEach((nd, i) => {
          const nodeStart = 0.8 + i * T_NODE;
          const popP = easeOutBack(win(sec, nodeStart - 0.3, nodeStart + 0.4));
          if (popP <= 0) return;
          const s = Math.max(0, popP);
          const lit = sec > nodeStart;
          ctx.save();
          ctx.translate(xs[i], nys[i]); ctx.scale(s, s);
          if (nd.isPanel) {
            ctx.shadowColor = nd.color + '55'; ctx.shadowBlur = lit ? 12 : 6;
            ctx.fillStyle = lit ? nd.color + '22' : 'rgba(255,255,255,0.72)';
            ctx.strokeStyle = nd.color; ctx.lineWidth = 2;
            roundRect(ctx, -panelW / 2, -panelH / 2, panelW, panelH, 10); ctx.fill(); ctx.stroke();
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = lit ? nd.color : '#6c5ce7';
            ctx.font = 'bold 13px sans-serif';
            ctx.fillText(nd.lbl, 0, -6);
            ctx.fillStyle = lit ? '#4a3f80' : '#6e6890';
            ctx.font = '11px sans-serif';
            ctx.fillText(nd.sub, 0, 12);
          } else {
            ctx.shadowColor = nd.color + '66'; ctx.shadowBlur = lit ? 10 : 5;
            ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2);
            ctx.fillStyle = lit ? nd.color : '#fff'; ctx.fill();
            ctx.strokeStyle = nd.color; ctx.lineWidth = 2; ctx.stroke();
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = lit ? '#fff' : nd.color;
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText(nd.lbl, 0, 1);
          }
          ctx.restore();
        });

        // G/D 目标标注
        const gGoalP = easeOutCubic(win(sec, 0.8 + 1 * T_NODE + 0.3, 0.8 + 1 * T_NODE + 0.9));
        if (gGoalP > 0) {
          ctx.save(); ctx.globalAlpha = gGoalP;
          ctx.fillStyle = GLASS_COLORS[0]; ctx.font = 'bold 11px sans-serif';
          ctx.fillText('G目标：骗过D', xs[1], nys[1] - panelH / 2 - 12);
          ctx.restore();
        }
        const dGoalP = easeOutCubic(win(sec, 0.8 + 4 * T_NODE + 0.3, 0.8 + 4 * T_NODE + 0.9));
        if (dGoalP > 0) {
          ctx.save(); ctx.globalAlpha = dGoalP;
          ctx.fillStyle = GLASS_COLORS[1]; ctx.font = 'bold 11px sans-serif';
          ctx.fillText('D目标：分清真/假', xs[4], nys[4] - panelH / 2 - 12);
          ctx.restore();
        }

        // 底部结论
        const sumP = easeOutCubic(win(sec, 0.8 + nodes.length * T_NODE, 0.8 + nodes.length * T_NODE + 0.8));
        if (sumP > 0) {
          ctx.save(); ctx.globalAlpha = sumP;
          glassPanel(ctx, 44, botSafe - 28, W - 88, 22, 8, 0.6);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('G与D博弈：相互提升直到假图逼近真图', W / 2, botSafe - 17);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批12-7: GAN对抗训练（id 329）=====
  registerCanvas('gan-training', {
    title: TEMPLATE_TITLES['gan-training'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const steps = [
        { name: '采样真图 x', clr: GLASS_COLORS[0] },
        { name: 'G 生成假图', clr: GLASS_COLORS[3] },
        { name: 'D 判别真伪', clr: GLASS_COLORS[1] },
        { name: '计算损失', clr: GLASS_COLORS[2] },
        { name: '更新 G 与 D', clr: GLASS_COLORS[4] },
      ];
      const N = steps.length;
      const R = 20;
      const topSafe = 82, botSafe = H - 62;
      const cx = W / 2, cy = (topSafe + botSafe) / 2;
      const ringR = Math.max(70, Math.min(W / 2 - 70, (botSafe - topSafe) / 2 - 40));

      const nodePos = steps.map((_, i) => {
        const ang = -Math.PI / 2 + (i / N) * Math.PI * 2;
        return { x: cx + ringR * Math.cos(ang), y: cy + ringR * Math.sin(ang) };
      });

      const T_STAGGER = 0.75;
      const T_POP = 0.5;
      const T_CYCLE_START = 0.1 + (N - 1) * T_STAGGER + T_POP + 0.3;
      const T_CYCLE = 3.0;
      const TOTAL = T_CYCLE_START + T_CYCLE + 0.5;

      let stage = -1;
      const stageNames = [
        '① 采样真实样本 x，作为判别器的正样本',
        '② 生成器 G 接收随机噪声 z，输出假图 G(z)',
        '③ 判别器 D 区分真图与假图，输出真伪概率',
        '④ 依据判别结果计算 D 损失与 G 损失',
        '⑤ 反向传播，交替更新 G 与 D 的网络参数',
        '循环迭代：G 生成越逼真，D 越难区分，逐步收敛',
        'GAN 对抗训练收敛：生成器以假乱真，达到纳什均衡',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = N;
        for (let i = 0; i < N; i++) {
          const t0 = 0.1 + i * T_STAGGER;
          if (sec < t0 + T_POP) { curStage = i; break; }
        }
        if (sec >= T_CYCLE_START + T_CYCLE) curStage = N + 1;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 环形连线
        const ringAlpha = easeOutCubic(win(sec, 0.1, 1.0));
        if (ringAlpha > 0) {
          ctx.strokeStyle = `rgba(108,92,231,${0.35 * ringAlpha})`;
          ctx.lineWidth = 1.8;
          for (let i = 0; i < N; i++) {
            const a = nodePos[i], b = nodePos[(i + 1) % N];
            const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
            const ux = dx / len, uy = dy / len;
            ctx.beginPath();
            ctx.moveTo(a.x + ux * R, a.y + uy * R);
            ctx.lineTo(b.x - ux * R, b.y - uy * R);
            ctx.stroke();
          }
        }

        // 节点（编号在内，名称在外）
        nodePos.forEach((np, i) => {
          const t0 = 0.1 + i * T_STAGGER;
          const pop = easeOutBack(win(sec, t0, t0 + T_POP));
          if (pop <= 0) return;
          const lit = sec > t0 + T_POP * 0.55;
          ctx.save();
          ctx.translate(np.x, np.y); ctx.scale(Math.max(0, pop), Math.max(0, pop));
          ctx.shadowColor = 'rgba(124,99,224,0.3)'; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2);
          ctx.fillStyle = lit ? steps[i].clr : '#fff';
          ctx.strokeStyle = steps[i].clr; ctx.lineWidth = 2;
          ctx.fill(); ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.beginPath(); ctx.arc(-4, -4, R * 0.26, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = lit ? '#fff' : '#312a5c';
          ctx.font = 'bold 15px sans-serif';
          ctx.fillText(String(i + 1), 0, 1);
          ctx.restore();
          if (pop > 0.5) {
            ctx.globalAlpha = easeOutCubic(win(sec, t0 + 0.15, t0 + 0.4));
            ctx.fillStyle = '#312a5c'; ctx.font = 'bold 12px sans-serif';
            ctx.fillText(steps[i].name, np.x, np.y + R + 16);
            ctx.globalAlpha = 1;
          }
        });

        // 循环运动指示点
        if (sec > T_CYCLE_START) {
          const cycleP = clamp01((sec - T_CYCLE_START) / T_CYCLE);
          const rot = cycleP * Math.PI * 4;
          const ax = cx + ringR * Math.cos(-Math.PI / 2 + rot);
          const ay = cy + ringR * Math.sin(-Math.PI / 2 + rot);
          ctx.strokeStyle = 'rgba(108,92,231,0.45)'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(ax, ay, 12, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = '#6c5ce7';
          ctx.beginPath(); ctx.arc(ax, ay, 5, 0, Math.PI * 2); ctx.fill();
        }

        // 中心：迭代次数递增 → 收敛
        const iterP = win(sec, T_CYCLE_START, T_CYCLE_START + T_CYCLE * 0.85);
        const iter = Math.floor(iterP * 150);
        ctx.fillStyle = '#312a5c'; ctx.font = 'bold 14px sans-serif';
        ctx.fillText('迭代 ' + iter + ' 轮', cx, cy - 8);
        ctx.fillStyle = iterP >= 1 ? '#6c5ce7' : '#6e6890'; ctx.font = 'bold 12px sans-serif';
        ctx.fillText(iterP >= 1 ? '→ 收敛' : '训练中…', cx, cy + 12);
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批13-1: 安全隐患（一）技术缺陷/黑箱/非法控制（id 330）=====
  registerCanvas('safety-risk-1', {
    title: TEMPLATE_TITLES['safety-risk-1'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const risks = [
        { name: '技术缺陷', desc: '算法漏洞或传感器失灵导致系统误判', ex: '自动驾驶识别失败' },
        { name: '黑箱问题', desc: '深度学习决策过程不可解释', ex: '医生无法理解诊断依据' },
        { name: '非法控制', desc: 'AI 被恶意操控或遭受网络攻击', ex: '入侵智能设备' },
      ];
      const N = risks.length;
      const topSafe = 82, botSafe = H - 62;
      const padX = 44, gap = 16;
      const colW = Math.max(60, (W - padX * 2 - gap * (N - 1)) / N);
      const panelY = topSafe;
      const panelH = Math.max(140, botSafe - topSafe - 6);

      const T_STAGGER = 1.85;
      const T_POP = 0.55;
      const TOTAL = 0.1 + (N - 1) * T_STAGGER + T_POP + 2.3;

      let stage = -1;
      const stageNames = [
        '风险1：技术缺陷 — 算法漏洞或传感器失灵导致误判（如自动驾驶识别失败）',
        '风险2：黑箱问题 — 深度学习决策不可解释（如医生无法理解诊断依据）',
        '风险3：非法控制 — AI 被恶意操控或攻击（如入侵智能设备）',
        'AI 安全隐患（一）：技术缺陷、黑箱、非法控制需多维防护',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = N;
        for (let i = 0; i < N; i++) {
          const t0 = 0.1 + i * T_STAGGER;
          if (sec < t0 + T_POP) { curStage = i; break; }
        }
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        risks.forEach((r, i) => {
          const x = padX + i * (colW + gap);
          const t0 = 0.1 + i * T_STAGGER;
          const pop = easeOutBack(win(sec, t0, t0 + T_POP));
          if (pop <= 0) return;
          const s = Math.max(0, pop);
          ctx.save();
          ctx.translate(x + colW / 2, panelY + panelH / 2);
          ctx.scale(s, s);
          glassPanel(ctx, -colW / 2, -panelH / 2, colW, panelH, 12);
          ctx.fillStyle = GLASS_COLORS[i % GLASS_COLORS.length];
          roundRect(ctx, -colW / 2 + 8, -panelH / 2 + 8, colW - 16, 7, 3); ctx.fill();
          ctx.restore();

          if (pop > 0.55) {
            ctx.globalAlpha = easeOutCubic(win(sec, t0 + 0.18, t0 + 0.45));
            ctx.fillStyle = '#312a5c'; ctx.font = 'bold 15px sans-serif';
            ctx.fillText(r.name, x + colW / 2, panelY + 34);
            ctx.fillStyle = '#4a3f6b'; ctx.font = '12px sans-serif';
            wrapText(ctx, r.desc, x + colW / 2, panelY + 64, colW - 22, 15);
            ctx.fillStyle = '#6c5ce7'; ctx.font = '11px sans-serif';
            wrapText(ctx, '示例：' + r.ex, x + colW / 2, panelY + panelH - 30, colW - 22, 13);
            ctx.globalAlpha = 1;
          }
        });
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批13-2: 安全隐患（二）隐私侵犯/技术滥用（id 331）=====
  registerCanvas('safety-risk-2', {
    title: TEMPLATE_TITLES['safety-risk-2'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const risks = [
        { name: '隐私侵犯', desc: '数据采集、人脸识别、行为追踪', ex: '未经授权收集个人信息' },
        { name: '技术滥用', desc: '深度伪造、自动化攻击、算法歧视', ex: 'Deepfake 造假视频' },
      ];
      const N = risks.length;
      const topSafe = 82, botSafe = H - 62;
      const padX = 44, gap = 22;
      const colW = Math.max(80, (W - padX * 2 - gap * (N - 1)) / N);
      const panelY = topSafe;
      const panelH = Math.max(180, botSafe - topSafe - 6);

      const T_STAGGER = 2.6;
      const T_POP = 0.6;
      const TOTAL = 0.1 + (N - 1) * T_STAGGER + T_POP + 3.7;

      let stage = -1;
      const stageNames = [
        '风险1：隐私侵犯 — 数据采集、人脸识别、行为追踪（如未经授权收集个人信息）',
        '风险2：技术滥用 — 深度伪造、自动化攻击、算法歧视（如 Deepfake 造假视频）',
        'AI 安全隐患（二）：隐私侵犯与技术滥用，需立法与伦理并重',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = N;
        for (let i = 0; i < N; i++) {
          const t0 = 0.1 + i * T_STAGGER;
          if (sec < t0 + T_POP) { curStage = i; break; }
        }
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        risks.forEach((r, i) => {
          const x = padX + i * (colW + gap);
          const t0 = 0.1 + i * T_STAGGER;
          const pop = easeOutBack(win(sec, t0, t0 + T_POP));
          if (pop <= 0) return;
          const s = Math.max(0, pop);
          ctx.save();
          ctx.translate(x + colW / 2, panelY + panelH / 2);
          ctx.scale(s, s);
          glassPanel(ctx, -colW / 2, -panelH / 2, colW, panelH, 14);
          ctx.fillStyle = GLASS_COLORS[i % GLASS_COLORS.length];
          roundRect(ctx, -colW / 2 + 10, -panelH / 2 + 10, colW - 20, 8, 4); ctx.fill();
          ctx.restore();

          if (pop > 0.55) {
            ctx.globalAlpha = easeOutCubic(win(sec, t0 + 0.18, t0 + 0.45));
            ctx.fillStyle = '#312a5c'; ctx.font = 'bold 16px sans-serif';
            ctx.fillText(r.name, x + colW / 2, panelY + 42);
            ctx.fillStyle = '#4a3f6b'; ctx.font = '13px sans-serif';
            wrapText(ctx, r.desc, x + colW / 2, panelY + 82, colW - 30, 17);
            ctx.fillStyle = '#6c5ce7'; ctx.font = '12px sans-serif';
            wrapText(ctx, '示例：' + r.ex, x + colW / 2, panelY + panelH - 40, colW - 30, 15);
            ctx.globalAlpha = 1;
          }
        });
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批13-3: 技术奇点与经济奇点（id 332）=====
  registerCanvas('singularity', {
    title: TEMPLATE_TITLES['singularity'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const topSafe = 82, botSafe = H - 62;
      const x0 = 56, y0 = botSafe - 18, x1 = W - 50, y1 = topSafe + 8;
      const growth = (t) => Math.pow(t, 3.2); // 指数式加速增长

      // 奇点与经济奇点在曲线上的位置
      const singT = 0.96;
      const econT = 0.52;
      const singX = x0 + (x1 - x0) * singT;
      const singY = y0 - (y0 - y1) * growth(singT);
      const econX = x0 + (x1 - x0) * econT;
      const econY = y0 - (y0 - y1) * growth(econT);

      const T_AXIS = 0.7;
      const T_CURVE = 3.0;
      const T_CURVE_START = 0.8;
      const T_SING = 1.0;
      const T_ECON = 1.0;
      const T_ECON_START = T_CURVE_START + T_CURVE + T_SING + 0.1;
      const TOTAL = T_ECON_START + T_ECON + 0.6;

      let stage = -1;
      const stageNames = [
        '坐标系：横轴为时间，纵轴为 AI 能力',
        'AI 能力随时间呈指数式加速增长',
        '技术奇点：AI 能力超越人类水平',
        '经济奇点：AI 大规模替代劳动，就业结构重构',
        '技术奇点（能力跃升）+ 经济奇点（就业重构）引发社会变革',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        // 内容容器玻璃面板
        glassPanel(ctx, 28, topSafe - 8, W - 56, botSafe - topSafe + 24, 16, 0.55);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = 0;
        if (sec >= T_CURVE_START) curStage = 1;
        if (sec >= T_CURVE_START + T_CURVE) curStage = 2;
        if (sec >= T_ECON_START) curStage = 3;
        if (sec >= T_ECON_START + T_ECON) curStage = 4;
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 坐标轴
        const axisA = easeOutCubic(win(sec, 0.1, 0.1 + T_AXIS));
        if (axisA > 0) {
          ctx.strokeStyle = `rgba(110,104,144,${0.7 * axisA})`; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y1); ctx.stroke();
          // 箭头
          ctx.fillStyle = `rgba(110,104,144,${0.7 * axisA})`;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - 5, y1 + 8); ctx.lineTo(x1 + 5, y1 + 8); ctx.fill();
          ctx.fillStyle = '#5a5278'; ctx.font = '12px sans-serif';
          ctx.globalAlpha = axisA;
          ctx.fillText('时间', (x0 + x1) / 2, y0 + 16);
          ctx.save();
          ctx.translate(x0 - 14, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2);
          ctx.fillText('AI 能力', 0, 0);
          ctx.restore();
          ctx.globalAlpha = 1;
        }

        // 指数曲线（从左到右绘制）
        const curveP = easeOutCubic(win(sec, T_CURVE_START, T_CURVE_START + T_CURVE));
        if (curveP > 0) {
          ctx.strokeStyle = '#6c5ce7'; ctx.lineWidth = 2.4;
          ctx.shadowColor = 'rgba(108,92,231,0.4)'; ctx.shadowBlur = 6;
          ctx.beginPath();
          const steps = 80;
          const drawEnd = Math.floor(steps * curveP);
          for (let i = 0; i <= drawEnd; i++) {
            const t = i / steps;
            const px = x0 + (x1 - x0) * t;
            const py = y0 - (y0 - y1) * growth(t);
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.shadowColor = 'transparent';
          // 曲线末端光点
          if (curveP < 1) {
            const lt = curveP;
            const lx = x0 + (x1 - x0) * lt;
            const ly = y0 - (y0 - y1) * growth(lt);
            ctx.fillStyle = '#f0a8d8';
            ctx.beginPath(); ctx.arc(lx, ly, 5, 0, Math.PI * 2); ctx.fill();
          }
        }

        // 经济奇点标注（技术奇点之后出现，t=0.52）
        const econPop = easeOutBack(win(sec, T_ECON_START, T_ECON_START + T_ECON));
        if (econPop > 0) {
          ctx.save();
          ctx.translate(econX, econY); ctx.scale(Math.max(0, econPop), Math.max(0, econPop));
          ctx.fillStyle = GLASS_COLORS[1];
          ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
          ctx.restore();
          if (econPop > 0.6) {
            ctx.globalAlpha = easeOutCubic(win(sec, T_ECON_START + 0.3, T_ECON_START + 0.6));
            ctx.fillStyle = GLASS_COLORS[1]; ctx.font = 'bold 12px sans-serif';
            ctx.fillText('经济奇点', econX - 30, econY - 16);
            ctx.globalAlpha = 1;
          }
        }

        // 技术奇点标注（后出现，右上角）
        const singPop = easeOutBack(win(sec, T_CURVE_START + T_CURVE, T_CURVE_START + T_CURVE + T_SING));
        if (singPop > 0) {
          ctx.save();
          ctx.translate(singX, singY); ctx.scale(Math.max(0, singPop), Math.max(0, singPop));
          ctx.fillStyle = GLASS_COLORS[2];
          ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
          ctx.restore();
          if (singPop > 0.6) {
            ctx.globalAlpha = easeOutCubic(win(sec, T_CURVE_START + T_CURVE + 0.3, T_CURVE_START + T_CURVE + 0.6));
            ctx.fillStyle = GLASS_COLORS[2]; ctx.font = 'bold 13px sans-serif';
            ctx.fillText('技术奇点', singX - 28, singY - 18);
            ctx.globalAlpha = 1;
          }
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批13-4: AI里程碑 沃森/AlphaGo/Libratus（id 333）=====
  registerCanvas('ai-milestones', {
    title: TEMPLATE_TITLES['ai-milestones'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const ms = [
        { year: '2011', name: '沃森', desc: 'Jeopardy! 问答冠军', clr: GLASS_COLORS[3] },
        { year: '2016', name: 'AlphaGo', desc: '围棋 4:1 胜李世石', clr: GLASS_COLORS[2] },
        { year: '2017', name: 'Libratus', desc: '德州扑克胜顶尖牌手', clr: GLASS_COLORS[1] },
      ];
      const N = ms.length;
      const R = 17;
      const topSafe = 82, botSafe = H - 62;
      const padX = 50;
      const segW = (W - padX * 2) / N;
      const midY = (topSafe + botSafe) / 2;
      const nodeX = ms.map((_, i) => padX + (i + 0.5) * segW);

      const T_STAGGER = 1.85;
      const T_POP = 0.55;
      const TOTAL = 0.1 + (N - 1) * T_STAGGER + T_POP + 2.2;

      let stage = -1;
      const stageNames = [
        '2011 沃森：Jeopardy! 问答冠军，标志 NLP 重大突破',
        '2016 AlphaGo：围棋 4:1 战胜李世石，深度学习震撼世界',
        '2017 Libratus：德州扑克击败顶尖牌手，攻克不完全信息博弈',
        '沃森 → AlphaGo → Libratus：AI 能力阶梯式突破',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        // 内容容器玻璃面板
        glassPanel(ctx, 28, topSafe - 8, W - 56, botSafe - topSafe + 24, 16, 0.55);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = N;
        for (let i = 0; i < N; i++) {
          const t0 = 0.1 + i * T_STAGGER;
          if (sec < t0 + T_POP) { curStage = i; break; }
        }
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 时间轴（随首节点淡入）
        const axisA = easeOutCubic(win(sec, 0.1, 0.9));
        if (axisA > 0) {
          ctx.strokeStyle = `rgba(110,104,144,${0.5 * axisA})`; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(padX, midY); ctx.lineTo(W - padX, midY); ctx.stroke();
        }

        ms.forEach((m, i) => {
          const x = nodeX[i];
          const t0 = 0.1 + i * T_STAGGER;
          const pop = easeOutBack(win(sec, t0, t0 + T_POP));
          if (pop <= 0) return;
          const lit = sec > t0 + T_POP * 0.55;
          ctx.save();
          ctx.translate(x, midY); ctx.scale(Math.max(0, pop), Math.max(0, pop));
          ctx.shadowColor = 'rgba(124,99,224,0.3)'; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2);
          ctx.fillStyle = lit ? m.clr : '#fff';
          ctx.strokeStyle = m.clr; ctx.lineWidth = 2.2;
          ctx.fill(); ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.beginPath(); ctx.arc(-4, -4, R * 0.26, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = lit ? '#fff' : '#312a5c';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(String(i + 1), 0, 1);
          ctx.restore();

          if (pop > 0.5) {
            ctx.globalAlpha = easeOutCubic(win(sec, t0 + 0.15, t0 + 0.45));
            ctx.fillStyle = m.clr; ctx.font = 'bold 15px sans-serif';
            ctx.fillText(m.year, x, midY - R - 18);
            ctx.fillStyle = '#312a5c'; ctx.font = 'bold 13px sans-serif';
            ctx.fillText(m.name, x, midY + R + 20);
            ctx.fillStyle = '#5a5278'; ctx.font = '12px sans-serif';
            wrapText(ctx, m.desc, x, midY + R + 40, segW - 16, 14);
            ctx.globalAlpha = 1;
          }
        });
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批13-5: 机器人伦理 索菲亚（id 334）=====
  registerCanvas('sophia-ethics', {
    title: TEMPLATE_TITLES['sophia-ethics'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const issues = [
        { q: '机器人身份？', a: '是否享有人权 / 公民身份' },
        { q: '情感真伪？', a: '模拟情感是否算真实情感' },
        { q: '责任归属？', a: '行为后果由谁承担' },
      ];
      const N = issues.length;
      const topSafe = 82, botSafe = H - 62;
      const faceX = Math.min(130, W * 0.22);
      const faceY = (topSafe + botSafe) / 2 - 10;
      const faceR = 30;
      const listX = faceX + faceR + 50;
      const listW = Math.max(120, W - listX - 44);
      const itemH = Math.min(58, (botSafe - topSafe - 20) / N);
      const listY = topSafe + 10;

      const T_FACE = 0.6;
      const T_STAGGER = 1.5;
      const T_POP = 0.5;
      const TOTAL = 0.9 + (N - 1) * T_STAGGER + T_POP + 2.4;

      let stage = -1;
      const stageNames = [
        '索菲亚：首位获得公民身份的机器人，引发伦理大讨论',
        '伦理问题1：机器人身份 — 是否享有人权 / 公民身份',
        '伦理问题2：情感真伪 — 模拟情感是否算真实情感',
        '伦理问题3：责任归属 — 行为后果由谁承担',
        '机器人伦理：身份、情感、责任三大问题亟待回答',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = 0;
        for (let i = 0; i < N; i++) {
          const t0 = 0.9 + i * T_STAGGER;
          if (sec < t0 + T_POP) { curStage = i + 1; break; }
        }
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        // 索菲亚机器人头像
        const facePop = easeOutBack(win(sec, 0.2, 0.2 + T_FACE));
        if (facePop > 0) {
          const s = Math.max(0, facePop);
          ctx.save();
          ctx.translate(faceX, faceY); ctx.scale(s, s);
          ctx.shadowColor = 'rgba(124,99,224,0.3)'; ctx.shadowBlur = 10;
          ctx.fillStyle = GLASS_COLORS[1];
          ctx.beginPath(); ctx.arc(0, 0, faceR, 0, Math.PI * 2); ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2;
          ctx.stroke();
          // 眼睛
          ctx.fillStyle = '#eef2ff';
          ctx.beginPath(); ctx.arc(-11, -6, 5, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(11, -6, 5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#312a5c';
          ctx.beginPath(); ctx.arc(-11, -6, 2, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(11, -6, 2, 0, Math.PI * 2); ctx.fill();
          // 嘴
          ctx.strokeStyle = '#eef2ff'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(0, 8, 9, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
          ctx.restore();
          if (facePop > 0.6) {
            ctx.globalAlpha = easeOutCubic(win(sec, 0.4, 0.7));
            ctx.fillStyle = '#312a5c'; ctx.font = 'bold 13px sans-serif';
            ctx.fillText('索菲亚', faceX, faceY + faceR + 18);
            ctx.fillStyle = '#6c5ce7'; ctx.font = '11px sans-serif';
            ctx.fillText('公民机器人', faceX, faceY + faceR + 34);
            ctx.globalAlpha = 1;
          }
        }

        // 伦理问题列表
        issues.forEach((it, i) => {
          const x = listX;
          const y = listY + i * itemH;
          const t0 = 0.9 + i * T_STAGGER;
          const pop = easeOutBack(win(sec, t0, t0 + T_POP));
          if (pop <= 0) return;
          const s = Math.max(0, pop);
          ctx.save();
          ctx.translate(x, y + itemH / 2); ctx.scale(s, 1);
          glassPanel(ctx, 0, -itemH / 2, listW, itemH - 8, 10);
          ctx.fillStyle = GLASS_COLORS[i % GLASS_COLORS.length];
          roundRect(ctx, 6, -itemH / 2 + 6, 5, itemH - 20, 2); ctx.fill();
          ctx.restore();

          if (pop > 0.55) {
            ctx.globalAlpha = easeOutCubic(win(sec, t0 + 0.15, t0 + 0.4));
            ctx.textAlign = 'left';
            ctx.fillStyle = '#312a5c'; ctx.font = 'bold 13px sans-serif';
            ctx.fillText(it.q, x + 18, y + 18);
            ctx.fillStyle = '#5a5278'; ctx.font = '12px sans-serif';
            ctx.fillText(it.a, x + 18, y + 36);
            ctx.textAlign = 'center';
            ctx.globalAlpha = 1;
          }
        });
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批13-6: 机器人三定律（id 335）=====
  registerCanvas('asimov-laws', {
    title: TEMPLATE_TITLES['asimov-laws'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const laws = [
        { n: '第一定律', t: '机器人不得伤害人类，或坐视人类受到伤害', clr: GLASS_COLORS[2] },
        { n: '第二定律', t: '机器人必须服从人类命令，除非违反第一定律', clr: GLASS_COLORS[1] },
        { n: '第三定律', t: '机器人需保护自己，除非违反第一 / 第二定律', clr: GLASS_COLORS[3] },
      ];
      const N = laws.length;
      const topSafe = 82, botSafe = H - 62;
      const padX = 44, gap = 16;
      const colW = Math.max(60, (W - padX * 2 - gap * (N - 1)) / N);
      const panelY = topSafe;
      const panelH = Math.max(160, botSafe - topSafe - 50);

      const T_STAGGER = 1.8;
      const T_POP = 0.55;
      const T_PRIORITY_START = 0.1 + (N - 1) * T_STAGGER + T_POP + 0.3;
      const TOTAL = T_PRIORITY_START + 1.2 + 1.2;

      let stage = -1;
      const stageNames = [
        '第一定律：机器人不得伤害人类，或坐视人类受到伤害',
        '第二定律：机器人必须服从人类命令，除非违反第一定律',
        '第三定律：机器人需保护自己，除非违反第一 / 第二定律',
        '三定律优先级：一 > 二 > 三，保护人类为先',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = N;
        for (let i = 0; i < N; i++) {
          const t0 = 0.1 + i * T_STAGGER;
          if (sec < t0 + T_POP) { curStage = i; break; }
        }
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        laws.forEach((l, i) => {
          const x = padX + i * (colW + gap);
          const t0 = 0.1 + i * T_STAGGER;
          const pop = easeOutBack(win(sec, t0, t0 + T_POP));
          if (pop <= 0) return;
          const s = Math.max(0, pop);
          ctx.save();
          ctx.translate(x + colW / 2, panelY + panelH / 2);
          ctx.scale(s, s);
          glassPanel(ctx, -colW / 2, -panelH / 2, colW, panelH, 12);
          ctx.fillStyle = l.clr;
          roundRect(ctx, -colW / 2 + 8, -panelH / 2 + 8, colW - 16, 7, 3); ctx.fill();
          ctx.restore();

          if (pop > 0.55) {
            ctx.globalAlpha = easeOutCubic(win(sec, t0 + 0.18, t0 + 0.45));
            ctx.fillStyle = l.clr; ctx.font = 'bold 14px sans-serif';
            ctx.fillText(l.n, x + colW / 2, panelY + 36);
            ctx.fillStyle = '#312a5c'; ctx.font = '12px sans-serif';
            wrapText(ctx, l.t, x + colW / 2, panelY + 72, colW - 22, 16);
            ctx.globalAlpha = 1;
          }
        });

        // 优先级箭头与标注（全部出现后）
        const prA = easeOutCubic(win(sec, T_PRIORITY_START, T_PRIORITY_START + 1.0));
        if (prA > 0) {
          ctx.globalAlpha = prA;
          for (let i = 0; i < N - 1; i++) {
            const ax = padX + (i + 1) * colW + i * gap + gap / 2;
            const ay = panelY + panelH / 2;
            ctx.strokeStyle = '#6c5ce7'; ctx.lineWidth = 2.2;
            ctx.beginPath(); ctx.moveTo(ax - 10, ay); ctx.lineTo(ax + 10, ay); ctx.stroke();
            ctx.fillStyle = '#6c5ce7';
            ctx.beginPath(); ctx.moveTo(ax + 10, ay); ctx.lineTo(ax + 4, ay - 5); ctx.lineTo(ax + 4, ay + 5); ctx.fill();
          }
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText('优先级：一 ＞ 二 ＞ 三（保护人类为先）', W / 2, panelY + panelH + 28);
          ctx.globalAlpha = 1;
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批13-7: 阿西洛马原则（id 336）=====
  registerCanvas('asilomar-principles', {
    title: TEMPLATE_TITLES['asilomar-principles'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const cats = [
        { name: '安全问题', cnt: 9, desc: '避免伤害 / 失败安全 / 法律问责', clr: GLASS_COLORS[2] },
        { name: '价值观', cnt: 5, desc: '价值对齐 / 人类价值观 / 个人权利', clr: GLASS_COLORS[1] },
        { name: '性能', cnt: 9, desc: '能力边界 / 透明可释 / 争议解决', clr: GLASS_COLORS[3] },
      ];
      const N = cats.length;
      const topSafe = 82, botSafe = H - 62;
      const padX = 44, gap = 16;
      const colW = Math.max(60, (W - padX * 2 - gap * (N - 1)) / N);
      const panelY = topSafe;
      const panelH = Math.max(170, botSafe - topSafe - 50);
      const totalCnt = cats.reduce((s, c) => s + c.cnt, 0);

      const T_STAGGER = 1.8;
      const T_POP = 0.55;
      const T_SUM_START = 0.1 + (N - 1) * T_STAGGER + T_POP + 0.3;
      const TOTAL = T_SUM_START + 1.2 + 1.2;

      let stage = -1;
      const stageNames = [
        '安全问题：9 条 — 避免伤害、失败安全、法律问责',
        '价值观：5 条 — 价值对齐、人类价值观、个人权利',
        '性能：9 条 — 能力边界、透明可释、争议解决',
        '安全 9 + 价值观 5 + 性能 9 = 23 条 AI 治理原则',
      ];

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let curStage = N;
        for (let i = 0; i < N; i++) {
          const t0 = 0.1 + i * T_STAGGER;
          if (sec < t0 + T_POP) { curStage = i; break; }
        }
        if (curStage !== stage) { stage = curStage; setStatus(stageNames[stage]); }

        cats.forEach((c, i) => {
          const x = padX + i * (colW + gap);
          const t0 = 0.1 + i * T_STAGGER;
          const pop = easeOutBack(win(sec, t0, t0 + T_POP));
          if (pop <= 0) return;
          const s = Math.max(0, pop);
          ctx.save();
          ctx.translate(x + colW / 2, panelY + panelH / 2);
          ctx.scale(s, s);
          glassPanel(ctx, -colW / 2, -panelH / 2, colW, panelH, 12);
          ctx.fillStyle = c.clr;
          roundRect(ctx, -colW / 2 + 8, -panelH / 2 + 8, colW - 16, 7, 3); ctx.fill();
          ctx.restore();

          if (pop > 0.55) {
            ctx.globalAlpha = easeOutCubic(win(sec, t0 + 0.18, t0 + 0.45));
            ctx.fillStyle = '#312a5c'; ctx.font = 'bold 14px sans-serif';
            ctx.fillText(c.name, x + colW / 2, panelY + 36);
            // 大数字
            ctx.fillStyle = c.clr; ctx.font = 'bold 30px sans-serif';
            ctx.fillText(String(c.cnt), x + colW / 2, panelY + 78);
            ctx.fillStyle = '#5a5278'; ctx.font = '12px sans-serif';
            ctx.fillText('条', x + colW / 2 + 26, panelY + 86);
            ctx.fillStyle = '#4a3f6b'; ctx.font = '12px sans-serif';
            wrapText(ctx, c.desc, x + colW / 2, panelY + 116, colW - 22, 15);
            ctx.globalAlpha = 1;
          }
        });

        // 汇总标注
        const sumA = easeOutCubic(win(sec, T_SUM_START, T_SUM_START + 1.0));
        if (sumA > 0) {
          ctx.globalAlpha = sumA;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 15px sans-serif';
          ctx.fillText('合计 ' + totalCnt + ' 条 AI 治理原则', W / 2, panelY + panelH + 28);
          ctx.globalAlpha = 1;
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批13-8: 法律挑战 交通事故责任（id 337）=====
  registerCanvas('legal-accident', {
    title: TEMPLATE_TITLES['legal-accident'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const parties = [
        { name: '驾驶员', role: '是否未尽监督义务', clr: GLASS_COLORS[0] },
        { name: '车企', role: '是否产品存在缺陷', clr: GLASS_COLORS[1] },
        { name: 'AI系统', role: '是否算法决策失误', clr: GLASS_COLORS[2] },
      ];

      const topSafe = 92, botSafe = H - 62;
      const cardH = 68;
      const cardTop = botSafe - cardH - 26;
      const colW = (W - 88) / 3;
      const cardW = Math.max(0, colW - 14);
      const cx = W / 2, cy = (topSafe + cardTop) / 2;

      const T_TITLE = 0.7, T_ICON = 0.7, T_PARTY = 1.5;
      const TOTAL = T_TITLE + T_ICON + 3 * T_PARTY + 0.7;

      const stageNames = [
        '自动驾驶事故责任需在多方间依法界定',
        '责任方一：驾驶员 — 是否未尽监督义务',
        '责任方二：车企 — 是否产品存在缺陷',
        '责任方三：AI系统 — 是否算法决策失误',
        '自动驾驶事故：人/车/AI三方责任需依法界定',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let cur = 0;
        if (sec > T_TITLE + T_ICON) {
          const idx = Math.floor((sec - T_TITLE - T_ICON) / T_PARTY);
          cur = Math.min(1 + idx, 4);
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        const tP = easeOutBack(win(sec, 0, T_TITLE));
        if (tP > 0) {
          ctx.save(); ctx.translate(W / 2, topSafe); ctx.scale(tP, tP);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 15px sans-serif';
          ctx.fillText('交通事故责任：三方划分', 0, 0);
          ctx.restore();
        }

        const iP = easeOutBack(win(sec, T_TITLE, T_TITLE + T_ICON));
        if (iP > 0) {
          ctx.save(); ctx.translate(cx, cy); ctx.scale(iP, iP);
          const R = 24;
          ctx.fillStyle = GLASS_COLORS[2];
          ctx.beginPath();
          ctx.moveTo(0, -R); ctx.lineTo(R * 0.92, R * 0.62); ctx.lineTo(-R * 0.92, R * 0.62);
          ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.font = 'bold 22px sans-serif';
          ctx.fillText('!', 0, 2);
          ctx.restore();
        }

        parties.forEach((pt, i) => {
          const t0 = T_TITLE + T_ICON + i * T_PARTY;
          const pop = easeOutBack(win(sec, t0, t0 + 0.55));
          if (pop <= 0) return;
          const x = 44 + i * colW + colW / 2;
          const y = cardTop;
          const lineP = easeOutCubic(win(sec, t0 + 0.12, t0 + 0.55));
          if (lineP > 0) {
            ctx.strokeStyle = pt.clr; ctx.lineWidth = 1.8; ctx.globalAlpha = lineP;
            ctx.beginPath(); ctx.moveTo(cx, cy + 20); ctx.lineTo(x, y); ctx.stroke();
            ctx.globalAlpha = 1;
          }
          ctx.save(); ctx.translate(x, y); ctx.scale(pop, pop);
          glassPanel(ctx, -cardW / 2, 0, cardW, cardH, 12);
          ctx.fillStyle = pt.clr; ctx.font = 'bold 14px sans-serif';
          ctx.fillText(pt.name, 0, 20);
          ctx.fillStyle = '#3a2a7a'; ctx.font = '12px sans-serif';
          wrapText(ctx, pt.role, 0, 44, cardW - 16, 15);
          ctx.restore();
        });

        if (sec > T_TITLE + T_ICON + 3 * T_PARTY) {
          const cP = easeOutCubic(win(sec, T_TITLE + T_ICON + 3 * T_PARTY, TOTAL));
          ctx.globalAlpha = cP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('自动驾驶事故：人/车/AI三方责任需依法界定', W / 2, botSafe - 8);
          ctx.globalAlpha = 1;
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批13-9: 法律挑战 知识产权与隐私（id 338）=====
  registerCanvas('legal-ip-privacy', {
    title: TEMPLATE_TITLES['legal-ip-privacy'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const issues = [
        { name: '知识产权', points: ['AI生成作品归属', '训练数据版权', '算法专利保护'], clr: GLASS_COLORS[0] },
        { name: '隐私保护', points: ['用户数据采集授权', '人脸识别滥用', '行为画像限制'], clr: GLASS_COLORS[2] },
      ];

      const topSafe = 92, botSafe = H - 62;
      const colW = (W - 88) / 2;
      const headerH = 44;
      const pointH = 30;
      const contentH = headerH + 3 * pointH;
      const startY = topSafe + 4;

      const T_TITLE = 0.7, T_POINT = 0.9;
      const TOTAL = T_TITLE + 6 * T_POINT + 0.7;

      const stageNames = [
        '法律需在知识产权与隐私保护间取得平衡',
        ...issues[0].points.map(pt => `知识产权：${pt}`),
        ...issues[1].points.map(pt => `隐私保护：${pt}`),
        'AI知识产权与隐私：法律需平衡创新与权益',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let cur = 0;
        if (sec > T_TITLE) {
          const idx = Math.floor((sec - T_TITLE) / T_POINT);
          cur = Math.min(1 + idx, stageNames.length - 1);
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        const tP = easeOutBack(win(sec, 0, T_TITLE));
        if (tP > 0) {
          ctx.save(); ctx.translate(W / 2, topSafe); ctx.scale(tP, tP);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 15px sans-serif';
          ctx.fillText('法律挑战：知识产权 vs 隐私保护', 0, 0);
          ctx.restore();
        }

        issues.forEach((it, ci) => {
          const x = 44 + ci * colW + colW / 2;
          const hdrP = easeOutBack(win(sec, T_TITLE * 0.4 + ci * 0.15, T_TITLE * 0.9 + ci * 0.15));
          if (hdrP > 0) {
            ctx.save(); ctx.translate(x, startY); ctx.scale(hdrP, hdrP);
            glassPanel(ctx, -colW / 2 + 6, 0, colW - 12, headerH, 10);
            ctx.fillStyle = it.clr; ctx.font = 'bold 14px sans-serif';
            ctx.fillText(it.name, 0, headerH / 2);
            ctx.restore();
          }
          it.points.forEach((pt, pi) => {
            const globalIdx = ci * 3 + pi;
            const t0 = T_TITLE + globalIdx * T_POINT;
            const pop = easeOutBack(win(sec, t0, t0 + 0.45));
            if (pop <= 0) return;
            const py = startY + headerH + 8 + pi * pointH;
            ctx.save(); ctx.translate(x, py); ctx.scale(pop, pop);
            ctx.fillStyle = '#3a2a7a'; ctx.font = '12px sans-serif';
            wrapText(ctx, '• ' + pt, 0, 0, colW - 20, 15);
            ctx.restore();
          });
        });

        if (sec > T_TITLE + 6 * T_POINT) {
          const cP = easeOutCubic(win(sec, T_TITLE + 6 * T_POINT, TOTAL));
          ctx.globalAlpha = cP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('AI知识产权与隐私：法律需平衡创新与权益', W / 2, botSafe - 8);
          ctx.globalAlpha = 1;
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批14-1: 什么是人工智能（id 209）=====
  registerCanvas('what-is-ai', {
    title: TEMPLATE_TITLES['what-is-ai'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const pairs = [
        { human: '耳朵', ai: '麦克风', ability: '听' },
        { human: '眼睛', ai: '摄像头', ability: '看' },
        { human: '大脑', ai: '芯片+算法', ability: '想' },
      ];

      const topSafe = 92, botSafe = H - 62;
      const rowTop = topSafe + 54;
      const rowH = Math.max(46, (botSafe - 30 - rowTop) / 3);
      const cardH = Math.max(36, rowH - 14);
      const leftX = W * 0.22, rightX = W * 0.78;
      const cardW = Math.max(0, W * 0.30);

      const T_TITLE = 0.7, T_ROW = 1.8;
      const TOTAL = T_TITLE + 3 * T_ROW + 0.7;

      const stageNames = [
        '人工智能：用机器模拟人的智能',
        ...pairs.map(p => `人类用${p.human}${p.ability}，AI用${p.ai}`),
        'AI是研究、开发用于模拟人类智能的技术科学',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let cur = 0;
        if (sec > T_TITLE) {
          const idx = Math.floor((sec - T_TITLE) / T_ROW);
          cur = Math.min(1 + idx, stageNames.length - 1);
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        const tP = easeOutBack(win(sec, 0, T_TITLE));
        if (tP > 0) {
          ctx.save(); ctx.translate(W / 2, topSafe); ctx.scale(tP, tP);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 15px sans-serif';
          ctx.fillText('人工智能：用机器模拟人的智能', 0, 0);
          ctx.restore();
        }

        // 列标签
        ctx.fillStyle = '#6e6890'; ctx.font = 'bold 13px sans-serif';
        ctx.fillText('人类', leftX, topSafe + 30);
        ctx.fillText('AI机器', rightX, topSafe + 30);

        pairs.forEach((pr, i) => {
          const t0 = T_TITLE + i * T_ROW;
          const pop = easeOutBack(win(sec, t0, t0 + 0.6));
          if (pop <= 0) return;
          const y = rowTop + i * rowH;
          // 左卡片
          ctx.save(); ctx.translate(leftX, y); ctx.scale(pop, pop);
          glassPanel(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 10);
          ctx.fillStyle = GLASS_COLORS[0]; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(pr.human + '（会' + pr.ability + '）', 0, 0);
          ctx.restore();
          // 箭头
          const aP = easeOutCubic(win(sec, t0 + 0.2, t0 + 0.6));
          if (aP > 0) {
            ctx.globalAlpha = aP;
            ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 16px sans-serif';
            ctx.fillText('→', W / 2, y);
            ctx.globalAlpha = 1;
          }
          // 右卡片
          ctx.save(); ctx.translate(rightX, y); ctx.scale(pop, pop);
          glassPanel(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 10);
          ctx.fillStyle = GLASS_COLORS[2]; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(pr.ai, 0, 0);
          ctx.restore();
        });

        if (sec > T_TITLE + 3 * T_ROW) {
          const cP = easeOutCubic(win(sec, T_TITLE + 3 * T_ROW, TOTAL));
          ctx.globalAlpha = cP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('AI是研究、开发用于模拟人类智能的技术科学', W / 2, botSafe - 8);
          ctx.globalAlpha = 1;
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批14-2: AI表现形式（id 210）=====
  registerCanvas('ai-manifestations', {
    title: TEMPLATE_TITLES['ai-manifestations'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const forms = [
        { icon: '听', name: '语音识别', ex: '智能音箱' },
        { icon: '看', name: '图像识别', ex: '人脸解锁' },
        { icon: '说', name: '语音合成', ex: '导航播报' },
        { icon: '想', name: '推理决策', ex: '下棋软件' },
        { icon: '学', name: '机器学习', ex: '个性推荐' },
        { icon: '动', name: '机器人', ex: '扫地机器人' },
      ];

      const topSafe = 92, botSafe = H - 62;
      const cols = 3, rows = 2;
      const gridTop = topSafe + 22;
      const cw = (W - 88) / cols;
      const cardH = Math.max(0, (botSafe - 30 - gridTop) / rows);
      const iconR = 17;

      const T_TITLE = 0.7, T_ITEM = 0.9;
      const TOTAL = T_TITLE + 6 * T_ITEM + 0.7;

      const stageNames = [
        'AI通过多种形式融入日常生活',
        ...forms.map(f => `${f.name}：${f.ex}`),
        '听/看/说/想/学/行动：AI融入日常生活',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let cur = 0;
        if (sec > T_TITLE) {
          const idx = Math.floor((sec - T_TITLE) / T_ITEM);
          cur = Math.min(1 + idx, stageNames.length - 1);
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        const tP = easeOutBack(win(sec, 0, T_TITLE));
        if (tP > 0) {
          ctx.save(); ctx.translate(W / 2, topSafe); ctx.scale(tP, tP);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 15px sans-serif';
          ctx.fillText('AI的六种表现形式', 0, 0);
          ctx.restore();
        }

        forms.forEach((f, i) => {
          const col = i % cols, row = Math.floor(i / cols);
          const x = 44 + col * cw + cw / 2;
          const y = gridTop + row * cardH + cardH / 2;
          const t0 = T_TITLE + i * T_ITEM;
          const pop = easeOutBack(win(sec, t0, t0 + 0.5));
          if (pop <= 0) return;
          const cardW = Math.max(0, cw - 14);
          const cH = Math.max(0, cardH - 14);
          ctx.save(); ctx.translate(x, y); ctx.scale(pop, pop);
          glassPanel(ctx, -cardW / 2, -cH / 2, cardW, cH, 12);
          // 图标圆
          ctx.fillStyle = GLASS_COLORS[i % GLASS_COLORS.length];
          ctx.beginPath(); ctx.arc(-cardW / 2 + iconR + 8, 0, iconR, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.font = 'bold 15px sans-serif';
          ctx.fillText(f.icon, -cardW / 2 + iconR + 8, 0);
          // 名称 + 例子
          ctx.fillStyle = '#3a2a7a'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(f.name, 8, -8);
          ctx.fillStyle = '#6e6890'; ctx.font = '11px sans-serif';
          ctx.fillText(f.ex, 8, 12);
          ctx.restore();
        });

        if (sec > T_TITLE + 6 * T_ITEM) {
          const cP = easeOutCubic(win(sec, T_TITLE + 6 * T_ITEM, TOTAL));
          ctx.globalAlpha = cP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('听/看/说/想/学/行动：AI融入日常生活', W / 2, botSafe - 8);
          ctx.globalAlpha = 1;
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批14-3: AI基本能力（id 211）=====
  registerCanvas('ai-basic-abilities', {
    title: TEMPLATE_TITLES['ai-basic-abilities'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const abs = [
        { name: '感知能力', desc: '采集图像/声音/文本', clr: GLASS_COLORS[0] },
        { name: '推理能力', desc: '逻辑分析与决策', clr: GLASS_COLORS[1] },
        { name: '学习能力', desc: '从数据中总结规律', clr: GLASS_COLORS[2] },
        { name: '行为能力', desc: '执行动作影响环境', clr: GLASS_COLORS[3] },
      ];

      const topSafe = 92, botSafe = H - 62;
      const cw = (W - 88) / 4;
      const cardTop = topSafe + 32;
      const cardH = Math.max(0, botSafe - 36 - cardTop);

      const T_TITLE = 0.7, T_ABILITY = 1.3;
      const TOTAL = T_TITLE + 4 * T_ABILITY + 0.7;

      const stageNames = [
        'AI具备四大基本能力并形成闭环',
        ...abs.map(a => `能力：${a.name} — ${a.desc}`),
        '感知→推理→学习→行为：智能体能力闭环',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let cur = 0;
        if (sec > T_TITLE) {
          const idx = Math.floor((sec - T_TITLE) / T_ABILITY);
          cur = Math.min(1 + idx, stageNames.length - 1);
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        const tP = easeOutBack(win(sec, 0, T_TITLE));
        if (tP > 0) {
          ctx.save(); ctx.translate(W / 2, topSafe); ctx.scale(tP, tP);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 15px sans-serif';
          ctx.fillText('AI四大基本能力', 0, 0);
          ctx.restore();
        }

        abs.forEach((a, i) => {
          const x = 44 + i * cw + cw / 2;
          const t0 = T_TITLE + i * T_ABILITY;
          const pop = easeOutBack(win(sec, t0, t0 + 0.55));
          if (pop <= 0) return;
          const cardW = Math.max(0, cw - 14);
          ctx.save(); ctx.translate(x, cardTop + cardH / 2); ctx.scale(pop, pop);
          glassPanel(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 12);
          ctx.fillStyle = a.clr; ctx.font = 'bold 14px sans-serif';
          ctx.fillText(a.name, 0, -cardH / 2 + 26);
          ctx.fillStyle = '#3a2a7a'; ctx.font = '12px sans-serif';
          wrapText(ctx, a.desc, 0, 6, cardW - 16, 15);
          ctx.restore();
          // 箭头
          if (i < abs.length - 1) {
            const aP = easeOutCubic(win(sec, t0 + 0.25, t0 + 0.6));
            if (aP > 0) {
              ctx.globalAlpha = aP;
              ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 16px sans-serif';
              ctx.fillText('→', x + cw / 2, cardTop + cardH / 2);
              ctx.globalAlpha = 1;
            }
          }
        });

        if (sec > T_TITLE + 4 * T_ABILITY) {
          const cP = easeOutCubic(win(sec, T_TITLE + 4 * T_ABILITY, TOTAL));
          ctx.globalAlpha = cP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('感知→推理→学习→行为：智能体能力闭环', W / 2, botSafe - 8);
          ctx.globalAlpha = 1;
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批14-4: 达特茅斯会议（id 212）=====
  registerCanvas('dartmouth-meeting', {
    title: TEMPLATE_TITLES['dartmouth-meeting'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const facts = [
        { k: '时间', v: '1956年夏', clr: GLASS_COLORS[0] },
        { k: '地点', v: '美国达特茅斯学院', clr: GLASS_COLORS[1] },
        { k: '发起', v: '麦卡锡、明斯基等', clr: GLASS_COLORS[2] },
        { k: '成果', v: '正式提出"人工智能"一词', clr: GLASS_COLORS[3] },
      ];

      const topSafe = 92, botSafe = H - 62;
      const cols = 2, rows = 2;
      const gridTop = topSafe + 26;
      const cw = (W - 88) / cols;
      const cardH = Math.max(0, (botSafe - 64 - gridTop) / rows);

      const T_TITLE = 0.7, T_FACT = 1.2;
      const T_FACTS = 4 * T_FACT;
      const TOTAL = T_TITLE + T_FACTS + 1.0;

      const stageNames = [
        '达特茅斯会议是AI学科的起点',
        ...facts.map(f => `${f.k}：${f.v}`),
        '"Artificial Intelligence" 由此诞生',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let cur = 0;
        if (sec > T_TITLE) {
          const idx = Math.floor((sec - T_TITLE) / T_FACT);
          cur = Math.min(1 + idx, stageNames.length - 1);
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        const tP = easeOutBack(win(sec, 0, T_TITLE));
        if (tP > 0) {
          ctx.save(); ctx.translate(W / 2, topSafe); ctx.scale(tP, tP);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 15px sans-serif';
          ctx.fillText('达特茅斯会议：AI学科的起点', 0, 0);
          ctx.restore();
        }

        facts.forEach((f, i) => {
          const col = i % cols, row = Math.floor(i / cols);
          const x = 44 + col * cw + cw / 2;
          const y = gridTop + row * cardH + cardH / 2;
          const t0 = T_TITLE + i * T_FACT;
          const pop = easeOutBack(win(sec, t0, t0 + 0.55));
          if (pop <= 0) return;
          const cardW = Math.max(0, cw - 16);
          const cH = Math.max(0, cardH - 14);
          ctx.save(); ctx.translate(x, y); ctx.scale(pop, pop);
          glassPanel(ctx, -cardW / 2, -cH / 2, cardW, cH, 12);
          ctx.fillStyle = f.clr; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(`${f.k}：`, 0, -12);
          ctx.fillStyle = '#3a2a7a'; ctx.font = '13px sans-serif';
          wrapText(ctx, f.v, 0, 12, cardW - 20, 15);
          ctx.restore();
        });

        // 强调语
        if (sec > T_TITLE + T_FACTS) {
          const eP = easeOutBack(win(sec, T_TITLE + T_FACTS, T_TITLE + T_FACTS + 0.6));
          if (eP > 0) {
            ctx.save(); ctx.translate(W / 2, botSafe - 34); ctx.scale(eP, eP);
            ctx.fillStyle = GLASS_COLORS[2]; ctx.font = 'bold 14px sans-serif';
            ctx.fillText('"Artificial Intelligence" 由此诞生', 0, 0);
            ctx.restore();
          }
          const cP = easeOutCubic(win(sec, T_TITLE + T_FACTS + 0.4, TOTAL));
          ctx.globalAlpha = cP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('1956达特茅斯会议：人工智能成为独立学科', W / 2, botSafe - 8);
          ctx.globalAlpha = 1;
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批14-5: 新一代AI新特征（id 213）=====
  registerCanvas('new-ai-features', {
    title: TEMPLATE_TITLES['new-ai-features'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const feats = [
        { name: '大数据', desc: '海量数据成为燃料', clr: GLASS_COLORS[0] },
        { name: '大算力', desc: 'GPU/云计算支撑训练', clr: GLASS_COLORS[1] },
        { name: '深度学习', desc: '深度神经网络突破', clr: GLASS_COLORS[2] },
        { name: '跨界融合', desc: 'AI+产业全面落地', clr: GLASS_COLORS[3] },
      ];

      const topSafe = 92, botSafe = H - 62;
      const cw = (W - 88) / 4;
      const cardTop = topSafe + 32;
      const cardH = Math.max(0, botSafe - 36 - cardTop);

      const T_TITLE = 0.7, T_FEAT = 1.3;
      const TOTAL = T_TITLE + 4 * T_FEAT + 0.7;

      const stageNames = [
        '新一代人工智能具备四大特征',
        ...feats.map(f => `特征：${f.name} — ${f.desc}`),
        '大数据+大算力+深度学习：驱动新一代AI浪潮',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let cur = 0;
        if (sec > T_TITLE) {
          const idx = Math.floor((sec - T_TITLE) / T_FEAT);
          cur = Math.min(1 + idx, stageNames.length - 1);
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        const tP = easeOutBack(win(sec, 0, T_TITLE));
        if (tP > 0) {
          ctx.save(); ctx.translate(W / 2, topSafe); ctx.scale(tP, tP);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 15px sans-serif';
          ctx.fillText('新一代人工智能的四大特征', 0, 0);
          ctx.restore();
        }

        feats.forEach((f, i) => {
          const x = 44 + i * cw + cw / 2;
          const t0 = T_TITLE + i * T_FEAT;
          const pop = easeOutBack(win(sec, t0, t0 + 0.55));
          if (pop <= 0) return;
          const cardW = Math.max(0, cw - 14);
          ctx.save(); ctx.translate(x, cardTop + cardH / 2); ctx.scale(pop, pop);
          glassPanel(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 12);
          ctx.fillStyle = f.clr; ctx.font = 'bold 14px sans-serif';
          ctx.fillText(f.name, 0, -cardH / 2 + 26);
          ctx.fillStyle = '#3a2a7a'; ctx.font = '12px sans-serif';
          wrapText(ctx, f.desc, 0, 6, cardW - 16, 15);
          ctx.restore();
        });

        if (sec > T_TITLE + 4 * T_FEAT) {
          const cP = easeOutCubic(win(sec, T_TITLE + 4 * T_FEAT, TOTAL));
          ctx.globalAlpha = cP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('大数据+大算力+深度学习：驱动新一代AI浪潮', W / 2, botSafe - 8);
          ctx.globalAlpha = 1;
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批14-6: 三盘棋（id 214）=====
  registerCanvas('three-games', {
    title: TEMPLATE_TITLES['three-games'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const games = [
        { year: '1997', ai: '深蓝', human: '卡斯帕罗夫', result: '国际象棋AI首胜', clr: GLASS_COLORS[0] },
        { year: '2016', ai: 'AlphaGo', human: '李世石', result: '围棋4:1', clr: GLASS_COLORS[2] },
        { year: '2017', ai: 'AlphaGo Zero', human: '自我对弈', result: '无师自通100:0', clr: GLASS_COLORS[1] },
      ];

      const topSafe = 92, botSafe = H - 62;
      const midY = topSafe + 72;
      const segW = (W - 88) / 3;
      const nodeR = 15;

      const T_TITLE = 0.7, T_LINE = 0.6, T_GAME = 1.5;
      const TOTAL = T_TITLE + T_LINE + 3 * T_GAME + 0.7;

      const stageNames = [
        '人机博弈的三个里程碑',
        ...games.map(g => `${g.year} ${g.ai} vs ${g.human}：${g.result}`),
        '深蓝→AlphaGo→Zero：AI从专用走向自主学习',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        // 内容容器玻璃面板
        glassPanel(ctx, 28, topSafe - 8, W - 56, botSafe - topSafe + 24, 16, 0.55);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let cur = 0;
        if (sec > T_TITLE + T_LINE) {
          const idx = Math.floor((sec - T_TITLE - T_LINE) / T_GAME);
          cur = Math.min(1 + idx, stageNames.length - 1);
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        const tP = easeOutBack(win(sec, 0, T_TITLE));
        if (tP > 0) {
          ctx.save(); ctx.translate(W / 2, topSafe); ctx.scale(tP, tP);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 15px sans-serif';
          ctx.fillText('"三盘棋"：人机博弈的三个里程碑', 0, 0);
          ctx.restore();
        }

        // 时间轴
        const lineP = easeOutCubic(win(sec, T_TITLE, T_TITLE + T_LINE));
        if (lineP > 0) {
          ctx.strokeStyle = '#a586e8'; ctx.lineWidth = 2.2; ctx.globalAlpha = lineP;
          ctx.beginPath(); ctx.moveTo(44, midY); ctx.lineTo(W - 44, midY); ctx.stroke();
          ctx.globalAlpha = 1;
        }

        games.forEach((g, i) => {
          const x = 44 + (i + 0.5) * segW;
          const t0 = T_TITLE + T_LINE + i * T_GAME;
          const pop = easeOutBack(win(sec, t0, t0 + 0.55));
          if (pop <= 0) return;
          // 节点
          ctx.save(); ctx.translate(x, midY); ctx.scale(pop, pop);
          ctx.shadowColor = 'rgba(108,92,231,0.3)'; ctx.shadowBlur = 10;
          ctx.fillStyle = g.clr;
          ctx.beginPath(); ctx.arc(0, 0, nodeR, 0, Math.PI * 2); ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.restore();
          // 年份（上方）
          const yP = easeOutCubic(win(sec, t0 + 0.15, t0 + 0.55));
          if (yP > 0) {
            ctx.globalAlpha = yP;
            ctx.fillStyle = g.clr; ctx.font = 'bold 14px sans-serif';
            ctx.fillText(g.year, x, midY - nodeR - 16);
            // AI + 对手（下方）
            ctx.fillStyle = '#3a2a7a'; ctx.font = 'bold 13px sans-serif';
            ctx.fillText(g.ai, x, midY + nodeR + 18);
            ctx.fillStyle = '#6e6890'; ctx.font = '12px sans-serif';
            ctx.fillText('vs ' + g.human, x, midY + nodeR + 36);
            // 结果
            ctx.fillStyle = '#6c5ce7'; ctx.font = '12px sans-serif';
            wrapText(ctx, g.result, x, midY + nodeR + 56, segW - 16, 15);
            ctx.globalAlpha = 1;
          }
        });

        if (sec > T_TITLE + T_LINE + 3 * T_GAME) {
          const cP = easeOutCubic(win(sec, T_TITLE + T_LINE + 3 * T_GAME, TOTAL));
          ctx.globalAlpha = cP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('深蓝→AlphaGo→Zero：AI从专用走向自主学习', W / 2, botSafe - 8);
          ctx.globalAlpha = 1;
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批14-7: 图灵测试（id 215）=====
  registerCanvas('turing-test', {
    title: TEMPLATE_TITLES['turing-test'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const topSafe = 82, botSafe = H - 62;
      const qx = W / 2, qy = topSafe + 28, R = 18;
      const panelW = Math.max(120, (W - 88 - 60) / 2);
      const panelY = qy + R + 28;
      const panelH = Math.max(96, Math.min(150, botSafe - panelY - 36));
      const panels = [
        { x: 44, lbl: '人类 A', sub: '幕帘后回答', clr: GLASS_COLORS[0] },
        { x: W - 44 - panelW, lbl: '机器 B', sub: '幕帘后回答', clr: GLASS_COLORS[2] },
      ];

      const T_INQ = 1.0, T_HUMAN = 1.5, T_MACHINE = 1.5, T_QA = 1.6, T_CONCL = 1.0;
      const TOTAL = T_INQ + T_HUMAN + T_MACHINE + T_QA + T_CONCL;
      const stageNames = [
        '1950年图灵提出：以行为判断机器是否有智能',
        '询问者向幕帘后的双方提问',
        '人类 A 在幕帘后回答问题',
        '机器 B 在幕帘后回答问题',
        '文字问答：询问者无法分辨人 / 机器 → 通过',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        let cur = 0;
        if (sec > T_INQ) cur = 1;
        if (sec > T_INQ + T_HUMAN) cur = 2;
        if (sec > T_INQ + T_HUMAN + T_MACHINE) cur = 3;
        if (sec > T_INQ + T_HUMAN + T_MACHINE + T_QA) cur = 4;
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 连线（询问者 → 双方）
        for (let i = 0; i < panels.length; i++) {
          const pn = panels[i];
          const lp = win(sec, T_INQ + i * 0.4, T_INQ + i * 0.4 + 0.5);
          if (lp > 0) {
            ctx.strokeStyle = `rgba(108,92,231,${0.35 + 0.5 * lp})`;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(qx, qy + R);
            ctx.lineTo(pn.x + panelW / 2, panelY);
            ctx.stroke();
          }
        }

        // 问答流动小圆点
        const qaStart = T_INQ + 0.4;
        if (sec > qaStart && sec < TOTAL - T_CONCL + 0.3) {
          const flow = ((sec - qaStart) % 1.3) / 1.3;
          for (let i = 0; i < panels.length; i++) {
            const pn = panels[i];
            const sx = qx, sy = qy + R, ex = pn.x + panelW / 2, ey = panelY;
            ctx.fillStyle = '#6c5ce7';
            ctx.beginPath(); ctx.arc(sx + (ex - sx) * flow, sy + (ey - sy) * flow, 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#f0a8d8';
            ctx.beginPath(); ctx.arc(ex + (sx - ex) * flow, ey + (sy - ey) * flow, 4, 0, Math.PI * 2); ctx.fill();
          }
        }

        // 询问者节点
        const inqP = easeOutBack(win(sec, 0, T_INQ));
        if (inqP > 0) {
          const s = Math.max(0, inqP);
          ctx.save();
          ctx.translate(qx, qy); ctx.scale(s, s);
          ctx.shadowColor = 'rgba(124,99,224,0.35)'; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2);
          ctx.fillStyle = GLASS_COLORS[4]; ctx.fill();
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('询问者', 0, 1);
          ctx.restore();
        }

        // 两个回答方面板
        for (let i = 0; i < panels.length; i++) {
          const pn = panels[i];
          const t0 = T_INQ + i * T_HUMAN;
          const popP = easeOutBack(win(sec, t0, t0 + 0.55));
          if (popP <= 0) continue;
          const s = Math.max(0, popP);
          ctx.save();
          ctx.globalAlpha = s;
          const cx = pn.x + panelW / 2, cy = panelY + panelH / 2;
          ctx.translate(cx, cy); ctx.scale(0.9 + 0.1 * s, 0.9 + 0.1 * s);
          ctx.translate(-cx, -cy);
          glassPanel(ctx, pn.x, panelY, panelW, panelH, 14, 0.6);
          const g = ctx.createLinearGradient(pn.x, panelY, pn.x + panelW, panelY);
          g.addColorStop(0, pn.clr); g.addColorStop(1, GLASS_COLORS[(i * 2 + 1) % GLASS_COLORS.length]);
          ctx.fillStyle = g; roundRect(ctx, pn.x, panelY, panelW, 6, 3); ctx.fill();
          ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 15px sans-serif';
          ctx.fillText(pn.lbl, cx, panelY + panelH * 0.42);
          ctx.fillStyle = '#5e5a8a'; ctx.font = '12px sans-serif';
          ctx.fillText(pn.sub, cx, panelY + panelH * 0.72);
          ctx.restore();
        }

        // 底部结论
        const conclP = win(sec, TOTAL - T_CONCL - 0.2, TOTAL - 0.1);
        if (conclP > 0) {
          ctx.save(); ctx.globalAlpha = conclP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('无法分辨人 / 机器 → 通过图灵测试', W / 2, botSafe - 8);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批14-8: 吴文俊与吴氏方法（id 216）=====
  registerCanvas('wu-method', {
    title: TEMPLATE_TITLES['wu-method'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const steps = [
        { name: '几何命题', desc: '定理的已知与求证', clr: GLASS_COLORS[0] },
        { name: '代数化', desc: '引入坐标转为方程组', clr: GLASS_COLORS[1] },
        { name: '特征列', desc: '吴氏消元机械推导', clr: GLASS_COLORS[2] },
        { name: '机器证明', desc: '计算机自动判定', clr: GLASS_COLORS[4] },
      ];
      const topSafe = 82, botSafe = H - 62;
      const gap = 16;
      const cardW = Math.max(90, (W - 88 - gap * 3) / 4);
      const cardH = Math.max(110, Math.min(150, botSafe - topSafe - 30));
      const cardY = (topSafe + botSafe - cardH) / 2;
      const cardX = (i) => 44 + i * (cardW + gap);

      const UNIT = 1.4, T_HOLD = 0.9;
      const TOTAL = steps.length * UNIT + T_HOLD;
      const stageNames = steps.map((s, i) => `步骤${i + 1}：${s.name} — ${s.desc}`);
      stageNames.push('吴文俊与吴氏方法：数学机械化、定理机器证明');
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        const cur = Math.min(steps.length, Math.floor(sec / UNIT));
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 箭头
        for (let i = 0; i < steps.length - 1; i++) {
          const ap = easeOutCubic(win(sec, (i + 1) * UNIT - 0.2, (i + 1) * UNIT + 0.3));
          if (ap > 0) {
            ctx.save(); ctx.globalAlpha = ap;
            ctx.fillStyle = GLASS_COLORS[4]; ctx.font = 'bold 18px sans-serif';
            ctx.fillText('→', cardX(i) + cardW + gap / 2, cardY + cardH / 2 + 6);
            ctx.restore();
          }
        }

        // 卡片
        for (let i = 0; i < steps.length; i++) {
          const s = steps[i];
          const t0 = i * UNIT;
          const popP = easeOutBack(win(sec, t0, t0 + 0.55));
          if (popP <= 0) continue;
          const sc = Math.max(0, popP);
          const x = cardX(i), cx = x + cardW / 2, cy = cardY + cardH / 2;
          ctx.save();
          ctx.globalAlpha = sc;
          ctx.translate(cx, cy); ctx.scale(0.9 + 0.1 * sc, 0.9 + 0.1 * sc);
          ctx.translate(-cx, -cy);
          glassPanel(ctx, x, cardY, cardW, cardH, 14, 0.6);
          const g = ctx.createLinearGradient(x, cardY, x + cardW, cardY);
          g.addColorStop(0, s.clr); g.addColorStop(1, GLASS_COLORS[(i + 1) % GLASS_COLORS.length]);
          ctx.fillStyle = g; roundRect(ctx, x, cardY, cardW, 6, 3); ctx.fill();
          ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText(s.name, cx, cardY + cardH * 0.36);
          ctx.fillStyle = '#5e5a8a'; ctx.font = '12px sans-serif';
          wrapText(ctx, s.desc, cx, cardY + cardH * 0.66, cardW - 18, 14);
          ctx.restore();
        }

        // 底部点睛
        const footP = win(sec, TOTAL - T_HOLD - 0.2, TOTAL - 0.1);
        if (footP > 0) {
          ctx.save(); ctx.globalAlpha = footP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('吴氏方法：让计算机自动证明几何定理', W / 2, botSafe - 6);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批14-9: 中国领先技术与产业（id 217）=====
  registerCanvas('china-ai-contrib', {
    title: TEMPLATE_TITLES['china-ai-contrib'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const items = [
        { name: '计算机视觉', desc: '人脸识别 / 安防世界领先', clr: GLASS_COLORS[0] },
        { name: '智能语音', desc: '语音识别与合成产业', clr: GLASS_COLORS[1] },
        { name: '自动驾驶', desc: '无人车 / 智慧交通落地', clr: GLASS_COLORS[2] },
        { name: 'AI 产业', desc: '大模型与平台企业崛起', clr: GLASS_COLORS[4] },
      ];
      const topSafe = 82, botSafe = H - 62;
      const gapX = 18, gapY = 14;
      const cols = 2, rows = Math.ceil(items.length / cols);
      const cardW = Math.max(120, (W - 88 - gapX * (cols - 1)) / cols);
      const availH = Math.max(120, botSafe - topSafe);
      const cardH = Math.min(130, (availH - gapY * (rows - 1)) / rows);
      const totalH = rows * cardH + (rows - 1) * gapY;
      const top0 = topSafe + Math.max(0, (availH - totalH) / 2);
      const cardX = (c) => 44 + c * (cardW + gapX);
      const cardY = (r) => top0 + r * (cardH + gapY);

      const UNIT = 1.4, T_HOLD = 1.0;
      const TOTAL = items.length * UNIT + T_HOLD;
      const stageNames = items.map((it) => `领域：${it.name} — ${it.desc}`);
      stageNames.push('论文 / 专利 / 产业规模领先：中国成为 AI 重要力量');
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        const cur = Math.min(items.length, Math.floor(sec / UNIT));
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          const t0 = i * UNIT;
          const popP = easeOutBack(win(sec, t0, t0 + 0.55));
          if (popP <= 0) continue;
          const sc = Math.max(0, popP);
          const c = i % cols, r = Math.floor(i / cols);
          const x = cardX(c), y = cardY(r);
          const cx = x + cardW / 2, cy = y + cardH / 2;
          ctx.save();
          ctx.globalAlpha = sc;
          ctx.translate(cx, cy); ctx.scale(0.9 + 0.1 * sc, 0.9 + 0.1 * sc);
          ctx.translate(-cx, -cy);
          glassPanel(ctx, x, y, cardW, cardH, 14, 0.6);
          const g = ctx.createLinearGradient(x, y, x + cardW, y);
          g.addColorStop(0, it.clr); g.addColorStop(1, GLASS_COLORS[(i + 1) % GLASS_COLORS.length]);
          ctx.fillStyle = g; roundRect(ctx, x, y, cardW, 6, 3); ctx.fill();
          ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 15px sans-serif';
          ctx.fillText(it.name, cx, y + cardH * 0.38);
          ctx.fillStyle = '#5e5a8a'; ctx.font = '12px sans-serif';
          wrapText(ctx, it.desc, cx, y + cardH * 0.7, cardW - 24, 14);
          ctx.restore();
        }

        const footP = win(sec, TOTAL - T_HOLD - 0.2, TOTAL - 0.1);
        if (footP > 0) {
          ctx.save(); ctx.globalAlpha = footP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('中国 AI：视觉 / 语音 / 自动驾驶 / 产业领先', W / 2, botSafe - 6);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 蓝紫毛玻璃风：网格卡片丝滑入场（工厂通用）=====
  // items: {name,desc}；cols 列数；arrows 列间画 →
  async function glassGridPlay(api, cols, items, opts) {
    opts = opts || {};
    const { ctx, setStatus } = api;
    const W = ctx._cssW, H = ctx._cssH;
    const rows = Math.ceil(items.length / cols);
    const AREA_TOP = 72, AREA_BOTTOM = H - 50;
    const padX = 40, gapX = 14, gapY = 12;
    const cw = (W - padX * 2 - gapX * (cols - 1)) / cols;
    const availH = Math.max(80, AREA_BOTTOM - AREA_TOP);
    const cardH = Math.min(opts.cardH || 100, (availH - gapY * (rows - 1)) / rows);
    const totalH = rows * cardH + (rows - 1) * gapY;
    const top0 = AREA_TOP + Math.max(0, (availH - totalH) / 2);
    const UNIT = 0.46, TENTER = 0.5;
    const total = items.length * UNIT + 0.35;
    let last = -1;
    return tweenPlay(api, total * 1000, pr => {
      const sec = pr * total;
      paintGlassBg(ctx, W, H);
      ctx.textAlign = 'center';
      for (let i = 0; i < items.length; i++) {
        const local = easeOutBack(clamp01((sec - i * UNIT) / TENTER));
        if (local <= 0) continue;
        const it = items[i];
        const col = i % cols, row = Math.floor(i / cols);
        const x = padX + col * (cw + gapX);
        const y = top0 + row * (cardH + gapY) + (1 - local) * 18;
        const cx = x + cw / 2, cyc = y + cardH / 2;
        ctx.save();
        ctx.globalAlpha = local;
        ctx.translate(cx, cyc);
        ctx.scale(0.92 + 0.08 * local, 0.92 + 0.08 * local);
        ctx.translate(-cx, -cyc);
        glassPanel(ctx, x, y, cw, cardH, 12, 0.62);
        const g = ctx.createLinearGradient(x, y, x + cw, y);
        g.addColorStop(0, GLASS_COLORS[i % GLASS_COLORS.length]);
        g.addColorStop(1, GLASS_COLORS[(i + 1) % GLASS_COLORS.length]);
        ctx.fillStyle = g;
        roundRect(ctx, x, y, cw, 5, 3); ctx.fill();
        ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 14px sans-serif';
        ctx.fillText(it.name, cx, y + cardH * 0.38);
        ctx.fillStyle = '#5e5a8a'; ctx.font = '11px sans-serif';
        wrapText(ctx, it.desc, cx, y + cardH * 0.66, cw - 22, 14);
        ctx.restore();
        if (opts.arrows && (i + 1) % cols !== 0 && i < items.length - 1) {
          const ap = clamp01((sec - (i + 1) * UNIT) / 0.4);
          if (ap > 0) {
            ctx.save(); ctx.globalAlpha = ap;
            ctx.fillStyle = '#7aa7f0'; ctx.font = 'bold 17px sans-serif';
            ctx.fillText('→', x + cw + gapX / 2, y + cardH / 2 + 6);
            ctx.restore();
          }
        }
        if (Math.floor(sec / UNIT) === i && last !== i) {
          last = i;
          setStatus(`${it.name}：${it.desc}`);
        }
      }
    });
  }

  // ===== 批15 通用四宫格工厂（应用领域类）=====
  function gridFour(title, items, finalStatus) {
    return {
      title: TEMPLATE_TITLES[title],
      mount: makeCanvasHD,
      async play(values, api) {
        const ok = await glassGridPlay(api, 2, items);
        if (ok === false) return;
        api.setStatus(finalStatus, 'ok');
      },
    };
  }

  registerCanvas('industry-ai', gridFour('industry-ai', [
    { name: '智能质检', desc: '机器视觉检测产品缺陷', clr: '#8ec5e0' },
    { name: '预测性维护', desc: '传感器预测设备故障', clr: '#7aa7f0' },
    { name: '智能排产', desc: '算法优化生产计划', clr: '#f0a8d8' },
    { name: '机器人产线', desc: '工业机器人自动装配', clr: '#a586e8' },
  ], 'AI+工业：提质增效、柔性制造'));

  registerCanvas('agriculture-ai', gridFour('agriculture-ai', [
    { name: '精准种植', desc: '土壤/气象数据指导耕作', clr: '#8ec5e0' },
    { name: '病虫害识别', desc: '图像识别及时防治', clr: '#f0a8d8' },
    { name: '农业无人机', desc: '巡田/播种/精准喷洒', clr: '#7aa7f0' },
    { name: '智能灌溉', desc: '按需供水节约资源', clr: '#a586e8' },
  ], 'AI+农业：从"看天吃饭"到精准农业'));

  registerCanvas('medical-ai', gridFour('medical-ai', [
    { name: '影像诊断', desc: 'CT/病理图像辅助筛查', clr: '#8ec5e0' },
    { name: '辅助诊疗', desc: '症状分析给出建议', clr: '#7aa7f0' },
    { name: '药物研发', desc: 'AI加速分子筛选', clr: '#f0a8d8' },
    { name: '健康管理', desc: '可穿戴设备监测预警', clr: '#a586e8' },
  ], 'AI+医疗：早筛早诊、精准医疗'));

  registerCanvas('security-ai', gridFour('security-ai', [
    { name: '视频监控', desc: '海量摄像头智能分析', clr: '#8ec5e0' },
    { name: '人脸识别', desc: '重点人员实时比对', clr: '#7aa7f0' },
    { name: '异常行为', desc: '人群聚集/跌倒预警', clr: '#f0a8d8' },
    { name: '周界防范', desc: '入侵检测联动报警', clr: '#a586e8' },
  ], 'AI+安防：主动预警、立体化防控'));

  // ===== 批15-2: 洋山深水港（id 231）=====
  registerCanvas('yangshan-port', {
    title: TEMPLATE_TITLES['yangshan-port'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const stages = [
        { name: '岸桥卸船', desc: '远程操控自动抓箱', clr: GLASS_COLORS[0] },
        { name: 'AGV 搬运', desc: '无人车水平运输', clr: GLASS_COLORS[1] },
        { name: '自动堆场', desc: '轨道吊精准堆放', clr: GLASS_COLORS[2] },
        { name: '智能管控', desc: '"大脑"调度全场', clr: GLASS_COLORS[4] },
      ];
      const topSafe = 82, botSafe = H - 62;
      const gap = 16;
      const cardW = Math.max(90, (W - 88 - gap * 3) / 4);
      const cardH = Math.max(110, Math.min(150, botSafe - topSafe - 30));
      const cardY = (topSafe + botSafe - cardH) / 2;
      const cardX = (i) => 44 + i * (cardW + gap);

      const UNIT = 1.4, T_HOLD = 0.9;
      const TOTAL = stages.length * UNIT + T_HOLD;
      const stageNames = stages.map((s, i) => `环节${i + 1}：${s.name} — ${s.desc}`);
      stageNames.push('洋山港：岸桥 - AGV - 堆场 - 大脑全自动闭环');
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        const cur = Math.min(stages.length, Math.floor(sec / UNIT));
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 箭头
        for (let i = 0; i < stages.length - 1; i++) {
          const ap = easeOutCubic(win(sec, (i + 1) * UNIT - 0.2, (i + 1) * UNIT + 0.3));
          if (ap > 0) {
            ctx.save(); ctx.globalAlpha = ap;
            ctx.fillStyle = GLASS_COLORS[4]; ctx.font = 'bold 18px sans-serif';
            ctx.fillText('→', cardX(i) + cardW + gap / 2, cardY + cardH / 2 + 6);
            ctx.restore();
          }
        }

        // 卡片
        for (let i = 0; i < stages.length; i++) {
          const s = stages[i];
          const t0 = i * UNIT;
          const popP = easeOutBack(win(sec, t0, t0 + 0.55));
          if (popP <= 0) continue;
          const sc = Math.max(0, popP);
          const x = cardX(i), cx = x + cardW / 2, cy = cardY + cardH / 2;
          ctx.save();
          ctx.globalAlpha = sc;
          ctx.translate(cx, cy); ctx.scale(0.9 + 0.1 * sc, 0.9 + 0.1 * sc);
          ctx.translate(-cx, -cy);
          glassPanel(ctx, x, cardY, cardW, cardH, 14, 0.6);
          const g = ctx.createLinearGradient(x, cardY, x + cardW, cardY);
          g.addColorStop(0, s.clr); g.addColorStop(1, GLASS_COLORS[(i + 1) % GLASS_COLORS.length]);
          ctx.fillStyle = g; roundRect(ctx, x, cardY, cardW, 6, 3); ctx.fill();
          ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText(s.name, cx, cardY + cardH * 0.36);
          ctx.fillStyle = '#5e5a8a'; ctx.font = '12px sans-serif';
          wrapText(ctx, s.desc, cx, cardY + cardH * 0.66, cardW - 18, 14);
          ctx.restore();
        }

        const footP = win(sec, TOTAL - T_HOLD - 0.2, TOTAL - 0.1);
        if (footP > 0) {
          ctx.save(); ctx.globalAlpha = footP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('"空无一人"却昼夜不息：世界最大自动化码头', W / 2, botSafe - 6);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批15-6: 智能家居与智能交通（id 235）=====
  registerCanvas('smart-home-traffic', {
    title: TEMPLATE_TITLES['smart-home-traffic'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const cols = [
        { name: '智能家居', pts: ['语音控制家电', '智能门锁安防', '环境自动调节'], clr: GLASS_COLORS[0] },
        { name: '智能交通', pts: ['信号灯智能配时', '路况实时调度', '车路协同出行'], clr: GLASS_COLORS[1] },
      ];
      const topSafe = 82, botSafe = H - 62;
      const gapX = 18;
      const colW = Math.max(140, (W - 88 - gapX) / 2);
      const colX = [44, W - 44 - colW];
      const headH = 34;
      const availH = Math.max(140, botSafe - topSafe);
      const bodyH = Math.min(availH - headH - 14, 170);
      const colY = topSafe + Math.max(0, (availH - (headH + bodyH)) / 2);
      const itemH = bodyH / 3;

      const UNIT = 1.05, T_HOLD = 0.9;
      const totalItems = cols.length * 3;
      const TOTAL = totalItems * UNIT + T_HOLD;
      const stageNames = [];
      cols.forEach((c) => c.pts.forEach((pt) => stageNames.push(`${c.name}：${pt}`)));
      stageNames.push('智能家居 + 智能交通：AI 连接生活每一处');
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        const cur = Math.min(totalItems, Math.floor(sec / UNIT));
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        for (let ci = 0; ci < cols.length; ci++) {
          const c = cols[ci];
          const x = colX[ci];
          // 列头部
          const headP = easeOutBack(win(sec, ci * 3 * UNIT, ci * 3 * UNIT + 0.5));
          if (headP > 0) {
            const sc = Math.max(0, headP);
            ctx.save();
            ctx.globalAlpha = sc;
            const cx = x + colW / 2, cy = colY + headH / 2;
            ctx.translate(cx, cy); ctx.scale(0.92 + 0.08 * sc, 0.92 + 0.08 * sc);
            ctx.translate(-cx, -cy);
            const g = ctx.createLinearGradient(x, colY, x + colW, colY);
            g.addColorStop(0, c.clr); g.addColorStop(1, GLASS_COLORS[(ci * 2 + 3) % GLASS_COLORS.length]);
            ctx.fillStyle = g; roundRect(ctx, x, colY, colW, headH, 10); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.font = 'bold 15px sans-serif';
            ctx.fillText(c.name, cx, colY + headH / 2 + 1);
            ctx.restore();
          }
          // 要点条目
          for (let pi = 0; pi < c.pts.length; pi++) {
            const itemIdx = ci * 3 + pi;
            const t0 = itemIdx * UNIT + 0.2;
            const popP = easeOutBack(win(sec, t0, t0 + 0.5));
            if (popP <= 0) continue;
            const sc = Math.max(0, popP);
            const iy = colY + headH + 10 + pi * itemH;
            ctx.save();
            ctx.globalAlpha = sc;
            const cx = x + colW / 2, cy = iy + itemH / 2;
            ctx.translate(cx, cy); ctx.scale(0.94 + 0.06 * sc, 0.94 + 0.06 * sc);
            ctx.translate(-cx, -cy);
            glassPanel(ctx, x + 4, iy, colW - 8, itemH - 6, 10, 0.55);
            ctx.fillStyle = c.clr; ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('●', x + 14, iy + itemH / 2);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#2a1f5e'; ctx.font = '12px sans-serif';
            ctx.fillText(c.pts[pi], cx, iy + itemH / 2);
            ctx.restore();
          }
        }

        const footP = win(sec, TOTAL - T_HOLD - 0.2, TOTAL - 0.1);
        if (footP > 0) {
          ctx.save(); ctx.globalAlpha = footP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('让居家更便捷、让出行更高效', W / 2, botSafe - 6);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批15-7: 智能教育与智能服务（id 236）=====
  registerCanvas('smart-edu-service', {
    title: TEMPLATE_TITLES['smart-edu-service'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const cols = [
        { name: '智能教育', pts: ['作业自动批改', '个性化学习路径', 'AI 教师答疑'], clr: GLASS_COLORS[2] },
        { name: '智能服务', pts: ['智能客服对话', '精准内容推荐', '无人零售配送'], clr: GLASS_COLORS[4] },
      ];
      const topSafe = 82, botSafe = H - 62;
      const gapX = 18;
      const colW = Math.max(140, (W - 88 - gapX) / 2);
      const colX = [44, W - 44 - colW];
      const headH = 34;
      const availH = Math.max(140, botSafe - topSafe);
      const bodyH = Math.min(availH - headH - 14, 170);
      const colY = topSafe + Math.max(0, (availH - (headH + bodyH)) / 2);
      const itemH = bodyH / 3;

      const UNIT = 1.05, T_HOLD = 0.9;
      const totalItems = cols.length * 3;
      const TOTAL = totalItems * UNIT + T_HOLD;
      const stageNames = [];
      cols.forEach((c) => c.pts.forEach((pt) => stageNames.push(`${c.name}：${pt}`)));
      stageNames.push('智能教育与智能服务：个性化、全天候');
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        const cur = Math.min(totalItems, Math.floor(sec / UNIT));
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        for (let ci = 0; ci < cols.length; ci++) {
          const c = cols[ci];
          const x = colX[ci];
          const headP = easeOutBack(win(sec, ci * 3 * UNIT, ci * 3 * UNIT + 0.5));
          if (headP > 0) {
            const sc = Math.max(0, headP);
            ctx.save();
            ctx.globalAlpha = sc;
            const cx = x + colW / 2, cy = colY + headH / 2;
            ctx.translate(cx, cy); ctx.scale(0.92 + 0.08 * sc, 0.92 + 0.08 * sc);
            ctx.translate(-cx, -cy);
            const g = ctx.createLinearGradient(x, colY, x + colW, colY);
            g.addColorStop(0, c.clr); g.addColorStop(1, GLASS_COLORS[(ci * 2 + 1) % GLASS_COLORS.length]);
            ctx.fillStyle = g; roundRect(ctx, x, colY, colW, headH, 10); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.font = 'bold 15px sans-serif';
            ctx.fillText(c.name, cx, colY + headH / 2 + 1);
            ctx.restore();
          }
          for (let pi = 0; pi < c.pts.length; pi++) {
            const itemIdx = ci * 3 + pi;
            const t0 = itemIdx * UNIT + 0.2;
            const popP = easeOutBack(win(sec, t0, t0 + 0.5));
            if (popP <= 0) continue;
            const sc = Math.max(0, popP);
            const iy = colY + headH + 10 + pi * itemH;
            ctx.save();
            ctx.globalAlpha = sc;
            const cx = x + colW / 2, cy = iy + itemH / 2;
            ctx.translate(cx, cy); ctx.scale(0.94 + 0.06 * sc, 0.94 + 0.06 * sc);
            ctx.translate(-cx, -cy);
            glassPanel(ctx, x + 4, iy, colW - 8, itemH - 6, 10, 0.55);
            ctx.fillStyle = c.clr; ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('●', x + 14, iy + itemH / 2);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#2a1f5e'; ctx.font = '12px sans-serif';
            ctx.fillText(c.pts[pi], cx, iy + itemH / 2);
            ctx.restore();
          }
        }

        const footP = win(sec, TOTAL - T_HOLD - 0.2, TOTAL - 0.1);
        if (footP > 0) {
          ctx.save(); ctx.globalAlpha = footP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('因材施教 + 千人千面：AI 提升服务体验', W / 2, botSafe - 6);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批15-8: 个人信用评估（id 237）=====
  registerCanvas('credit-score', {
    title: TEMPLATE_TITLES['credit-score'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const stages = [
        { name: '数据采集', desc: '信贷 / 缴费 / 履约记录', clr: GLASS_COLORS[0] },
        { name: '特征工程', desc: '提取信用相关指标', clr: GLASS_COLORS[1] },
        { name: '评分模型', desc: '机器学习综合打分', clr: GLASS_COLORS[2] },
        { name: '信用分', desc: '决定贷款额度与利率', clr: GLASS_COLORS[4] },
      ];
      const topSafe = 82, botSafe = H - 62;
      const gap = 16;
      const cardW = Math.max(90, (W - 88 - gap * 3) / 4);
      const cardH = Math.max(110, Math.min(150, botSafe - topSafe - 30));
      const cardY = (topSafe + botSafe - cardH) / 2;
      const cardX = (i) => 44 + i * (cardW + gap);

      const UNIT = 1.4, T_HOLD = 0.9;
      const TOTAL = stages.length * UNIT + T_HOLD;
      const stageNames = stages.map((s, i) => `环节${i + 1}：${s.name} — ${s.desc}`);
      stageNames.push('个人信用评估：数据 → 特征 → 模型 → 信用分');
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        const cur = Math.min(stages.length, Math.floor(sec / UNIT));
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 箭头
        for (let i = 0; i < stages.length - 1; i++) {
          const ap = easeOutCubic(win(sec, (i + 1) * UNIT - 0.2, (i + 1) * UNIT + 0.3));
          if (ap > 0) {
            ctx.save(); ctx.globalAlpha = ap;
            ctx.fillStyle = GLASS_COLORS[4]; ctx.font = 'bold 18px sans-serif';
            ctx.fillText('→', cardX(i) + cardW + gap / 2, cardY + cardH / 2 + 6);
            ctx.restore();
          }
        }

        // 卡片
        for (let i = 0; i < stages.length; i++) {
          const s = stages[i];
          const t0 = i * UNIT;
          const popP = easeOutBack(win(sec, t0, t0 + 0.55));
          if (popP <= 0) continue;
          const sc = Math.max(0, popP);
          const x = cardX(i), cx = x + cardW / 2, cy = cardY + cardH / 2;
          ctx.save();
          ctx.globalAlpha = sc;
          ctx.translate(cx, cy); ctx.scale(0.9 + 0.1 * sc, 0.9 + 0.1 * sc);
          ctx.translate(-cx, -cy);
          glassPanel(ctx, x, cardY, cardW, cardH, 14, 0.6);
          const g = ctx.createLinearGradient(x, cardY, x + cardW, cardY);
          g.addColorStop(0, s.clr); g.addColorStop(1, GLASS_COLORS[(i + 1) % GLASS_COLORS.length]);
          ctx.fillStyle = g; roundRect(ctx, x, cardY, cardW, 6, 3); ctx.fill();
          ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText(s.name, cx, cardY + cardH * 0.36);
          ctx.fillStyle = '#5e5a8a'; ctx.font = '12px sans-serif';
          wrapText(ctx, s.desc, cx, cardY + cardH * 0.66, cardW - 18, 14);
          ctx.restore();
        }

        const footP = win(sec, TOTAL - T_HOLD - 0.2, TOTAL - 0.1);
        if (footP > 0) {
          ctx.save(); ctx.globalAlpha = footP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('信用分越高，享受到的金融服务越便利', W / 2, botSafe - 6);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批16：影响/责任/项目/总结 类（id 238-247）=====
  registerCanvas('ai-positive-impact', gridFour('ai-positive-impact', [
    { name: '经济发展', desc: '新产业新业态提质增效', clr: '#8ec5e0' },
    { name: '生活便利', desc: '出行/医疗/家居更便捷', clr: '#7aa7f0' },
    { name: '科研加速', desc: 'AI辅助发现与创新', clr: '#f0a8d8' },
    { name: '社会治理', desc: '智慧城市提升公共服务', clr: '#a586e8' },
  ], 'AI正面影响：赋能百业、造福生活'));

  registerCanvas('ai-challenges', gridFour('ai-challenges', [
    { name: '就业冲击', desc: '部分岗位被自动化替代', clr: '#f0a8d8' },
    { name: '伦理困境', desc: '偏见/责任/权利争议', clr: '#a586e8' },
    { name: '数字鸿沟', desc: '技术差距加剧不平等', clr: '#a586e8' },
    { name: '安全风险', desc: '失控/滥用/隐私威胁', clr: '#f0a8d8' },
  ], 'AI是双刃剑：拥抱便利也要正视挑战'));

  registerCanvas('info-social-duty', gridFour('info-social-duty', [
    { name: '遵纪守法', desc: '不利用AI从事违法活动', clr: '#8ec5e0' },
    { name: '尊重隐私', desc: '不非法采集他人数据', clr: '#7aa7f0' },
    { name: '诚信自律', desc: '不造假不传谣不抄袭', clr: '#f0a8d8' },
    { name: '理性看待', desc: '人机协作而非盲目依赖', clr: '#a586e8' },
  ], '信息社会责任：做AI时代负责任的公民'));

  // 通用横向流程工厂（蓝紫毛玻璃丝滑版）
  function pipeline(title, stages, finalStatus) {
    return {
      title: TEMPLATE_TITLES[title],
      mount: makeCanvasHD,
      async play(values, api) {
        const ok = await glassGridPlay(api, stages.length, stages, { arrows: true, cardH: 104 });
        if (ok === false) return;
        api.setStatus(finalStatus, 'ok');
      },
    };
  }

  registerCanvas('project-overview', pipeline('project-overview', [
    { name: '项目目标', desc: '用AI解决真实问题' },
    { name: '阶段一', desc: '体验人机对话' },
    { name: '阶段二', desc: '开发值守机器人' },
    { name: '成果展示', desc: '答辩与迭代优化' },
  ], '项目式学习：体验→开发→展示完整闭环'));

  registerCanvas('project-stage1', pipeline('project-stage1', [
    { name: '提出问题', desc: '设计对话主题' },
    { name: '人机对话', desc: '与AI多轮交流' },
    { name: '记录分析', desc: '看AI答得准不准' },
    { name: '反思总结', desc: '理解AI能力边界' },
  ], '阶段一：在对话中感受AI的智能与局限'));

  registerCanvas('project-stage2', pipeline('project-stage2', [
    { name: '需求分析', desc: '明确值守任务' },
    { name: '数据准备', desc: '采集问答语料' },
    { name: '训练调试', desc: '搭建对话模型' },
    { name: '部署运行', desc: '机器人值守服务' },
  ], '阶段二：动手开发信息值守机器人'));

  // ===== 批16-7: 知识脉络图（id 246）=====
  registerCanvas('knowledge-map', {
    title: TEMPLATE_TITLES['knowledge-map'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const chain = [
        { name: '基础概念', desc: '什么是 AI / 图灵测试', clr: GLASS_COLORS[0] },
        { name: '核心技术', desc: '机器学习 / 深度学习 / NLP', clr: GLASS_COLORS[1] },
        { name: '典型应用', desc: '视觉 / 语音 / 自动驾驶', clr: GLASS_COLORS[2] },
        { name: '伦理安全', desc: '三定律 / 原则 / 法律', clr: GLASS_COLORS[4] },
      ];
      const topSafe = 82, botSafe = H - 62;
      const gap = 16;
      const cardW = Math.max(90, (W - 88 - gap * 3) / 4);
      const cardH = Math.max(110, Math.min(150, botSafe - topSafe - 30));
      const cardY = (topSafe + botSafe - cardH) / 2;
      const cardX = (i) => 44 + i * (cardW + gap);

      const UNIT = 1.4, T_HOLD = 0.9;
      const TOTAL = chain.length * UNIT + T_HOLD;
      const stageNames = chain.map((c, i) => `板块${i + 1}：${c.name} — ${c.desc}`);
      stageNames.push('知识脉络：基础概念到伦理安全四大板块');
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        const cur = Math.min(chain.length, Math.floor(sec / UNIT));
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 连线箭头
        for (let i = 0; i < chain.length - 1; i++) {
          const ap = easeOutCubic(win(sec, (i + 1) * UNIT - 0.2, (i + 1) * UNIT + 0.3));
          if (ap > 0) {
            ctx.save(); ctx.globalAlpha = ap;
            ctx.fillStyle = GLASS_COLORS[4]; ctx.font = 'bold 18px sans-serif';
            ctx.fillText('→', cardX(i) + cardW + gap / 2, cardY + cardH / 2 + 6);
            ctx.restore();
          }
        }

        // 卡片
        for (let i = 0; i < chain.length; i++) {
          const c = chain[i];
          const t0 = i * UNIT;
          const popP = easeOutBack(win(sec, t0, t0 + 0.55));
          if (popP <= 0) continue;
          const sc = Math.max(0, popP);
          const x = cardX(i), cx = x + cardW / 2, cy = cardY + cardH / 2;
          ctx.save();
          ctx.globalAlpha = sc;
          ctx.translate(cx, cy); ctx.scale(0.9 + 0.1 * sc, 0.9 + 0.1 * sc);
          ctx.translate(-cx, -cy);
          glassPanel(ctx, x, cardY, cardW, cardH, 14, 0.6);
          const g = ctx.createLinearGradient(x, cardY, x + cardW, cardY);
          g.addColorStop(0, c.clr); g.addColorStop(1, GLASS_COLORS[(i + 1) % GLASS_COLORS.length]);
          ctx.fillStyle = g; roundRect(ctx, x, cardY, cardW, 6, 3); ctx.fill();
          ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText(c.name, cx, cardY + cardH * 0.36);
          ctx.fillStyle = '#5e5a8a'; ctx.font = '12px sans-serif';
          wrapText(ctx, c.desc, cx, cardY + cardH * 0.66, cardW - 18, 14);
          ctx.restore();
        }

        const footP = win(sec, TOTAL - T_HOLD - 0.2, TOTAL - 0.1);
        if (footP > 0) {
          ctx.save(); ctx.globalAlpha = footP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('概念 → 技术 → 应用 → 伦理：AI 知识体系一图串联', W / 2, botSafe - 6);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批16-8: 关键概念速查与易混辨析（id 247）=====
  registerCanvas('concept-review', {
    title: TEMPLATE_TITLES['concept-review'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const pairs = [
        { a: 'AI ⊃ ML ⊃ DL', b: '人工智能包含机器学习，深度学习是ML子集', clr: GLASS_COLORS[0] },
        { a: '弱AI vs 强AI', b: '专用智能已实现；通用人类级智能尚未到来', clr: GLASS_COLORS[1] },
        { a: '监督 vs 无监督', b: '监督有标签学预测；无监督找结构', clr: GLASS_COLORS[2] },
      ];
      const topSafe = 82, botSafe = H - 62;
      const gapY = 14;
      const rowH = Math.max(70, (botSafe - topSafe - gapY * 2) / 3);
      const totalH = rowH * 3 + gapY * 2;
      const rowY0 = topSafe + Math.max(0, (botSafe - topSafe - totalH) / 2);
      const tagW = Math.max(120, W * 0.3);
      const rowY = (i) => rowY0 + i * (rowH + gapY);

      const UNIT = 2.0, T_HOLD = 0.9;
      const TOTAL = pairs.length * UNIT + T_HOLD;
      const stageNames = pairs.map(p => `辨析：${p.a} — ${p.b}`);
      stageNames.push('易混辨析：AI/ML/DL、强弱AI、监督无监督');
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        const cur = Math.min(pairs.length, Math.floor(sec / UNIT));
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        for (let i = 0; i < pairs.length; i++) {
          const p0 = pairs[i];
          const t0 = i * UNIT;
          const popP = easeOutBack(win(sec, t0, t0 + 0.55));
          if (popP <= 0) continue;
          const sc = Math.max(0, popP);
          const y = rowY(i), cy = y + rowH / 2;
          ctx.save();
          ctx.globalAlpha = sc;
          // 左侧概念标签
          const g = ctx.createLinearGradient(44, y, 44 + tagW, y);
          g.addColorStop(0, p0.clr); g.addColorStop(1, GLASS_COLORS[(i + 1) % GLASS_COLORS.length]);
          ctx.fillStyle = g;
          roundRect(ctx, 44, y, tagW, rowH, 12); ctx.fill();
          ctx.fillStyle = '#0b132b'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(p0.a, 44 + tagW / 2, cy);
          // 右侧描述面板
          const dx = 44 + tagW + 14, dw = Math.max(80, W - 44 - dx);
          glassPanel(ctx, dx, y, dw, rowH, 12, 0.6);
          ctx.fillStyle = '#312a5c'; ctx.font = '12px sans-serif';
          wrapText(ctx, p0.b, dx + dw / 2, cy, dw - 24, 15);
          ctx.restore();
        }

        const footP = win(sec, TOTAL - T_HOLD - 0.2, TOTAL - 0.1);
        if (footP > 0) {
          ctx.save(); ctx.globalAlpha = footP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('厘清包含关系与核心区别：概念不再混淆', W / 2, botSafe - 6);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // pipeline 工厂复用：NLP层次/图灵测试方法/CAPTCHA
  registerCanvas('nlp-tasks', pipeline('nlp-tasks', [
    { name: '词法分析', desc: '分词/词性标注' },
    { name: '句法分析', desc: '句子结构依存' },
    { name: '语义分析', desc: '理解句子含义' },
    { name: '语用分析', desc: '结合语境意图' },
  ], 'NLP四层次：从字词到语境逐级理解语言'));

  registerCanvas('turing-test-method', pipeline('turing-test-method', [
    { name: '多轮问答', desc: '文字交流任意话题' },
    { name: '多人评判', desc: '多名询问者独立判断' },
    { name: '统计比例', desc: '误判率超过30%' },
    { name: '判定通过', desc: '认为具有智能表现' },
  ], '图灵测试方法：用统计标准衡量机器表现'));

  registerCanvas('captcha', pipeline('captcha', [
    { name: '发起验证', desc: '登录/注册时触发' },
    { name: '识别任务', desc: '扭曲字符/点选图片' },
    { name: '人易机难', desc: '人类轻松识别' },
    { name: '区分人机', desc: '挡住自动化程序' },
  ], 'CAPTCHA：全自动区分人类与机器的反向测试'));

  // ===== 批17-1: 斯腾博格三元智力（id 248）=====
  registerCanvas('intelligence-def', {
    title: TEMPLATE_TITLES['intelligence-def'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const tri = [
        { name: '分析性智力', desc: '逻辑推理、解决问题', ex: '解题考试', clr: GLASS_COLORS[0] },
        { name: '创造性智力', desc: '应对新情境、发明创造', ex: '艺术创作', clr: GLASS_COLORS[1] },
        { name: '实践性智力', desc: '运用经验处理现实', ex: '社交处世', clr: GLASS_COLORS[2] },
      ];
      const topSafe = 82, botSafe = H - 62;
      const gap = 16;
      const cardW = Math.max(120, (W - 88 - gap * 2) / 3);
      const cardH = Math.max(130, Math.min(170, botSafe - topSafe - 24));
      const cardY = topSafe + Math.max(0, (botSafe - topSafe - cardH) / 2);
      const cardX = (i) => 44 + i * (cardW + gap);

      const UNIT = 2.0, T_HOLD = 0.9;
      const TOTAL = tri.length * UNIT + T_HOLD;
      const stageNames = tri.map(t => `${t.name}：${t.desc}（${t.ex}）`);
      stageNames.push('斯腾博格：分析/创造/实践三元智力');
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        const cur = Math.min(tri.length, Math.floor(sec / UNIT));
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        for (let i = 0; i < tri.length; i++) {
          const t = tri[i];
          const t0 = i * UNIT;
          const popP = easeOutBack(win(sec, t0, t0 + 0.55));
          if (popP <= 0) continue;
          const sc = Math.max(0, popP);
          const x = cardX(i), cx = x + cardW / 2, cyc = cardY + cardH / 2;
          ctx.save();
          ctx.globalAlpha = sc;
          ctx.translate(cx, cyc); ctx.scale(0.9 + 0.1 * sc, 0.9 + 0.1 * sc);
          ctx.translate(-cx, -cyc);
          glassPanel(ctx, x, cardY, cardW, cardH, 14, 0.6);
          const g = ctx.createLinearGradient(x, cardY, x + cardW, cardY);
          g.addColorStop(0, t.clr); g.addColorStop(1, GLASS_COLORS[(i + 1) % GLASS_COLORS.length]);
          ctx.fillStyle = g; roundRect(ctx, x, cardY, cardW, 6, 3); ctx.fill();
          ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText(t.name, cx, cardY + 34);
          ctx.fillStyle = '#5e5a8a'; ctx.font = '12px sans-serif';
          wrapText(ctx, t.desc, cx, cardY + 64, cardW - 20, 15);
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 11px sans-serif';
          wrapText(ctx, '例：' + t.ex, cx, cardY + cardH - 28, cardW - 20, 14);
          ctx.restore();
        }

        const footP = win(sec, TOTAL - T_HOLD - 0.2, TOTAL - 0.1);
        if (footP > 0) {
          ctx.save(); ctx.globalAlpha = footP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('智能不等于智商：分析+创造+实践三者平衡', W / 2, botSafe - 6);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批17-2: 集体智能（id 249）=====
  registerCanvas('collective-intelligence', {
    title: TEMPLATE_TITLES['collective-intelligence'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const demos = [
        { name: '蚁群', desc: '信息素找最短路径', clr: GLASS_COLORS[0] },
        { name: '蜂群', desc: '分工协作维持蜂巢', clr: GLASS_COLORS[1] },
        { name: '鸟群', desc: '简单规则形成编队', clr: GLASS_COLORS[2] },
        { name: '人群', desc: '众包/群体决策', clr: GLASS_COLORS[4] },
      ];
      const topSafe = 82, botSafe = H - 62;
      const leftW = Math.max(120, W * 0.3);
      const gapX = 14, gapY = 12;
      const gridX = 44 + leftW + gapX;
      const gridW = W - 44 - gridX;
      const cardW = Math.max(90, (gridW - gapX) / 2);
      const cardH = Math.max(70, Math.min(100, (botSafe - topSafe - gapY) / 2));
      const cardY0 = topSafe + Math.max(0, (botSafe - topSafe - (cardH * 2 + gapY)) / 2);
      const cardX = (i) => gridX + (i % 2) * (cardW + gapX);
      const cardY = (i) => cardY0 + Math.floor(i / 2) * (cardH + gapY);

      const UNIT = 1.2, T_HOLD = 0.9;
      const TOTAL = 1.0 + demos.length * UNIT + T_HOLD;
      const stageNames = ['个体遵循简单规则', ...demos.map(d => `${d.name}：${d.desc}`)];
      stageNames.push('集体智能：蚁群/蜂群/鸟群/人群的涌现智慧');
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        const leftP = easeOutCubic(win(sec, 0, 0.8));
        const cur = sec < 1.0 ? 0 : Math.min(demos.length, Math.floor((sec - 1.0) / UNIT) + 1);
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        if (leftP > 0) {
          ctx.save(); ctx.globalAlpha = leftP;
          const lcx = 44 + leftW / 2, lcy = (topSafe + botSafe) / 2 - 14;
          for (let i = 0; i < 14; i++) {
            const ang = i / 14 * Math.PI * 2;
            const px = lcx + Math.cos(ang) * 40;
            const py = lcy + Math.sin(ang) * 30;
            ctx.fillStyle = GLASS_COLORS[i % GLASS_COLORS.length];
            ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
          }
          glassPanel(ctx, 44, cardY0, leftW, cardH * 2 + gapY, 14, 0.5);
          ctx.fillStyle = '#5e5a8a'; ctx.font = '12px sans-serif';
          ctx.fillText('个体（规则简单）', lcx, lcy + 52);
          ctx.fillStyle = GLASS_COLORS[4]; ctx.font = 'bold 20px sans-serif';
          ctx.fillText('⇒', gridX - gapX / 2, (topSafe + botSafe) / 2 + 6);
          ctx.restore();
        }

        for (let i = 0; i < demos.length; i++) {
          const d = demos[i];
          const t0 = 1.0 + i * UNIT;
          const popP = easeOutBack(win(sec, t0, t0 + 0.5));
          if (popP <= 0) continue;
          const sc = Math.max(0, popP);
          const x = cardX(i), cx = x + cardW / 2, y = cardY(i), cy = y + cardH / 2;
          ctx.save();
          ctx.globalAlpha = sc;
          ctx.translate(cx, cy); ctx.scale(0.9 + 0.1 * sc, 0.9 + 0.1 * sc);
          ctx.translate(-cx, -cy);
          glassPanel(ctx, x, y, cardW, cardH, 12, 0.6);
          const g = ctx.createLinearGradient(x, y, x + cardW, y);
          g.addColorStop(0, d.clr); g.addColorStop(1, GLASS_COLORS[(i + 1) % GLASS_COLORS.length]);
          ctx.fillStyle = g; roundRect(ctx, x, y, cardW, 5, 3); ctx.fill();
          ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText(d.name, cx, y + cardH * 0.42);
          ctx.fillStyle = '#5e5a8a'; ctx.font = '11px sans-serif';
          wrapText(ctx, d.desc, cx, y + cardH * 0.72, cardW - 16, 13);
          ctx.restore();
        }

        const footP = win(sec, TOTAL - T_HOLD - 0.2, TOTAL - 0.1);
        if (footP > 0) {
          ctx.save(); ctx.globalAlpha = footP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('群体智能算法（蚁群/粒子群）启发自这一现象', W / 2, botSafe - 6);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批17-3: AI早期历史（id 250）=====
  registerCanvas('ai-early-history', {
    title: TEMPLATE_TITLES['ai-early-history'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const ev = [
        { year: '1950', name: '图灵之问', desc: '"机器能思维吗？"', clr: GLASS_COLORS[0] },
        { year: '1956', name: '达特茅斯会议', desc: 'AI正式得名', clr: GLASS_COLORS[1] },
        { year: '1950s-60s', name: '早期狂热', desc: '定理证明/跳棋程序', clr: GLASS_COLORS[2] },
      ];
      const topSafe = 82, botSafe = H - 62;
      const segW = (W - 88) / 3;
      const lineY = (topSafe + botSafe) / 2;
      const nodeR = 18;
      const nodeX = (i) => 44 + (i + 0.5) * segW;

      const UNIT = 1.9, T_HOLD = 1.0;
      const TOTAL = ev.length * UNIT + T_HOLD;
      const stageNames = ev.map(e => `${e.year} ${e.name}：${e.desc}`);
      stageNames.push('AI早期：图灵之问→达特茅斯定名→早期狂热');
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        // 内容容器玻璃面板
        glassPanel(ctx, 28, topSafe - 8, W - 56, botSafe - topSafe + 24, 16, 0.55);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        const cur = Math.min(ev.length, Math.floor(sec / UNIT));
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 时间轴主线
        const lineP = easeOutCubic(win(sec, 0.1, 1.2));
        if (lineP > 0) {
          ctx.save();
          ctx.strokeStyle = '#c0b8e0'; ctx.lineWidth = 3; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(44, lineY); ctx.lineTo(44 + (W - 88) * lineP, lineY); ctx.stroke();
          ctx.restore();
        }

        // 事件节点
        for (let i = 0; i < ev.length; i++) {
          const e = ev[i];
          const t0 = i * UNIT;
          const popP = easeOutBack(win(sec, t0, t0 + 0.6));
          if (popP <= 0) continue;
          const sc = Math.max(0, popP);
          const x = nodeX(i);
          ctx.save();
          ctx.globalAlpha = sc;
          ctx.translate(x, lineY); ctx.scale(sc, sc);
          ctx.shadowColor = 'rgba(124,99,224,0.35)'; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.arc(0, 0, nodeR, 0, Math.PI * 2);
          ctx.fillStyle = e.clr; ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke();
          ctx.restore();
          // 年份（上方）
          ctx.save(); ctx.globalAlpha = sc;
          ctx.fillStyle = e.clr; ctx.font = 'bold 14px sans-serif';
          ctx.fillText(e.year, x, lineY - nodeR - 18);
          ctx.restore();
          // 名称+描述（下方）
          const descP = easeOutCubic(win(sec, t0 + 0.3, t0 + 0.9));
          if (descP > 0) {
            ctx.save(); ctx.globalAlpha = descP;
            ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 13px sans-serif';
            ctx.fillText(e.name, x, lineY + nodeR + 22);
            ctx.fillStyle = '#5e5a8a'; ctx.font = '12px sans-serif';
            wrapText(ctx, e.desc, x, lineY + nodeR + 42, segW - 16, 15);
            ctx.restore();
          }
        }

        const footP = win(sec, TOTAL - T_HOLD - 0.2, TOTAL - 0.1);
        if (footP > 0) {
          ctx.save(); ctx.globalAlpha = footP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('早期乐观高估了速度，为后来的AI冬天埋下伏笔', W / 2, botSafe - 6);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批17-4: AI跨学科（id 251）=====
  registerCanvas('ai-interdisciplinary', {
    title: TEMPLATE_TITLES['ai-interdisciplinary'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const fields = [
        { name: '计算机科学', clr: GLASS_COLORS[0] },
        { name: '数学', clr: GLASS_COLORS[1] },
        { name: '神经科学', clr: GLASS_COLORS[2] },
        { name: '语言学', clr: GLASS_COLORS[3] },
        { name: '哲学', clr: GLASS_COLORS[4] },
      ];
      const topSafe = 82, botSafe = H - 62;
      const cx = W / 2, cy = (topSafe + botSafe) / 2;
      const R = Math.min(70, (botSafe - topSafe) * 0.34);
      const centerR = 22;
      const labelW = 84, labelH = 28;

      const UNIT = 1.0, T_HOLD = 1.0;
      const TOTAL = 0.8 + fields.length * UNIT + T_HOLD;
      const stageNames = ['AI 作为交叉学科中心', ...fields.map(f => `支撑学科：${f.name}`)];
      stageNames.push('AI跨学科：计算机/数学/神经科学/语言学/哲学');
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        const cur = sec < 0.8 ? 0 : Math.min(fields.length, Math.floor((sec - 0.8) / UNIT) + 1);
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 中心 AI 节点
        const centerP = easeOutBack(win(sec, 0, 0.7));
        if (centerP > 0) {
          const sc = Math.max(0, centerP);
          ctx.save();
          ctx.globalAlpha = sc;
          ctx.translate(cx, cy); ctx.scale(sc, sc);
          ctx.shadowColor = 'rgba(124,99,224,0.4)'; ctx.shadowBlur = 12;
          const cg = ctx.createLinearGradient(0, -centerR, 0, centerR);
          cg.addColorStop(0, GLASS_COLORS[1]); cg.addColorStop(1, GLASS_COLORS[4]);
          ctx.fillStyle = cg;
          ctx.beginPath(); ctx.arc(0, 0, centerR, 0, Math.PI * 2); ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = '#fff'; ctx.font = 'bold 15px sans-serif';
          ctx.fillText('AI', 0, 0);
          ctx.restore();
        }

        // 各学科
        for (let i = 0; i < fields.length; i++) {
          const f = fields[i];
          const ang = -Math.PI / 2 + i * (Math.PI * 2 / fields.length);
          const nx = cx + R * Math.cos(ang), ny = cy + R * Math.sin(ang);
          const t0 = 0.8 + i * UNIT;
          const popP = easeOutBack(win(sec, t0, t0 + 0.5));
          if (popP <= 0) continue;
          const sc = Math.max(0, popP);
          // 连线
          const lineP = easeOutCubic(win(sec, t0 - 0.1, t0 + 0.3));
          if (lineP > 0) {
            ctx.save(); ctx.globalAlpha = lineP;
            ctx.strokeStyle = f.clr; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + (nx - cx) * lineP, cy + (ny - cy) * lineP); ctx.stroke();
            ctx.restore();
          }
          ctx.save();
          ctx.globalAlpha = sc;
          ctx.translate(nx, ny); ctx.scale(0.9 + 0.1 * sc, 0.9 + 0.1 * sc);
          ctx.translate(-nx, -ny);
          glassPanel(ctx, nx - labelW / 2, ny - labelH / 2, labelW, labelH, 10, 0.65);
          const g = ctx.createLinearGradient(nx - labelW / 2, ny, nx + labelW / 2, ny);
          g.addColorStop(0, f.clr); g.addColorStop(1, GLASS_COLORS[(i + 1) % GLASS_COLORS.length]);
          ctx.fillStyle = g; roundRect(ctx, nx - labelW / 2, ny - labelH / 2, labelW, 4, 2); ctx.fill();
          ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText(f.name, nx, ny + 2);
          ctx.restore();
        }

        const footP = win(sec, TOTAL - T_HOLD - 0.2, TOTAL - 0.1);
        if (footP > 0) {
          ctx.save(); ctx.globalAlpha = footP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('多学科交叉融合：AI在学科边界上生长', W / 2, botSafe - 6);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批17-7: 图灵测试意义与局限（id 254）=====
  registerCanvas('turing-test-limits', {
    title: TEMPLATE_TITLES['turing-test-limits'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const cols = [
        { name: '现代实例', pts: ['智能客服多轮对话', '大模型难辨人机', '游戏AI通过聊天测试'], clr: GLASS_COLORS[0] },
        { name: '局限争议', pts: ['行为像≠真理解', '可靠套路欺骗评委', '无法衡量意识情感'], clr: GLASS_COLORS[2] },
      ];
      const topSafe = 82, botSafe = H - 62;
      const gapX = 18;
      const colW = Math.max(150, (W - 88 - gapX) / 2);
      const colX = [44, W - 44 - colW];
      const headH = 34;
      const availH = Math.max(150, botSafe - topSafe);
      const bodyH = Math.min(availH - headH - 18, 170);
      const colY = topSafe + Math.max(0, (availH - (headH + bodyH)) / 2);
      const itemH = bodyH / 3;

      const UNIT = 0.95, T_HOLD = 1.0;
      const totalItems = cols.length * 3;
      const TOTAL = totalItems * UNIT + T_HOLD;
      const stageNames = [];
      cols.forEach(c => c.pts.forEach(pt => stageNames.push(`${c.name}：${pt}`)));
      stageNames.push('图灵测试：现代实例不断涌现，但仍有本质局限');
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        const cur = Math.min(totalItems, Math.floor(sec / UNIT));
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        let idx = 0;
        for (let ci = 0; ci < cols.length; ci++) {
          const c = cols[ci];
          const x = colX[ci];
          const headP = easeOutBack(win(sec, ci * 3 * UNIT, ci * 3 * UNIT + 0.5));
          if (headP > 0) {
            const sc = Math.max(0, headP);
            ctx.save(); ctx.globalAlpha = sc;
            ctx.translate(x + colW / 2, colY + headH / 2); ctx.scale(0.9 + 0.1 * sc, 0.9 + 0.1 * sc);
            ctx.translate(-(x + colW / 2), -(colY + headH / 2));
            const g = ctx.createLinearGradient(x, colY, x + colW, colY);
            g.addColorStop(0, c.clr); g.addColorStop(1, GLASS_COLORS[(ci + 2) % GLASS_COLORS.length]);
            ctx.fillStyle = g; roundRect(ctx, x, colY, colW, headH, 10); ctx.fill();
            ctx.fillStyle = '#0b132b'; ctx.font = 'bold 14px sans-serif';
            ctx.fillText(c.name, x + colW / 2, colY + headH / 2 + 1);
            ctx.restore();
          }
          for (let j = 0; j < c.pts.length; j++) {
            const iy = colY + headH + 12 + j * itemH;
            const t0 = idx * UNIT;
            const popP = easeOutCubic(win(sec, t0, t0 + 0.5));
            idx++;
            if (popP <= 0) continue;
            ctx.save(); ctx.globalAlpha = popP;
            glassPanel(ctx, x, iy, colW, itemH - 6, 8, 0.55);
            ctx.fillStyle = c.clr; ctx.font = 'bold 13px sans-serif';
            ctx.fillText('•', x + 16, iy + (itemH - 6) / 2 + 1);
            ctx.fillStyle = '#312a5c'; ctx.font = '12px sans-serif';
            wrapText(ctx, c.pts[j], x + colW / 2 + 6, iy + (itemH - 6) / 2 + 1, colW - 36, 14);
            ctx.restore();
          }
        }

        const footP = win(sec, TOTAL - T_HOLD - 0.2, TOTAL - 0.1);
        if (footP > 0) {
          ctx.save(); ctx.globalAlpha = footP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('意义：开启可操作的智能判定；局限：行为不等于理解', W / 2, botSafe - 6);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批17-8: 中文屋（id 255）=====
  registerCanvas('chinese-room', {
    title: TEMPLATE_TITLES['chinese-room'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const steps = [
        { t: '中文问题', d: '从门缝塞入', clr: GLASS_COLORS[0] },
        { t: '屋内人+规则书', d: '不懂中文，只按规则搬符号', clr: GLASS_COLORS[1] },
        { t: '中文回答', d: '对答如流', clr: GLASS_COLORS[3] },
      ];
      const topSafe = 82, botSafe = H - 62;
      const nodeR = 20;
      const cy = (topSafe + botSafe) / 2 - 6;
      const segW = (W - 88) / 3;
      const nodeX = (i) => 44 + (i + 0.5) * segW;

      const UNIT = 1.9, T_HOLD = 1.0;
      const TOTAL = steps.length * UNIT + T_HOLD;
      const stageNames = steps.map(s => `${s.t}：${s.d}`);
      stageNames.push('中文屋：塞尔论证强AI不可能——句法≠语义');
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        // 内容容器玻璃面板
        glassPanel(ctx, 28, topSafe - 8, W - 56, botSafe - topSafe + 24, 16, 0.55);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        const cur = Math.min(steps.length, Math.floor(sec / UNIT));
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 房间框（虚线，包裹中间节点）
        const roomP = easeOutCubic(win(sec, 0.2, 1.0));
        if (roomP > 0) {
          ctx.save(); ctx.globalAlpha = roomP * 0.8;
          ctx.strokeStyle = GLASS_COLORS[4]; ctx.lineWidth = 2;
          ctx.setLineDash([6, 5]);
          const rx = nodeX(1) - 70, ry = cy - 44, rw = 140, rh = 88;
          ctx.strokeRect(rx, ry, rw, rh);
          ctx.setLineDash([]);
          ctx.fillStyle = GLASS_COLORS[4]; ctx.font = '11px sans-serif';
          ctx.fillText('中文屋', rx + 26, ry - 12);
          ctx.restore();
        }

        // 节点与箭头
        for (let i = 0; i < steps.length; i++) {
          const s = steps[i];
          const t0 = i * UNIT;
          const popP = easeOutBack(win(sec, t0, t0 + 0.55));
          if (popP <= 0) continue;
          const sc = Math.max(0, popP);
          const x = nodeX(i);
          ctx.save();
          ctx.globalAlpha = sc;
          ctx.translate(x, cy); ctx.scale(sc, sc);
          ctx.shadowColor = 'rgba(124,99,224,0.3)'; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.arc(0, 0, nodeR, 0, Math.PI * 2);
          ctx.fillStyle = s.clr; ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke();
          ctx.restore();
          // 箭头
          if (i < steps.length - 1) {
            const ap = easeOutCubic(win(sec, t0 + 0.3, t0 + 0.7));
            if (ap > 0) {
              ctx.save(); ctx.globalAlpha = ap;
              ctx.fillStyle = GLASS_COLORS[4]; ctx.font = 'bold 18px sans-serif';
              ctx.fillText('→', x + segW / 2, cy + 6);
              ctx.restore();
            }
          }
          // 标签
          const txtP = easeOutCubic(win(sec, t0 + 0.2, t0 + 0.7));
          if (txtP > 0) {
            ctx.save(); ctx.globalAlpha = txtP;
            ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 13px sans-serif';
            ctx.fillText(s.t, x, cy + nodeR + 22);
            ctx.fillStyle = '#5e5a8a'; ctx.font = '12px sans-serif';
            wrapText(ctx, s.d, x, cy + nodeR + 42, segW - 16, 15);
            ctx.restore();
          }
        }

        const footP = win(sec, TOTAL - T_HOLD - 0.2, TOTAL - 0.1);
        if (footP > 0) {
          ctx.save(); ctx.globalAlpha = footP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 11px sans-serif';
          wrapText(ctx, '能通过中文问答 ≠ 理解中文：符号操作（句法）不产生真正理解（语义）', W / 2, botSafe - 10, W - 96, 14);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批17-10: 智能体Agent（id 257）=====
  registerCanvas('agent-concept', {
    title: TEMPLATE_TITLES['agent-concept'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const nodes = [
        { name: '感知', clr: GLASS_COLORS[0] },
        { name: '决策', clr: GLASS_COLORS[2] },
        { name: '行动', clr: GLASS_COLORS[1] },
      ];
      const topSafe = 82, botSafe = H - 62;
      const cx = W / 2, cy = (topSafe + botSafe) / 2;
      const R = Math.min(64, (botSafe - topSafe) * 0.32);
      const nodeR = 22;
      const centerR = 26;

      const UNIT = 1.7, T_HOLD = 1.0;
      const TOTAL = 0.7 + nodes.length * UNIT + T_HOLD;
      const stageNames = ['Agent 与环境交互的闭环', ...nodes.map(n => `环节：${n.name}`)];
      stageNames.push('智能体：感知-决策-行动，在环境中自主完成任务');
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        const cur = sec < 0.7 ? 0 : Math.min(nodes.length, Math.floor((sec - 0.7) / UNIT) + 1);
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 中心 环境
        const centerP = easeOutBack(win(sec, 0, 0.6));
        if (centerP > 0) {
          const sc = Math.max(0, centerP);
          ctx.save();
          ctx.globalAlpha = sc;
          ctx.translate(cx, cy); ctx.scale(sc, sc);
          glassPanel(ctx, -centerR, -centerR, centerR * 2, centerR * 2, centerR, 0.7);
          ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText('环境', 0, 1);
          ctx.restore();
        }

        // 循环连线（三角）
        const ringP = easeOutCubic(win(sec, 0.2, 1.0));
        if (ringP > 0) {
          ctx.save(); ctx.globalAlpha = ringP * 0.5;
          ctx.strokeStyle = GLASS_COLORS[4]; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
          ctx.beginPath();
          for (let i = 0; i < nodes.length; i++) {
            const ang = -Math.PI / 2 + i * (Math.PI * 2 / nodes.length);
            const x = cx + R * Math.cos(ang), y = cy + R * Math.sin(ang);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.closePath(); ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }

        // 三个环节节点
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const ang = -Math.PI / 2 + i * (Math.PI * 2 / nodes.length);
          const nx = cx + R * Math.cos(ang), ny = cy + R * Math.sin(ang);
          const t0 = 0.7 + i * UNIT;
          const popP = easeOutBack(win(sec, t0, t0 + 0.55));
          if (popP <= 0) continue;
          const sc = Math.max(0, popP);
          ctx.save();
          ctx.globalAlpha = sc;
          ctx.translate(nx, ny); ctx.scale(sc, sc);
          ctx.shadowColor = 'rgba(124,99,224,0.35)'; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.arc(0, 0, nodeR, 0, Math.PI * 2);
          ctx.fillStyle = n.clr; ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke();
          ctx.fillStyle = '#0b132b'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(n.name, 0, 1);
          ctx.restore();
          // 箭头指向下一环节
          const ap = easeOutCubic(win(sec, t0 + 0.3, t0 + 0.8));
          if (ap > 0) {
            const nang = -Math.PI / 2 + (i + 0.5) * (Math.PI * 2 / nodes.length);
            const mx = cx + R * Math.cos(nang);
            const my = cy + R * Math.sin(nang);
            ctx.save(); ctx.globalAlpha = ap;
            ctx.fillStyle = GLASS_COLORS[4]; ctx.font = 'bold 16px sans-serif';
            ctx.fillText('↻', mx, my + 5);
            ctx.restore();
          }
        }

        const footP = win(sec, TOTAL - T_HOLD - 0.2, TOTAL - 0.1);
        if (footP > 0) {
          ctx.save(); ctx.globalAlpha = footP;
          ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('Agent = 感知环境→自主决策→采取行动', W / 2, botSafe - 6);
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus(stageNames[stageNames.length - 1], 'ok');
    },
  });

  // ===== 批18：三大流派/六大分支/三次浪潮（id 258-266）=====
  // 通用N列卡片工厂（蓝紫毛玻璃丝滑版）
  function gridN(cols, key, items, finalStatus) {
    return {
      title: TEMPLATE_TITLES[key],
      mount: makeCanvasHD,
      async play(values, api) {
        const ok = await glassGridPlay(api, cols, items, { cardH: 96 });
        if (ok === false) return;
        api.setStatus(finalStatus, 'ok');
      },
    };
  }

  registerCanvas('symbolism', pipeline('symbolism', [
    { name: '符号表示', desc: '知识编码为符号' },
    { name: '逻辑规则', desc: '按形式逻辑运算' },
    { name: '推理结论', desc: '演绎得到答案' },
  ], '符号主义：认知=符号操作，代表为专家系统'));

  registerCanvas('behaviorism', pipeline('behaviorism', [
    { name: '感知刺激', desc: '传感器接收环境' },
    { name: '规则反应', desc: '刺激-响应直接映射' },
    { name: '环境反馈', desc: '行为影响环境并进化' },
  ], '行为主义：不要推理，靠"感知-行动"仿生（如机器人）'));

  registerCanvas('ai-branches-1', gridN(3, 'ai-branches-1', [
    { name: '计算机视觉', desc: '让机器看懂图像视频', clr: '#8ec5e0' },
    { name: '自然语言处理', desc: '理解和生成语言', clr: '#7aa7f0' },
    { name: '认知与推理', desc: '知识表示与逻辑决策', clr: '#f0a8d8' },
  ], '六大分支（上）：视觉/语言/推理三大能力'));

  registerCanvas('ai-branches-2', gridN(3, 'ai-branches-2', [
    { name: '机器人学', desc: '感知决策执行一体', clr: '#a586e8' },
    { name: '博弈与伦理', desc: '博弈决策+安全伦理', clr: '#a586e8' },
    { name: '机器学习', desc: '从数据中学习规律', clr: '#f0a8d8' },
  ], '六大分支（下）：行动、博弈、学习三大方向'));

  // 连接主义：三层网络节点
  registerCanvas('connectionism', {
    title: TEMPLATE_TITLES['connectionism'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const layers = [
        { name: '输入层', n: 3, color: GLASS_COLORS[0] },
        { name: '隐藏层', n: 4, color: GLASS_COLORS[1] },
        { name: '输出层', n: 2, color: GLASS_COLORS[2] },
      ];
      const R = 16;

      // 安全区：顶≥82，底≤H-62，左右[44,W-44]
      const topSafe = 82, botSafe = H - 62;
      const labelY = topSafe + 16;
      const nodeTop = labelY + 28, nodeBot = botSafe;
      const midY = (nodeTop + nodeBot) / 2;
      const cols = [0.18, 0.5, 0.82];
      const nodePos = layers.map((L, li) => {
        const x = cols[li] * W, n = L.n;
        const spread = Math.min(0.2 * H, (nodeBot - nodeTop) * 0.3);
        return Array.from({ length: n }, (_, i) => ({ x, y: midY + (i - (n - 1) / 2) * spread }));
      });

      // 时间轴（秒）
      const T_IN = 1.2, T_H = 1.5, T_O = 1.3, T_FLOW = 2.2, T_FINAL = 0.6;
      const TOTAL = T_IN + T_H + T_O + T_FLOW + T_FINAL;

      const stageNames = [
        '连接主义：用仿生神经元互联表示知识',
        '输入层接收外部信号',
        '隐藏层组合特征：加权求和后激活',
        '输出层给出最终结果',
        '信号在连接权重间流动，知识存储于权重',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段判定
        let cur = 0;
        if (sec > 0.1) cur = 1;
        if (sec > T_IN) cur = 2;
        if (sec > T_IN + T_H) cur = 3;
        if (sec > T_IN + T_H + T_O) cur = 4;
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 连线：输入→隐藏，隐藏→输出（逐层生长 + 流动信号）
        for (let li = 0; li < 2; li++) {
          const a = nodePos[li], b = nodePos[li + 1];
          const layerDone = li === 0 ? (sec > T_IN + T_H) : (sec > T_IN + T_H + T_O);
          for (let fi = 0; fi < a.length; fi++) {
            for (let ti = 0; ti < b.length; ti++) {
              let alpha = 0.18, width = 1.6;
              const from = a[fi], to = b[ti];
              const lineStart = li === 0
                ? (T_IN + fi * 0.12 + ti * 0.06)
                : (T_IN + T_H + fi * 0.12 + ti * 0.08);
              const growP = easeOutCubic(win(sec, lineStart, lineStart + 0.5));
              if (layerDone) { alpha = 0.55; width = 1.8; }
              const ex = from.x + (to.x - from.x) * growP;
              const ey = from.y + (to.y - from.y) * growP;
              ctx.strokeStyle = li === 0 ? `rgba(122,167,240,${alpha})` : `rgba(165,134,232,${alpha})`;
              ctx.lineWidth = width;
              ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(ex, ey); ctx.stroke();
              // 流动信号点
              if (layerDone) {
                const offset = fi * 0.15 + ti * 0.1 + li * 0.2;
                const flowP = ((sec - T_IN - T_H - T_O + offset) % 1.2) / 1.2;
                const fx = from.x + (to.x - from.x) * flowP;
                const fy = from.y + (to.y - from.y) * flowP;
                ctx.fillStyle = li === 0 ? '#7aa7f0' : '#a586e8';
                ctx.beginPath(); ctx.arc(fx, fy, 3.5, 0, Math.PI * 2); ctx.fill();
              }
            }
          }
        }

        // 节点（弹入）
        nodePos.forEach((layer, li) => {
          const L = layers[li];
          layer.forEach((pt, ni) => {
            let popP = 0;
            if (li === 0) popP = easeOutBack(win(sec, ni * 0.18, 0.45 + ni * 0.18));
            else if (li === 1) { const t0 = T_IN + ni * 0.18; popP = easeOutBack(win(sec, t0, t0 + 0.5)); }
            else { const t0 = T_IN + T_H + ni * 0.18; popP = easeOutBack(win(sec, t0, t0 + 0.5)); }
            if (popP <= 0) return;
            const s = Math.max(0, popP);
            ctx.save();
            ctx.translate(pt.x, pt.y); ctx.scale(s, s);
            ctx.shadowColor = 'rgba(124,99,224,0.35)'; ctx.shadowBlur = 8;
            ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = L.color;
            ctx.lineWidth = 2.4; ctx.fill(); ctx.stroke();
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.beginPath(); ctx.arc(-3, -3, R * 0.28, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = L.color;
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText(String(ni + 1), 0, 0);
            ctx.restore();
          });
        });

        // 层标签（毛玻璃小条）
        layers.forEach((L, li) => {
          const tShow = li === 0 ? 0.1 : li === 1 ? T_IN : T_IN + T_H;
          if (sec < tShow) return;
          const ap = easeOutCubic(win(sec, tShow, tShow + 0.4));
          const lw = 72, lh = 26;
          const lx = cols[li] * W - lw / 2, ly = labelY - lh / 2;
          ctx.globalAlpha = ap;
          glassPanel(ctx, lx, ly, lw, lh, 10, 0.6);
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(L.name, cols[li] * W, labelY);
        });
      });
      if (!ok) return;
      setStatus('连接主义：神经元+连接权重，深度学习的思想源头', 'ok');
    },
  });

  // 通用时间轴工厂（蓝紫毛玻璃丝滑版）
  function timeline(key, ev, finalStatus) {
    return {
      title: TEMPLATE_TITLES[key],
      mount: makeCanvasHD,
      async play(values, api) {
        const { ctx, setStatus } = api;
        const W = ctx._cssW, H = ctx._cssH;
        const n = ev.length;
        const x0 = 56, x1 = W - 56;
        const midY = Math.max(104, (72 + (H - 50)) / 2 - 14);
        const pos = ev.map((_, i) => n === 1 ? (x0 + x1) / 2 : x0 + (x1 - x0) * i / (n - 1));
        const UNIT = 0.6, total = n * UNIT + 0.4;
        let last = -1;
        const ok = await tweenPlay(api, total * 1000, pr => {
          const sec = pr * total;
          paintGlassBg(ctx, W, H);
          ctx.textAlign = 'center';
          // 主轴随事件生长
          const lp = easeOutCubic(clamp01(sec / (n * UNIT)));
          if (lp > 0) {
            const lg = ctx.createLinearGradient(x0, 0, x1, 0);
            lg.addColorStop(0, '#7aa7f0'); lg.addColorStop(1, '#a586e8');
            ctx.strokeStyle = lg; ctx.lineWidth = 3; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x0, midY); ctx.lineTo(x0 + (x1 - x0) * lp, midY); ctx.stroke();
          }
          for (let i = 0; i < n; i++) {
            const e = ev[i], x = pos[i];
            const dotP = easeOutBack(clamp01((sec - i * UNIT) / 0.45));
            if (dotP <= 0) continue;
            const clr = GLASS_COLORS[i % GLASS_COLORS.length];
            // 年份（轴上方）
            const ap = clamp01((sec - i * UNIT) / 0.5);
            ctx.save(); ctx.globalAlpha = ap;
            ctx.fillStyle = clr; ctx.font = 'bold 14px sans-serif';
            ctx.fillText(e.year, x, midY - 26);
            // 圆点弹性入场
            const r = 7 * Math.max(0, dotP);
            ctx.shadowColor = 'rgba(124,99,224,0.45)'; ctx.shadowBlur = 10;
            ctx.fillStyle = clr;
            ctx.beginPath(); ctx.arc(x, midY, r, 0, Math.PI * 2); ctx.fill();
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.beginPath(); ctx.arc(x - 2, midY - 2, Math.max(0, r * 0.32), 0, Math.PI * 2); ctx.fill();
            // 轴下方毛玻璃小卡
            const chipW = Math.min(150, (x1 - x0) / Math.max(n, 1) - 16), chipH = 52;
            glassPanel(ctx, x - chipW / 2, midY + 18, chipW, chipH, 10, 0.6);
            ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 11px sans-serif';
            wrapText(ctx, e.name, x, midY + 36, chipW - 14, 13);
            ctx.fillStyle = '#5e5a8a'; ctx.font = '10px sans-serif';
            wrapText(ctx, e.desc, x, midY + 56, chipW - 14, 12);
            ctx.restore();
            if (Math.floor(sec / UNIT) === i && last !== i) {
              last = i;
              setStatus(`${e.year} ${e.name}：${e.desc}`);
            }
          }
        });
        if (ok === false) return;
        setStatus(finalStatus, 'ok');
      },
    };
  }

  registerCanvas('wave-1', timeline('wave-1', [
    { year: '1956', name: '达特茅斯会议', desc: 'AI正式诞生', clr: '#8ec5e0' },
    { year: '1957', name: '感知机', desc: 'Rosenblatt神经网络', clr: '#7aa7f0' },
    { year: '1960s', name: '定理证明/跳棋', desc: '早期成功引发乐观', clr: '#f0a8d8' },
  ], '第一次浪潮：政府巨资投入，乐观情绪高涨'));

  registerCanvas('wave-3', timeline('wave-3', [
    { year: '2006', name: '深度学习', desc: 'Hinton提出深度信念网', clr: '#8ec5e0' },
    { year: '2012', name: 'ImageNet突破', desc: 'CNN大幅降低错误率', clr: '#7aa7f0' },
    { year: '2016', name: 'AlphaGo', desc: '围棋战胜人类冠军', clr: '#f0a8d8' },
    { year: '2020s', name: '大模型', desc: '生成式AI全面爆发', clr: '#a586e8' },
  ], '第三次复兴：大数据+大算力+深度学习驱动'));

  // 第二次浪潮：专家系统
  registerCanvas('wave-2', {
    title: TEMPLATE_TITLES['wave-2'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const cores = [
        { name: '知识库', desc: '专家经验规则化存储', color: GLASS_COLORS[3] },
        { name: '推理机', desc: '调用规则推出结论', color: GLASS_COLORS[2] },
      ];
      const apps = ['医疗诊断 MYCIN', '矿物勘探 XCON', '企业知识工程'];

      // 安全区：顶≥82，底≤H-62，左右[44,W-44]
      const topSafe = 82, botSafe = H - 62;
      const panelW = Math.min(220, (W - 88) / 2 - 20);
      const panelH = Math.max(40, 58);
      const panelY = topSafe + 4;
      const panelX = [50, W - 50 - panelW];
      const appsTop = panelY + panelH + 22;
      const appH = Math.max(28, 32);
      const appGap = 8;
      const appW = W - 100;
      const appX = 50;

      // 时间轴（秒）
      const T_CORE = 1.8, T_APP = 1.5, T_FINAL = 0.6;
      const TOTAL = T_CORE + apps.length * T_APP + T_FINAL;

      const stageNames = [
        '第二次浪潮：专家系统走向商用',
        '知识库：专家经验规则化存储',
        '推理机：调用规则推出结论',
        ...apps.map(a => `典型应用：${a}`),
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段判定
        let cur = 0;
        if (sec > 0.2) cur = 1;
        if (sec > T_CORE * 0.5) cur = 2;
        for (let i = 0; i < apps.length; i++) {
          if (sec > T_CORE + i * T_APP) cur = 3 + i;
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 双核心面板（弹入）
        cores.forEach((c, i) => {
          const t0 = i * 0.5;
          const popP = easeOutBack(win(sec, t0, t0 + 0.55));
          if (popP <= 0) return;
          const s = Math.max(0.4, popP);
          const x = panelX[i], y = panelY;
          ctx.save();
          ctx.globalAlpha = clamp01(popP * 1.5);
          ctx.translate(x + panelW / 2, y + panelH / 2);
          ctx.scale(s, s);
          ctx.translate(-(x + panelW / 2), -(y + panelH / 2));
          glassPanel(ctx, x, y, panelW, panelH, 12, 0.62);
          // 顶部色条
          const g = ctx.createLinearGradient(x, y, x + panelW, y);
          g.addColorStop(0, c.color); g.addColorStop(1, GLASS_COLORS[(i + 1) % GLASS_COLORS.length]);
          ctx.fillStyle = g;
          roundRect(ctx, x, y, panelW, 5, 3); ctx.fill();
          ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 15px sans-serif';
          ctx.fillText(c.name, x + panelW / 2, y + 30);
          ctx.fillStyle = '#5e5a8a'; ctx.font = '12px sans-serif';
          wrapText(ctx, c.desc, x + panelW / 2, y + 48, panelW - 20, 14);
          ctx.restore();
        });

        // 双向箭头（双核心都出现后）
        if (sec > 0.6) {
          const ap = easeOutCubic(win(sec, 0.6, 1.0));
          ctx.save();
          ctx.globalAlpha = ap;
          ctx.fillStyle = '#7aa7f0'; ctx.font = 'bold 20px sans-serif';
          ctx.fillText('⇄', W / 2, panelY + panelH / 2 + 4);
          ctx.restore();
        }

        // 应用条目（逐条弹入）
        apps.forEach((a, i) => {
          const t0 = T_CORE + i * T_APP;
          const popP = easeOutBack(win(sec, t0, t0 + 0.5));
          if (popP <= 0) return;
          const y = appsTop + i * (appH + appGap);
          ctx.save();
          ctx.globalAlpha = clamp01(popP * 1.5);
          glassPanel(ctx, appX, y, appW, appH, 10, 0.55);
          // 左侧色点
          ctx.fillStyle = GLASS_COLORS[i % GLASS_COLORS.length];
          ctx.beginPath(); ctx.arc(appX + 18, y + appH / 2, 5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#3a2a7a'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(a, W / 2, y + appH / 2);
          ctx.restore();
        });
      });
      if (!ok) return;
      setStatus('第二次浪潮：专家系统让AI走出实验室', 'ok');
    },
  });

  // 两次AI冬天
  registerCanvas('ai-winter', {
    title: TEMPLATE_TITLES['ai-winter'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const winters = [
        { year: '1974-1980', name: '第一次冬天', cause: '机器翻译失败、算力不足、期望落空', color: GLASS_COLORS[4] },
        { year: '1987-1993', name: '第二次冬天', cause: '专家系统局限、维护昂贵、桌面机崛起', color: GLASS_COLORS[0] },
      ];

      // 安全区：顶≥82，底≤H-62，左右[44,W-44]
      const topSafe = 82, botSafe = H - 62;
      const panelY = topSafe + 4;
      const panelH = Math.max(80, botSafe - panelY - 10);
      const gap = 24;
      const panelW = Math.max(80, (W - 100 - gap) / 2);
      const panelX = [50, 50 + panelW + gap];

      // 时间轴（秒）
      const T_W = 3.0, T_FINAL = 0.8;
      const TOTAL = winters.length * T_W + T_FINAL;

      const stageNames = [
        '两次"AI冬天"：热潮退去',
        ...winters.map(w => `${w.name}（${w.year}）：${w.cause}`),
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段判定
        let cur = 0;
        if (sec > 0.2) cur = 1;
        if (sec > T_W) cur = 2;
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        winters.forEach((w, i) => {
          const t0 = i * T_W;
          const popP = easeOutBack(win(sec, t0, t0 + 0.7));
          if (popP <= 0) return;
          const s = Math.max(0.4, popP);
          const x = panelX[i], y = panelY;
          ctx.save();
          ctx.globalAlpha = clamp01(popP * 1.5);
          ctx.translate(x + panelW / 2, y + panelH / 2);
          ctx.scale(s, s);
          ctx.translate(-(x + panelW / 2), -(y + panelH / 2));
          glassPanel(ctx, x, y, panelW, panelH, 14, 0.6);
          // 顶部色条
          const g = ctx.createLinearGradient(x, y, x + panelW, y);
          g.addColorStop(0, w.color); g.addColorStop(1, GLASS_COLORS[(i + 2) % GLASS_COLORS.length]);
          ctx.fillStyle = g;
          roundRect(ctx, x, y, panelW, 6, 3); ctx.fill();
          // 年份
          ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 15px sans-serif';
          ctx.fillText(w.year, x + panelW / 2, y + 36);
          // 名称
          ctx.fillStyle = w.color; ctx.font = 'bold 13px sans-serif';
          ctx.fillText(w.name, x + panelW / 2, y + 60);
          // 分隔线
          ctx.strokeStyle = 'rgba(124,99,224,0.25)'; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(x + 24, y + 76); ctx.lineTo(x + panelW - 24, y + 76); ctx.stroke();
          // 成因
          ctx.fillStyle = '#5e5a8a'; ctx.font = '12px sans-serif';
          wrapText(ctx, w.cause, x + panelW / 2, y + 100, panelW - 32, 16);
          ctx.restore();
        });
      });
      if (!ok) return;
      setStatus('两次AI冬天：期望与现实落差引发行业退潮', 'ok');
    },
  });

  // ===== 批19：搜索/P-NP/专家系统/知识表示（id 267,272-276）=====
  registerCanvas('search-formalization', gridN(5, 'search-formalization', [
    { name: '初始状态', desc: '问题的起点', clr: '#8ec5e0' },
    { name: '操作算子', desc: '可执行的动作', clr: '#7aa7f0' },
    { name: '状态空间', desc: '所有可能状态', clr: '#a586e8' },
    { name: '目标测试', desc: '判断是否到达', clr: '#f0a8d8' },
    { name: '路径代价', desc: '动作的成本', clr: '#a586e8' },
  ], '五要素定义清楚：搜索就是在状态空间找路径'));

  registerCanvas('expert-system', {
    title: TEMPLATE_TITLES['expert-system'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus, isCancelled } = api;
      const W = ctx._cssW, H = ctx._cssH;
      const stages = [
        { name: '人机接口', desc: '用户提问与回答' },
        { name: '推理机', desc: '调度规则推理' },
        { name: '知识库', desc: '领域专家规则' },
        { name: '工作内存', desc: '当前事实记录' },
        { name: '解释器', desc: '说明推理过程' },
      ];
      const n = stages.length;
      const cw = W / n;
      const cardW = cw - 26, cardH = 104;
      // 安全区：顶部 70（HTML 标签+状态条）、底部 48（控制条）；卡片垂直居中
      const AREA_TOP = 70, AREA_BOTTOM = H - 48;
      const cy = Math.max(72, AREA_TOP + ((AREA_BOTTOM - AREA_TOP) - cardH) / 2);
      const UNIT = 460;           // 每张卡错峰入场时长
      const TOTAL = n * UNIT + 300;
      let lastStatus = -1;
      const ok = await tweenPlay(api, TOTAL, p => {
        const sec = p * n;
        paintGlassBg(ctx, W, H);
        // 卡片（错峰：淡入 + 上滑 + 轻微放大）
        for (let i = 0; i < n; i++) {
          const local = easeOutCubic(clamp01(sec - i));
          if (local <= 0) continue;
          const s = stages[i];
          const x = i * cw + (cw - cardW) / 2;
          const y = cy + (1 - local) * 22;
          const scale = 0.9 + 0.1 * local;
          const cx = x + cardW / 2;
          ctx.save();
          ctx.globalAlpha = local;
          ctx.translate(cx, y + cardH / 2);
          ctx.scale(scale, scale);
          ctx.translate(-cx, -(y + cardH / 2));
          glassPanel(ctx, x, y, cardW, cardH, 12, 0.62);
          // 顶部渐变色条
          const cg = ctx.createLinearGradient(x, 0, x + cardW, 0);
          cg.addColorStop(0, GLASS_COLORS[i % GLASS_COLORS.length]);
          cg.addColorStop(1, GLASS_COLORS[(i + 1) % GLASS_COLORS.length]);
          ctx.fillStyle = cg;
          roundRect(ctx, x, y, cardW, 5, 3); ctx.fill();
          ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 15px sans-serif';
          ctx.fillText(s.name, cx, y + 42);
          ctx.fillStyle = '#5e5a8a'; ctx.font = '12px sans-serif';
          wrapText(ctx, s.desc, cx, y + 72, cardW - 20, 16);
          ctx.restore();
          // 连接箭头随下一张卡淡入
          if (i < n - 1) {
            const ap = clamp01(sec - (i + 1));
            if (ap > 0) {
              ctx.save();
              ctx.globalAlpha = ap;
              ctx.fillStyle = '#7aa7f0'; ctx.font = 'bold 18px sans-serif';
              ctx.fillText('→', (i + 1) * cw, cy + cardH / 2 + 6);
              ctx.restore();
            }
          }
          if (Math.floor(sec) === i && lastStatus !== i) {
            lastStatus = i;
            setStatus(`${s.name}：${s.desc}`);
          }
        }
      });
      if (!ok) return;
      setStatus('专家系统五部件：模拟领域专家解决问题', 'ok');
    },
  });

  // P/NP/NPC 韦恩图
  registerCanvas('p-np', {
    title: TEMPLATE_TITLES['p-np'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const notes = [
        { t: 'P类：多项式时间内可解', d: '如排序、查找——"容易"', color: GLASS_COLORS[3] },
        { t: 'NP类：解可在多项式时间验证', d: 'P ⊆ NP', color: GLASS_COLORS[0] },
        { t: 'NP完全：NP中最难的问题', d: '如旅行商、SAT——一个攻破全部攻破', color: GLASS_COLORS[2] },
      ];

      // 安全区：顶≥82，底≤H-62，左右[44,W-44]
      const topSafe = 82, botSafe = H - 62;
      const midY = (topSafe + botSafe) / 2;
      // 左侧韦恩图
      const vennCx = Math.min(W * 0.3, 180);
      const npRx = Math.min(110, vennCx - 50);
      const npRy = Math.min(64, (botSafe - topSafe) / 2 - 8);
      const pRx = npRx * 0.46, pRy = npRy * 0.5;
      const pCx = vennCx - npRx * 0.28, pCy = midY + npRy * 0.2;
      const npcX = vennCx + npRx * 0.5, npcY = midY - npRy * 0.28;
      // 右侧注释
      const noteX = Math.max(vennCx + npRx + 30, W * 0.48);
      const noteW = W - 44 - noteX;
      const noteGap = 10;
      const noteH = Math.max(44, (botSafe - topSafe - noteGap * (notes.length - 1)) / notes.length);

      // 时间轴（秒）
      const T_VENN = 1.8, T_NOTE = 1.5, T_FINAL = 0.6;
      const TOTAL = T_VENN + notes.length * T_NOTE + T_FINAL;

      const stageNames = [
        'P / NP / NP完全：计算复杂度分类',
        ...notes.map(n => `${n.t}（${n.d}）`),
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段判定
        let cur = 0;
        for (let i = 0; i < notes.length; i++) {
          if (sec > T_VENN + i * T_NOTE) cur = i + 1;
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 韦恩图：NP 椭圆
        const npP = easeOutBack(win(sec, 0.0, 0.7));
        if (npP > 0) {
          const s = Math.max(0, npP);
          ctx.save();
          ctx.translate(vennCx, midY); ctx.scale(s, s); ctx.translate(-vennCx, -midY);
          ctx.fillStyle = 'rgba(122,167,240,0.25)';
          ctx.beginPath(); ctx.ellipse(vennCx, midY, npRx, npRy, 0, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = GLASS_COLORS[0]; ctx.lineWidth = 2.2; ctx.stroke();
          ctx.restore();
          // NP 标签
          const labP = clamp01((sec - 0.3) / 0.4);
          ctx.globalAlpha = labP;
          ctx.fillStyle = GLASS_COLORS[0]; ctx.font = 'bold 14px sans-serif';
          ctx.fillText('NP', vennCx + npRx * 0.35, midY - npRy - 14);
          ctx.globalAlpha = 1;
        }

        // P 椭圆（在 NP 内部）
        const pP = easeOutBack(win(sec, 0.4, 1.1));
        if (pP > 0) {
          const s = Math.max(0, pP);
          ctx.save();
          ctx.translate(pCx, pCy); ctx.scale(s, s); ctx.translate(-pCx, -pCy);
          ctx.fillStyle = 'rgba(142,197,224,0.4)';
          ctx.beginPath(); ctx.ellipse(pCx, pCy, pRx, pRy, 0, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = GLASS_COLORS[3]; ctx.lineWidth = 2; ctx.stroke();
          ctx.restore();
          const labP = clamp01((sec - 0.8) / 0.4);
          ctx.globalAlpha = labP;
          ctx.fillStyle = '#0b132b'; ctx.font = 'bold 13px sans-serif';
          ctx.fillText('P', pCx, pCy);
          ctx.globalAlpha = 1;
        }

        // NP完全 小圆点
        const npcP = easeOutBack(win(sec, 0.9, 1.6));
        if (npcP > 0) {
          const r = 8 * Math.max(0, npcP);
          ctx.fillStyle = GLASS_COLORS[2];
          ctx.beginPath(); ctx.arc(npcX, npcY, r, 0, Math.PI * 2); ctx.fill();
          const labP = clamp01((sec - 1.3) / 0.4);
          ctx.globalAlpha = labP;
          ctx.fillStyle = GLASS_COLORS[2]; ctx.font = 'bold 11px sans-serif';
          ctx.fillText('NP完全', npcX, npcY - 16);
          ctx.globalAlpha = 1;
        }

        // 右侧注释卡（逐条弹入）
        notes.forEach((n, i) => {
          const t0 = T_VENN + i * T_NOTE;
          const popP = easeOutBack(win(sec, t0, t0 + 0.5));
          if (popP <= 0) return;
          const y = topSafe + i * (noteH + noteGap);
          ctx.save();
          ctx.globalAlpha = clamp01(popP * 1.5);
          glassPanel(ctx, noteX, y, noteW, noteH, 10, 0.58);
          // 左侧色条
          ctx.fillStyle = n.color;
          roundRect(ctx, noteX, y, 5, noteH, 3); ctx.fill();
          ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(n.t, noteX + 14, y + 18);
          ctx.fillStyle = '#5e5a8a'; ctx.font = '11px sans-serif';
          wrapText(ctx, n.d, noteX + noteW / 2 + 7, y + 36, noteW - 24, 13);
          ctx.textAlign = 'center';
          ctx.restore();
        });
      });
      if (!ok) return;
      setStatus('P⊆NP；NP完全是最难的NP问题', 'ok');
    },
  });

  // 产生式规则
  registerCanvas('production-rules', {
    title: TEMPLATE_TITLES['production-rules'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const rules = [
        { cond: '体温 > 38.5℃', then: '可能发烧', color: GLASS_COLORS[3] },
        { cond: '发烧 且 咳嗽', then: '建议就医检查', color: GLASS_COLORS[2] },
        { cond: '检查结果为流感', then: '隔离并对症治疗', color: GLASS_COLORS[1] },
      ];
      const n = rules.length;

      // 安全区：顶≥82，底≤H-62，左右[44,W-44]
      const topSafe = 82, botSafe = H - 62;
      const rowGap = 12;
      const rowH = Math.max(44, (botSafe - topSafe - rowGap * (n - 1)) / n);
      const condW = Math.max(100, (W - 88 - 56) / 2);
      const condX = 44;
      const arrowX = condX + condW + 28;
      const thenX = arrowX + 28;
      const thenW = W - 44 - thenX;

      // 时间轴（秒）
      const T_RULE = 2.0, T_FINAL = 0.6;
      const TOTAL = n * T_RULE + T_FINAL;

      const stageNames = [
        '产生式规则：IF 条件 THEN 结论',
        ...rules.map((r, i) => `规则${i + 1}：IF ${r.cond} THEN ${r.then}`),
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段判定
        let cur = 0;
        for (let i = 0; i < n; i++) {
          if (sec > i * T_RULE) cur = i + 1;
        }
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        rules.forEach((r, i) => {
          const t0 = i * T_RULE;
          const popP = easeOutBack(win(sec, t0, t0 + 0.55));
          if (popP <= 0) return;
          const y = topSafe + i * (rowH + rowGap);
          const alpha = clamp01(popP * 1.5);

          // IF 盒
          ctx.save();
          ctx.globalAlpha = alpha;
          glassPanel(ctx, condX, y, condW, rowH, 10, 0.6);
          ctx.fillStyle = r.color;
          roundRect(ctx, condX, y, 5, rowH, 3); ctx.fill();
          ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 12px sans-serif';
          wrapText(ctx, 'IF ' + r.cond, condX + condW / 2, y + rowH / 2, condW - 18, 15);
          ctx.restore();

          // 箭头
          const arrP = clamp01((sec - t0 - 0.3) / 0.3);
          if (arrP > 0) {
            ctx.save();
            ctx.globalAlpha = arrP;
            ctx.fillStyle = GLASS_COLORS[4]; ctx.font = 'bold 18px sans-serif';
            ctx.fillText('→', arrowX, y + rowH / 2 + 4);
            ctx.restore();
          }

          // THEN 盒
          const thenP = clamp01((sec - t0 - 0.25) / 0.35);
          if (thenP > 0) {
            ctx.save();
            ctx.globalAlpha = thenP;
            glassPanel(ctx, thenX, y, thenW, rowH, 10, 0.6);
            const g = ctx.createLinearGradient(thenX, y, thenX + thenW, y);
            g.addColorStop(0, r.color); g.addColorStop(1, GLASS_COLORS[(i + 2) % GLASS_COLORS.length]);
            ctx.fillStyle = g;
            roundRect(ctx, thenX, y, thenW, 5, 3); ctx.fill();
            ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 12px sans-serif';
            wrapText(ctx, 'THEN ' + r.then, thenX + thenW / 2, y + rowH / 2, thenW - 18, 15);
            ctx.restore();
          }
        });
      });
      if (!ok) return;
      setStatus('产生式：IF-THEN规则，简单直观、可链式推理', 'ok');
    },
  });

  // 语义网络
  registerCanvas('semantic-network', {
    title: TEMPLATE_TITLES['semantic-network'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const nodes = [
        { lbl: '知更鸟', color: GLASS_COLORS[3] },
        { lbl: '鸟', color: GLASS_COLORS[0] },
        { lbl: '动物', color: GLASS_COLORS[2] },
        { lbl: '翅膀', color: GLASS_COLORS[1] },
      ];
      const edges = [[0, 1, '是一种'], [1, 2, '是一种'], [1, 3, '有']];
      const R = 22;

      // 安全区：顶≥82，底≤H-62，左右[44,W-44]
      const topSafe = 82, botSafe = H - 62;
      const midY = (topSafe + botSafe) / 2;
      // 布局：知更鸟(左)-鸟(中)-动物(右) 在上排，翅膀在鸟下方
      const nodePos = [
        { x: W * 0.18, y: midY - 20 },
        { x: W * 0.5, y: topSafe + 50 },
        { x: W * 0.82, y: midY - 20 },
        { x: W * 0.5, y: botSafe - 40 },
      ];

      // 时间轴（秒）
      const T_NODE = 1.2, T_INHERIT = 1.4, T_FINAL = 0.6;
      const TOTAL = nodes.length * T_NODE + T_INHERIT + T_FINAL;

      const stageNames = [
        '语义网络：节点（概念）+ 边（关系）',
        ...nodes.map(n => `概念节点：${n.lbl}`),
        '继承关系传递：知更鸟也"有翅膀"',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段判定
        let cur = 0;
        for (let i = 0; i < nodes.length; i++) {
          if (sec > i * T_NODE) cur = i + 1;
        }
        if (sec > nodes.length * T_NODE) cur = nodes.length + 1;
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 边（两端节点都出现后生长）
        edges.forEach(([a, b, rel]) => {
          const aDone = sec > a * T_NODE + 0.4;
          const bDone = sec > b * T_NODE + 0.4;
          if (!aDone || !bDone) return;
          const A = nodePos[a], B = nodePos[b];
          const growP = easeOutCubic(win(sec, Math.max(a, b) * T_NODE, Math.max(a, b) * T_NODE + 0.4));
          const ex = A.x + (B.x - A.x) * growP;
          const ey = A.y + (B.y - A.y) * growP;
          ctx.strokeStyle = 'rgba(108,99,231,0.7)'; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(ex, ey); ctx.stroke();
          // 关系标签
          if (growP > 0.5) {
            const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
            ctx.save();
            ctx.globalAlpha = clamp01((growP - 0.5) / 0.5);
            glassPanel(ctx, mx - 28, my - 12, 56, 22, 8, 0.7);
            ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 11px sans-serif';
            ctx.fillText(rel, mx, my);
            ctx.restore();
          }
        });

        // 继承虚线：知更鸟 → 翅膀（最后阶段）
        if (sec > nodes.length * T_NODE) {
          const inhP = easeOutCubic(win(sec, nodes.length * T_NODE, nodes.length * T_NODE + 0.8));
          const A = nodePos[0], B = nodePos[3];
          const ex = A.x + (B.x - A.x) * inhP;
          const ey = A.y + (B.y - A.y) * inhP;
          ctx.save();
          ctx.setLineDash([6, 5]);
          ctx.strokeStyle = GLASS_COLORS[2]; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(ex, ey); ctx.stroke();
          ctx.restore();
          if (inhP > 0.6) {
            const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
            ctx.save();
            ctx.globalAlpha = clamp01((inhP - 0.6) / 0.4);
            glassPanel(ctx, mx - 52, my - 12, 104, 22, 8, 0.7);
            ctx.fillStyle = GLASS_COLORS[2]; ctx.font = 'bold 11px sans-serif';
            ctx.fillText('继承·有翅膀', mx, my);
            ctx.restore();
          }
        }

        // 节点（逐个弹入）
        nodes.forEach((nd, i) => {
          const t0 = i * T_NODE;
          const popP = easeOutBack(win(sec, t0, t0 + 0.5));
          if (popP <= 0) return;
          const s = Math.max(0, popP);
          const pt = nodePos[i];
          ctx.save();
          ctx.translate(pt.x, pt.y); ctx.scale(s, s);
          ctx.shadowColor = 'rgba(124,99,224,0.35)'; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2);
          ctx.fillStyle = nd.color;
          ctx.lineWidth = 0; ctx.fill();
          ctx.shadowColor = 'transparent';
          // 高光
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.beginPath(); ctx.arc(-4, -4, R * 0.32, 0, Math.PI * 2); ctx.fill();
          // 标签
          ctx.fillStyle = '#0b132b'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText(nd.lbl, 0, 1);
          ctx.restore();
        });
      });
      if (!ok) return;
      setStatus('语义网络：用节点和边直观表示概念与关系', 'ok');
    },
  });

  // 知识图谱三元组
  registerCanvas('knowledge-graph', {
    title: TEMPLATE_TITLES['knowledge-graph'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW || ctx.canvas.width, H = ctx._cssH || ctx.canvas.height;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));

      const nodes = [
        { lbl: '北京', color: GLASS_COLORS[3] },
        { lbl: '中国', color: GLASS_COLORS[2] },
        { lbl: '城市', color: GLASS_COLORS[0] },
        { lbl: '华北', color: GLASS_COLORS[1] },
      ];
      const edges = [[0, 1, '首都'], [0, 2, '类型'], [0, 3, '位于']];
      const R = 20;

      // 安全区：顶≥82，底≤H-62，左右[44,W-44]
      const topSafe = 82, botSafe = H - 62;
      const midY = (topSafe + botSafe) / 2;
      // 布局：北京(主体·左枢纽)，中国/城市/华北(客体·右侧放射)
      const nodePos = [
        { x: W * 0.22, y: midY },
        { x: W * 0.62, y: topSafe + 50 },
        { x: W * 0.84, y: midY },
        { x: W * 0.62, y: botSafe - 50 },
      ];

      // 时间轴（秒）
      const T_NODE = 1.1, T_TRIPLE = 1.8, T_FINAL = 0.6;
      const TOTAL = nodes.length * T_NODE + T_TRIPLE + T_FINAL;

      const stageNames = [
        '知识图谱：〈主体, 关系, 客体〉三元组',
        ...nodes.map(n => `实体：${n.lbl}`),
        '三元组：〈北京,首都,中国〉〈北京,类型,城市〉〈北京,位于,华北〉',
      ];
      let stage = 0;

      const ok = await tweenPlay(api, TOTAL * 1000, (p) => {
        const sec = p * TOTAL;
        paintGlassBg(ctx, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 阶段判定
        let cur = 0;
        for (let i = 0; i < nodes.length; i++) {
          if (sec > i * T_NODE) cur = i + 1;
        }
        if (sec > nodes.length * T_NODE) cur = nodes.length + 1;
        if (cur !== stage) { stage = cur; setStatus(stageNames[stage]); }

        // 边（主体与客体都出现后生长）
        edges.forEach(([a, b, rel]) => {
          const aDone = sec > a * T_NODE + 0.35;
          const bDone = sec > b * T_NODE + 0.35;
          if (!aDone || !bDone) return;
          const A = nodePos[a], B = nodePos[b];
          const growP = easeOutCubic(win(sec, Math.max(a, b) * T_NODE, Math.max(a, b) * T_NODE + 0.4));
          const ex = A.x + (B.x - A.x) * growP;
          const ey = A.y + (B.y - A.y) * growP;
          ctx.strokeStyle = 'rgba(165,134,232,0.75)'; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(ex, ey); ctx.stroke();
          // 关系标签（毛玻璃小条）
          if (growP > 0.45) {
            const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
            ctx.save();
            ctx.globalAlpha = clamp01((growP - 0.45) / 0.55);
            glassPanel(ctx, mx - 26, my - 12, 52, 22, 8, 0.72);
            ctx.fillStyle = GLASS_COLORS[1]; ctx.font = 'bold 11px sans-serif';
            ctx.fillText(rel, mx, my);
            ctx.restore();
          }
        });

        // 节点（逐个弹入）
        nodes.forEach((nd, i) => {
          const t0 = i * T_NODE;
          const popP = easeOutBack(win(sec, t0, t0 + 0.5));
          if (popP <= 0) return;
          const s = Math.max(0, popP);
          const pt = nodePos[i];
          ctx.save();
          ctx.translate(pt.x, pt.y); ctx.scale(s, s);
          ctx.shadowColor = 'rgba(124,99,224,0.35)'; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2);
          ctx.fillStyle = nd.color;
          ctx.fill();
          ctx.shadowColor = 'transparent';
          // 高光
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.beginPath(); ctx.arc(-4, -4, R * 0.32, 0, Math.PI * 2); ctx.fill();
          // 标签
          ctx.fillStyle = '#0b132b'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText(nd.lbl, 0, 1);
          ctx.restore();
        });

        // 三元组高亮（最后阶段：脉冲主体节点）
        if (sec > nodes.length * T_NODE) {
          const pulse = 0.5 + 0.5 * Math.sin((sec - nodes.length * T_NODE) * 4);
          const hub = nodePos[0];
          ctx.save();
          ctx.globalAlpha = 0.35 * pulse;
          ctx.fillStyle = GLASS_COLORS[3];
          ctx.beginPath(); ctx.arc(hub.x, hub.y, R + 8, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
      });
      if (!ok) return;
      setStatus('知识图谱：三元组织成大规模语义网络', 'ok');
    },
  });

  // ===== 批20：推理机/机器学习（id 281-284,286）=====
  // 推理方向链（蓝紫毛玻璃丝滑版）：节点错峰入场，连线生长
  function reasoningChain(key, title, steps, finalStatus) {
    return {
      title: TEMPLATE_TITLES[key],
      mount: makeCanvasHD,
      async play(values, api) {
        const { ctx, setStatus } = api;
        const W = ctx._cssW, H = ctx._cssH;
        const n = steps.length;
        const x0 = 72, x1 = W - 72;
        const cy = Math.max(96, (72 + (H - 50)) / 2);
        const pos = steps.map((_, i) => n === 1 ? (x0 + x1) / 2 : x0 + (x1 - x0) * i / (n - 1));
        const chipW = Math.min(108, (x1 - x0) / Math.max(n - 1, 1) - 22), chipH = 52;
        const UNIT = 0.55, total = n * UNIT + 0.4;
        let last = -1;
        const ok = await tweenPlay(api, total * 1000, pr => {
          const sec = pr * total;
          paintGlassBg(ctx, W, H);
          ctx.textAlign = 'center';
          for (let i = 0; i < n; i++) {
            // 连线生长（在第 i+1 个节点入场时画出）
            if (i > 0) {
              const lp = easeOutCubic(clamp01((sec - i * UNIT) / 0.4));
              if (lp > 0) {
                const ax = pos[i - 1] + chipW / 2, bx = pos[i] - chipW / 2;
                const ex = ax + (bx - ax) * lp;
                ctx.strokeStyle = 'rgba(122,167,240,0.9)'; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(ax, cy); ctx.lineTo(ex, cy); ctx.stroke();
                if (lp >= 1) {
                  ctx.fillStyle = '#7aa7f0';
                  ctx.beginPath();
                  ctx.moveTo(bx, cy); ctx.lineTo(bx - 7, cy - 4.5); ctx.lineTo(bx - 7, cy + 4.5);
                  ctx.closePath(); ctx.fill();
                }
              }
            }
            const local = easeOutBack(clamp01((sec - i * UNIT) / 0.45));
            if (local <= 0) continue;
            const x = pos[i], y = cy + (1 - local) * 16;
            const cx = x;
            ctx.save();
            ctx.globalAlpha = local;
            ctx.translate(cx, y + chipH / 2);
            ctx.scale(0.9 + 0.1 * local, 0.9 + 0.1 * local);
            ctx.translate(-cx, -(y + chipH / 2));
            glassPanel(ctx, x - chipW / 2, y, chipW, chipH, 12, 0.64);
            const g = ctx.createLinearGradient(x - chipW / 2, y, x + chipW / 2, y);
            g.addColorStop(0, GLASS_COLORS[i % GLASS_COLORS.length]);
            g.addColorStop(1, GLASS_COLORS[(i + 1) % GLASS_COLORS.length]);
            ctx.fillStyle = g;
            roundRect(ctx, x - chipW / 2, y, chipW, 5, 3); ctx.fill();
            ctx.fillStyle = '#2a1f5e'; ctx.font = 'bold 11px sans-serif';
            wrapText(ctx, steps[i], x, y + chipH / 2 + 4, chipW - 14, 14);
            ctx.restore();
            if (Math.floor(sec / UNIT) === i && last !== i) {
              last = i;
              setStatus(`第${i + 1}步：${steps[i]}`);
            }
          }
        });
        if (ok === false) return;
        setStatus(finalStatus, 'ok');
      },
    };
  }

  registerCanvas('forward-reasoning', reasoningChain(
    'forward-reasoning', '正向推理（数据驱动）：事实 → 结论',
    ['已知事实', '匹配规则', '产生新事实', '得出结论'],
    '正向推理：事实不断触发规则，向前推出结论'));

  registerCanvas('backward-reasoning', reasoningChain(
    'backward-reasoning', '反向推理（目标驱动）：假设 → 证据',
    ['提出假设', '分解子目标', '查证已知事实', '假设成立/推翻'],
    '反向推理：为假设逐层寻找支持证据'));

  registerCanvas('ml-concept', pipeline('ml-concept', [
    { name: '训练数据', desc: '大量样本' },
    { name: '学习算法', desc: '寻找规律' },
    { name: '模型', desc: '规律的固化' },
    { name: '预测', desc: '判断新样本' },
  ], '机器学习：让计算机从数据中自动学出模型'));

  registerCanvas('supervised-unsupervised', gridN(2, 'supervised-unsupervised', [
    { name: '监督·分类', desc: '有标签：猫/狗/手写数字', clr: '#8ec5e0' },
    { name: '监督·回归', desc: '有标签：预测连续数值', clr: '#7aa7f0' },
    { name: '无监督·聚类', desc: '无标签：自动分群', clr: '#a586e8' },
    { name: '无监督·降维', desc: '无标签：发现内在结构', clr: '#f0a8d8' },
  ], '有无标签是关键区别：监督学预测，无监督发现结构'));

  // 最小二乘法（蓝紫毛玻璃风样板：放大居中 + 丝滑入场）
  registerCanvas('least-squares', {
    title: TEMPLATE_TITLES['least-squares'],
    mount: makeCanvasHD,
    async play(values, api) {
      const { ctx, setStatus } = api;
      const W = ctx._cssW, H = ctx._cssH;
      // 左右分栏：左侧说明卡（固定栏位），右侧坐标系放大居中，物理上互不遮挡
      const compact = H < 270;   // 矮窗口下说明卡紧凑化
      const PANEL_W = compact ? 210 : 236;
      const oy = H - 52;
      const ox = 56 + PANEL_W + 26;
      const axW = W - ox - 40, axH = H - 140;
      // 六个样本点（归一化坐标，随坐标系自适应）
      const tv = [0, 0.2, 0.4, 0.6, 0.8, 1];
      const yv = [0.30, 0.44, 0.53, 0.71, 0.78, 0.95];
      const pts = tv.map((t, i) => ({ x: ox + 30 + t * (axW - 56), y: oy - yv[i] * axH }));
      const lx1 = ox + 14, ly1 = oy - 0.17 * axH;
      const lx2 = ox + axW - 10, ly2 = oy - 0.85 * axH;
      const dyAt = x => ly1 + (ly2 - ly1) * (x - lx1) / (lx2 - lx1);
      let sumSq = 0;
      pts.forEach(p => { const d = p.y - dyAt(p.x); sumSq += Math.round(d * d / 100); });
      // 时间轴（秒）：点 pop → 直线生长 → 残差长出 → 卡片/总结淡入
      const TL = 3.6;
      const win = (sec, a, b) => clamp01((sec - a) / (b - a));
      let stage = 0;
      const ok = await tweenPlay(api, 3600, p => {
        const sec = p * TL;
        paintGlassBg(ctx, W, H);
        // 坐标轴
        ctx.strokeStyle = 'rgba(94,112,234,0.55)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + axW + 8, oy);
        ctx.moveTo(ox, oy); ctx.lineTo(ox, oy - axH - 8); ctx.stroke();
        ctx.fillStyle = '#6e6890'; ctx.font = 'bold 12px sans-serif';
        ctx.fillText('x', ox + axW + 18, oy + 4);
        ctx.fillText('y', ox - 12, oy - axH - 12);
        // 拟合直线（从左到右生长）
        const lp = easeOutCubic(win(sec, 1.25, 2.1));
        if (lp > 0) {
          const ex = lx1 + (lx2 - lx1) * lp, ey = ly1 + (ly2 - ly1) * lp;
          const lg = ctx.createLinearGradient(lx1, ly1, lx2, ly2);
          lg.addColorStop(0, '#7aa7f0'); lg.addColorStop(1, '#6c5ce7');
          ctx.strokeStyle = lg; ctx.lineWidth = 3.2; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(lx1, ly1); ctx.lineTo(ex, ey); ctx.stroke();
        }
        // 残差虚线（逐条从样本点长出）
        for (let i = 0; i < pts.length; i++) {
          const rp = easeOutCubic(win(sec, 2.3 + i * 0.13, 2.55 + i * 0.13));
          if (rp <= 0) continue;
          const q = pts[i], ly = dyAt(q.x);
          ctx.save();
          ctx.globalAlpha = 0.9;
          ctx.strokeStyle = '#e88bb8'; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]);
          ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(q.x, q.y + (ly - q.y) * rp); ctx.stroke();
          ctx.restore();
        }
        // 样本点（弹性 pop 入场）
        for (let i = 0; i < pts.length; i++) {
          const pp = win(sec, 0.15 + i * 0.13, 0.5 + i * 0.13);
          if (pp <= 0) continue;
          const q = pts[i], s = Math.max(0, easeOutBack(pp));
          ctx.save();
          ctx.translate(q.x, q.y); ctx.scale(s, s);
          ctx.shadowColor = 'rgba(124,99,224,0.4)'; ctx.shadowBlur = 8;
          ctx.fillStyle = '#a586e8';
          ctx.beginPath(); ctx.arc(0, 0, 5.5, 0, Math.PI * 2); ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.beginPath(); ctx.arc(-1.5, -1.5, 2, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        // 左侧固定栏毛玻璃说明卡（与图右栏物理隔离，不遮挡数据）
        const cp = win(sec, 2.15, 2.55);
        if (cp > 0) {
          const cw2 = PANEL_W, ch2 = compact ? 62 : 88;
          const cxx = 56, cyy = compact ? 92 : 96;
          ctx.save(); ctx.globalAlpha = cp;
          glassPanel(ctx, cxx, cyy, cw2, ch2, 12, 0.66);
          ctx.textAlign = 'left';
          if (compact) {
            ctx.fillStyle = '#5e5a8a'; ctx.font = '10px sans-serif';
            wrapText(ctx, '调整 w、b，使残差平方和最小', cxx + 11, cyy + 15, cw2 - 22, 12);
            ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 13px monospace';
            ctx.fillText('min Σ(yᵢ − ŷᵢ)²', cxx + 11, cyy + 37);
            ctx.fillStyle = '#c8709a'; ctx.font = '9px sans-serif';
            ctx.fillText('粉线=残差（和约 ' + sumSq + '）', cxx + 11, cyy + 55);
          } else {
            ctx.fillStyle = '#5e5a8a'; ctx.font = '11px sans-serif';
            wrapText(ctx, '调整 w、b，使各点纵向偏差（残差）的平方和最小', cxx + 12, cyy + 22, cw2 - 24, 15);
            ctx.fillStyle = '#6c5ce7'; ctx.font = 'bold 16px monospace';
            ctx.fillText('min Σ(yᵢ − ŷᵢ)²', cxx + 12, cyy + 54);
            ctx.fillStyle = '#c8709a'; ctx.font = '10px sans-serif';
            ctx.fillText('粉线=残差（平方和约 ' + sumSq + '）', cxx + 12, cyy + 76);
          }
          ctx.textAlign = 'center';
          ctx.restore();
        }
        // 状态文案随阶段切换
        const st = sec < 1.25 ? 1 : sec < 2.3 ? 2 : sec < 3.1 ? 3 : 4;
        if (st !== stage) {
          stage = st;
          setStatus(['观测样本：每个点都含误差', '最佳拟合直线 ŷ = wx + b，从左向右画出', '逐点标出残差，让平方和最小', '最小二乘：使残差平方和最小的直线即最优'][st - 1]);
        }
      });
      if (!ok) return;
      setStatus('最小二乘：使残差平方和最小的直线即最优', 'ok');
    },
  });

/* ============================================================
   * 小学阶段 · 互动动画引擎
   * 为所有 primary-* 模板提供统一的 Canvas 动画实现
   * ============================================================ */
  (function registerPrimaryAnimations() {
    // 小学知识点图标映射（emoji + 配色方案）
    const PRIMARY_ICONS = {
      'primary-ai-abilities': { icon: '👁️🧠📚', colors: ['#7aa7f0', '#9b7be8', '#e88bb8'], steps: ['感知世界', '做出决策', '不断学习'] },
      'primary-ai-vs-machine': { icon: '⚙️🤖', colors: ['#a0a8c0', '#7aa7f0'], steps: ['普通机器', '人工智能', '有什么不同？'] },
      'primary-human-vs-ai': { icon: '🧑‍💻🤖', colors: ['#e88bb8', '#7aa7f0'], steps: ['人类智能', '人工智能', '各有所长'] },
      'primary-ai-learning': { icon: '📖→🧠→⭐', colors: ['#7aa7f0', '#9b7be8', '#f5c26b'], steps: ['学习数据', '发现规律', '变得聪明'] },
      'primary-weak-strong-ai': { icon: '🔧💡', colors: ['#7aa7f0', '#e88bb8'], steps: ['弱AI（专用）', '强AI（通用）', '现在的AI是...'] },
      'primary-human-ai-team': { icon: '🤝', colors: ['#7aa7f0', '#e88bb8', '#6ecf9e'], steps: ['人擅长什么', 'AI擅长什么', '人机协作更强大'] },
      'primary-robot-ai': { icon: '🤖🧠', colors: ['#9b7be8', '#7aa7f0'], steps: ['机器人', '人工智能', '它们的关系'] },
      'primary-robot-body': { icon: '🦴👁️🦾', colors: ['#a0a8c0', '#7aa7f0', '#e88bb8'], steps: ['身体结构', '感知器官', '动作系统'] },
      'primary-sensors': { icon: '👁️👂👃', colors: ['#7aa7f0', '#e88bb8', '#6ecf9e'], steps: ['视觉传感器', '听觉传感器', '更多传感器'] },
      'primary-controller': { icon: '🧠💻', colors: ['#9b7be8', '#7aa7f0'], steps: ['控制器', '处理信息', '发出指令'] },
      'primary-motor': { icon: '⚡🦾', colors: ['#f5c26b', '#e88bb8'], steps: ['电动机', '电能转动能', '机器人动起来'] },
      'primary-block-programming': { icon: '🧱→🤖', colors: ['#6ecf9e', '#7aa7f0', '#f5c26b'], steps: ['图形化积木', '拼搭程序', '控制机器人'] },
      'primary-computer-vision': { icon: '📷→💻', colors: ['#7aa7f0', '#9b7be8'], steps: ['获取图像', '处理分析', '识别理解'] },
      'primary-camera-signal': { icon: '📷→🔢', colors: ['#e88bb8', '#7aa7f0'], steps: ['光学图像', '电信号', '数字数据'] },
      'primary-pixel-resolution': { icon: '🔲', colors: ['#7aa7f0', '#9b7be8'], steps: ['像素是什么', '分辨率', '越清晰越精细'] },
      'primary-binary-gray': { icon: '⬛⬜', colors: ['#a0a8c0', '#5e6a80'], steps: ['黑白图像', '灰度图像', '用数字表示'] },
      'primary-rgb': { icon: '🔴🟢🔵', colors: ['#e87070', '#6ecf9e', '#7aa7f0'], steps: ['红色', '绿色', '蓝色 = 所有颜色'] },
      'primary-image-preprocess': { icon: '🖼️→✨→🖼️', colors: ['#a0a8c0', '#6ecf9e', '#7aa7f0'], steps: ['原始图片', '预处理', '更适合AI分析'] },
      'primary-classify-detect': { icon: '🔍🏷️', colors: ['#7aa7f0', '#e88bb8'], steps: ['图像分类', '物体检测', 'AI看懂图片'] },
      'primary-face-detect-recognize': { icon: '👤👀', colors: ['#e88bb8', '#9b7be8'], steps: ['人脸检测', '人脸识别', '解锁与验证'] },
      'primary-ocr-handwriting': { icon: '✍️→🔤', colors: ['#7aa7f0', '#6ecf9e'], steps: ['手写文字', 'OCR识别', '变成可编辑文字'] },
      'primary-sound-digital': { icon: '🎵→🔢', colors: ['#e88bb8', '#9b7be8'], steps: ['模拟声音', '采样量化', '数字音频'] },
      'primary-speech-recognition': { icon: '🎤→📝', colors: ['#e88bb8', '#6ecf9e'], steps: ['语音输入', '识别处理', '变成文字'] },
      'primary-nlp': { icon: '📖💡', colors: ['#7aa7f0', '#9b7be8'], steps: ['自然语言', '分析理解', 'AI读懂文字'] },
      'primary-chatbot': { icon: '💬🤖', colors: ['#7aa7f0', '#e88bb8'], steps: ['理解问题', '检索知识', '生成回答'] },
      'primary-next-word': { icon: '📝→❓', colors: ['#9b7be8', '#f5c26b'], steps: ['上文', '预测', '下一个词'] },
      'primary-text-generation': { icon: '✨→📄', colors: ['#e88bb8', '#7aa7f0', '#9b7be8'], steps: ['提示词', '生成', '完整文章'] },
      'primary-media-generation': { icon: '✨→🖼️🎬', colors: ['#e88bb8', '#6ecf9e', '#7aa7f0'], steps: ['文字描述', 'AI生成', '图片和视频'] },
      'primary-prompt': { icon: '💡✍️', colors: ['#f5c26b', '#7aa7f0'], steps: ['明确目标', '说清楚要求', '得到好结果'] },
      'primary-data-cards': { icon: '🗂️📊🏷️', colors: ['#7aa7f0', '#6ecf9e', '#e88bb8'], steps: ['数据集', '样本与特征', '标签'] },
      'primary-train-test': { icon: '🏷️→🧠→✅', colors: ['#e88bb8', '#9b7be8', '#6ecf9e'], steps: ['数据标注', '模型训练', '测试验证'] },
      'primary-hallucination-check': { icon: '🤥✅', colors: ['#e88bb8', '#6ecf9e'], steps: ['AI幻觉', '为什么会出错', '如何验证'] },
    };

    // 绘制圆角矩形工具
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    // 绘制毛玻璃面板
    function glassPanelP(ctx, x, y, w, h, r, alpha) {
      ctx.save();
      ctx.fillStyle = `rgba(255,255,255,${alpha || 0.7})`;
      roundRect(ctx, x, y, w, h, r);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }

    // 缓动函数
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    function easeOutBack(t) { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
    function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

    // 自动换行文字
    function wrapTextC(ctx, text, x, y, maxWidth, lineHeight) {
      const chars = String(text).split('');
      let line = '', lines = [];
      for (let i = 0; i < chars.length; i++) {
        const test = line + chars[i];
        if (ctx.measureText(test).width > maxWidth && line) {
          lines.push(line);
          line = chars[i];
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
      lines.forEach((l, i) => { ctx.fillText(l, x, y + i * lineHeight); });
      return lines.length;
    }

    // 注册每个小学动画模板
    Object.keys(TEMPLATE_TITLES).forEach(tplName => {
      if (!tplName.startsWith('primary-')) return;
      const info = PRIMARY_ICONS[tplName] || { icon: '✨', colors: ['#7aa7f0', '#9b7be8'], steps: ['知识点学习', '理解概念', '掌握要点'] };

      registerCanvas(tplName, {
        title: TEMPLATE_TITLES[tplName] || tplName,
        mount(host) {
          const stage = document.getElementById('animStage');
          const canvas = document.createElement('canvas');
          canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
          const dpr = window.devicePixelRatio || 1;
          const resize = () => {
            const rect = stage.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
          };
          resize();
          stage.innerHTML = '';
          stage.append(canvas);
          const ctx = canvas.getContext('2d');
          ctx.scale(dpr, dpr);
          ctx._resize = resize;
          ctx._host = stage;
          return ctx;
        },
        async play(values, api) {
          const ctx = api.ctx;
          const canvas = ctx.canvas;
          const stage = ctx._host;
          const W = stage.clientWidth, H = stage.clientHeight;
          const title = TEMPLATE_TITLES[tplName] || tplName;
          const colors = info.colors;
          const steps = info.steps;
          const iconStr = info.icon;

          // ===== 智能拆分讲解文稿：多途径获取完整 explanation =====
          // 途径1：currentPoint.explanation
          // 途径2：全局 STAGE_COURSE_DATA 中查找
          // 途径3：兜底用步骤标题生成
          let fullExplanation = '';
          if (currentPoint && currentPoint.explanation) {
            fullExplanation = currentPoint.explanation;
          } else if (window.STAGE_COURSE_DATA && currentPoint && currentPoint.id) {
            // 从全局课程数据中查找当前知识点的 explanation
            const stageData = window.STAGE_COURSE_DATA[currentPoint.stage] || 
                             window.STAGE_COURSE_DATA['小学'] || 
                             window.STAGE_COURSE_DATA[Object.keys(window.STAGE_COURSE_DATA)[0]];
            if (stageData && stageData.units) {
              for (const u of stageData.units) {
                if (u.sections) {
                  for (const s of u.sections) {
                    if (s.items) {
                      const found = s.items.find(it => String(it.id) === String(currentPoint.id));
                      if (found && found.explanation) {
                        fullExplanation = found.explanation;
                        break;
                      }
                    }
                  }
                }
                if (fullExplanation) break;
              }
            }
          }
          
          let narrations = [];
          if (fullExplanation) {
            // 按双换行（段落）拆分，过滤空段落
            const paragraphs = fullExplanation.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
            if (paragraphs.length >= steps.length) {
              // 段落数 >= 步数：前几步各分配一段，最后一步合并剩余段落
              narrations = steps.map((_, i) => {
                if (i < steps.length - 1) return paragraphs[i];
                return paragraphs.slice(i).join('。');
              });
            } else {
              // 段落数 < 步数：按句子再细分，尽量每步都有内容
              const sentences = fullExplanation.split(/[。！？.!?]+/).map(s => s.trim()).filter(Boolean);
              const perStep = Math.max(1, Math.floor(sentences.length / steps.length));
              narrations = steps.map((_, i) => {
                const start = i * perStep;
                const end = (i === steps.length - 1) ? sentences.length : Math.min(start + perStep, sentences.length);
                return sentences.slice(start, end).join('。') + '。';
              });
            }
          } else {
            // 没有完整文稿时，用步骤标题生成简单讲解（兜底）
            narrations = steps.map((s, i) => `${s}。这是第${i + 1}个学习要点。`);
          }
          // 开场语和总结语
          const pointTitle = (currentPoint && currentPoint.title) || title;
          const introNarration = `今天我们来学习：${pointTitle}。${steps.length > 0 ? '一共有' + steps.length + '个要点，请大家认真听讲。' : ''}`;
          const summaryNarration = `好的，今天的内容就到这里。我们学习了${steps.length}个要点，分别是：${steps.join('、')}。希望大家都掌握了！`;

          const totalDuration = 8; // 模拟总时长（秒）；默认0.7倍速约11.4秒，守住≤12秒红线
          let stepIdx = -2; // 初始为特殊值-2，确保第一次进入else分支时能触发初始状态
          let summarySpoken = false; // 总结语音是否已播放，避免重复触发
          let lastSpokenIdx = -99; // 防重复：记录上一次播放语音的步骤索引

          const drawBackground = () => {
            // 渐变背景
            const grad = ctx.createLinearGradient(0, 0, W, H);
            grad.addColorStop(0, 'rgba(248, 245, 255, 0.95)');
            grad.addColorStop(0.5, 'rgba(240, 248, 255, 0.95)');
            grad.addColorStop(1, 'rgba(245, 250, 246, 0.95)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, W, H);

            // 装饰光斑
            for (let i = 0; i < 5; i++) {
              const gx = (i * 0.25 + 0.1) * W;
              const gy = (i % 2 === 0 ? 0.2 : 0.8) * H;
              const r = 80 + i * 20;
              const rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
              rg.addColorStop(0, colors[i % colors.length] + '22');
              rg.addColorStop(1, 'transparent');
              ctx.fillStyle = rg;
              ctx.fillRect(gx - r, gy - r, r * 2, r * 2);
            }
          };

          const drawFloatingIcon = (progress) => {
            // 浮动的图标组
            const icons = Array.from(iconStr);
            const baseY = H * 0.38;
            const spacing = Math.min(W * 0.22, 90);
            const startX = W / 2 - (icons.length - 1) * spacing / 2;

            icons.forEach((ch, i) => {
              const ip = Math.max(0, Math.min(1, (progress - i * 0.12) / 0.4));
              if (ip <= 0) return;
              const x = startX + i * spacing;
              const y = baseY + Math.sin(Date.now() / 600 + i) * 8;
              const scale = easeOutBack(ip);
              ctx.save();
              ctx.translate(x, y);
              ctx.scale(scale, scale);
              ctx.font = `${Math.min(W * 0.12, 64)}px serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.shadowColor = 'rgba(108,92,231,0.3)';
              ctx.shadowBlur = 20;
              ctx.fillText(ch, 0, 0);
              ctx.restore();
            });
          };

          const drawTitle = (progress) => {
            if (progress <= 0) return;
            const p = easeOutCubic(progress);
            ctx.save();
            ctx.globalAlpha = p;
            ctx.translate(0, (1 - p) * -20);

            // 标题背景条
            const tw = Math.min(W * 0.85, 560);
            const tx = (W - tw) / 2;
            const ty = H * 0.08;
            glassPanelP(ctx, tx, ty, tw, 48, 14, 0.8);

            // 标题文字
            ctx.fillStyle = '#4a4180';
            ctx.font = `bold ${Math.min(W * 0.045, 22)}px "Microsoft YaHei","PingFang SC",sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, W / 2, ty + 24);
            ctx.restore();
          };

          const drawStepCards = (stepIdx, stepProgress) => {
            const cardCount = Math.min(steps.length, 3);
            const cardW = Math.min(W * 0.26, 170);
            const cardH = Math.min(H * 0.22, 120);
            const gap = 16;
            const totalW = cardCount * cardW + (cardCount - 1) * gap;
            const startX = (W - totalW) / 2;
            const cardY = H * 0.58;

            for (let i = 0; i < cardCount; i++) {
              const x = startX + i * (cardW + gap);
              let p = 0;
              if (i < stepIdx) p = 1;
              else if (i === stepIdx) p = stepProgress;
              if (p <= 0) continue;

              const ep = easeOutBack(p);
              ctx.save();
              ctx.translate(x + cardW / 2, cardY + cardH / 2);
              ctx.scale(ep, ep);
              ctx.translate(-cardW / 2, -cardH / 2);

              // 卡片
              const colorIdx = i % colors.length;
              const isActive = i === stepIdx && p < 1;
              const alpha = isActive ? 0.95 : 0.8;
              const borderColor = isActive ? colors[colorIdx] : 'rgba(255,255,255,0.6)';

              ctx.fillStyle = `rgba(255,255,255,${alpha})`;
              roundRect(ctx, 0, 0, cardW, cardH, 16);
              ctx.fill();
              ctx.strokeStyle = borderColor;
              ctx.lineWidth = isActive ? 2.5 : 1.5;
              ctx.stroke();

              // 序号圆
              ctx.fillStyle = colors[colorIdx];
              ctx.beginPath();
              ctx.arc(cardW / 2, 22, 16, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#fff';
              ctx.font = 'bold 14px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(String(i + 1), cardW / 2, 22);

              // 步骤文字
              ctx.fillStyle = '#4a4180';
              ctx.font = `bold ${Math.min(cardW * 0.11, 15)}px "Microsoft YaHei",sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'top';
              const text = steps[i] || '';
              const maxW = cardW - 24;
              wrapTextC(ctx, text, cardW / 2, 46, maxW, Math.min(cardW * 0.09, 18));

              // 完成对勾
              if (i < stepIdx) {
                ctx.fillStyle = '#6ecf9e';
                ctx.font = 'bold 20px sans-serif';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                ctx.fillText('✓', cardW - 10, cardH - 8);
              }

              ctx.restore();
            }

            // 进度指示器
            const dotY = cardY + cardH + 24;
            const dotGap = 12;
            const dotW = cardCount * 8 + (cardCount - 1) * dotGap;
            const dotStart = (W - dotW) / 2;
            for (let i = 0; i < cardCount; i++) {
              ctx.fillStyle = i < stepIdx ? colors[i % colors.length] : (i === stepIdx ? colors[i % colors.length] : '#d0d6e8');
              ctx.beginPath();
              const dx = dotStart + i * (8 + dotGap);
              const size = i === stepIdx ? 10 + stepProgress * 4 : 8;
              ctx.arc(dx, dotY, size / 2, 0, Math.PI * 2);
              ctx.fill();
            }
          };

          const drawSummary = (progress) => {
            if (progress <= 0) return;
            const p = easeOutCubic(progress);
            ctx.save();
            ctx.globalAlpha = p;
            ctx.translate(0, (1 - p) * 20);

            const sw = Math.min(W * 0.8, 500);
            const sh = Math.min(H * 0.18, 90);
            const sx = (W - sw) / 2;
            const sy = H * 0.88 - sh;

            glassPanelP(ctx, sx, sy, sw, sh, 14, 0.85);

            // 装饰线
            const lg = ctx.createLinearGradient(sx, 0, sx + sw, 0);
            colors.forEach((c, i) => lg.addColorStop(i / (colors.length - 1), c));
            ctx.fillStyle = lg;
            roundRect(ctx, sx, sy, sw, 5, 2.5);
            ctx.fill();

            ctx.fillStyle = '#4a4180';
            ctx.font = `bold ${Math.min(W * 0.035, 17)}px "Microsoft YaHei",sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText('🎉 学习完成！你掌握了 ' + steps.length + ' 个要点', W / 2, sy + 18);

            ctx.fillStyle = '#7b71c5';
            ctx.font = `${Math.min(W * 0.025, 13)}px "Microsoft YaHei",sans-serif`;
            ctx.fillText('点击「刷新动画」可以再看一遍哦', W / 2, sy + 48);

            ctx.restore();
          };

          // 主播放循环
          const frameDur = 1000 / 60;
          const totalFrames = Math.round(totalDuration * 60);
          let frame = 0;

          const setStepStatus = (idx) => {
            // 防重复：同一 idx 不重复触发语音
            if (idx === lastSpokenIdx) return;
            lastSpokenIdx = idx;
            
            const labels = [
              '开始学习：' + (steps[0] || ''),
              '学习要点 1：' + (steps[0] || ''),
              '学习要点 2：' + (steps[1] || ''),
              '学习要点 3：' + (steps[2] || ''),
              '总结回顾',
              '学习完成',
            ];
            const statusText = labels[Math.min(idx, labels.length - 1)] || '学习中';
            // 状态栏只显示简短文字（UI 提示用，idle 级别不触发 speak）
            api.setStatus(statusText, 'idle');
            // 语音朗读完整的讲解内容
            if (voiceOn) {
              if (idx === 0) {
                speak(introNarration); // 开场语
              } else if (idx >= 1 && idx <= steps.length) {
                speak(narrations[idx - 1] || ''); // 第 idx 个要点的讲解
              } else if (idx === steps.length + 1) {
                speak(summaryNarration); // 总结
              }
            }
          };

          for (frame = 0; frame < totalFrames; frame++) {
            if (api.isCancelled()) return;
            await api.wait(frameDur); // 经 localWait：暂停时阻塞、按倍速缩放

            const t = frame / totalFrames; // 0~1
            drawBackground();

            // 阶段划分
            // 0 - 0.08: 图标入场 + 标题入场
            // 0.08 - 0.85: 分步展示卡片（每步约 0.25）
            // 0.85 - 1.0: 总结

            const iconP = Math.min(1, t / 0.12);
            const titleP = Math.min(1, (t - 0.04) / 0.1);

            drawFloatingIcon(iconP);
            drawTitle(titleP);

            const stepStartTime = 0.14;
            const stepDuration = 0.72;
            const perStep = stepDuration / steps.length;

            let currentStep = -1;
            let stepProgress = 0;

            if (t >= stepStartTime) {
              const stepT = (t - stepStartTime) / stepDuration;
              currentStep = Math.floor(stepT * steps.length);
              stepProgress = (stepT * steps.length) % 1;
              if (currentStep >= steps.length) {
                currentStep = steps.length - 1;
                stepProgress = 1;
              }
            }

            if (currentStep >= 0) {
              // 语音同步：只要步骤索引变化就触发，不依赖进度窗口（避免快速档跳帧漏触发）
              if (stepIdx !== currentStep) {
                stepIdx = currentStep;
                setStepStatus(currentStep + 1); // 同时更新状态栏文字 + 触发语音
              }
              drawStepCards(currentStep + 1, currentStep === steps.length - 1 ? 1 : stepProgress);
            } else {
              // 开场阶段：只在第一次进入时设置状态，避免每帧重复触发语音
              if (stepIdx !== -1) {
                stepIdx = -1;
                setStepStatus(0);
              }
            }

            // 总结
            const sumP = Math.max(0, Math.min(1, (t - 0.85) / 0.12));
            drawSummary(sumP);

            if (sumP > 0.5 && !summarySpoken) {
              summarySpoken = true;
              // 状态栏显示完成提示（idle 级别不触发 speak，避免和总结语音重复）
              api.setStatus('学习完成！点击刷新动画可以再看一遍 🌟', 'idle');
              // 播放总结语音（防重复）
              if (voiceOn && lastSpokenIdx !== steps.length + 1) {
                lastSpokenIdx = steps.length + 1;
                speak(summaryNarration);
              }
            }
          }

          api.setStatus('学习完成！点击刷新动画可以再看一遍 🌟', 'idle');
        }
      });
    });
  })();


  window.animationStudio = {
    loadPoint,
    showMode,
    supportsAnimation,
    register,        // 注册排序类（BarAdapter）模板
    registerCanvas,  // 注册 canvas 类模板（mount+play）
    _templates: templates,        // 调试用：查看已注册模板
    _canvasTemplates: canvasTemplates,
  };
})();
