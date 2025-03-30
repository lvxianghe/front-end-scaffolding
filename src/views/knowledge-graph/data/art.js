export const artDomain = {
  title: '文学艺术知识图谱',
  categories: [
    {
      name: '文学流派',
      itemStyle: { color: '#722ed1' }
    },
    {
      name: '艺术门类',
      itemStyle: { color: '#1890ff' }
    },
    {
      name: '代表人物',
      itemStyle: { color: '#f5222d' }
    },
    {
      name: '代表作品',
      itemStyle: { color: '#fa8c16' }
    },
    {
      name: '时期/运动',
      itemStyle: { color: '#52c41a' }
    }
  ],
  nodes: [
    {
      id: 'literature',
      name: '文学',
      category: 1,
      symbolSize: 60,
      description: '文学是以语言文字为媒介，反映社会生活，表达思想感情的艺术。',
      properties: {
        定义: '以语言文字为表现手段的艺术',
        主要形式: '诗歌、小说、戏剧、散文',
        功能: '审美、认知、教育、娱乐'
      }
    },
    {
      id: 'visual_art',
      name: '视觉艺术',
      category: 1,
      symbolSize: 60,
      description: '视觉艺术是通过视觉表达的艺术形式，包括绘画、雕塑、摄影等。',
      properties: {
        定义: '以视觉感官为主要接收方式的艺术',
        主要形式: '绘画、雕塑、摄影、建筑',
        特点: '视觉美感、空间性、物质性'
      }
    },
    {
      id: 'performing_art',
      name: '表演艺术',
      category: 1,
      symbolSize: 60,
      description: '表演艺术是以演出形式呈现的艺术，包括音乐、舞蹈、戏剧等。',
      properties: {
        定义: '以表演形式呈现的艺术',
        主要形式: '音乐、舞蹈、戏剧、歌剧',
        特点: '时间性、过程性、现场性'
      }
    },
    {
      id: 'poetry',
      name: '诗歌',
      category: 1,
      symbolSize: 45,
      description: '诗歌是文学的一种体裁，以凝练的语言、丰富的意象和韵律表达情感和思想。',
      properties: {
        特点: '语言凝练、意象丰富、节奏感强',
        主要形式: '抒情诗、叙事诗、史诗、现代自由诗',
        代表人物: '荷马、李白、莎士比亚、波德莱尔'
      }
    },
    {
      id: 'novel',
      name: '小说',
      category: 1,
      symbolSize: 50,
      description: '小说是一种散文形式的叙事文学，通过塑造人物、编织情节来反映社会生活。',
      properties: {
        特点: '人物形象、情节结构、环境描写',
        分类: '长篇小说、中篇小说、短篇小说',
        代表人物: '塞万提斯、托尔斯泰、鲁迅、马尔克斯'
      }
    },
    {
      id: 'drama',
      name: '戏剧',
      category: 1,
      symbolSize: 45,
      description: '戏剧是一种表演艺术，通过演员在舞台上的表演来展现故事和冲突。',
      properties: {
        特点: '舞台性、表演性、冲突性',
        分类: '悲剧、喜剧、正剧、闹剧',
        代表人物: '埃斯库罗斯、莎士比亚、契诃夫、曹禺'
      }
    },
    {
      id: 'painting',
      name: '绘画',
      category: 1,
      symbolSize: 50,
      description: '绘画是一种视觉艺术，通过在平面上使用颜料创作图像。',
      properties: {
        媒介: '油画、水彩、素描、国画',
        元素: '线条、色彩、构图、光影',
        流派: '古典主义、印象派、抽象派、超现实主义'
      }
    },
    {
      id: 'music',
      name: '音乐',
      category: 1,
      symbolSize: 50,
      description: '音乐是通过有组织的声音和节奏表达情感和思想的艺术。',
      properties: {
        元素: '旋律、和声、节奏、音色',
        形式: '交响乐、室内乐、歌曲、歌剧',
        风格: '古典音乐、爵士乐、摇滚乐、民族音乐'
      }
    },
    {
      id: 'realism',
      name: '现实主义',
      category: 0,
      symbolSize: 45,
      description: '现实主义是一种强调客观描写现实世界的文学艺术流派。',
      properties: {
        时期: '19世纪中后期',
        特点: '客观反映社会现实、细致描写典型环境中的典型人物',
        代表人物: '巴尔扎克、托尔斯泰、福楼拜、狄更斯'
      }
    },
    {
      id: 'romanticism',
      name: '浪漫主义',
      category: 0,
      symbolSize: 45,
      description: '浪漫主义是强调个人情感、想象力和主观表达的文学艺术流派。',
      properties: {
        时期: '18世纪末至19世纪中期',
        特点: '重视情感表达、崇尚自然、追求自由',
        代表人物: '雨果、拜伦、歌德、柏辽兹'
      }
    },
    {
      id: 'modernism',
      name: '现代主义',
      category: 0,
      symbolSize: 45,
      description: '现代主义是一种打破传统形式、探索新表达方式的文学艺术流派。',
      properties: {
        时期: '19世纪末至20世纪中期',
        特点: '意识流、象征主义、打破传统形式',
        代表人物: '乔伊斯、卡夫卡、毕加索、肖斯塔科维奇'
      }
    },
    {
      id: 'shakespeare',
      name: '威廉·莎士比亚',
      category: 2,
      symbolSize: 50,
      description: '威廉·莎士比亚是英国文艺复兴时期著名的戏剧家和诗人，被誉为"英国国民诗人"。',
      properties: {
        生卒年: '1564年-1616年',
        代表作品: '《哈姆雷特》、《罗密欧与朱丽叶》、《麦克白》',
        影响: '对英语语言和世界文学产生了深远影响',
        成就: '创作了至少38部戏剧和154首十四行诗'
      }
    },
    {
      id: 'tolstoy',
      name: '列夫·托尔斯泰',
      category: 2,
      symbolSize: 45,
      description: '列夫·托尔斯泰是19世纪俄国著名作家，现实主义文学的代表人物。',
      properties: {
        生卒年: '1828年-1910年',
        代表作品: '《战争与和平》、《安娜·卡列尼娜》、《复活》',
        思想: '道德哲学、非暴力抵抗、简朴生活',
        影响: '对世界文学和道德哲学产生重大影响'
      }
    },
    {
      id: 'picasso',
      name: '巴勃罗·毕加索',
      category: 2,
      symbolSize: 45,
      description: '巴勃罗·毕加索是20世纪最具影响力的艺术家之一，立体主义运动的创始人之一。',
      properties: {
        生卒年: '1881年-1973年',
        代表作品: '《亚维农少女》、《格尔尼卡》、《和平鸽》',
        艺术风格: '蓝色时期、粉色时期、立体主义、超现实主义',
        影响: '彻底改变了20世纪视觉艺术的发展方向'
      }
    },
    {
      id: 'beethoven',
      name: '路德维希·范·贝多芬',
      category: 2,
      symbolSize: 45,
      description: '路德维希·范·贝多芬是德国著名作曲家，古典音乐的代表人物，也是沟通古典主义和浪漫主义的关键人物。',
      properties: {
        生卒年: '1770年-1827年',
        代表作品: '《第五交响曲》、《月光奏鸣曲》、《第九交响曲》',
        成就: '创作了9部交响曲、32首钢琴奏鸣曲、16首弦乐四重奏',
        特点: '在聋病情况下仍创作出不朽音乐作品'
      }
    },
    {
      id: 'lu_xun',
      name: '鲁迅',
      category: 2,
      symbolSize: 45,
      description: '鲁迅是中国现代文学的奠基人，思想家、文学家、翻译家。',
      properties: {
        生卒年: '1881年-1936年',
        代表作品: '《狂人日记》、《阿Q正传》、《呐喊》',
        成就: '创立了中国现代小说的基本格式和语言风格',
        影响: '对中国现代文学和思想启蒙运动产生深远影响'
      }
    },
    {
      id: 'hamlet',
      name: '哈姆雷特',
      category: 3,
      symbolSize: 40,
      description: '《哈姆雷特》是莎士比亚创作的悲剧，讲述了丹麦王子哈姆雷特为父报仇的故事。',
      properties: {
        创作时间: '约1600年',
        类型: '悲剧',
        主题: '复仇、犹豫、死亡、政治腐败',
        名言: '"生存还是毁灭，这是一个问题"'
      }
    },
    {
      id: 'war_and_peace',
      name: '战争与和平',
      category: 3,
      symbolSize: 40,
      description: '《战争与和平》是托尔斯泰创作的长篇小说，描述了拿破仑战争期间俄国社会的全景。',
      properties: {
        创作时间: '1865年-1869年',
        类型: '历史小说、哲理小说',
        主题: '战争、和平、历史、自由意志、家庭',
        特点: '宏大叙事、细腻心理描写、历史哲学思考'
      }
    },
    {
      id: 'guernica',
      name: '格尔尼卡',
      category: 3,
      symbolSize: 40,
      description: '《格尔尼卡》是毕加索创作的大型壁画，表现了西班牙内战中格尔尼卡镇被轰炸的惨状。',
      properties: {
        创作时间: '1937年',
        尺寸: '349.3 cm × 776.6 cm',
        风格: '立体主义、超现实主义',
        主题: '战争的残酷、和平呼吁'
      }
    },
    {
      id: 'ninth_symphony',
      name: '第九交响曲',
      category: 3,
      symbolSize: 40,
      description: '《第九交响曲》是贝多芬的最后一部交响曲，最后乐章加入了合唱，演唱席勒的《欢乐颂》。',
      properties: {
        创作时间: '1824年',
        结构: '四个乐章，最后一个乐章有合唱',
        特点: '首次在交响曲中引入人声合唱',
        影响: '欧盟将其最后乐章选为欧盟盟歌'
      }
    },
    {
      id: 'renaissance',
      name: '文艺复兴',
      category: 4,
      symbolSize: 50,
      description: '文艺复兴是14-17世纪欧洲的文化运动，以对古典文化的复兴和人文主义的发展为特征。',
      properties: {
        时期: '14世纪至17世纪',
        起源: '意大利佛罗伦萨',
        特点: '人文主义思想、古典文化复兴、科学探索',
        代表人物: '达芬奇、米开朗基罗、莎士比亚、拉斐尔'
      }
    },
    {
      id: 'enlightenment',
      name: '启蒙运动',
      category: 4,
      symbolSize: 45,
      description: '启蒙运动是17-18世纪欧洲的思想运动，强调理性、科学和个人自由。',
      properties: {
        时期: '17世纪末至18世纪',
        核心理念: '理性、自由、平等、宽容',
        影响: '促进科学发展、影响政治革命、推动宗教宽容',
        代表人物: '伏尔泰、卢梭、孟德斯鸠、康德'
      }
    },
    {
      id: 'may_fourth',
      name: '五四运动',
      category: 4,
      symbolSize: 45,
      description: '五四运动是1919年在中国发生的学生爱国运动，也是一场伟大的思想解放和文化革新运动。',
      properties: {
        时间: '1919年5月4日开始',
        背景: '一战后巴黎和会中国外交失败',
        特点: '反帝反封建、提倡科学民主',
        影响: '促进新文化运动、白话文运动、思想启蒙'
      }
    },
    {
      id: 'impressionism',
      name: '印象派',
      category: 0,
      symbolSize: 40,
      description: '印象派是19世纪末兴起于法国的绘画流派，以捕捉光线和色彩的瞬间印象为特点。',
      properties: {
        时期: '1870年代至1880年代',
        特点: '户外写生、捕捉光线变化、短促笔触',
        代表人物: '莫奈、雷诺阿、德加、毕沙罗',
        影响: '开创了现代艺术的先河'
      }
    },
    {
      id: 'classical_music',
      name: '古典主义音乐',
      category: 0,
      symbolSize: 40,
      description: '古典主义音乐是18世纪中期至19世纪初期的西方音乐风格，强调形式美、均衡与清晰。',
      properties: {
        时期: '1750年至1820年',
        特点: '形式均衡、结构清晰、主题鲜明',
        代表人物: '海顿、莫扎特、贝多芬',
        主要形式: '奏鸣曲、交响曲、协奏曲、弦乐四重奏'
      }
    }
  ],
  links: [
    { source: 'literature', target: 'poetry', value: '包含' },
    { source: 'literature', target: 'novel', value: '包含' },
    { source: 'literature', target: 'drama', value: '包含' },
    { source: 'visual_art', target: 'painting', value: '包含' },
    { source: 'performing_art', target: 'music', value: '包含' },
    { source: 'performing_art', target: 'drama', value: '包含' },
    
    { source: 'realism', target: 'novel', value: '风格' },
    { source: 'realism', target: 'tolstoy', value: '代表人物' },
    { source: 'romanticism', target: 'poetry', value: '风格' },
    { source: 'romanticism', target: 'music', value: '风格' },
    { source: 'modernism', target: 'painting', value: '风格' },
    { source: 'modernism', target: 'picasso', value: '代表人物' },
    { source: 'impressionism', target: 'painting', value: '风格' },
    { source: 'classical_music', target: 'music', value: '风格' },
    { source: 'classical_music', target: 'beethoven', value: '代表人物' },
    
    { source: 'shakespeare', target: 'drama', value: '创作' },
    { source: 'shakespeare', target: 'hamlet', value: '作品' },
    { source: 'shakespeare', target: 'renaissance', value: '时期' },
    { source: 'tolstoy', target: 'novel', value: '创作' },
    { source: 'tolstoy', target: 'realism', value: '流派' },
    { source: 'tolstoy', target: 'war_and_peace', value: '作品' },
    { source: 'picasso', target: 'painting', value: '创作' },
    { source: 'picasso', target: 'modernism', value: '流派' },
    { source: 'picasso', target: 'guernica', value: '作品' },
    { source: 'beethoven', target: 'music', value: '创作' },
    { source: 'beethoven', target: 'ninth_symphony', value: '作品' },
    { source: 'beethoven', target: 'classical_music', value: '流派' },
    { source: 'beethoven', target: 'romanticism', value: '过渡' },
    { source: 'lu_xun', target: 'novel', value: '创作' },
    { source: 'lu_xun', target: 'may_fourth', value: '参与' },
    
    { source: 'renaissance', target: 'enlightenment', value: '影响' },
    { source: 'enlightenment', target: 'realism', value: '思想基础' },
    { source: 'may_fourth', target: 'lu_xun', value: '代表人物' },
    
    { source: 'hamlet', target: 'drama', value: '类型' },
    { source: 'war_and_peace', target: 'novel', value: '类型' },
    { source: 'guernica', target: 'painting', value: '类型' },
    { source: 'ninth_symphony', target: 'music', value: '类型' },
    
    { source: 'renaissance', target: 'literature', value: '发展' },
    { source: 'renaissance', target: 'visual_art', value: '发展' },
    { source: 'enlightenment', target: 'literature', value: '影响' },
    { source: 'may_fourth', target: 'literature', value: '革新' },
    
    { source: 'modernism', target: 'impressionism', value: '发展' }
  ]
} 