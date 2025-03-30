<template>
  <div class="forbidden-city-container">
    <!-- 退出按钮 -->
    <div class="exit-button" @click="goBack">
      <el-icon><ArrowLeft /></el-icon>
      <span>返回</span>
    </div>
    
    <!-- 紧急退出按钮 -->
    <div class="emergency-exit">
      <el-button type="danger" @click="forceGoBack" size="large">
        <el-icon><Back /></el-icon>
        紧急返回
      </el-button>
    </div>
    
    <!-- 控制面板 -->
    <div class="control-panel" v-if="!selectedBuilding">
      <h3>故宫导览</h3>
      <div class="control-item">
        <el-button type="primary" @click="startTour">
          <el-icon><VideoPlay /></el-icon>
          开始导览
        </el-button>
        <el-button type="warning" @click="stopCameraAnimation">
          <el-icon><VideoPause /></el-icon>
          停止导览
        </el-button>
      </div>
      <div class="control-item">
        <span>移动速度:</span>
        <el-radio-group v-model="moveSpeed" @change="updateMoveSpeed">
          <el-radio-button value="0.5">慢速</el-radio-button>
          <el-radio-button value="1">中速</el-radio-button>
          <el-radio-button value="2">快速</el-radio-button>
        </el-radio-group>
      </div>
      <div class="control-item">
        <el-switch 
          v-model="showLabels" 
          @change="toggleLabels"
          active-text="显示标签"
        />
      </div>
      <div class="control-item">
        <span>观光路线:</span>
        <el-select v-model="tourPath" @change="changeTourPath">
          <el-option label="自由观光" value="free" />
          <el-option label="中轴线" value="central" />
          <el-option label="宫殿巡览" value="palace" />
        </el-select>
      </div>
    </div>
    
    <!-- 建筑信息面板 -->
    <div class="info-panel" v-if="selectedBuilding">
      <h3>{{ selectedBuilding.name }}</h3>
      <p v-if="selectedBuilding.description">{{ selectedBuilding.description }}</p>
      <div class="building-data">
        <div class="data-item">
          <span class="label">建造年代:</span>
          <span class="value">{{ selectedBuilding.constructionYear }}</span>
        </div>
        <div class="data-item">
          <span class="label">功能:</span>
          <span class="value">{{ selectedBuilding.function }}</span>
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
import { Back, ArrowLeft, VideoPlay, VideoPause } from '@element-plus/icons-vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const router = useRouter()
const container = ref(null)
const moveSpeed = ref('1') // 默认为正常速度
const showLabels = ref(true) // 默认显示标签
const tourPath = ref('free') // 默认自由观光
const selectedBuilding = ref(null) // 当前选中的建筑信息

// 返回上一页
const goBack = () => {
  try {
    // 停止相机动画
    stopCameraAnimation()
    
    // 确保释放所有资源
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    
    // 清理控制器
    if (controls) {
      controls.dispose()
      controls = null
    }
    
    // 清理渲染器
    if (renderer) {
      renderer.dispose()
      renderer = null
    }
    
    // 清空场景
    if (scene) {
      scene.clear()
      scene = null
    }
    
    // 移除事件监听
    window.removeEventListener('resize', onWindowResize)
    if (container.value) {
      container.value.removeEventListener('click', handleClick)
    }
    
    // 释放相机和其他组
    camera = null
    buildingsGroup = null
    labelsGroup = null
    cameraAnimationMixer = null
    currentAnimation = null
    
    router.push('/home')
  } catch (error) {
    console.error('返回时出错:', error)
    // 确保即使出错也能返回主页
    window.location.href = '/#/home'
  }
}

// 强制返回，无论当前状态如何都立即导航回主页
const forceGoBack = () => {
  try {
    stopCameraAnimation()
    
    // 强制清除所有可能的动画和资源
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    
    // 清理控制器
    if (controls) {
      controls.dispose()
      controls = null
    }
    
    // 清理渲染器
    if (renderer) {
      try {
        renderer.dispose()
        renderer.forceContextLoss()
        renderer = null
      } catch (e) {
        console.error('Renderer cleanup error:', e)
      }
    }
    
    // 清空场景
    if (scene) {
      try {
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
      } catch (e) {
        console.error('Scene cleanup error:', e)
      }
    }
    
    // 释放相机和其他组
    camera = null
    buildingsGroup = null
    labelsGroup = null
    cameraAnimationMixer = null
    currentAnimation = null
    
    // 强制返回到主页
    window.location.href = '/#/home'
  } catch (error) {
    console.error('强制返回时出错:', error)
    // 确保即使出错也能返回主页
    window.location.href = '/#/home'
  }
}

// 场景相关变量
let scene = null
let camera = null
let renderer = null
let controls = null
let animationId = null
let buildingsGroup = new THREE.Group()
let labelsGroup = new THREE.Group()
let cameraAnimationMixer = null
let currentAnimation = null

// 中轴线路径点
const centralAxisPath = [
  { position: new THREE.Vector3(0, 10, 50), target: new THREE.Vector3(0, 0, 0), duration: 5 },
  { position: new THREE.Vector3(0, 10, 30), target: new THREE.Vector3(0, 0, 0), duration: 5 },
  { position: new THREE.Vector3(0, 10, 0), target: new THREE.Vector3(0, 0, -20), duration: 5 },
  { position: new THREE.Vector3(0, 20, -20), target: new THREE.Vector3(0, 0, -50), duration: 5 },
  { position: new THREE.Vector3(0, 20, -40), target: new THREE.Vector3(0, 0, -60), duration: 5 }
]

// 宫殿路线点
const palacePath = [
  { position: new THREE.Vector3(20, 10, 0), target: new THREE.Vector3(0, 0, 0), duration: 4 },
  { position: new THREE.Vector3(0, 10, 0), target: new THREE.Vector3(-20, 0, 0), duration: 4 },
  { position: new THREE.Vector3(-20, 10, 0), target: new THREE.Vector3(-20, 0, -20), duration: 4 },
  { position: new THREE.Vector3(0, 15, -20), target: new THREE.Vector3(20, 0, -20), duration: 4 },
  { position: new THREE.Vector3(20, 10, -20), target: new THREE.Vector3(0, 0, 0), duration: 4 }
]

// 定义建筑物数据
const buildingsData = ref([
  {
    name: '午门',
    position: new THREE.Vector3(0, 0, 60),
    size: { width: 35, height: 20, depth: 18 },
    color: 0xf0c419, // 黄琉璃瓦
    description: '故宫的正门，建于明永乐十八年（1420年），是明清两代封建皇宫的正门。',
    constructionYear: '1420年',
    function: '宫城南部正门，是皇帝举行大典和颁布诏书的地方。'
  },
  {
    name: '太和门',
    position: new THREE.Vector3(0, 0, 35),
    size: { width: 30, height: 18, depth: 15 },
    color: 0xf0c419, // 黄琉璃瓦
    description: '太和门是故宫外朝的门户，是紫禁城内宫城的正门，建于明永乐十八年（1420年）。',
    constructionYear: '1420年',
    function: '是举行盛典时皇帝从此门进入太和殿。'
  },
  {
    name: '太和殿',
    position: new THREE.Vector3(0, 0, 10),
    size: { width: 40, height: 25, depth: 25 },
    color: 0xf0c419, // 黄琉璃瓦
    description: '太和殿是紫禁城内的最大建筑，是皇帝举行大典的地方，俗称金銮殿。',
    constructionYear: '1420年',
    function: '皇帝登基、大婚、册立皇后、册立太子、冬至、元旦万寿节、正旦受朝贺等重大典礼的场所。'
  },
  {
    name: '中和殿',
    position: new THREE.Vector3(0, 0, -15),
    size: { width: 28, height: 20, depth: 20 },
    color: 0xf0c419, // 黄琉璃瓦
    description: '中和殿是紫禁城内三大殿之一，位于太和殿后，是皇帝举行朝会前休息的地方。',
    constructionYear: '1420年',
    function: '皇帝在大典举行前休息、更衣之处，是太和殿和保和殿之间的过殿。'
  },
  {
    name: '保和殿',
    position: new THREE.Vector3(0, 0, -40),
    size: { width: 35, height: 22, depth: 22 },
    color: 0xf0c419, // 黄琉璃瓦
    description: '保和殿是紫禁城内三大殿之一，位于中和殿后，是皇帝举行宴会和殿试的地方。',
    constructionYear: '1420年',
    function: '清代用作举行殿试、宴会和军机处议政的地方。'
  },
  {
    name: '乾清宫',
    position: new THREE.Vector3(0, 0, -65),
    size: { width: 32, height: 20, depth: 20 },
    color: 0xf0c419, // 黄琉璃瓦
    description: '乾清宫是内廷的正宫，是皇帝日常居住和处理政务的地方。',
    constructionYear: '1420年',
    function: '皇帝的寝宫和处理政务的地方，也是举行小型朝会和接见臣僚的场所。'
  },
  {
    name: '坤宁宫',
    position: new THREE.Vector3(0, 0, -90),
    size: { width: 30, height: 18, depth: 18 },
    color: 0xf0c419, // 黄琉璃瓦
    description: '坤宁宫是内廷后三宫之一，是皇后的寝宫。',
    constructionYear: '1420年',
    function: '明代为皇后居所，清代为皇帝大婚时的洞房，平时用来供奉神主牌位。'
  },
  {
    name: '文华殿',
    position: new THREE.Vector3(-40, 0, -20),
    size: { width: 28, height: 18, depth: 18 },
    color: 0xf0c419, // 黄琉璃瓦
    description: '文华殿位于紫禁城东侧，是皇帝读书和召见文臣的地方。',
    constructionYear: '1420年',
    function: '明代皇帝在此读书、召见文臣，清代为举行殿试的地方。'
  },
  {
    name: '武英殿',
    position: new THREE.Vector3(40, 0, -20),
    size: { width: 28, height: 18, depth: 18 },
    color: 0xf0c419, // 黄琉璃瓦
    description: '武英殿位于紫禁城西侧，是皇帝召见武将的地方。',
    constructionYear: '1420年',
    function: '明代皇帝在此召见武将，清代为国史馆和武英殿修书处。'
  },
  {
    name: '东六宫',
    position: new THREE.Vector3(-25, 0, -65),
    size: { width: 20, height: 16, depth: 40 },
    color: 0xf0c419, // 黄琉璃瓦
    description: '东六宫是紫禁城内后宫东侧的六座宫殿，是皇帝妃嫔居住的地方。',
    constructionYear: '1420年',
    function: '后宫妃嫔的居所。'
  },
  {
    name: '西六宫',
    position: new THREE.Vector3(25, 0, -65),
    size: { width: 20, height: 16, depth: 40 },
    color: 0xf0c419, // 黄琉璃瓦
    description: '西六宫是紫禁城内后宫西侧的六座宫殿，是皇帝妃嫔居住的地方。',
    constructionYear: '1420年',
    function: '后宫妃嫔的居所。'
  },
  {
    name: '御花园',
    position: new THREE.Vector3(0, 0, -115),
    size: { width: 40, height: 8, depth: 30 },
    color: 0x228b22, // 森林绿色，代表花园
    description: '御花园位于紫禁城北部，是皇帝和后妃游玩赏花的私家花园。',
    constructionYear: '1420年',
    function: '皇帝和后妃休闲游玩、赏花的私家花园。'
  },
  {
    name: '神武门',
    position: new THREE.Vector3(0, 0, -145),
    size: { width: 30, height: 18, depth: 15 },
    color: 0xf0c419, // 黄琉璃瓦
    description: '神武门是紫禁城的北门，建于明永乐十八年（1420年）。',
    constructionYear: '1420年',
    function: '紫禁城的北门，也是明清两代皇帝日常出入的门。'
  }
])

// 更新移动速度
const updateMoveSpeed = (value) => {
  if (controls) {
    controls.movementSpeed = parseFloat(value) * 5;
  }
}

// 切换标签显示
const toggleLabels = (value) => {
  if (labelsGroup) {
    labelsGroup.visible = value
  }
}

// 切换观光路线
const changeTourPath = (value) => {
  console.log(`已选择观光路线: ${value}`)
  // 实现不同路线的相机动画
  if (value === 'central') {
    // 中轴线路线
    animateCameraPath(centralAxisPath);
  } else if (value === 'palace') {
    // 宫殿路线
    animateCameraPath(palacePath);
  } else {
    // 自由模式
    stopCameraAnimation();
  }
}

// 相机路径动画
const animateCameraPath = (path) => {
  // 先停止当前动画
  stopCameraAnimation();
  
  let currentPoint = 0;
  
  // 递归执行动画序列
  const animateToNextPoint = () => {
    if (currentPoint >= path.length) {
      currentPoint = 0;
    }
    
    const point = path[currentPoint];
    const duration = point.duration * 1000; // 转换为毫秒
    
    // 创建动画
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const startTime = Date.now();
    
    // 动画函数
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用平滑的缓动函数
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : -1 + (4 - 2 * progress) * progress;
      
      // 更新相机位置
      camera.position.lerpVectors(startPosition, point.position, easeProgress);
      controls.target.lerpVectors(startTarget, point.target, easeProgress);
      
      if (progress < 1) {
        // 继续动画
        currentAnimation = requestAnimationFrame(animate);
      } else {
        // 移动到下一个点
        currentPoint++;
        setTimeout(animateToNextPoint, 1000); // 在每个点停留1秒
      }
    };
    
    // 开始动画
    currentAnimation = requestAnimationFrame(animate);
  };
  
  // 开始第一个点的动画
  animateToNextPoint();
}

// 停止相机动画
const stopCameraAnimation = () => {
  if (currentAnimation) {
    cancelAnimationFrame(currentAnimation);
    currentAnimation = null;
  }
}

// 关闭信息面板
const closeInfoPanel = () => {
  selectedBuilding.value = null
}

// 初始化Three.js场景
const initScene = () => {
  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87ceeb) // 天蓝色背景
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 30, 80)
  
  // 添加分组到场景
  scene.add(buildingsGroup)
  scene.add(labelsGroup)
  
  // 创建渲染器
  const containerEl = container.value
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(containerEl.clientWidth, containerEl.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  containerEl.appendChild(renderer.domElement)
  
  // 控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.maxPolarAngle = Math.PI / 2 - 0.1 // 限制垂直旋转角度，防止穿过地面
  
  // 添加光源
  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  
  // 平行光（模拟太阳光）
  const sunLight = new THREE.DirectionalLight(0xffffff, 0.8)
  sunLight.position.set(50, 100, 50)
  sunLight.castShadow = true
  sunLight.shadow.mapSize.width = 2048
  sunLight.shadow.mapSize.height = 2048
  scene.add(sunLight)
  
  // 创建地面
  createGround()
  
  // 创建围墙
  createWalls()
  
  // 创建建筑物
  createBuildings()
  
  // 创建标签
  createLabels()
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', onWindowResize)
}

// 创建地面
const createGround = () => {
  // 创建地面
  const groundGeometry = new THREE.PlaneGeometry(300, 300)
  const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xd9c6a5 }) // 砂岩色
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2 // 水平放置
  ground.position.y = -0.5
  ground.receiveShadow = true
  scene.add(ground)
}

// 创建围墙
const createWalls = () => {
  // 创建更逼真的城墙材质
  const wallTextureLoader = new THREE.TextureLoader()
  
  // 城墙贴图
  const wallTexture = new THREE.MeshStandardMaterial({
    color: 0xc2956e,
    roughness: 0.9,
    metalness: 0.1,
    bumpScale: 0.02,
  })
  
  // 墙顶材质
  const wallTopTexture = new THREE.MeshStandardMaterial({
    color: 0xac8162, 
    roughness: 0.7,
    metalness: 0.1,
  })
  
  // 城墙参数
  const wallThickness = 3
  const wallHeight = 10
  const outerLength = 180
  const outerWidth = 140
  const segmentLength = 15 // 分段长度
  const battlementHeight = 1.5 // 垛口高度
  const battlementWidth = 1.5 // 垛口宽度
  const battlementDepth = wallThickness
  const battlementSpacing = 1.5 // 垛口间距
  
  // 创建城墙分段函数
  const createWallSegment = (width, height, depth, position, rotation) => {
    // 创建墙体组
    const wallGroup = new THREE.Group()
    wallGroup.position.copy(position)
    wallGroup.rotation.copy(rotation)
    
    // 主墙体
    const wallGeometry = new THREE.BoxGeometry(width, height, depth)
    const wallMesh = new THREE.Mesh(wallGeometry, wallTexture)
    wallMesh.position.y = height / 2
    wallMesh.castShadow = true
    wallMesh.receiveShadow = true
    
    // 添加墙面砖块纹理
    const brickRowCount = Math.floor(height / 1.2)
    const brickColumnCount = Math.floor(width / 2)
    
    for (let row = 0; row < brickRowCount; row++) {
      for (let col = 0; col < brickColumnCount; col++) {
        const brickWidth = 1.8 + Math.random() * 0.4 // 砖块宽度略有变化
        const brickHeight = 0.9 + Math.random() * 0.2 // 砖块高度略有变化
        const brickDepth = 0.15 // 砖块凸出深度
        
        const brickGeometry = new THREE.BoxGeometry(brickWidth, brickHeight, brickDepth)
        const brickMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xbb8b61).lerp(new THREE.Color(0x9e6b52), Math.random()),
          roughness: 0.9 + Math.random() * 0.1,
          metalness: 0.1
        })
        
        const brick = new THREE.Mesh(brickGeometry, brickMaterial)
        
        // 交错排列
        const offsetX = (col * 2) - width / 2 + (row % 2) * 1
        const offsetY = row * 1.1 - height / 2 + 0.5
        const offsetZ = depth / 2 + 0.01 // 略微凸出墙面
        
        brick.position.set(offsetX, offsetY, offsetZ)
        brick.castShadow = true
        brick.receiveShadow = true
        
        // 随机旋转和倾斜以增加真实感
        brick.rotation.z = (Math.random() - 0.5) * 0.03
        brick.rotation.x = (Math.random() - 0.5) * 0.03
        
        wallMesh.add(brick)
        
        // 后墙面也添加砖块
        const backBrick = brick.clone()
        backBrick.position.z = -offsetZ
        backBrick.rotation.x = -brick.rotation.x
        wallMesh.add(backBrick)
      }
    }
    
    // 添加墙顶
    const wallTopGeometry = new THREE.BoxGeometry(width, 0.5, depth + 0.5)
    const wallTop = new THREE.Mesh(wallTopGeometry, wallTopTexture)
    wallTop.position.y = height + 0.25
    wallTop.castShadow = true
    wallTop.receiveShadow = true
    
    // 创建垛口
    const battlementCount = Math.floor(width / (battlementWidth + battlementSpacing))
    const battlementTotalWidth = battlementCount * (battlementWidth + battlementSpacing)
    const startX = -battlementTotalWidth / 2 + battlementWidth / 2
    
    for (let i = 0; i < battlementCount; i++) {
      const battlementGeometry = new THREE.BoxGeometry(battlementWidth, battlementHeight, battlementDepth)
      const battlement = new THREE.Mesh(battlementGeometry, wallTexture)
      
      battlement.position.set(
        startX + i * (battlementWidth + battlementSpacing),
        height + battlementHeight / 2 + 0.5,
        0
      )
      
      battlement.castShadow = true
      battlement.receiveShadow = true
      
      // 添加垛口顶部
      const battlementTopGeometry = new THREE.BoxGeometry(battlementWidth + 0.3, 0.2, battlementDepth + 0.3)
      const battlementTop = new THREE.Mesh(battlementTopGeometry, wallTopTexture)
      battlementTop.position.y = battlementHeight / 2 + 0.1
      battlementTop.castShadow = true
      
      battlement.add(battlementTop)
      wallGroup.add(battlement)
    }
    
    wallGroup.add(wallMesh)
    wallGroup.add(wallTop)
    
    return wallGroup
  }
  
  // 创建四面城墙，分段创建以增加真实感
  
  // 创建北墙
  const northSegments = Math.ceil(outerWidth / segmentLength)
  const northSegmentWidth = outerWidth / northSegments
  
  for (let i = 0; i < northSegments; i++) {
    const position = new THREE.Vector3(
      (i - northSegments / 2 + 0.5) * northSegmentWidth, 
      0, 
      -outerLength / 2
    )
    const rotation = new THREE.Euler(0, 0, 0)
    
    const segment = createWallSegment(
      northSegmentWidth,
      wallHeight * (0.9 + Math.random() * 0.2), // 轻微的高度变化
      wallThickness,
      position,
      rotation
    )
    
    buildingsGroup.add(segment)
  }
  
  // 创建南墙
  const southSegments = Math.ceil(outerWidth / segmentLength)
  const southSegmentWidth = outerWidth / southSegments
  
  for (let i = 0; i < southSegments; i++) {
    const position = new THREE.Vector3(
      (i - southSegments / 2 + 0.5) * southSegmentWidth, 
      0, 
      outerLength / 2
    )
    const rotation = new THREE.Euler(0, Math.PI, 0)
    
    const segment = createWallSegment(
      southSegmentWidth,
      wallHeight * (0.9 + Math.random() * 0.2),
      wallThickness,
      position,
      rotation
    )
    
    buildingsGroup.add(segment)
  }
  
  // 创建东墙
  const eastSegments = Math.ceil(outerLength / segmentLength)
  const eastSegmentWidth = outerLength / eastSegments
  
  for (let i = 0; i < eastSegments; i++) {
    const position = new THREE.Vector3(
      outerWidth / 2,
      0,
      (i - eastSegments / 2 + 0.5) * eastSegmentWidth
    )
    const rotation = new THREE.Euler(0, -Math.PI / 2, 0)
    
    const segment = createWallSegment(
      eastSegmentWidth,
      wallHeight * (0.9 + Math.random() * 0.2),
      wallThickness,
      position,
      rotation
    )
    
    buildingsGroup.add(segment)
  }
  
  // 创建西墙
  const westSegments = Math.ceil(outerLength / segmentLength)
  const westSegmentWidth = outerLength / westSegments
  
  for (let i = 0; i < westSegments; i++) {
    const position = new THREE.Vector3(
      -outerWidth / 2,
      0,
      (i - westSegments / 2 + 0.5) * westSegmentWidth
    )
    const rotation = new THREE.Euler(0, Math.PI / 2, 0)
    
    const segment = createWallSegment(
      westSegmentWidth,
      wallHeight * (0.9 + Math.random() * 0.2),
      wallThickness,
      position,
      rotation
    )
    
    buildingsGroup.add(segment)
  }
  
  // 创建四个角楼
  const createCornerTower = (position) => {
    const towerRadius = 8
    const towerHeight = wallHeight + 5
    
    // 塔基
    const towerBaseGeometry = new THREE.CylinderGeometry(towerRadius, towerRadius + 1, towerHeight, 8)
    const towerBase = new THREE.Mesh(towerBaseGeometry, wallTexture)
    towerBase.position.copy(position)
    towerBase.position.y = towerHeight / 2
    towerBase.castShadow = true
    towerBase.receiveShadow = true
    
    // 塔顶
    const roofRadius = towerRadius + 2
    const roofHeight = 6
    
    const points = []
    for (let i = 0; i <= 10; i++) {
      const t = i / 10
      // 创建曲线，形成上翘屋檐
      const x = roofRadius * (1 - t)
      const y = roofHeight * Math.sin(t * Math.PI / 2) // 使用正弦函数创建曲线
      points.push(new THREE.Vector2(x, y))
    }
    
    const roofGeometry = new THREE.LatheGeometry(points, 8)
    const roofMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xbf9b30, 
      roughness: 0.5, 
      metalness: 0.3 
    })
    
    const roof = new THREE.Mesh(roofGeometry, roofMaterial)
    roof.position.copy(position)
    roof.position.y = towerHeight
    roof.castShadow = true
    
    // 塔尖装饰
    const spireGeometry = new THREE.ConeGeometry(1, 3, 8)
    const spireMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffd700, 
      roughness: 0.3, 
      metalness: 0.7 
    })
    
    const spire = new THREE.Mesh(spireGeometry, spireMaterial)
    spire.position.copy(position)
    spire.position.y = towerHeight + roofHeight + 1.5
    spire.castShadow = true
    
    buildingsGroup.add(towerBase)
    buildingsGroup.add(roof)
    buildingsGroup.add(spire)
  }
  
  // 创建四个角楼
  createCornerTower(new THREE.Vector3(outerWidth / 2, 0, outerLength / 2)) // 东南
  createCornerTower(new THREE.Vector3(-outerWidth / 2, 0, outerLength / 2)) // 西南
  createCornerTower(new THREE.Vector3(outerWidth / 2, 0, -outerLength / 2)) // 东北
  createCornerTower(new THREE.Vector3(-outerWidth / 2, 0, -outerLength / 2)) // 西北
}

// 创建建筑物
const createBuildings = () => {
  // 遍历建筑数据，创建每个建筑
  buildingsData.value.forEach(building => {
    createBuilding(building)
  })
}

// 创建单个建筑函数
const createBuilding = (buildingData) => {
  const { name, position, size, color } = buildingData
  
  // 创建建筑物组
  const buildingGroup = new THREE.Group()
  buildingGroup.position.copy(position)
  buildingGroup.userData = { buildingKey: name }
  
  // 创建白色大理石台基 - 三层结构
  const baseWidth = size.width * 1.3
  const baseDepth = size.depth * 1.3
  const baseHeight = 3.5
  const stepsCount = 3
  
  // 底层台基
  const baseGeometry = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth)
  const baseMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xf5f5f5, // 白色大理石
    roughness: 0.3,
    metalness: 0.1
  })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.y = baseHeight/2
  base.castShadow = true
  base.receiveShadow = true
  buildingGroup.add(base)
  
  // 创建白色石阶
  for (let i = 1; i <= stepsCount; i++) {
    const stepWidth = baseWidth - (baseWidth * 0.1 * i)
    const stepDepth = baseDepth - (baseDepth * 0.1 * i)
    const stepHeight = 0.6
    const stepY = baseHeight + stepHeight * (i - 0.5)
    
    const stepGeometry = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth)
    const step = new THREE.Mesh(stepGeometry, baseMaterial)
    step.position.y = stepY
    step.castShadow = true
    step.receiveShadow = true
    buildingGroup.add(step)
  }
  
  // 创建白石栏杆
  const railingHeight = 1.2
  const railingThickness = 0.3
  const topStepWidth = baseWidth - (baseWidth * 0.1 * stepsCount)
  const topStepDepth = baseDepth - (baseDepth * 0.1 * stepsCount)
  const railingY = baseHeight + stepsCount * 0.6 + railingHeight/2
  
  // 创建栏杆柱子
  const createBaluster = (x, z) => {
    const baluterHeight = railingHeight + 0.3
    const baluterWidth = 0.5
    const baluterGeometry = new THREE.BoxGeometry(baluterWidth, baluterHeight, baluterWidth)
    const baluterMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.1
    })
    const baluster = new THREE.Mesh(baluterGeometry, baluterMaterial)
    baluster.position.set(x, railingY, z)
    baluster.castShadow = true
    buildingGroup.add(baluster)
    
    // 添加装饰顶
    const capGeometry = new THREE.SphereGeometry(0.3, 8, 8)
    const capMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.1
    })
    const cap = new THREE.Mesh(capGeometry, capMaterial)
    cap.position.set(x, railingY + baluterHeight/2, z)
    cap.castShadow = true
    buildingGroup.add(cap)
  }
  
  // 创建栏杆围栏
  const createRailingSection = (startX, startZ, endX, endZ) => {
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2))
    const railingGeometry = new THREE.BoxGeometry(length, railingHeight * 0.2, railingThickness)
    const railingMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.1
    })
    const railing = new THREE.Mesh(railingGeometry, railingMaterial)
    
    // 计算中点和旋转角度
    const midX = (startX + endX) / 2
    const midZ = (startZ + endZ) / 2
    const angle = Math.atan2(endZ - startZ, endX - startX)
    
    railing.position.set(midX, railingY - railingHeight * 0.3, midZ)
    railing.rotation.y = angle
    railing.castShadow = true
    buildingGroup.add(railing)
    
    // 添加下方横栏
    const bottomRailing = new THREE.Mesh(railingGeometry, railingMaterial)
    bottomRailing.position.set(midX, railingY - railingHeight * 0.3 - 0.5, midZ)
    bottomRailing.rotation.y = angle
    bottomRailing.castShadow = true
    buildingGroup.add(bottomRailing)
  }
  
  const railingOffset = 0.5
  const railingWidth = topStepWidth - railingOffset*2
  const railingDepth = topStepDepth - railingOffset*2
  const cornerOffset = 1
  
  // 前栏杆
  const frontLeftX = -railingWidth/2 + cornerOffset
  const frontRightX = railingWidth/2 - cornerOffset
  const frontZ = railingDepth/2
  
  createBaluster(frontLeftX, frontZ)
  createBaluster(frontRightX, frontZ)
  createBaluster(0, frontZ) // 中间柱
  createRailingSection(frontLeftX, frontZ, 0, frontZ)
  createRailingSection(0, frontZ, frontRightX, frontZ)
  
  // 后栏杆
  const backZ = -railingDepth/2
  createBaluster(frontLeftX, backZ)
  createBaluster(frontRightX, backZ)
  createBaluster(0, backZ) // 中间柱
  createRailingSection(frontLeftX, backZ, 0, backZ)
  createRailingSection(0, backZ, frontRightX, backZ)
  
  // 侧栏杆
  createBaluster(frontLeftX, 0)
  createBaluster(frontRightX, 0)
  createRailingSection(frontLeftX, frontZ, frontLeftX, 0)
  createRailingSection(frontLeftX, 0, frontLeftX, backZ)
  createRailingSection(frontRightX, frontZ, frontRightX, 0)
  createRailingSection(frontRightX, 0, frontRightX, backZ)
  
  // 建筑主体高度
  const wallHeight = size.height * 0.5
  const wallY = baseHeight + stepsCount * 0.6 + wallHeight/2
  
  // 创建红墙主体
  const buildingWidth = size.width
  const buildingDepth = size.depth
  
  // 中心建筑结构
  const wallsGeometry = new THREE.BoxGeometry(buildingWidth, wallHeight, buildingDepth)
  const wallsMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xd32f2f, // 中国红
    roughness: 0.7,
    metalness: 0.1
  })
  const walls = new THREE.Mesh(wallsGeometry, wallsMaterial)
  walls.position.y = wallY
  walls.castShadow = true
  buildingGroup.add(walls)
  
  // 创建蓝色边框装饰
  const borderWidth = 0.4
  
  // 顶部边框
  const topBorderGeometry = new THREE.BoxGeometry(buildingWidth + borderWidth*2, borderWidth, buildingDepth + borderWidth*2)
  const borderMaterial = new THREE.MeshStandardMaterial({
    color: 0x1976d2, // 蓝色
    roughness: 0.5,
    metalness: 0.3
  })
  const topBorder = new THREE.Mesh(topBorderGeometry, borderMaterial)
  topBorder.position.y = wallY + wallHeight/2 + borderWidth/2
  topBorder.castShadow = true
  buildingGroup.add(topBorder)
  
  // 底部边框
  const bottomBorderGeometry = new THREE.BoxGeometry(buildingWidth + borderWidth*2, borderWidth, buildingDepth + borderWidth*2)
  const bottomBorder = new THREE.Mesh(bottomBorderGeometry, borderMaterial)
  bottomBorder.position.y = wallY - wallHeight/2 - borderWidth/2
  bottomBorder.castShadow = true
  buildingGroup.add(bottomBorder)
  
  // 装饰花纹面板
  const panelWidth = buildingWidth * 0.7
  const panelHeight = wallHeight * 0.6
  
  // 正面装饰面板（蓝色图案）
  const frontPanelGeometry = new THREE.BoxGeometry(panelWidth, panelHeight, 0.3)
  const panelMaterial = new THREE.MeshStandardMaterial({
    color: 0x1976d2,
    roughness: 0.6,
    metalness: 0.2
  })
  const frontPanel = new THREE.Mesh(frontPanelGeometry, panelMaterial)
  frontPanel.position.set(0, wallY, buildingDepth/2 + 0.2)
  frontPanel.castShadow = true
  buildingGroup.add(frontPanel)
  
  // 后面装饰面板
  const backPanel = frontPanel.clone()
  backPanel.position.z = -buildingDepth/2 - 0.2
  backPanel.rotation.y = Math.PI
  buildingGroup.add(backPanel)
  
  // 门（正门，中国红色）
  const doorWidth = buildingWidth * 0.2
  const doorHeight = wallHeight * 0.7
  const doorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, 0.5)
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0xd32f2f, // 中国红
    roughness: 0.4,
    metalness: 0.4
  })
  const door = new THREE.Mesh(doorGeometry, doorMaterial)
  door.position.set(0, wallY - wallHeight/2 + doorHeight/2, buildingDepth/2 + 0.3)
  buildingGroup.add(door)
  
  // 门上的金色装饰
  const doorDecorGeometry = new THREE.BoxGeometry(doorWidth * 1.2, doorHeight * 0.1, 0.6)
  const doorDecorMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700, // 金色
    roughness: 0.3,
    metalness: 0.8
  })
  const doorDecor = new THREE.Mesh(doorDecorGeometry, doorDecorMaterial)
  doorDecor.position.set(0, wallY - wallHeight/2 + doorHeight * 0.9, buildingDepth/2 + 0.4)
  buildingGroup.add(doorDecor)
  
  // 门环（两个）
  const doorKnobGeometry = new THREE.TorusGeometry(0.3, 0.05, 16, 32)
  const doorKnobMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700, // 金色
    roughness: 0.3,
    metalness: 0.8
  })
  
  // 左门环
  const leftKnob = new THREE.Mesh(doorKnobGeometry, doorKnobMaterial)
  leftKnob.position.set(-doorWidth/4, wallY - wallHeight/2 + doorHeight/2, buildingDepth/2 + 0.5)
  leftKnob.rotation.y = Math.PI / 2
  buildingGroup.add(leftKnob)
  
  // 右门环
  const rightKnob = leftKnob.clone()
  rightKnob.position.x = doorWidth/4
  buildingGroup.add(rightKnob)
  
  // 柱子 - 与图片类似的红柱子
  const createPillar = (x, z) => {
    // 确保在此函数作用域内重新计算所有需要的变量，避免引用外部变量
    const currentWallHeight = size.height * 0.5
    const currentBaseHeight = 3.5
    const currentStepsCount = 3
    const currentPillarHeight = currentWallHeight * 1.1
    const currentPillarRadius = size.width * 0.04
    const currentPillarY = currentBaseHeight + currentStepsCount * 0.6 + currentPillarHeight/2
    
    // 主柱身
    const pillarGeometry = new THREE.CylinderGeometry(currentPillarRadius, currentPillarRadius, currentPillarHeight, 16)
    const pillarMaterial = new THREE.MeshStandardMaterial({
      color: 0xd32f2f, // 中国红
      roughness: 0.5,
      metalness: 0.2
    })
    const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial)
    pillar.position.set(x, currentPillarY, z)
    pillar.castShadow = true
    buildingGroup.add(pillar)
    
    // 柱基
    const baseRadius = currentPillarRadius * 1.3
    const pillarBaseHeight = currentPillarHeight * 0.05
    const baseGeometry = new THREE.CylinderGeometry(baseRadius, baseRadius, pillarBaseHeight, 16)
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700, // 金色
      roughness: 0.3,
      metalness: 0.6
    })
    const pillarBase = new THREE.Mesh(baseGeometry, baseMaterial)
    pillarBase.position.set(x, currentPillarY - currentPillarHeight/2 - pillarBaseHeight/2, z)
    pillarBase.castShadow = true
    buildingGroup.add(pillarBase)
    
    // 柱顶
    const capHeight = currentPillarHeight * 0.07
    const capGeometry = new THREE.CylinderGeometry(baseRadius, currentPillarRadius, capHeight, 16)
    const pillarCap = new THREE.Mesh(capGeometry, baseMaterial)
    pillarCap.position.set(x, currentPillarY + currentPillarHeight/2 + capHeight/2, z)
    pillarCap.castShadow = true
    buildingGroup.add(pillarCap)
  }
  
  // 创建前排柱子（与图片类似的排列）
  const pillarOffset = buildingWidth * 0.05
  const pillarSpacing = (buildingWidth - pillarOffset*2) / 5 // 6根柱子，5个间距
  
  for (let i = 0; i <= 5; i++) {
    const x = -buildingWidth/2 + pillarOffset + i * pillarSpacing
    createPillar(x, buildingDepth/2)
  }
  
  // 创建后排柱子
  for (let i = 0; i <= 5; i++) {
    const x = -buildingWidth/2 + pillarOffset + i * pillarSpacing
    createPillar(x, -buildingDepth/2)
  }
  
  // 创建侧面柱子（紧贴建筑主体）
  const sideSpacing = buildingDepth / 3
  
  for (let i = 1; i < 3; i++) {
    const z = buildingDepth/2 - i * sideSpacing
    createPillar(-buildingWidth/2, z)
    createPillar(buildingWidth/2, z)
  }
  
  // 创建屋顶
  createTraditionalRoof(buildingGroup, size, color)
  
  // 保存建筑物引用
  buildingsGroup.add(buildingGroup)
  buildingData.object = buildingGroup
}

// 创建传统中国屋顶
const createTraditionalRoof = (buildingGroup, size, color) => {
  // 使用更加独特的命名，避免与其他函数冲突
  const roofBaseHeight = 3.5 + 3 * 0.6 // 台基高度 + 台阶高度
  const roofWallHeight = size.height * 0.5
  const roofWallY = roofBaseHeight + roofWallHeight
  
  // 屋顶参数 - 简化参数以提高性能
  const roofWidth = size.width * 1.2
  const roofDepth = size.depth * 1.2
  const roofHeight = size.height * 0.2 // 降低屋顶高度，使屋顶更薄
  const roofCurve = 0.8 // 减小曲率
  const eaveUpTurn = 1.2 // 适中的上翘幅度
  
  // 简化的装饰函数
  const addSimpleDecorations = (width, depth, yOffset) => {
    // 中央装饰 - 更精致但数量少的装饰
    const centerDecorGeometry = new THREE.ConeGeometry(0.5, 1.5, 6)
    const decorMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700, // 金色
      roughness: 0.3,
      metalness: 0.7
    })
    
    // 中央龙形装饰
    const centerDecor = new THREE.Mesh(centerDecorGeometry, decorMaterial)
    centerDecor.position.set(0, roofWallY + yOffset + 1.0, 0)
    centerDecor.castShadow = true
    buildingGroup.add(centerDecor)
    
    // 仅在四个角添加装饰，不再添加复杂的边缘装饰
    const cornerPositions = [
      [width/2 - 1, depth/2 - 1],
      [-width/2 + 1, depth/2 - 1],
      [width/2 - 1, -depth/2 + 1],
      [-width/2 + 1, -depth/2 + 1]
    ]
    
    cornerPositions.forEach(pos => {
      const cornerDecor = new THREE.Mesh(centerDecorGeometry, decorMaterial)
      cornerDecor.position.set(pos[0], roofWallY + yOffset + 0.5, pos[1])
      cornerDecor.scale.set(0.6, 0.6, 0.6)
      cornerDecor.castShadow = true
      buildingGroup.add(cornerDecor)
    })
  }
  
  // 创建屋顶结构 - 简化的双层黄琉璃瓦屋顶
  const createRoofLayer = (width, depth, height, yOffset, colorAdjust = 0) => {
    // 使用形状创建弯曲的屋顶
    const shape = new THREE.Shape()
    
    // 半宽和半深
    const hw = width / 2
    const hd = depth / 2
    
    // 定义屋顶形状点
    shape.moveTo(-hw, -hd)
    shape.lineTo(hw, -hd)
    shape.lineTo(hw, hd)
    shape.lineTo(-hw, hd)
    shape.lineTo(-hw, -hd)
    
    // 简化的拉伸设置，减少分段数量
    const extrudeSettings = {
      steps: 1,
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: height,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 4  // 减少分段数量以提高性能
    }
    
    // 创建几何体
    const roofGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    
    // 修改顶点以创建弯曲的形状，但减少计算量
    const positionAttribute = roofGeometry.getAttribute('position')
    const vertex = new THREE.Vector3()
    
    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i)
      
      // 中心点
      const xCenter = 0
      const zCenter = 0
      
      // X方向距离中心的距离（标准化）
      const xDist = (vertex.x - xCenter) / hw
      const zDist = (vertex.z - zCenter) / hd
      
      // 简化的曲率计算
      if (vertex.y > 0.1) { // 只调整顶部顶点
        // 从中心到边缘的简单曲线
        vertex.y += roofCurve * (xDist * xDist + zDist * zDist)
        
        // 简化的屋檐上翘效果
        const edgeFactor = Math.max(Math.abs(xDist), Math.abs(zDist))
        if (edgeFactor > 0.7) {
          vertex.y += eaveUpTurn * (edgeFactor - 0.7)
        }
      }
      
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z)
    }
    
    // 更新几何体
    roofGeometry.computeVertexNormals()
    
    // 创建琉璃瓦材质 - 简单的瓦面纹理
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color).offsetHSL(0, 0, colorAdjust),
      roughness: 0.6,
      metalness: 0.3,
      flatShading: false
    })
    
    // 创建屋顶网格
    const roof = new THREE.Mesh(roofGeometry, roofMaterial)
    roof.position.y = roofWallY + yOffset
    roof.rotation.x = Math.PI / 2 // 旋转使其水平
    roof.castShadow = true
    buildingGroup.add(roof)
    
    // 添加装饰
    addSimpleDecorations(width, depth, yOffset + height)
  }
  
  // 创建双层屋顶，但简化了参数
  createRoofLayer(roofWidth, roofDepth, roofHeight, 0, -0.1) // 底层
  createRoofLayer(roofWidth * 0.6, roofDepth * 0.6, roofHeight * 0.8, roofHeight * 0.5, 0.1) // 上层，范围更小
  
  // 简化的额外装饰：前额枋（蓝色横梁装饰）
  const beamWidth = size.width * 1.1
  const beamHeight = 0.4
  const beamGeometry = new THREE.BoxGeometry(beamWidth, beamHeight, beamHeight)
  const beamMaterial = new THREE.MeshStandardMaterial({
    color: 0x1976d2, // 蓝色
    roughness: 0.5,
    metalness: 0.3
  })
  const beam = new THREE.Mesh(beamGeometry, beamMaterial)
  beam.position.set(0, roofWallY - 0.5, 0)
  beam.castShadow = true
  buildingGroup.add(beam)
}

// 创建标签
const createLabels = () => {
  // 遍历建筑数据，为每个建筑创建标签
  buildingsData.value.forEach(building => {
    // 创建文本纹理
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = 256
    canvas.height = 64
    
    // 设置文本样式
    context.fillStyle = '#ffffff'
    context.font = 'Bold 36px Arial'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    
    // 绘制文本和背景
    context.fillStyle = 'rgba(0, 0, 0, 0.7)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#ffffff'
    context.fillText(building.name, 128, 32)
    
    // 创建纹理和材质
    const texture = new THREE.CanvasTexture(canvas)
    const labelMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    })
    
    // 创建标签平面
    const labelGeometry = new THREE.PlaneGeometry(5, 1.25)
    const label = new THREE.Mesh(labelGeometry, labelMaterial)
    
    // 设置标签位置，使其位于建筑物上方
    const labelPosition = building.position.clone()
    labelPosition.y = building.size.height + 2
    label.position.copy(labelPosition)
    
    // 将标签添加到标签组
    labelsGroup.add(label)
  })
}

// 点击处理函数
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
  
  // 检测相交的建筑物
  const intersects = raycaster.intersectObjects(buildingsGroup.children, true)
  
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object.parent
    
    // 查找被点击的建筑物
    for (const key in buildingsData.value) {
      const building = buildingsData.value[key]
      if (building.object === clickedObject) {
        // 显示建筑物信息
        selectedBuilding.value = {
          name: building.name,
          constructionYear: building.constructionYear,
          function: building.function,
          description: building.description
        }
        break
      }
    }
  }
}

// 窗口大小调整处理函数
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
  
  // 更新控制器
  if (controls) {
    controls.update()
  }
  
  // 渲染场景
  renderer.render(scene, camera)
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
  try {
    // 停止相机动画
    stopCameraAnimation()
    
    // 取消动画帧
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    
    // 移除事件监听
    window.removeEventListener('resize', onWindowResize)
    if (container.value) {
      container.value.removeEventListener('click', handleClick)
    }
    
    // 清理控制器
    if (controls) {
      controls.dispose()
      controls = null
    }
    
    // 清理渲染器
    if (renderer) {
      renderer.dispose()
      renderer = null
    }
    
    // 清空场景和释放资源
    if (scene) {
      scene.clear()
      scene = null
    }
    
    // 释放其他引用
    camera = null
    buildingsGroup = null
    labelsGroup = null
    cameraAnimationMixer = null
    currentAnimation = null
  } catch (error) {
    console.error('组件卸载时清理资源出错:', error)
  }
})

// 开始导览
const startTour = () => {
  // 如果当前正在动画中，先停止
  stopCameraAnimation()
  
  // 定义导览点
  const tourPoints = [
    { position: new THREE.Vector3(0, 30, 80), target: new THREE.Vector3(0, 0, 0) }, // 开始位置，俯视整个故宫
    { position: new THREE.Vector3(0, 20, 60), target: new THREE.Vector3(0, 0, 60) }, // 午门
    { position: new THREE.Vector3(0, 15, 40), target: new THREE.Vector3(0, 5, 35) }, // 太和门
    { position: new THREE.Vector3(0, 25, 20), target: new THREE.Vector3(0, 5, 10) }, // 太和殿
    { position: new THREE.Vector3(0, 20, -10), target: new THREE.Vector3(0, 5, -15) }, // 中和殿
    { position: new THREE.Vector3(0, 25, -30), target: new THREE.Vector3(0, 5, -40) }, // 保和殿
    { position: new THREE.Vector3(0, 20, -55), target: new THREE.Vector3(0, 5, -65) }, // 乾清宫
    { position: new THREE.Vector3(0, 15, -80), target: new THREE.Vector3(0, 5, -90) }, // 坤宁宫
    { position: new THREE.Vector3(0, 10, -105), target: new THREE.Vector3(0, 5, -115) }, // 御花园
    { position: new THREE.Vector3(0, 15, -135), target: new THREE.Vector3(0, 5, -145) }, // 神武门
    { position: new THREE.Vector3(0, 30, -170), target: new THREE.Vector3(0, 0, -100) }, // 结束位置，远眺故宫后部
  ]
  
  // 调用相机动画函数开始导览
  animateCameraAlongPath(tourPoints)
}
</script>

<style lang="less" scoped>
.forbidden-city-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #87CEEB; /* 天蓝色背景 */
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
    
    .building-data {
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
  
  .emergency-exit {
    position: fixed;
    top: 80px;
    left: 20px;
    z-index: 100;
    
    .el-button {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(220, 53, 69, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.3s;
      
      &:hover {
        background: rgb(220, 53, 69);
        border-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .forbidden-city-container {
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