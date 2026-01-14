# IPFS 上传功能设置指南

## 概述

本项目已集成 IPFS（InterPlanetary File System）上传功能，支持将图片上传到去中心化存储网络。

## 🎯 推荐方式：使用本地 IPFS Desktop（最简单）

如果你已经安装了 **IPFS Desktop**（从截图可以看到），这是最简单的方式：

### 步骤：

1. **确保 IPFS Desktop 正在运行**
   - 打开 IPFS Desktop 应用
   - 确保状态显示为"已连接"或"运行中"

2. **直接使用**
   - 组件会自动连接到 `http://localhost:5001`
   - 选择图片后点击"上传到 IPFS"即可

3. **无需安装额外依赖**
   - 不需要安装任何 npm 包
   - 不需要注册任何服务
   - 完全免费使用

### 优势：
- ✅ 完全免费
- ✅ 数据存储在本地节点
- ✅ 不需要 API Token
- ✅ 不需要注册账号
- ✅ 完全去中心化

## 其他方式

### 方法 1: 使用公共 IPFS（需要安装依赖）

```bash
cd React-Study-main
npm install ipfs-http-client
```

### 方法 2: 使用 Web3.Storage（免费，需要注册）

1. 访问 https://web3.storage/
2. 注册账号并获取 API Token
3. 在代码中使用（见下方配置）

### 方法 3: 使用 NFT.Storage（专为 NFT 设计）

1. 访问 https://nft.storage/
2. 注册账号并获取 API Token
3. 在代码中使用

### 方法 4: 使用 Pinata（商业服务）

1. 访问 https://www.pinata.cloud/
2. 注册账号并获取 API Key 和 Secret
3. 在代码中使用

## 使用方法

### 1. 使用本地 IPFS Desktop（推荐）

**确保 IPFS Desktop 正在运行**，然后：

```tsx
// 组件会自动连接到本地 IPFS 节点
<ImageUploader />
```

组件会自动：
- 检测本地 IPFS 节点（`http://localhost:5001`）
- 上传文件到本地节点
- 返回 IPFS CID 和访问 URL

### 2. 基本使用（公共 IPFS）

安装 `ipfs-http-client` 后，修改代码使用公共 IPFS：

```tsx
// 在 ImageUploader.tsx 中修改
const result = await uploadImageToIPFS(imageFile, 'public')
```

### 3. 使用 Web3.Storage

修改 `src/components/ImageUploader.tsx`：

```tsx
// 在 handleUploadToIPFS 函数中
const result = await uploadImageToIPFS(
  imageFile, 
  'web3',
  { web3Token: 'YOUR_WEB3_STORAGE_TOKEN' }
)
```

### 4. 使用 NFT.Storage

```tsx
const result = await uploadImageToIPFS(
  imageFile, 
  'nftstorage',
  { nftStorageToken: 'YOUR_NFT_STORAGE_TOKEN' }
)
```

### 5. 使用 Pinata

```tsx
const result = await uploadImageToIPFS(
  imageFile, 
  'pinata',
  { 
    pinataKey: 'YOUR_PINATA_KEY',
    pinataSecret: 'YOUR_PINATA_SECRET'
  }
)
```

## 功能说明

### 存储方式选择

组件提供两种存储方式：

1. **IPFS 存储（去中心化）**
   - 图片上传到 IPFS 网络
   - 获得唯一的 CID（内容标识符）
   - 数据永久存储，不可篡改
   - 适合 NFT 和去中心化应用

2. **本地存储（base64）**
   - 图片转换为 base64 字符串
   - 存储在浏览器的 localStorage
   - 仅本地可用，刷新后可能丢失
   - 适合快速测试

### IPFS 上传流程

1. 选择图片文件
2. 点击"上传到 IPFS"按钮
3. 等待上传完成（显示 CID）
4. 输入价格并保存商品
5. 商品信息包含 IPFS URL

### 数据格式

保存的商品数据结构：

```typescript
{
  id: string
  image: string        // IPFS URL 或 base64
  ipfsCid?: string      // IPFS CID（如果使用 IPFS）
  price: number
  timestamp: number
}
```

## IPFS 网关

项目支持多个 IPFS 网关：

- `ipfs.io` - 官方网关
- `cloudflare-ipfs.com` - Cloudflare 网关
- `gateway.pinata.cloud` - Pinata 网关
- `ipfs.infura.io` - Infura 网关
- `nftstorage.link` - NFT.Storage 网关

## 常见问题

### Q: 上传失败怎么办？

**如果使用本地 IPFS Desktop：**
1. 确保 IPFS Desktop 正在运行
2. 检查 IPFS Desktop 状态是否为"已连接"
3. 确认 API 地址为 `http://localhost:5001`（默认）

**如果使用其他方式：**
- 组件会自动回退到本地存储（base64）
- 检查网络连接
- 检查 IPFS 服务是否可用
- 检查 API Token 是否正确（如果使用）

### Q: IPFS CID 是什么？

A: CID（Content Identifier）是 IPFS 中文件的唯一标识符，类似于文件的哈希值。

### Q: 如何访问 IPFS 上的图片？

A: 使用 IPFS 网关 URL：`https://ipfs.io/ipfs/{CID}`

### Q: 图片会永久存储吗？

A: 取决于使用的服务：
- 公共 IPFS：需要节点保持在线
- Web3.Storage/NFT.Storage：有免费存储配额
- Pinata：根据套餐决定

## 安全提示

⚠️ **重要**：不要将 API Token 提交到 Git！

建议使用环境变量：

```bash
# .env.local
VITE_WEB3_STORAGE_TOKEN=your_token_here
VITE_PINATA_KEY=your_key_here
VITE_PINATA_SECRET=your_secret_here
```

然后在代码中读取：

```tsx
const token = import.meta.env.VITE_WEB3_STORAGE_TOKEN
```

## 下一步

### 使用本地 IPFS Desktop（推荐）：
- [x] 确保 IPFS Desktop 正在运行
- [ ] 测试上传功能
- [ ] 查看上传的文件在 IPFS Desktop 中

### 使用其他方式：
- [ ] 安装 `ipfs-http-client`（如果使用公共 IPFS）
- [ ] （可选）注册 Web3.Storage 或 NFT.Storage
- [ ] 测试上传功能
- [ ] 配置环境变量（如果使用付费服务）

## 本地 IPFS 节点配置

如果 IPFS Desktop 的 API 地址不是默认的 `http://localhost:5001`，可以在代码中指定：

```tsx
const result = await uploadImageToIPFS(
  imageFile, 
  'local',
  { localApiUrl: 'http://your-custom-ip:5001' }
)
```

