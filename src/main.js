import './assets/css/global.css'
import { createApp } from 'vue'
import App from './App.vue'
// 导入 Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// 导入 Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const app = createApp(App)
// 其他设置...
app.mount('#app')

// 强力清理函数
const forceCleanupNavs = () => {
  try {
    console.log('执行强力清理...')
    // 获取所有导航栏
    const navs = document.querySelectorAll('.grid-nav')
    
    if (navs.length > 1) {
      console.warn(`发现${navs.length}个导航栏，正在清理...`)
      
      // 保留第一个，移除其他的
      for (let i = 1; i < navs.length; i++) {
        try {
          const nav = navs[i]
          if (nav && nav.parentNode) {
            console.log(`移除第${i+1}个导航栏`)
            nav.parentNode.removeChild(nav)
          }
        } catch (innerError) {
          console.error(`移除导航栏${i+1}失败:`, innerError)
        }
      }
    }
  } catch (error) {
    console.error('执行清理函数出错:', error)
  }
}

// 在页面加载完成后执行清理
window.addEventListener('load', () => {
  setTimeout(forceCleanupNavs, 100)
})

// 定期执行清理
setInterval(forceCleanupNavs, 500)

// 监听点击事件，可能触发路由变化
document.addEventListener('click', () => {
  setTimeout(forceCleanupNavs, 100)
})

// 监听路由变化的另一种方式
window.addEventListener('popstate', () => {
  setTimeout(forceCleanupNavs, 100)
})

// 监听hashchange事件
window.addEventListener('hashchange', () => {
  setTimeout(forceCleanupNavs, 100)
}) 