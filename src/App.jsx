import { useState } from 'react'
import SlalomTrainer from './components/SlalomTrainer'
import Slalom3DPOC from './components/Slalom3DPOC'

function App() {
  const [view, setView] = useState('2d')

  if (view === '3d') {
    return <Slalom3DPOC onBack={() => setView('2d')} />
  }

  return (
    <div className="relative">
      <SlalomTrainer />
      
      {/* 3D POC Toggle Button */}
      <button 
        onClick={() => setView('3d')}
        className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm transition-all hover:scale-105 z-50"
      >
        🚀 Try 3D POC
      </button>
    </div>
  )
}

export default App
