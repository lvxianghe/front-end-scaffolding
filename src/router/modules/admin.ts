export default {
  path: '/admin',
  name: 'Admin',
  component: () => import('@/views/admin/index.vue'),
  // 确保使用与其他页面相同的布局
  meta: {
    title: '管理中心',
    icon: 'Setting',
    // 如果其他页面有特定的布局配置，这里也应该有
    layout: 'default' // 或者其他页面使用的布局名称
  }
} 