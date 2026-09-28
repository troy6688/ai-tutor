// 中小学编程练习题库
window.CODING_EXERCISES = {
  "141": {
    "id": "141",
    "title": "冒泡排序",
    "category": "排序算法",
    "difficulty": 2,
    "description": "冒泡排序是最基础的排序算法之一。它重复地遍历要排序的数列，一次比较两个元素，如果它们的顺序错误就把它们交换过来。\n\n请实现一个 bubble_sort 函数，接收一个列表，返回从小到大排序后的新列表。",
    "goals": [
      "理解冒泡排序的核心思想",
      "掌握嵌套循环的使用",
      "学会比较和交换元素",
      "理解算法的时间复杂度"
    ],
    "hints": [
      "外层循环控制排序的轮数，共需要 len(arr)-1 轮",
      "内层循环负责相邻元素的比较和交换",
      "如果前一个元素大于后一个，就交换它们的位置",
      "每一轮结束后，最大的元素会'冒泡'到最后面"
    ],
    "initialCode": "# 请实现冒泡排序函数\n# 输入：一个数字列表，如 [5, 2, 8, 1, 9]\n# 输出：排序后的新列表\n\ndef bubble_sort(arr):\n    # 在这里写你的代码\n    pass\n\n# 测试\nnumbers = [5, 2, 8, 1, 9, 3]\nresult = bubble_sort(numbers)\nprint('排序结果:', result)",
    "solution": "def bubble_sort(arr):\n    result = arr.copy()\n    n = len(result)\n    for i in range(n - 1):\n        for j in range(n - 1 - i):\n            if result[j] > result[j + 1]:\n                result[j], result[j + 1] = result[j + 1], result[j]\n    return result",
    "testInput": "[5, 2, 8, 1, 9, 3]",
    "expectedOutput": "[1, 2, 3, 5, 8, 9]"
  },
  "144": {
    "id": "144",
    "title": "广度优先搜索（BFS）",
    "category": "搜索算法",
    "difficulty": 4,
    "description": "广度优先搜索（BFS）是一种图搜索算法，从起始节点开始，先访问所有相邻节点，再逐层向外扩展。\n\n给定一个图的邻接表和起始节点，请实现 BFS 函数，返回按访问顺序排列的节点列表。",
    "goals": [
      "理解BFS的层序遍历思想",
      "掌握队列数据结构的使用",
      "学会标记已访问节点",
      "理解BFS在最短路径问题中的应用"
    ],
    "hints": [
      "使用队列（queue）来存储待访问的节点",
      "用一个集合或列表记录已经访问过的节点",
      "每次从队列头部取出一个节点，把它的邻居加入队列尾部",
      "注意不要重复访问同一个节点"
    ],
    "initialCode": "# 请实现广度优先搜索（BFS）\n# 输入：graph是邻接表字典，start是起始节点\n# 输出：按访问顺序的节点列表\n\ndef bfs(graph, start):\n    # 在这里写你的代码\n    pass\n\n# 测试：一个简单的图\ngraph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A', 'F'],\n    'D': ['B'],\n    'E': ['B', 'F'],\n    'F': ['C', 'E']\n}\nresult = bfs(graph, 'A')\nprint('BFS访问顺序:', result)",
    "solution": "def bfs(graph, start):\n    visited = []\n    queue = [start]\n    visited.append(start)\n    while queue:\n        node = queue.pop(0)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.append(neighbor)\n                queue.append(neighbor)\n    return visited",
    "testInput": "graph={'A':['B','C'],'B':['A','D','E'],'C':['A','F'],'D':['B'],'E':['B','F'],'F':['C','E']}, start='A'",
    "expectedOutput": "['A', 'B', 'C', 'D', 'E', 'F']"
  },
  "154": {
    "id": "154",
    "title": "k近邻分类算法（KNN）",
    "category": "机器学习",
    "difficulty": 3,
    "description": "K近邻（KNN）是一种简单的分类算法：要判断一个新样本属于哪一类，就看它附近的k个邻居中，哪一类最多。\n\n请实现一个简化版的 KNN 分类器：计算新样本与所有训练样本的距离，取最近的k个邻居投票。",
    "goals": [
      "理解KNN的核心思想",
      "学会计算欧氏距离",
      "掌握投票统计的方法",
      "理解k值对分类结果的影响"
    ],
    "hints": [
      "欧氏距离公式：sqrt((x1-x2)² + (y1-y2)²)",
      "计算新样本到所有训练样本的距离",
      "按距离排序，取前k个最近的邻居",
      "统计k个邻居中哪个类别最多，就是预测结果"
    ],
    "initialCode": "# 请实现k近邻分类算法（KNN）\n# 训练数据：points是点的列表，labels是对应的类别\n# 预测：给定一个新点，返回预测的类别\nimport math\n\ndef knn_predict(train_points, train_labels, new_point, k=3):\n    # 在这里写你的代码\n    pass\n\n# 测试数据（简单的二分类问题）\npoints = [(1, 2), (2, 1), (3, 3), (7, 6), (8, 7), (9, 5)]\nlabels = ['A', 'A', 'A', 'B', 'B', 'B']\n\n# 预测新点\nnew = (5, 4)\nresult = knn_predict(points, labels, new, k=3)\nprint('预测类别:', result)",
    "solution": "import math\n\ndef knn_predict(train_points, train_labels, new_point, k=3):\n    distances = []\n    for i, point in enumerate(train_points):\n        dist = math.sqrt((point[0] - new_point[0])**2 + (point[1] - new_point[1])**2)\n        distances.append((dist, train_labels[i]))\n    distances.sort(key=lambda x: x[0])\n    neighbors = [d[1] for d in distances[:k]]\n    label_count = {}\n    for label in neighbors:\n        label_count[label] = label_count.get(label, 0) + 1\n    return max(label_count, key=label_count.get)",
    "testInput": "points=[(1,2),(2,1),(3,3),(7,6),(8,7),(9,5)], labels=['A','A','A','B','B','B'], new=(5,4), k=3",
    "expectedOutput": "B"
  },
  "155": {
    "id": "155",
    "title": "线性回归模型",
    "category": "机器学习",
    "difficulty": 3,
    "description": "线性回归是用一条直线来拟合数据点，预测连续值。最简单的实现方法是最小二乘法。\n\n请实现一个简单的线性回归函数：给定x和y的列表，计算斜率w和截距b，使得 y = w*x + b 最好地拟合数据。",
    "goals": [
      "理解线性回归的基本概念",
      "掌握最小二乘法的计算",
      "学会计算均值和协方差",
      "理解误差平方和的意义"
    ],
    "hints": [
      "斜率 w = Σ(x-x̄)(y-ȳ) / Σ(x-x̄)²",
      "截距 b = ȳ - w * x̄",
      "先计算 x 的均值和 y 的均值",
      "分子是x和y的协方差乘以n，分母是x的方差乘以n"
    ],
    "initialCode": "# 请实现线性回归（最小二乘法）\n# 输入：x列表和y列表\n# 输出：(斜率w, 截距b)\n\ndef linear_regression(x, y):\n    # 在这里写你的代码\n    pass\n\n# 测试数据\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 5, 4, 5]\nw, b = linear_regression(x, y)\nprint(f'y = {w:.2f}x + {b:.2f}')\nprint(f'预测 x=6 时，y = {w*6+b:.2f}')",
    "solution": "def linear_regression(x, y):\n    n = len(x)\n    mean_x = sum(x) / n\n    mean_y = sum(y) / n\n    numerator = 0\n    denominator = 0\n    for i in range(n):\n        numerator += (x[i] - mean_x) * (y[i] - mean_y)\n        denominator += (x[i] - mean_x) ** 2\n    w = numerator / denominator\n    b = mean_y - w * mean_x\n    return w, b",
    "testInput": "x=[1,2,3,4,5], y=[2,4,5,4,5]",
    "expectedOutput": "w=0.6, b=2.2"
  },
  "156": {
    "id": "156",
    "title": "k均值聚类算法（K-Means）",
    "category": "机器学习",
    "difficulty": 4,
    "description": "K均值聚类是一种无监督学习算法，把数据分成k个簇。核心思想：随机选k个中心点，反复执行「分配样本到最近中心」和「更新中心点为簇的均值」，直到收敛。\n\n请实现简化版的 K-Means 算法（只做几轮迭代）。",
    "goals": [
      "理解K-Means的聚类思想",
      "掌握距离计算和中心点更新",
      "理解迭代优化的过程",
      "学会处理无标签数据"
    ],
    "hints": [
      "第一步：随机选择k个点作为初始中心点",
      "第二步：把每个点分配给最近的中心点",
      "第三步：重新计算每个簇的中心点（取均值）",
      "重复第二、三步，迭代几次就可以了"
    ],
    "initialCode": "# 请实现k均值聚类算法（K-Means）\n# 输入：data是数据点列表，k是簇的数量，iters是迭代次数\n# 输出：每个数据点的簇标签列表\nimport random\nimport math\n\ndef kmeans(data, k, iters=10):\n    # 在这里写你的代码\n    pass\n\n# 测试数据\npoints = [(1, 1), (2, 1), (1, 2), (8, 8), (9, 8), (8, 9)]\nlabels = kmeans(points, k=2, iters=5)\nprint('聚类结果:', labels)",
    "solution": "import random\nimport math\n\ndef kmeans(data, k, iters=10):\n    # 随机选择k个初始中心点\n    centroids = random.sample(data, k)\n    labels = [0] * len(data)\n    for _ in range(iters):\n        # 分配：每个点到最近的中心\n        for i, point in enumerate(data):\n            min_dist = float('inf')\n            for j, cent in enumerate(centroids):\n                dist = math.sqrt((point[0]-cent[0])**2 + (point[1]-cent[1])**2)\n                if dist < min_dist:\n                    min_dist = dist\n                    labels[i] = j\n        # 更新：重新计算中心点\n        new_centroids = [(0, 0)] * k\n        counts = [0] * k\n        for i, point in enumerate(data):\n            c = labels[i]\n            new_centroids[c] = (new_centroids[c][0] + point[0], new_centroids[c][1] + point[1])\n            counts[c] += 1\n        for j in range(k):\n            if counts[j] > 0:\n                new_centroids[j] = (new_centroids[j][0] / counts[j], new_centroids[j][1] / counts[j])\n        centroids = new_centroids\n    return labels",
    "testInput": "data=[(1,1),(2,1),(1,2),(8,8),(9,8),(8,9)], k=2, iters=5",
    "expectedOutput": "2个簇（前3个一类，后3个一类）"
  },
  "157": {
    "id": "157",
    "title": "决策树的构建步骤",
    "category": "机器学习",
    "difficulty": 4,
    "description": "决策树通过一系列「是/否」问题来做决策。构建决策树的关键是选择最优划分特征——通常用信息增益来衡量。\n\n请实现一个计算信息熵的函数：给定一个类别列表，计算它的信息熵。",
    "goals": [
      "理解信息熵的概念",
      "掌握熵的计算公式",
      "理解信息增益的意义",
      "为理解决策树构建打基础"
    ],
    "hints": [
      "熵的公式：H = -Σ(p_i * log2(p_i))",
      "p_i 是第 i 类样本占总数的比例",
      "先统计每个类别的数量",
      "用 math.log2() 计算以2为底的对数"
    ],
    "initialCode": "# 请实现信息熵的计算\n# 输入：一个类别列表，如 ['A', 'A', 'B', 'B', 'B']\n# 输出：信息熵的值\nimport math\n\ndef entropy(labels):\n    # 在这里写你的代码\n    pass\n\n# 测试\ndata1 = ['A', 'A', 'B', 'B']  # 均匀分布，熵最大\ndata2 = ['A', 'A', 'A', 'A']  # 全相同，熵为0\nprint('数据1的熵:', entropy(data1))\nprint('数据2的熵:', entropy(data2))",
    "solution": "import math\n\ndef entropy(labels):\n    n = len(labels)\n    if n == 0:\n        return 0\n    count = {}\n    for label in labels:\n        count[label] = count.get(label, 0) + 1\n    result = 0\n    for c in count.values():\n        p = c / n\n        result -= p * math.log2(p)\n    return result",
    "testInput": "['A','A','B','B']",
    "expectedOutput": "1.0"
  },
  "169": {
    "id": "169",
    "title": "自然语言处理（NLP）",
    "category": "自然语言处理",
    "difficulty": 3,
    "description": "自然语言处理（NLP）是让计算机理解和生成人类语言的技术。文本分词和词频统计是 NLP 的基础任务。\n\n请实现一个简单的文本分析函数：给定一段中文文本，进行分词（按空格和标点），并统计词频。",
    "goals": [
      "理解NLP的基本概念",
      "学会文本预处理的方法",
      "掌握词频统计的实现",
      "为学习更高级NLP打基础"
    ],
    "hints": [
      "先把文本中的标点符号替换成空格",
      "用 split() 按空格分割成词语列表",
      "用字典统计每个词出现的次数",
      "可以按出现次数从多到少排序输出"
    ],
    "initialCode": "# 请实现一个简单的文本词频统计函数\n# 输入：一段中文文本（用空格分词的形式）\n# 输出：按词频从高到低排序的 (词, 次数) 列表\n\ndef word_frequency(text):\n    # 在这里写你的代码\n    pass\n\n# 测试\ntext = '人工智能 是 一门 很 有趣 的 学科 人工智能 可以 帮助 人类 解决 很多 问题'\nresult = word_frequency(text)\nprint('词频统计（前5个）:')\nfor word, count in result[:5]:\n    print(f'  {word}: {count}次')",
    "solution": "def word_frequency(text):\n    words = text.split()\n    freq = {}\n    for word in words:\n        freq[word] = freq.get(word, 0) + 1\n    return sorted(freq.items(), key=lambda x: x[1], reverse=True)",
    "testInput": "'人工智能 是 一门 很 有趣 的 学科 人工智能 可以 帮助 人类 解决 很多 问题'",
    "expectedOutput": "[('人工智能',2), ...其余各1次]"
  },
  "196": {
    "id": "196",
    "title": "编程调用智能工具与Python优势",
    "category": "Python基础",
    "difficulty": 2,
    "description": "Python 是 AI 领域最常用的编程语言。它语法简单、库生态丰富，非常适合快速实现 AI 应用。\n\n请编写一个 Python 函数，接收一个字符串，统计其中每个字符出现的次数（类似词频统计）。",
    "goals": [
      "熟悉Python的基本语法",
      "掌握字典的使用方法",
      "学会遍历字符串",
      "理解统计频率的思路"
    ],
    "hints": [
      "创建一个空字典来记录字符出现的次数",
      "遍历字符串中的每个字符",
      "如果字符已经在字典中，计数+1；否则设为1",
      "也可以用 collections.Counter 来简化（但建议先自己实现）"
    ],
    "initialCode": "# 请实现字符频率统计函数\n# 输入：一个字符串\n# 输出：字典，键是字符，值是出现次数\n\ndef char_frequency(s):\n    # 在这里写你的代码\n    pass\n\n# 测试\ntext = 'hello world'\nresult = char_frequency(text)\nprint('字符频率:', result)",
    "solution": "def char_frequency(s):\n    freq = {}\n    for char in s:\n        if char in freq:\n            freq[char] += 1\n        else:\n            freq[char] = 1\n    return freq",
    "testInput": "'hello world'",
    "expectedOutput": "{'h':1,'e':1,'l':3,'o':2,' ':1,'w':1,'r':1,'d':1}"
  },
  "228": {
    "id": "228",
    "title": "编程调用智能工具与Python优势",
    "category": "Python基础",
    "difficulty": 2,
    "description": "Python 是 AI 领域最常用的编程语言。它语法简单、库生态丰富，非常适合快速实现 AI 应用。\n\n请编写一个 Python 函数，接收一个字符串，统计其中每个字符出现的次数（类似词频统计）。",
    "goals": [
      "熟悉Python的基本语法",
      "掌握字典的使用方法",
      "学会遍历字符串",
      "理解统计频率的思路"
    ],
    "hints": [
      "创建一个空字典来记录字符出现的次数",
      "遍历字符串中的每个字符",
      "如果字符已经在字典中，计数+1；否则设为1",
      "也可以用 collections.Counter 来简化（但建议先自己实现）"
    ],
    "initialCode": "# 请实现字符频率统计函数\n# 输入：一个字符串\n# 输出：字典，键是字符，值是出现次数\n\ndef char_frequency(s):\n    # 在这里写你的代码\n    pass\n\n# 测试\ntext = 'hello world'\nresult = char_frequency(text)\nprint('字符频率:', result)",
    "solution": "def char_frequency(s):\n    freq = {}\n    for char in s:\n        if char in freq:\n            freq[char] += 1\n        else:\n            freq[char] = 1\n    return freq",
    "testInput": "'hello world'",
    "expectedOutput": "{'h':1,'e':1,'l':3,'o':2,' ':1,'w':1,'r':1,'d':1}"
  },
  "252": {
    "id": "252",
    "title": "自然语言处理（NLP）",
    "category": "自然语言处理",
    "difficulty": 3,
    "description": "自然语言处理（NLP）是让计算机理解和生成人类语言的技术。文本分词和词频统计是 NLP 的基础任务。\n\n请实现一个简单的文本分析函数：给定一段中文文本，进行分词（按空格和标点），并统计词频。",
    "goals": [
      "理解NLP的基本概念",
      "学会文本预处理的方法",
      "掌握词频统计的实现",
      "为学习更高级NLP打基础"
    ],
    "hints": [
      "先把文本中的标点符号替换成空格",
      "用 split() 按空格分割成词语列表",
      "用字典统计每个词出现的次数",
      "可以按出现次数从多到少排序输出"
    ],
    "initialCode": "# 请实现一个简单的文本词频统计函数\n# 输入：一段中文文本（用空格分词的形式）\n# 输出：按词频从高到低排序的 (词, 次数) 列表\n\ndef word_frequency(text):\n    # 在这里写你的代码\n    pass\n\n# 测试\ntext = '人工智能 是 一门 很 有趣 的 学科 人工智能 可以 帮助 人类 解决 很多 问题'\nresult = word_frequency(text)\nprint('词频统计（前5个）:')\nfor word, count in result[:5]:\n    print(f'  {word}: {count}次')",
    "solution": "def word_frequency(text):\n    words = text.split()\n    freq = {}\n    for word in words:\n        freq[word] = freq.get(word, 0) + 1\n    return sorted(freq.items(), key=lambda x: x[1], reverse=True)",
    "testInput": "'人工智能 是 一门 很 有趣 的 学科 人工智能 可以 帮助 人类 解决 很多 问题'",
    "expectedOutput": "[('人工智能',2), ...其余各1次]"
  },
  "268": {
    "id": "268",
    "title": "广度优先搜索（BFS）",
    "category": "搜索算法",
    "difficulty": 4,
    "description": "广度优先搜索（BFS）是一种图搜索算法，从起始节点开始，先访问所有相邻节点，再逐层向外扩展。\n\n给定一个图的邻接表和起始节点，请实现 BFS 函数，返回按访问顺序排列的节点列表。",
    "goals": [
      "理解BFS的层序遍历思想",
      "掌握队列数据结构的使用",
      "学会标记已访问节点",
      "理解BFS在最短路径问题中的应用"
    ],
    "hints": [
      "使用队列（queue）来存储待访问的节点",
      "用一个集合或列表记录已经访问过的节点",
      "每次从队列头部取出一个节点，把它的邻居加入队列尾部",
      "注意不要重复访问同一个节点"
    ],
    "initialCode": "# 请实现广度优先搜索（BFS）\n# 输入：graph是邻接表字典，start是起始节点\n# 输出：按访问顺序的节点列表\n\ndef bfs(graph, start):\n    # 在这里写你的代码\n    pass\n\n# 测试：一个简单的图\ngraph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A', 'F'],\n    'D': ['B'],\n    'E': ['B', 'F'],\n    'F': ['C', 'E']\n}\nresult = bfs(graph, 'A')\nprint('BFS访问顺序:', result)",
    "solution": "def bfs(graph, start):\n    visited = []\n    queue = [start]\n    visited.append(start)\n    while queue:\n        node = queue.pop(0)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.append(neighbor)\n                queue.append(neighbor)\n    return visited",
    "testInput": "graph={'A':['B','C'],'B':['A','D','E'],'C':['A','F'],'D':['B'],'E':['B','F'],'F':['C','E']}, start='A'",
    "expectedOutput": "['A', 'B', 'C', 'D', 'E', 'F']"
  },
  "269": {
    "id": "269",
    "title": "深度优先搜索（DFS）",
    "category": "搜索算法",
    "difficulty": 4,
    "description": "深度优先搜索（DFS）是一种图搜索算法，从起始节点出发，沿着一条路径尽可能深地探索，直到无法继续，然后回溯。\n\n给定一个图的邻接表和起始节点，请实现 DFS 函数，返回按访问顺序排列的节点列表。",
    "goals": [
      "理解DFS的深入探索思想",
      "掌握递归或栈的使用",
      "对比BFS和DFS的区别",
      "理解回溯的概念"
    ],
    "hints": [
      "可以用递归实现，也可以用栈（stack）实现",
      "用一个集合记录已经访问过的节点",
      "访问当前节点后，递归访问第一个未访问的邻居",
      "所有邻居都访问过了就回溯（返回上一层）"
    ],
    "initialCode": "# 请实现深度优先搜索（DFS）\n# 输入：graph是邻接表字典，start是起始节点\n# 输出：按访问顺序的节点列表\n\ndef dfs(graph, start):\n    # 在这里写你的代码\n    pass\n\n# 测试：一个简单的图\ngraph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A', 'F'],\n    'D': ['B'],\n    'E': ['B', 'F'],\n    'F': ['C', 'E']\n}\nresult = dfs(graph, 'A')\nprint('DFS访问顺序:', result)",
    "solution": "def dfs(graph, start):\n    visited = []\n    def helper(node):\n        visited.append(node)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                helper(neighbor)\n    helper(start)\n    return visited",
    "testInput": "graph={'A':['B','C'],'B':['A','D','E'],'C':['A','F'],'D':['B'],'E':['B','F'],'F':['C','E']}, start='A'",
    "expectedOutput": "['A', 'B', 'D', 'E', 'F', 'C']"
  },
  "280": {
    "id": "280",
    "title": "决策树的构建步骤",
    "category": "机器学习",
    "difficulty": 4,
    "description": "决策树通过一系列「是/否」问题来做决策。构建决策树的关键是选择最优划分特征——通常用信息增益来衡量。\n\n请实现一个计算信息熵的函数：给定一个类别列表，计算它的信息熵。",
    "goals": [
      "理解信息熵的概念",
      "掌握熵的计算公式",
      "理解信息增益的意义",
      "为理解决策树构建打基础"
    ],
    "hints": [
      "熵的公式：H = -Σ(p_i * log2(p_i))",
      "p_i 是第 i 类样本占总数的比例",
      "先统计每个类别的数量",
      "用 math.log2() 计算以2为底的对数"
    ],
    "initialCode": "# 请实现信息熵的计算\n# 输入：一个类别列表，如 ['A', 'A', 'B', 'B', 'B']\n# 输出：信息熵的值\nimport math\n\ndef entropy(labels):\n    # 在这里写你的代码\n    pass\n\n# 测试\ndata1 = ['A', 'A', 'B', 'B']  # 均匀分布，熵最大\ndata2 = ['A', 'A', 'A', 'A']  # 全相同，熵为0\nprint('数据1的熵:', entropy(data1))\nprint('数据2的熵:', entropy(data2))",
    "solution": "import math\n\ndef entropy(labels):\n    n = len(labels)\n    if n == 0:\n        return 0\n    count = {}\n    for label in labels:\n        count[label] = count.get(label, 0) + 1\n    result = 0\n    for c in count.values():\n        p = c / n\n        result -= p * math.log2(p)\n    return result",
    "testInput": "['A','A','B','B']",
    "expectedOutput": "1.0"
  },
  "285": {
    "id": "285",
    "title": "线性回归模型",
    "category": "机器学习",
    "difficulty": 3,
    "description": "线性回归是用一条直线来拟合数据点，预测连续值。最简单的实现方法是最小二乘法。\n\n请实现一个简单的线性回归函数：给定x和y的列表，计算斜率w和截距b，使得 y = w*x + b 最好地拟合数据。",
    "goals": [
      "理解线性回归的基本概念",
      "掌握最小二乘法的计算",
      "学会计算均值和协方差",
      "理解误差平方和的意义"
    ],
    "hints": [
      "斜率 w = Σ(x-x̄)(y-ȳ) / Σ(x-x̄)²",
      "截距 b = ȳ - w * x̄",
      "先计算 x 的均值和 y 的均值",
      "分子是x和y的协方差乘以n，分母是x的方差乘以n"
    ],
    "initialCode": "# 请实现线性回归（最小二乘法）\n# 输入：x列表和y列表\n# 输出：(斜率w, 截距b)\n\ndef linear_regression(x, y):\n    # 在这里写你的代码\n    pass\n\n# 测试数据\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 5, 4, 5]\nw, b = linear_regression(x, y)\nprint(f'y = {w:.2f}x + {b:.2f}')\nprint(f'预测 x=6 时，y = {w*6+b:.2f}')",
    "solution": "def linear_regression(x, y):\n    n = len(x)\n    mean_x = sum(x) / n\n    mean_y = sum(y) / n\n    numerator = 0\n    denominator = 0\n    for i in range(n):\n        numerator += (x[i] - mean_x) * (y[i] - mean_y)\n        denominator += (x[i] - mean_x) ** 2\n    w = numerator / denominator\n    b = mean_y - w * mean_x\n    return w, b",
    "testInput": "x=[1,2,3,4,5], y=[2,4,5,4,5]",
    "expectedOutput": "w=0.6, b=2.2"
  },
  "287": {
    "id": "287",
    "title": "k均值聚类算法（K-Means）",
    "category": "机器学习",
    "difficulty": 4,
    "description": "K均值聚类是一种无监督学习算法，把数据分成k个簇。核心思想：随机选k个中心点，反复执行「分配样本到最近中心」和「更新中心点为簇的均值」，直到收敛。\n\n请实现简化版的 K-Means 算法（只做几轮迭代）。",
    "goals": [
      "理解K-Means的聚类思想",
      "掌握距离计算和中心点更新",
      "理解迭代优化的过程",
      "学会处理无标签数据"
    ],
    "hints": [
      "第一步：随机选择k个点作为初始中心点",
      "第二步：把每个点分配给最近的中心点",
      "第三步：重新计算每个簇的中心点（取均值）",
      "重复第二、三步，迭代几次就可以了"
    ],
    "initialCode": "# 请实现k均值聚类算法（K-Means）\n# 输入：data是数据点列表，k是簇的数量，iters是迭代次数\n# 输出：每个数据点的簇标签列表\nimport random\nimport math\n\ndef kmeans(data, k, iters=10):\n    # 在这里写你的代码\n    pass\n\n# 测试数据\npoints = [(1, 1), (2, 1), (1, 2), (8, 8), (9, 8), (8, 9)]\nlabels = kmeans(points, k=2, iters=5)\nprint('聚类结果:', labels)",
    "solution": "import random\nimport math\n\ndef kmeans(data, k, iters=10):\n    # 随机选择k个初始中心点\n    centroids = random.sample(data, k)\n    labels = [0] * len(data)\n    for _ in range(iters):\n        # 分配：每个点到最近的中心\n        for i, point in enumerate(data):\n            min_dist = float('inf')\n            for j, cent in enumerate(centroids):\n                dist = math.sqrt((point[0]-cent[0])**2 + (point[1]-cent[1])**2)\n                if dist < min_dist:\n                    min_dist = dist\n                    labels[i] = j\n        # 更新：重新计算中心点\n        new_centroids = [(0, 0)] * k\n        counts = [0] * k\n        for i, point in enumerate(data):\n            c = labels[i]\n            new_centroids[c] = (new_centroids[c][0] + point[0], new_centroids[c][1] + point[1])\n            counts[c] += 1\n        for j in range(k):\n            if counts[j] > 0:\n                new_centroids[j] = (new_centroids[j][0] / counts[j], new_centroids[j][1] / counts[j])\n        centroids = new_centroids\n    return labels",
    "testInput": "data=[(1,1),(2,1),(1,2),(8,8),(9,8),(8,9)], k=2, iters=5",
    "expectedOutput": "2个簇（前3个一类，后3个一类）"
  },
  "288": {
    "id": "288",
    "title": "k近邻分类算法（KNN）",
    "category": "机器学习",
    "difficulty": 3,
    "description": "K近邻（KNN）是一种简单的分类算法：要判断一个新样本属于哪一类，就看它附近的k个邻居中，哪一类最多。\n\n请实现一个简化版的 KNN 分类器：计算新样本与所有训练样本的距离，取最近的k个邻居投票。",
    "goals": [
      "理解KNN的核心思想",
      "学会计算欧氏距离",
      "掌握投票统计的方法",
      "理解k值对分类结果的影响"
    ],
    "hints": [
      "欧氏距离公式：sqrt((x1-x2)² + (y1-y2)²)",
      "计算新样本到所有训练样本的距离",
      "按距离排序，取前k个最近的邻居",
      "统计k个邻居中哪个类别最多，就是预测结果"
    ],
    "initialCode": "# 请实现k近邻分类算法（KNN）\n# 训练数据：points是点的列表，labels是对应的类别\n# 预测：给定一个新点，返回预测的类别\nimport math\n\ndef knn_predict(train_points, train_labels, new_point, k=3):\n    # 在这里写你的代码\n    pass\n\n# 测试数据（简单的二分类问题）\npoints = [(1, 2), (2, 1), (3, 3), (7, 6), (8, 7), (9, 5)]\nlabels = ['A', 'A', 'A', 'B', 'B', 'B']\n\n# 预测新点\nnew = (5, 4)\nresult = knn_predict(points, labels, new, k=3)\nprint('预测类别:', result)",
    "solution": "import math\n\ndef knn_predict(train_points, train_labels, new_point, k=3):\n    distances = []\n    for i, point in enumerate(train_points):\n        dist = math.sqrt((point[0] - new_point[0])**2 + (point[1] - new_point[1])**2)\n        distances.append((dist, train_labels[i]))\n    distances.sort(key=lambda x: x[0])\n    neighbors = [d[1] for d in distances[:k]]\n    label_count = {}\n    for label in neighbors:\n        label_count[label] = label_count.get(label, 0) + 1\n    return max(label_count, key=label_count.get)",
    "testInput": "points=[(1,2),(2,1),(3,3),(7,6),(8,7),(9,5)], labels=['A','A','A','B','B','B'], new=(5,4), k=3",
    "expectedOutput": "B"
  },
  "292": {
    "id": "292",
    "title": "激活函数：S形函数（Sigmoid）",
    "category": "神经网络",
    "difficulty": 3,
    "description": "Sigmoid 是一种常用的激活函数，它把任意实数压缩到 (0, 1) 之间，公式是：σ(x) = 1 / (1 + e^(-x))\n\n请实现 sigmoid 函数，并计算它的导数（梯度反向传播时需要）。",
    "goals": [
      "理解Sigmoid激活函数的作用",
      "掌握指数函数的使用",
      "学会计算激活函数的导数",
      "理解为什么需要非线性激活函数"
    ],
    "hints": [
      "Sigmoid 公式：1 / (1 + exp(-x))",
      "Sigmoid 的导数很特别：σ'(x) = σ(x) * (1 - σ(x))",
      "用 math.exp() 计算指数",
      "可以写两个函数：sigmoid(x) 和 sigmoid_derivative(x)"
    ],
    "initialCode": "# 请实现 Sigmoid 激活函数及其导数\nimport math\n\ndef sigmoid(x):\n    # 在这里写你的代码\n    pass\n\ndef sigmoid_derivative(x):\n    # 提示：导数 = sigmoid(x) * (1 - sigmoid(x))\n    pass\n\n# 测试\nfor x in [-5, -2, 0, 2, 5]:\n    s = sigmoid(x)\n    d = sigmoid_derivative(x)\n    print(f'sigmoid({x:2d}) = {s:.4f}, 导数 = {d:.4f}')",
    "solution": "import math\n\ndef sigmoid(x):\n    return 1 / (1 + math.exp(-x))\n\ndef sigmoid_derivative(x):\n    s = sigmoid(x)\n    return s * (1 - s)",
    "testInput": "x=0",
    "expectedOutput": "sigmoid(0)=0.5, 导数=0.25"
  },
  "293": {
    "id": "293",
    "title": "单层感知机的结构",
    "category": "神经网络",
    "difficulty": 3,
    "description": "感知机是最简单的人工神经网络，由多个输入和一个输出组成。输入乘以权重后求和，再通过激活函数得到输出。\n\n请实现一个感知机：给定输入向量、权重和偏置，计算输出（使用阶跃激活函数）。",
    "goals": [
      "理解感知机的基本结构",
      "掌握加权求和的计算",
      "学会实现阶跃激活函数",
      "理解权重和偏置的作用"
    ],
    "hints": [
      "输出 = 激活函数(Σ(输入_i × 权重_i) + 偏置)",
      "阶跃函数：总和 >= 0 输出 1，否则输出 0",
      "用循环计算加权和",
      "注意输入和权重的数量要对应"
    ],
    "initialCode": "# 请实现一个单层感知机\n# 输入：inputs是输入列表，weights是权重列表，bias是偏置\n# 输出：0或1（阶跃激活函数）\n\ndef perceptron(inputs, weights, bias):\n    # 在这里写你的代码\n    pass\n\n# 测试：模拟 AND 门\n# AND门：两个输入都为1时输出1\ninputs = [1, 1]\nweights = [0.5, 0.5]\nbias = -0.7\noutput = perceptron(inputs, weights, bias)\nprint(f'输入 {inputs} -> 输出 {output}')",
    "solution": "def perceptron(inputs, weights, bias):\n    total = bias\n    for i in range(len(inputs)):\n        total += inputs[i] * weights[i]\n    return 1 if total >= 0 else 0",
    "testInput": "inputs=[1,1], weights=[0.5,0.5], bias=-0.7",
    "expectedOutput": "1"
  },
  "301": {
    "id": "301",
    "title": "梯度下降法的基本原理",
    "category": "神经网络",
    "difficulty": 4,
    "description": "梯度下降是机器学习中最常用的优化算法：通过不断沿着损失函数的负梯度方向调整参数，来最小化损失。\n\n请实现一个简单的梯度下降：用线性回归 y = w*x 作为例子，优化参数w使得均方误差最小。",
    "goals": [
      "理解梯度下降的核心思想",
      "掌握学习率的作用",
      "学会计算损失函数的梯度",
      "理解迭代优化的过程"
    ],
    "hints": [
      "损失函数（均方误差）：L = (1/n) * Σ(y_pred - y_true)²",
      "对w求导：dL/dw = (2/n) * Σ(y_pred - y_true) * x",
      "更新规则：w = w - learning_rate * dL/dw",
      "循环迭代多次，w会越来越接近最优值"
    ],
    "initialCode": "# 请实现梯度下降优化线性回归参数 w\n# 目标：找到最优的 w，使得 y = w*x 最好拟合数据\n\ndef gradient_descent(x, y, learning_rate=0.01, iters=100):\n    w = 0  # 初始值\n    n = len(x)\n    # 在这里写你的代码（迭代更新w）\n    return w\n\n# 测试：真实关系是 y = 2x\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 6, 8, 10]\nw_optimal = gradient_descent(x, y, learning_rate=0.05, iters=200)\nprint(f'最优 w = {w_optimal:.4f}（真实值是 2.0）')",
    "solution": "def gradient_descent(x, y, learning_rate=0.01, iters=100):\n    w = 0\n    n = len(x)\n    for _ in range(iters):\n        dw = 0\n        for i in range(n):\n            y_pred = w * x[i]\n            error = y_pred - y[i]\n            dw += (2 / n) * error * x[i]\n        w = w - learning_rate * dw\n    return w",
    "testInput": "x=[1,2,3,4,5], y=[2,4,6,8,10], lr=0.05, iters=200",
    "expectedOutput": "w ≈ 2.0"
  },
  "313": {
    "id": "313",
    "title": "卷积运算与卷积核",
    "category": "计算机视觉",
    "difficulty": 4,
    "description": "卷积是 CNN 的核心操作：用一个小的卷积核（滤波器）在图像上滑动，对应位置相乘再求和，得到特征图。\n\n请实现一个简化的 2D 卷积函数：给定一个二维矩阵和一个 3x3 卷积核，输出卷积结果（不填充，步长为1）。",
    "goals": [
      "理解卷积运算的基本原理",
      "掌握二维矩阵的操作",
      "理解卷积核的作用",
      "为学习CNN打基础"
    ],
    "hints": [
      "输出尺寸 = (输入尺寸 - 核尺寸 + 1)，假设不填充、步长1",
      "用双重循环遍历输出的每个位置",
      "对于每个位置，计算对应窗口和卷积核的点积（对应相乘再相加）",
      "注意：输入矩阵和卷积核都是二维列表"
    ],
    "initialCode": "# 请实现 2D 卷积运算（简化版）\n# 输入：image是二维矩阵，kernel是3x3卷积核\n# 输出：卷积后的特征图\n\ndef convolve2d(image, kernel):\n    # 在这里写你的代码\n    pass\n\n# 测试：一个简单的图像和一个边缘检测核\nimage = [\n    [1, 2, 3, 4],\n    [5, 6, 7, 8],\n    [9, 10, 11, 12],\n    [13, 14, 15, 16]\n]\n\n# 简单的均值模糊核\nkernel = [\n    [1/9, 1/9, 1/9],\n    [1/9, 1/9, 1/9],\n    [1/9, 1/9, 1/9]\n]\n\nresult = convolve2d(image, kernel)\nprint('卷积结果:')\nfor row in result:\n    print([round(x, 1) for x in row])",
    "solution": "def convolve2d(image, kernel):\n    h = len(image)\n    w = len(image[0])\n    kh = len(kernel)\n    kw = len(kernel[0])\n    out_h = h - kh + 1\n    out_w = w - kw + 1\n    output = []\n    for i in range(out_h):\n        row = []\n        for j in range(out_w):\n            total = 0\n            for di in range(kh):\n                for dj in range(kw):\n                    total += image[i + di][j + dj] * kernel[di][dj]\n            row.append(total)\n        output.append(row)\n    return output",
    "testInput": "4x4图像, 3x3均值核",
    "expectedOutput": "2x2矩阵，值约为[[6,7],[10,11]]"
  },
  "328": {
    "id": "328",
    "title": "GAN的结构：生成器与判别器",
    "category": "生成式AI",
    "difficulty": 5,
    "description": "生成对抗网络（GAN）由生成器和判别器组成：生成器试图生成逼真的数据，判别器试图区分真假数据，两者相互博弈、共同进步。\n\n请用简单的数字模拟 GAN 的对抗训练过程：生成器生成数字，判别器判断真假。",
    "goals": [
      "理解GAN的对抗思想",
      "掌握生成器和判别器的角色",
      "理解博弈过程",
      "体会纳什均衡的概念"
    ],
    "hints": [
      "生成器：从随机数开始，逐渐生成更接近真实值的数",
      "判别器：学习区分真实数据和生成数据",
      "交替训练：先训练判别器，再训练生成器",
      "可以用简单的数值来模拟这个过程"
    ],
    "initialCode": "# 请用数值模拟 GAN 的对抗训练过程\n# 真实数据的均值是 5.0\n# 生成器从随机值开始，逐渐接近真实值\n# 判别器学习区分真假\n\ndef train_gan(real_mean=5.0, iters=20):\n    gen_value = 0.0  # 生成器初始输出\n    disc_threshold = 2.5  # 判别器的判断阈值\n    \n    history = []\n    for i in range(iters):\n        # 在这里写你的代码\n        # 1. 判别器判断：离真实值越近越难分辨\n        # 2. 生成器更新：朝真实值方向调整\n        pass\n    return history\n\n# 运行训练\nprint('GAN 对抗训练模拟')\nprint('=' * 40)\nhistory = train_gan(iters=15)\nfor gen, disc in history:\n    print(f'生成器输出: {gen:.2f}, 判别器阈值: {disc:.2f}')",
    "solution": "def train_gan(real_mean=5.0, iters=20):\n    gen_value = 0.0\n    disc_threshold = 2.5\n    history = []\n    for i in range(iters):\n        # 判别器训练：阈值逐渐提高，越来越难骗过\n        disc_threshold = real_mean - (real_mean - gen_value) * 0.5\n        # 生成器训练：朝真实值方向靠近\n        gen_value += (real_mean - gen_value) * 0.3\n        history.append((gen_value, disc_threshold))\n    return history",
    "testInput": "iters=15",
    "expectedOutput": "生成器输出逐渐接近5.0"
  },
  "339": {
    "id": "339",
    "title": "冒泡排序",
    "category": "排序算法",
    "difficulty": 2,
    "description": "冒泡排序是最基础的排序算法之一。它重复地遍历要排序的数列，一次比较两个元素，如果它们的顺序错误就把它们交换过来。\n\n请实现一个 bubble_sort 函数，接收一个列表，返回从小到大排序后的新列表。",
    "goals": [
      "理解冒泡排序的核心思想",
      "掌握嵌套循环的使用",
      "学会比较和交换元素",
      "理解算法的时间复杂度"
    ],
    "hints": [
      "外层循环控制排序的轮数，共需要 len(arr)-1 轮",
      "内层循环负责相邻元素的比较和交换",
      "如果前一个元素大于后一个，就交换它们的位置",
      "每一轮结束后，最大的元素会'冒泡'到最后面"
    ],
    "initialCode": "# 请实现冒泡排序函数\n# 输入：一个数字列表，如 [5, 2, 8, 1, 9]\n# 输出：排序后的新列表\n\ndef bubble_sort(arr):\n    # 在这里写你的代码\n    pass\n\n# 测试\nnumbers = [5, 2, 8, 1, 9, 3]\nresult = bubble_sort(numbers)\nprint('排序结果:', result)",
    "solution": "def bubble_sort(arr):\n    result = arr.copy()\n    n = len(result)\n    for i in range(n - 1):\n        for j in range(n - 1 - i):\n            if result[j] > result[j + 1]:\n                result[j], result[j + 1] = result[j + 1], result[j]\n    return result",
    "testInput": "[5, 2, 8, 1, 9, 3]",
    "expectedOutput": "[1, 2, 3, 5, 8, 9]"
  },
  "340": {
    "id": "340",
    "title": "选择排序",
    "category": "排序算法",
    "difficulty": 2,
    "description": "选择排序的工作原理是：每一次从待排序的数据元素中选出最小的一个元素，存放在序列的起始位置，直到全部待排序的数据元素排完。\n\n请实现一个 selection_sort 函数，接收一个列表，返回从小到大排序后的新列表。",
    "goals": [
      "理解选择排序的核心思想",
      "学会寻找列表中的最小值",
      "掌握元素交换操作",
      "对比冒泡排序和选择排序的异同"
    ],
    "hints": [
      "外层循环遍历每个位置 i，表示要放第 i 小的元素",
      "内层循环从 i 开始找剩余元素中最小值的索引",
      "找到最小值后，和第 i 个位置的元素交换",
      "注意：要操作列表的副本，不要修改原列表"
    ],
    "initialCode": "# 请实现选择排序函数\n# 输入：一个数字列表\n# 输出：排序后的新列表\n\ndef selection_sort(arr):\n    # 在这里写你的代码\n    pass\n\n# 测试\nnumbers = [64, 25, 12, 22, 11]\nresult = selection_sort(numbers)\nprint('排序结果:', result)",
    "solution": "def selection_sort(arr):\n    result = arr.copy()\n    n = len(result)\n    for i in range(n):\n        min_idx = i\n        for j in range(i + 1, n):\n            if result[j] < result[min_idx]:\n                min_idx = j\n        result[i], result[min_idx] = result[min_idx], result[i]\n    return result",
    "testInput": "[64, 25, 12, 22, 11]",
    "expectedOutput": "[11, 12, 22, 25, 64]"
  }
};
