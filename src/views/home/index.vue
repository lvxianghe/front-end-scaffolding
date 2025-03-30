<template>
  <div class="home-container">
    <div class="grid-layout">
      <!-- 大红书模块 -->
      <div class="grid-item redbook" @click="handleModuleClick('redbook')">
        <div class="content">
          <el-icon><Promotion /></el-icon>
          <span>大红书</span>
          <div class="description">分享生活，发现美</div>
        </div>
      </div>

      <!-- ChatGPT模块 -->
      <div class="grid-item chatgpt" @click="handleModuleClick('chatgpt')">
        <div class="content">
          <el-icon><ChatDotRound /></el-icon>
          <span>ChatGPT</span>
        </div>
      </div>

      <!-- 微信模块 -->
      <div class="grid-item wechat" @click="handleModuleClick('wechat')">
        <div class="content">
          <el-icon><Message /></el-icon>
          <span>微信</span>
        </div>
      </div>

      <!-- 抖音模块 -->
      <div class="grid-item douyin" @click="handleModuleClick('douyin')">
        <div class="content">
          <el-icon><VideoPlay /></el-icon>
          <span>抖音</span>
        </div>
      </div>

      <!-- 管理模块 -->
      <div class="grid-item admin" @click="handleModuleClick('admin')">
        <div class="content">
          <el-icon><Setting /></el-icon>
          <span>管理中心</span>
        </div>
      </div>

      <!-- Google搜索模块 -->
      <div class="grid-item google" @click="handleModuleClick('google')">
        <div class="content">
          <el-icon><Search /></el-icon>
          <span>搜索引擎</span>
          <div class="description">高仿 Google 搜索</div>
        </div>
      </div>
      
      <!-- 黑客帝国方块 - 放在管理中心下方 -->
      <div class="grid-item matrix" @click="goToDigitalRain">
        <div class="content">
          <div class="matrix-canvas-container">
            <canvas ref="matrixCanvas" class="matrix-canvas"></canvas>
          </div>
          <span>黑客帝国</span>
        </div>
      </div>

      <!-- 新增拖拉拽模块 - 放在黑客帝国下方 -->
      <div class="grid-item drag-drop" @click="navigateTo('/drag-drop')">
        <div class="content">
          <div class="module-icon">
            <el-icon><Operation /></el-icon>
          </div>
          <span>拖拉拽演示</span>
        </div>
      </div>

      <!-- 太阳系模块 - 放在黑客帝国旁边 -->
      <div class="grid-item solar-system" @click="goToSolarSystem">
        <div class="content">
          <div class="solar-preview">
            <div class="sun"></div>
            <div class="planet earth"></div>
            <div class="planet mars"></div>
          </div>
          <span>太阳系</span>
        </div>
      </div>

      <!-- 故宫模块 - 放在太阳系旁边 -->
      <div class="grid-item forbidden-city" @click="goToForbiddenCity">
        <div class="content">
          <div class="forbidden-city-preview">
            <div class="palace"></div>
            <div class="roof"></div>
            <div class="pillars"></div>
          </div>
          <span>故宫</span>
        </div>
      </div>
      
      <!-- 知识图谱模块 - 放在故宫旁边 -->
      <div class="grid-item knowledge-graph" @click="goToKnowledgeGraph">
        <div class="content">
          <div class="knowledge-graph-preview">
            <div class="node central"></div>
            <div class="node n1"></div>
            <div class="node n2"></div>
            <div class="node n3"></div>
            <div class="edge e1"></div>
            <div class="edge e2"></div>
            <div class="edge e3"></div>
          </div>
          <span>知识图谱</span>
        </div>
      </div>

      <!-- 排行榜模块入口 -->
      <div class="grid-item leaderboard-module" @click="goToLeaderboard">
        <div class="module-content">
          <div class="module-header">
            <div class="module-icon">
              <el-icon><TrophyBase /></el-icon>
            </div>
            <div>
              <div class="module-title">营销绩效排行</div>
              <div class="module-description">全行业实时数据</div>
            </div>
          </div>
          <div class="leaderboard-preview">
            <div class="rank-item" v-for="(item, index) in top3Data" :key="index">
              <div class="rank" :class="`rank-${index+1}`">{{ index + 1 }}</div>
              <div class="rank-info">
                <div class="name">{{ item.name }}</div>
                <div class="score">{{ item.score }}分</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 客户画像模块入口 -->
      <div class="grid-item customer-profile" @click="goToCustomerProfile">
        <div class="module-content">
          <div class="module-header">
            <div class="module-icon">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div>
              <div class="module-title">客户画像</div>
              <div class="module-description">智能客户分析系统</div>
            </div>
          </div>
          <div class="customer-preview">
            <div class="profile-chart">
              <div class="chart-bar" v-for="(value, index) in profileData" :key="index" :style="{ height: value + '%' }"></div>
            </div>
            <div class="profile-tags">
              <span class="tag">高价值</span>
              <span class="tag">活跃用户</span>
              <span class="tag">VIP会员</span>
            </div>
            <div class="customer-statistics">
              <div class="stat-item">
                <div class="value">2,453</div>
                <div class="label">用户总数</div>
              </div>
              <div class="stat-item">
                <div class="value">86%</div>
                <div class="label">活跃率</div>
              </div>
              <div class="stat-item">
                <div class="value">12%</div>
                <div class="label">VIP比例</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 抽奖模块入口 -->
      <div class="grid-item lucky-draw" @click="goToLuckyDraw">
        <div class="module-content">
          <div class="module-header">
            <div class="module-icon">
              <el-icon><Present /></el-icon>
            </div>
            <div>
              <div class="module-title">幸运抽奖</div>
              <div class="module-description">3D星球抽奖系统</div>
            </div>
          </div>
          <div class="lucky-draw-preview">
            <div class="sphere-animation">
              <div class="sphere-outer"></div>
              <div class="sphere-inner"></div>
              <div class="floating-names">
                <span class="floating-name name1">张三</span>
                <span class="floating-name name2">李四</span>
                <span class="floating-name name3">王五</span>
              </div>
            </div>
            <div class="prizes">
              <div class="prize-item prize1">一等奖</div>
              <div class="prize-item prize2">二等奖</div>
              <div class="prize-item prize3">三等奖</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 悬赏金模块入口 -->
      <div class="grid-item bounty" @click="goToBounty">
        <div class="module-content">
          <div class="module-header">
            <div class="module-icon">
              <el-icon><Money /></el-icon>
            </div>
            <div>
              <div class="module-title">悬赏金</div>
              <div class="module-description">任务认领奖励系统</div>
            </div>
          </div>
          <div class="bounty-preview">
            <div class="bounty-scene">
              <div class="gold-coins">
                <img src="https://img.icons8.com/color/96/000000/treasure-chest.png" alt="金币" class="treasure-image"/>
                <div class="coins-pile"></div>
              </div>
              <div class="pirate-king">
                <img src="https://img.icons8.com/color/96/000000/pirate.png" alt="海盗王" class="pirate-image"/>
              </div>
            </div>
            <div class="user-stats">
              <div class="stat-row main-stats">
                <div class="stat-card">
                  <div class="stat-label">我的金币</div>
                  <div class="stat-value">1000</div>
                </div>
                <div class="stat-card">
                  <div class="stat-label">我的段位</div>
                  <div class="stat-value">🥇 黄金</div>
                </div>
              </div>
              <div class="task-stats">
                <div class="task-stat-item">
                  <span class="task-stat-label">我发布的任务:</span>
                  <span class="task-stat-value"><span class="claimed">5</span>/<span class="total">8</span></span>
                </div>
                <div class="task-stat-item">
                  <span class="task-stat-label">未领取任务:</span>
                  <span class="task-stat-value"><span class="pending">12</span></span>
                </div>
                <div class="task-stat-item">
                  <span class="task-stat-label">处理中任务:</span>
                  <span class="task-stat-value"><span class="in-progress">3</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.home-container {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 20px;

  .grid-layout {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(6, 200px); // 增加到6行
    gap: 20px;
    max-width: 1400px;
    margin: 0 auto;

    .grid-item {
      border-radius: 24px;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.1);
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

        &::before {
          opacity: 1;
        }
      }

      &:active {
        transform: scale(0.98);
      }

      .content {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        
        .el-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        span {
          font-size: 20px;
          font-weight: 500;
        }

        .description {
          font-size: 14px;
          opacity: 0.8;
          margin-top: 8px;
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.3s;
        }
      }

      &:hover {
        .description {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }

    // 大红书模块 - 占据2x2的格子
    .redbook {
      grid-column: 1 / 3;
      grid-row: 1 / 3;
      background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
    }

    // ChatGPT模块 - 占据1x1的格子
    .chatgpt {
      grid-column: 3 / 4;
      grid-row: 1 / 2;
      background: linear-gradient(135deg, #2f3542 0%, #57606f 100%);
    }

    // 微信模块
    .wechat {
      grid-column: 3 / 4;
      grid-row: 2 / 3;
      background: linear-gradient(135deg, #4cd137 0%, #7bed9f 100%);
    }

    // 抖音模块
    .douyin {
      grid-column: 4 / 5;
      grid-row: 2 / 3;
      background: linear-gradient(135deg, #1e272e 0%, #485460 100%);
    }

    // 管理模块 - 占据1x1的格子
    .admin {
      grid-column: 4 / 5;
      grid-row: 1 / 2;
      background: linear-gradient(135deg, #3498db 0%, #5352ed 100%);
    }

    // Google搜索模块 - 占据4x1的格子
    .google {
      grid-column: 1 / 5;
      grid-row: 3 / 4;
      background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
    }
    
    // 黑客帝国方块 - 占据1x1的格子，放在管理中心下方
    .matrix {
      grid-column: 1 / 2; // 只占第一列
      grid-row: 4 / 5; // 放在第四行
      background: #000; // 黑色背景
      
      .content {
        position: relative;
        
        .matrix-canvas-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        
        span {
          position: relative;
          z-index: 2;
          color: #0F0; // 绿色文字
          text-shadow: 0 0 5px #0F0; // 发光效果
        }
      }
    }

    // 太阳系模块 - 占据1x1的格子，放在黑客帝国旁边
    .solar-system {
      grid-column: 2 / 3; // 占第二列
      grid-row: 4 / 5; // 放在第四行
      background: #000c2f; // 深蓝色背景，模拟太空
      
      .content {
        position: relative;
        
        .solar-preview {
          position: relative;
          width: 100px;
          height: 100px;
          margin-bottom: 10px;
          
          .sun {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 30px;
            height: 30px;
            background: radial-gradient(circle, #ffffa5 0%, #ffd34b 60%, #ff8300 100%);
            border-radius: 50%;
            box-shadow: 0 0 20px #ff8300;
            animation: pulse 2s infinite alternate;
          }
          
          .planet {
            position: absolute;
            border-radius: 50%;
            animation: orbit 20s linear infinite;
            
            &.earth {
              width: 8px;
              height: 8px;
              background: #4a89ff;
              top: 50%;
              left: 50%;
              margin-top: -4px;
              margin-left: -40px;
              animation-duration: 15s;
            }
            
            &.mars {
              width: 6px;
              height: 6px;
              background: #ff6b4a;
              top: 50%;
              left: 50%;
              margin-top: -3px;
              margin-left: -25px;
              animation-duration: 8s;
            }
          }
        }
        
        span {
          position: relative;
          z-index: 2;
          color: #ffffff;
          text-shadow: 0 0 5px #4a89ff;
        }
      }
    }

    // 故宫模块 - 占据1x1的格子，放在太阳系旁边
    .forbidden-city {
      grid-column: 3 / 4; // 占第三列
      grid-row: 4 / 5; // 放在第四行
      background: linear-gradient(to bottom, #b92b27, #7a1a17); // 红色背景，传统中国色
      
      .content {
        position: relative;
        
        .forbidden-city-preview {
          position: relative;
          width: 100px;
          height: 100px;
          margin-bottom: 10px;
          
          .palace {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 40px;
            background: #ffcc00;
            border-radius: 2px;
          }
          
          .roof {
            position: absolute;
            bottom: 60px;
            left: 50%;
            transform: translateX(-50%);
            width: 70px;
            height: 25px;
            background: #c41e3a;
            border-radius: 50% 50% 0 0 / 30% 30% 0 0;
            z-index: 2;
            box-shadow: 0 -2px 0 #7a1a17;
          }
          
          .pillars {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 70px;
            height: 10px;
            
            &:before, &:after {
              content: '';
              position: absolute;
              width: 5px;
              height: 20px;
              background: #b92b27;
              bottom: 0;
            }
            
            &:before {
              left: 15px;
            }
            
            &:after {
              right: 15px;
            }
          }
        }
        
        span {
          position: relative;
          z-index: 2;
          color: #ffffff;
          text-shadow: 0 0 5px #f1c40f;
        }
      }
    }
    
    // 知识图谱模块 - 占据1x1的格子，放在故宫旁边
    .knowledge-graph {
      grid-column: 4 / 5; // 占第四列
      grid-row: 4 / 5; // 放在第四行
      background: linear-gradient(135deg, #1a237e, #4a148c); // 深蓝色到紫色渐变
      
      .content {
        position: relative;
        
        .knowledge-graph-preview {
          position: relative;
          width: 100px;
          height: 100px;
          margin-bottom: 10px;
          
          .node {
            position: absolute;
            border-radius: 50%;
            background: #fff;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
            
            &.central {
              width: 20px;
              height: 20px;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: #64ffda;
              z-index: 2;
            }
            
            &.n1 {
              width: 14px;
              height: 14px;
              top: 25%;
              left: 35%;
              background: #ffeb3b;
            }
            
            &.n2 {
              width: 16px;
              height: 16px;
              top: 30%;
              left: 70%;
              background: #ff5252;
            }
            
            &.n3 {
              width: 15px;
              height: 15px;
              top: 75%;
              left: 60%;
              background: #40c4ff;
            }
          }
          
          .edge {
            position: absolute;
            height: 2px;
            background: rgba(255, 255, 255, 0.7);
            transform-origin: left center;
            
            &.e1 {
              width: 35px;
              top: 35%;
              left: 38%;
              transform: rotate(-25deg);
            }
            
            &.e2 {
              width: 30px;
              top: 57%;
              left: 55%;
              transform: rotate(60deg);
            }
            
            &.e3 {
              width: 45px;
              top: 50%;
              left: 25%;
              transform: rotate(20deg);
            }
          }
        }
        
        span {
          position: relative;
          z-index: 2;
          color: #ffffff;
          text-shadow: 0 0 5px #64ffda;
        }
      }
    }

    // 排行榜模块 - 占据1x1的格子，放在知识图谱旁边
    .leaderboard-module {
      grid-column: 3 / 4; // 修改为占第三列
      grid-row: 5 / 6; // 修改为放在第五行
      background: linear-gradient(135deg, #1890ff, #722ed1);
      color: white;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IGlkPSJwYXR0ZXJuLWJhY2tncm91bmQiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InRyYW5zcGFyZW50Ij48L3JlY3Q+PHBhdGggZD0iTSAtMTAgMTAgTCA1MCAtNTAgTSAtNTAgLTEwIEwgMTAgNTAgTSAtMzAgMzAgTCAzMCAtMzAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2Utb3BhY2l0eT0iMC4xIj48L3BhdGg+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIj48L3JlY3Q+PC9zdmc+');
        opacity: 0.1;
      }

      .module-content {
        position: relative;
        z-index: 2;
        padding: 10px;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .module-header {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
      }
      
      .module-icon {
        font-size: 24px;
        margin-right: 8px;
        margin-bottom: 0;
      }

      .module-title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 4px;
      }

      .module-description {
        font-size: 12px;
        opacity: 0.8;
        margin-bottom: 8px;
        white-space: nowrap;
      }

      .leaderboard-preview {
        display: flex;
        flex-direction: column;
        gap: 3px;
        flex-grow: 1;
        justify-content: space-around;
      }

      .rank-item {
        display: flex;
        align-items: center;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        padding: 3px 6px;
      }

      .rank {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        margin-right: 6px;
        font-size: 12px;
      }

      .rank-1 {
        background: linear-gradient(135deg, #FFD700, #FFA500);
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
      }

      .rank-2 {
        background: linear-gradient(135deg, #C0C0C0, #A9A9A9);
        box-shadow: 0 0 10px rgba(192, 192, 192, 0.5);
      }

      .rank-3 {
        background: linear-gradient(135deg, #CD7F32, #A0522D);
        box-shadow: 0 0 10px rgba(205, 127, 50, 0.5);
      }

      .rank-info {
        display: flex;
        justify-content: space-between;
        flex: 1;
        font-size: 12px;
      }

      .name {
        font-weight: bold;
      }

      .score {
        color: rgba(255, 255, 255, 0.8);
      }
    }

    // 客户画像模块 - 占据1x1的格子，放在排行榜旁边
    .customer-profile {
      grid-column: 4 / 5; // 占第四列
      grid-row: 5 / 6; // 放在第五行
      background: linear-gradient(135deg, #ff4500, #ff8c00);
      color: white;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IGlkPSJwYXR0ZXJuLWJhY2tncm91bmQiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InRyYW5zcGFyZW50Ij48L3JlY3Q+PHBhdGggZD0iTSAtMTAgMTAgTCA1MCAtNTAgTSAtNTAgLTEwIEwgMTAgNTAgTSAtMzAgMzAgTCAzMCAtMzAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2Utb3BhY2l0eT0iMC4xIj48L3BhdGg+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIj48L3JlY3Q+PC9zdmc+');
        opacity: 0.2;
      }

      .module-content {
        position: relative;
        z-index: 2;
        height: 100%;
        padding: 12px;
        display: flex;
        flex-direction: column;
      }

      .module-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
      
      .module-icon {
        font-size: 22px;
        margin-right: 8px;
        color: rgba(255, 255, 255, 0.9);
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
      }

      .module-title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 0;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
      }

      .module-description {
        font-size: 11px;
        opacity: 0.9;
        text-shadow: 0 1px 1px rgba(0,0,0,0.3);
      }

      .customer-preview {
        margin-top: 4px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex-grow: 1;
      }

      .profile-chart {
        display: flex;
        align-items: flex-end;
        justify-content: space-around;
        height: 60px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 6px;
        padding: 0 5px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) inset;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: rgba(255, 255, 255, 0.5);
        }
      }

      .chart-bar {
        width: 12px;
        background: linear-gradient(to top, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4));
        border-radius: 3px 3px 0 0;
        transition: height 0.5s ease;
        box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
        
        &:nth-child(1) { background: linear-gradient(to top, #ff9966, #ff5e62); }
        &:nth-child(2) { background: linear-gradient(to top, #56CCF2, #2F80ED); }
        &:nth-child(3) { background: linear-gradient(to top, #FFEB3B, #FFC107); }
        &:nth-child(4) { background: linear-gradient(to top, #43e97b, #38f9d7); }
        &:nth-child(5) { background: linear-gradient(to top, #fa709a, #fee140); }
      }

      .profile-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 2px;
      }

      .tag {
        background: rgba(255, 255, 255, 0.25);
        border-radius: 12px;
        padding: 2px 8px;
        font-size: 11px;
        font-weight: 500;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        
        &:nth-child(1) { background: rgba(255, 94, 98, 0.6); }
        &:nth-child(2) { background: rgba(47, 128, 237, 0.6); }
        &:nth-child(3) { background: rgba(255, 193, 7, 0.6); }
      }
      
      .customer-statistics {
        display: flex;
        justify-content: space-between;
        margin-top: auto;
        margin-bottom: 2px;
        padding-top: 4px;
        
        .stat-item {
          text-align: center;
          flex: 1;
          
          .value {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 1px;
          }
          
          .label {
            font-size: 9px;
            opacity: 0.8;
          }
        }
      }
    }

    // 抽奖模块 - 占据2x1的格子，放在第6行
    .lucky-draw {
      grid-column: 1 / 3; // 占据第1-2列
      grid-row: 6 / 7; // 放在第6行
      background: linear-gradient(135deg, #6a11cb, #2575fc);
      color: white;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IGlkPSJwYXR0ZXJuLWJhY2tncm91bmQiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InRyYW5zcGFyZW50Ij48L3JlY3Q+PHBhdGggZD0iTSAtMTAgMTAgTCA1MCAtNTAgTSAtNTAgLTEwIEwgMTAgNTAgTSAtMzAgMzAgTCAzMCAtMzAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2Utb3BhY2l0eT0iMC4xIj48L3BhdGg+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIj48L3JlY3Q+PC9zdmc+');
        opacity: 0.2;
      }

      .module-content {
        position: relative;
        z-index: 2;
        height: 100%;
        padding: 12px;
        display: flex;
        flex-direction: column;
      }

      .module-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
      
      .module-icon {
        font-size: 22px;
        margin-right: 8px;
        color: rgba(255, 255, 255, 0.9);
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
      }

      .module-title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 0;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
      }

      .module-description {
        font-size: 11px;
        opacity: 0.9;
        text-shadow: 0 1px 1px rgba(0,0,0,0.3);
      }

      .lucky-draw-preview {
        margin-top: 4px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex-grow: 1;
      }

      .sphere-animation {
        position: relative;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;

        .sphere-outer {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          position: absolute;
          animation: rotate3D 10s linear infinite;
        }

        .sphere-inner {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.5);
          position: absolute;
          animation: rotate3D-reverse 7s linear infinite;
        }

        .floating-names {
          position: absolute;
          width: 100%;
          height: 100%;

          .floating-name {
            position: absolute;
            background: rgba(255, 255, 255, 0.8);
            color: #2575fc;
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 10px;
            font-weight: bold;
            animation-duration: 3s;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            animation-name: float;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          }

          .name1 {
            left: 25%;
            top: 20%;
            animation-delay: 0s;
          }

          .name2 {
            right: 25%;
            top: 40%;
            animation-delay: 0.5s;
          }

          .name3 {
            left: 35%;
            bottom: 15%;
            animation-delay: 1s;
          }
        }
      }

      .prizes {
        display: flex;
        justify-content: space-around;
        margin-top: auto;

        .prize-item {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 15px;
          padding: 3px 10px;
          font-size: 11px;
          font-weight: bold;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
          transition: all 0.3s;
        }

        .prize1 {
          background: rgba(255, 215, 0, 0.3);
          border-color: rgba(255, 215, 0, 0.6);
          animation: pulse 2s infinite;
        }

        .prize2 {
          background: rgba(192, 192, 192, 0.3);
          border-color: rgba(192, 192, 192, 0.6);
          animation: pulse 2s infinite 0.5s;
        }

        .prize3 {
          background: rgba(205, 127, 50, 0.3);
          border-color: rgba(205, 127, 50, 0.6);
          animation: pulse 2s infinite 1s;
        }
      }
    }

    // 悬赏金模块
    .bounty {
      grid-column: 3 / 5; // 修改为占据第3-4列
      grid-row: 6 / 7; // 保持在第六行
      background: linear-gradient(135deg, #d4af37, #f5e8c0); // 改为金色系渐变
      color: #8b6914;
      position: relative;
      overflow: hidden;
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3);
      }
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(161, 124, 12, 0.1)" stroke-width="2"/></svg>');
        background-size: 100px 100px;
        opacity: 0.5;
        pointer-events: none;
      }
      
      .module-content {
        position: relative;
        z-index: 2;
        height: 100%;
        padding: 12px;
        display: flex;
        flex-direction: column;
      }

      .module-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
      
      .module-icon {
        font-size: 22px;
        margin-right: 8px;
        color: #a17c0c;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
      }

      .module-title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 0;
        text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
        color: #8b6914;
      }

      .module-description {
        font-size: 11px;
        opacity: 0.9;
        text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
        color: #8b6914;
      }
      
      .bounty-preview {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        flex-grow: 1;
        
        .bounty-scene {
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 65px; // 进一步减小高度，给下方信息留出更多空间
          margin-top: 2px;
          position: relative;
          
          .gold-coins {
            position: relative;
            z-index: 1;
            flex: 0 0 40%;
            display: flex;
            flex-direction: column;
            align-items: center;
            
            .treasure-image {
              width: 45px; // 继续减小图片尺寸
              height: 45px;
              filter: drop-shadow(1px 2px 4px rgba(0, 0, 0, 0.2));
              animation: treasure-shine 5s ease-in-out infinite;
              position: relative;
              z-index: 2;
            }
            
            .coins-pile {
              position: absolute;
              bottom: 0;
              width: 65px;
              height: 20px;
              background: radial-gradient(ellipse at center, #ffd700 0%, rgba(255, 215, 0, 0) 70%);
              border-radius: 50%;
              filter: blur(5px);
              opacity: 0.7;
              animation: glow 2s ease-in-out infinite alternate;
            }
            
            @keyframes treasure-shine {
              0%, 100% { filter: drop-shadow(1px 2px 4px rgba(0, 0, 0, 0.2)); }
              50% { filter: drop-shadow(2px 4px 8px rgba(212, 175, 55, 0.5)); }
            }
            
            @keyframes glow {
              from { opacity: 0.5; }
              to { opacity: 0.8; }
            }
          }
          
          .pirate-king {
            position: relative;
            z-index: 2;
            flex: 0 0 40%;
            display: flex;
            justify-content: center;
            
            .pirate-image {
              width: 65px; // 继续减小图片尺寸
              height: 65px;
              filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3));
              animation: pirate-float 3s ease-in-out infinite;
            }
            
            @keyframes pirate-float {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-8px) rotate(5deg); }
            }
          }
        }
        
        .user-stats {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 2px;
          
          .main-stats {
            display: flex;
            gap: 10px;
            width: 100%;
            
            .stat-card {
              flex: 1;
              background: rgba(255, 255, 255, 0.2);
              border-radius: 8px;
              padding: 6px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 6px rgba(161, 124, 12, 0.1);
              backdrop-filter: blur(5px);
              border: 1px solid rgba(255, 255, 255, 0.3);
              transition: all 0.3s;
              
              &:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-2px);
              }
              
              .stat-label {
                font-size: 14px;
                color: #8b6914;
                margin-bottom: 2px;
                white-space: nowrap;
                font-weight: 500;
              }
              
              .stat-value {
                font-size: 16px;
                font-weight: bold;
                color: #8b6914;
                white-space: nowrap;
                letter-spacing: -0.5px;
              }
            }
          }
          
          .task-stats {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            padding: 8px 10px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 2px 6px rgba(161, 124, 12, 0.1);
            backdrop-filter: blur(5px);
            margin-top: 8px; /* 增加顶部间距 */
            
            .task-stat-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              
              &:not(:last-child) {
                border-bottom: 1px dashed rgba(139, 105, 20, 0.2);
                padding-bottom: 6px;
              }
              
              .task-stat-label {
                font-size: 13px;
                color: #8b6914;
                font-weight: 500;
              }
              
              .task-stat-value {
                font-size: 14px;
                font-weight: bold;
                background: rgba(255, 255, 255, 0.3);
                padding: 2px 8px;
                border-radius: 10px;
                
                .claimed {
                  color: #67c23a; /* 绿色，表示已认领任务 */
                }
                
                .total {
                  color: #8b6914; /* 金棕色，表示总任务 */
                }
                
                .pending {
                  color: #d4af37; /* 金色，表示未领取 */
                }
                
                .in-progress {
                  color: #409eff; /* 蓝色，表示处理中 */
                }
              }
            }
          }
        }
      }
    }

    // 新增拖拉拽模块
    .drag-drop {
      grid-column: 1 / 2; // 占第一列，与黑客帝国相同
      grid-row: 5 / 6; // 放在第五行，黑客帝国在第四行
      background: linear-gradient(135deg, #6a11cb, #2575fc);
      color: white;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IGlkPSJwYXR0ZXJuLWJhY2tncm91bmQiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InRyYW5zcGFyZW50Ij48L3JlY3Q+PHBhdGggZD0iTSAtMTAgMTAgTCA1MCAtNTAgTSAtNTAgLTEwIEwgMTAgNTAgTSAtMzAgMzAgTCAzMCAtMzAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2Utb3BhY2l0eT0iMC4xIj48L3BhdGg+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIj48L3JlY3Q+PC9zdmc+');
        opacity: 0.2;
      }

      .content {
        position: relative;
        z-index: 2;
        height: 100%;
        padding: 12px;
        display: flex;
        flex-direction: column;
      }

      .module-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
      
      .module-icon {
        font-size: 22px;
        margin-right: 8px;
        color: rgba(255, 255, 255, 0.9);
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
      }

      .module-title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 0;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
      }

      .module-description {
        font-size: 11px;
        opacity: 0.9;
        text-shadow: 0 1px 1px rgba(0,0,0,0.3);
      }
    }
  }
}

// 轨道动画
@keyframes orbit {
  0% {
    transform: rotate(0deg) translateX(30px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(30px) rotate(-360deg);
  }
}

// 太阳脉动效果
@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}

// 3D旋转效果
@keyframes rotate3D {
  0% { transform: rotate3d(1, 1, 1, 0deg); }
  100% { transform: rotate3d(1, 1, 1, 360deg); }
}

@keyframes rotate3D-reverse {
  0% { transform: rotate3d(1, -1, 1, 360deg); }
  100% { transform: rotate3d(1, -1, 1, 0deg); }
}

// 名字浮动动画
@keyframes float {
  0% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-5px) scale(1.05); }
  100% { transform: translateY(0) scale(1); }
}

// 响应式调整
@media (max-width: 768px) {
  .home-container .grid-layout {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    
    .redbook {
      grid-column: 1 / 3;
      grid-row: 1 / 3;
    }
    
    .chatgpt, .google, .wechat, .douyin {
      grid-column: auto;
      grid-row: auto;
    }
    
    .admin {
      grid-column: 1 / 3;
      grid-row: auto;
    }
    
    .matrix {
      grid-column: 1 / 2;
      grid-row: auto;
    }

    .solar-system {
      grid-column: 2 / 3;
      grid-row: auto;
    }

    .forbidden-city {
      grid-column: 1 / 2;
      grid-row: auto;
    }
    
    .knowledge-graph {
      grid-column: 2 / 3;
      grid-row: auto;
    }

    .leaderboard-module, .customer-profile, .lucky-draw {
      grid-column: 1 / 3; // 在中等屏幕上占据两列
      grid-row: auto;
    }

    .bounty {
      grid-column: 1 / 3; // 在中等屏幕上占据两列
      grid-row: auto; // 自动排列，确保不会与前面的元素重叠
    }
  }
}

@media (max-width: 480px) {
  .home-container .grid-layout {
    grid-template-columns: 1fr;
    
    .redbook, .admin, .matrix, .solar-system, .forbidden-city, .knowledge-graph, .leaderboard-module, .customer-profile, .lucky-draw, .bounty {
      grid-column: 1;
    }
  }
}

@media (max-width: 1200px) {
  .home-container .grid-layout {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .home-container .grid-layout {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .home-container .grid-layout {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Connection, ChatDotRound, Message, VideoPlay, Setting, Search, Promotion, TrophyBase, UserFilled, Present, Money, Monitor, Place, School, Avatar, Operation } from '@element-plus/icons-vue'
import { ref, onMounted, onUnmounted } from 'vue'

const router = useRouter()

const matrixCanvas = ref(null)
let matrixInterval = null

onMounted(() => {
  initMatrix()
})

onUnmounted(() => {
  if (matrixInterval) {
    clearInterval(matrixInterval)
  }
})

const initMatrix = () => {
  const canvas = matrixCanvas.value
  if (!canvas) return // 防止canvas未加载完成
  
  const ctx = canvas.getContext('2d')
  
  // 设置画布大小为容器大小
  const resizeCanvas = () => {
    const container = canvas.parentElement
    canvas.width = container.clientWidth
    canvas.height = container.clientHeight
  }
  
  // 初始调整大小
  resizeCanvas()
  
  // 监听窗口大小变化
  window.addEventListener('resize', resizeCanvas)
  
  // 黑客帝国效果的实现
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const fontSize = 14
  const columns = Math.floor(canvas.width / fontSize)
  const drops = []
  
  // 初始化每列的Y位置
  for (let i = 0; i < columns; i++) {
    drops[i] = 1
  }
  
  // 绘制黑客帝国效果
  const draw = () => {
    // 半透明黑色背景，形成拖尾效果
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // 设置文字颜色和字体
    ctx.fillStyle = '#0F0' // 绿色
    ctx.font = `${fontSize}px monospace`
    
    // 逐列绘制字符
    for (let i = 0; i < drops.length; i++) {
      // 随机选择一个字符
      const text = characters[Math.floor(Math.random() * characters.length)]
      
      // 绘制字符
      ctx.fillText(text, i * fontSize, drops[i] * fontSize)
      
      // 字符下落到底部后，有一定概率重新回到顶部
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      
      // 递增Y位置
      drops[i]++
    }
  }
  
  // 设置定时器，定期重绘
  matrixInterval = setInterval(draw, 33) // 约30fps
}

const handleModuleClick = (module: string) => {
  router.push(`/${module}`)
}

// 跳转到数字雨效果页面
const goToDigitalRain = () => {
  router.push('/digital-rain')
}

// 跳转到太阳系页面
const goToSolarSystem = () => {
  router.push('/solar-system')
}

// 跳转到故宫页面
const goToForbiddenCity = () => {
  router.push('/forbidden-city')
}

// 跳转到知识图谱页面
const goToKnowledgeGraph = () => {
  router.push('/knowledge-graph')
}

// 跳转到排行榜页面
const goToLeaderboard = () => {
  router.push('/leaderboard')
}

// 跳转到客户画像页面
const goToCustomerProfile = () => {
  router.push('/customer-profile')
}

// 跳转到抽奖页面
const goToLuckyDraw = () => {
  router.push('/lucky-draw')
}

// 跳转到悬赏金页面
const goToBounty = () => {
  router.push('/bounty')
}

// 排行榜前三名示例数据
const top3Data = [
  { name: '张伟', score: 98 },
  { name: '李强', score: 95 },
  { name: '王芳', score: 92 }
]

// 客户画像示例数据（柱状图高度百分比）
const profileData = [65, 85, 45, 92, 58]

// 导航到指定路径
const navigateTo = (path: string) => {
  try {
    console.log('导航到:', path)
    router.push(path)
  } catch (error) {
    console.error('导航错误:', error)
  }
}
</script>