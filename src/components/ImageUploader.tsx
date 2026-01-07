import { useState, useEffect } from 'react'
//useState让函数组件能够存储和更新数据
//在数据变化时重新渲染组件
//记住组件的数据状态
//useEffect让函数组件能够：
//在组件渲染后执行代码
//监听数据变化并执行相应操作
//清理资源（如取消订阅、清除定时器等）
import './ImageUploader.css'

// 定义商品数据类型
interface Product 
{
  id: string
  image: string
  price: number
  timestamp: number
}

function ImageUploader() 
{
  const [image, setImage] = useState<string>('')
  const [price, setPrice] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])

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
      // 将图片转换为 base64 字符串
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 保存商品信息
  const handleSave = () => {
    if (!image || !price) {
      alert('请上传图片并输入价格')
      return
    }

    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('请输入有效的价格')
      return
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      image: image,
      price: priceNum,
      timestamp: Date.now()
    }

    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)
    
    // 保存到 localStorage
    localStorage.setItem('products', JSON.stringify(updatedProducts))

    // 清空表单
    setImage('')
    setPrice('')
    alert('商品已保存！')
  }

  // 删除商品
  const handleDelete = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id)
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
  }

  return (
    <div className="image-uploader">
      <h2>上传商品</h2>
      
      {/* 上传区域 */}
      <div className="upload-section">
        <div className="image-preview">
          {image ? (
            <img src={image} alt="预览" />
          ) : (
            <div className="placeholder">点击下方按钮选择图片</div>
          )}
        </div>
        
        <label className="upload-button">
          选择图片
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </label>
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

      {/* 已保存的商品列表 */}
      <div className="products-list">
        <h3>已保存的商品 ({products.length})</h3>
        {products.length === 0 ? (
          <p className="empty-message">暂无商品</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt="商品" />
                <div className="product-info">
                  <p className="product-price">¥{product.price.toFixed(2)}</p>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="delete-button"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageUploader

