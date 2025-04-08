<template>
  <div class="base-metric-section">
    <div class="row">
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5>基础指标列表</h5>
            <button class="btn btn-sm btn-primary" @click="showBaseMetricForm">新增</button>
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
                    <th>指标名称</th>
                    <th>关联AQL</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="metric in filteredBaseMetrics" :key="metric.metric_id">
                    <td>{{ metric.metric_id }}</td>
                    <td>{{ metric.metric_name }}</td>
                    <td>{{ metric.aql_id }}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary btn-action" @click="editBaseMetric(metric.metric_id)">编辑</button>
                      <button class="btn btn-sm btn-outline-danger btn-action" @click="deleteBaseMetric(metric.metric_id)">删除</button>
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
            <h5>{{ isEdit ? '编辑' : '新增' }}基础指标</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleBaseMetricSubmit">
              <div class="mb-3">
                <label for="metric-id" class="form-label">指标ID</label>
                <input type="text" class="form-control" id="metric-id" v-model="formData.metric_id" placeholder="如: user_degree">
              </div>
              <div class="mb-3">
                <label for="metric-name" class="form-label">指标名称</label>
                <input type="text" class="form-control" id="metric-name" v-model="formData.metric_name" placeholder="如: 用户连接度">
              </div>
              <div class="mb-3">
                <label for="group-id" class="form-label">所属分组</label>
                <select class="form-select" id="group-id" v-model="formData.group_id">
                  <option value="">-- 请选择分组 --</option>
                  <option v-for="group in store.groups" :key="group.group_id" :value="group.group_id">
                    {{ group.group_name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="aql-id" class="form-label">关联AQL</label>
                <select class="form-select" id="aql-id" v-model="formData.aql_id">
                  <option value="">-- 请选择AQL --</option>
                  <option v-for="aql in store.aqlConfigs" :key="aql.aql_id" :value="aql.aql_id">
                    {{ aql.aql_id }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="result-mapping" class="form-label">结果映射</label>
                <input type="text" class="form-control" id="result-mapping" v-model="formData.result_mapping" placeholder="如: $.stats.degree">
              </div>
              <div class="mb-3">
                <label for="value-type" class="form-label">数值类型</label>
                <select class="form-select" id="value-type" v-model="formData.value_type">
                  <option value="INT">整数 (INT)</option>
                  <option value="DOUBLE">浮点数 (DOUBLE)</option>
                  <option value="BOOL">布尔值 (BOOL)</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="cache-ttl" class="form-label">缓存时间(秒)</label>
                <input type="number" class="form-control" id="cache-ttl" v-model="formData.cache_ttl" min="0">
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary" @click="hideBaseMetricForm">取消</button>
                <button type="submit" class="btn btn-primary">保存</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { useStore } from '../store';

export default {
  name: 'BaseMetric',
  setup() {
    const store = useStore();
    
    const groupFilter = ref('');
    const formVisible = ref(false);
    const isEdit = ref(false);
    const formData = reactive({
      metric_id: '',
      metric_name: '',
      group_id: '',
      aql_id: '',
      result_mapping: '',
      value_type: 'DOUBLE',
      cache_ttl: 300
    });
    
    const filteredBaseMetrics = computed(() => {
      if (!groupFilter.value) {
        return store.baseMetrics;
      }
      return store.baseMetrics.filter(metric => metric.group_id === groupFilter.value);
    });
    
    // 显示表单
    function showBaseMetricForm() {
      formVisible.value = true;
      isEdit.value = false;
      resetForm();
    }
    
    // 隐藏表单
    function hideBaseMetricForm() {
      formVisible.value = false;
    }
    
    // 重置表单
    function resetForm() {
      formData.metric_id = '';
      formData.metric_name = '';
      formData.group_id = '';
      formData.aql_id = '';
      formData.result_mapping = '';
      formData.value_type = 'DOUBLE';
      formData.cache_ttl = 300;
    }
    
    // 编辑基础指标
    function editBaseMetric(metricId) {
      const metric = store.baseMetrics.find(m => m.metric_id === metricId);
      if (!metric) return;
      
      isEdit.value = true;
      formVisible.value = true;
      
      formData.metric_id = metric.metric_id;
      formData.metric_name = metric.metric_name;
      formData.group_id = metric.group_id || '';
      formData.aql_id = metric.aql_id;
      formData.result_mapping = metric.result_mapping;
      formData.value_type = metric.value_type;
      formData.cache_ttl = metric.cache_ttl;
    }
    
    // 删除基础指标
    function deleteBaseMetric(metricId) {
      if (!confirm(`确定要删除指标 "${metricId}" 吗？依赖此指标的复合指标也会受到影响！`)) return;
      
      // 检查依赖
      const dependentMetrics = store.compositeMetrics.filter(m => 
        m.dependencies.some(d => d.metric_id === metricId)
      );
      
      if (dependentMetrics.length > 0) {
        alert(`无法删除：该指标被以下复合指标使用：\n${dependentMetrics.map(m => m.composite_id).join(', ')}`);
        return;
      }
      
      // 删除指标
      store.deleteBaseMetric(metricId);
    }
    
    // 处理表单提交
    function handleBaseMetricSubmit() {
      // 验证表单
      if (!formData.metric_id) {
        alert('请输入指标ID');
        return;
      }
      
      if (!formData.metric_name) {
        alert('请输入指标名称');
        return;
      }
      
      if (!formData.aql_id) {
        alert('请选择关联AQL');
        return;
      }
      
      if (!formData.result_mapping) {
        alert('请输入结果映射');
        return;
      }
      
      // 保存基础指标
      store.saveBaseMetric({
        metric_id: formData.metric_id,
        metric_name: formData.metric_name,
        group_id: formData.group_id,
        aql_id: formData.aql_id,
        result_mapping: formData.result_mapping,
        value_type: formData.value_type,
        cache_ttl: parseInt(formData.cache_ttl)
      });
      
      // 隐藏表单
      hideBaseMetricForm();
    }
    
    return {
      store,
      groupFilter,
      formVisible,
      isEdit,
      formData,
      filteredBaseMetrics,
      showBaseMetricForm,
      hideBaseMetricForm,
      editBaseMetric,
      deleteBaseMetric,
      handleBaseMetricSubmit
    };
  }
};
</script> 