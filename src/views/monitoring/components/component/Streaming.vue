<template>
  <div class="streaming">
    <div class="section-header">
      <h3>流计算监控</h3>
    </div>
    <div class="placeholder-content">
      <p>流计算监控内容将在这里显示</p>
    </div>
  </div>
</template>

<script setup>
// 流计算监控组件
</script>

<style lang="less" scoped>
.streaming {
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
  
  .placeholder-content {
    background: white;
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    p {
      color: #999;
      font-size: 16px;
    }
  }
}
</style> 