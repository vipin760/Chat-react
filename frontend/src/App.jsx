import { Route, Routes } from 'react-router-dom'
import { lazy } from 'react'
import "./App.css"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const Login = lazy(()=>import("./components/pages/Login/Login"))
const Register = lazy(()=>import("./components/pages/Register/Register"))
const Home = lazy(()=>import("./components/pages/Home/Home"))
const UserRoute = lazy(()=>import("./components/index"))

function App() {
  return (
    <div className='App'>
      <ToastContainer/>
    <Routes>
    <Route path='/home' element={<Home/>} />
    <Route path={`/*`} element={<UserRoute/>} />
    </Routes>
    </div>
  )
}

export default App
