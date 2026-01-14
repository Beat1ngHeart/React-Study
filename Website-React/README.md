  const [products, setProducts] = useState<Product[]>([])  
  //声明一个状态变量.products，类型是Product数组
  //初始值是空数组[]
  //setProducts是用于更新products状态的函数
  //useState是React提供的钩子函数，用于声明状态变量和更新函数
  //<Product[]>是状态变量的类型，表示products是一个Product数组
  //[]是初始值，表示products初始值为空数组
  //使用实例：
  //products = []
  //setProducts([...])
  //products = [{id:1,...}]

  localStorage是浏览器提供的Web Storage API
  用于在浏览器中存储数据
  类似于一个简单的数据库，可以将数据保存在用户的浏览器中

  setProducts(JSON.parse(savedProducts))
  //localStorage只能存储字符串
  //JSON.parse将JSON字符串解析为JavaScript对象/数组

  


