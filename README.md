package-lock.json 是npm自动生成的锁定文件，用于确保依赖版本的一致性  
package.json 是项目的核心配置文件，定义项目元数据、依赖和脚本  
tscongig.app.json 是TypeScript的配置文件，用于配置应用代码的编译选项  
tsconfig.json 是TypeScript的主配置文件。该项目使用项目引用，它作为入口，将配置分散到多个子配置文件中  

1. 在 src/ 中编写代码  
2. 在 public/ 中添加静态资源  
3. 运行 npm run dev 开发  
4. 运行 npm run build 构建（生成 dist/）  
5. 不要手动修改 dist/ 和 node_modules/  

2026.1.6  
更改模板，删除无用组件
devimage/2026.1.6.png

