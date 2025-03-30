<template>
  <div class="drag-drop-container">
    <div class="exit-button" @click="goBack">
      <el-icon><Back /></el-icon>
      <span>返回</span>
    </div>

    <div class="page-header">
      <h1>拖拉拽功能演示</h1>
    </div>

    <div class="demo-select">
      <el-radio-group v-model="currentDemo" @change="handleDemoChange">
        <el-radio-button label="html5">HTML5 原生拖拽</el-radio-button>
        <el-radio-button label="vuedraggable">VueDraggable</el-radio-button>
        <el-radio-button label="sortablejs">SortableJS</el-radio-button>
        <el-radio-button label="gridstack">GridStack</el-radio-button>
      </el-radio-group>
    </div>

    <div class="demo-description" v-if="demoDescriptions[currentDemo]">
      <el-alert
        :title="demoDescriptions[currentDemo]?.title || ''"
        :description="demoDescriptions[currentDemo]?.description || ''"
        type="info"
        show-icon
      />
    </div>

    <!-- HTML5 原生拖拽 -->
    <div v-show="currentDemo === 'html5'" class="demo-content">
      <h2>HTML5 原生拖拽示例</h2>
      <div class="html5-drag-container">
        <div class="drag-source-container">
          <h3>拖拽源</h3>
          <div 
            v-for="item in html5Items" 
            :key="item.id"
            class="drag-item"
            :class="{ 'being-dragged': item.id === draggedItemId }"
            draggable="true"
            @dragstart="handleDragStart($event, item)"
            @dragend="handleDragEnd"
          >
            {{ item?.content || '' }}
          </div>
        </div>
        
        <div 
          class="drop-target"
          :class="{ 'active': dropActive }"
          @dragover="handleDragOver"
          @drop="handleDrop"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
        >
          <div v-if="droppedItems.length === 0" class="drop-placeholder">
            将项目拖到这里
          </div>
          <div v-else class="dropped-items">
            <div
              v-for="item in droppedItems"
              :key="item.id"
              class="dropped-item"
            >
              {{ item?.content || '' }}
              <el-icon class="remove-icon" @click="removeDroppedItem(item)"><Delete /></el-icon>
            </div>
          </div>
        </div>
      </div>
      
      <div class="demo-explanation">
        <h3>实现方式</h3>
        <pre class="code-block" v-pre><code>
// HTML 部分
&lt;div 
  draggable="true"
  @dragstart="handleDragStart($event, item)"
  @dragend="handleDragEnd"
&gt;
  {{ item?.content || '' }}
&lt;/div&gt;

&lt;div 
  class="drop-target"
  @dragover="handleDragOver"
  @drop="handleDrop"
  @dragenter="handleDragEnter"
  @dragleave="handleDragLeave"
&gt;
  放置区域
&lt;/div&gt;

// JavaScript 部分
const handleDragStart = (e, item) => {
  if (!item) return;
  draggedItemId.value = item.id;
  e.dataTransfer.setData('text/plain', item.id);
};

const handleDragOver = (e) => {
  // 允许放置
  e.preventDefault();
};

const handleDrop = (e) => {
  e.preventDefault();
  const itemId = e.dataTransfer.getData('text/plain');
  if (!itemId) return;
  const item = html5Items.value.find(i => i.id === itemId);
  if (item && !droppedItems.value.some(i => i.id === item.id)) {
    droppedItems.value.push({...item});
  }
  dropActive.value = false;
};
        </code></pre>
      </div>
    </div>

    <!-- VueDraggable 演示 -->
    <div v-show="currentDemo === 'vuedraggable'" class="demo-content">
      <h2>VueDraggable 示例</h2>
      <div class="vuedraggable-container">
        <div class="vuedraggable-section">
          <h3>列表 1</h3>
          <draggable
            v-model="dragList1"
            group="lists"
            item-key="id"
            :animation="200"
            ghost-class="ghost-card"
            chosen-class="chosen-card"
            drag-class="drag-card"
            @start="dragging=true"
            @end="dragging=false"
          >
            <template #item="{element}">
              <div class="list-item">
                <div class="list-item-content">
                  <el-icon><Operation /></el-icon>
                  <span>{{ element.name }}</span>
                </div>
              </div>
            </template>
          </draggable>
          
          <div class="placeholder-text" style="margin-top: 15px;">
            <pre class="code-block" v-pre><code>
import draggable from 'vuedraggable'

&lt;draggable
  v-model="list1"
  group="items"
  item-key="id"
  :animation="200"
  ghost-class="ghost"
&gt;
  &lt;template #item="{element}"&gt;
    &lt;div class="list-item"&gt;{{ element?.name || '' }}&lt;/div&gt;
  &lt;/template&gt;
&lt;/draggable&gt;
            </code></pre>
          </div>
        </div>
        
        <div class="vuedraggable-section">
          <h3>列表 2 <small>(从左侧拖动到此处)</small></h3>
          <draggable
            v-model="dragList2"
            group="lists"
            item-key="id"
            :animation="200"
            ghost-class="ghost-card"
            chosen-class="chosen-card"
            drag-class="drag-card"
            @start="dragging=true"
            @end="dragging=false"
          >
            <template #item="{element}">
              <div class="list-item">
                <div class="list-item-content">
                  <el-icon><Document /></el-icon>
                  <span>{{ element.name }}</span>
                </div>
              </div>
            </template>
          </draggable>
          
          <div class="placeholder-text" style="margin-top: 15px;">
            <h4>VueDraggable特点:</h4>
            <ul>
              <li>与Vue无缝集成</li>
              <li>支持列表间拖拽</li>
              <li>丰富的事件回调</li>
              <li>可自定义拖拽时的样式</li>
              <li>支持排序、新增、删除等操作</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- SortableJS 演示 -->
    <div v-show="currentDemo === 'sortablejs'" class="demo-content">
      <h2>SortableJS 示例</h2>
      <div class="sortablejs-container">
        <div class="sortable-demo">
          <h3>可排序列表</h3>
          <div class="sortable-list-container">
            <div class="toolbar">
              <el-button type="primary" size="small" @click="addSortableItem">添加项目</el-button>
              <el-button type="danger" size="small" @click="clearSortableItems">清空</el-button>
            </div>
            <div ref="sortableList" class="sortable-list-items">
              <div v-for="item in sortableItems" :key="item.id" class="sortable-item">
                <div class="handle">
                  <el-icon><Operation /></el-icon>
                </div>
                <div class="content">{{ item.name }}</div>
                <div class="action" @click="removeSortableItem(item.id)">
                  <el-icon><Delete /></el-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="sortable-status">
            <p v-if="lastSortableEvent"><strong>上次操作:</strong> {{ lastSortableEvent }}</p>
          </div>
          
          <div class="placeholder-text" style="margin-top: 25px;">
            <h4>代码实现:</h4>
            <pre class="code-block" v-pre><code>
import Sortable from 'sortablejs'

onMounted(() => {
  const el = document.querySelector('.sortable-list-items');
  Sortable.create(el, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    handle: '.handle',
    onEnd: (evt) => {
      console.log('项目从索引 ' + evt.oldIndex + ' 移动到 ' + evt.newIndex);
    }
  });
});
            </code></pre>
          </div>
        </div>
      </div>
    </div>

    <!-- GridStack 演示 -->
    <div v-show="currentDemo === 'gridstack'" class="demo-content">
      <h2>GridStack 示例</h2>
      <div class="gridstack-demo">
        <h3>可拖拽网格仪表板</h3>
        <div class="toolbar">
          <el-button type="primary" size="small" @click="addGridWidget">添加组件</el-button>
          <el-button type="warning" size="small" @click="saveGrid">保存布局</el-button>
          <el-button type="info" size="small" @click="loadGrid">恢复布局</el-button>
          <el-button type="danger" size="small" @click="clearGrid">清空</el-button>
        </div>
        
        <div class="grid-container">
          <div ref="gridContainer" class="grid-stack"></div>
        </div>
        
        <div class="placeholder-text" style="margin-top: 15px;">
          <div v-if="savedLayout" class="saved-layout">
            <h4>已保存的布局:</h4>
            <pre>{{ JSON.stringify(savedLayout, null, 2) }}</pre>
          </div>
          
          <h4>GridStack特点:</h4>
          <ul>
            <li>支持拖拽放置、调整大小</li>
            <li>响应式布局</li>
            <li>可序列化保存布局</li>
            <li>支持动态添加/删除组件</li>
            <li>适合构建仪表板、自定义布局</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, nextTick, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { Back, Delete, Document, Operation } from '@element-plus/icons-vue';
import draggable from 'vuedraggable';
import Sortable from 'sortablejs';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

const router = useRouter();
const currentDemo = ref('html5');
const draggedItemId = ref('');
const dropActive = ref(false);
const dragging = ref(false);

// HTML5 原生拖拽数据
const html5Items = ref([
  { id: 'item1', content: '项目 1' },
  { id: 'item2', content: '项目 2' },
  { id: 'item3', content: '项目 3' },
  { id: 'item4', content: '项目 4' },
  { id: 'item5', content: '项目 5' },
]);

// 确保初始化为空数组
const droppedItems = ref<any[]>([]);

// VueDraggable数据
const dragList1 = ref([
  { id: 1, name: '任务 1' },
  { id: 2, name: '任务 2' },
  { id: 3, name: '任务 3' },
  { id: 4, name: '任务 4' },
]);

const dragList2 = ref([
  { id: 5, name: '项目 A' },
  { id: 6, name: '项目 B' },
]);

// SortableJS 数据
const sortableList = ref<HTMLElement | null>(null);
const sortableItems = ref([
  { id: 'sort1', name: '可排序项目 1' },
  { id: 'sort2', name: '可排序项目 2' },
  { id: 'sort3', name: '可排序项目 3' },
]);
const lastSortableEvent = ref('');
let sortableInstance: any = null;

// GridStack 数据
const gridContainer = ref<HTMLElement | null>(null);
let grid: any = null;
const widgetCount = ref(0);
const savedLayout = ref(null);

// 返回主页
const goBack = () => {
  router.push('/home');
};

// 各演示的描述
const demoDescriptions = reactive({
  html5: {
    title: 'HTML5 原生拖拽',
    description: 'HTML5原生支持的拖拽API，包括dragstart、dragover、drop等事件，无需依赖第三方库。适合简单的拖拽需求。'
  },
  vuedraggable: {
    title: 'VueDraggable',
    description: 'Vue.js的拖拽排序组件，基于SortableJS。支持列表排序、拖拽交换、动画效果等，与Vue集成度高。'
  },
  sortablejs: {
    title: 'SortableJS',
    description: '强大的JavaScript库，用于可拖拽排序列表。支持触摸设备，提供丰富的事件和选项。VueDraggable的底层库。'
  },
  gridstack: {
    title: 'GridStack',
    description: '强大的网格布局库，支持拖拽、调整大小、响应式布局。适合构建仪表板和可视化布局工具。'
  }
});

// HTML5 拖拽事件处理
const handleDragStart = (e, item) => {
  if (!item) return;
  draggedItemId.value = item.id;
  e.dataTransfer.setData('text/plain', item.id);
};

const handleDragEnd = () => {
  draggedItemId.value = '';
};

const handleDragOver = (e) => {
  e.preventDefault(); // 允许放置
};

const handleDragEnter = (e) => {
  e.preventDefault();
  dropActive.value = true;
};

const handleDragLeave = (e) => {
  // 确保不是子元素引起的
  if (e.currentTarget.contains(e.relatedTarget)) return;
  dropActive.value = false;
};

const handleDrop = (e) => {
  e.preventDefault();
  const itemId = e.dataTransfer.getData('text/plain');
  if (!itemId) return;
  
  const item = html5Items.value.find(i => i.id === itemId);
  if (item && !droppedItems.value.some(i => i.id === item.id)) {
    droppedItems.value.push({...item});
  }
  dropActive.value = false;
};

const removeDroppedItem = (item) => {
  if (!item) return;
  const index = droppedItems.value.findIndex(i => i.id === item.id);
  if (index !== -1) {
    droppedItems.value.splice(index, 1);
  }
};

// SortableJS 函数
const initSortable = () => {
  if (sortableList.value) {
    sortableInstance = Sortable.create(sortableList.value, {
      animation: 150,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      handle: '.handle',
      onStart: () => {
        lastSortableEvent.value = '开始拖拽';
      },
      onEnd: (evt) => {
        lastSortableEvent.value = `从索引 ${evt.oldIndex} 移动到索引 ${evt.newIndex}`;
      }
    });
  }
};

const addSortableItem = () => {
  const id = `sort${Date.now()}`;
  sortableItems.value.push({
    id,
    name: `新项目 ${sortableItems.value.length + 1}`
  });
  lastSortableEvent.value = '添加了新项目';
};

const removeSortableItem = (id) => {
  const index = sortableItems.value.findIndex(item => item.id === id);
  if (index !== -1) {
    sortableItems.value.splice(index, 1);
    lastSortableEvent.value = '删除了一个项目';
  }
};

const clearSortableItems = () => {
  sortableItems.value = [];
  lastSortableEvent.value = '清空了所有项目';
};

// GridStack 函数
const initGridStack = () => {
  if (gridContainer.value) {
    grid = GridStack.init({
      column: 12,
      cellHeight: 50,
      animate: true,
      resizable: {
        handles: 'all'
      }
    }, gridContainer.value);
    
    // 添加初始组件
    addGridWidget();
    addGridWidget();
  }
};

const addGridWidget = () => {
  if (!grid) return;
  
  widgetCount.value++;
  const colors = ['#FF4757', '#1E90FF', '#2ED573', '#FFD632', '#747D8C', '#9B59B6'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const x = Math.floor(Math.random() * 9); // 0-8
  const y = Math.floor(Math.random() * 5); // 0-4
  const width = Math.floor(Math.random() * 3) + 2; // 2-4
  const height = Math.floor(Math.random() * 2) + 1; // 1-2
  
  const content = `
    <div class="grid-stack-item-content" style="background-color: ${color};">
      <div class="widget-header">组件 ${widgetCount.value}</div>
      <div class="widget-body">
        <p>可拖动和调整大小</p>
        <p>x:${x}, y:${y}, w:${width}, h:${height}</p>
      </div>
    </div>
  `;
  
  grid.addWidget({
    x, y, w: width, h: height,
    content
  });
};

const saveGrid = () => {
  if (grid) {
    savedLayout.value = grid.save();
  }
};

const loadGrid = () => {
  if (grid && savedLayout.value) {
    grid.load(savedLayout.value);
  }
};

const clearGrid = () => {
  if (grid) {
    grid.removeAll();
    widgetCount.value = 0;
  }
};

// 切换演示
const handleDemoChange = (value) => {
  if (!value) return;
  currentDemo.value = value;
  
  // 当切换到不同的演示时，确保正确初始化
  nextTick(() => {
    if (value === 'sortablejs' && sortableList.value && !sortableInstance) {
      initSortable();
    } else if (value === 'gridstack' && gridContainer.value && !grid) {
      initGridStack();
    }
  });
};

onMounted(() => {
  // 确保初始化设置正确的演示类型和空的droppedItems
  currentDemo.value = 'html5';
  droppedItems.value = [];
});

onBeforeUnmount(() => {
  // 清理资源
  if (sortableInstance) {
    sortableInstance.destroy();
    sortableInstance = null;
  }
  
  if (grid) {
    grid.destroy();
    grid = null;
  }
});
</script>

<style lang="less" scoped>
.drag-drop-container {
  position: relative;
  min-height: 100vh;
  background: #f7f9fc;
  padding: 20px;
  color: #333;
  
  .exit-button {
    position: fixed;
    top: 20px;
    left: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.8);
    color: #6a11cb;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    z-index: 10;
    border: 1px solid rgba(106, 17, 203, 0.2);
    backdrop-filter: blur(5px);
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    &:hover {
      background: #fff;
      border-color: rgba(106, 17, 203, 0.4);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
    
    .el-icon {
      font-size: 18px;
    }
    
    span {
      font-size: 16px;
      font-weight: 500;
    }
  }
  
  .page-header {
    text-align: center;
    padding: 30px 0;
    margin-bottom: 20px;
    
    h1 {
      font-size: 32px;
      color: #6a11cb;
      margin: 0;
      font-weight: 600;
      background: linear-gradient(135deg, #6a11cb, #2575fc);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }
  
  .demo-select {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .demo-description {
    max-width: 800px;
    margin: 0 auto 30px;
  }
  
  .demo-content {
    max-width: 900px;
    margin: 0 auto;
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    
    h2 {
      color: #6a11cb;
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 22px;
      font-weight: 600;
    }
    
    h3 {
      color: #2575fc;
      font-size: 18px;
      margin-bottom: 15px;
      
      small {
        font-size: 14px;
        font-weight: normal;
        color: #666;
      }
    }
    
    h4 {
      margin-top: 15px;
      margin-bottom: 10px;
      color: #333;
      font-size: 16px;
    }
  }
  
  // HTML5 原生拖拽样式
  .html5-drag-container {
    display: flex;
    gap: 40px;
    margin-bottom: 30px;
    
    .drag-source-container {
      flex: 1;
      padding: 15px;
      background: #f0f4ff;
      border-radius: 8px;
      min-height: 300px;
      
      .drag-item {
        padding: 12px 16px;
        background: #fff;
        margin-bottom: 10px;
        border-radius: 6px;
        cursor: move;
        transition: all 0.2s;
        border: 1px solid #e0e7ff;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        
        &:hover {
          background: #f9f9ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
        }
        
        &.being-dragged {
          opacity: 0.5;
          transform: scale(0.98);
        }
      }
    }
    
    .drop-target {
      flex: 1;
      padding: 15px;
      background: #fff0f9;
      border-radius: 8px;
      min-height: 300px;
      border: 2px dashed #ffadd2;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      
      &.active {
        background: #ffe6f7;
        border-color: #ff85c0;
      }
      
      .drop-placeholder {
        color: #ff85c0;
        font-style: italic;
        font-size: 16px;
      }
      
      .dropped-items {
        width: 100%;
        
        .dropped-item {
          padding: 12px 16px;
          background: #fff;
          margin-bottom: 10px;
          border-radius: 6px;
          border: 1px solid #ffd6e7;
          position: relative;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          transition: all 0.2s;
          
          &:hover {
            background: #fff9fc;
          }
          
          .remove-icon {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #ff4d4f;
            cursor: pointer;
            
            &:hover {
              color: #f5222d;
            }
          }
        }
      }
    }
  }
  
  .demo-explanation {
    background: #f9fafb;
    padding: 15px;
    border-radius: 8px;
    margin-top: 20px;
    
    pre {
      background: #282c34;
      color: #abb2bf;
      padding: 15px;
      border-radius: 6px;
      overflow-x: auto;
      font-family: 'Fira Code', monospace;
      font-size: 14px;
      line-height: 1.5;
    }
  }
  
  // VueDraggable 样式
  .vuedraggable-container {
    display: flex;
    gap: 40px;
    
    .vuedraggable-section {
      flex: 1;
      padding: 15px;
      background: #f0f7ff;
      border-radius: 8px;
      min-height: 300px;
      
      .list-item {
        padding: 12px 16px;
        background: #fff;
        margin-bottom: 10px;
        border-radius: 6px;
        cursor: move;
        transition: all 0.2s;
        border: 1px solid #e0e7ff;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        
        &:hover {
          background: #f9f9ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
        }
        
        .list-item-content {
          display: flex;
          align-items: center;
          gap: 10px;
          
          .el-icon {
            color: #409EFF;
          }
        }
      }
      
      .placeholder-text {
        color: #555;
        margin-bottom: 15px;
        line-height: 1.6;
      }
      
      pre {
        background: #282c34;
        color: #abb2bf;
        padding: 15px;
        border-radius: 6px;
        overflow-x: auto;
        font-family: 'Fira Code', monospace;
        font-size: 14px;
        line-height: 1.5;
      }
      
      ul {
        padding-left: 20px;
        
        li {
          margin-bottom: 8px;
        }
      }
    }
  }
  
  // SortableJS 样式
  .sortablejs-container {
    .sortable-demo {
      padding: 15px;
      
      .sortable-list-container {
        .toolbar {
          margin-bottom: 15px;
          display: flex;
          gap: 10px;
        }
        
        .sortable-list-items {
          background: #f0fff4;
          border-radius: 8px;
          min-height: 50px;
          padding: 10px;
          border: 1px solid #e0f5e0;
          
          .sortable-item {
            display: flex;
            align-items: center;
            background: white;
            margin-bottom: 10px;
            border-radius: 6px;
            border: 1px solid #d9ecda;
            overflow: hidden;
            
            .handle {
              padding: 12px;
              background: #67c23a;
              color: white;
              cursor: move;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .content {
              padding: 12px;
              flex: 1;
            }
            
            .action {
              padding: 12px;
              color: #f56c6c;
              cursor: pointer;
              
              &:hover {
                background: #fff5f5;
              }
            }
          }
          
          .sortable-ghost {
            opacity: 0.5;
            background: #f0f0f0;
          }
          
          .sortable-chosen {
            background: #e6f7ff;
          }
          
          .sortable-drag {
            border: 1px dashed #1890ff;
          }
        }
      }
      
      .sortable-status {
        margin-top: 15px;
        padding: 10px;
        background: #f5f7fa;
        border-radius: 4px;
        min-height: 30px;
      }
    }
  }
  
  // GridStack 样式
  .gridstack-demo {
    .toolbar {
      margin-bottom: 15px;
      display: flex;
      gap: 10px;
    }
    
    .grid-container {
      .grid-stack {
        background: #f9f9fa;
        border-radius: 8px;
        border: 1px solid #eee;
        min-height: 400px;
      }
    }
    
    .saved-layout {
      margin-top: 20px;
      background: #f0f0f0;
      padding: 10px;
      border-radius: 4px;
      
      pre {
        max-height: 200px;
        overflow: auto;
        background: #fff;
        padding: 10px;
        border-radius: 4px;
        font-size: 12px;
      }
    }
  }
}

// 网格组件样式
:deep(.grid-stack-item-content) {
  color: white;
  text-align: center;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .widget-header {
    padding: 8px;
    font-weight: bold;
    background: rgba(0, 0, 0, 0.2);
  }
  
  .widget-body {
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: calc(100% - 36px);
    
    p {
      margin: 5px 0;
    }
  }
}

// 拖拽特效类
.ghost-card {
  opacity: 0.5;
  background: #f0f0f0 !important;
  border: 1px dashed #ccc !important;
}

.chosen-card {
  background: #e6f7ff !important;
}

.drag-card {
  transform: rotate(2deg);
  border: 1px dashed #1890ff !important;
}
</style> 