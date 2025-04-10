<template>
  <div class="pomeranian-container">
    <h1>可爱博美犬展示</h1>
    <div class="pomeranian-gallery">
      <div class="pomeranian-card">
        <div class="pomeranian-image">🐶</div>
        <h3>活泼可爱的博美</h3>
        <p>博美犬是一种小型犬种，以其蓬松的被毛和活泼的性格而著名。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 博美犬页面逻辑
</script>

<style lang="less" scoped>
.pomeranian-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  h1 {
    text-align: center;
    margin-bottom: 30px;
    color: #ff85c0;
    font-family: 'Comic Sans MS', cursive, sans-serif;
    text-shadow: 2px 2px 0 #000;
  }
  
  .pomeranian-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }
  
  .pomeranian-card {
    width: 300px;
    border: 4px solid #000;
    border-radius: 20px;
    padding: 20px;
    background: #fff3f8;
    box-shadow: 0 0 0 8px #ffadd2, 0 0 0 12px #000;
    text-align: center;
    
    .pomeranian-image {
      font-size: 100px;
      margin-bottom: 15px;
      filter: drop-shadow(3px 3px 0 #000);
      animation: bounce 2s infinite alternate;
    }
    
    h3 {
      font-family: 'Comic Sans MS', cursive, sans-serif;
      color: #000;
      margin-bottom: 10px;
      font-size: 24px;
      text-shadow: 1px 1px 0 #ff85c0;
    }
    
    p {
      font-family: 'Comic Sans MS', cursive, sans-serif;
      color: #333;
    }
  }
}

@keyframes bounce {
  0% { transform: translateY(0); }
  100% { transform: translateY(-10px); }
}
</style> 