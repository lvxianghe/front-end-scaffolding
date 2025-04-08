<template>
  <div class="aql-config-section">
    <div class="row">
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5>AQL配置列表</h5>
            <button class="btn btn-sm btn-primary" @click="showAqlForm">新增</button>
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
                    <th>AQL ID</th>
                    <th>返回类型</th>
                    <th>创建时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="aql in filteredAqlConfigs" :key="aql.aql_id">
                    <td>{{ aql.aql_id }}</td>
                    <td>{{ aql.result_type }}</td>
                    <td>{{ aql.created_time }}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary btn-action" @click="editAql(aql.aql_id)">编辑</button>
                      <button class="btn btn-sm btn-outline-danger btn-action" @click="deleteAql(aql.aql_id)">删除</button>
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
            <h5>{{ isEdit ? '编辑' : '新增' }} AQL 配置</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleAqlSubmit">
              <div class="mb-3">
                <label for="aql-id" class="form-label">AQL ID</label>
                <input type="text" class="form-control" id="aql-id" v-model="formData.aql_id" placeholder="如: user_connections">
              </div>
              <div class="mb-3">
                <label for="aql-template" class="form-label">AQL 模板</label>
                <textarea 
                  class="form-control" 
                  id="aql-template" 
                  v-model="formData.aql_template" 
                  rows="5"
                  placeholder="输入 AQL 查询模板"
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="result-type" class="form-label">返回类型</label>
                <select class="form-select" v-model="formData.result_type">
                  <option value="SINGLE_VALUE">单值 (SINGLE_VALUE)</option>
                  <option value="LIST">列表 (LIST)</option>
                  <option value="MAP">映射 (MAP)</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">参数定义</label>
                <div id="parameters-container">
                  <div v-for="(param, index) in formData.parameters" :key="index" class="parameter-row mb-3">
                    <div class="row">
                      <div class="col-md-3">
                        <input type="text" class="form-control" v-model="param.name" placeholder="参数名称">
                      </div>
                      <div class="col-md-3">
                        <select class="form-select" v-model="param.type">
                          <option value="string">字符串 (string)</option>
                          <option value="int">整数 (int)</option>
                          <option value="double">浮点数 (double)</option>
                          <option value="bool">布尔值 (bool)</option>
                        </select>
                      </div>
                      <div class="col-md-3">
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" v-model="param.required">
                          <label class="form-check-label">必填</label>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <input type="text" class="form-control" v-model="param.default" placeholder="默认值">
                      </div>
                    </div>
                    <button type="button" class="remove-btn" @click="removeParameter(index)">&times;</button>
                  </div>
                </div>
                <button type="button" class="btn btn-sm btn-outline-primary mt-2" @click="addParameter">添加参数</button>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary" @click="hideAqlForm">取消</button>
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
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useStore } from '../store';

export default {
  name: 'AqlConfig',
  setup() {
    const store = useStore();
    
    const groupFilter = ref('');
    const formVisible = ref(false);
    const isEdit = ref(false);
    const formData = reactive({
      aql_id: '',
      aql_template: '',
      result_type: 'SINGLE_VALUE',
      parameters: []
    });
    
    const filteredAqlConfigs = computed(() => {
      if (!groupFilter.value) {
        return store.aqlConfigs;
      }
      return store.aqlConfigs.filter(aql => aql.group_id === groupFilter.value);
    });
    
    // 显示表单
    function showAqlForm() {
      formVisible.value = true;
      isEdit.value = false;
      resetForm();
    }
    
    // 隐藏表单
    function hideAqlForm() {
      formVisible.value = false;
    }
    
    // 重置表单
    function resetForm() {
      formData.aql_id = '';
      formData.aql_template = '';
      formData.result_type = 'SINGLE_VALUE';
      formData.parameters = [];
    }
    
    // 添加参数
    function addParameter() {
      formData.parameters.push({
        name: '',
        type: 'string',
        required: false,
        default: ''
      });
    }
    
    // 删除参数
    function removeParameter(index) {
      formData.parameters.splice(index, 1);
    }
    
    // 编辑 AQL
    function editAql(aqlId) {
      const aql = store.aqlConfigs.find(a => a.aql_id === aqlId);
      if (!aql) return;
      
      isEdit.value = true;
      formVisible.value = true;
      
      formData.aql_id = aql.aql_id;
      formData.aql_template = aql.aql_template;
      formData.result_type = aql.result_type;
      formData.parameters = JSON.parse(JSON.stringify(aql.parameters || []));
    }
    
    // 删除 AQL
    function deleteAql(aqlId) {
      if (!confirm(`确定要删除 AQL "${aqlId}" 吗？相关的基础指标也会受到影响！`)) return;
      
      // 检查依赖
      const dependentMetrics = store.baseMetrics.filter(m => m.aql_id === aqlId);
      if (dependentMetrics.length > 0) {
        alert(`无法删除：该 AQL 被以下基础指标使用：\n${dependentMetrics.map(m => m.metric_id).join(', ')}`);
        return;
      }
      
      // 删除 AQL
      store.deleteAql(aqlId);
    }
    
    // 处理表单提交
    function handleAqlSubmit() {
      // 验证表单
      if (!formData.aql_id) {
        alert('请输入 AQL ID');
        return;
      }
      
      if (!formData.aql_template) {
        alert('请输入 AQL 模板');
        return;
      }
      
      // 保存 AQL 配置
      store.saveAql({
        aql_id: formData.aql_id,
        aql_template: formData.aql_template,
        result_type: formData.result_type,
        parameters: formData.parameters,
        created_time: new Date().toLocaleString()
      });
      
      // 隐藏表单
      hideAqlForm();
    }
    
    return {
      store,
      groupFilter,
      formVisible,
      isEdit,
      formData,
      filteredAqlConfigs,
      showAqlForm,
      hideAqlForm,
      addParameter,
      removeParameter,
      editAql,
      deleteAql,
      handleAqlSubmit
    };
  }
};
</script> 