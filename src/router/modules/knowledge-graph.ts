import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/knowledge-graph',
    name: 'knowledge-graph',
    component: () => import('@/views/knowledge-graph/index.vue'),
    meta: {
      title: '知识图谱可视化',
      icon: 'Connection',
      hideGridNav: true
    }
  }
]

export default routes 