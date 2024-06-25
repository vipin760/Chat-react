import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { USER_API_URI } from "../../../api";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    url:""
  });
  const [showCPassword, setShowCPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [pic, setPic] = useState("");

  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("")

  const navigate = useNavigate();

  const handleShow = (value) => {
    if (value === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowCPassword(!showCPassword);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!formData.name.trim()) {
      validationErrors.name = "name field required";
    }
    if (!formData.email.trim()) {
      validationErrors.email = "email field required";
    }
    if (!formData.password.trim()) {
      validationErrors.password = "password field required";
    }
    if (!formData.cpassword.trim()) {
      validationErrors.cpassword = "confirm password field required";
    } else if (formData.password !== formData.cpassword) {
      validationErrors.cpassword =
        "confirm password and password is doesn't match";
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      formData.url=url;
      await axios
        .post(`${USER_API_URI}/user/register`, formData)
        .then((res) => {
          setLoading(false);
          toast.success(res.data.message);
          navigate("/login");
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data.message);
        });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "ChatApp");
      data.append("cloud_name", "dgyliicre");
      
      try {
        setLoading(true);
        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/dgyliicre/image/upload',
          data
        );
        setLoading(false);
        const cloudData = res.data;
        setUrl(cloudData.url);
        setPic(cloudData.secure_url);
      } catch (error) {
        setLoading(false);
        toast.error("Image upload failed. Please try again.");
      }
    }
  };
  return (
    <VStack>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            placeholder="Enter Your Name"
            id="name"
            name="name"
            onChange={handleChange}
          />
          {errors.name && (
            <>
              <Text fontSize={".9rem"} color={"red"}>
                *{errors.name}
              </Text>
            </>
          )}

          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter Your Name"
            id="email"
            name="email"
            onChange={handleChange}
          />
          {errors.email && (
            <>
              <Text fontSize={".9rem"} color={"red"}>
                *{errors.email}
              </Text>
            </>
          )}
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              id="password"
              name="password"
              onChange={handleChange}
            />
            <InputRightElement width={"4rem"}>
              <Button
                h={"1.75rem"}
                size={"sm"}
                onClick={() => handleShow("password")}
              >
                show
              </Button>
            </InputRightElement>
          </InputGroup>
          {errors.password && (
            <>
              <Text fontSize={".9rem"} color={"red"}>
                *{errors.password}
              </Text>
            </>
          )}

          <FormLabel>ConfirmPassword</FormLabel>
          <InputGroup>
            <Input
              type={showCPassword ? "text" : "password"}
              placeholder="Enter your password"
              id="cpassword"
              name="cpassword"
              onChange={handleChange}
            />
            <InputRightElement width={"4rem"}>
              <Button
                h={"1.75rem"}
                size={"sm"}
                onClick={() => handleShow("cpassword")}
              >
                show
              </Button>
            </InputRightElement>
          </InputGroup>

          <InputGroup>
            <Input
              type="file"
              marginTop={"2rem"}
              name="file"
              onChange={handleFileUpload}
            />
            {pic && (
              <img
                src={pic}
                width={"150px"}
                height={"150px"}
                alt="Uploaded"
                margintop={"0.5rem"}
              />
            )}
          </InputGroup>

          {errors.cpassword && (
            <>
              <Text fontSize={".9rem"} color={"red"}>
                *{errors.cpassword}
              </Text>
            </>
          )}
          <Button
            type="submit"
            marginTop={"1rem"}
            padding={"0.3rem"}
            bg={"blue.500"}
            color={"white"}
          >
            {loading ? <Spinner color="red.500" /> : <p>Register</p>}
          </Button>
        </FormControl>
      </form>
    </VStack>
  );
};

export default Register;
