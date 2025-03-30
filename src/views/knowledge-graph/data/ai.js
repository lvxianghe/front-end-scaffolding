export const aiDomain = {
  title: '人工智能知识图谱',
  categories: [
    {
      name: '核心技术',
      itemStyle: { color: '#1890ff' }
    },
    {
      name: '算法',
      itemStyle: { color: '#ff7a45' }
    },
    {
      name: '应用领域',
      itemStyle: { color: '#52c41a' }
    },
    {
      name: '基础理论',
      itemStyle: { color: '#722ed1' }
    },
    {
      name: '模型',
      itemStyle: { color: '#eb2f96' }
    },
    {
      name: '公司/组织',
      itemStyle: { color: '#faad14' }
    }
  ],
  nodes: [
    {
      id: 'ai',
      name: '人工智能',
      category: 0,
      symbolSize: 70,
      description: '人工智能是计算机科学的一个分支，它企图了解智能的实质，并生产出一种新的能以人类智能相似的方式做出反应的智能机器。',
      properties: {
        创立时间: '1956年',
        核心目标: '创造表现出与人类智能相似行为的机器',
        发展阶段: '从符号主义到连接主义，再到当今的深度学习时代'
      }
    },
    {
      id: 'ml',
      name: '机器学习',
      category: 0,
      symbolSize: 60,
      description: '机器学习是人工智能的一个分支，它使用统计学方法使计算机系统利用经验自动改进。',
      properties: {
        定义: '通过数据和经验自动改进算法性能的研究',
        主要类型: '监督学习、无监督学习、强化学习',
        代表技术: '决策树、支持向量机、神经网络等'
      }
    },
    {
      id: 'dl',
      name: '深度学习',
      category: 0,
      symbolSize: 60,
      description: '深度学习是机器学习的分支，使用多层神经网络模型实现特征自动提取和复杂问题建模。',
      properties: {
        定义: '基于深层神经网络的机器学习技术',
        特点: '多层次特征提取，端到端学习',
        关键技术: '反向传播算法、GPU加速、大规模数据训练'
      }
    },
    {
      id: 'nlp',
      name: '自然语言处理',
      category: 0,
      symbolSize: 55,
      description: '自然语言处理是人工智能的一个重要方向，研究如何使计算机理解和生成人类语言。',
      properties: {
        应用: '机器翻译、情感分析、问答系统',
        关键技术: '词向量、注意力机制、Transformer架构',
        挑战: '语义理解、常识推理、多语言处理'
      }
    },
    {
      id: 'cv',
      name: '计算机视觉',
      category: 0,
      symbolSize: 55,
      description: '计算机视觉是一门研究如何使机器"看"的科学，让计算机能够从图像或视频中获取信息。',
      properties: {
        应用: '图像识别、目标检测、图像分割',
        关键技术: '卷积神经网络、图像处理、目标追踪',
        挑战: '场景理解、低光照环境、实时处理'
      }
    },
    {
      id: 'rl',
      name: '强化学习',
      category: 1,
      symbolSize: 50,
      description: '强化学习是一种通过与环境交互来学习最优行为策略的机器学习方法。',
      properties: {
        核心概念: '智能体、环境、状态、行动、奖励',
        代表算法: 'Q-learning、策略梯度、DQN、PPO',
        应用: '游戏AI、机器人控制、推荐系统'
      }
    },
    {
      id: 'cnn',
      name: '卷积神经网络',
      category: 4,
      symbolSize: 50,
      description: '卷积神经网络是一种专门用于处理具有网格结构的数据（如图像）的深度神经网络。',
      properties: {
        主要组件: '卷积层、池化层、全连接层',
        特点: '局部连接、权重共享、平移不变性',
        代表模型: 'LeNet、AlexNet、VGG、ResNet'
      }
    },
    {
      id: 'rnn',
      name: '循环神经网络',
      category: 4,
      symbolSize: 50,
      description: '循环神经网络是一种能够处理序列数据的神经网络类型，广泛应用于自然语言处理。',
      properties: {
        特点: '序列处理、状态保持、时序建模',
        变种: 'LSTM、GRU、双向RNN',
        应用: '语言模型、机器翻译、语音识别'
      }
    },
    {
      id: 'transformer',
      name: 'Transformer',
      category: 4,
      symbolSize: 55,
      description: 'Transformer是一种基于自注意力机制的神经网络架构，已成为NLP领域的主流模型。',
      properties: {
        核心机制: '自注意力、多头注意力',
        优势: '并行计算、长距离依赖建模',
        影响: '引发了预训练语言模型革命'
      }
    },
    {
      id: 'llm',
      name: '大语言模型',
      category: 4,
      symbolSize: 60,
      description: '大语言模型是一类拥有数十亿到数千亿参数的大规模语言模型，能够理解和生成人类语言。',
      properties: {
        代表模型: 'GPT系列、LLaMA、Claude',
        训练方法: '预训练+微调、指令调优、RLHF',
        应用: '对话系统、内容创作、代码生成'
      }
    },
    {
      id: 'openai',
      name: 'OpenAI',
      category: 5,
      symbolSize: 50,
      description: 'OpenAI是一家领先的AI研究实验室，致力于确保通用人工智能造福全人类。',
      properties: {
        成立时间: '2015年',
        代表产品: 'GPT系列、DALL-E、Codex',
        创始人: 'Sam Altman、Elon Musk等'
      }
    },
    {
      id: 'google_ai',
      name: 'Google AI',
      category: 5,
      symbolSize: 50,
      description: 'Google AI是谷歌公司的人工智能研究部门，开发了多项前沿AI技术和产品。',
      properties: {
        代表产品: 'Gemini、Bard、TensorFlow',
        研究方向: '大语言模型、多模态AI、医疗AI',
        核心实验室: 'Google Brain、DeepMind'
      }
    },
    {
      id: 'supervised',
      name: '监督学习',
      category: 1,
      symbolSize: 45,
      description: '监督学习是一种机器学习范式，根据标记的训练数据学习输入到输出的映射。',
      properties: {
        数据特点: '有标注的训练数据',
        算法类型: '分类算法、回归算法',
        应用: '图像识别、垃圾邮件过滤、疾病诊断'
      }
    },
    {
      id: 'unsupervised',
      name: '无监督学习',
      category: 1,
      symbolSize: 45,
      description: '无监督学习是一种机器学习范式，从无标记的数据中发现模式和结构。',
      properties: {
        数据特点: '无标注的训练数据',
        算法类型: '聚类算法、降维算法',
        应用: '客户细分、异常检测、特征学习'
      }
    },
    {
      id: 'gan',
      name: '生成对抗网络',
      category: 4,
      symbolSize: 45,
      description: '生成对抗网络是一种深度学习框架，使用两个神经网络（生成器和判别器）相互竞争学习。',
      properties: {
        提出者: 'Ian Goodfellow',
        提出时间: '2014年',
        应用: '图像生成、风格迁移、数据增强'
      }
    },
    {
      id: 'robotics',
      name: '机器人学',
      category: 2,
      symbolSize: 45,
      description: '机器人学是研究设计、制造和应用机器人的学科，结合了人工智能和工程学。',
      properties: {
        研究内容: '机器人控制、感知、规划',
        应用领域: '工业自动化、服务机器人、医疗机器人',
        关键技术: '传感器融合、路径规划、操作控制'
      }
    },
    {
      id: 'self_driving',
      name: '自动驾驶',
      category: 2,
      symbolSize: 50,
      description: '自动驾驶是人工智能的重要应用领域，旨在开发能够自主行驶的车辆系统。',
      properties: {
        关键技术: '计算机视觉、传感器融合、决策控制',
        挑战: '安全性、复杂环境适应、法律法规',
        分级: 'L1辅助驾驶到L5完全自动驾驶'
      }
    },
    {
      id: 'healthcare',
      name: '医疗健康',
      category: 2,
      symbolSize: 50,
      description: 'AI在医疗健康领域的应用，包括疾病诊断、药物研发、个性化治疗等。',
      properties: {
        应用方向: '医学影像分析、疾病预测、药物发现',
        代表案例: 'AlphaFold、医学影像诊断系统',
        伦理考量: '隐私保护、算法透明度、责任归属'
      }
    },
    {
      id: 'prob_theory',
      name: '概率论',
      category: 3,
      symbolSize: 40,
      description: '概率论是研究随机现象统计规律的数学分支，是机器学习的重要理论基础。',
      properties: {
        核心概念: '随机变量、概率分布、条件概率',
        应用: '贝叶斯网络、隐马尔可夫模型、概率图模型',
        意义: '为不确定性推理提供数学工具'
      }
    },
    {
      id: 'statistics',
      name: '统计学',
      category: 3,
      symbolSize: 40,
      description: '统计学是收集、分析、解释和呈现数据的科学，是机器学习的重要基础。',
      properties: {
        主要方法: '描述统计、推断统计',
        应用: '假设检验、回归分析、方差分析',
        与AI关系: '为数据分析和模型评估提供工具'
      }
    },
    {
      id: 'transfer_learning',
      name: '迁移学习',
      category: 1,
      symbolSize: 45,
      description: '迁移学习是机器学习的一种方法，利用已有领域的知识来提高新领域的学习效率。',
      properties: {
        类型: '领域自适应、多任务学习、零样本学习',
        优势: '减少数据需求、加速收敛、提高性能',
        应用: '计算机视觉、自然语言处理、推荐系统'
      }
    }
  ],
  links: [
    { source: 'ai', target: 'ml', value: '包含' },
    { source: 'ml', target: 'dl', value: '包含' },
    { source: 'ai', target: 'nlp', value: '研究方向' },
    { source: 'ai', target: 'cv', value: '研究方向' },
    { source: 'ml', target: 'supervised', value: '包含' },
    { source: 'ml', target: 'unsupervised', value: '包含' },
    { source: 'ml', target: 'rl', value: '包含' },
    { source: 'dl', target: 'cnn', value: '技术' },
    { source: 'dl', target: 'rnn', value: '技术' },
    { source: 'dl', target: 'transformer', value: '技术' },
    { source: 'dl', target: 'gan', value: '技术' },
    { source: 'nlp', target: 'transformer', value: '应用' },
    { source: 'nlp', target: 'llm', value: '技术发展' },
    { source: 'cv', target: 'cnn', value: '应用' },
    { source: 'openai', target: 'llm', value: '研发' },
    { source: 'google_ai', target: 'llm', value: '研发' },
    { source: 'ai', target: 'robotics', value: '应用' },
    { source: 'ai', target: 'self_driving', value: '应用' },
    { source: 'ai', target: 'healthcare', value: '应用' },
    { source: 'prob_theory', target: 'ml', value: '理论基础' },
    { source: 'statistics', target: 'ml', value: '理论基础' },
    { source: 'ml', target: 'transfer_learning', value: '包含' },
    { source: 'cv', target: 'self_driving', value: '应用于' },
    { source: 'rl', target: 'robotics', value: '应用于' },
    { source: 'transformer', target: 'llm', value: '架构基础' },
    { source: 'llm', target: 'healthcare', value: '应用于' },
    { source: 'transfer_learning', target: 'healthcare', value: '应用于' },
    { source: 'gan', target: 'cv', value: '应用于' }
  ]
} 