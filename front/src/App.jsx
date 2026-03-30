import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login'

import HomeUser from './pages/user/home'
import PaymentsUser from './pages/user/payments'
import ContractUser from './pages/user/contracts'
import PropertiesUser from './pages/user/properties'

import Admin from './pages/admin'
import PaymentsAdmin from './pages/admin/payments'
import ContractsAdmin from './pages/admin/contracts'
import Properties from './pages/admin/properties'

import Register from './pages/register'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />

        <Route path='/user/home' element={<HomeUser />} />
        <Route path='/user/payments' element={<PaymentsUser />} />
        <Route path='/user/contracts' element={<ContractUser />} />
        <Route path='/user/properties' element={<PropertiesUser />} />
        
        <Route path='/admin' element={<Admin />} />
        <Route path='/admin/home' element={<Admin />} />
        <Route path='/admin/payments' element={<PaymentsAdmin />} />
        <Route path='/admin/contracts' element={<ContractsAdmin />} />
        <Route path='/admin/properties' element={<Properties />} />

        <Route path='/register' element={<Register />} />

      </Routes>
    </Router>
  )
}