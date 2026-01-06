//React应用的入口文件，负责将React应用挂载到页面上
//index.html中的<script>标签会加载此文件
//负责初始化并渲染整个React应用
import { StrictMode } from 'react'
//开发模式下的额外检查
import { createRoot } from 'react-dom/client'
//创建React应用的根节点
import './index.css'
//导入全局样式
import App from './App.tsx'
//导入APP组件
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
