<template>
  <div class="knowledge-graph-container">
    <!-- 返回按钮 -->
    <div class="exit-button" @click="goBack">
      <el-icon><ArrowLeft /></el-icon>
      <span>返回</span>
    </div>
    
    <!-- 控制面板 -->
    <div class="control-panel">
      <h3>知识图谱可视化</h3>
      <div class="control-item">
        <span>选择领域:</span>
        <el-select v-model="selectedDomain" @change="changeDomain">
          <el-option label="人工智能" value="ai" />
          <el-option label="中国历史" value="history" />
          <el-option label="生物医学" value="medical" />
          <el-option label="文学艺术" value="art" />
        </el-select>
      </div>
      <div class="control-item">
        <span>布局方式:</span>
        <el-radio-group v-model="layoutType" @change="changeLayout">
          <el-radio-button value="force">力导向</el-radio-button>
          <el-radio-button value="circular">环形</el-radio-button>
          <el-radio-button value="tree">树形</el-radio-button>
        </el-radio-group>
      </div>
      <div class="control-item">
        <el-switch 
          v-model="showRelationLabels" 
          @change="toggleRelationLabels"
          active-text="显示关系标签"
        />
      </div>
      <div class="control-item">
        <el-button type="primary" @click="resetLayout">
          <el-icon><Refresh /></el-icon>
          重置视图
        </el-button>
      </div>
    </div>
    
    <!-- 实体信息面板 -->
    <div class="info-panel" v-if="selectedEntity">
      <h3>{{ selectedEntity.name }}</h3>
      <p v-if="selectedEntity.description">{{ selectedEntity.description }}</p>
      <div class="entity-data">
        <div class="data-item" v-for="(value, key) in selectedEntity.properties" :key="key">
          <span class="label">{{ key }}:</span>
          <span class="value">{{ value }}</span>
        </div>
      </div>
      <div class="related-entities" v-if="selectedEntity.relatedEntities && selectedEntity.relatedEntities.length">
        <h4>相关实体</h4>
        <el-tag 
          v-for="entity in selectedEntity.relatedEntities"
          :key="entity.id"
          @click="selectRelatedEntity(entity)"
          class="entity-tag"
        >
          {{ entity.name }}
        </el-tag>
      </div>
      <el-button size="small" plain @click="closeInfoPanel">关闭</el-button>
    </div>
    
    <!-- 图谱容器 -->
    <div ref="graphContainer" class="graph-container"></div>
    
    <!-- 搜索框 -->
    <div class="search-container">
      <el-input
        v-model="searchText"
        placeholder="搜索实体..."
        prefix-icon="el-icon-search"
        @input="handleSearch"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <div class="search-results" v-if="searchResults.length && searchText">
        <div 
          v-for="result in searchResults" 
          :key="result.id" 
          class="search-result-item"
          @click="highlightEntity(result.id)"
        >
          {{ result.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Refresh, Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { aiDomain, historyDomain, medicalDomain, artDomain } from './data'

const router = useRouter()
const graphContainer = ref(null)
let chart = null

// 控制面板选项
const selectedDomain = ref('history')
const layoutType = ref('force')
const showRelationLabels = ref(true)
const searchText = ref('')
const searchResults = ref([])

// 当前选中的实体
const selectedEntity = ref(null)

// 图谱数据
const domainData = reactive({
  ai: aiDomain,
  history: historyDomain,
  medical: medicalDomain,
  art: artDomain
})

// 计算当前领域数据
const currentDomainData = computed(() => {
  return domainData[selectedDomain.value]
})

// 返回上一页
const goBack = () => {
  router.push('/home')
  
  // 清理图表资源
  if (chart) {
    chart.dispose()
    chart = null
  }
}

// 初始化图表
const initChart = () => {
  if (!graphContainer.value) return
  
  // 创建图表实例
  chart = echarts.init(graphContainer.value)
  
  // 窗口大小变化时自动调整图表大小
  window.addEventListener('resize', () => {
    chart && chart.resize()
  })
  
  // 第一次渲染图表
  renderGraph()
}

// 处理数据为树形结构
const processDataForTree = (nodes, links, rootId) => {
  // 创建节点映射，方便快速查找
  const nodeMap = {}
  nodes.forEach(node => {
    nodeMap[node.id] = {
      ...node,
      children: []
    }
  })
  
  // 构建父子关系
  links.forEach(link => {
    const source = link.source
    const target = link.target
    
    // 根据关系类型确定父子节点方向
    const relationship = link.value
    
    if (
      relationship === '包含' || 
      relationship === '下令建造' || 
      relationship === '统治者' ||
      source === rootId // 根节点总是父节点
    ) {
      // source是父节点，target是子节点
      if (nodeMap[source] && nodeMap[target]) {
        nodeMap[source].children.push(nodeMap[target])
      }
    }
  })
  
  // 转换为树形数据结构
  const processNode = (node) => {
    return {
      id: node.id,
      name: node.name,
      description: node.description,
      value: node.properties,
      itemStyle: {
        color: node.category !== undefined && currentDomainData.value.categories[node.category] ? 
          currentDomainData.value.categories[node.category].itemStyle.color : '#1890ff'
      },
      children: node.children.length > 0 ? 
        node.children.map(child => processNode(child)) : undefined
    }
  }
  
  // 返回根节点构建的树
  return nodeMap[rootId] ? processNode(nodeMap[rootId]) : null
}

// 渲染知识图谱
const renderGraph = () => {
  if (!chart) return
  
  // 清除之前的事件监听
  chart.off('click')
  
  const data = currentDomainData.value
  
  if (layoutType.value === 'tree') {
    // 确定根节点ID
    let rootId = data.nodes.length > 0 ? data.nodes[0].id : null
    
    if (selectedDomain.value === 'history') {
      rootId = 'ancient_china'
    } else if (selectedDomain.value === 'ai') {
      rootId = 'ai'
    } else if (selectedDomain.value === 'medical') {
      rootId = 'medical_science'
    } else if (selectedDomain.value === 'art') {
      rootId = 'chinese_art'
    }
    
    // 构建树形数据结构
    const treeData = processDataForTree(data.nodes, data.links, rootId)
    
    if (!treeData) {
      console.error("无法创建树形结构，根节点不存在:", rootId)
      return
    }
    
    // 使用树形图
    const option = {
      title: {
        text: data.title || '知识图谱',
        top: 'top',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          const data = params.data
          let html = `<div style="font-weight:bold;font-size:14px;margin-bottom:5px;">${data.name}</div>`
          
          if (data.description) {
            html += `<div>${data.description}</div>`
          }
          
          return html
        }
      },
      series: [{
        type: 'tree',
        data: [treeData],
        top: '10%',
        left: '5%',
        bottom: '10%',
        right: '20%',
        symbolSize: 12,
        orient: 'LR',
        expandAndCollapse: true,
        initialTreeDepth: 3,
        label: {
          position: 'right',
          verticalAlign: 'middle',
          align: 'left',
          fontSize: 14
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        emphasis: {
          focus: 'descendant'
        },
        roam: true,
        lineStyle: {
          width: 1,
          curveness: 0.5
        }
      }]
    }
    
    chart.setOption(option, true)
    
    // 添加树节点点击事件
    chart.on('click', function(params) {
      if (params.data) {
        const nodeId = params.data.id
        const node = findNodeById(nodeId)
        if (node) {
          selectEntity(node)
        }
      }
    })
  } else {
    // 处理力导向图和环形布局
    const nodes = data.nodes
    const links = data.links
    
    // 转换数据格式
    const graphData = {
      nodes: nodes.map(node => ({
        id: node.id,
        name: node.name,
        description: node.description,
        symbolSize: node.symbolSize || 40,
        category: node.category,
        value: node.value,
        properties: node.properties || {},
        label: {
          show: true,
          position: 'right',
          formatter: node.name,
          color: '#333',
          fontSize: 12
        },
        itemStyle: {
          color: data.categories[node.category]?.itemStyle?.color || '#1890ff'
        }
      })),
      links: links.map(link => ({
        source: link.source,
        target: link.target,
        value: link.value,
        label: {
          show: showRelationLabels.value,
          formatter: link.value,
          fontSize: 10
        },
        lineStyle: {
          width: link.lineStyle?.width || 2,
          color: link.lineStyle?.color || '#999',
          opacity: 0.8,
          curveness: link.lineStyle?.curveness || 0.1
        }
      }))
    }
    
    // 布局配置
    let layoutConfig = {}
    if (layoutType.value === 'force') {
      layoutConfig = {
        type: 'force',
        force: {
          repulsion: 1000,
          edgeLength: 150,
          gravity: 0.1,
          layoutAnimation: true
        }
      }
    } else if (layoutType.value === 'circular') {
      layoutConfig = {
        type: 'circular',
        circular: {
          rotateLabel: true
        }
      }
    }
    
    // 图表配置
    const option = {
      title: {
        text: data.title || '知识图谱',
        top: 'top',
        left: 'center'
      },
      tooltip: {
        formatter: function(params) {
          if (params.dataType === 'node') {
            return `<div style="font-weight:bold;font-size:14px;margin-bottom:5px;">${params.data.name}</div>
                    <div>${params.data.description || ''}</div>`
          }
          return params.data.name || ''
        }
      },
      legend: {
        data: data.categories.map(category => category.name),
        orient: 'vertical',
        right: 10,
        top: 20,
        textStyle: {
          color: '#333'
        }
      },
      animationDuration: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [{
        type: 'graph',
        name: '知识图谱',
        layout: layoutConfig.type,
        force: layoutConfig.force,
        circular: layoutConfig.circular,
        data: graphData.nodes,
        links: graphData.links,
        categories: data.categories,
        roam: true,
        draggable: true,
        focusNodeAdjacency: true,
        edgeSymbol: ['none', 'arrow'],
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 5
          }
        }
      }]
    }
    
    chart.setOption(option, true)
    
    // 添加点击事件
    chart.on('click', 'series.graph.node', (params) => {
      const nodeData = params.data
      const node = findNodeById(nodeData.id)
      if (node) {
        selectEntity(node)
      }
    })
  }
}

// 根据ID查找节点
const findNodeById = (id) => {
  const nodes = currentDomainData.value.nodes
  return nodes.find(node => node.id === id)
}

// 选择实体
const selectEntity = (entity) => {
  // 获取相关实体
  const links = currentDomainData.value.links
  const relatedLinks = links.filter(link => 
    link.source === entity.id || link.target === entity.id
  )
  
  // 获取相关实体的ID列表
  const relatedIds = relatedLinks.map(link => 
    link.source === entity.id ? link.target : link.source
  )
  
  // 查找相关实体的详细信息
  const relatedEntities = currentDomainData.value.nodes
    .filter(node => relatedIds.includes(node.id))
    .map(node => ({
      id: node.id,
      name: node.name,
      relationship: relatedLinks.find(link => 
        link.source === node.id || link.target === node.id
      ).value
    }))
  
  // 设置选中的实体，并添加相关实体信息
  selectedEntity.value = {
    ...entity,
    relatedEntities
  }
  
  // 高亮显示选中的节点及其相关节点
  highlightEntity(entity.id)
}

// 选择相关实体
const selectRelatedEntity = (entity) => {
  const node = findNodeById(entity.id)
  if (node) {
    selectEntity(node)
  }
}

// 高亮显示实体
const highlightEntity = (entityId) => {
  if (!chart) return
  
  chart.dispatchAction({
    type: 'focusNodeAdjacency',
    seriesIndex: 0,
    dataIndex: currentDomainData.value.nodes.findIndex(node => node.id === entityId)
  })
}

// 关闭信息面板
const closeInfoPanel = () => {
  selectedEntity.value = null
  // 取消高亮
  if (chart) {
    chart.dispatchAction({
      type: 'unfocusNodeAdjacency',
      seriesIndex: 0
    })
  }
}

// 切换领域
const changeDomain = () => {
  // 更新图表
  renderGraph()
  // 关闭信息面板
  closeInfoPanel()
}

// 切换布局
const changeLayout = () => {
  // 更新图表
  renderGraph()
}

// 切换关系标签显示
const toggleRelationLabels = () => {
  renderGraph()
}

// 重置视图
const resetLayout = () => {
  if (chart) {
    chart.dispatchAction({
      type: 'graphRoam',
      seriesIndex: 0,
      zoom: 1,
      dx: 0,
      dy: 0
    })
    chart.dispatchAction({
      type: 'unfocusNodeAdjacency',
      seriesIndex: 0
    })
  }
  closeInfoPanel()
}

// 搜索处理
const handleSearch = () => {
  if (!searchText.value) {
    searchResults.value = []
    return
  }
  
  // 在当前领域的节点中搜索
  searchResults.value = currentDomainData.value.nodes
    .filter(node => 
      node.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
      (node.description && node.description.toLowerCase().includes(searchText.value.toLowerCase()))
    )
    .slice(0, 10) // 最多显示10个结果
}

// 生命周期钩子
onMounted(() => {
  nextTick(() => {
    initChart()
  })
})

onUnmounted(() => {
  // 清理图表资源
  if (chart) {
    chart.dispose()
    chart = null
  }
  
  // 移除窗口大小变化监听
  window.removeEventListener('resize', () => {})
})
</script>

<style lang="less" scoped>
.knowledge-graph-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f9f9f9;
  overflow: hidden;
  
  .graph-container {
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
    border: 1px solid rgba(0, 0, 0, 0.3);
    transition: all 0.3s;
    
    &:hover {
      background: rgba(0, 0, 0, 0.9);
      border-color: rgba(0, 0, 0, 0.8);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
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
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    padding: 16px;
    border-radius: 8px;
    z-index: 10;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    min-width: 220px;
    
    h3 {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 18px;
      text-align: center;
      color: #333;
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
    background: rgba(255, 255, 255, 0.95);
    color: #333;
    padding: 16px;
    border-radius: 8px;
    z-index: 10;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    max-width: 350px;
    
    h3 {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 18px;
      color: #409EFF;
    }
    
    p {
      margin-bottom: 12px;
      font-size: 14px;
      opacity: 0.9;
    }
    
    .entity-data {
      margin-bottom: 12px;
      
      .data-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        
        .label {
          font-weight: 500;
          color: #606266;
        }
        
        .value {
          color: #333;
        }
      }
    }
    
    .related-entities {
      margin-bottom: 12px;
      
      h4 {
        margin-top: 8px;
        margin-bottom: 8px;
        font-size: 14px;
        color: #606266;
      }
      
      .entity-tag {
        margin-right: 6px;
        margin-bottom: 6px;
        cursor: pointer;
      }
    }
  }
  
  .search-container {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    z-index: 10;
    
    .search-results {
      margin-top: 5px;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      max-height: 200px;
      overflow-y: auto;
      
      .search-result-item {
        padding: 8px 12px;
        cursor: pointer;
        
        &:hover {
          background: #f0f9ff;
        }
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .knowledge-graph-container {
    .control-panel {
      width: calc(100% - 40px);
      left: 20px;
      right: 20px;
      bottom: 20px;
      top: unset;
      
      .control-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
    
    .info-panel {
      left: 50%;
      transform: translateX(-50%);
      bottom: 100px;
      width: calc(100% - 40px);
      max-width: 400px;
    }
    
    .search-container {
      width: calc(100% - 40px);
    }
  }
}
</style> 