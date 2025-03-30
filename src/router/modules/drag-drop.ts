import { RouteRecordRaw } from 'vue-router';

const dragDropRoutes: RouteRecordRaw = {
  path: '/drag-drop',
  name: 'DragDrop',
  component: () => import('@/views/drag-drop/index.vue'),
  meta: {
    title: '拖拉拽演示',
    icon: 'Operation',
    requiresAuth: false
  }
};

export default dragDropRoutes; 