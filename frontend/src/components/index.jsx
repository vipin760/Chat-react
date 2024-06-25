import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
const Header = lazy(()=>import("./partials/Header/Header"))
const Footer = lazy(()=>import("./partials/Footer/Footer"))
const Chat = lazy(()=>import("./pages/Chat/Chat"))

const index = () => {
  return (
    <div>
        {/* <Header/> */}
     <Routes>
     <Route path='/chat' element={<Chat/>}/>
     </Routes>
      {/* <Footer/> */}
    </div>
  )
}

export default index
