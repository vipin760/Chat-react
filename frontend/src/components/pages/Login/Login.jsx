import React from 'react'
import "./Login.css"
const Login = () => {
  return (
    <div className='login_page'>
       <form action="">
        <h2>Login Here</h2>
        <hr />
        <div className='input_box'>
          <label htmlFor="">Email:</label>
          <input type="text" />
        </div>
        <div className='input_box'>
          <label htmlFor="">Passwod:</label>
          <input type="text" />
        </div>
        <div className='input_box'>
          <button>Login</button>
        </div>
       </form>
    </div>
  )
}

export default Login
