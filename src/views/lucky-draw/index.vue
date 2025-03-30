<template>
  <div class="lucky-draw-container">
    <div class="exit-button" @click="goBack">
      <el-icon><Back /></el-icon>
      <span>返回</span>
    </div>

    <div class="page-header">
      <h1>幸运抽奖</h1>
    </div>

    <div class="draw-content">
      <div class="sphere-container" ref="sphereContainer">
        <div class="name-sphere" ref="nameSphere"></div>
      </div>

      <div class="control-panel">
        <div class="prize-info">
          <h2>奖品信息</h2>
          <div class="prize-cards">
            <el-card v-for="(prize, index) in prizes" :key="index" :class="{ active: currentPrizeIndex === index }">
              <div class="prize-card-content">
                <div class="prize-icon" :style="{ backgroundColor: prize.color }">
                  <el-icon><Present /></el-icon>
                </div>
                <div class="prize-detail">
                  <div class="prize-name">{{ prize.name }}</div>
                  <div class="prize-count">
                    剩余: {{ prize.count - (winnerLists[index]?.length || 0) }}/{{ prize.count }}
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </div>

        <div class="draw-controls">
          <el-select v-model="currentPrizeIndex" placeholder="选择奖品">
            <el-option
              v-for="(prize, index) in prizes"
              :key="index"
              :label="prize.name"
              :value="index"
              :disabled="prize.count <= (winnerLists[index]?.length || 0)"
            ></el-option>
          </el-select>
          
          <el-input-number 
            v-model="drawCount" 
            :min="1" 
            :max="maxDrawCount" 
            :step="1" 
            :disabled="isDrawing" 
            placeholder="抽取人数">
          </el-input-number>
          
          <el-button 
            type="danger" 
            size="large" 
            :loading="isDrawing" 
            :disabled="!canDraw"
            @click="startLuckyDraw">
            {{ isDrawing ? '抽取中...' : '开始抽奖' }}
          </el-button>
        </div>
      </div>
    </div>

    <div class="current-drawing" v-if="isDrawing || currentWinner">
      <div class="drawing-animation" v-if="isDrawing">
        <div class="spinning-light"></div>
        <div class="name-roulette">
          <div class="name-list" :style="{ transform: `translateY(-${nameScrollOffset}px)` }">
            <div class="name-item" v-for="(name, index) in shuffledNames" :key="index">
              {{ name }}
            </div>
          </div>
        </div>
      </div>
      <div class="winner-announcement" v-if="currentWinner && !isDrawing">
        <div class="winner-title">
          <span>恭喜以下{{ winnerList.length }}位幸运星获得</span>
          <span class="prize-name">{{ currentPrize.name }}</span>
        </div>
        <div class="winner-list">
          <div 
            class="winner-item" 
            v-for="(winner, index) in winnerList" 
            :key="index"
            :style="{ animationDelay: `${index * 0.1}s` }">
            {{ winner }}
          </div>
        </div>
        <div class="action-buttons">
          <el-button type="primary" @click="confirmWinners">确认结果</el-button>
          <el-button @click="redraw">重新抽取</el-button>
        </div>
      </div>
    </div>

    <div class="result-history">
      <el-divider>抽奖历史</el-divider>
      <el-collapse accordion>
        <el-collapse-item 
          v-for="(prize, prizeIndex) in prizes" 
          :key="prizeIndex"
          :title="`${prize.name} (${winnerLists[prizeIndex]?.length || 0}/${prize.count})`"
          :disabled="!winnerLists[prizeIndex]?.length">
          <div class="history-winners">
            <el-tag 
              v-for="(winner, winnerIndex) in winnerLists[prizeIndex]" 
              :key="winnerIndex"
              effect="dark"
              :color="prize.color"
              class="winner-tag">
              {{ winner }}
            </el-tag>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Present, Back } from '@element-plus/icons-vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

const router = useRouter()

// 返回主页
const goBack = () => {
  router.push('/home')
}

// 奖品数据
const prizes = ref([
  { name: '一等奖', count: 1, color: '#E74C3C' },
  { name: '二等奖', count: 3, color: '#3498DB' },
  { name: '三等奖', count: 5, color: '#2ECC71' },
  { name: '纪念奖', count: 10, color: '#F39C12' }
])

// 参与者名单
const participants = ref([
  '吕和翔', '黄洵', '李彦龙', '李紫安', '王秀英', '胡坤',
  '吕和翔', '黄洵', '李彦龙', '李紫安', '王秀英', '胡坤',
  '吕和翔', '黄洵', '李彦龙', '李紫安', '王秀英', '胡坤',
  '吕和翔', '黄洵', '李彦龙', '李紫安', '王秀英', '胡坤',
  '吕和翔', '黄洵', '李彦龙', '李紫安', '王秀英', '胡坤',
  '吕和翔', '黄洵', '李彦龙', '李紫安', '王秀英', '胡坤',
  '吕和翔', '黄洵', '李彦龙', '李紫安', '王秀英', '胡坤',
  '吕和翔', '黄洵', '李彦龙', '李紫安', '王秀英', '胡坤',
  '吕和翔', '黄洵', '李彦龙', '李紫安', '王秀英', '胡坤',
  '吕和翔', '黄洵', '李彦龙', '李紫安', '王秀英', '胡坤'
])

// 三维场景相关
const sphereContainer = ref(null)
const nameSphere = ref(null)
let scene, camera, renderer, controls
let nameObjects = []
let animationFrame = null
let particles = [] // 添加粒子数组

// 抽奖控制
const currentPrizeIndex = ref(0)
const drawCount = ref(1)
const isDrawing = ref(false)
const winnerLists = ref([])
const currentWinner = ref(null)
const winnerList = ref([])
const nameScrollOffset = ref(0)
const shuffledNames = ref([])

// 计算属性
const currentPrize = computed(() => prizes.value[currentPrizeIndex.value] || prizes.value[0])

const maxDrawCount = computed(() => {
  const prize = prizes.value[currentPrizeIndex.value]
  if (!prize) return 1
  const alreadyDrawn = winnerLists.value[currentPrizeIndex.value]?.length || 0
  return Math.min(5, prize.count - alreadyDrawn, participants.value.length)
})

const canDraw = computed(() => {
  if (isDrawing.value) return false
  if (participants.value.length === 0) return false
  
  const prize = prizes.value[currentPrizeIndex.value]
  if (!prize) return false
  
  const alreadyDrawn = winnerLists.value[currentPrizeIndex.value]?.length || 0
  return alreadyDrawn < prize.count
})

// 监听抽奖数量变化
watch(currentPrizeIndex, () => {
  drawCount.value = Math.min(drawCount.value, maxDrawCount.value)
})

// 创建粒子系统
const createParticles = () => {
  // 清除现有粒子
  particles.forEach(particle => scene.remove(particle))
  particles = []
  
  // 创建粒子材质
  const particleMaterial = new THREE.SpriteMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5
  })
  
  // 创建100个粒子
  for (let i = 0; i < 100; i++) {
    const particle = new THREE.Sprite(particleMaterial.clone())
    
    // 随机位置
    const radius = 40 + Math.random() * 20
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    
    particle.position.x = radius * Math.sin(phi) * Math.cos(theta)
    particle.position.y = radius * Math.sin(phi) * Math.sin(theta)
    particle.position.z = radius * Math.cos(phi)
    
    // 随机大小
    const size = 0.5 + Math.random() * 1.5
    particle.scale.set(size, size, 1)
    
    // 添加动画属性
    particle.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05
      ),
      size: size,
      glowing: {
        min: size * 0.7,
        max: size * 1.3,
        speed: 0.01 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2
      }
    }
    
    scene.add(particle)
    particles.push(particle)
  }
}

// 创建装饰性的光环
const createHalo = () => {
  // 创建光环几何体
  const haloGeometry = new THREE.RingGeometry(25, 28, 64)
  const haloMaterial = new THREE.MeshBasicMaterial({
    color: 0x3498db,
    opacity: 0.2,
    transparent: true,
    side: THREE.DoubleSide
  })
  const halo = new THREE.Mesh(haloGeometry, haloMaterial)
  
  // 让光环围绕y轴倾斜
  halo.rotation.x = Math.PI / 2
  
  scene.add(halo)
  
  // 创建第二个光环
  const halo2Geometry = new THREE.RingGeometry(30, 32, 64)
  const halo2Material = new THREE.MeshBasicMaterial({
    color: 0xe74c3c,
    opacity: 0.2,
    transparent: true,
    side: THREE.DoubleSide
  })
  const halo2 = new THREE.Mesh(halo2Geometry, halo2Material)
  
  // 让第二个光环围绕x轴倾斜
  halo2.rotation.y = Math.PI / 2
  
  scene.add(halo2)
  
  return [halo, halo2]
}

// 修改动画循环函数，更新粒子和光环
const animate = () => {
  animationFrame = requestAnimationFrame(animate)
  
  // 在非抽奖状态下保持球体自动旋转
  if (!isDrawing.value) {
    // 手动旋转整个场景，效果更好
    scene.rotation.y += 0.001
  }
  
  // 更新粒子动画
  const time = Date.now() * 0.001
  particles.forEach(particle => {
    // 移动粒子
    particle.position.add(particle.userData.velocity)
    
    // 应用闪烁效果
    const glowing = particle.userData.glowing
    const scale = glowing.min + Math.sin(time * glowing.speed + glowing.phase) * (glowing.max - glowing.min)
    particle.scale.set(scale, scale, 1)
    
    // 如果粒子移动太远，重新放置到球体表面
    if (particle.position.length() > 70) {
      const radius = 40 + Math.random() * 20
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      particle.position.x = radius * Math.sin(phi) * Math.cos(theta)
      particle.position.y = radius * Math.sin(phi) * Math.sin(theta)
      particle.position.z = radius * Math.cos(phi)
    }
  })
  
  controls.update()
  renderer.render(scene, camera)
}

// 修改初始化3D场景函数
const initThreeDScene = () => {
  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000833) // 深蓝色背景
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    sphereContainer.value.clientWidth / sphereContainer.value.clientHeight,
    0.1,
    1000
  )
  camera.position.z = 40
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(sphereContainer.value.clientWidth, sphereContainer.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio) // 优化高DPI设备显示
  nameSphere.value.appendChild(renderer.domElement)
  
  // 添加控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.rotateSpeed = 0.5
  controls.autoRotate = true
  controls.autoRotateSpeed = 1.0
  
  // 创建名字云
  createNameCloud()
  
  // 创建粒子系统
  createParticles()
  
  // 创建装饰光环
  createHalo()
  
  // 添加灯光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)
  
  // 添加点光源使球体更有立体感
  const pointLight1 = new THREE.PointLight(0x3498db, 1, 50)
  pointLight1.position.set(20, 20, 20)
  scene.add(pointLight1)
  
  const pointLight2 = new THREE.PointLight(0xe74c3c, 1, 50)
  pointLight2.position.set(-20, -20, 20)
  scene.add(pointLight2)
  
  // 开始动画循环
  animate()
  
  // 响应窗口大小变化
  window.addEventListener('resize', onWindowResize)
}

// 修改createNameCloud函数，优化名字样式
const createNameCloud = () => {
  // 清除之前的名字对象
  nameObjects.forEach(obj => scene.remove(obj))
  nameObjects = []
  
  const radius = 20
  const availableNames = participants.value.filter(name => 
    !winnerLists.value.some(winners => winners?.includes(name))
  )
  
  const nameCount = availableNames.length
  
  // 创建名字精灵
  availableNames.forEach((name, i) => {
    // 创建画布来渲染文字
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = 256
    canvas.height = 64
    
    // 清空画布
    context.clearRect(0, 0, canvas.width, canvas.height)
    
    // 设置文字阴影
    context.shadowColor = 'rgba(0, 0, 0, 0.9)'  // 增强阴影不透明度
    context.shadowBlur = 6  // 增加阴影模糊度
    context.shadowOffsetX = 2
    context.shadowOffsetY = 2
    
    // 设置文字样式 - 添加更亮的渐变色
    const gradient = context.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, '#ffffff')  // 纯白色开始
    gradient.addColorStop(1, '#e0f7fa')  // 浅蓝色结束
    
    context.font = 'bold 26px Arial'  // 增大字体
    context.fillStyle = gradient
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    
    // 绘制文字背景 - 更加明显的半透明圆角矩形
    const textMetrics = context.measureText(name)
    const textWidth = textMetrics.width
    const padding = 12  // 增加内边距
    
    context.beginPath()
    context.roundRect(
      (canvas.width - textWidth) / 2 - padding,
      (canvas.height - 26) / 2 - padding,
      textWidth + padding * 2,
      26 + padding * 2,
      8
    )
    context.fillStyle = 'rgba(0, 10, 30, 0.7)'  // 更深的背景色，增加不透明度
    context.fill()
    
    // 添加更明显的发光边框
    context.strokeStyle = 'rgba(255, 255, 255, 0.8)'  // 增加边框不透明度
    context.lineWidth = 2  // 增加边框宽度
    context.stroke()
    
    // 绘制文字外发光效果
    context.shadowColor = 'rgba(100, 200, 255, 0.8)'  // 蓝色发光
    context.shadowBlur = 10
    context.shadowOffsetX = 0
    context.shadowOffsetY = 0
    
    // 最后绘制文字
    context.fillStyle = '#ffffff'  // 纯白色文字
    context.fillText(name, canvas.width / 2, canvas.height / 2)
    
    // 创建纹理
    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({ 
      map: texture, 
      transparent: true,
      opacity: 0.95  // 略微增加不透明度
    })
    const sprite = new THREE.Sprite(material)
    
    // 根据斐波那契球分布算法均匀分布在球面上
    const phi = Math.acos(-1 + (2 * i) / nameCount)
    const theta = Math.sqrt(nameCount * Math.PI) * phi
    
    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.sin(phi) * Math.sin(theta)
    const z = radius * Math.cos(phi)
    
    sprite.position.set(x, y, z)
    sprite.scale.set(6, 1.5, 1)  // 略微放大整体尺寸
    
    // 存储名字信息，方便后续动画
    sprite.userData = { name: name }
    
    scene.add(sprite)
    nameObjects.push(sprite)
  })
}

// 窗口大小变化响应
const onWindowResize = () => {
  if (!sphereContainer.value) return
  
  camera.aspect = sphereContainer.value.clientWidth / sphereContainer.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(sphereContainer.value.clientWidth, sphereContainer.value.clientHeight)
}

// 开始抽奖
const startLuckyDraw = () => {
  if (!canDraw.value) return
  
  isDrawing.value = true
  currentWinner.value = null
  winnerList.value = []
  
  // 获取可抽取的名单（排除已中奖的人）
  const availableNames = participants.value.filter(name => 
    !winnerLists.value.some(winners => winners?.includes(name))
  )
  
  // 打乱名单
  shuffledNames.value = [...availableNames].sort(() => Math.random() - 0.5)
  
  // 设置滚动动画
  let offset = 0
  const scrollAnimation = () => {
    nameScrollOffset.value = offset
    offset += 10
    if (isDrawing.value) {
      requestAnimationFrame(scrollAnimation)
    }
  }
  scrollAnimation()
  
  // 增强抽奖动画效果：让3D球体高速旋转并加入缩放和颜色变化
  
  // 1. 保存原始颜色
  const originalColors = nameObjects.map(obj => {
    if (obj.material && obj.material.color) {
      return obj.material.color.clone()
    }
    return null
  })
  
  // 2. 创建球体高速旋转的动画
  gsap.to(scene.rotation, {
    duration: 3,
    x: Math.random() * Math.PI * 2,
    y: Math.random() * Math.PI * 2,
    z: Math.random() * Math.PI * 2,
    ease: "power2.inOut"
  })
  
  // 3. 创建相机动画
  gsap.to(camera.position, {
    duration: 2,
    z: 60, // 拉远相机
    ease: "power1.inOut",
    repeat: 1,
    yoyo: true
  })
  
  // 4. 为名字对象添加动画
  nameObjects.forEach((obj, index) => {
    // 随机颜色变化
    if (obj.material) {
      gsap.to(obj.material, {
        duration: 0.2,
        opacity: 0.6 + Math.random() * 0.4,
        repeat: 10,
        yoyo: true
      })
      
      // 随机将一些对象变成金色（表示可能的获奖者）
      if (Math.random() > 0.7) {
        gsap.to(obj.material.color, {
          r: 1, g: 0.84, b: 0,
          duration: 0.5,
          repeat: 5,
          yoyo: true
        })
      }
    }
    
    // 随机缩放效果
    gsap.to(obj.scale, {
      duration: 0.3,
      x: 5 + Math.random() * 3,
      y: 1.25 + Math.random() * 0.75,
      repeat: 6,
      yoyo: true,
      delay: index * 0.01 % 0.5
    })
  })
  
  // 随机选择获奖者
  setTimeout(() => {
    // 从有效参与者中随机选择
    const selectedCount = Math.min(drawCount.value, availableNames.length)
    const selectedWinners = []
    
    // 随机抽取不重复的获奖者
    const selected = new Set()
    while (selected.size < selectedCount) {
      const randomIndex = Math.floor(Math.random() * availableNames.length)
      if (!selected.has(randomIndex)) {
        selected.add(randomIndex)
        selectedWinners.push(availableNames[randomIndex])
      }
    }
    
    // 找到中奖者对应的3D对象，并添加特殊动画效果
    nameObjects.forEach((obj, index) => {
      // 恢复原始颜色和大小
      if (obj.material && originalColors[index]) {
        gsap.to(obj.material.color, {
          r: originalColors[index].r,
          g: originalColors[index].g,
          b: originalColors[index].b,
          duration: 0.5
        })
        
        gsap.to(obj.material, {
          opacity: 1,
          duration: 0.5
        })
      }
      
      gsap.to(obj.scale, {
        x: 5,
        y: 1.25,
        duration: 0.5
      })
    })
    
    // 结束抽奖
    isDrawing.value = false
    currentWinner.value = selectedWinners.join(', ')
    winnerList.value = selectedWinners
    
    // 高亮显示获奖者
    nameObjects.forEach(obj => {
      if (obj.userData && selectedWinners.includes(obj.userData.name)) {
        // 获奖者变为金色并放大
        gsap.to(obj.material.color, {
          r: 1, g: 0.84, b: 0,
          duration: 1
        })
        
        gsap.to(obj.scale, {
          x: 8,
          y: 2,
          duration: 1,
          repeat: -1,
          yoyo: true
        })
        
        // 让获奖者对象围绕中心旋转
        const targetPosition = obj.position.clone()
        gsap.to(obj.position, {
          x: targetPosition.x * 0.8,
          y: targetPosition.y * 0.8,
          z: targetPosition.z * 0.8,
          duration: 2,
          repeat: -1,
          yoyo: true
        })
      } else {
        // 非获奖者变暗
        gsap.to(obj.material, {
          opacity: 0.3,
          duration: 1
        })
      }
    })
    
    // 显示获奖结果
    ElMessage.success(`恭喜 ${selectedWinners.join(', ')} 获得${currentPrize.value.name}!`)
    
    // 让相机回到正常位置
    gsap.to(controls.target, {
      duration: 2,
      x: 0,
      y: 0,
      z: 0
    })
    
  }, 3000) // 3秒后显示结果
}

// 确认中奖结果
const confirmWinners = () => {
  // 初始化当前奖项的获奖者列表
  if (!winnerLists.value[currentPrizeIndex.value]) {
    winnerLists.value[currentPrizeIndex.value] = []
  }
  
  // 添加新的获奖者
  winnerLists.value[currentPrizeIndex.value] = [
    ...winnerLists.value[currentPrizeIndex.value] || [],
    ...winnerList.value
  ]
  
  // 停止所有正在进行的动画
  gsap.killTweensOf(nameObjects)
  gsap.killTweensOf(scene.rotation)
  gsap.killTweensOf(camera.position)
  
  // 重新渲染名字云
  createNameCloud()
  
  // 重置状态
  currentWinner.value = null
  winnerList.value = []
  
  ElMessage.success('已确认中奖结果')
}

// 重新抽取
const redraw = () => {
  currentWinner.value = null
  winnerList.value = []
  startLuckyDraw()
}

// 组件挂载
onMounted(() => {
  // 使用nextTick确保DOM完全渲染后再初始化3D场景
  nextTick(() => {
    try {
      if (sphereContainer.value && nameSphere.value) {
        initThreeDScene()
      } else {
        console.warn('3D容器元素不存在，无法初始化场景')
      }
    } catch (error) {
      console.error('初始化3D场景失败:', error)
    }
  })
})

// 组件卸载前清理
onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
  
  window.removeEventListener('resize', onWindowResize)
  
  // 清理THREE.js资源
  if (renderer) {
    renderer.dispose()
    renderer = null
  }
  
  if (controls) {
    controls.dispose()
    controls = null
  }
  
  // 清理场景中的对象
  if (scene) {
    while(scene.children.length > 0) { 
      const object = scene.children[0]
      if (object.geometry) object.geometry.dispose()
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose())
        } else {
          object.material.dispose()
        }
      }
      scene.remove(object)
    }
    scene = null
  }
  
  // 清理数组和引用
  nameObjects = []
  particles = []
  camera = null
})
</script>

<style lang="less" scoped>
.lucky-draw-container {
  position: relative;
  min-height: 100vh;
  background-image: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
  padding: 20px;
  color: #fff;
  
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .exit-button {
    position: fixed;
    top: 20px;
    left: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(26, 42, 108, 0.7);
    color: #fff;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    z-index: 10;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    
    &:hover {
      background: rgba(41, 67, 172, 0.8);
      border-color: rgba(255, 255, 255, 0.4);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
      transform: translateY(-2px);
    }
    
    .el-icon {
      font-size: 18px;
      color: #fff;
    }
    
    span {
      font-size: 16px;
      font-weight: 500;
    }
  }

  .page-header {
    text-align: center;
    padding: 20px 0;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h1 {
      font-size: 32px;
      margin: 0;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      color: #ffffff;
      font-weight: 700;
      letter-spacing: 1px;
      position: relative;
      display: inline-block;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        width: 60%;
        height: 3px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
        transform: translateX(-50%);
        border-radius: 3px;
      }
    }
  }
  
  .draw-content {
    position: relative;
    z-index: 1;
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
    
    @media (max-width: 900px) {
      flex-direction: column;
    }
  }
  
  .sphere-container {
    flex: 3;
    height: 500px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100px;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), transparent);
      z-index: 1;
      pointer-events: none;
    }
    
    .name-sphere {
      width: 100%;
      height: 100%;
    }
  }
  
  .control-panel {
    flex: 1;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    
    h2 {
      font-size: 22px;
      margin: 0 0 15px 0;
      color: #ffffff;
      font-weight: 600;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
  }
  
  .prize-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    :deep(.el-card) {
      background: rgba(255, 255, 255, 0.15);
      border: none;
      backdrop-filter: blur(10px);
      transition: all 0.3s;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      
      &.active {
        transform: scale(1.05);
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
      }
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
        z-index: 0;
      }
      
      .el-card__body {
        padding: 10px;
        position: relative;
        z-index: 1;
      }
    }
    
    .prize-card-content {
      display: flex;
      align-items: center;
      
      .prize-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        color: white;
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        position: relative;
        overflow: hidden;
        
        &::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          width: calc(100% + 20px);
          height: calc(100% + 20px);
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          animation: shine 2s infinite;
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        .el-icon {
          font-size: 18px;
          filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
        }
      }
      
      .prize-detail {
        .prize-name {
          font-weight: bold;
          font-size: 16px;
          color: #ffffff;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          letter-spacing: 0.5px;
        }
        
        .prize-count {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 3px;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
        }
      }
    }
  }
  
  .draw-controls {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
    
    :deep(.el-select), :deep(.el-input-number) {
      .el-input__wrapper {
        background: rgba(30, 41, 78, 0.65); // 调整背景色，更深一些
        box-shadow: none;
        border: 1px solid rgba(255, 255, 255, 0.2);
        
        &:hover {
          background: rgba(40, 55, 98, 0.7);
          border-color: rgba(255, 255, 255, 0.3);
        }
      }
      
      .el-input__inner {
        color: #ffffff;
        font-weight: 500; // 加粗文本
      }

      .el-input__suffix, .el-input-number__decrease, .el-input-number__increase {
        color: rgba(255, 255, 255, 0.9); // 调整按钮颜色
      }
    }
    
    .el-button {
      height: 50px;
      font-size: 18px;
      font-weight: 600; // 加粗按钮文字
    }
  }
  
  .current-drawing {
    background: rgba(0, 0, 0, 0.5); // 增加背景不透明度
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.1);
    
    .drawing-animation {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      .spinning-light {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background: radial-gradient(circle, white, transparent);
        animation: spin 2s linear infinite;
        margin-bottom: 20px;
        position: relative;
        
        // 添加光芒四射效果
        &::before, &::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 180%;
          height: 180%;
          border-radius: 50%;
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.2);
          animation: pulse 2s ease-out infinite;
        }
        
        &::after {
          width: 140%;
          height: 140%;
          animation-delay: 0.5s;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg) scale(0.8); opacity: 0.7; }
          50% { transform: rotate(180deg) scale(1.2); opacity: 1; }
          100% { transform: rotate(360deg) scale(0.8); opacity: 0.7; }
        }
        
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
      }
      
      .name-roulette {
        width: 300px;
        height: 60px;
        overflow: hidden;
        border: 2px solid white;
        border-radius: 10px;
        position: relative;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        
        &::before, &::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 20px;
          z-index: 1;
          pointer-events: none;
        }
        
        &::before {
          top: 0;
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
        }
        
        &::after {
          bottom: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
        }
        
        .name-list {
          transition: transform 0.1s linear;
          
          .name-item {
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #ffffff; // 确保纯白色
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 5px rgba(0, 183, 255, 0.5); // 双重阴影效果
          }
        }
      }
    }
    
    .winner-announcement {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .winner-title {
        font-size: 26px; // 增大字体
        margin-bottom: 20px;
        text-align: center;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8); // 增强阴影
        
        .prize-name {
          font-size: 30px;
          font-weight: bold;
          color: #ffffff;
          margin-left: 5px;
          position: relative;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          animation: gentle-pulse 2s ease-in-out infinite alternate;
          
          @keyframes gentle-pulse {
            0% { opacity: 0.8; text-shadow: 0 0 10px rgba(255, 255, 255, 0.3); }
            100% { opacity: 1; text-shadow: 0 0 20px rgba(255, 255, 255, 0.8); }
          }
        }
      }
      
      .winner-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 15px;
        margin-bottom: 30px;
        
        .winner-item {
          background: rgba(255, 255, 255, 0.2);
          padding: 12px 24px;
          border-radius: 30px;
          font-size: 20px;
          font-weight: bold;
          color: #ffffff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
          animation: popIn 0.5s ease forwards;
          opacity: 0;
          transform: scale(0.5);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(5px);
          
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%);
            z-index: -1;
          }
          
          &::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%);
            transform: rotate(30deg);
            animation: shimmer 3s infinite;
            z-index: -1;
          }
          
          @keyframes shimmer {
            0% { transform: rotate(30deg) translateX(-100%); }
            100% { transform: rotate(30deg) translateX(100%); }
          }
          
          @keyframes popIn {
            0% { opacity: 0; transform: scale(0.5); }
            70% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
          }
        }
      }
      
      .action-buttons {
        display: flex;
        gap: 15px;

        .el-button {
          font-weight: 600; // 加粗按钮文字
          font-size: 16px; // 增大字体
        }
      }
    }
  }
  
  .result-history {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    :deep(.el-divider) {
      .el-divider__text {
        background: transparent;
        color: #ffffff;
        font-size: 20px;
        font-weight: 600;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
    }
    
    :deep(.el-collapse) {
      border: none;
      background: transparent;
      
      .el-collapse-item {
        margin-bottom: 10px;
        
        .el-collapse-item__header {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-weight: bold;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(5px);
          
          &.is-active {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            background: rgba(255, 255, 255, 0.2);
          }
        }
        
        .el-collapse-item__wrap {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          backdrop-filter: blur(5px);
          
          .el-collapse-item__content {
            color: #ffffff;
            padding: 15px;
          }
        }
      }
    }
    
    .history-winners {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      
      .winner-tag {
        padding: 6px 12px;
        border-radius: 4px;
        margin-right: 0;
        font-weight: 600;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.4);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
        background: rgba(255, 255, 255, 0.2) !important;
        border: none;
        backdrop-filter: blur(5px);
      }
    }
  }
}
</style> 