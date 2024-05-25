import React from 'react'
import "./Login.css"
const Login = () => {
  return (
    <div className='login_page'>
        <form action="" className='form'>
        <h2>Login Here...</h2>  
          <div className='box'>
            <label htmlFor="">name</label>
            <input type="text" name='name' placeholder='name' />
          </div>
          <div className='box'>
            <label htmlFor="">name</label>
            <input type="text" name='name' placeholder='name' />
          </div>
          <button>Login</button>
        </form>
    </div>
  )
}

export default Login
