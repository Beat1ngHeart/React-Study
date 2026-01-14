import { useState, useEffect } from 'react'
//useState让函数组件能够存储和更新数据
//在数据变化时重新渲染组件
//记住组件的数据状态
//useEffect让函数组件能够：
//在组件渲染后执行代码
//监听数据变化并执行相应操作
//清理资源（如取消订阅、清除定时器等）
import './ImageUploader.css'
import { uploadImageToIPFS, getIPFSImageUrl, IPFS_GATEWAYS } from '../utils/ipfs'

// 定义商品数据类型
interface Product 
{
  id: string
  image: string  // 可以是 base64 或 IPFS URL
  ipfsCid?: string  // IPFS 内容标识符（可选）
  price: number
  timestamp: number
}

function ImageUploader() 
{
  const [image, setImage] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [price, setPrice] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadMethod, setUploadMethod] = useState<'ipfs' | 'local'>('ipfs')
  const [ipfsCid, setIpfsCid] = useState<string>('')

  // 页面加载时从 localStorage 读取数据
  useEffect(() => {
    const savedProducts = localStorage.getItem('products')
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }

  }, [])
  //没有依赖数组 = 每次渲染都执行
  //空数组 = 只在组件挂载时执行一次
  //[dep] = 当 dep 变化时执行

  // 处理图片上传
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      // 将图片转换为 base64 字符串用于预览
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      setIpfsCid('') // 重置 IPFS CID
    }
  }

  // 获取 Pinata 凭证（从环境变量）
  const getPinataCredentials = () => {
    const jwt = import.meta.env.VITE_PINATA_JWT
    const key = import.meta.env.VITE_PINATA_KEY
    const secret = import.meta.env.VITE_PINATA_SECRET

    if (jwt) {
      return { pinataJWT: jwt }
    } else if (key && secret) {
      return { pinataKey: key, pinataSecret: secret }
    }
    return null
  }

  // 上传图片到 IPFS
  const handleUploadToIPFS = async () => {
    if (!imageFile) {
      alert('请先选择图片')
      return
    }

    setUploading(true)
    try {
      // 优先使用 Pinata（如果配置了凭证）
      const pinataCreds = getPinataCredentials()
      const result = pinataCreds
        ? await uploadImageToIPFS(imageFile, 'pinata', pinataCreds)
        : await uploadImageToIPFS(imageFile, 'public')
      
      setIpfsCid(result.cid)
      setImage(result.url) // 使用 IPFS URL 替换 base64
      alert(`图片已上传到 IPFS!\nCID: ${result.cid}\nURL: ${result.url}`)
    } catch (error: any) {
      console.error('IPFS 上传失败:', error)
      alert(`IPFS 上传失败: ${error.message}\n将使用本地存储`)
      setUploadMethod('local') // 回退到本地存储
    } finally {
      setUploading(false)
    }
  }

  // 保存商品信息
  const handleSave = async () => {
    if (!image || !price) {
      alert('请上传图片并输入价格')
      return
    }

    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('请输入有效的价格')
      return
    }

    // 如果选择了 IPFS 但还没有上传，先上传
    let finalImage = image
    let finalCid = ipfsCid

    if (uploadMethod === 'ipfs' && !ipfsCid && imageFile) {
      setUploading(true)
      try {
        // 优先使用 Pinata（如果配置了凭证）
        const pinataCreds = getPinataCredentials()
        const result = pinataCreds
          ? await uploadImageToIPFS(imageFile, 'pinata', pinataCreds)
          : await uploadImageToIPFS(imageFile, 'public')
        finalImage = result.url
        finalCid = result.cid
        setIpfsCid(result.cid)
      } catch (error: any) {
        console.error('自动上传到 IPFS 失败:', error)
        alert(`自动上传到 IPFS 失败: ${error.message}\n将使用本地存储（base64）`)
        // 继续使用 base64
      } finally {
        setUploading(false)
      }
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      image: finalImage,
      ipfsCid: finalCid || undefined,
      price: priceNum,
      timestamp: Date.now()
    }

    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)
    
    // 保存到 localStorage
    localStorage.setItem('products', JSON.stringify(updatedProducts))
    
    // 触发自定义事件，通知商品列表更新
    window.dispatchEvent(new Event('productsUpdated'))

    // 清空表单
    setImage('')
    setImageFile(null)
    setPrice('')
    setIpfsCid('')
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
    
    alert('商品已保存！')
  }

  return (
    <div className="image-uploader">
      <div className="header-section">
        <h2>上传商品</h2>
      </div>
      
      {/* 上传区域 */}
      <div className="upload-section">
        <div className="image-preview">
          {image ? (
            <img src={image} alt="预览" />
          ) : (
            <div className="placeholder">点击下方按钮选择图片</div>
          )}
        </div>
        
        <div className="upload-buttons">
          <label className="upload-button">
            选择图片
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </label>
          
          {imageFile && uploadMethod === 'ipfs' && !ipfsCid && (
            <button 
              onClick={handleUploadToIPFS} 
              className="ipfs-upload-button"
              disabled={uploading}
            >
              {uploading ? '上传中...' : '上传到 IPFS'}
            </button>
          )}
        </div>

        {ipfsCid && (
          <div className="ipfs-info">
            <p>✅ 已上传到 IPFS</p>
            <p className="ipfs-cid">CID: {ipfsCid}</p>
            <p className="ipfs-url">
              <a href={image} target="_blank" rel="noopener noreferrer">
                查看 IPFS 链接
              </a>
            </p>
          </div>
        )}

        {/* 存储方式选择 */}
        <div className="storage-method">
          <label>
            <input
              type="radio"
              value="ipfs"
              checked={uploadMethod === 'ipfs'}
              onChange={() => setUploadMethod('ipfs')}
            />
            使用 IPFS 存储（去中心化）
          </label>
          <label>
            <input
              type="radio"
              value="local"
              checked={uploadMethod === 'local'}
              onChange={() => setUploadMethod('local')}
            />
            使用本地存储（base64）
          </label>
        </div>
      </div>

      {/* 价格输入 */}
      <div className="price-section">
        <label>
          价格：
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="请输入价格"
            min="0"
            step="0.01"
          />
        </label>
      </div>

      {/* 保存按钮 */}
      <button onClick={handleSave} className="save-button">
        保存商品
      </button>
    </div>
  )
}


export default ImageUploader

