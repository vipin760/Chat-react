import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Text,
  Spinner 
} from "@chakra-ui/react";
import "./Login.css";
import { USER_API_URI } from "../../../api";
import { useNavigate } from "react-router-dom"
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors,setErrors] = useState({})
  const [showPassword,setShowPassword]=useState(false)
  const [ loading ,setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange=(e)=>{
    const { name,value } = e.target
    setFormData({
      ...formData,[name]:value
    })
  }

  const handleSubmit=async(e)=>{
    const emailRegex = /^[^\s@+-.]+@[^\s@]+\.[^\s@]+$/;
    e.preventDefault()
    const validationErrors = {}
    if(!formData.email.trim()){
      validationErrors.email="please enter email"
    }else if(!emailRegex.test(formData.email)){
      validationErrors.email="please enter valid email"
    }
    if(!formData.email.trim()){
      validationErrors.password="please enter password"
    }
    setErrors(validationErrors)
    if(Object.keys(validationErrors).length===0){
      setLoading(true)
      await axios.post(`${USER_API_URI}/user/login`,formData).then((res)=>{
        setLoading(false)
        toast.success(res.data.message)
        localStorage.setItem('token',JSON.stringify(res.data.data))
        navigate("/chat")
      }).catch((error)=>{
        setLoading(false)
        toast.error(error.response.data.message)
      })
    }
  }

 const handleClick =()=>{
  setShowPassword(!showPassword)
 }

  return (
    <VStack>
      <form onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input placeholder="email" id="login_email" name="email" onChange={handleChange}/>
        {
          errors.email&&(<>
          <Text color={'red'}>*{errors.email}</Text>
          </>)
        }
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input placeholder="password" type={showPassword?"text":"password"} id="login_password" name="password" onChange={handleChange}/>
        <InputRightElement paddingRight={"0.1rem"} width={"fit-content"}><Button size={"sm"} onClick={handleClick}>show</Button></InputRightElement>
        </InputGroup>
        {
          errors.password&&(<>
          <Text color={'red'}>*{errors.password}</Text>
          </>)
        }
      </FormControl>
      <Button type="submit" marginTop={"1rem"} padding={"0.3rem"} bg={"blue.500"} color={"white"} >
      {
        loading?(<Spinner color='red.500' />):(<p>Login</p>)
      }
      </Button>
      </form>
    </VStack>
  );
};

export default Login;
