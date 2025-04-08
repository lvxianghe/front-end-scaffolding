<template>
  <div class="metric-dashboard-section">
    <div class="row">
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header">
            <h5>指标测试面板</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="dashboard-metric-select" class="form-label">选择指标</label>
              <select class="form-select" id="dashboard-metric-select" v-model="selectedMetric" @change="handleMetricSelectChange">
                <option value="">-- 请选择指标 --</option>
                <optgroup label="基础指标">
                  <option v-for="metric in store.baseMetrics" :key="'base-'+metric.metric_id" :value="`base:${metric.metric_id}`">
                    {{ metric.metric_name || metric.metric_id }}
                  </option>
                </optgroup>
                <optgroup label="复合指标">
                  <option v-for="metric in store.compositeMetrics" :key="'comp-'+metric.composite_id" :value="`composite:${metric.composite_id}`">
                    {{ metric.composite_id }}
                  </option>
                </optgroup>
              </select>
            </div>
            
            <div id="dashboard-params-container" class="mb-3">
              <!-- 参数表单将动态生成 -->
              <div v-if="paramFields.length > 0">
                <label class="form-label">参数</label>
                <div v-for="(param, index) in paramFields" :key="index" class="mb-2">
                  <label class="form-label">{{ param.name }}</label>
                  <input 
                    :type="param.type === 'bool' ? 'checkbox' : param.type === 'int' || param.type === 'double' ? 'number' : 'text'" 
                    class="form-control" 
                    v-model="param.value" 
                    :placeholder="param.required ? '(必填)' : '(可选)'">
                </div>
              </div>
              
              <div v-if="contextVarFields.length > 0">
                <label class="form-label">上下文变量</label>
                <div v-for="(ctx, index) in contextVarFields" :key="index" class="mb-2">
                  <label class="form-label">{{ ctx.name }}</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="ctx.value" 
                    :placeholder="`默认值: ${ctx.default || '无'}`">
                </div>
              </div>
            </div>
            
            <div class="text-center">
              <button class="btn btn-primary" @click="computeMetric" :disabled="!selectedMetric">计算指标</button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header">
            <h5>计算结果</h5>
          </div>
          <div class="card-body">
            <div class="execution-process mb-3">
              <h6>执行过程</h6>
              <div class="execution-steps">
                <div v-for="(step, index) in executionSteps" :key="index" class="execution-step" :class="step.status">
                  {{ step.message }}
                </div>
              </div>
            </div>
            
            <div class="result-container" v-if="result !== null">
              <h6>结果</h6>
              <pre class="result-display">{{ JSON.stringify(result, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from '../store';

export default {
  setup() {
    const store = useStore();
    const selectedMetric = ref('');
    const paramFields = ref([]);
    const contextVarFields = ref([]);
    const executionSteps = ref([]);
    const result = ref(null);
    
    // 处理指标选择变化
    function handleMetricSelectChange() {
      // 清空参数和上下文变量
      paramFields.value = [];
      contextVarFields.value = [];
      
      if (!selectedMetric.value) return;
      
      // 解析选择值 (格式: type:id)
      const [type, id] = selectedMetric.value.split(':');
      
      if (type === 'base') {
        // 基础指标参数
        const metric = store.baseMetrics.find(m => m.metric_id === id);
        if (metric) {
          const aqlConfig = store.aqlConfigs.find(a => a.aql_id === metric.aql_id);
          if (aqlConfig && aqlConfig.parameters) {
            paramFields.value = aqlConfig.parameters.map(p => ({
              name: p.name,
              type: p.type,
              required: p.required,
              value: p.default || '',
              default: p.default
            }));
          }
        }
      } else if (type === 'composite') {
        // 复合指标上下文变量
        const metric = store.compositeMetrics.find(m => m.composite_id === id);
        if (metric && metric.context_vars) {
          for (const [name, config] of Object.entries(metric.context_vars)) {
            contextVarFields.value.push({
              name,
              type: config.type,
              value: '',
              default: config.default
            });
          }
        }
      }
    }
    
    // 计算指标
    function computeMetric() {
      if (!selectedMetric.value) return;
      
      // 清空之前的结果
      executionSteps.value = [];
      result.value = null;
      
      const [type, id] = selectedMetric.value.split(':');
      
      // 添加初始步骤
      addExecutionStep(`开始计算 ${type === 'base' ? '基础' : '复合'}指标: ${id}`, 'running');
      
      // 模拟计算过程
      setTimeout(() => {
        try {
          if (type === 'base') {
            computeBaseMetric(id);
          } else {
            computeCompositeMetric(id);
          }
        } catch (error) {
          addExecutionStep(`计算错误: ${error.message}`, 'error');
        }
      }, 500);
    }
    
    // 计算基础指标
    function computeBaseMetric(metricId) {
      const metric = store.baseMetrics.find(m => m.metric_id === metricId);
      if (!metric) {
        throw new Error(`找不到指标: ${metricId}`);
      }
      
      const aql = store.aqlConfigs.find(a => a.aql_id === metric.aql_id);
      if (!aql) {
        throw new Error(`找不到关联的AQL: ${metric.aql_id}`);
      }
      
      // 收集参数
      const params = {};
      for (const field of paramFields.value) {
        params[field.name] = field.value;
      }
      
      // 模拟AQL执行
      addExecutionStep(`执行AQL: ${aql.aql_id}`, 'running');
      
      setTimeout(() => {
        // 模拟AQL结果
        let aqlResult;
        if (aql.result_type === 'SINGLE_VALUE') {
          aqlResult = Math.floor(Math.random() * 100);
        } else if (aql.result_type === 'LIST') {
          aqlResult = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
        } else {
          aqlResult = {
            id: `user_${Math.floor(Math.random() * 1000)}`,
            stats: {
              degree: Math.floor(Math.random() * 100),
              centrality: Math.random().toFixed(2)
            },
            attributes: {
              age: 20 + Math.floor(Math.random() * 40),
              active: Math.random() > 0.5
            }
          };
        }
        
        addExecutionStep(`AQL执行完成`, 'success');
        
        // 应用结果映射
        addExecutionStep(`应用结果映射: ${metric.result_mapping}`, 'running');
        
        // 模拟结果映射
        let mappedResult;
        if (metric.result_mapping === '$') {
          mappedResult = aqlResult;
        } else if (metric.result_mapping === '$.stats.degree') {
          mappedResult = aqlResult.stats.degree;
        } else {
          mappedResult = Math.floor(Math.random() * 100);
        }
        
        addExecutionStep(`结果映射完成`, 'success');
        
        // 设置最终结果
        result.value = mappedResult;
      }, 800);
    }
    
    // 计算复合指标
    function computeCompositeMetric(metricId) {
      const metric = store.compositeMetrics.find(m => m.composite_id === metricId);
      if (!metric) {
        throw new Error(`找不到指标: ${metricId}`);
      }
      
      // 收集上下文变量
      const contextVars = {};
      for (const field of contextVarFields.value) {
        contextVars[field.name] = field.value || field.default;
      }
      
      // 模拟依赖指标计算
      addExecutionStep(`计算依赖指标 (${metric.dependencies.length})`, 'running');
      
      // 模拟依赖计算结果
      const dependencyResults = {};
      
      setTimeout(() => {
        for (const dep of metric.dependencies) {
          const alias = dep.alias || dep.metric_id;
          dependencyResults[alias] = Math.floor(Math.random() * 100);
          addExecutionStep(`依赖指标 ${dep.metric_id} 计算完成: ${dependencyResults[alias]}`, 'success');
        }
        
        // 模拟公式计算
        addExecutionStep(`执行公式: ${metric.formula}`, 'running');
        
        setTimeout(() => {
          // 模拟公式计算结果
          const formulaResult = Math.floor(Math.random() * 100);
          addExecutionStep(`公式计算完成`, 'success');
          
          // 设置最终结果
          result.value = formulaResult;
        }, 500);
      }, 800);
    }
    
    // 添加执行步骤
    function addExecutionStep(message, status) {
      executionSteps.value.push({ message, status });
    }
    
    return {
      store,
      selectedMetric,
      paramFields,
      contextVarFields,
      executionSteps,
      result,
      handleMetricSelectChange,
      computeMetric
    };
  }
};
</script> 