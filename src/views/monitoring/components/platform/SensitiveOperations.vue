<template>
  <div class="sensitive-operations">
    <div class="section-header">
      <h3>敏感操作监控</h3>
      <div class="header-actions">
        <el-button size="small" type="primary">查看日志</el-button>
      </div>
    </div>
    
    <el-table :data="sensitiveOperations" style="width: 100%" stripe>
      <el-table-column prop="time" label="时间" width="180" />
      <el-table-column prop="user" label="用户" width="120" />
      <el-table-column prop="operation" label="操作" />
      <el-table-column prop="target" label="目标对象" />
      <el-table-column prop="ip" label="IP地址" width="140" />
      <el-table-column label="风险等级" width="100">
        <template #default="scope">
          <el-tag 
            :type="scope.row.risk === 'high' ? 'danger' : scope.row.risk === 'medium' ? 'warning' : 'success'"
            size="small"
          >
            {{ scope.row.risk === 'high' ? '高' : scope.row.risk === 'medium' ? '中' : '低' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 敏感操作记录
const sensitiveOperations = ref([
  { 
    time: '2023-05-15 10:30:45', 
    user: '管理员', 
    operation: '删除数据', 
    target: '客户信息表', 
    ip: '192.168.1.100', 
    risk: 'high' 
  },
  { 
    time: '2023-05-15 09:45:12', 
    user: '张三', 
    operation: '修改配置', 
    target: '系统参数', 
    ip: '192.168.1.101', 
    risk: 'medium' 
  },
  { 
    time: '2023-05-15 09:20:33', 
    user: '李四', 
    operation: '导出数据', 
    target: '交易记录', 
    ip: '192.168.1.102', 
    risk: 'medium' 
  },
  { 
    time: '2023-05-15 08:15:27', 
    user: '王五', 
    operation: '修改权限', 
    target: '用户角色', 
    ip: '192.168.1.103', 
    risk: 'high' 
  },
  { 
    time: '2023-05-15 08:05:18', 
    user: '赵六', 
    operation: '查看日志', 
    target: '系统日志', 
    ip: '192.168.1.104', 
    risk: 'low' 
  }
])
</script>

<style lang="less" scoped>
.sensitive-operations {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      font-size: 18px;
      color: #1a3a5f;
    }
  }
}
</style> 