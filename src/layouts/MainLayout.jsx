import { Outlet } from 'react-router-dom'

import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'

function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1">

        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default MainLayout