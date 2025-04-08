<template>
  <div class="monitoring-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="exit-button" @click="goBack">
        <el-icon><Back /></el-icon>
        <span>返回</span>
      </div>
      <h1>监控运营体系</h1>
      <div class="header-actions">
        <el-button type="primary" @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
        <el-dropdown>
          <el-button>
            <el-icon><Setting /></el-icon>
            设置
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>自动刷新</el-dropdown-item>
              <el-dropdown-item>告警设置</el-dropdown-item>
              <el-dropdown-item>显示设置</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 入口选择 -->
    <div class="entry-selection">
      <div class="entry-card" :class="{ active: activeEntry === 'pc' }" @click="activeEntry = 'pc'">
        <div class="entry-icon">
          <el-icon><Monitor /></el-icon>
        </div>
        <div class="entry-title">PC端监控</div>
        <div class="entry-description">适用于大屏展示的详细监控</div>
      </div>
      
      <div class="entry-card" :class="{ active: activeEntry === 'app' }" @click="activeEntry = 'app'">
        <div class="entry-icon">
          <el-icon><Iphone /></el-icon>
        </div>
        <div class="entry-title">App端监控</div>
        <div class="entry-description">移动端简洁监控视图</div>
      </div>
    </div>

    <!-- PC端监控内容 -->
    <div v-if="activeEntry === 'pc'" class="pc-monitoring">
      <div class="monitoring-tabs">
        <div class="primary-tabs">
          <div 
            class="primary-tab platform" 
            :class="{ active: activeTab === 'platform' }" 
            @click="activeTab = 'platform'"
          >
            <el-icon><DataLine /></el-icon>
            <span>平台运营</span>
          </div>
          <div 
            class="primary-tab component" 
            :class="{ active: activeTab === 'component' }" 
            @click="activeTab = 'component'"
          >
            <el-icon><Connection /></el-icon>
            <span>组件运营</span>
          </div>
          <div 
            class="primary-tab security" 
            :class="{ active: activeTab === 'security' }" 
            @click="activeTab = 'security'"
          >
            <el-icon><Lock /></el-icon>
            <span>安全管控</span>
          </div>
        </div>
        
        <!-- 平台运营二级标签 - 修改任务链路分析为运营分析 -->
        <div v-if="activeTab === 'platform'" class="secondary-tabs platform">
          <div 
            class="secondary-tab" 
            :class="{ active: activePlatformTab === 'tasks' }" 
            @click="activePlatformTab = 'tasks'"
          >
            跑批任务监控
          </div>
          <div 
            class="secondary-tab" 
            :class="{ active: activePlatformTab === 'platform-status' }" 
            @click="activePlatformTab = 'platform-status'"
          >
            平台监控
          </div>
          <div 
            class="secondary-tab" 
            :class="{ active: activePlatformTab === 'operation-analysis' }" 
            @click="activePlatformTab = 'operation-analysis'"
          >
            运营分析
          </div>
        </div>
        
        <!-- 组件运营二级标签 -->
        <div v-if="activeTab === 'component'" class="secondary-tabs component">
          <div 
            class="secondary-tab" 
            :class="{ active: activeComponentTab === 'infrastructure' }" 
            @click="activeComponentTab = 'infrastructure'"
          >
            基础设施监控
          </div>
          <div 
            class="secondary-tab" 
            :class="{ active: activeComponentTab === 'resource' }" 
            @click="activeComponentTab = 'resource'"
          >
            资源占用分析
          </div>
          <div 
            class="secondary-tab" 
            :class="{ active: activeComponentTab === 'components' }" 
            @click="activeComponentTab = 'components'"
          >
            组件监控
          </div>
          <div 
            class="secondary-tab" 
            :class="{ active: activeComponentTab === 'streaming' }" 
            @click="activeComponentTab = 'streaming'"
          >
            流计算监控
          </div>
        </div>
        
        <!-- 安全管控二级标签 - 添加敏感操作监控 -->
        <div v-if="activeTab === 'security'" class="secondary-tabs security">
          <div 
            class="secondary-tab" 
            :class="{ active: activeSecurityTab === 'accounts' }" 
            @click="activeSecurityTab = 'accounts'"
          >
            账户权限管控
          </div>
          <div 
            class="secondary-tab" 
            :class="{ active: activeSecurityTab === 'sensitive' }" 
            @click="activeSecurityTab = 'sensitive'"
          >
            敏感操作监控
          </div>
          <div 
            class="secondary-tab" 
            :class="{ active: activeSecurityTab === 'operations' }" 
            @click="activeSecurityTab = 'operations'"
          >
            敏感操作管控
          </div>
          <div 
            class="secondary-tab" 
            :class="{ active: activeSecurityTab === 'behavior' }" 
            @click="activeSecurityTab = 'behavior'"
          >
            异常行为管控
          </div>
        </div>
      </div>
      
      <!-- 内容区域 -->
      <div class="monitoring-content">
        <!-- 平台运营内容 -->
        <div v-if="activeTab === 'platform'">
          <component :is="getPlatformComponent()" />
        </div>
        
        <!-- 组件运营内容 -->
        <div v-if="activeTab === 'component'">
          <component :is="getComponentComponent()" />
        </div>
        
        <!-- 安全管控内容 -->
        <div v-if="activeTab === 'security'">
          <component :is="getSecurityComponent()" />
        </div>
      </div>
    </div>

    <!-- App端监控内容 -->
    <div v-if="activeEntry === 'app'" class="app-monitoring">
      <!-- 主页面 -->
      <div v-if="!appActiveModule" class="app-container">
        <div class="app-status-bar">
          <div class="time">{{ currentTime }}</div>
          <div class="status-icons">
            <el-icon><Connection /></el-icon>
            <el-icon><Cellphone /></el-icon>
          </div>
        </div>
        
        <div class="app-content">
          <div class="app-header">
            <h3>监控分析运营平台</h3>
            <div class="header-actions">
              <el-icon class="action-icon"><Refresh @click="refreshData" /></el-icon>
              <el-icon class="action-icon"><Bell /></el-icon>
            </div>
          </div>
          
          <!-- 三大模块卡片 -->
          <div class="module-cards">
            <!-- 平台运营卡片 -->
            <div class="module-card" @click="navigateToAppDetail('platform')">
              <div class="card-header platform">
                <div class="card-title">
                  <el-icon><DataLine /></el-icon>
                  <span>平台运营</span>
                </div>
                <el-icon><ArrowRight /></el-icon>
              </div>
              <div class="card-content">
                <div class="status-summary">
                  <div class="status-item success">
                    <div class="status-count">12</div>
                    <div class="status-label">正常</div>
                  </div>
                  <div class="status-item warning">
                    <div class="status-count">3</div>
                    <div class="status-label">警告</div>
                  </div>
                  <div class="status-item error">
                    <div class="status-count">1</div>
                    <div class="status-label">错误</div>
                  </div>
                </div>
                <div class="module-description">
                  <div class="description-item">
                    <div class="label">任务总数:</div>
                    <div class="value">16</div>
                  </div>
                  <div class="description-item">
                    <div class="label">完成率:</div>
                    <div class="value">75%</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 组件运营卡片 -->
            <div class="module-card" @click="navigateToAppDetail('component')">
              <div class="card-header component">
                <div class="card-title">
                  <el-icon><Connection /></el-icon>
                  <span>组件运营</span>
                </div>
                <el-icon><ArrowRight /></el-icon>
              </div>
              <div class="card-content">
                <div class="status-summary">
                  <div class="status-item success">
                    <div class="status-count">8</div>
                    <div class="status-label">正常</div>
                  </div>
                  <div class="status-item warning">
                    <div class="status-count">2</div>
                    <div class="status-label">警告</div>
                  </div>
                  <div class="status-item error">
                    <div class="status-count">0</div>
                    <div class="status-label">错误</div>
                  </div>
                </div>
                <div class="module-description">
                  <div class="description-item">
                    <div class="label">组件总数:</div>
                    <div class="value">10</div>
                  </div>
                  <div class="description-item">
                    <div class="label">资源使用率:</div>
                    <div class="value">68%</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 安全管控卡片 -->
            <div class="module-card" @click="navigateToAppDetail('security')">
              <div class="card-header security">
                <div class="card-title">
                  <el-icon><Lock /></el-icon>
                  <span>安全管控</span>
                </div>
                <el-icon><ArrowRight /></el-icon>
              </div>
              <div class="card-content">
                <div class="status-summary">
                  <div class="status-item success">
                    <div class="status-count">5</div>
                    <div class="status-label">正常</div>
                  </div>
                  <div class="status-item warning">
                    <div class="status-count">1</div>
                    <div class="status-label">警告</div>
                  </div>
                  <div class="status-item error">
                    <div class="status-count">2</div>
                    <div class="status-label">错误</div>
                  </div>
                </div>
                <div class="module-description">
                  <div class="description-item">
                    <div class="label">安全事件:</div>
                    <div class="value">3</div>
                  </div>
                  <div class="description-item">
                    <div class="label">风险等级:</div>
                    <div class="value">中</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 最近活动 -->
          <div class="recent-activities">
            <div class="section-header">
              <h4>最近活动</h4>
              <span>查看全部 <el-icon><ArrowRight /></el-icon></span>
            </div>
            
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-time">10:30</div>
                <div class="activity-content">
                  <div class="activity-title">数据同步任务完成</div>
                  <div class="activity-description">平台运营 · 跑批任务</div>
                </div>
                <div class="activity-status success">
                  <el-icon><SuccessFilled /></el-icon>
                </div>
              </div>
              
              <div class="activity-item">
                <div class="activity-time">09:45</div>
                <div class="activity-content">
                  <div class="activity-title">系统资源使用率过高</div>
                  <div class="activity-description">组件运营 · 资源监控</div>
                </div>
                <div class="activity-status warning">
                  <el-icon><WarningFilled /></el-icon>
                </div>
              </div>
              
              <div class="activity-item">
                <div class="activity-time">09:15</div>
                <div class="activity-content">
                  <div class="activity-title">检测到异常登录尝试</div>
                  <div class="activity-description">安全管控 · 账户安全</div>
                </div>
                <div class="activity-status error">
                  <el-icon><CircleCloseFilled /></el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 平台运营详情页 -->
      <div v-else-if="appActiveModule === 'platform' && !currentAppTask" class="app-container">
        <div class="app-status-bar">
          <div class="time">{{ currentTime }}</div>
          <div class="status-icons">
            <el-icon><Connection /></el-icon>
            <el-icon><Cellphone /></el-icon>
          </div>
        </div>
        
        <div class="app-content">
          <div class="app-header">
            <div class="back-button" @click="appActiveModule = null">
              <el-icon><Back /></el-icon>
              <span>返回</span>
            </div>
            <h3>平台运营</h3>
            <div class="header-actions">
              <el-icon class="action-icon"><Refresh @click="refreshData" /></el-icon>
            </div>
          </div>
          
          <!-- 平台运营选项卡 -->
          <div class="app-tabs">
            <div 
              class="app-tab" 
              :class="{ active: appPlatformTab === 'tasks' }" 
              @click="appPlatformTab = 'tasks'"
            >
              跑批任务
            </div>
            <div 
              class="app-tab" 
              :class="{ active: appPlatformTab === 'status' }" 
              @click="appPlatformTab = 'status'"
            >
              平台状态
            </div>
            <div 
              class="app-tab" 
              :class="{ active: appPlatformTab === 'sensitive' }" 
              @click="appPlatformTab = 'sensitive'"
            >
              敏感操作
            </div>
          </div>
          
          <!-- 跑批任务内容 -->
          <div v-if="appPlatformTab === 'tasks'" class="app-tab-content">
            <div class="status-overview">
              <div class="overview-item success">
                <div class="overview-icon"><el-icon><SuccessFilled /></el-icon></div>
                <div class="overview-data">
                  <div class="overview-value">12</div>
                  <div class="overview-label">已完成</div>
                </div>
              </div>
              <div class="overview-item running">
                <div class="overview-icon"><el-icon><Loading /></el-icon></div>
                <div class="overview-data">
                  <div class="overview-value">3</div>
                  <div class="overview-label">运行中</div>
                </div>
              </div>
              <div class="overview-item error">
                <div class="overview-icon"><el-icon><CircleCloseFilled /></el-icon></div>
                <div class="overview-data">
                  <div class="overview-value">1</div>
                  <div class="overview-label">错误</div>
                </div>
              </div>
            </div>
            
            <div class="task-header">
              <h4>任务列表</h4>
              <div class="task-actions">
                <div class="view-toggle">
                  <el-icon 
                    class="toggle-icon" 
                    :class="{ active: taskViewMode === 'card' }" 
                    @click="taskViewMode = 'card'"
                  >
                    <Grid />
                  </el-icon>
                  <el-icon 
                    class="toggle-icon" 
                    :class="{ active: taskViewMode === 'list' }" 
                    @click="taskViewMode = 'list'"
                  >
                    <List />
                  </el-icon>
                </div>
                <div class="filter-actions">
                  <el-dropdown trigger="click" size="small">
                    <span class="filter-button">
                      筛选 <el-icon><ArrowDown /></el-icon>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>全部</el-dropdown-item>
                        <el-dropdown-item>运行中</el-dropdown-item>
                        <el-dropdown-item>已完成</el-dropdown-item>
                        <el-dropdown-item>错误</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </div>
            
            <!-- 卡片视图 -->
            <div v-if="taskViewMode === 'card'" class="task-card-grid">
              <div 
                v-for="(task, index) in getAppTasks()" 
                :key="index" 
                class="task-card" 
                :class="task.status"
                @click="showAppTaskDetail(task)"
              >
                <div class="task-card-header">
                  <div class="task-name">{{ task.name }}</div>
                  <div class="task-status-icon">
                    <el-icon v-if="task.status === 'success'"><SuccessFilled /></el-icon>
                    <el-icon v-else-if="task.status === 'running'"><Loading /></el-icon>
                    <el-icon v-else-if="task.status === 'warning'"><WarningFilled /></el-icon>
                    <el-icon v-else-if="task.status === 'error'"><CircleCloseFilled /></el-icon>
                  </div>
                </div>
                <div class="task-progress">
                  <el-progress 
                    :percentage="task.progress" 
                    :status="task.status === 'error' ? 'exception' : task.status === 'warning' ? 'warning' : ''"
                    :stroke-width="4"
                    :show-text="false"
                  />
                  <div class="progress-text">{{ task.progress }}%</div>
                </div>
                <div class="task-card-info">
                  <div class="info-row">
                    <div class="info-label">开始:</div>
                    <div class="info-value">{{ task.startTime }}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">耗时:</div>
                    <div class="info-value">{{ task.duration }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 列表视图 -->
            <div v-else class="task-list">
              <div 
                v-for="(task, index) in getAppTasks()" 
                :key="index" 
                class="task-item" 
                :class="task.status"
                @click="showAppTaskDetail(task)"
              >
                <div class="task-item-content">
                  <div class="task-item-header">
                    <div class="task-name">{{ task.name }}</div>
                    <div class="task-status">{{ getStatusText(task.status) }}</div>
                  </div>
                  <div class="task-progress">
                    <el-progress 
                      :percentage="task.progress" 
                      :status="task.status === 'error' ? 'exception' : task.status === 'warning' ? 'warning' : ''"
                      :stroke-width="4"
                    />
                  </div>
                  <div class="task-item-info">
                    <div class="info-item">
                      <el-icon><Timer /></el-icon>
                      <span>{{ task.startTime }}</span>
                    </div>
                    <div class="info-item">
                      <el-icon><AlarmClock /></el-icon>
                      <span>{{ task.duration }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 平台状态内容 -->
          <div v-if="appPlatformTab === 'status'" class="app-tab-content">
            <div class="platform-services">
              <div class="service-item" v-for="(service, index) in getAppPlatformServices()" :key="index">
                <div class="service-header">
                  <div class="service-name">{{ service.name }}</div>
                  <div class="service-status" :class="service.status">
                    <el-icon v-if="service.status === 'normal'"><SuccessFilled /></el-icon>
                    <el-icon v-else-if="service.status === 'warning'"><WarningFilled /></el-icon>
                    <el-icon v-else-if="service.status === 'error'"><CircleCloseFilled /></el-icon>
                  </div>
                </div>
                <div class="service-metrics">
                  <div class="metric-item">
                    <div class="metric-label">响应时间</div>
                    <div class="metric-value">{{ service.responseTime }}ms</div>
                  </div>
                  <div class="metric-item">
                    <div class="metric-label">可用性</div>
                    <div class="metric-value">{{ service.availability }}%</div>
                  </div>
                  <div class="metric-item">
                    <div class="metric-label">负载</div>
                    <div class="metric-value">{{ service.load }}</div>
                  </div>
                </div>
                <div class="service-chart">
                  <div class="chart-placeholder">
                    <!-- 这里可以放置实际的图表组件 -->
                    <div class="mini-chart"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 敏感操作内容 -->
          <div v-if="appPlatformTab === 'sensitive'" class="app-tab-content">
            <div class="sensitive-operations">
              <div class="operation-item" v-for="(operation, index) in getAppSensitiveOperations()" :key="index">
                <div class="operation-time">{{ operation.time }}</div>
                <div class="operation-content">
                  <div class="operation-user">{{ operation.user }}</div>
                  <div class="operation-action">{{ operation.action }}</div>
                  <div class="operation-target">{{ operation.target }}</div>
                </div>
                <div class="operation-level" :class="operation.level">
                  <el-tag size="small" :type="operation.level === 'high' ? 'danger' : operation.level === 'medium' ? 'warning' : 'info'">
                    {{ operation.level === 'high' ? '高' : operation.level === 'medium' ? '中' : '低' }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 任务详情页面 -->
      <div v-else-if="appActiveModule === 'platform' && currentAppTask" class="app-container">
        <div class="app-status-bar">
          <div class="time">{{ currentTime }}</div>
          <div class="status-icons">
            <el-icon><Connection /></el-icon>
            <el-icon><Cellphone /></el-icon>
          </div>
        </div>
        
        <div class="app-content">
          <div class="app-header">
            <div class="back-button" @click="closeAppTaskDetail">
              <el-icon><Back /></el-icon>
              <span>返回</span>
            </div>
            <h3>任务详情</h3>
            <div class="header-actions">
              <el-icon class="action-icon"><Refresh @click="refreshData" /></el-icon>
            </div>
          </div>
          
          <div class="app-task-detail">
            <div class="task-name">{{ currentAppTask.name }}</div>
            
            <div class="task-detail-header" :class="currentAppTask.status">
              <div class="task-status">{{ getStatusText(currentAppTask.status) }}</div>
              <div class="task-progress-text">{{ currentAppTask.progress }}%</div>
            </div>
            
            <el-progress 
              :percentage="currentAppTask.progress" 
              :status="currentAppTask.status === 'error' ? 'exception' : currentAppTask.status === 'warning' ? 'warning' : ''"
              :stroke-width="8"
            />
            
            <div class="task-detail-info">
              <div class="info-item">
                <div class="info-label">开始时间</div>
                <div class="info-value">{{ currentAppTask.startTime }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">预计完成</div>
                <div class="info-value">{{ currentAppTask.endTime }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">耗时</div>
                <div class="info-value">{{ currentAppTask.duration }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">负责人</div>
                <div class="info-value">{{ currentAppTask.owner || '系统' }}</div>
              </div>
            </div>
            
            <div class="task-detail-actions">
              <el-button size="small" type="primary" :disabled="currentAppTask.status === 'success'">
                {{ currentAppTask.status === 'running' ? '暂停' : '开始' }}
              </el-button>
              <el-button size="small" type="danger" :disabled="currentAppTask.status === 'success'">
                终止
              </el-button>
            </div>
            
            <!-- 详情选项卡 -->
            <div class="task-detail-tabs">
              <div 
                class="task-tab" 
                :class="{ active: taskDetailTab === 'subtasks' }" 
                @click="taskDetailTab = 'subtasks'"
              >
                子任务
              </div>
              <div 
                class="task-tab" 
                :class="{ active: taskDetailTab === 'logs' }" 
                @click="taskDetailTab = 'logs'"
              >
                日志
              </div>
              <div 
                class="task-tab" 
                :class="{ active: taskDetailTab === 'dependency' }" 
                @click="taskDetailTab = 'dependency'"
              >
                链路
              </div>
            </div>
            
            <!-- 链路内容 -->
            <div v-if="taskDetailTab === 'dependency'" class="task-tab-content">
              <div class="tree-dependency-chart">
                <div class="tree-node root">
                  <div class="node-content">
                    <div class="node-icon"><el-icon><Timer /></el-icon></div>
                    <div class="node-name">任务开始</div>
                  </div>
                  <div class="node-time">10:30:00</div>
                </div>
                
                <div class="tree-connector"></div>
                
                <div class="tree-node" :class="getNodeStatus('数据准备')">
                  <div class="node-content">
                    <div class="node-icon">
                      <el-icon v-if="getNodeStatus('数据准备') === 'success'"><SuccessFilled /></el-icon>
                      <el-icon v-else-if="getNodeStatus('数据准备') === 'running'"><Loading /></el-icon>
                      <el-icon v-else-if="getNodeStatus('数据准备') === 'warning'"><WarningFilled /></el-icon>
                      <el-icon v-else-if="getNodeStatus('数据准备') === 'error'"><CircleCloseFilled /></el-icon>
                      <el-icon v-else><Clock /></el-icon>
                    </div>
                    <div class="node-name">数据准备</div>
                  </div>
                  <div class="node-time">10:32:15</div>
                </div>
                
                <div class="tree-connector"></div>
                
                <div class="tree-node" :class="getNodeStatus('数据处理')">
                  <div class="node-content">
                    <div class="node-icon">
                      <el-icon v-if="getNodeStatus('数据处理') === 'success'"><SuccessFilled /></el-icon>
                      <el-icon v-else-if="getNodeStatus('数据处理') === 'running'"><Loading /></el-icon>
                      <el-icon v-else-if="getNodeStatus('数据处理') === 'warning'"><WarningFilled /></el-icon>
                      <el-icon v-else-if="getNodeStatus('数据处理') === 'error'"><CircleCloseFilled /></el-icon>
                      <el-icon v-else><Clock /></el-icon>
                    </div>
                    <div class="node-name">数据处理</div>
                  </div>
                  <div class="node-time">10:35:40</div>
                </div>
                
                <!-- 分支节点 -->
                <div class="tree-branch">
                  <div class="branch-line left"></div>
                  <div class="branch-line right"></div>
                </div>
                
                <!-- 左分支 -->
                <div class="tree-branch-container">
                  <div class="branch-item left">
                    <div class="tree-node small" :class="getNodeStatus('数据转换')">
                      <div class="node-content">
                        <div class="node-icon">
                          <el-icon v-if="getNodeStatus('数据转换') === 'success'"><SuccessFilled /></el-icon>
                          <el-icon v-else-if="getNodeStatus('数据转换') === 'running'"><Loading /></el-icon>
                          <el-icon v-else-if="getNodeStatus('数据转换') === 'warning'"><WarningFilled /></el-icon>
                          <el-icon v-else-if="getNodeStatus('数据转换') === 'error'"><CircleCloseFilled /></el-icon>
                          <el-icon v-else><Clock /></el-icon>
                        </div>
                        <div class="node-name">数据转换</div>
                      </div>
                      <div class="node-time">10:38:20</div>
                    </div>
                    
                    <div class="tree-connector small"></div>
                    
                    <div class="tree-node small" :class="getNodeStatus('数据聚合')">
                      <div class="node-content">
                        <div class="node-icon">
                          <el-icon v-if="getNodeStatus('数据聚合') === 'success'"><SuccessFilled /></el-icon>
                          <el-icon v-else-if="getNodeStatus('数据聚合') === 'running'"><Loading /></el-icon>
                          <el-icon v-else-if="getNodeStatus('数据聚合') === 'warning'"><WarningFilled /></el-icon>
                          <el-icon v-else-if="getNodeStatus('数据聚合') === 'error'"><CircleCloseFilled /></el-icon>
                          <el-icon v-else><Clock /></el-icon>
                        </div>
                        <div class="node-name">数据聚合</div>
                      </div>
                      <div class="node-time">10:42:05</div>
                    </div>
                  </div>
                  
                  <div class="branch-item right">
                    <div class="tree-node small" :class="getNodeStatus('数据验证')">
                      <div class="node-content">
                        <div class="node-icon">
                          <el-icon v-if="getNodeStatus('数据验证') === 'success'"><SuccessFilled /></el-icon>
                          <el-icon v-else-if="getNodeStatus('数据验证') === 'running'"><Loading /></el-icon>
                          <el-icon v-else-if="getNodeStatus('数据验证') === 'warning'"><WarningFilled /></el-icon>
                          <el-icon v-else-if="getNodeStatus('数据验证') === 'error'"><CircleCloseFilled /></el-icon>
                          <el-icon v-else><Clock /></el-icon>
                        </div>
                        <div class="node-name">数据验证</div>
                      </div>
                      <div class="node-time">10:38:20</div>
                    </div>
                    
                    <div class="tree-connector small"></div>
                    
                    <div class="tree-node small" :class="getNodeStatus('异常处理')">
                      <div class="node-content">
                        <div class="node-icon">
                          <el-icon v-if="getNodeStatus('异常处理') === 'success'"><SuccessFilled /></el-icon>
                          <el-icon v-else-if="getNodeStatus('异常处理') === 'running'"><Loading /></el-icon>
                          <el-icon v-else-if="getNodeStatus('异常处理') === 'warning'"><WarningFilled /></el-icon>
                          <el-icon v-else-if="getNodeStatus('异常处理') === 'error'"><CircleCloseFilled /></el-icon>
                          <el-icon v-else><Clock /></el-icon>
                        </div>
                        <div class="node-name">异常处理</div>
                      </div>
                      <div class="node-time">10:45:30</div>
                    </div>
                  </div>
                </div>
                
                <!-- 合并节点 -->
                <div class="tree-branch reverse">
                  <div class="branch-line left"></div>
                  <div class="branch-line right"></div>
                </div>
                
                <div class="tree-node" :class="getNodeStatus('数据加载')">
                  <div class="node-content">
                    <div class="node-icon">
                      <el-icon v-if="getNodeStatus('数据加载') === 'success'"><SuccessFilled /></el-icon>
                      <el-icon v-else-if="getNodeStatus('数据加载') === 'running'"><Loading /></el-icon>
                      <el-icon v-else-if="getNodeStatus('数据加载') === 'warning'"><WarningFilled /></el-icon>
                      <el-icon v-else-if="getNodeStatus('数据加载') === 'error'"><CircleCloseFilled /></el-icon>
                      <el-icon v-else><Clock /></el-icon>
                    </div>
                    <div class="node-name">数据加载</div>
                  </div>
                  <div class="node-time">10:50:15</div>
                </div>
                
                <div class="tree-connector"></div>
                
                <div class="tree-node end">
                  <div class="node-content">
                    <div class="node-icon"><el-icon><Select /></el-icon></div>
                    <div class="node-name">任务完成</div>
                  </div>
                  <div class="node-time">10:55:00</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 日志内容 -->
          <div v-if="taskDetailTab === 'logs'" class="task-tab-content">
            <div class="log-list">
              <div class="log-item" v-for="(log, index) in getAppTaskLogs()" :key="index">
                <div class="log-time">{{ log.time }}</div>
                <div class="log-content" :class="log.type">
                  <div class="log-icon">
                    <el-icon v-if="log.type === 'info'"><InfoFilled /></el-icon>
                    <el-icon v-else-if="log.type === 'warning'"><WarningFilled /></el-icon>
                    <el-icon v-else-if="log.type === 'error'"><CircleCloseFilled /></el-icon>
                    <el-icon v-else><SuccessFilled /></el-icon>
                  </div>
                  <div class="log-message">{{ log.message }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 子任务内容 -->
          <div v-if="taskDetailTab === 'subtasks'" class="task-tab-content">
            <div class="filter-actions">
              <el-dropdown trigger="click" size="small">
                <span class="filter-button">
                  筛选 <el-icon><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>全部</el-dropdown-item>
                    <el-dropdown-item>运行中</el-dropdown-item>
                    <el-dropdown-item>已完成</el-dropdown-item>
                    <el-dropdown-item>错误</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            
            <div class="hierarchical-subtask-list">
              <div 
                v-for="(subtask, index) in getAppSubtasks()" 
                :key="index"
                class="subtask-item" 
                :class="[subtask.status, { 'child-task': subtask.level > 1 }]"
                :style="{ marginLeft: (subtask.level - 1) * 20 + 'px' }"
              >
                <div class="subtask-status-icon" :class="subtask.status">
                  <el-icon v-if="subtask.status === 'success'"><SuccessFilled /></el-icon>
                  <el-icon v-else-if="subtask.status === 'running'"><Loading /></el-icon>
                  <el-icon v-else-if="subtask.status === 'warning'"><WarningFilled /></el-icon>
                  <el-icon v-else-if="subtask.status === 'error'"><CircleCloseFilled /></el-icon>
                  <el-icon v-else><Remove /></el-icon>
                </div>
                <div class="subtask-info">
                  <div class="subtask-name">{{ subtask.name }}</div>
                  <div class="subtask-meta" v-if="subtask.parent">
                    <span class="parent-task">{{ subtask.parent }}</span>
                  </div>
                  <div class="subtask-progress">
                    <el-progress 
                      :percentage="subtask.percentage" 
                      :status="subtask.status === 'error' ? 'exception' : subtask.status === 'warning' ? 'warning' : ''"
                      :stroke-width="3"
                      :show-text="false"
                    />
                  </div>
                </div>
                <div class="subtask-details">
                  <div class="subtask-percentage">{{ subtask.percentage }}%</div>
                  <div class="subtask-time">{{ subtask.startTime }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 组件运营详情页 -->
      <div v-else-if="appActiveModule === 'component'" class="app-container">
        <!-- 组件运营详情内容保持不变 -->
      </div>
      
      <!-- 安全管控详情页 -->
      <div v-else-if="appActiveModule === 'security'" class="app-container">
        <!-- 安全管控详情内容保持不变 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, markRaw, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Back, 
  Refresh, 
  Setting, 
  Monitor, 
  Iphone, 
  DataLine, 
  Connection, 
  Lock, 
  Bell, 
  ArrowRight, 
  SuccessFilled, 
  WarningFilled, 
  CircleCloseFilled, 
  Timer, 
  Clock, 
  Select,
  AlarmClock,
  List,
  Grid,
  ArrowDown,
  InfoFilled,
  Remove,
  Loading,
  Cellphone,
  ArrowUp
} from '@element-plus/icons-vue'

// 导入平台运营组件 - 移除敏感操作监控
import PlatformTasks from './components/platform/Tasks.vue'
import PlatformStatus from './components/platform/Status.vue'
import TaskFlow from './components/platform/TaskFlow.vue'

// 导入组件运营组件
import Infrastructure from './components/component/Infrastructure.vue'
import Components from './components/component/Components.vue'
import Streaming from './components/component/Streaming.vue'
import ResourceUsage from './components/platform/ResourceUsage.vue'

// 导入安全管控组件 - 添加敏感操作监控
import AccountControl from './components/security/AccountControl.vue'
import OperationControl from './components/security/OperationControl.vue'
import BehaviorControl from './components/security/BehaviorControl.vue'
// 从平台组件导入
import SensitiveOperations from './components/platform/SensitiveOperations.vue'

// 标记组件为原始值以避免不必要的代理
const componentMap = {
  // 平台运营组件 - 移除敏感操作监控
  'platform-tasks': markRaw(PlatformTasks),
  'platform-status': markRaw(PlatformStatus),
  'platform-task-flow': markRaw(TaskFlow),
  'platform-operation-analysis': markRaw(TaskFlow), // 添加新的映射
  
  // 组件运营组件
  'component-infrastructure': markRaw(Infrastructure),
  'component-components': markRaw(Components),
  'component-streaming': markRaw(Streaming),
  'component-resource': markRaw(ResourceUsage),
  
  // 安全管控组件 - 添加敏感操作监控
  'security-accounts': markRaw(AccountControl),
  'security-operations': markRaw(OperationControl),
  'security-behavior': markRaw(BehaviorControl),
  'security-sensitive': markRaw(SensitiveOperations) // 添加到安全管控
}

const router = useRouter()
const activeEntry = ref('pc') // 默认显示PC端监控
const activeTab = ref('platform') // 默认显示平台运营
const activePlatformTab = ref('tasks') // 默认显示跑批任务监控
const activeComponentTab = ref('infrastructure') // 默认显示基础设施监控
const activeSecurityTab = ref('accounts') // 默认显示账户权限管控

// 获取平台运营组件
const getPlatformComponent = () => {
  if (activePlatformTab.value === 'tasks') {
    return componentMap['platform-tasks']
  } else if (activePlatformTab.value === 'platform-status') {
    return componentMap['platform-status']
  } else if (activePlatformTab.value === 'operation-analysis') {
    return componentMap['platform-operation-analysis'] // 使用新的映射
  }
  return null
}

// 获取组件运营组件
const getComponentComponent = () => {
  if (activeComponentTab.value === 'infrastructure') {
    return componentMap['component-infrastructure']
  } else if (activeComponentTab.value === 'components') {
    return componentMap['component-components']
  } else if (activeComponentTab.value === 'streaming') {
    return componentMap['component-streaming']
  } else if (activeComponentTab.value === 'resource') {
    return componentMap['component-resource']
  }
  return null
}

// 获取安全管控组件
const getSecurityComponent = () => {
  if (activeSecurityTab.value === 'accounts') {
    return componentMap['security-accounts']
  } else if (activeSecurityTab.value === 'operations') {
    return componentMap['security-operations']
  } else if (activeSecurityTab.value === 'behavior') {
    return componentMap['security-behavior']
  } else if (activeSecurityTab.value === 'sensitive') {
    return componentMap['security-sensitive']
  }
  return null
}

// 返回上一页
const goBack = () => {
  router.push('/home')
}

// 刷新数据
const refreshData = () => {
  // 实现刷新逻辑
  console.log('刷新数据')
}

// App端相关状态和方法
const currentTime = ref('10:30')
const appActiveModule = ref(null)
const appPlatformTab = ref('tasks')
const currentAppTask = ref(null)

// 更新当前时间
const updateTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}

// 定时更新时间
let timeInterval
onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 60000) // 每分钟更新一次
})

onBeforeUnmount(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

// 导航到App详情页
const navigateToAppDetail = (module) => {
  appActiveModule.value = module
}

// 显示App任务详情
const showAppTaskDetail = (task) => {
  currentAppTask.value = task
}

// 关闭任务详情
const closeAppTaskDetail = () => {
  currentAppTask.value = null
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'success': '已完成',
    'running': '运行中',
    'warning': '警告',
    'error': '错误',
    'pending': '等待中',
    'normal': '正常'
  }
  return statusMap[status] || status
}

// 获取App子任务 - 更新为带层级和父任务的结构，名称与PC端保持一致
const getAppSubtasks = () => {
  if (!currentAppTask.value) return []
  
  return [
    { 
      name: '数据准备', 
      percentage: 100, 
      status: 'success',
      level: 1,
      parent: null,
      startTime: '08:00',
      endTime: '08:15',
      id: 'task-1'
    },
    { 
      name: '数据清洗', 
      percentage: 100, 
      status: 'success',
      level: 2,
      parent: '数据准备',
      startTime: '08:15',
      endTime: '08:30',
      id: 'task-2'
    },
    { 
      name: '数据转换', 
      percentage: 85, 
      status: 'running',
      level: 2,
      parent: '数据准备',
      startTime: '08:15',
      endTime: '08:35',
      id: 'task-3'
    },
    { 
      name: '数据校验', 
      percentage: 60, 
      status: 'warning',
      level: 2,
      parent: '数据准备',
      startTime: '08:15',
      endTime: '08:25',
      id: 'task-4'
    },
    { 
      name: '指标计算', 
      percentage: 30, 
      status: 'running',
      level: 3,
      parent: '数据清洗',
      startTime: '08:30',
      endTime: '09:00',
      id: 'task-5'
    }
  ]
}

// 添加任务详情选项卡状态
const taskDetailTab = ref('subtasks')

// 添加任务视图模式状态
const taskViewMode = ref('card') // 默认为卡片视图

// 获取依赖关系数据
const getDependencyData = () => {
  return [
    { name: '数据准备', level: 1, parent: '开始', status: 'success', startTime: '08:00', endTime: '08:15' },
    { name: '数据清洗', level: 2, parent: '数据准备', status: 'success', startTime: '08:15', endTime: '08:30' },
    { name: '数据转换', level: 2, parent: '数据准备', status: 'success', startTime: '08:15', endTime: '08:35' },
    { name: '数据校验', level: 2, parent: '数据准备', status: 'success', startTime: '08:15', endTime: '08:25' },
    { name: '指标计算', level: 3, parent: '数据清洗', status: 'running', startTime: '08:30', endTime: '09:00' },
    { name: '风险评估', level: 3, parent: '数据清洗', status: 'pending', startTime: '08:30', endTime: '09:15' },
    { name: '数据聚合', level: 3, parent: '数据转换', status: 'running', startTime: '08:35', endTime: '09:05' },
    { name: '数据分区', level: 3, parent: '数据转换', status: 'pending', startTime: '08:35', endTime: '09:10' },
    { name: '质量检查', level: 3, parent: '数据校验', status: 'warning', startTime: '08:25', endTime: '08:45' },
    { name: '异常处理', level: 3, parent: '数据校验', status: 'error', startTime: '08:25', endTime: '08:50' },
    { name: '数据加载', level: 4, parent: '多个父节点', status: 'pending', startTime: '09:15', endTime: '09:45' }
  ]
}

// 更新getNodeStatus函数，使用依赖关系数据
const getNodeStatus = (nodeName) => {
  const node = getDependencyData().find(item => item.name === nodeName)
  return node ? node.status : 'pending'
}

// 获取节点时间
const getNodeTime = (nodeName) => {
  const node = getDependencyData().find(item => item.name === nodeName)
  return node ? node.startTime : '--:--'
}

// 获取App任务 - 更新任务名称与PC端保持一致
const getAppTasks = () => {
  return [
    {
      id: 1,
      name: '数仓跑批',
      status: 'running',
      progress: 65,
      startTime: '08:00',
      endTime: '预计 09:30',
      duration: '1小时30分',
      owner: '系统'
    },
    {
      id: 2,
      name: '大数据跑批',
      status: 'success',
      progress: 100,
      startTime: '07:30',
      endTime: '08:45',
      duration: '1小时15分',
      owner: '张三'
    },
    {
      id: 3,
      name: '监管集市跑批',
      status: 'warning',
      progress: 80,
      startTime: '08:15',
      endTime: '预计 09:45',
      duration: '1小时30分',
      owner: '李四'
    },
    {
      id: 4,
      name: '数字化运营跑批',
      status: 'error',
      progress: 45,
      startTime: '08:30',
      endTime: '失败',
      duration: '30分钟',
      owner: '王五'
    },
    {
      id: 5,
      name: '泰隆数据跑批监测',
      status: 'pending',
      progress: 0,
      startTime: '计划 10:00',
      endTime: '预计 11:00',
      duration: '预计1小时',
      owner: '系统'
    }
  ]
}

// 获取App任务日志
const getAppTaskLogs = () => {
  if (!currentAppTask.value) return []
  
  return [
    { time: '08:00:00', type: 'success', message: '任务启动成功' },
    { time: '08:02:15', type: 'info', message: '开始数据准备阶段' },
    { time: '08:15:30', type: 'success', message: '数据准备阶段完成' },
    { time: '08:15:45', type: 'info', message: '开始数据清洗和转换' },
    { time: '08:25:10', type: 'warning', message: '发现部分数据格式异常，尝试自动修复' },
    { time: '08:30:25', type: 'info', message: '数据清洗完成，开始指标计算' },
    { time: '08:35:40', type: 'info', message: '数据转换完成，开始数据聚合' },
    { time: '08:40:15', type: 'error', message: '异常处理失败，部分数据无法处理' },
    { time: '08:45:30', type: 'info', message: '重试处理失败数据' }
  ]
}

// 获取App平台服务
const getAppPlatformServices = () => {
  return [
    { name: '数据接入服务', status: 'normal', responseTime: 120, availability: 99.9, load: '低' },
    { name: '计算引擎', status: 'normal', responseTime: 150, availability: 99.8, load: '中' },
    { name: '存储服务', status: 'warning', responseTime: 200, availability: 98.5, load: '高' },
    { name: '调度服务', status: 'normal', responseTime: 100, availability: 99.9, load: '低' },
    { name: 'API网关', status: 'error', responseTime: 350, availability: 95.0, load: '高' }
  ]
}

// 获取App敏感操作
const getAppSensitiveOperations = () => {
  return [
    { time: '10:15', user: '管理员', action: '修改权限', target: '用户组A', level: 'high' },
    { time: '09:30', user: '系统', action: '数据删除', target: '历史数据表', level: 'medium' },
    { time: '09:15', user: '用户A', action: '导出数据', target: '客户信息', level: 'high' },
    { time: '08:45', user: '用户B', action: '修改配置', target: '系统参数', level: 'low' },
    { time: '08:30', user: '管理员', action: '重启服务', target: 'API服务', level: 'medium' }
  ]
}

// 其他PC端相关代码保持不变
</script>

<style lang="less" scoped>
.monitoring-container {
  min-height: 100vh;
  background-color: #f5f9fc;
  color: #333;
  padding: 20px;
  
  .page-header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    
    h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
      color: #1a3a5f;
    }
    
    .exit-button {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-right: 20px;
      padding: 8px 16px;
      border-radius: 8px;
      background: #fff;
      color: #1890ff;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.3s;
      
      &:hover {
        background: #e6f7ff;
      }
    }
    
    .header-actions {
      margin-left: auto;
      display: flex;
      gap: 10px;
    }
  }
  
  .entry-selection {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
    
    .entry-card {
      flex: 1;
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s;
      border: 2px solid transparent;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(24, 144, 255, 0.1);
      }
      
      &.active {
        border-color: #1890ff;
        background: #fff;
      }
      
      .entry-icon {
        font-size: 36px;
        margin-bottom: 15px;
        color: #1890ff;
      }
      
      .entry-title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 10px;
        color: #1a3a5f;
      }
      
      .entry-description {
        color: #666;
        font-size: 14px;
      }
    }
  }
  
  .pc-monitoring {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    
    .monitoring-tabs {
      margin-bottom: 20px;
      
      .primary-tabs {
        display: flex;
        border-bottom: 1px solid #eee;
        margin-bottom: 15px;
        
        .primary-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px 0;
          cursor: pointer;
          position: relative;
          transition: all 0.3s;
          
          .el-icon {
            font-size: 24px;
            margin-bottom: 8px;
          }
          
          span {
            font-size: 16px;
            font-weight: 500;
          }
          
          &::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 3px;
            transform: scaleX(0);
            transition: transform 0.3s;
          }
          
          &:hover {
            background: rgba(0, 0, 0, 0.02);
          }
          
          &.active {
            &::after {
              transform: scaleX(1);
            }
          }
          
          &.platform {
            color: #1890ff;
            
            &::after {
              background-color: #1890ff;
            }
            
            &.active {
              background: rgba(24, 144, 255, 0.05);
            }
          }
          
          &.component {
            color: #722ed1;
            
            &::after {
              background-color: #722ed1;
            }
            
            &.active {
              background: rgba(114, 46, 209, 0.05);
            }
          }
          
          &.security {
            color: #f5222d;
            
            &::after {
              background-color: #f5222d;
            }
            
            &.active {
              background: rgba(245, 34, 45, 0.05);
            }
          }
        }
      }
      
      .secondary-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        padding: 0 10px;
        
        .secondary-tab {
          padding: 6px 16px;
          border-radius: 16px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        &.platform {
          .secondary-tab {
            background: rgba(24, 144, 255, 0.05);
            color: #1890ff;
            
            &:hover {
              background: rgba(24, 144, 255, 0.1);
            }
            
            &.active {
              background: #1890ff;
              color: white;
            }
          }
        }
        
        &.component {
          .secondary-tab {
            background: rgba(114, 46, 209, 0.05);
            color: #722ed1;
            
            &:hover {
              background: rgba(114, 46, 209, 0.1);
            }
            
            &.active {
              background: #722ed1;
              color: white;
            }
          }
        }
        
        &.security {
          .secondary-tab {
            background: rgba(245, 34, 45, 0.05);
            color: #f5222d;
            
            &:hover {
              background: rgba(245, 34, 45, 0.1);
            }
            
            &.active {
              background: #f5222d;
              color: white;
            }
          }
        }
      }
    }
    
    .monitoring-content {
      min-height: 500px;
      padding: 20px;
      background: #fafafa;
      border-radius: 8px;
    }
  }
  
  .app-monitoring {
    display: flex;
    justify-content: center;
    padding: 20px 0;
    
    .app-container {
      width: 375px;
      height: 667px;
      background: #fff;
      border-radius: 30px;
      overflow: hidden;
      position: relative;
      border: 10px solid #e8e8e8;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      
      .app-status-bar {
        height: 30px;
        background: #f0f0f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        color: #333;
        
        .status-icons {
          display: flex;
          gap: 8px;
          color: #666;
        }
      }
      
      .app-content {
        height: calc(100% - 30px);
        overflow-y: auto;
        padding: 15px;
        
        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          
          h3 {
            margin: 0;
            font-size: 20px;
            color: #1a3a5f;
          }
          
          .header-actions {
            display: flex;
            gap: 15px;
            
            .action-icon {
              font-size: 22px;
              color: #1890ff;
              cursor: pointer;
            }
          }
        }
        
        .module-cards {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
          
          .module-card {
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            
            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
            }
            
            .card-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 15px;
              color: white;
              
              &.platform { background: linear-gradient(to right, #1890ff, #36a9ff); }
              &.component { background: linear-gradient(to right, #722ed1, #8c51e4); }
              &.security { background: linear-gradient(to right, #f5222d, #ff4d4f); }
              
              .card-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 16px;
                font-weight: 500;
                
                .el-icon {
                  font-size: 18px;
                }
              }
              
              .el-icon {
                font-size: 16px;
              }
            }
            
            .card-content {
              padding: 15px;
              
              .status-summary {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                
                .status-item {
                  text-align: center;
                  padding: 8px 0;
                  border-radius: 6px;
                  width: 30%;
                  
                  &.success { 
                    background: rgba(82, 196, 26, 0.1); 
                    color: #52c41a;
                  }
                  &.warning { 
                    background: rgba(250, 173, 20, 0.1); 
                    color: #faad14;
                  }
                  &.error { 
                    background: rgba(245, 34, 45, 0.1); 
                    color: #f5222d;
                  }
                  
                  .status-count {
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 2px;
                  }
                  
                  .status-label {
                    font-size: 12px;
                    opacity: 0.8;
                  }
                }
              }
              
              .module-description {
                display: flex;
                justify-content: space-between;
                
                .description-item {
                  display: flex;
                  align-items: center;
                  gap: 5px;
                  
                  .label {
                    font-size: 13px;
                    color: #666;
                  }
                  
                  .value {
                    font-size: 14px;
                    font-weight: 500;
                    color: #333;
                  }
                }
              }
            }
          }
        }
        
        .recent-activities {
          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            
            h4 {
              margin: 0;
              font-size: 16px;
              color: #1a3a5f;
            }
            
            span {
              font-size: 12px;
              color: #666;
              display: flex;
              align-items: center;
              gap: 2px;
              cursor: pointer;
              
              &:hover {
                color: #1890ff;
              }
            }
          }
          
          .activity-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            
            .activity-item {
              display: flex;
              align-items: center;
              padding: 12px;
              background: #f9f9f9;
              border-radius: 8px;
              
              .activity-time {
                font-size: 12px;
                color: #999;
                width: 40px;
              }
              
              .activity-content {
                flex-grow: 1;
                margin: 0 10px;
                
                .activity-title {
                  font-size: 14px;
                  margin-bottom: 3px;
                  color: #333;
                }
                
                .activity-description {
                  font-size: 12px;
                  color: #999;
                }
              }
              
              .activity-status {
                font-size: 18px;
                
                &.success { color: #52c41a; }
                &.warning { color: #faad14; }
                &.error { color: #f5222d; }
              }
            }
          }
        }
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .monitoring-container {
    .entry-selection {
      flex-direction: column;
    }
  }
}

// App端平台运营详情样式
.app-content {
  .app-header {
    .back-button {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #666;
      cursor: pointer;
      
      &:hover {
        color: #1890ff;
      }
    }
  }
  
  .app-tabs {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
    
    .app-tab {
      flex: 1;
      text-align: center;
      padding: 10px 0;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      position: relative;
      
      &.active {
        color: #1890ff;
        font-weight: 500;
        
        &:after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 25%;
          width: 50%;
          height: 2px;
          background: #1890ff;
        }
      }
    }
  }
  
  .app-tab-content {
    .status-overview {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      
      .overview-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-radius: 8px;
        width: 30%;
        
        &.success {
          background: rgba(82, 196, 26, 0.1);
          color: #52c41a;
        }
        
        &.running {
          background: rgba(24, 144, 255, 0.1);
          color: #1890ff;
        }
        
        &.error {
          background: rgba(245, 34, 45, 0.1);
          color: #f5222d;
        }
        
        .overview-icon {
          font-size: 24px;
        }
        
        .overview-data {
          .overview-value {
            font-size: 18px;
            font-weight: 600;
          }
          
          .overview-label {
            font-size: 12px;
            opacity: 0.8;
          }
        }
      }
    }
    
    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 15px 0 10px;
      
      h4 {
        margin: 0;
        font-size: 16px;
        color: #1a3a5f;
      }
      
      .task-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        
        .view-toggle {
          display: flex;
          align-items: center;
          background: #f5f5f5;
          border-radius: 4px;
          padding: 2px;
          
          .toggle-icon {
            padding: 4px;
            font-size: 16px;
            color: #999;
            cursor: pointer;
            border-radius: 3px;
            
            &.active {
              background: white;
              color: #1890ff;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            }
          }
        }
      }
    }
    
    // 卡片视图
    .task-card-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 20px;
      
      .task-card {
        background: white;
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        cursor: pointer;
        transition: transform 0.2s;
        border-top: 3px solid #ddd;
        
        &:active {
          transform: scale(0.98);
        }
        
        &.success { border-top-color: #52c41a; }
        &.running { border-top-color: #1890ff; }
        &.warning { border-top-color: #faad14; }
        &.error { border-top-color: #f5222d; }
        
        .task-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
          
          .task-name {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            line-height: 1.3;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          
          .task-status-icon {
            font-size: 16px;
            margin-left: 8px;
            
            .success & { color: #52c41a; }
            .running & { color: #1890ff; }
            .warning & { color: #faad14; }
            .error & { color: #f5222d; }
          }
        }
        
        .task-progress {
          margin-bottom: 10px;
          position: relative;
          
          .progress-text {
            position: absolute;
            right: 0;
            top: -5px;
            font-size: 12px;
            color: #666;
          }
        }
        
        .task-card-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
          
          .info-row {
            display: flex;
            font-size: 12px;
            
            .info-label {
              color: #999;
              width: 40px;
            }
            
            .info-value {
              color: #666;
              flex: 1;
            }
          }
        }
      }
    }
    
    // 列表视图
    .task-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
      
      .task-item {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        cursor: pointer;
        transition: transform 0.2s;
        border-left: 4px solid #ddd;
        
        &:active {
          transform: scale(0.99);
        }
        
        &.success { border-left-color: #52c41a; }
        &.running { border-left-color: #1890ff; }
        &.warning { border-left-color: #faad14; }
        &.error { border-left-color: #f5222d; }
        
        .task-item-content {
          padding: 12px;
          
          .task-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            
            .task-name {
              font-size: 15px;
              font-weight: 500;
              color: #333;
            }
            
            .task-status {
              font-size: 13px;
              
              .success & { color: #52c41a; }
              .running & { color: #1890ff; }
              .warning & { color: #faad14; }
              .error & { color: #f5222d; }
            }
          }
          
          .task-progress {
            margin-bottom: 10px;
          }
          
          .task-item-info {
            display: flex;
            justify-content: space-between;
            
            .info-item {
              display: flex;
              align-items: center;
              gap: 5px;
              font-size: 12px;
              color: #666;
              
              .el-icon {
                font-size: 14px;
                color: #999;
              }
            }
          }
        }
      }
    }
    
    .platform-services {
      display: flex;
      flex-direction: column;
      gap: 15px;
      
      .service-item {
        background: white;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        
        .service-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          
          .service-name {
            font-size: 15px;
            font-weight: 500;
            color: #333;
          }
          
          .service-status {
            font-size: 18px;
            
            &.normal { color: #52c41a; }
            &.warning { color: #faad14; }
            &.error { color: #f5222d; }
          }
        }
        
        .service-metrics {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          
          .metric-item {
            text-align: center;
            
            .metric-label {
              font-size: 12px;
              color: #999;
              margin-bottom: 3px;
            }
            
            .metric-value {
              font-size: 14px;
              font-weight: 500;
              color: #333;
            }
          }
        }
        
        .service-chart {
          height: 40px;
          
          .chart-placeholder {
            width: 100%;
            height: 100%;
            
            .mini-chart {
              width: 100%;
              height: 100%;
              background: linear-gradient(to right, #e6f7ff, #bae7ff, #91d5ff, #69c0ff);
              border-radius: 4px;
              opacity: 0.7;
            }
          }
        }
      }
    }
    
    .sensitive-operations {
      display: flex;
      flex-direction: column;
      gap: 10px;
      
      .operation-item {
        display: flex;
        align-items: center;
        padding: 12px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        
        .operation-time {
          width: 40px;
          font-size: 12px;
          color: #999;
        }
        
        .operation-content {
          flex-grow: 1;
          margin: 0 10px;
          
          .operation-user {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 3px;
            color: #333;
          }
          
          .operation-action {
            font-size: 13px;
            color: #666;
            margin-bottom: 2px;
          }
          
          .operation-target {
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
  }
}

// App任务详情页样式
.app-task-detail {
  padding: 0 5px;
  
  .task-name {
    font-size: 18px;
    font-weight: 600;
    color: #1a3a5f;
    margin-bottom: 15px;
    text-align: center;
  }
  
  .task-detail-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    
    .task-status {
      font-size: 16px;
      font-weight: 500;
    }
    
    .task-progress-text {
      font-size: 16px;
      font-weight: 600;
    }
    
    &.success { color: #52c41a; }
    &.running { color: #1890ff; }
    &.warning { color: #faad14; }
    &.error { color: #f5222d; }
  }
  
  .task-detail-info {
    display: flex;
    flex-wrap: wrap;
    margin: 15px 0;
    background: white;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    .info-item {
      width: 50%;
      margin-bottom: 10px;
      
      .info-label {
        font-size: 12px;
        color: #999;
        margin-bottom: 3px;
      }
      
      .info-value {
        font-size: 14px;
        color: #333;
      }
    }
  }
  
  .task-detail-actions {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  // 任务详情选项卡
  .task-detail-tabs {
    display: flex;
    margin: 15px 0;
    border-bottom: 1px solid #e0e0e0;
    
    .task-tab {
      flex: 1;
      text-align: center;
      padding: 10px 0;
      font-size: 14px;
      color: #666;
      position: relative;
      cursor: pointer;
      
      &.active {
        color: #1890ff;
        font-weight: 500;
        
        &:after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 20%;
          width: 60%;
          height: 2px;
          background: #1890ff;
        }
      }
    }
  }
  
  // 链路内容
  .tree-dependency-chart {
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .tree-node {
      width: 90%;
      padding: 10px 15px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      border-left: 4px solid #ddd;
      
      &.small {
        width: 100%;
        padding: 8px 12px;
        
        .node-name {
          font-size: 13px;
        }
        
        .node-time {
          font-size: 11px;
        }
      }
      
      &.success { border-left-color: #52c41a; }
      &.running { border-left-color: #1890ff; }
      &.warning { border-left-color: #faad14; }
      &.error { border-left-color: #f5222d; }
      &.pending { border-left-color: #d9d9d9; }
      
      &.root, &.end {
        border-left-color: #1890ff;
        background: #f0f7ff;
      }
      
      .node-content {
        display: flex;
        align-items: center;
        
        .node-icon {
          margin-right: 10px;
          font-size: 16px;
          
          .success & { color: #52c41a; }
          .running & { color: #1890ff; }
          .warning & { color: #faad14; }
          .error & { color: #f5222d; }
          .root &, .end & { color: #1890ff; }
        }
        
        .node-name {
          font-size: 14px;
          color: #333;
        }
      }
      
      .node-time {
        font-size: 12px;
        color: #999;
      }
    }
    
    .tree-connector {
      width: 2px;
      height: 30px;
      background: #e0e0e0;
      margin: 5px 0;
      
      &.small {
        height: 20px;
      }
    }
    
    .tree-branch {
      width: 90%;
      height: 30px;
      position: relative;
      
      .branch-line {
        position: absolute;
        background: #e0e0e0;
        
        &.left {
          width: 50%;
          height: 2px;
          top: 0;
          left: 0;
          border-bottom-right-radius: 10px;
          border-bottom-left-radius: 0;
          border-top-right-radius: 10px;
          border-top-left-radius: 0;
          
          &:after {
            content: '';
            position: absolute;
            width: 2px;
            height: 30px;
            background: #e0e0e0;
            bottom: 0;
            right: 0;
          }
        }
        
        &.right {
          width: 50%;
          height: 2px;
          top: 0;
          right: 0;
          border-bottom-right-radius: 0;
          border-bottom-left-radius: 10px;
          border-top-right-radius: 0;
          border-top-left-radius: 10px;
          
          &:after {
            content: '';
            position: absolute;
            width: 2px;
            height: 30px;
            background: #e0e0e0;
            bottom: 0;
            left: 0;
          }
        }
      }
      
      &.reverse {
        .branch-line {
          &.left, &.right {
            top: auto;
            bottom: 0;
            
            &:after {
              bottom: auto;
              top: 0;
            }
          }
        }
      }
    }
    
    .tree-branch-container {
      display: flex;
      width: 90%;
      justify-content: space-between;
      
      .branch-item {
        width: 48%;
        display: flex;
        flex-direction: column;
        align-items: center;
        
        &.left {
          align-items: flex-start;
        }
        
        &.right {
          align-items: flex-end;
        }
      }
    }
  }
}

/* 添加子任务列表样式 */
.compact-subtask-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
  
  .compact-subtask-item {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 6px;
    padding: 8px 10px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    
    .subtask-status-icon {
      margin-right: 8px;
      font-size: 16px;
      
      &.success { color: #52c41a; }
      &.running { color: #1890ff; }
      &.warning { color: #faad14; }
      &.error { color: #f5222d; }
      &.pending { color: #d9d9d9; }
    }
    
    .subtask-info {
      flex-grow: 1;
      margin-right: 8px;
      
      .subtask-name {
        font-size: 13px;
        margin-bottom: 4px;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .subtask-progress {
        height: 3px;
      }
    }
    
    .subtask-percentage {
      font-size: 12px;
      font-weight: 500;
      color: #666;
      width: 36px;
      text-align: right;
    }
  }
}

/* 层级子任务列表样式 */
.hierarchical-subtask-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
  
  .subtask-item {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 6px;
    padding: 8px 10px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.2s;
    border-left: 3px solid #ddd;
    
    &.child-task {
      position: relative;
      
      &:before {
        content: '';
        position: absolute;
        left: -15px;
        top: 50%;
        width: 12px;
        height: 1px;
        background: #ddd;
      }
    }
    
    &.success { border-left-color: #52c41a; }
    &.running { border-left-color: #1890ff; }
    &.warning { border-left-color: #faad14; }
    &.error { border-left-color: #f5222d; }
    &.pending { border-left-color: #d9d9d9; }
    
    .subtask-status-icon {
      margin-right: 8px;
      font-size: 16px;
      
      &.success { color: #52c41a; }
      &.running { color: #1890ff; }
      &.warning { color: #faad14; }
      &.error { color: #f5222d; }
      &.pending { color: #d9d9d9; }
    }
    
    .subtask-info {
      flex-grow: 1;
      margin-right: 8px;
      
      .subtask-name {
        font-size: 13px;
        margin-bottom: 2px;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .subtask-meta {
        font-size: 11px;
        color: #999;
        margin-bottom: 4px;
        
        .parent-task {
          background: #f5f5f5;
          padding: 1px 4px;
          border-radius: 3px;
        }
      }
      
      .subtask-progress {
        height: 3px;
      }
    }
    
    .subtask-details {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      
      .subtask-percentage {
        font-size: 12px;
        font-weight: 500;
        color: #666;
      }
      
      .subtask-time {
        font-size: 11px;
        color: #999;
        margin-top: 2px;
      }
    }
  }
}

/* 运营分析样式 */
.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  
  h4 {
    margin: 0;
    font-size: 16px;
    color: #333;
  }
  
  .time-range-selector {
    display: flex;
    background: #f5f5f5;
    border-radius: 4px;
    overflow: hidden;
    
    span {
      padding: 4px 8px;
      font-size: 12px;
      color: #666;
      
      &.selected {
        background: #1890ff;
        color: white;
      }
    }
  }
}

.analysis-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
  overflow: hidden;
  
  .analysis-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    border-bottom: 1px solid #f0f0f0;
    
    .card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 500;
      color: #333;
      
      .el-icon {
        font-size: 16px;
        color: #1890ff;
      }
    }
    
    .el-icon {
      color: #999;
    }
  }
  
  .analysis-card-content {
    padding: 15px;
  }
  
  /* 任务重复报错率样式 */
  .error-rate-chart {
    margin-bottom: 15px;
    
    .bar-chart {
      display: flex;
      flex-direction: column;
      gap: 12px;
      
      .bar-item {
        display: flex;
        align-items: center;
        
        .bar-label {
          width: 110px;
          font-size: 12px;
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .bar-container {
          flex-grow: 1;
          height: 8px;
          background: #f0f0f0;
          border-radius: 4px;
          margin: 0 10px;
          overflow: hidden;
          
          .bar-value {
            height: 100%;
            background: #ff4d4f;
            border-radius: 4px;
          }
        }
        
        .bar-percentage {
          width: 40px;
          font-size: 12px;
          color: #ff4d4f;
          text-align: right;
        }
      }
    }
  }
  
  .error-rate-summary {
    display: flex;
    justify-content: space-around;
    
    .summary-item {
      text-align: center;
      
      .summary-value {
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 4px;
        
        &.error { color: #ff4d4f; }
        &.warning { color: #faad14; }
        &.success { color: #52c41a; }
      }
      
      .summary-label {
        font-size: 12px;
        color: #999;
      }
    }
  }
  
  /* 关键路径变化分析样式 */
  .path-analysis-chart {
    margin-bottom: 15px;
    
    .path-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .path-name {
        font-size: 13px;
        color: #333;
      }
      
      .path-trend {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        font-weight: 500;
        
        &.success { color: #52c41a; }
        &.warning { color: #faad14; }
        &.error { color: #ff4d4f; }
      }
    }
  }
  
  .path-analysis-summary {
    background: #f9f9f9;
    padding: 10px;
    border-radius: 4px;
    
    .summary-text {
      font-size: 12px;
      color: #666;
      line-height: 1.5;
      
      .warning { color: #faad14; }
      .error { color: #ff4d4f; }
    }
  }
  
  /* 任务超时统计样式 */
  .timeout-chart {
    display: flex;
    
    .donut-chart-container {
      width: 100px;
      height: 100px;
      position: relative;
      margin-right: 15px;
      
      .donut-chart {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: conic-gradient(
          #ff4d4f 0% 24%,
          #f5f5f5 24% 100%
        );
        position: relative;
        
        .donut-hole {
          position: absolute;
          width: 60%;
          height: 60%;
          background: white;
          border-radius: 50%;
          top: 20%;
          left: 20%;
          display: flex;
          align-items: center;
          justify-content: center;
          
          .donut-label {
            text-align: center;
            
            .donut-percent {
              font-size: 16px;
              font-weight: 500;
              color: #ff4d4f;
            }
            
            .donut-text {
              font-size: 10px;
              color: #999;
            }
          }
        }
      }
    }
    
    .timeout-details {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .timeout-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .timeout-label {
          font-size: 12px;
          color: #666;
        }
        
        .timeout-value {
          font-size: 13px;
          font-weight: 500;
          
          &.error { color: #ff4d4f; }
          &.warning { color: #faad14; }
          &.success { color: #52c41a; }
        }
      }
    }
  }
}
</style> 