export const historyDomain = {
  title: '中国历史知识图谱',
  categories: [
    {
      name: '朝代',
      itemStyle: { color: '#c41d7f' }
    },
    {
      name: '人物',
      itemStyle: { color: '#1890ff' }
    },
    {
      name: '事件',
      itemStyle: { color: '#fa8c16' }
    },
    {
      name: '文化',
      itemStyle: { color: '#52c41a' }
    },
    {
      name: '地点',
      itemStyle: { color: '#722ed1' }
    }
  ],
  nodes: [
    {
      id: 'ancient_china',
      name: '中国古代史',
      category: 0,
      symbolSize: 70,
      description: '中国古代史是指从公元前2100年夏朝建立到1840年鸦片战争爆发前的历史时期。',
      properties: {
        起止时间: '公元前2100年-1840年',
        主要特点: '封建社会、皇权专制、农耕文明',
        历史意义: '形成了独特的中华文明体系'
      }
    },
    {
      id: 'xia',
      name: '夏朝',
      category: 0,
      symbolSize: 50,
      description: '夏朝是中国历史上第一个世袭制朝代，由禹建立。',
      properties: {
        建立时间: '约公元前2070年',
        结束时间: '约公元前1600年',
        代表人物: '禹、启、桀',
        都城: '阳城'
      }
    },
    {
      id: 'shang',
      name: '商朝',
      category: 0,
      symbolSize: 50,
      description: '商朝是中国历史上第二个世袭制朝代，以甲骨文和青铜器闻名。',
      properties: {
        建立时间: '约公元前1600年',
        结束时间: '约公元前1046年',
        代表人物: '汤、盘庚、帝辛',
        都城: '殷（今河南安阳）'
      }
    },
    {
      id: 'zhou',
      name: '周朝',
      category: 0,
      symbolSize: 55,
      description: '周朝是中国历史上最长的朝代，分为西周和东周两个时期。',
      properties: {
        建立时间: '约公元前1046年',
        结束时间: '公元前256年',
        代表人物: '周文王、周武王、周公',
        都城: '镐京、洛邑'
      }
    },
    {
      id: 'qin',
      name: '秦朝',
      category: 0,
      symbolSize: 50,
      description: '秦朝是中国历史上第一个统一的多民族中央集权国家，由秦始皇建立。',
      properties: {
        建立时间: '公元前221年',
        结束时间: '公元前207年',
        代表人物: '秦始皇、李斯',
        都城: '咸阳'
      }
    },
    {
      id: 'han',
      name: '汉朝',
      category: 0,
      symbolSize: 60,
      description: '汉朝是中国历史上继秦朝之后的大一统王朝，分为西汉和东汉两个时期。',
      properties: {
        建立时间: '公元前202年',
        结束时间: '公元220年',
        代表人物: '刘邦、汉武帝、王莽',
        都城: '长安、洛阳'
      }
    },
    {
      id: 'tang',
      name: '唐朝',
      category: 0,
      symbolSize: 60,
      description: '唐朝是中国历史上最强盛的时期之一，文化、经济、政治等方面都达到巅峰。',
      properties: {
        建立时间: '公元618年',
        结束时间: '公元907年',
        代表人物: '李渊、李世民、武则天',
        都城: '长安'
      }
    },
    {
      id: 'song',
      name: '宋朝',
      category: 0,
      symbolSize: 55,
      description: '宋朝是中国历史上经济、科技、文化高度发展的朝代，分为北宋和南宋两个时期。',
      properties: {
        建立时间: '公元960年',
        结束时间: '公元1279年',
        代表人物: '赵匡胤、赵光义、岳飞',
        都城: '开封、临安'
      }
    },
    {
      id: 'yuan',
      name: '元朝',
      category: 0,
      symbolSize: 50,
      description: '元朝是中国历史上第一个由少数民族建立的大一统王朝，由成吉思汗的孙子忽必烈建立。',
      properties: {
        建立时间: '公元1271年',
        结束时间: '公元1368年',
        代表人物: '忽必烈、元世祖',
        都城: '大都（今北京）'
      }
    },
    {
      id: 'ming',
      name: '明朝',
      category: 0,
      symbolSize: 55,
      description: '明朝是中国历史上最后一个由汉族建立的大一统王朝，由朱元璋建立。',
      properties: {
        建立时间: '公元1368年',
        结束时间: '公元1644年',
        代表人物: '朱元璋、朱棣、戚继光',
        都城: '南京、北京'
      }
    },
    {
      id: 'qing',
      name: '清朝',
      category: 0,
      symbolSize: 55,
      description: '清朝是中国历史上最后一个封建王朝，由满族建立。',
      properties: {
        建立时间: '公元1644年',
        结束时间: '公元1911年',
        代表人物: '皇太极、康熙、乾隆',
        都城: '北京'
      }
    },
    {
      id: 'qinshihuang',
      name: '秦始皇',
      category: 1,
      symbolSize: 45,
      description: '秦始皇嬴政是中国历史上第一个称皇帝的君主，统一了中国。',
      properties: {
        生卒年: '公元前259年-公元前210年',
        主要成就: '统一六国、建立中央集权制度、统一文字度量衡',
        评价: '雄才大略，功过并存'
      }
    },
    {
      id: 'wudi',
      name: '汉武帝',
      category: 1,
      symbolSize: 45,
      description: '汉武帝刘彻是西汉最著名的皇帝，在位期间国力达到鼎盛。',
      properties: {
        生卒年: '公元前156年-公元前87年',
        主要成就: '开拓疆土、设立太学、罢黜百家独尊儒术',
        评价: '雄才大略，开创汉朝盛世'
      }
    },
    {
      id: 'taizong',
      name: '唐太宗',
      category: 1,
      symbolSize: 45,
      description: '唐太宗李世民是唐朝第二位皇帝，被誉为"千古一帝"。',
      properties: {
        生卒年: '公元599年-公元649年',
        主要成就: '开创"贞观之治"、建立三省六部制',
        评价: '明君典范，开创盛世'
      }
    },
    {
      id: 'kangxi',
      name: '康熙皇帝',
      category: 1,
      symbolSize: 45,
      description: '康熙皇帝爱新觉罗·玄烨是清朝最著名的皇帝之一，在位61年。',
      properties: {
        生卒年: '公元1654年-公元1722年',
        主要成就: '平定三藩之乱、收复台湾、编纂《康熙字典》',
        评价: '勤政爱民，开创"康乾盛世"'
      }
    },
    {
      id: 'confucius',
      name: '孔子',
      category: 1,
      symbolSize: 50,
      description: '孔子是中国古代思想家、教育家，儒家学派创始人。',
      properties: {
        生卒年: '公元前551年-公元前479年',
        主要成就: '创立儒家学说、编纂《春秋》',
        影响: '被尊为"至圣先师"，对中国文化影响深远'
      }
    },
    {
      id: 'laozi',
      name: '老子',
      category: 1,
      symbolSize: 45,
      description: '老子是中国古代思想家，道家学派创始人。',
      properties: {
        生卒年: '约公元前571年-?',
        主要成就: '著《道德经》、创立道家思想',
        影响: '对中国哲学、宗教影响深远'
      }
    },
    {
      id: 'zhugeliang',
      name: '诸葛亮',
      category: 1,
      symbolSize: 45,
      description: '诸葛亮是三国时期蜀汉丞相，杰出的政治家、军事家。',
      properties: {
        生卒年: '公元181年-公元234年',
        主要成就: '辅佐刘备建立蜀汉、发明木牛流马',
        评价: '忠心耿耿，鞠躬尽瘁，死而后已'
      }
    },
    {
      id: 'great_wall',
      name: '长城',
      category: 4,
      symbolSize: 50,
      description: '长城是中国古代为防御北方游牧民族入侵而修筑的防御工程。',
      properties: {
        始建时间: '春秋战国时期',
        主要修建朝代: '秦、汉、明',
        长度: '约21196公里',
        文化意义: '中华民族团结和智慧的象征'
      }
    },
    {
      id: 'terracotta',
      name: '兵马俑',
      category: 4,
      symbolSize: 45,
      description: '兵马俑是秦始皇陵墓的陪葬坑，出土于陕西西安。',
      properties: {
        发掘时间: '1974年',
        规模: '三个坑共8000多个兵马俑',
        历史意义: '反映秦朝军事、艺术水平的重要实物资料'
      }
    },
    {
      id: 'forbidden_city',
      name: '紫禁城',
      category: 4,
      symbolSize: 50,
      description: '紫禁城又称故宫，是明清两代的皇宫，位于北京中轴线中心。',
      properties: {
        建造时间: '1406年-1420年',
        建筑面积: '约72万平方米',
        房屋数量: '9000余间',
        文化意义: '中国古代宫廷建筑的杰出代表'
      }
    },
    {
      id: 'taihedian',
      name: '太和殿',
      category: 4,
      symbolSize: 48,
      description: '太和殿是紫禁城内的正殿，是明清两代举行大典的地方，位于紫禁城中轴线上。',
      properties: {
        建造时间: '1420年（明永乐十八年）',
        重修时间: '1695年（清康熙三十四年）',
        建筑特点: '重檐庑殿顶，黄琉璃瓦，面阔11间，进深5间',
        文化地位: '皇权的最高象征，是中国古代最高等级的宫殿建筑'
      }
    },
    {
      id: 'zhonghedian',
      name: '中和殿',
      category: 4,
      symbolSize: 45,
      description: '中和殿位于太和殿后，坐落在8米高的汉白玉石台基上，是皇帝举行朝会前休息的地方。',
      properties: {
        建造时间: '1420年',
        建筑特点: '方形平面，黄琉璃瓦重檐庑殿顶',
        功能: '皇帝在大典前休息更衣的场所，也是举行小型典礼的地方'
      }
    },
    {
      id: 'baohedian',
      name: '保和殿',
      category: 4,
      symbolSize: 45,
      description: '保和殿是紫禁城内三大殿之一，位于中和殿后，是皇帝举行宴会和殿试的地方。',
      properties: {
        建造时间: '1420年',
        建筑特点: '黄琉璃瓦重檐庑殿顶，比太和殿略小',
        功能: '清代用作举行殿试、宴会和军机处议政的地方'
      }
    },
    {
      id: 'qianqinggong',
      name: '乾清宫',
      category: 4,
      symbolSize: 45,
      description: '乾清宫是内廷的正宫，是皇帝日常居住和处理政务的地方。',
      properties: {
        建造时间: '1420年',
        建筑特点: '黄琉璃瓦重檐庑殿顶，面阔9间',
        功能: '皇帝的寝宫和处理政务的地方，也是举行小型朝会和接见臣僚的场所'
      }
    },
    {
      id: 'yongle',
      name: '明成祖朱棣',
      category: 1,
      symbolSize: 45,
      description: '朱棣是明朝第三位皇帝，年号永乐，下令营建北京紫禁城。',
      properties: {
        生卒年: '1360年-1424年',
        在位时间: '1402年-1424年',
        主要成就: '迁都北京、修建紫禁城、派郑和下西洋',
        评价: '雄才大略，开创"永乐盛世"'
      }
    },
    {
      id: 'qianlong',
      name: '乾隆皇帝',
      category: 1,
      symbolSize: 45,
      description: '乾隆皇帝爱新觉罗·弘历是清朝最著名的皇帝之一，在位60年，是紫禁城文物收藏的主要奠基者。',
      properties: {
        生卒年: '1711年-1799年',
        在位时间: '1735年-1795年',
        主要成就: '编纂《四库全书》、平定准噶尔、扩张疆域',
        评价: '文治武功，"康乾盛世"的集大成者'
      }
    },
    {
      id: 'palace_museum',
      name: '故宫博物院',
      category: 4,
      symbolSize: 48,
      description: '故宫博物院建立于1925年，是在明清两代皇宫的基础上建立起来的国家级博物馆。',
      properties: {
        成立时间: '1925年10月10日',
        馆藏文物: '180余万件',
        占地面积: '72万平方米',
        文化意义: '中国最大的古代文化艺术博物馆，世界文化遗产'
      }
    },
    {
      id: 'unification',
      name: '秦统一六国',
      category: 2,
      symbolSize: 50,
      description: '秦统一六国是指秦国在公元前230年至公元前221年间先后灭掉韩、赵、魏、楚、燕、齐六国，完成中国统一的历史事件。',
      properties: {
        时间: '公元前230年-公元前221年',
        参与方: '秦、韩、赵、魏、楚、燕、齐',
        结果: '秦国统一中国，建立秦朝'
      }
    },
    {
      id: 'yellow_turban',
      name: '黄巾起义',
      category: 2,
      symbolSize: 45,
      description: '黄巾起义是东汉末年爆发的一次大规模农民起义，由张角领导。',
      properties: {
        时间: '公元184年',
        领导人: '张角、张宝、张梁',
        口号: '苍天已死，黄天当立',
        影响: '加速了东汉王朝的灭亡'
      }
    },
    {
      id: 'an_shi',
      name: '安史之乱',
      category: 2,
      symbolSize: 45,
      description: '安史之乱是唐朝安禄山和史思明发动的叛乱，导致唐朝由盛转衰。',
      properties: {
        时间: '公元755年-公元763年',
        领导人: '安禄山、史思明',
        影响: '唐朝国力衰退，社会经济遭到严重破坏'
      }
    },
    {
      id: 'opium_war',
      name: '鸦片战争',
      category: 2,
      symbolSize: 50,
      description: '鸦片战争是1840年至1842年英国对中国发动的侵略战争，是中国近代史的开端。',
      properties: {
        时间: '1840年-1842年',
        参与方: '清朝、英国',
        结果: '清朝战败，签订《南京条约》',
        影响: '中国开始沦为半殖民地半封建社会'
      }
    },
    {
      id: 'silk_road',
      name: '丝绸之路',
      category: 3,
      symbolSize: 50,
      description: '丝绸之路是连接亚欧非三大洲的古代商贸通道，促进了东西方文化交流。',
      properties: {
        开辟时间: '公元前138年（张骞出使西域）',
        路线: '长安-中亚-地中海沿岸',
        主要商品: '丝绸、茶叶、瓷器、香料、宗教文化',
        历史意义: '促进了东西方经济文化交流'
      }
    },
    {
      id: 'confucianism',
      name: '儒家思想',
      category: 3,
      symbolSize: 50,
      description: '儒家思想是由孔子创立的一种思想体系，强调"仁、义、礼、智、信"等道德观念。',
      properties: {
        创立时间: '春秋末期',
        核心理念: '仁者爱人、修身齐家治国平天下',
        经典著作: '四书五经',
        影响: '成为中国传统文化的主流思想'
      }
    },
    {
      id: 'buddhism',
      name: '佛教',
      category: 3,
      symbolSize: 45,
      description: '佛教起源于古印度，东汉时期传入中国，对中国文化产生深远影响。',
      properties: {
        传入时间: '约公元1世纪',
        代表人物: '鸠摩罗什、玄奘、六祖慧能',
        主要宗派: '禅宗、净土宗、天台宗',
        影响: '对中国哲学、艺术、文学等影响深远'
      }
    },
    {
      id: 'printing',
      name: '活字印刷术',
      category: 3,
      symbolSize: 45,
      description: '活字印刷术是由北宋毕升发明的一种印刷技术，是印刷史上的重大革新。',
      properties: {
        发明时间: '北宋庆历年间（1041年-1048年）',
        发明人: '毕升',
        工艺: '泥活字、木活字、金属活字',
        影响: '促进了文化传播和知识普及'
      }
    }
  ],
  links: [
    { source: 'ancient_china', target: 'xia', value: '包含' },
    { source: 'ancient_china', target: 'shang', value: '包含' },
    { source: 'ancient_china', target: 'zhou', value: '包含' },
    { source: 'ancient_china', target: 'qin', value: '包含' },
    { source: 'ancient_china', target: 'han', value: '包含' },
    { source: 'ancient_china', target: 'tang', value: '包含' },
    { source: 'ancient_china', target: 'song', value: '包含' },
    { source: 'ancient_china', target: 'yuan', value: '包含' },
    { source: 'ancient_china', target: 'ming', value: '包含' },
    { source: 'ancient_china', target: 'qing', value: '包含' },
    { source: 'qin', target: 'qinshihuang', value: '君主' },
    { source: 'han', target: 'wudi', value: '君主' },
    { source: 'tang', target: 'taizong', value: '君主' },
    { source: 'qing', target: 'kangxi', value: '君主' },
    { source: 'qinshihuang', target: 'unification', value: '发动' },
    { source: 'qinshihuang', target: 'great_wall', value: '修建' },
    { source: 'qinshihuang', target: 'terracotta', value: '陪葬' },
    { source: 'han', target: 'confucianism', value: '推崇' },
    { source: 'wudi', target: 'silk_road', value: '开辟' },
    { source: 'han', target: 'yellow_turban', value: '遭遇' },
    { source: 'tang', target: 'an_shi', value: '遭遇' },
    { source: 'tang', target: 'buddhism', value: '兴盛时期' },
    { source: 'song', target: 'printing', value: '发明' },
    { source: 'confucius', target: 'confucianism', value: '创立' },
    { source: 'laozi', target: 'zhou', value: '生活时期' },
    { source: 'zhugeliang', target: 'han', value: '生活时期' },
    { source: 'ming', target: 'forbidden_city', value: '建造' },
    { source: 'qing', target: 'forbidden_city', value: '使用' },
    { source: 'qing', target: 'opium_war', value: '遭遇' },
    { source: 'confucianism', target: 'buddhism', value: '文化交融' },
    { source: 'printing', target: 'confucianism', value: '传播' },
    { source: 'taizong', target: 'silk_road', value: '发展' },
    { source: 'kangxi', target: 'confucianism', value: '推崇' },
    { source: 'forbidden_city', target: 'taihedian', value: '包含' },
    { source: 'forbidden_city', target: 'zhonghedian', value: '包含' },
    { source: 'forbidden_city', target: 'baohedian', value: '包含' },
    { source: 'forbidden_city', target: 'qianqinggong', value: '包含' },
    { source: 'yongle', target: 'forbidden_city', value: '下令建造' },
    { source: 'yongle', target: 'ming', value: '统治者' },
    { source: 'qianlong', target: 'forbidden_city', value: '大规模修缮' },
    { source: 'qianlong', target: 'qing', value: '统治者' },
    { source: 'forbidden_city', target: 'palace_museum', value: '转变为' },
    { source: 'kangxi', target: 'qianlong', value: '祖父' },
    { source: 'taihedian', target: 'zhonghedian', value: '前后关系' },
    { source: 'zhonghedian', target: 'baohedian', value: '前后关系' },
    { source: 'qing', target: 'palace_museum', value: '遗留' }
  ]
} 