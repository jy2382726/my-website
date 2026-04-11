import type { Project } from '../types'

export const projects: Project[] = [
  {
    title: 'Project Alpha',
    description: '一个基于 React 和 Node.js 的全栈任务管理应用，支持实时协作和拖拽排序。',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    imageUrl: '/placeholder-project.svg',
    link: 'https://github.com',
  },
  {
    title: 'Project Beta',
    description: '高性能的数据可视化仪表盘，使用 D3.js 和 WebSocket 实现实时数据更新。',
    techStack: ['React', 'D3.js', 'WebSocket', 'Tailwind CSS'],
    imageUrl: '/placeholder-project.svg',
    link: 'https://github.com',
  },
  {
    title: 'Project Gamma',
    description: '开源 CLI 工具，用于自动化前端项目的脚手架搭建和代码生成。',
    techStack: ['Node.js', 'TypeScript', 'Commander.js'],
    imageUrl: '/placeholder-project.svg',
  },
]
