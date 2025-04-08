<template>
  <div class="metric-system-container">
    <div class="container-fluid">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">指标配置系统</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item" v-for="(section, index) in sections" :key="index">
                <a class="nav-link" 
                   :class="{ active: activeSection === section.id }" 
                   href="#" 
                   @click.prevent="setActiveSection(section.id)">
                  {{ section.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- 动态组件区域 -->
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import AqlConfig from './components/AqlConfig.vue';
import BaseMetric from './components/BaseMetric.vue';
import CompositeMetric from './components/CompositeMetric.vue';
import MetricDashboard from './components/MetricDashboard.vue';
import GroupManagement from './components/GroupManagement.vue';

export default {
  components: {
    AqlConfig,
    BaseMetric,
    CompositeMetric,
    MetricDashboard,
    GroupManagement
  },
  setup() {
    const activeSection = ref('dashboard');
    
    const sections = [
      { id: 'dashboard', name: '指标面板', component: MetricDashboard },
      { id: 'base-metric', name: '基础指标', component: BaseMetric },
      { id: 'composite-metric', name: '复合指标', component: CompositeMetric },
      { id: 'aql-config', name: 'AQL配置', component: AqlConfig },
      { id: 'group', name: '分组管理', component: GroupManagement }
    ];
    
    const currentComponent = computed(() => {
      const section = sections.find(s => s.id === activeSection.value);
      return section ? section.component : null;
    });
    
    function setActiveSection(sectionId) {
      activeSection.value = sectionId;
    }
    
    return {
      activeSection,
      sections,
      currentComponent,
      setActiveSection
    };
  }
};
</script>

<style>
@import './styles.css';
@import 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
</style> 