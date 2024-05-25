import { Route, Routes } from 'react-router-dom'
import { lazy } from 'react'
import "./App.css"
import Header from './components/partials/Header/Header'
import Footer from './components/partials/Footer/Footer'
const Chat = lazy(()=>import("./components/pages/Chat/Chat"))
const Login = lazy(()=>import("./components/pages/Login/Login"))
const Register = lazy(()=>import("./components/pages/Register/Register"))

function App() {
  return (
    <>
    <Header/>
    <Routes>
    <Route path='/' element={<Chat/>} />
    <Route path='/home' element={<Chat/>} />
    <Route path='/login' element={<Login/>} />
    <Route path='/register' element={<Register/>} />
    </Routes>
    <Footer/>
    </>
  )
}

export default App
