<template>
  <div class="group-management-section">
    <div class="row">
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5>分组管理</h5>
            <button class="btn btn-sm btn-primary" @click="showGroupForm">新增</button>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>分组ID</th>
                    <th>分组名称</th>
                    <th>描述</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="group in store.groups" :key="group.group_id">
                    <td>{{ group.group_id }}</td>
                    <td>{{ group.group_name }}</td>
                    <td>{{ group.description }}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary btn-action" @click="editGroup(group.group_id)">编辑</button>
                      <button class="btn btn-sm btn-outline-danger btn-action" @click="deleteGroup(group.group_id)">删除</button>
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
            <h5>{{ isEdit ? '编辑' : '新增' }}分组</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleGroupSubmit">
              <div class="mb-3">
                <label for="group-id" class="form-label">分组ID</label>
                <input type="text" class="form-control" id="group-id" v-model="formData.group_id" placeholder="如: risk_metrics">
              </div>
              <div class="mb-3">
                <label for="group-name" class="form-label">分组名称</label>
                <input type="text" class="form-control" id="group-name" v-model="formData.group_name" placeholder="如: 风险指标">
              </div>
              <div class="mb-3">
                <label for="group-description" class="form-label">描述</label>
                <textarea class="form-control" id="group-description" v-model="formData.description" rows="3"></textarea>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" @click="hideGroupForm">取消</button>
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
import { ref, computed } from 'vue';
import { useStore } from '../store';

export default {
  setup() {
    const store = useStore();
    const formVisible = ref(false);
    const isEdit = ref(false);
    const formData = ref({
      group_id: '',
      group_name: '',
      description: ''
    });
    
    // 显示分组表单
    function showGroupForm() {
      formVisible.value = true;
      isEdit.value = false;
      formData.value = {
        group_id: '',
        group_name: '',
        description: ''
      };
    }
    
    // 隐藏分组表单
    function hideGroupForm() {
      formVisible.value = false;
    }
    
    // 编辑分组
    function editGroup(groupId) {
      const group = store.groups.find(g => g.group_id === groupId);
      if (!group) return;
      
      formData.value = { ...group };
      isEdit.value = true;
      formVisible.value = true;
    }
    
    // 删除分组
    function deleteGroup(groupId) {
      if (!confirm(`确定要删除分组 "${groupId}" 吗？`)) return;
      
      // 检查是否有指标使用此分组
      const baseMetricsInGroup = store.baseMetrics.filter(m => m.group_id === groupId);
      const compositeMetricsInGroup = store.compositeMetrics.filter(m => m.group_id === groupId);
      
      if (baseMetricsInGroup.length > 0 || compositeMetricsInGroup.length > 0) {
        alert(`无法删除：该分组下有 ${baseMetricsInGroup.length} 个基础指标和 ${compositeMetricsInGroup.length} 个复合指标`);
        return;
      }
      
      // 删除分组
      store.deleteGroup(groupId);
    }
    
    // 处理表单提交
    function handleGroupSubmit() {
      // 验证表单
      if (!formData.value.group_id) {
        alert('请输入分组ID');
        return;
      }
      
      if (!formData.value.group_name) {
        alert('请输入分组名称');
        return;
      }
      
      // 保存分组
      store.saveGroup({
        group_id: formData.value.group_id,
        group_name: formData.value.group_name,
        description: formData.value.description
      });
      
      // 隐藏表单
      hideGroupForm();
    }
    
    return {
      store,
      formVisible,
      isEdit,
      formData,
      showGroupForm,
      hideGroupForm,
      editGroup,
      deleteGroup,
      handleGroupSubmit
    };
  }
};
</script> 