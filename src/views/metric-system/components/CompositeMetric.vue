<template>
  <div class="composite-metric-section">
    <div class="row">
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5>复合指标列表</h5>
            <button class="btn btn-sm btn-primary" @click="showCompositeMetricForm">新增</button>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">按分组筛选</label>
              <select class="form-select group-filter" v-model="groupFilter">
                <option value="">所有分组</option>
                <option v-for="group in store.groups" :key="group.group_id" :value="group.group_id">
                  {{ group.group_name }}
                </option>
              </select>
            </div>
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>指标ID</th>
                    <th>版本</th>
                    <th>依赖数</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="metric in filteredCompositeMetrics" :key="metric.composite_id">
                    <td>{{ metric.composite_id }}</td>
                    <td>{{ metric.version }}</td>
                    <td>{{ metric.dependencies ? metric.dependencies.length : 0 }}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary btn-action" @click="editCompositeMetric(metric.composite_id)">编辑</button>
                      <button class="btn btn-sm btn-outline-danger btn-action" @click="deleteCompositeMetric(metric.composite_id)">删除</button>
                      <button class="btn btn-sm btn-outline-info btn-action" @click="showDependencyGraph(metric)">依赖图</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card mb-4" v-show="formVisible">
          <div class="card-header">
            <h5>{{ isEdit ? '编辑' : '新增' }}复合指标</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleCompositeMetricSubmit">
              <div class="mb-3">
                <label for="composite-id" class="form-label">指标ID</label>
                <input type="text" class="form-control" id="composite-id" v-model="formData.composite_id" placeholder="如: risk_score">
              </div>
              <div class="mb-3">
                <label for="composite-group-id" class="form-label">所属分组</label>
                <select class="form-select" id="composite-group-id" v-model="formData.group_id">
                  <option value="">-- 请选择分组 --</option>
                  <option v-for="group in store.groups" :key="group.group_id" :value="group.group_id">
                    {{ group.group_name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="formula" class="form-label">计算公式</label>
                <textarea 
                  class="form-control" 
                  id="formula" 
                  v-model="formData.formula" 
                  rows="5"
                  placeholder="输入计算公式，如: (login_freq * 0.3) + (user_degree * 0.7) / env.SCALE_FACTOR"
                ></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">依赖指标</label>
                <div id="dependencies-container">
                  <div v-for="(dep, index) in formData.dependencies" :key="index" class="dependency-row mb-3">
                    <div class="row">
                      <div class="col-md-8">
                        <select class="form-select" v-model="dep.metric_id">
                          <option value="">-- 请选择指标 --</option>
                          <optgroup label="基础指标">
                            <option v-for="metric in store.baseMetrics" :key="'base-'+metric.metric_id" :value="metric.metric_id">
                              {{ metric.metric_name || metric.metric_id }}
                            </option>
                          </optgroup>
                          <optgroup label="复合指标">
                            <option v-for="metric in availableCompositeMetrics" :key="'comp-'+metric.composite_id" :value="metric.composite_id">
                              {{ metric.composite_id }}
                            </option>
                          </optgroup>
                        </select>
                      </div>
                      <div class="col-md-4">
                        <input type="text" class="form-control" v-model="dep.alias" placeholder="别名(可选)">
                      </div>
                    </div>
                    <button type="button" class="remove-btn" @click="removeDependency(index)">&times;</button>
                  </div>
                </div>
                <button type="button" class="btn btn-sm btn-outline-primary mt-2" @click="addDependency">添加依赖</button>
              </div>
              <div class="mb-3">
                <label class="form-label">上下文变量</label>
                <div id="context-vars-container">
                  <div v-for="(ctx, index) in contextVarsList" :key="index" class="context-var-row mb-3">
                    <div class="row">
                      <div class="col-md-4">
                        <input type="text" class="form-control" v-model="ctx.name" placeholder="变量名">
                      </div>
                      <div class="col-md-4">
                        <select class="form-select" v-model="ctx.type">
                          <option value="ENV">环境变量 (ENV)</option>
                          <option value="CONST">常量 (CONST)</option>
                        </select>
                      </div>
                      <div class="col-md-4">
                        <input type="text" class="form-control" v-model="ctx.value" :placeholder="ctx.type === 'ENV' ? '环境变量名' : '常量值'">
                      </div>
                    </div>
                    <button type="button" class="remove-btn" @click="removeContextVar(index)">&times;</button>
                  </div>
                </div>
                <button type="button" class="btn btn-sm btn-outline-primary mt-2" @click="addContextVar">添加变量</button>
              </div>
              <div class="mb-3">
                <label for="version" class="form-label">版本</label>
                <input type="number" class="form-control" id="version" v-model="formData.version" min="1">
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary" @click="hideCompositeMetricForm">取消</button>
                <button type="submit" class="btn btn-primary">保存</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 依赖关系图模态框 -->
    <div class="modal fade" id="dependency-modal" tabindex="-1" ref="dependencyModal">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">指标依赖关系</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-0">
            <div id="dependency-graph" ref="dependencyGraph" style="height: 550px; width: 100%;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useStore } from '../store';
import * as echarts from 'echarts';

export default {
  name: 'CompositeMetric',
  setup() {
    const store = useStore();
    
    const groupFilter = ref('');
    const formVisible = ref(false);
    const isEdit = ref(false);
    const dependencyModal = ref(null);
    const dependencyGraph = ref(null);
    
    let modal = null;
    
    const formData = reactive({
      composite_id: '',
      group_id: '',
      formula: '',
      dependencies: [],
      context_vars: {},
      version: 1
    });
    
    const contextVarsList = ref([]);
    
    // 过滤后的复合指标列表
    const filteredCompositeMetrics = computed(() => {
      if (!groupFilter.value) {
        return store.compositeMetrics;
      }
      return store.compositeMetrics.filter(metric => metric.group_id === groupFilter.value);
    });
    
    // 可用的复合指标（排除自身，防止循环依赖）
    const availableCompositeMetrics = computed(() => {
      return store.compositeMetrics.filter(m => m.composite_id !== formData.composite_id);
    });
    
    onMounted(() => {
      // 初始化模态框
      nextTick(() => {
        if (dependencyModal.value) {
          modal = new bootstrap.Modal(dependencyModal.value);
        }
      });
    });
    
    // 显示表单
    function showCompositeMetricForm() {
      formVisible.value = true;
      isEdit.value = false;
      resetForm();
    }
    
    // 隐藏表单
    function hideCompositeMetricForm() {
      formVisible.value = false;
    }
    
    // 重置表单
    function resetForm() {
      formData.composite_id = '';
      formData.group_id = '';
      formData.formula = '';
      formData.dependencies = [];
      formData.context_vars = {};
      formData.version = 1;
      contextVarsList.value = [];
    }
    
    // 添加依赖
    function addDependency() {
      formData.dependencies.push({
        metric_id: '',
        alias: ''
      });
    }
    
    // 删除依赖
    function removeDependency(index) {
      formData.dependencies.splice(index, 1);
    }
    
    // 添加上下文变量
    function addContextVar() {
      const varName = `VAR_${contextVarsList.value.length + 1}`;
      contextVarsList.value.push({
        name: varName,
        type: 'ENV',
        value: ''
      });
      
      // 更新 formData 中的 context_vars
      formData.context_vars[varName] = {
        type: 'ENV',
        key: '',
        default: ''
      };
    }
    
    // 删除上下文变量
    function removeContextVar(index) {
      const varName = contextVarsList.value[index].name;
      contextVarsList.value.splice(index, 1);
      
      // 从 formData 中删除
      delete formData.context_vars[varName];
    }
    
    // 编辑复合指标
    function editCompositeMetric(metricId) {
      const metric = store.compositeMetrics.find(m => m.composite_id === metricId);
      if (!metric) return;
      
      isEdit.value = true;
      formVisible.value = true;
      
      formData.composite_id = metric.composite_id;
      formData.group_id = metric.group_id || '';
      formData.formula = metric.formula;
      formData.dependencies = JSON.parse(JSON.stringify(metric.dependencies || []));
      formData.context_vars = JSON.parse(JSON.stringify(metric.context_vars || {}));
      formData.version = metric.version || 1;
      
      // 转换上下文变量为列表形式
      contextVarsList.value = [];
      for (const [name, config] of Object.entries(formData.context_vars)) {
        contextVarsList.value.push({
          name,
          type: config.type,
          value: config.key || config.value || ''
        });
      }
    }
    
    // 删除复合指标
    function deleteCompositeMetric(metricId) {
      if (!confirm(`确定要删除指标 "${metricId}" 吗？依赖此指标的其他复合指标也会受到影响！`)) return;
      
      // 检查依赖
      const dependentMetrics = store.compositeMetrics.filter(m => 
        m.composite_id !== metricId && // 排除自身
        m.dependencies.some(d => d.metric_id === metricId)
      );
      
      if (dependentMetrics.length > 0) {
        alert(`无法删除：该指标被以下复合指标使用：\n${dependentMetrics.map(m => m.composite_id).join(', ')}`);
        return;
      }
      
      // 删除指标
      store.deleteCompositeMetric(metricId);
    }
    
    // 处理表单提交
    function handleCompositeMetricSubmit() {
      // 验证表单
      if (!formData.composite_id) {
        alert('请输入指标ID');
        return;
      }
      
      if (!formData.formula) {
        alert('请输入计算公式');
        return;
      }
      
      if (formData.dependencies.length === 0) {
        alert('请至少添加一个依赖指标');
        return;
      }
      
      // 验证依赖指标是否都已选择
      for (const dep of formData.dependencies) {
        if (!dep.metric_id) {
          alert('请选择所有依赖指标');
          return;
        }
      }
      
      // 更新上下文变量
      const updatedContextVars = {};
      for (const ctx of contextVarsList.value) {
        updatedContextVars[ctx.name] = {
          type: ctx.type,
          key: ctx.type === 'ENV' ? ctx.value : undefined,
          value: ctx.type === 'CONST' ? ctx.value : undefined,
          default: ''
        };
      }
      
      // 保存复合指标
      store.saveCompositeMetric({
        composite_id: formData.composite_id,
        group_id: formData.group_id,
        formula: formData.formula,
        dependencies: formData.dependencies,
        context_vars: updatedContextVars,
        version: parseInt(formData.version)
      });
      
      // 隐藏表单
      hideCompositeMetricForm();
    }
    
    // 显示依赖图
    function showDependencyGraph(metric) {
      if (!metric) return;
      
      // 显示模态框
      if (modal) {
        modal.show();
      }
      
      // 延迟渲染图表，确保 DOM 已更新
      setTimeout(() => {
        if (!dependencyGraph.value) return;
        
        // 初始化图表
        const chart = echarts.init(dependencyGraph.value);
        
        // 准备数据
        const nodes = [];
        const links = [];
        
        // 添加当前节点
        nodes.push({
          id: metric.composite_id,
          name: metric.composite_id,
          category: 0,
          symbolSize: 50
        });
        
        // 递归添加依赖
        function addDependencies(parentId, dependencies) {
          dependencies.forEach(dep => {
            // 添加节点
            let category;
            
            if (store.baseMetrics.some(m => m.metric_id === dep.metric_id)) {
              category = 1; // 基础指标
            } else {
              category = 0; // 复合指标
            }
            
            nodes.push({
              id: dep.metric_id,
              name: dep.metric_id,
              category,
              symbolSize: 30
            });
            
            // 添加连接
            links.push({
              source: parentId,
              target: dep.metric_id,
              value: dep.alias || ''
            });
            
            // 递归处理复合指标的依赖
            const childMetric = store.compositeMetrics.find(m => m.composite_id === dep.metric_id);
            if (childMetric) {
              addDependencies(dep.metric_id, childMetric.dependencies);
            }
          });
        }
        
        addDependencies(metric.composite_id, metric.dependencies);
        
        // 设置图表选项
        const option = {
          title: {
            text: `指标 ${metric.composite_id} 依赖关系`,
            top: 'bottom',
            left: 'right'
          },
          tooltip: {
            formatter: function(params) {
              if (params.dataType === 'edge') {
                return params.value ? `别名: ${params.value}` : '';
              }
              return params.data.name;
            }
          },
          legend: [
            {
              data: ['复合指标', '基础指标'],
              left: 'center',
              top: 10
            }
          ],
          series: [
            {
              type: 'graph',
              layout: 'force',
              data: nodes,
              links: links,
              categories: [
                { name: '复合指标' },
                { name: '基础指标' }
              ],
              roam: true,
              label: {
                show: true,
                position: 'right'
              },
              force: {
                repulsion: 150,
                edgeLength: 150,
                gravity: 0.1,
                layoutAnimation: true
              },
              lineStyle: {
                curveness: 0.3
              },
              center: ['50%', '50%']
            }
          ],
          grid: {
            left: '5%',
            right: '5%',
            top: '10%',
            bottom: '10%'
          }
        };
        
        chart.setOption(option);
        
        // 窗口大小变化时重新调整图表大小
        window.addEventListener('resize', function() {
          chart.resize();
        });
        
        // 监听模态框变化事件
        dependencyModal.value.addEventListener('shown.bs.modal', function() {
          chart.resize();
        });
      }, 300);
    }
    
    return {
      store,
      groupFilter,
      formVisible,
      isEdit,
      formData,
      dependencyModal,
      dependencyGraph,
      contextVarsList,
      filteredCompositeMetrics,
      availableCompositeMetrics,
      showCompositeMetricForm,
      hideCompositeMetricForm,
      addDependency,
      removeDependency,
      addContextVar,
      removeContextVar,
      editCompositeMetric,
      deleteCompositeMetric,
      handleCompositeMetricSubmit,
      showDependencyGraph
    };
  }
};
</script> 