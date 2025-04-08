import { reactive, readonly } from 'vue';

// 模拟数据
const mockData = {
  aqlConfigs: [
    {
      aql_id: 'user_conn',
      aql_template: 'FOR v IN 1..@depth ANY @start_vertex GRAPH "social" RETURN v',
      result_type: 'MAP',
      parameters: [
        { name: 'depth', type: 'int', default: 2 },
        { name: 'start_vertex', type: 'string', required: true }
      ],
      created_time: '2024-03-20 10:00:00'
    },
    {
      aql_id: 'purchase_history',
      aql_template: 'FOR p IN purchases FILTER p.user_id == @user_id COLLECT WITH COUNT INTO count RETURN count',
      result_type: 'SINGLE_VALUE',
      parameters: [
        { name: 'user_id', type: 'string', required: true }
      ],
      created_time: '2024-03-21 15:30:00'
    }
  ],
  baseMetrics: [
    {
      metric_id: 'user_degree',
      metric_name: '用户连接度',
      aql_id: 'user_conn',
      result_mapping: '$.stats.degree',
      value_type: 'DOUBLE',
      cache_ttl: 300
    },
    {
      metric_id: 'login_freq',
      metric_name: '登录频率',
      aql_id: 'purchase_history',
      result_mapping: '$',
      value_type: 'INT',
      cache_ttl: 600
    }
  ],
  compositeMetrics: [
    {
      composite_id: 'risk_score',
      formula: '(login_freq * 0.3) + (user_degree * 0.7) / env.SCALE_FACTOR',
      dependencies: [
        { metric_id: 'login_freq' },
        { metric_id: 'user_degree' }
      ],
      context_vars: {
        'SCALE_FACTOR': { type: 'ENV', key: 'RISK_SCALE', default: 10 }
      },
      version: 1
    }
  ],
  groups: [
    {
      group_id: 'risk_control',
      group_name: '风险控制',
      business_scenario: '信贷风控',
      description: '用于风险控制的指标分组'
    },
    {
      group_id: 'user_profile',
      group_name: '用户画像',
      business_scenario: '用户分析',
      description: '用于用户画像的指标分组'
    }
  ]
};

// 创建状态存储
const state = reactive({
  aqlConfigs: [...mockData.aqlConfigs],
  baseMetrics: [...mockData.baseMetrics],
  compositeMetrics: [...mockData.compositeMetrics],
  groups: [...mockData.groups]
});

// 创建操作方法
const actions = {
  // AQL 相关操作
  saveAql(aql) {
    const index = state.aqlConfigs.findIndex(a => a.aql_id === aql.aql_id);
    if (index >= 0) {
      state.aqlConfigs[index] = aql;
    } else {
      state.aqlConfigs.push(aql);
    }
  },
  
  deleteAql(aqlId) {
    state.aqlConfigs = state.aqlConfigs.filter(a => a.aql_id !== aqlId);
  },
  
  // 基础指标相关操作
  saveBaseMetric(metric) {
    const index = state.baseMetrics.findIndex(m => m.metric_id === metric.metric_id);
    if (index >= 0) {
      state.baseMetrics[index] = metric;
    } else {
      state.baseMetrics.push(metric);
    }
  },
  
  deleteBaseMetric(metricId) {
    state.baseMetrics = state.baseMetrics.filter(m => m.metric_id !== metricId);
  },
  
  // 复合指标相关操作
  saveCompositeMetric(metric) {
    const index = state.compositeMetrics.findIndex(m => m.composite_id === metric.composite_id);
    if (index >= 0) {
      state.compositeMetrics[index] = metric;
    } else {
      state.compositeMetrics.push(metric);
    }
  },
  
  deleteCompositeMetric(metricId) {
    state.compositeMetrics = state.compositeMetrics.filter(m => m.composite_id !== metricId);
  },
  
  // 分组相关操作
  saveGroup(group) {
    const index = state.groups.findIndex(g => g.group_id === group.group_id);
    if (index >= 0) {
      state.groups[index] = group;
    } else {
      state.groups.push(group);
    }
  },
  
  deleteGroup(groupId) {
    state.groups = state.groups.filter(g => g.group_id !== groupId);
  }
};

// 创建并导出 store
export function useStore() {
  return {
    ...readonly(state),
    ...actions
  };
} 