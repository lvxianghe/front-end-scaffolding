<template>
  <div class="bounty-container">
    <el-button class="back-home-btn" type="text" @click="backToHome">
      <el-icon><Back /></el-icon>
      返回首页
    </el-button>
    <h1 class="bounty-title">悬赏金系统</h1>
    <div class="bounty-content">
      <div class="task-hall">
        <div class="filter-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索任务"
            prefix-icon="Search"
            clearable
            @clear="handleSearch"
            @input="handleSearch"
          />
          <el-select v-model="categoryFilter" placeholder="分类筛选" @change="handleSearch">
            <el-option label="全部分类" value="" />
            <el-option label="技术开发" value="development" />
            <el-option label="内容创作" value="content" />
            <el-option label="设计" value="design" />
            <el-option label="市场" value="marketing" />
            <el-option label="其他" value="other" />
          </el-select>
          <el-select v-model="statusFilter" placeholder="状态筛选" @change="handleSearch">
            <el-option label="全部状态" value="" />
            <el-option label="待认领" value="pending" />
            <el-option label="进行中" value="in-progress" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </div>
        
        <div class="user-info-section">
          <div class="bounty-entrance-card">
            <div class="bounty-card-illustration">
              <div class="pirate-king">
                <img src="https://img.icons8.com/color/96/000000/pirate.png" alt="海盗王" class="pirate-image"/>
              </div>
              <div class="gold-coins">
                <img src="https://img.icons8.com/color/96/000000/treasure-chest.png" alt="金币" class="treasure-image"/>
              </div>
            </div>
            <div class="bounty-card-info">
              <div class="bounty-card-row">
                <div class="info-block">
                  <h3>我的金币</h3>
                  <div class="big-value">{{ userBalance }}</div>
                </div>
                <div class="info-block">
                  <h3>我的段位</h3>
                  <div class="big-value">{{ getRankName(userRank) }}</div>
                  <div class="rank-stars">
                    <span 
                      v-for="i in 5" 
                      :key="i" 
                      class="rank-star" 
                      :class="{ 'active': i <= userRankStars }"
                    >★</span>
                    <el-tooltip class="rank-tooltip" effect="light">
                      <template #content>
                        <div class="rank-tooltip-content">
                          <h3>段位系统</h3>
                          <p>完成任务可以提升段位，任务失败会降低段位</p>
                          <div class="rank-list">
                            <div v-for="(rank, index) in rankList" :key="index" class="rank-item">
                              <span class="rank-icon">{{ rank.icon }}</span>
                              <span class="rank-name">{{ rank.name }}</span>
                            </div>
                          </div>
                          <div class="rank-promotion">
                            <h4>段位晋升规则</h4>
                            <p>1. 每个段位有5颗星，集满5星晋升下一段位</p>
                            <p>2. 完成任务获得1-3颗星（根据任务等级）</p>
                            <p>3. 任务失败扣除1颗星</p>
                            <p>4. 高段位会获得更多的任务发布特权</p>
                          </div>
                        </div>
                      </template>
                      <el-icon class="rank-help-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <el-button type="warning" size="large" icon="Plus" @click="showPublishDialog = true">发布任务</el-button>
            <el-button type="primary" size="large" icon="Collection" @click="showMyPublishedTasks">我的发布</el-button>
            <el-button type="success" size="large" icon="Service" @click="showMyClaimedTasks">我的认领</el-button>
            <el-button type="info" size="large" icon="Wallet" @click="showMyWallet">我的钱包</el-button>
            <el-button :type="hasDailyClaimed ? 'info' : 'danger'" size="large" icon="Calendar" 
              :disabled="hasDailyClaimed" 
              @click="claimDaily">
              {{ hasDailyClaimed ? '已签到' : '每日签到' }}
            </el-button>
            <el-button :type="hasMonthlySignInClaimed ? 'info' : 'warning'" size="large" icon="Calendar" 
              :disabled="hasMonthlySignInClaimed" 
              @click="claimMonthlySignIn">
              {{ hasMonthlySignInClaimed ? '已领取' : '每月签到' }}
            </el-button>
          </div>
        </div>

        <h3 class="section-title">可领取任务</h3>
        <div class="task-list">
          <el-empty v-if="filteredTasks.length === 0" description="暂无符合条件的任务" />
          <div v-else>
            <div class="task-grid">
              <task-card
                v-for="task in paginatedTasks"
                :key="task.id"
                :task="task"
                @click="viewTaskDetail(task)"
              />
            </div>
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="currentPage"
                :page-size="pageSize"
                layout="prev, pager, next, jumper"
                :total="filteredTasks.length"
                @current-change="handlePageChange"
                background
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <el-dialog v-model="showTaskDetail" title="任务详情" width="50%" append-to-body destroy-on-close>
      <div v-if="currentTask" class="task-detail">
        <h2>{{ currentTask.title }}</h2>
        <div class="task-info">
          <p><span>分类：</span>{{ getCategoryName(currentTask.category) }}</p>
          <p><span>悬赏金额：</span>{{ currentTask.reward }} 金币</p>
          <p><span>状态：</span>{{ getStatusName(currentTask.status) }}</p>
          <p><span>截止日期：</span>{{ currentTask.deadline }}</p>
          <p><span>发布者：</span>{{ currentTask.publisher }}</p>
        </div>
        <div class="task-description">
          <h3>任务描述</h3>
          <p>{{ currentTask.description }}</p>
        </div>
        <div class="task-requirements">
          <h3>任务要求</h3>
          <p>{{ currentTask.requirements }}</p>
        </div>
        <div class="task-actions">
          <el-button v-if="currentTask.status === 'pending'" type="warning" @click="claimTask">认领任务</el-button>
          <el-button v-if="isMyPublishedTask && currentTask.status === 'in-progress'" type="success" @click="confirmTaskCompletion">确认完成</el-button>
          <el-button v-if="isMyClaimedTask && currentTask.status === 'in-progress'" type="warning" @click="submitTaskCompletion">提交完成</el-button>
        </div>
      </div>
    </el-dialog>
    
    <el-dialog v-model="showMyTasks" title="我的任务" width="80%" append-to-body destroy-on-close>
      <el-tabs v-model="myTaskTab">
        <el-tab-pane label="我发布的" name="published">
          <div class="task-list">
            <el-empty v-if="myPublishedTasks.length === 0" description="暂无已发布任务" />
            <div v-else>
              <div class="task-grid">
                <task-card
                  v-for="task in paginatedPublishedTasks"
                  :key="task.id"
                  :task="task"
                  @click="viewTaskDetail(task)"
                />
              </div>
              <div class="pagination-container">
                <el-pagination
                  v-model:current-page="publishedPage"
                  :page-size="pageSize"
                  layout="prev, pager, next, jumper"
                  :total="myPublishedTasks.length"
                  @current-change="handlePublishedPageChange"
                  background
                />
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="我认领的" name="claimed">
          <div class="task-list">
            <el-empty v-if="myClaimedTasks.length === 0" description="暂无已认领任务" />
            <div v-else>
              <div class="task-grid">
                <task-card
                  v-for="task in paginatedClaimedTasks"
                  :key="task.id"
                  :task="task"
                  @click="viewTaskDetail(task)"
                />
              </div>
              <div class="pagination-container">
                <el-pagination
                  v-model:current-page="claimedPage"
                  :page-size="pageSize"
                  layout="prev, pager, next, jumper"
                  :total="myClaimedTasks.length"
                  @current-change="handleClaimedPageChange"
                  background
                />
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="我的钱包" name="wallet">
          <div class="wallet">
            <div class="benefits">
              <h3>每日福利</h3>
              <div class="benefit-cards">
                <div class="benefit-card">
                  <h4>每日签到</h4>
                  <p>每日可领取 10 金币</p>
                  <el-button type="warning" :disabled="hasDailyClaimed" @click="claimDaily">
                    {{ hasDailyClaimed ? '已领取' : '立即领取' }}
                  </el-button>
                </div>
                
                <div class="benefit-card">
                  <h4>每月签到</h4>
                  <p>每月可领取 50 金币</p>
                  <el-button type="warning" :disabled="hasMonthlySignInClaimed" @click="claimMonthlySignIn">
                    {{ hasMonthlySignInClaimed ? '已领取' : '立即领取' }}
                  </el-button>
                </div>
                
                <div class="benefit-card">
                  <h4>月卡福利</h4>
                  <p>每月可领取 300 金币</p>
                  <el-button type="warning" :disabled="!hasMonthlyCard || hasMonthlyCardClaimed" @click="claimMonthly">
                    {{ !hasMonthlyCard ? '未开通' : (hasMonthlyCardClaimed ? '已领取' : '立即领取') }}
                  </el-button>
                  <div v-if="!hasMonthlyCard" class="activate-card">
                    <el-button type="success" @click="activateMonthlyCard">开通月卡</el-button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="transaction-history">
              <h3>交易记录</h3>
              <div class="table-wrapper">
                <el-table :data="transactions" style="width: 100%" :max-height="300">
                  <el-table-column prop="date" label="日期" width="100" />
                  <el-table-column prop="type" label="类型" width="100" />
                  <el-table-column prop="amount" label="金额" width="100" />
                  <el-table-column prop="description" label="说明" />
                </el-table>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    
    <el-dialog v-model="showPublishDialog" title="发布任务" width="50%" append-to-body destroy-on-close>
      <el-form :model="newTask" label-width="120px">
        <el-form-item label="任务标题">
          <el-input v-model="newTask.title" placeholder="请输入任务标题" />
        </el-form-item>
        <el-form-item label="任务分类">
          <el-select v-model="newTask.category" placeholder="请选择任务分类">
            <el-option label="技术开发" value="development" />
            <el-option label="内容创作" value="content" />
            <el-option label="设计" value="design" />
            <el-option label="市场" value="marketing" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="悬赏金额">
          <el-input-number v-model="newTask.reward" :min="1" :max="userBalance" />
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker v-model="newTask.deadline" type="date" placeholder="选择截止日期" />
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input v-model="newTask.description" type="textarea" rows="4" placeholder="请详细描述任务内容" />
        </el-form-item>
        <el-form-item label="任务要求">
          <el-input v-model="newTask.requirements" type="textarea" rows="4" placeholder="请详细描述任务要求与验收标准" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showPublishDialog = false">取消</el-button>
          <el-button type="warning" @click="publishTask">发布</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { QuestionFilled, Plus, Collection, Service, Wallet, Calendar, Back } from '@element-plus/icons-vue';
import TaskCard from './components/TaskCard.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const backToHome = () => {
  router.push('/home');
};

const myTaskTab = ref('published');

const searchKeyword = ref('');
const categoryFilter = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const pageSize = ref(8);
const publishedPage = ref(1);
const claimedPage = ref(1);

const userBalance = ref(1000);
const hasDailyClaimed = ref(false);
const hasMonthlyCard = ref(true);
const hasMonthlyCardClaimed = ref(false);
const hasMonthlySignInClaimed = ref(false);

// 段位系统相关数据
const userRank = ref(3); // 默认黄金段位
const userRankStars = ref(2); // 默认2颗星

const rankList = ref([
  { id: 0, name: '黑铁', icon: '🔧' },
  { id: 1, name: '青铜', icon: '🥉' },
  { id: 2, name: '白银', icon: '🥈' },
  { id: 3, name: '黄金', icon: '🥇' },
  { id: 4, name: '翡翠', icon: '🧩' },
  { id: 5, name: '钻石', icon: '💎' },
  { id: 6, name: '大师', icon: '🏆' },
  { id: 7, name: '王者', icon: '👑' }
]);

// 计算任务数量
const pendingTasksCount = computed(() => {
  return allTasks.value.filter(task => task.status === 'pending').length;
});

const inProgressTasksCount = computed(() => {
  return allTasks.value.filter(task => task.status === 'in-progress').length;
});

// 获取段位名称函数
const getRankName = (rankId: number): string => {
  const rank = rankList.value.find(r => r.id === rankId);
  if (!rank) return '未知段位';
  return `${rank.icon} ${rank.name}`;
};

// 段位升级函数
const promoteRank = (stars: number = 1) => {
  userRankStars.value += stars;
  
  // 如果星星满了，升级段位
  if (userRankStars.value > 5) {
    if (userRank.value < rankList.value.length - 1) {
      userRank.value++;
      userRankStars.value = userRankStars.value - 5;
      ElMessage.success(`恭喜你晋升到${rankList.value[userRank.value].name}段位！`);
    } else {
      userRankStars.value = 5; // 已经是最高段位，保持满星
    }
  }
};

// 段位降级函数
const demoteRank = (stars: number = 1) => {
  userRankStars.value -= stars;
  
  // 如果星星为负，降级段位
  if (userRankStars.value < 0) {
    if (userRank.value > 0) {
      userRank.value--;
      userRankStars.value = 5 + userRankStars.value; // 加上负数就是减
      ElMessage.warning(`你的段位已降至${rankList.value[userRank.value].name}！`);
    } else {
      userRankStars.value = 0; // 已经是最低段位，保持0星
    }
  }
};

const showTaskDetail = ref(false);
const showPublishDialog = ref(false);
const showMyTasks = ref(false);

// 新增任务视图控制变量
const taskViewMode = ref('all'); // all, published, claimed, wallet

// 显示我发布的任务
const showMyPublishedTasks = () => {
  taskViewMode.value = 'published';
  showMyTasks.value = true;
  myTaskTab.value = 'published';
};

// 显示我认领的任务
const showMyClaimedTasks = () => {
  taskViewMode.value = 'claimed';
  showMyTasks.value = true;
  myTaskTab.value = 'claimed';
};

// 显示我的钱包
const showMyWallet = () => {
  taskViewMode.value = 'wallet';
  showMyTasks.value = true;
  myTaskTab.value = 'wallet';
  
  nextTick(() => {
    console.log('钱包标签页DOM已更新');
  });
};

const currentTask = ref(null);

const newTask = ref({
  title: '',
  category: '',
  reward: 100,
  deadline: '',
  description: '',
  requirements: ''
});

const allTasks = ref([
  // SSR级任务（2000+金币）
  {
    id: 1,
    title: '开发分布式微服务架构系统',
    category: 'development',
    reward: 3000,
    deadline: '2023-12-31',
    description: '设计并实现一套完整的分布式微服务架构系统，包含服务注册、发现、配置中心、API网关、负载均衡和容错机制等核心组件。需要支持高可用、高并发和弹性扩展。',
    requirements: '至少5年以上分布式系统开发经验，精通Spring Cloud/Kubernetes等微服务框架，具备大规模分布式系统设计经验。最终交付需包含完整的架构文档、源代码和部署方案。',
    status: 'pending',
    publisher: '技术总监',
    publisherId: 101,
    claimerId: null
  },
  // SS级任务（500-1999金币）
  {
    id: 2,
    title: '全平台小程序开发框架',
    category: 'development',
    reward: 1500,
    deadline: '2023-11-30',
    description: '开发一套支持多端（微信、支付宝、抖音、百度等）小程序同步开发的框架，实现一次开发、多端部署。需要解决各平台API差异和渲染差异问题。',
    requirements: '熟悉各大小程序平台的开发特性和限制，精通JavaScript/TypeScript，有跨端开发经验。需提供完整的框架代码、文档和示例应用。',
    status: 'in-progress',
    publisher: '产品经理',
    publisherId: 102,
    claimerId: 201
  },
  {
    id: 3,
    title: '企业品牌VI系统设计',
    category: 'design',
    reward: 800,
    deadline: '2023-12-15',
    description: '为企业设计完整的视觉识别(VI)系统，包括logo、色彩系统、字体规范、办公用品、宣传物料等应用场景的设计规范。',
    requirements: '有5年以上品牌设计经验，精通Adobe设计软件，有金融或科技行业VI设计经验优先。需提供源文件和应用场景示例。',
    status: 'pending',
    publisher: '市场总监',
    publisherId: 103,
    claimerId: null
  },
  // S级任务（300-499金币）
  {
    id: 4,
    title: '企业级数据分析平台',
    category: 'development',
    reward: 450,
    deadline: '2023-12-10',
    description: '开发一个企业级数据分析平台，支持多种数据源接入、数据清洗、可视化图表展示和报表导出等功能。',
    requirements: '熟悉大数据技术栈，精通前端可视化库(如ECharts)，有BI工具开发经验。提供完整的源代码和部署文档。',
    status: 'pending',
    publisher: '数据部门',
    publisherId: 104,
    claimerId: null
  },
  {
    id: 5,
    title: '产品商业策略规划',
    category: 'marketing',
    reward: 380,
    deadline: '2023-11-25',
    description: '为新产品线制定完整的商业化策略，包括市场定位、定价策略、渠道布局和推广方案等，需要基于市场研究数据提供可执行的建议。',
    requirements: '有互联网产品商业化经验，熟悉市场分析方法，能够提供详细的策略文档和执行计划。',
    status: 'pending',
    publisher: '商业部门',
    publisherId: 105,
    claimerId: null
  },
  // A级任务（200-299金币）
  {
    id: 6,
    title: '移动应用UI界面设计',
    category: 'design',
    reward: 280,
    deadline: '2023-12-05',
    description: '设计一款金融类移动应用的界面，包括首页、用户中心、交易页面等核心页面，需符合现代设计趋势和iOS/Android设计规范。',
    requirements: '有金融或科技类App设计经验，熟悉Figma或Sketch等设计工具，提供设计稿和交互原型。',
    status: 'pending',
    publisher: '设计主管',
    publisherId: 106,
    claimerId: null
  },
  {
    id: 7,
    title: 'API文档和SDK开发',
    category: 'development',
    reward: 250,
    deadline: '2023-11-28',
    description: '为现有REST API编写详细的开发文档，并开发多语言SDK（至少包含Java、Python、JavaScript），简化API的调用流程。',
    requirements: '熟悉多种编程语言，有SDK开发经验，能编写清晰易懂的技术文档。提交内容包括文档网站和各语言SDK代码库。',
    status: 'in-progress',
    publisher: '开发主管',
    publisherId: 107,
    claimerId: 202
  },
  // B级任务（100-199金币）
  {
    id: 8,
    title: '用户调研报告编写',
    category: 'content',
    reward: 180,
    deadline: '2023-11-20',
    description: '基于已有的用户访谈和问卷数据，编写一份详细的用户需求和痛点分析报告，为产品迭代提供决策依据。',
    requirements: '有用户研究经验，善于数据分析和洞察提炼，能够提供专业、有深度的分析报告和建议。',
    status: 'pending',
    publisher: '产品经理',
    publisherId: 108,
    claimerId: null
  },
  {
    id: 9,
    title: '前端组件库单元测试',
    category: 'development',
    reward: 150,
    deadline: '2023-11-15',
    description: '为现有的Vue组件库编写完整的单元测试和集成测试，确保组件的功能正确性和兼容性。',
    requirements: '熟悉Jest、Vue Test Utils等测试框架，有前端测试经验。提交测试代码并达到至少80%的测试覆盖率。',
    status: 'completed',
    publisher: '测试主管',
    publisherId: 109,
    claimerId: 203
  },
  // C级任务（100金币以下）
  {
    id: 10,
    title: '网站内容审核',
    category: 'content',
    reward: 80,
    deadline: '2023-11-10',
    description: '审核网站新发布的内容，检查是否有违规信息、错别字或格式问题，并给出修改建议。',
    requirements: '有文字功底，细心负责，能够按时完成审核任务并提交审核报告。',
    status: 'pending',
    publisher: '内容主管',
    publisherId: 110,
    claimerId: null
  },
  {
    id: 11,
    title: '用户操作手册编写',
    category: 'content',
    reward: 60,
    deadline: '2023-11-05',
    description: '编写产品的用户操作手册，包括功能介绍、操作流程和常见问题解答等内容。',
    requirements: '熟悉产品功能，有技术写作经验，能够用通俗易懂的语言解释复杂概念。',
    status: 'in-progress',
    publisher: '产品经理',
    publisherId: 111,
    claimerId: 204
  },
  {
    id: 12,
    title: '简单图标设计',
    category: 'design',
    reward: 50,
    deadline: '2023-11-03',
    description: '设计5个简单的功能图标，用于产品界面，需要符合整体UI风格。',
    requirements: '有图标设计经验，熟悉AI或Figma等设计工具，能够按时交付源文件。',
    status: 'completed',
    publisher: '设计师',
    publisherId: 112,
    claimerId: 205
  },
  // 以下添加更多任务数据
  {
    id: 13,
    title: '区块链智能合约开发',
    category: 'development',
    reward: 2200,
    deadline: '2023-12-25',
    description: '开发基于以太坊的智能合约系统，实现去中心化金融应用的核心功能，包括代币发行、流动性挖矿和治理投票。',
    requirements: '精通Solidity语言，熟悉以太坊生态，有DeFi项目开发经验。需提供源代码、测试用例和安全审计报告。',
    status: 'pending',
    publisher: '区块链项目负责人',
    publisherId: 113,
    claimerId: null
  },
  {
    id: 14,
    title: '电商平台SEO优化',
    category: 'marketing',
    reward: 320,
    deadline: '2023-12-01',
    description: '对现有电商平台进行SEO优化，提高自然搜索流量和产品页面排名，重点关注核心关键词的优化和转化率提升。',
    requirements: '有电商SEO经验，熟悉搜索引擎算法和优化技巧，能提供详细的优化方案和执行计划。',
    status: 'pending',
    publisher: 'SEO经理',
    publisherId: 114,
    claimerId: null
  },
  {
    id: 15,
    title: '移动应用性能优化',
    category: 'development',
    reward: 650,
    deadline: '2023-12-12',
    description: '对现有iOS和Android应用进行性能优化，解决内存泄漏、卡顿和启动时间长等问题，提升用户体验。',
    requirements: '熟悉移动应用性能分析工具，有性能调优经验，能够使用Instruments/Android Profiler等工具定位和解决性能问题。',
    status: 'pending',
    publisher: '移动开发负责人',
    publisherId: 115,
    claimerId: null
  },
  {
    id: 16,
    title: '产品宣传视频制作',
    category: 'design',
    reward: 480,
    deadline: '2023-12-20',
    description: '为新产品制作30秒宣传视频，包括脚本撰写、分镜头设计、视频拍摄和后期剪辑，风格需现代简洁，突出产品核心卖点。',
    requirements: '有商业视频制作经验，熟悉After Effects和Premiere等软件，能提供完整的视频成品和源文件。',
    status: 'pending',
    publisher: '市场推广经理',
    publisherId: 116,
    claimerId: null
  },
  {
    id: 17,
    title: '用户增长策略制定',
    category: 'marketing',
    reward: 550,
    deadline: '2023-12-08',
    description: '为移动应用制定用户增长策略，包括获客渠道分析、用户留存优化和转化率提升，目标是在3个月内提高MAU 30%。',
    requirements: '有互联网产品增长经验，熟悉各类获客渠道和数据分析工具，能提供详细的策略方案和执行计划。',
    status: 'pending',
    publisher: '增长总监',
    publisherId: 117,
    claimerId: null
  },
  {
    id: 18,
    title: '机器学习模型开发',
    category: 'development',
    reward: 1800,
    deadline: '2024-01-15',
    description: '开发基于用户行为数据的推荐系统，提高内容推荐准确率和用户点击率，需要支持实时更新和千万级用户规模。',
    requirements: '熟悉机器学习算法，有推荐系统开发经验，精通Python和相关机器学习框架。需提供模型代码、评估报告和部署方案。',
    status: 'pending',
    publisher: '算法部门负责人',
    publisherId: 118,
    claimerId: null
  },
  {
    id: 19,
    title: '品牌社交媒体运营',
    category: 'marketing',
    reward: 300,
    deadline: '2023-12-15',
    description: '负责品牌在微博、小红书、抖音等社交平台的日常运营，包括内容策划、素材制作和互动维护，提高品牌曝光度和粉丝活跃度。',
    requirements: '有社交媒体运营经验，了解各平台特性和内容偏好，能提供一个月的详细运营计划和内容示例。',
    status: 'pending',
    publisher: '社交媒体主管',
    publisherId: 119,
    claimerId: null
  },
  {
    id: 20,
    title: '网站安全漏洞测试',
    category: 'development',
    reward: 750,
    deadline: '2023-12-05',
    description: '对公司网站和管理后台进行安全测试，发现潜在的安全漏洞并提供修复建议，包括XSS、SQL注入、CSRF等常见安全问题的检测。',
    requirements: '有网络安全测试经验，熟悉OWASP Top 10安全风险，能够使用专业工具进行漏洞扫描和渗透测试。需提供详细的测试报告和修复方案。',
    status: 'pending',
    publisher: '信息安全负责人',
    publisherId: 120,
    claimerId: null
  },
  {
    id: 21,
    title: '用户界面交互设计',
    category: 'design',
    reward: 420,
    deadline: '2023-12-10',
    description: '为企业管理系统设计交互原型，优化用户操作流程，提高任务完成效率，需兼顾美观和实用性。',
    requirements: '有B端产品交互设计经验，熟悉Axure/Figma等原型设计工具，能提供可交互的高保真原型和设计说明文档。',
    status: 'pending',
    publisher: '产品设计负责人',
    publisherId: 121,
    claimerId: null
  },
  {
    id: 22,
    title: '数据可视化大屏设计',
    category: 'design',
    reward: 580,
    deadline: '2023-12-18',
    description: '设计企业数据大屏，实时展示核心业务指标和数据趋势，包括销售数据、用户增长、系统监控等模块，风格需专业大气。',
    requirements: '有数据可视化设计经验，熟悉DataV/ECharts等可视化工具，能提供完整的设计稿和实现建议。',
    status: 'pending',
    publisher: '数据分析主管',
    publisherId: 122,
    claimerId: null
  },
  {
    id: 23,
    title: 'APP用户行为分析',
    category: 'marketing',
    reward: 350,
    deadline: '2023-12-08',
    description: '分析移动应用用户行为数据，挖掘用户使用习惯和流失原因，提供优化建议，目标是提高用户留存率和活跃度。',
    requirements: '有数据分析经验，熟悉用户行为分析方法和工具，能提供详细的分析报告和可执行的优化建议。',
    status: 'pending',
    publisher: '数据分析师',
    publisherId: 123,
    claimerId: null
  },
  {
    id: 24,
    title: '企业微信小程序开发',
    category: 'development',
    reward: 680,
    deadline: '2023-12-25',
    description: '开发企业内部工具小程序，实现员工签到、会议室预订、工作汇报等功能，提高内部办公效率。',
    requirements: '有微信小程序开发经验，熟悉企业微信API，能提供完整的源代码和上线支持。',
    status: 'pending',
    publisher: '内部系统负责人',
    publisherId: 124,
    claimerId: null
  },
  {
    id: 25,
    title: '技术博客内容创作',
    category: 'content',
    reward: 120,
    deadline: '2023-12-01',
    description: '为技术团队博客创作5篇原创技术文章，主题包括最新技术趋势、开发实践分享和技术解决方案，要求深入浅出，有实战参考价值。',
    requirements: '有技术写作经验，对前端/后端/DevOps等领域有专业理解，能提供高质量的原创技术文章。',
    status: 'pending',
    publisher: '技术社区运营',
    publisherId: 125,
    claimerId: null
  },
  {
    id: 26,
    title: '产品众测与反馈收集',
    category: 'marketing',
    reward: 200,
    deadline: '2023-12-05',
    description: '组织产品内测活动，招募50名目标用户进行产品体验，收集使用反馈和改进建议，形成完整的众测报告。',
    requirements: '有产品测试或用户研究经验，善于用户沟通和数据整理，能提供专业的众测方案和详细的反馈报告。',
    status: 'pending',
    publisher: '产品经理',
    publisherId: 126,
    claimerId: null
  },
  {
    id: 27,
    title: '自动化测试框架搭建',
    category: 'development',
    reward: 520,
    deadline: '2023-12-15',
    description: '为Web应用搭建自动化测试框架，实现UI测试、接口测试和性能测试的自动化执行和报告生成，提高测试效率和覆盖率。',
    requirements: '有自动化测试经验，熟悉Selenium/Puppeteer等测试工具，能提供完整的测试框架代码和使用文档。',
    status: 'pending',
    publisher: '测试负责人',
    publisherId: 127,
    claimerId: null
  },
  {
    id: 28,
    title: '企业品牌故事策划',
    category: 'content',
    reward: 280,
    deadline: '2023-12-10',
    description: '策划企业品牌故事系列内容，包括创始历程、企业文化和社会责任等主题，用于官网展示和宣传材料，塑造品牌形象。',
    requirements: '有品牌内容策划经验，善于故事化表达，能提供完整的内容策划方案和示例文案。',
    status: 'pending',
    publisher: '品牌总监',
    publisherId: 128,
    claimerId: null
  },
  {
    id: 29,
    title: '商业计划书撰写',
    category: 'content',
    reward: 480,
    deadline: '2023-12-20',
    description: '为创新项目撰写商业计划书，包括市场分析、商业模式、竞争策略和财务预测等内容，用于项目路演和投资人沟通。',
    requirements: '有商业计划书撰写经验，熟悉创业融资流程，能提供专业、完整的商业计划书。',
    status: 'pending',
    publisher: '创新项目负责人',
    publisherId: 129,
    claimerId: null
  },
  {
    id: 30,
    title: '跨境电商营销方案',
    category: 'marketing',
    reward: 380,
    deadline: '2023-12-15',
    description: '为跨境电商品牌制定营销推广方案，覆盖SEO、社交媒体、KOL合作等渠道，目标是提高品牌在海外市场的知名度和销量。',
    requirements: '有跨境电商营销经验，了解海外市场特点和营销渠道，能提供详细的营销策略和执行计划。',
    status: 'pending',
    publisher: '跨境业务负责人',
    publisherId: 130,
    claimerId: null
  },
  {
    id: 31,
    title: 'ChatGPT应用开发',
    category: 'development',
    reward: 850,
    deadline: '2023-12-22',
    description: '基于OpenAI API开发企业级聊天机器人应用，实现智能客服、内容生成和知识问答等功能，提升用户体验和服务效率。',
    requirements: '熟悉OpenAI API和LLM应用开发，有NLP项目经验，能提供完整的源代码和部署文档。',
    status: 'pending',
    publisher: 'AI产品经理',
    publisherId: 131,
    claimerId: null
  },
  {
    id: 32,
    title: '低代码平台插件开发',
    category: 'development',
    reward: 400,
    deadline: '2023-12-12',
    description: '为低代码开发平台开发自定义组件和插件，扩展平台功能，实现特定业务场景的快速开发需求。',
    requirements: '熟悉主流低代码平台架构，有插件开发经验，能提供符合平台规范的组件代码和文档。',
    status: 'pending',
    publisher: '平台研发负责人',
    publisherId: 132,
    claimerId: null
  },
  {
    id: 33,
    title: '网站性能优化',
    category: 'development',
    reward: 360,
    deadline: '2023-12-15',
    description: '对公司官网进行全面性能优化，提高页面加载速度和用户体验，重点优化首屏加载时间和交互响应速度。',
    requirements: '熟悉前端性能优化技术，掌握webpack打包优化、图片压缩、懒加载等技术，能够使用Lighthouse等工具进行性能分析。',
    status: 'pending',
    publisher: '前端负责人',
    publisherId: 133,
    claimerId: null
  },
  {
    id: 34,
    title: '移动应用UI改版',
    category: 'design',
    reward: 450,
    deadline: '2023-12-20',
    description: '为现有移动应用进行UI改版设计，更新视觉风格，提升用户体验，需遵循Material Design 3或iOS设计规范。',
    requirements: '有移动应用UI设计经验，熟悉最新设计趋势和交互模式，能提供完整的UI组件库和设计规范文档。',
    status: 'pending',
    publisher: 'UI设计主管',
    publisherId: 134,
    claimerId: null
  },
  {
    id: 35,
    title: '内容营销策略规划',
    category: 'marketing',
    reward: 280,
    deadline: '2023-12-10',
    description: '为企业产品制定内容营销策略，包括内容主题规划、渠道选择、发布计划和效果评估，提升品牌影响力和用户转化。',
    requirements: '有内容营销经验，了解内容分发渠道特性，能提供详细的内容策略文档和执行计划。',
    status: 'pending',
    publisher: '内容营销经理',
    publisherId: 135,
    claimerId: null
  },
  {
    id: 36,
    title: '数据库性能调优',
    category: 'development',
    reward: 620,
    deadline: '2023-12-18',
    description: '对企业核心数据库进行性能调优，解决慢查询问题，优化索引结构，提高数据库读写性能，支持业务高峰期稳定运行。',
    requirements: '有大型数据库调优经验，熟悉MySQL/PostgreSQL等数据库架构，能够使用专业工具进行性能分析和问题诊断。',
    status: 'pending',
    publisher: '数据库架构师',
    publisherId: 136,
    claimerId: null
  },
  {
    id: 37,
    title: '产品用户手册编写',
    category: 'content',
    reward: 150,
    deadline: '2023-12-05',
    description: '为新推出的企业软件编写用户手册，包括安装指南、功能介绍、操作流程和常见问题解答，确保用户能够快速上手使用。',
    requirements: '有技术文档写作经验，熟悉软件产品特性，能够用通俗易懂的语言解释复杂概念，提供排版精美的文档成品。',
    status: 'pending',
    publisher: '产品运营',
    publisherId: 137,
    claimerId: null
  },
  {
    id: 38,
    title: '电商平台数据分析',
    category: 'marketing',
    reward: 350,
    deadline: '2023-12-08',
    description: '分析电商平台的销售数据和用户行为，挖掘用户购买模式和转化漏斗，提供改进建议，目标是提高转化率和客单价。',
    requirements: '有电商数据分析经验，熟悉数据分析工具和方法，能提供专业的数据分析报告和可执行的优化建议。',
    status: 'pending',
    publisher: '数据分析师',
    publisherId: 138,
    claimerId: null
  },
  {
    id: 39,
    title: '行业研究报告撰写',
    category: 'content',
    reward: 420,
    deadline: '2023-12-22',
    description: '研究特定行业市场趋势、竞争格局和发展前景，撰写专业的行业研究报告，为公司战略决策提供依据。',
    requirements: '有行业研究经验，熟悉市场分析方法，具备数据收集和解读能力，能提供深度的行业洞察和分析报告。',
    status: 'pending',
    publisher: '战略部门',
    publisherId: 139,
    claimerId: null
  },
  {
    id: 40,
    title: '小程序开发',
    category: 'development',
    reward: 580,
    deadline: '2023-12-25',
    description: '开发微信小程序，实现产品展示、在线咨询、用户注册和订单管理等核心功能，提供流畅的用户体验。',
    requirements: '有微信小程序开发经验，熟悉小程序框架和API，能够提供设计合理、代码规范的小程序源码和上线支持。',
    status: 'pending',
    publisher: '产品经理',
    publisherId: 140,
    claimerId: null
  },
  {
    id: 41,
    title: 'Logo设计',
    category: 'design',
    reward: 300,
    deadline: '2023-12-10',
    description: '为创业公司设计现代简约风格的Logo，要求独特、易识别，能够反映公司科技创新的特点，需提供多种配色方案。',
    requirements: '有品牌Logo设计经验，熟悉设计软件，能提供矢量格式的Logo文件和应用示例。',
    status: 'pending',
    publisher: '创始人',
    publisherId: 141,
    claimerId: null
  },
  {
    id: 42,
    title: '营销文案创作',
    category: 'content',
    reward: 180,
    deadline: '2023-12-05',
    description: '为新产品撰写系列营销文案，包括产品介绍、卖点提炼、场景应用等内容，用于官网、社交媒体和广告投放。',
    requirements: '有营销文案创作经验，了解消费者心理，能够撰写有吸引力、高转化率的文案内容。',
    status: 'pending',
    publisher: '市场主管',
    publisherId: 142,
    claimerId: null
  },
  {
    id: 43,
    title: '产品众筹页面设计',
    category: 'design',
    reward: 350,
    deadline: '2023-12-15',
    description: '设计产品众筹页面，包括视觉呈现、产品特点展示和支持方案设计，目标是提高用户参与度和转化率。',
    requirements: '有众筹页面设计经验，了解众筹平台特性，能提供高转化率的设计方案和页面原型。',
    status: 'pending',
    publisher: '众筹项目负责人',
    publisherId: 143,
    claimerId: null
  },
  {
    id: 44,
    title: '用户研究访谈',
    category: 'marketing',
    reward: 250,
    deadline: '2023-12-12',
    description: '招募并访谈20名目标用户，了解其使用习惯、需求和痛点，形成用户研究报告，为产品迭代提供依据。',
    requirements: '有用户研究经验，善于沟通和问题设计，能够提供专业、客观的用户研究报告。',
    status: 'pending',
    publisher: '用户体验负责人',
    publisherId: 144,
    claimerId: null
  },
  {
    id: 45,
    title: '短视频剪辑',
    category: 'design',
    reward: 200,
    deadline: '2023-12-08',
    description: '剪辑10个15-30秒的产品短视频，用于抖音、快手等平台推广，要求节奏紧凑、风格时尚、突出产品特点。',
    requirements: '有短视频剪辑经验，熟悉剪辑软件和短视频平台特性，能提供高质量的视频成品。',
    status: 'pending',
    publisher: '新媒体运营',
    publisherId: 145,
    claimerId: null
  },
  {
    id: 46,
    title: 'Flutter跨平台应用开发',
    category: 'development',
    reward: 780,
    deadline: '2023-12-28',
    description: '使用Flutter框架开发iOS和Android跨平台应用，实现核心功能并确保在不同设备上的一致性体验。',
    requirements: '有Flutter开发经验，熟悉Dart语言和Flutter组件，能提供高质量的跨平台应用代码。',
    status: 'pending',
    publisher: '移动开发主管',
    publisherId: 146,
    claimerId: null
  },
  {
    id: 47,
    title: '网站访问分析报告',
    category: 'marketing',
    reward: 220,
    deadline: '2023-12-10',
    description: '分析企业网站的访问数据，包括流量来源、用户行为、转化路径等，提供优化建议，提高网站转化效果。',
    requirements: '熟悉Google Analytics等网站分析工具，有数据分析经验，能提供专业的分析报告和优化方案。',
    status: 'pending',
    publisher: '数字营销经理',
    publisherId: 147,
    claimerId: null
  },
  {
    id: 48,
    title: '用户调研问卷设计',
    category: 'marketing',
    reward: 150,
    deadline: '2023-12-05',
    description: '设计用户调研问卷，了解目标用户对产品的使用体验、需求偏好和改进建议，为产品优化提供数据支持。',
    requirements: '有问卷设计经验，了解调研方法，能设计出有效的问题并提供结果分析报告。',
    status: 'pending',
    publisher: '产品经理',
    publisherId: 148,
    claimerId: null
  },
  {
    id: 49,
    title: '字体设计',
    category: 'design',
    reward: 400,
    deadline: '2023-12-20',
    description: '为品牌设计专属字体，包括中文和英文字符，风格需与品牌调性一致，用于品牌视觉识别和营销材料。',
    requirements: '有字体设计经验，精通字体设计软件，能提供完整的字体文件和应用示例。',
    status: 'pending',
    publisher: '品牌总监',
    publisherId: 149,
    claimerId: null
  },
  {
    id: 50,
    title: '技术架构评审',
    category: 'development',
    reward: 850,
    deadline: '2023-12-15',
    description: '评审现有技术架构，发现潜在问题和改进空间，提供架构优化建议，确保系统的可扩展性、稳定性和性能。',
    requirements: '有丰富的架构设计经验，熟悉微服务、云原生等技术，能提供专业的架构评审报告和优化方案。',
    status: 'pending',
    publisher: '技术总监',
    publisherId: 150,
    claimerId: null
  },
  {
    id: 51,
    title: '广告投放策略制定',
    category: 'marketing',
    reward: 380,
    deadline: '2023-12-12',
    description: '制定全渠道广告投放策略，包括渠道选择、预算分配、创意方向和效果评估，目标是提高品牌知名度和用户获取效率。',
    requirements: '有数字广告投放经验，熟悉各广告平台特性和效果评估方法，能提供详细的投放策略和预期效果分析。',
    status: 'pending',
    publisher: '广告投放经理',
    publisherId: 151,
    claimerId: null
  },
  {
    id: 52,
    title: '产品定价策略研究',
    category: 'marketing',
    reward: 300,
    deadline: '2023-12-10',
    description: '研究竞品定价策略和市场接受度，提供产品定价建议，包括价格档位、促销策略和会员价值体系设计。',
    requirements: '有产品定价经验，熟悉市场调研方法，能提供数据支持的定价策略和销售预测。',
    status: 'pending',
    publisher: '产品策略总监',
    publisherId: 152,
    claimerId: null
  },
  {
    id: 53,
    title: '网站安全加固',
    category: 'development',
    reward: 680,
    deadline: '2023-12-18',
    description: '对公司网站进行安全加固，修复安全漏洞，实施身份认证、权限控制和数据加密等措施，提升网站安全性。',
    requirements: '有网络安全经验，熟悉常见的网站安全漏洞和防护措施，能提供安全加固方案和实施建议。',
    status: 'pending',
    publisher: '信息安全官',
    publisherId: 153,
    claimerId: null
  },
  {
    id: 54,
    title: '用户界面原型设计',
    category: 'design',
    reward: 320,
    deadline: '2023-12-15',
    description: '设计Web应用的用户界面原型，包括核心页面和交互流程，为开发团队提供明确的设计参考。',
    requirements: '有UI原型设计经验，熟悉Figma或Sketch等工具，能提供高保真的界面原型和交互说明。',
    status: 'pending',
    publisher: '产品设计师',
    publisherId: 154,
    claimerId: null
  },
  {
    id: 55,
    title: '竞品分析报告',
    category: 'marketing',
    reward: 250,
    deadline: '2023-12-08',
    description: '分析主要竞争对手的产品特点、市场策略和用户评价，找出竞争优势和不足，为产品策略调整提供参考。',
    requirements: '有竞品分析经验，了解行业动态，能提供深入的竞品分析报告和差异化策略建议。',
    status: 'pending',
    publisher: '产品经理',
    publisherId: 155,
    claimerId: null
  },
  {
    id: 56,
    title: '数据可视化开发',
    category: 'development',
    reward: 480,
    deadline: '2023-12-20',
    description: '开发数据可视化模块，将复杂的业务数据转化为直观的图表和仪表盘，支持管理者快速了解业务状况和做出决策。',
    requirements: '有数据可视化开发经验，熟悉ECharts/D3.js等库，能提供美观、交互友好的数据可视化界面。',
    status: 'pending',
    publisher: '业务分析师',
    publisherId: 156,
    claimerId: null
  },
  {
    id: 57,
    title: '产品演示视频制作',
    category: 'design',
    reward: 350,
    deadline: '2023-12-15',
    description: '制作3-5分钟的产品演示视频，展示产品核心功能和使用场景，用于官网展示和销售支持。',
    requirements: '有产品演示视频制作经验，熟悉视频制作流程，能提供专业水准的成片和源文件。',
    status: 'pending',
    publisher: '市场总监',
    publisherId: 157,
    claimerId: null
  },
  {
    id: 58,
    title: 'DevOps流程优化',
    category: 'development',
    reward: 720,
    deadline: '2023-12-22',
    description: '优化现有DevOps流程，实现更高效的持续集成和持续部署，提高团队开发效率和产品交付质量。',
    requirements: '有DevOps实践经验，熟悉CI/CD工具链，能提供流程优化方案和自动化脚本。',
    status: 'pending',
    publisher: 'DevOps工程师',
    publisherId: 158,
    claimerId: null
  },
  {
    id: 59,
    title: '用户访谈与调研',
    category: 'marketing',
    reward: 280,
    deadline: '2023-12-10',
    description: '招募并访谈10名目标用户，了解其需求痛点和使用体验，为产品迭代提供用户洞察。',
    requirements: '有用户访谈经验，善于沟通和洞察提炼，能提供专业的调研报告和用户反馈分析。',
    status: 'pending',
    publisher: '用户研究专员',
    publisherId: 159,
    claimerId: null
  },
  {
    id: 60,
    title: '移动应用测试',
    category: 'development',
    reward: 230,
    deadline: '2023-12-08',
    description: '对新版移动应用进行全面测试，包括功能测试、兼容性测试和性能测试，确保应用质量和用户体验。',
    requirements: '有移动应用测试经验，熟悉测试方法和工具，能提供详细的测试报告和改进建议。',
    status: 'pending',
    publisher: '测试经理',
    publisherId: 160,
    claimerId: null
  },
  {
    id: 61,
    title: '用户运营方案设计',
    category: 'marketing',
    reward: 320,
    deadline: '2023-12-15',
    description: '设计用户运营方案，包括用户分层策略、活跃度提升和留存优化等内容，提高用户活跃度和忠诚度。',
    requirements: '有用户运营经验，了解用户生命周期管理，能提供详细的运营方案和执行计划。',
    status: 'pending',
    publisher: '用户运营总监',
    publisherId: 161,
    claimerId: null
  },
  {
    id: 62,
    title: '开发文档编写',
    category: 'content',
    reward: 180,
    deadline: '2023-12-12',
    description: '编写API开发文档，包括接口说明、参数定义、请求示例和错误码解释，方便开发者快速接入和使用。',
    requirements: '有技术文档写作经验，熟悉API文档规范，能提供清晰、准确的开发文档。',
    status: 'pending',
    publisher: '技术文档经理',
    publisherId: 162,
    claimerId: null
  },
  {
    id: 63,
    title: '企业网站设计',
    category: 'design',
    reward: 650,
    deadline: '2023-12-25',
    description: '设计企业官方网站，包括首页、产品介绍、关于我们等核心页面，风格需专业大气，突出企业特色。',
    requirements: '有企业网站设计经验，熟悉现代网页设计趋势，能提供响应式设计方案和高保真设计稿。',
    status: 'pending',
    publisher: '品牌经理',
    publisherId: 163,
    claimerId: null
  },
  {
    id: 64,
    title: '产品上线方案制定',
    category: 'marketing',
    reward: 380,
    deadline: '2023-12-18',
    description: '制定产品上线推广方案，包括渠道策略、推广节奏和效果评估，确保产品成功上线并获得良好市场反响。',
    requirements: '有产品上线经验，熟悉市场推广策略，能提供详细的上线方案和活动策划。',
    status: 'pending',
    publisher: '产品营销经理',
    publisherId: 164,
    claimerId: null
  }
]);

const currentUserId = 201;

const filteredTasks = computed(() => {
  return allTasks.value.filter(task => {
    const matchKeyword = !searchKeyword.value || 
      task.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      task.description.toLowerCase().includes(searchKeyword.value.toLowerCase());
    
    const matchCategory = !categoryFilter.value || task.category === categoryFilter.value;
    const matchStatus = !statusFilter.value || task.status === statusFilter.value;
    
    return matchKeyword && matchCategory && matchStatus;
  });
});

const myPublishedTasks = computed(() => {
  return allTasks.value.filter(task => task.publisherId === currentUserId);
});

const myClaimedTasks = computed(() => {
  return allTasks.value.filter(task => task.claimerId === currentUserId);
});

const isMyPublishedTask = computed(() => {
  return currentTask.value && currentTask.value.publisherId === currentUserId;
});

const isMyClaimedTask = computed(() => {
  return currentTask.value && currentTask.value.claimerId === currentUserId;
});

const transactions = ref([
  { date: '2023-11-01', type: '签到奖励', amount: '+10', description: '每日签到' },
  { date: '2023-11-01', type: '任务发布', amount: '-300', description: '发布任务：优化网站性能' },
  { date: '2023-10-31', type: '任务奖励', amount: '+400', description: '完成任务：编写API文档' },
  { date: '2023-10-30', type: '月卡奖励', amount: '+300', description: '月卡福利' }
]);

watch(myTaskTab, (newVal) => {
  if (newVal === 'wallet') {
    console.log('钱包标签页被激活');
    nextTick(() => {
      console.log('钱包标签页DOM已更新');
    });
  }
});

const handleSearch = () => {
  console.log('执行搜索', searchKeyword.value, categoryFilter.value, statusFilter.value);
  currentPage.value = 1; // 搜索时重置为第一页
};

const viewTaskDetail = (task) => {
  currentTask.value = task;
  showTaskDetail.value = true;
};

const claimTask = () => {
  if (!currentTask.value) return;
  
  ElMessageBox.confirm('确定要认领该任务吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const task = allTasks.value.find(t => t.id === currentTask.value.id);
    if (task) {
      task.status = 'in-progress';
      task.claimerId = currentUserId;
      currentTask.value = {...task};
      
      ElMessage.success('认领成功！');
    }
  }).catch(() => {
    // 用户取消操作
  });
};

const submitTaskCompletion = () => {
  ElMessageBox.prompt('请输入完成情况描述', '提交任务完成', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
  }).then(({ value }) => {
    // 这里仅是演示，实际应调用API
    ElMessage.success('已提交完成申请，等待发布者确认');
    
    // 通过80%的概率模拟任务完成成功，获得星星
    if (Math.random() > 0.2) {
      const task = currentTask.value;
      const stars = getStarsForTask(task);
      promoteRank(stars);
      ElMessage.success(`任务评价优秀，获得${stars}颗星星！`);
    }
  }).catch(() => {
    // 用户取消操作
  });
};

// 根据任务等级获取星星数量
const getStarsForTask = (task) => {
  const reward = task.reward;
  if (reward >= 2000) return 3; // SSR级任务
  if (reward >= 500) return 2;  // SS级任务
  if (reward >= 300) return 2;  // S级任务
  if (reward >= 200) return 1;  // A级任务
  if (reward >= 100) return 1;  // B级任务
  return 1;                     // C级任务
};

const confirmTaskCompletion = () => {
  ElMessageBox.confirm('确认该任务已完成？将支付悬赏金给认领者', '确认完成', {
    confirmButtonText: '确认完成',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const task = allTasks.value.find(t => t.id === currentTask.value.id);
    if (task) {
      task.status = 'completed';
      currentTask.value = {...task};
      
      // 在实际应用中，这里应进行金额转账操作
      
      ElMessage.success('已确认任务完成，悬赏金已支付');
    }
  }).catch(() => {
    // 用户取消操作
  });
};

const publishTask = () => {
  if (!newTask.value.title || 
      !newTask.value.category || 
      !newTask.value.reward || 
      !newTask.value.description || 
      !newTask.value.requirements) {
    return ElMessage.warning('请填写完整信息');
  }
  
  if (newTask.value.reward > userBalance.value) {
    return ElMessage.warning('余额不足');
  }
  
  const taskId = allTasks.value.length > 0 ? Math.max(...allTasks.value.map(t => t.id)) + 1 : 1;
  
  allTasks.value.push({
    id: taskId,
    title: newTask.value.title,
    category: newTask.value.category,
    reward: newTask.value.reward,
    deadline: newTask.value.deadline ? new Date(newTask.value.deadline).toISOString().split('T')[0] : '',
    description: newTask.value.description,
    requirements: newTask.value.requirements,
    status: 'pending',
    publisher: '当前用户',
    publisherId: currentUserId,
    claimerId: null
  });
  
  userBalance.value -= newTask.value.reward;
  
  transactions.value.unshift({
    date: new Date().toISOString().split('T')[0],
    type: '任务发布',
    amount: `-${newTask.value.reward}`,
    description: `发布任务：${newTask.value.title}`
  });
  
  showPublishDialog.value = false;
  newTask.value = {
    title: '',
    category: '',
    reward: 100,
    deadline: '',
    description: '',
    requirements: ''
  };
  
  ElMessage.success('任务发布成功');
};

const claimDaily = () => {
  if (hasDailyClaimed.value) return;
  
  userBalance.value += 10;
  
  transactions.value.unshift({
    date: new Date().toISOString().split('T')[0],
    type: '签到奖励',
    amount: '+10',
    description: '每日签到'
  });
  
  hasDailyClaimed.value = true;
  ElMessage.success('成功领取每日签到奖励：10金币');
};

const claimMonthlySignIn = () => {
  if (hasMonthlySignInClaimed.value) return;
  
  userBalance.value += 50;
  
  transactions.value.unshift({
    date: new Date().toISOString().split('T')[0],
    type: '签到奖励',
    amount: '+50',
    description: '每月签到'
  });
  
  hasMonthlySignInClaimed.value = true;
  ElMessage.success('成功领取每月签到奖励：50金币');
};

const claimMonthly = () => {
  if (!hasMonthlyCard.value || hasMonthlyCardClaimed.value) return;
  
  userBalance.value += 300;
  
  transactions.value.unshift({
    date: new Date().toISOString().split('T')[0],
    type: '月卡奖励',
    amount: '+300',
    description: '月卡福利'
  });
  
  hasMonthlyCardClaimed.value = true;
  ElMessage.success('成功领取月卡奖励：300金币');
};

const activateMonthlyCard = () => {
  ElMessageBox.confirm('确定要开通月卡吗？', '开通月卡', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    hasMonthlyCard.value = true;
    ElMessage.success('月卡开通成功，可以领取每月福利了');
  }).catch(() => {
    // 用户取消操作
  });
};

const getCategoryName = (category: string): string => {
  const categories = {
    'development': '技术开发',
    'content': '内容创作',
    'design': '设计',
    'marketing': '市场',
    'other': '其他'
  };
  return categories[category] || '未知分类';
};

const getStatusName = (status: string): string => {
  const statuses = {
    'pending': '待认领',
    'in-progress': '进行中',
    'completed': '已完成'
  };
  return statuses[status] || '未知状态';
};

// 添加分页相关计算属性
const paginatedTasks = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filteredTasks.value.slice(startIndex, endIndex);
});

const paginatedPublishedTasks = computed(() => {
  const startIndex = (publishedPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return myPublishedTasks.value.slice(startIndex, endIndex);
});

const paginatedClaimedTasks = computed(() => {
  const startIndex = (claimedPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return myClaimedTasks.value.slice(startIndex, endIndex);
});

// 添加页面变化处理函数
const handlePageChange = (page) => {
  currentPage.value = page;
  scrollToTaskList();
};

const handlePublishedPageChange = (page) => {
  publishedPage.value = page;
  scrollToTaskList();
};

const handleClaimedPageChange = (page) => {
  claimedPage.value = page;
  scrollToTaskList();
};

// 抽取滚动函数
const scrollToTaskList = () => {
  const taskListElement = document.querySelector('.task-list');
  if (taskListElement) {
    taskListElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// 当打开"我的任务"对话框时，重置页码
watch(showMyTasks, (newVal) => {
  if (newVal) {
    publishedPage.value = 1;
    claimedPage.value = 1;
  }
});

onMounted(() => {
  // 这里可以添加API调用，获取任务列表、用户余额等信息
  console.log('悬赏金系统加载完成');
  
  // 将页面滚动到顶部
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
</script>

<style lang="less" scoped>
.bounty-container {
  padding: 20px;
  background-image: linear-gradient(to bottom, #f5e8c0, #f8f4e5);
  min-height: 90vh;
  position: relative;
  
  .back-home-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    display: flex;
    align-items: center;
    gap: 5px;
    color: #a17c0c;
    font-weight: bold;
    z-index: 10;
    padding: 10px 15px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(212, 175, 55, 0.3);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    
    &:hover {
      background: rgba(212, 175, 55, 0.2);
      transform: translateX(-2px);
    }
    
    .el-icon {
      font-size: 16px;
    }
  }
  
  .bounty-title {
    margin-bottom: 24px;
    text-align: center;
    color: #a17c0c;
    font-size: 32px;
    text-shadow: 1px 1px 2px rgba(161, 124, 12, 0.2);
    font-weight: bold;
  }
  
  .bounty-content {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(161, 124, 12, 0.15);
    padding: 20px;
    border: 1px solid rgba(212, 175, 55, 0.3);
  }
  
  .section-title {
    margin: 20px 0 16px;
    color: #a17c0c;
    font-size: 20px;
    border-left: 4px solid #d4af37;
    padding-left: 10px;
  }
  
  .filter-bar {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    background: #faf6e9;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid rgba(212, 175, 55, 0.2);
  }
  
  .user-info-section {
    margin-bottom: 25px;
  }
  
  .task-list {
    margin-bottom: 20px;
    
    .task-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .pagination-container {
      display: flex;
      justify-content: center;
      margin-top: 24px;
      padding: 10px 0;
      
      :deep(.el-pagination) {
        .el-pagination__jump {
          color: #8b6914;
        }
        
        .el-pager li {
          background-color: #faf6e9;
          color: #8b6914;
          border: 1px solid rgba(212, 175, 55, 0.2);
          
          &.is-active {
            background-color: #d4af37;
            color: white;
          }
          
          &:hover {
            color: #d4af37;
          }
        }
        
        .btn-prev, .btn-next {
          background-color: #faf6e9;
          color: #8b6914;
          border: 1px solid rgba(212, 175, 55, 0.2);
          
          &:hover {
            color: #d4af37;
          }
          
          &:disabled {
            color: #c0c4cc;
          }
        }
      }
    }
  }
  
  .bounty-entrance-card {
    background: linear-gradient(135deg, #d4af37, #f5e8c0);
    color: #8b6914;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 16px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    box-shadow: 0 4px 16px rgba(161, 124, 12, 0.25);
    border: 1px solid rgba(212, 175, 55, 0.5);
    position: relative;
    overflow: hidden;
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(161, 124, 12, 0.1)" stroke-width="2"/></svg>');
      background-size: 100px 100px;
      opacity: 0.5;
      pointer-events: none;
    }
    
    .bounty-card-illustration {
      flex: 0 0 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      
      .pirate-king {
        position: relative;
        z-index: 2;
        
        .pirate-image {
          width: 120px;
          height: 120px;
          filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3));
          animation: float 3s ease-in-out infinite;
          margin-bottom: -20px;
        }
      }
      
      .gold-coins {
        position: relative;
        z-index: 1;
        
        .treasure-image {
          width: 90px;
          height: 90px;
          filter: drop-shadow(1px 2px 4px rgba(0, 0, 0, 0.2));
          animation: shine 5s ease-in-out infinite;
        }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes shine {
        0%, 100% { filter: drop-shadow(1px 2px 4px rgba(0, 0, 0, 0.2)); }
        50% { filter: drop-shadow(2px 4px 8px rgba(212, 175, 55, 0.5)); }
      }
    }
    
    .bounty-card-info {
      flex: 1;
      min-width: 300px;
      
      .bounty-card-row {
        display: flex;
        gap: 24px;
        margin-bottom: 20px;
      }
      
      .info-block {
        flex: 1;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 2px 6px rgba(161, 124, 12, 0.1);
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        
        h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
          color: #8b6914;
          font-weight: bold;
          display: flex;
          align-items: center;
          
          &:after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgba(139, 105, 20, 0.2);
            margin-left: 10px;
          }
        }
        
        .big-value {
          font-size: 28px;
          font-weight: bold;
          color: #8b6914;
          letter-spacing: 0.5px;
        }
        
        .rank-stars {
          display: flex;
          align-items: center;
          margin-top: 6px;
          
          .rank-star {
            margin-right: 6px;
            font-size: 18px;
            color: rgba(139, 105, 20, 0.3);
            
            &.active {
              color: #d4af37;
              text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
            }
          }
          
          .rank-help-icon {
            margin-left: 8px;
            font-size: 14px;
            color: #8b6914;
            cursor: pointer;
            opacity: 0.7;
            
            &:hover {
              opacity: 1;
            }
          }
        }
      }
    }
  }
  
  .action-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin-bottom: 10px;
    
    :deep(.el-button) {
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: bold;
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .el-icon {
        margin-right: 6px;
        font-size: 18px;
      }
    }
  }
  
  .rank-tooltip-content {
    max-width: 300px;
    padding: 5px;
    
    h3 {
      margin-top: 0;
      margin-bottom: 10px;
      color: #8b6914;
      font-size: 16px;
      text-align: center;
    }
    
    p {
      margin-bottom: 12px;
      color: #8b6914;
    }
    
    .rank-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 12px;
      
      .rank-item {
        display: flex;
        align-items: center;
        
        .rank-icon {
          margin-right: 6px;
        }
      }
    }
    
    .rank-promotion {
      background-color: #faf6e9;
      padding: 10px;
      border-radius: 4px;
      
      h4 {
        margin-top: 0;
        margin-bottom: 8px;
        color: #8b6914;
        font-size: 14px;
      }
      
      p {
        margin: 4px 0;
        font-size: 12px;
      }
    }
  }
  
  .benefits {
    margin-bottom: 24px;
    
    h3 {
      margin-bottom: 16px;
      color: #a17c0c;
    }
    
    .benefit-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }
    
    .benefit-card {
      background-color: #faf6e9;
      border-radius: 8px;
      padding: 16px;
      border: 1px solid rgba(212, 175, 55, 0.3);
      box-shadow: 0 2px 8px rgba(161, 124, 12, 0.1);
      
      h4 {
        margin: 0 0 8px 0;
        color: #a17c0c;
      }
      
      p {
        margin: 0 0 16px 0;
        color: #8b6914;
      }
      
      .activate-card {
        margin-top: 12px;
      }
    }
  }
  
  .transaction-history {
    h3 {
      margin-bottom: 16px;
      color: #a17c0c;
    }
    
    .table-wrapper {
      height: 300px;
      overflow: hidden;
    }
  }
  
  .task-detail {
    h2 {
      margin-bottom: 16px;
      color: #a17c0c;
    }
    
    .task-info {
      margin-bottom: 24px;
      
      p {
        margin: 8px 0;
        
        span {
          font-weight: bold;
          color: #8b6914;
        }
      }
    }
    
    .task-description, .task-requirements {
      margin-bottom: 24px;
      
      h3 {
        margin-bottom: 12px;
        font-size: 16px;
        color: #a17c0c;
      }
    }
    
    .task-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  }
}

/* 修改Element Plus样式，适应金色主题 */
:deep(.el-button--warning) {
  --el-button-bg-color: #d4af37;
  --el-button-border-color: #d4af37;
  --el-button-hover-bg-color: #b8960c;
  --el-button-hover-border-color: #b8960c;
  --el-button-active-bg-color: #a17c0c;
  --el-button-active-border-color: #a17c0c;
}

:deep(.el-tabs__item.is-active) {
  color: #d4af37;
}

:deep(.el-tabs__active-bar) {
  background-color: #d4af37;
}

:deep(.el-tabs__item:hover) {
  color: #b8960c;
}

:deep(.el-select-dropdown__item.selected) {
  color: #d4af37;
}

/* 响应式布局样式，确保在小屏幕上正确显示 */
@media (max-width: 768px) {
  .bounty-container {
    .filter-bar {
      flex-direction: column;
      gap: 10px;
    }
    
    .task-list {
      grid-template-columns: 1fr;
    }
    
    .bounty-entrance-card {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      
      .bounty-card-illustration {
        width: 100%;
        margin-bottom: 16px;
        flex: initial;
      }
      
      .bounty-card-info {
        width: 100%;
        
        .bounty-card-row {
          flex-direction: column;
          gap: 10px;
        }
      }
    }
    
    .action-buttons {
      flex-direction: column;
      
      .el-button {
        width: 100%;
      }
    }
    
    .benefit-cards {
      grid-template-columns: 1fr;
    }
  }
}
</style> 