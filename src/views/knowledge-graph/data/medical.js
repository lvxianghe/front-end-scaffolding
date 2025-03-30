export const medicalDomain = {
  title: '生物医学知识图谱',
  categories: [
    {
      name: '疾病',
      itemStyle: { color: '#f5222d' }
    },
    {
      name: '药物',
      itemStyle: { color: '#52c41a' }
    },
    {
      name: '治疗方法',
      itemStyle: { color: '#1890ff' }
    },
    {
      name: '症状',
      itemStyle: { color: '#faad14' }
    },
    {
      name: '医学专科',
      itemStyle: { color: '#722ed1' }
    },
    {
      name: '医学机构',
      itemStyle: { color: '#13c2c2' }
    }
  ],
  nodes: [
    {
      id: 'medicine',
      name: '医学',
      category: 5,
      symbolSize: 70,
      description: '医学是研究人体健康与疾病的预防、诊断、治疗及康复的科学。',
      properties: {
        定义: '研究与人类健康相关的科学',
        主要分支: '临床医学、基础医学、预防医学',
        发展历史: '从古代医学发展到现代精准医学'
      }
    },
    {
      id: 'cardiology',
      name: '心脏病学',
      category: 4,
      symbolSize: 50,
      description: '心脏病学是一门研究心脏和血管疾病的医学专科。',
      properties: {
        研究对象: '心脏及血管系统',
        常见疾病: '冠心病、心力衰竭、心律失常',
        主要技术: '心电图、超声心动图、冠状动脉造影'
      }
    },
    {
      id: 'neurology',
      name: '神经病学',
      category: 4,
      symbolSize: 50,
      description: '神经病学是研究神经系统疾病的医学专科，包括脑、脊髓、外周神经疾病等。',
      properties: {
        研究对象: '中枢神经系统、外周神经系统',
        常见疾病: '中风、癫痫、帕金森病、阿尔茨海默病',
        主要技术: 'CT、MRI、脑电图、神经电生理'
      }
    },
    {
      id: 'oncology',
      name: '肿瘤学',
      category: 4,
      symbolSize: 50,
      description: '肿瘤学是研究肿瘤发生、发展、诊断、治疗和预防的医学专科。',
      properties: {
        研究对象: '良性肿瘤、恶性肿瘤',
        主要方法: '手术治疗、化疗、放疗、免疫治疗',
        研究热点: '基因靶向治疗、免疫检查点抑制剂'
      }
    },
    {
      id: 'coronary',
      name: '冠心病',
      category: 0,
      symbolSize: 45,
      description: '冠心病是指冠状动脉血管发生动脉粥样硬化病变而引起的心肌缺血、缺氧或坏死的心脏病。',
      properties: {
        主要原因: '冠状动脉粥样硬化',
        危险因素: '高血压、高血脂、糖尿病、吸烟',
        治疗方法: '药物治疗、冠脉介入、冠脉搭桥'
      }
    },
    {
      id: 'hypertension',
      name: '高血压',
      category: 0,
      symbolSize: 45,
      description: '高血压是一种以动脉血压持续升高为特征的慢性疾病，是最常见的心血管疾病之一。',
      properties: {
        诊断标准: '静息状态下收缩压≥140mmHg和/或舒张压≥90mmHg',
        分类: '原发性高血压、继发性高血压',
        并发症: '冠心病、脑卒中、肾功能衰竭'
      }
    },
    {
      id: 'diabetes',
      name: '糖尿病',
      category: 0,
      symbolSize: 45,
      description: '糖尿病是一组以高血糖为特征的代谢性疾病，由胰岛素分泌缺陷或其生物作用障碍引起。',
      properties: {
        分类: '1型糖尿病、2型糖尿病、妊娠糖尿病',
        症状: '多饮、多食、多尿、体重减轻',
        并发症: '糖尿病肾病、糖尿病视网膜病变、糖尿病神经病变'
      }
    },
    {
      id: 'alzheimer',
      name: '阿尔茨海默病',
      category: 0,
      symbolSize: 45,
      description: '阿尔茨海默病是一种起病隐匿的进行性神经系统退行性疾病，以记忆障碍、认知功能障碍、人格改变等为主要表现。',
      properties: {
        病因: '淀粉样蛋白沉积、神经纤维缠结',
        风险因素: '年龄、遗传、环境因素',
        治疗: '胆碱酯酶抑制剂、NMDA受体拮抗剂'
      }
    },
    {
      id: 'lung_cancer',
      name: '肺癌',
      category: 0,
      symbolSize: 50,
      description: '肺癌是发生在肺部的恶性肿瘤，是全球癌症死亡的主要原因。',
      properties: {
        分类: '小细胞肺癌、非小细胞肺癌',
        主要原因: '吸烟、空气污染、职业暴露',
        诊断方法: 'CT、PET-CT、活检',
        治疗方法: '手术、放疗、化疗、靶向治疗、免疫治疗'
      }
    },
    {
      id: 'aspirin',
      name: '阿司匹林',
      category: 1,
      symbolSize: 40,
      description: '阿司匹林是一种非甾体抗炎药，具有抗炎、镇痛、解热和抗血小板作用。',
      properties: {
        化学名称: '乙酰水杨酸',
        适应症: '疼痛、发热、炎症、心血管疾病预防',
        不良反应: '胃肠道刺激、出血风险增加',
        禁忌: '对水杨酸类药物过敏、活动性消化性溃疡'
      }
    },
    {
      id: 'statin',
      name: '他汀类药物',
      category: 1,
      symbolSize: 40,
      description: '他汀类药物是一类降胆固醇药物，通过抑制HMG-CoA还原酶来降低胆固醇合成。',
      properties: {
        代表药物: '辛伐他汀、阿托伐他汀、瑞舒伐他汀',
        作用机制: '抑制胆固醇合成关键酶HMG-CoA还原酶',
        适应症: '高胆固醇血症、动脉粥样硬化、冠心病预防',
        不良反应: '肝功能异常、肌肉疼痛、横纹肌溶解'
      }
    },
    {
      id: 'insulin',
      name: '胰岛素',
      category: 1,
      symbolSize: 40,
      description: '胰岛素是一种由胰腺β细胞分泌的蛋白质激素，是调节血糖的主要激素。',
      properties: {
        类型: '速效胰岛素、短效胰岛素、中效胰岛素、长效胰岛素',
        适应症: '1型糖尿病、部分2型糖尿病',
        不良反应: '低血糖、过敏反应、注射部位反应',
        给药方式: '皮下注射、胰岛素泵'
      }
    },
    {
      id: 'surgery',
      name: '外科手术',
      category: 2,
      symbolSize: 50,
      description: '外科手术是通过切开、切除、缝合等操作治疗疾病的医疗方法。',
      properties: {
        分类: '心胸外科、神经外科、普通外科、骨科等',
        技术发展: '从开放手术到微创手术、机器人辅助手术',
        风险: '麻醉风险、出血、感染、器官功能损伤'
      }
    },
    {
      id: 'chemo',
      name: '化学治疗',
      category: 2,
      symbolSize: 45,
      description: '化学治疗是使用化学药物杀死或抑制癌细胞生长的治疗方法，主要用于恶性肿瘤的治疗。',
      properties: {
        作用机制: '抑制细胞分裂、诱导细胞凋亡',
        常用药物: '顺铂、紫杉醇、多柔比星等',
        不良反应: '骨髓抑制、脱发、恶心呕吐、神经毒性',
        给药方式: '静脉注射、口服'
      }
    },
    {
      id: 'radiation',
      name: '放射治疗',
      category: 2,
      symbolSize: 45,
      description: '放射治疗是利用电离辐射杀死或抑制肿瘤细胞的治疗方法。',
      properties: {
        作用机制: '破坏DNA、诱导细胞凋亡',
        技术: '三维适形放疗、调强放疗、立体定向放疗',
        适应症: '多种恶性肿瘤、某些良性疾病',
        不良反应: '皮肤反应、黏膜炎、疲劳、器官损伤'
      }
    },
    {
      id: 'immunotherapy',
      name: '免疫治疗',
      category: 2,
      symbolSize: 45,
      description: '免疫治疗是通过激活或抑制人体免疫系统来治疗疾病的方法，在肿瘤治疗中有重要应用。',
      properties: {
        类型: '免疫检查点抑制剂、CAR-T细胞疗法、细胞因子治疗',
        作用机制: '恢复或增强免疫系统对肿瘤的识别和攻击',
        代表药物: 'PD-1/PD-L1抑制剂、CTLA-4抑制剂',
        不良反应: '自身免疫相关不良反应、细胞因子释放综合征'
      }
    },
    {
      id: 'chest_pain',
      name: '胸痛',
      category: 3,
      symbolSize: 40,
      description: '胸痛是一种常见症状，可能由心脏、肺部、消化道或胸壁疾病引起。',
      properties: {
        特点: '性质、程度、持续时间、诱因和缓解因素',
        常见病因: '冠心病、肺栓塞、肺炎、胃食管反流病',
        危险信号: '剧烈胸痛伴有出汗、呼吸困难、意识改变'
      }
    },
    {
      id: 'headache',
      name: '头痛',
      category: 3,
      symbolSize: 40,
      description: '头痛是指头部任何部位的疼痛，是最常见的神经系统症状之一。',
      properties: {
        分类: '原发性头痛、继发性头痛',
        常见类型: '偏头痛、紧张型头痛、丛集性头痛',
        危险信号: '突发剧烈头痛、伴有神经系统症状、年龄大于50岁新发头痛'
      }
    },
    {
      id: 'memory_loss',
      name: '记忆力减退',
      category: 3,
      symbolSize: 40,
      description: '记忆力减退是指记忆功能的下降，可能是正常衰老的一部分，也可能是疾病的症状。',
      properties: {
        类型: '短期记忆障碍、长期记忆障碍',
        常见病因: '阿尔茨海默病、血管性痴呆、抑郁症、代谢紊乱',
        评估方法: '认知功能测试、神经心理学评估'
      }
    },
    {
      id: 'ecg',
      name: '心电图',
      category: 2,
      symbolSize: 40,
      description: '心电图是记录心脏电活动的检查方法，是诊断心脏疾病的基本检查。',
      properties: {
        原理: '记录心脏电活动产生的电位变化',
        应用: '心律失常、冠心病、心肌梗死的诊断',
        类型: '静息心电图、动态心电图、运动负荷心电图'
      }
    },
    {
      id: 'mri',
      name: '核磁共振成像',
      category: 2,
      symbolSize: 40,
      description: '核磁共振成像是利用核磁共振现象获取人体内部结构图像的技术，具有无辐射、软组织对比度高等优点。',
      properties: {
        原理: '利用氢原子核在磁场中的共振现象',
        应用: '中枢神经系统、心血管系统、肌肉骨骼系统疾病的诊断',
        优势: '无辐射、软组织分辨率高、多平面成像',
        禁忌: '金属植入物、心脏起搏器、幽闭恐惧症'
      }
    },
    {
      id: 'who',
      name: '世界卫生组织',
      category: 5,
      symbolSize: 45,
      description: '世界卫生组织是联合国专门机构之一，致力于促进全球卫生事业的国际组织。',
      properties: {
        成立时间: '1948年4月7日',
        总部: '瑞士日内瓦',
        使命: '促进全民健康、应对全球卫生挑战',
        成员: '194个会员国'
      }
    },
    {
      id: 'genomics',
      name: '基因组学',
      category: 4,
      symbolSize: 45,
      description: '基因组学是研究生物体基因组的结构、功能和演化的学科，是精准医学的重要基础。',
      properties: {
        研究对象: '基因组序列、结构、功能',
        技术: '基因测序、基因编辑、基因芯片',
        应用: '疾病机制研究、药物靶点发现、个体化医疗'
      }
    }
  ],
  links: [
    { source: 'medicine', target: 'cardiology', value: '分支' },
    { source: 'medicine', target: 'neurology', value: '分支' },
    { source: 'medicine', target: 'oncology', value: '分支' },
    { source: 'medicine', target: 'genomics', value: '新兴领域' },
    { source: 'medicine', target: 'who', value: '国际组织' },
    
    { source: 'cardiology', target: 'coronary', value: '研究' },
    { source: 'cardiology', target: 'hypertension', value: '研究' },
    { source: 'cardiology', target: 'ecg', value: '使用' },
    { source: 'neurology', target: 'alzheimer', value: '研究' },
    { source: 'neurology', target: 'headache', value: '诊断' },
    { source: 'neurology', target: 'memory_loss', value: '诊断' },
    { source: 'neurology', target: 'mri', value: '使用' },
    { source: 'oncology', target: 'lung_cancer', value: '研究' },
    { source: 'oncology', target: 'chemo', value: '使用' },
    { source: 'oncology', target: 'radiation', value: '使用' },
    { source: 'oncology', target: 'immunotherapy', value: '使用' },
    
    { source: 'coronary', target: 'chest_pain', value: '表现为' },
    { source: 'coronary', target: 'aspirin', value: '治疗药物' },
    { source: 'coronary', target: 'statin', value: '治疗药物' },
    { source: 'coronary', target: 'surgery', value: '治疗方法' },
    { source: 'hypertension', target: 'coronary', value: '危险因素' },
    { source: 'diabetes', target: 'coronary', value: '危险因素' },
    { source: 'diabetes', target: 'insulin', value: '治疗药物' },
    
    { source: 'alzheimer', target: 'memory_loss', value: '表现为' },
    { source: 'alzheimer', target: 'mri', value: '诊断工具' },
    
    { source: 'lung_cancer', target: 'surgery', value: '治疗方法' },
    { source: 'lung_cancer', target: 'chemo', value: '治疗方法' },
    { source: 'lung_cancer', target: 'radiation', value: '治疗方法' },
    { source: 'lung_cancer', target: 'immunotherapy', value: '治疗方法' },
    
    { source: 'genomics', target: 'lung_cancer', value: '研究' },
    { source: 'genomics', target: 'alzheimer', value: '研究' },
    { source: 'genomics', target: 'immunotherapy', value: '支持' },
    
    { source: 'who', target: 'hypertension', value: '制定指南' },
    { source: 'who', target: 'diabetes', value: '制定指南' },
    { source: 'who', target: 'lung_cancer', value: '制定指南' }
  ]
} 