// import Versions from './components/Versions'
// import electronLogo from './assets/electron.svg'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './UserComponents/Dashboard'
import Admin from './AdminComponents/Admin'
import User from './UserComponents/AddProduct'
import Login from './components/Login'
import AdminDashboardLayout from './AdminComponents/AdminDashboardLayout'
import ProtectedRoute from '../../renderer/src/routes/ProtectedRoute'
import Stock from './UserComponents/AddProduct'
import UserDashboardLayout from './UserComponents/UserDashboardLayout'
import AddOrders from './UserComponents/AddOrders'
import ManageUser from './AdminComponents/ManageUsers'



function App() {
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
      <Routes>
        <Route path="/" element={<Login/>} />

        {/* Admin Protected Route */}
        <Route
          path="/adminDashboardLayout"
          element={
            <ProtectedRoute role={['admin']}>
              <AdminDashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* child components of Admin Dashboard */}
          <Route index element={<Admin />} />
          <Route path='manageUser' element={<ManageUser />} />
        </Route>

        {/* User Protected Route/ */}
        <Route
          path="userDashboardLayout"
          element={
            <ProtectedRoute role={['user', 'admin']}>
              <UserDashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Childs components of User Dashboard */}
          <Route index element={<User/>}/>
          <Route path='dashboard' element={<Dashboard/>}/>
          <Route path='addOrder' element={<AddOrders/>}/>
          <Route path='stock' element={<Stock/>}/>
        </Route>
      </Routes>
  )
}

export default App
