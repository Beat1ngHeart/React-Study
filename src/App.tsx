import viteLogo from '/juice.jpg'
import './App.css'
import ImageUploader from './components/ImageUploader.tsx'

function App() {
  return (
    <>
      <div>
        <a >
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <div className="card">
        <h1>交易</h1>
      </div>
      <ImageUploader />
    </>
  )
}

export default App
