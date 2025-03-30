<template>
  <div class="solar-system-container">
    <!-- 退出按钮 -->
    <div class="exit-button" @click="goBack">
      <el-icon><Back /></el-icon>
      <span>返回</span>
    </div>
    
    <!-- 控制面板 -->
    <div class="control-panel">
      <h3>太阳系控制面板</h3>
      <div class="control-item">
        <span>运行速度:</span>
        <el-radio-group v-model="simulationSpeed" @change="updateSimulationSpeed">
          <el-radio-button label="0.5">慢速</el-radio-button>
          <el-radio-button label="1">中速</el-radio-button>
          <el-radio-button label="2">快速</el-radio-button>
        </el-radio-group>
      </div>
      <div class="control-item">
        <el-switch 
          v-model="showOrbits" 
          @change="toggleOrbits"
          active-text="显示轨道"
        />
      </div>
      <div class="control-item">
        <el-switch 
          v-model="showLabels" 
          @change="toggleLabels"
          active-text="显示标签"
        />
      </div>
    </div>
    
    <!-- 天体信息面板 -->
    <div class="info-panel" v-if="selectedPlanet">
      <h3>{{ selectedPlanet.name }}</h3>
      <p v-if="selectedPlanet.description">{{ selectedPlanet.description }}</p>
      <div class="planet-data">
        <div class="data-item">
          <span class="label">直径:</span>
          <span class="value">{{ selectedPlanet.diameter }} km</span>
        </div>
        <div class="data-item">
          <span class="label">公转周期:</span>
          <span class="value">{{ selectedPlanet.orbitalPeriod }} 地球日</span>
        </div>
        <div class="data-item">
          <span class="label">自转周期:</span>
          <span class="value">{{ selectedPlanet.rotationPeriod }} 地球时</span>
        </div>
      </div>
      <el-button size="small" plain @click="closeInfoPanel">关闭</el-button>
    </div>
    
    <!-- Three.js容器 -->
    <div ref="container" class="canvas-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Back } from '@element-plus/icons-vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const router = useRouter()
const container = ref(null)
const simulationSpeed = ref('1') // 默认为正常速度
const showOrbits = ref(true) // 默认显示轨道
const showLabels = ref(true) // 默认显示标签
const selectedPlanet = ref(null) // 当前选中的天体信息

// 返回上一页
const goBack = () => {
  router.push('/home')
}

// 太阳系渲染相关变量
let scene = null
let camera = null
let renderer = null
let controls = null
let animationId = null
let planetGroup = new THREE.Group()
let orbitsGroup = new THREE.Group()
let labelsGroup = new THREE.Group()
let starField = null

// 行星数据
const planetData = reactive({
  sun: { 
    name: '太阳', 
    object: null, 
    diameter: 1392000,
    orbitalPeriod: 0,
    rotationPeriod: 609.6,
    description: '太阳系的中心天体，一颗G2型主序星。'
  },
  mercury: { 
    name: '水星', 
    object: null, 
    distance: 3, 
    speed: 4.15, 
    diameter: 4879,
    orbitalPeriod: 88,
    rotationPeriod: 1408,
    description: '最靠近太阳的行星，温度差异极大。'
  },
  venus: { 
    name: '金星', 
    object: null, 
    distance: 4.5, 
    speed: 1.62, 
    diameter: 12104,
    orbitalPeriod: 225,
    rotationPeriod: -5832,
    description: '最接近地球的行星，因大气层厚密导致表面温度极高。'
  },
  earth: { 
    name: '地球', 
    object: null, 
    distance: 6.5, 
    speed: 1, 
    diameter: 12756,
    orbitalPeriod: 365.25,
    rotationPeriod: 23.93,
    description: '人类居住的行星，表面70%被水覆盖。'
  },
  mars: { 
    name: '火星', 
    object: null, 
    distance: 9, 
    speed: 0.53, 
    diameter: 6792,
    orbitalPeriod: 687,
    rotationPeriod: 24.62,
    description: '被称为红色星球，表面有许多火山和峡谷。'
  },
  jupiter: { 
    name: '木星', 
    object: null, 
    distance: 16, 
    speed: 0.084, 
    diameter: 142984,
    orbitalPeriod: 4333,
    rotationPeriod: 9.93,
    description: '太阳系最大的行星，有明显的条纹和大红斑。'
  },
  saturn: { 
    name: '土星', 
    object: null, 
    distance: 24, 
    speed: 0.034, 
    diameter: 120536,
    orbitalPeriod: 10759,
    rotationPeriod: 10.66,
    description: '以其壮观的环系统而闻名。'
  },
  uranus: { 
    name: '天王星', 
    object: null, 
    distance: 30, 
    speed: 0.012, 
    diameter: 51118,
    orbitalPeriod: 30687,
    rotationPeriod: -17.24,
    description: '自转轴几乎平行于轨道平面，像滚动前进。'
  },
  neptune: { 
    name: '海王星', 
    object: null, 
    distance: 37, 
    speed: 0.006, 
    diameter: 49528,
    orbitalPeriod: 60190,
    rotationPeriod: 16.11,
    description: '有强大的风暴系统，大蓝斑是其特征之一。'
  },
  pluto: { 
    name: '冥王星', 
    object: null, 
    distance: 44, 
    speed: 0.004, 
    diameter: 2376,
    orbitalPeriod: 90520,
    rotationPeriod: -153.36,
    description: '矮行星，曾经是太阳系第九大行星。'
  }
})

// 月球数据
const moonData = {
  moon: {
    name: '月球',
    distance: 0.8, // 相对于地球的距离
    speed: 13.3, // 相对速度
    diameter: 3475,
    orbitalPeriod: 27.32,
    rotationPeriod: 655.73,
    description: '地球唯一的天然卫星，对地球潮汐有重要影响。'
  }
}

// 更新模拟速度
const updateSimulationSpeed = (value) => {
  // 速度逻辑在动画循环中使用
  console.log(`模拟速度已更改为: ${value}`)
}

// 切换轨道显示
const toggleOrbits = (value) => {
  if (orbitsGroup) {
    orbitsGroup.visible = value
  }
}

// 切换标签显示
const toggleLabels = (value) => {
  if (labelsGroup) {
    labelsGroup.visible = value
  }
}

// 关闭信息面板
const closeInfoPanel = () => {
  selectedPlanet.value = null
}

// 初始化三维场景
const initScene = () => {
  // 创建场景
  scene = new THREE.Scene()
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 30, 50)
  
  // 添加到场景
  scene.add(planetGroup)
  scene.add(orbitsGroup)
  scene.add(labelsGroup)
  
  // 创建渲染器
  const containerEl = container.value
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(containerEl.clientWidth, containerEl.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  containerEl.appendChild(renderer.domElement)
  
  // 控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  
  // 添加环境光和方向光
  const ambientLight = new THREE.AmbientLight(0x555555)
  scene.add(ambientLight)
  
  const sunLight = new THREE.PointLight(0xffffff, 5)
  sunLight.position.set(0, 0, 0)
  scene.add(sunLight)
  
  // 创建星空背景
  createStarField()
  
  // 创建太阳系天体
  createSolarSystem()
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', onWindowResize)
}

// 创建星空背景
const createStarField = () => {
  const starsGeometry = new THREE.BufferGeometry()
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
  })
  
  const starsVertices = []
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000
    const y = (Math.random() - 0.5) * 2000
    const z = (Math.random() - 0.5) * 2000
    starsVertices.push(x, y, z)
  }
  
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3))
  starField = new THREE.Points(starsGeometry, starsMaterial)
  scene.add(starField)
}

// 创建太阳系天体
const createSolarSystem = () => {
  // 创建太阳
  const sunGeometry = new THREE.SphereGeometry(2, 32, 32)
  const sunMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 0.8
  })
  const sun = new THREE.Mesh(sunGeometry, sunMaterial)
  planetGroup.add(sun)
  planetData.sun.object = sun
  
  // 太阳光晕
  const sunGlowGeometry = new THREE.SphereGeometry(2.3, 32, 32)
  const sunGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.3
  })
  const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial)
  sun.add(sunGlow)
  
  // 创建行星
  createPlanet('mercury', 0.4, 0x8c8c8c) // 水星
  createPlanet('venus', 0.6, 0xffe6c8) // 金星 - 调亮
  
  // 地球和月球
  const earthGroup = new THREE.Group()
  planetGroup.add(earthGroup)
  
  const earthGeometry = new THREE.SphereGeometry(0.65, 32, 32)
  const earthMaterial = new THREE.MeshLambertMaterial({ color: 0x3399ff }) // 调亮
  const earth = new THREE.Mesh(earthGeometry, earthMaterial)
  earthGroup.add(earth)
  planetData.earth.object = earthGroup
  
  // 添加月球
  const moonGeometry = new THREE.SphereGeometry(0.15, 32, 32)
  const moonMaterial = new THREE.MeshLambertMaterial({ color: 0xeeeeee }) // 调亮
  const moon = new THREE.Mesh(moonGeometry, moonMaterial)
  moon.position.set(moonData.moon.distance, 0, 0)
  earthGroup.add(moon)
  
  // 地球轨道
  createOrbit(planetData.earth.distance, 0x3388ff)
  
  // 继续创建其他行星
  createPlanet('mars', 0.55, 0xff5533) // 火星 - 调亮
  createPlanet('jupiter', 1.5, 0xffcc88) // 木星 - 调亮
  
  // 土星及其环
  const saturnGroup = new THREE.Group()
  planetGroup.add(saturnGroup)
  
  const saturnGeometry = new THREE.SphereGeometry(1.2, 32, 32)
  const saturnMaterial = new THREE.MeshLambertMaterial({ color: 0xeedd99 }) // 调亮
  const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial)
  saturnGroup.add(saturn)
  
  // 土星环
  const ringGeometry = new THREE.RingGeometry(1.5, 2.5, 64)
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xffdd88, // 调亮
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9 // 提高不透明度
  })
  const ring = new THREE.Mesh(ringGeometry, ringMaterial)
  ring.rotation.x = Math.PI / 2
  saturnGroup.add(ring)
  planetData.saturn.object = saturnGroup
  
  // 创建土星轨道
  createOrbit(planetData.saturn.distance, 0xeebb88)
  
  // 创建其余行星
  createPlanet('uranus', 0.9, 0x77ccee) // 天王星 - 调亮
  createPlanet('neptune', 0.85, 0x4488dd) // 海王星 - 调亮
  createPlanet('pluto', 0.3, 0xbbaa99) // 冥王星 - 调亮
  
  // 创建行星标签
  createLabels()
}

// 创建行星函数
const createPlanet = (name, size, color) => {
  const planetInfo = planetData[name]
  
  // 在指定距离处创建行星
  const planetGeometry = new THREE.SphereGeometry(size, 32, 32)
  const planetMaterial = new THREE.MeshLambertMaterial({ 
    color: color, 
    emissive: color, 
    emissiveIntensity: 0.2 // 添加自发光效果
  })
  const planet = new THREE.Mesh(planetGeometry, planetMaterial)
  
  // 将行星放置在其轨道位置上
  planet.position.x = planetInfo.distance
  planetGroup.add(planet)
  planetInfo.object = planet
  
  // 创建轨道
  createOrbit(planetInfo.distance, color)
}

// 创建轨道函数
const createOrbit = (radius, color) => {
  const orbitGeometry = new THREE.RingGeometry(radius - 0.02, radius + 0.02, 128)
  const orbitMaterial = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3
  })
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial)
  orbit.rotation.x = Math.PI / 2
  orbitsGroup.add(orbit)
}

// 创建标签函数
const createLabels = () => {
  const createLabel = (name, distance, planetObject) => {
    // 创建文本纹理
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    context.fillStyle = '#ffffff';
    context.font = 'Bold 36px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(name, 128, 32);
    
    // 创建纹理
    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // 创建标签平面
    const labelGeometry = new THREE.PlaneGeometry(2, 0.5);
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    
    // 标签位置设置
    label.position.set(distance, 1.8, 0);
    label.userData = { planetName: name };
    
    // 将标签添加到标签组
    labelsGroup.add(label);
  };
  
  // 为每个行星创建标签
  Object.keys(planetData).forEach(key => {
    const planet = planetData[key];
    if (key !== 'sun' && planet.object) {
      createLabel(planet.name, planet.distance, planet.object);
    }
  });
  
  // 太阳标签
  createLabel('太阳', 0, planetData.sun.object);
};

// 窗口大小变化的处理函数
const onWindowResize = () => {
  const containerEl = container.value
  if (camera && renderer) {
    camera.aspect = containerEl.clientWidth / containerEl.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(containerEl.clientWidth, containerEl.clientHeight)
  }
}

// 动画循环
const animate = () => {
  if (!scene || !camera || !renderer) return
  
  animationId = requestAnimationFrame(animate)
  
  // 使用模拟速度因子
  const speedFactor = parseFloat(simulationSpeed.value)
  
  // 行星绕太阳公转
  Object.keys(planetData).forEach(key => {
    if (key !== 'sun') {
      const planet = planetData[key]
      if (planet.object) {
        // 根据行星轨道周期计算角速度
        const angle = Date.now() * 0.0001 * planet.speed * speedFactor
        const x = Math.cos(angle) * planet.distance
        const z = Math.sin(angle) * planet.distance
        planet.object.position.set(x, 0, z)
        
        // 行星自转
        if (key !== 'pluto') {
          planet.object.rotation.y += 0.01 * speedFactor
        } else {
          planet.object.rotation.y += 0.002 * speedFactor
        }
      }
    }
  })
  
  // 太阳自转
  if (planetData.sun.object) {
    planetData.sun.object.rotation.y += 0.001 * speedFactor
  }
  
  // 月球绕地球公转
  const earthObject = planetData.earth.object
  if (earthObject && earthObject.children.length > 0) {
    const moon = earthObject.children[0]
    const moonAngle = Date.now() * 0.0005 * moonData.moon.speed * speedFactor
    const moonX = Math.cos(moonAngle) * moonData.moon.distance
    const moonZ = Math.sin(moonAngle) * moonData.moon.distance
    moon.position.set(moonX, 0, moonZ)
  }
  
  // 更新控制器
  if (controls) {
    controls.update()
  }
  
  // 渲染场景
  renderer.render(scene, camera)
}

// 点击处理，用于选择行星
const handleClick = (event) => {
  if (!camera || !scene || !renderer) return
  
  // 计算鼠标位置归一化坐标
  const containerEl = container.value
  const rect = containerEl.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / containerEl.clientWidth) * 2 - 1
  const y = -((event.clientY - rect.top) / containerEl.clientHeight) * 2 + 1
  
  // 创建射线
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera({ x, y }, camera)
  
  // 检测相交对象
  let intersects = raycaster.intersectObjects(planetGroup.children, true)
  
  // 如果点击了一个行星
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object
    
    // 查找被点击的是哪个行星
    for (const key in planetData) {
      const planet = planetData[key]
      if (planet.object === clickedObject || planet.object === clickedObject.parent) {
        selectedPlanet.value = {
          name: planet.name,
          diameter: planet.diameter,
          orbitalPeriod: planet.orbitalPeriod,
          rotationPeriod: planet.rotationPeriod,
          description: planet.description
        }
        break
      }
    }
  } else {
    // 检查标签
    intersects = raycaster.intersectObjects(labelsGroup.children)
    if (intersects.length > 0) {
      const labelName = intersects[0].object.userData.planetName
      for (const key in planetData) {
        const planet = planetData[key]
        if (planet.name === labelName) {
          selectedPlanet.value = {
            name: planet.name,
            diameter: planet.diameter,
            orbitalPeriod: planet.orbitalPeriod,
            rotationPeriod: planet.rotationPeriod,
            description: planet.description
          }
          break
        }
      }
    }
  }
}

// 生命周期挂载
onMounted(() => {
  initScene()
  animate()
  
  // 添加点击事件监听
  container.value.addEventListener('click', handleClick)
})

// 生命周期卸载
onUnmounted(() => {
  // 移除窗口大小变化监听
  window.removeEventListener('resize', onWindowResize)
  
  // 移除点击事件监听
  if (container.value) {
    container.value.removeEventListener('click', handleClick)
  }
  
  // 停止动画循环
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }
  
  // 清除资源
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style lang="less" scoped>
.solar-system-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
  
  .canvas-container {
    width: 100%;
    height: 100%;
  }
  
  .exit-button {
    position: fixed;
    top: 20px;
    left: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    z-index: 10;
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s;
    
    &:hover {
      background: rgba(0, 0, 0, 0.9);
      border-color: rgba(255, 255, 255, 0.8);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    }
    
    .el-icon {
      font-size: 18px;
    }
    
    span {
      font-size: 16px;
    }
  }
  
  .control-panel {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 16px;
    border-radius: 8px;
    z-index: 10;
    border: 1px solid rgba(255, 255, 255, 0.3);
    min-width: 220px;
    
    h3 {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 18px;
      text-align: center;
    }
    
    .control-item {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    .el-radio-group {
      margin-left: 10px;
    }
  }
  
  .info-panel {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 16px;
    border-radius: 8px;
    z-index: 10;
    border: 1px solid rgba(255, 255, 255, 0.3);
    max-width: 300px;
    
    h3 {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 18px;
    }
    
    p {
      margin-bottom: 12px;
      font-size: 14px;
      opacity: 0.9;
    }
    
    .planet-data {
      margin-bottom: 12px;
      
      .data-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        
        .label {
          opacity: 0.7;
        }
        
        .value {
          font-weight: 500;
        }
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .solar-system-container {
    .control-panel {
      width: calc(100% - 40px);
      right: 20px;
      top: unset;
      bottom: 20px;
      
      .control-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
    
    .info-panel {
      left: 50%;
      transform: translateX(-50%);
      bottom: 80px;
    }
  }
}
</style> 