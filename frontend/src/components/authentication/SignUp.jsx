import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { API_URL } from "../../utils/constants";
import {useNavigate} from 'react-router-dom'

const SignUp = () => {
  const { register, handleSubmit, formState: {errors} } = useForm();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const onSubmit = async(data) => {
   
    console.log(data)
    setLoading(true)
    const {name, email, password} = data
    if(!name || !email || !password) {
      toast({
        description: "Enter all fields",
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      return 
    }

    try {
      const config = {
        headers: {
          'Content-type': "application/json"
        }
      }
      const {data} = await axios.post(API_URL + '/user', {name, email, password}, config)
      toast({
        title: "Account Created",
        description: "We've created your account for you.",
          status: 'success',
          duration: 9000,
          isClosable: true,
      })
      console.log(data)
      localStorage.setItem("userInfo", JSON.stringify(data))
      setLoading(false)
      navigate('/chats')

    } catch (error) {
      setLoading(false)
      console.log(error)
      toast({
        title: "Something went wrong",
        // description: "We've created your account for you.",
          status: 'error',
          duration: 9000,
          isClosable: true,
      })
    }

  }
  return (
    <div>

      <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl  >
        <FormLabel>Full name <span style={{color: 'red'}}>*</span></FormLabel>
        <Input placeholder="Full name" {...register("name", {required: "Full name is required"})}/>
        {errors.name && <Text fontSize='small' color='red' m='1'>{errors.name.message}</Text>}

        <FormLabel mt='2'>Email <span style={{color: 'red'}}>*</span></FormLabel>
        <Input placeholder="Email" {...register("email", {required: "Email is required"})}/>
        {errors.email && <Text fontSize='small' color='red' m='1'>{errors.email.message}</Text>}
        <FormLabel mt='2'>Password <span style={{color: 'red'}}>*</span></FormLabel>
        <InputGroup>
          <Input placeholder="Password" type={show ? 'text' : 'password'} {...register("password", {required: "Password is required"})}/>
          <InputRightElement>
            <Button
              h="1.75rem"
              width='4.5rem'
              mr='2'
              bg='transparent'
              _hover={{ bg: 'transparent' }}
              size="sm"
              onClick={() => setShow(!show)}
              // colorScheme="teal"
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        {errors.password && <Text fontSize='small' color='red' m='1'>{errors.password.message}</Text>}

        <Button
          mt={4}
          colorScheme="teal"
          width="100%"
          type="submit"
          isLoading={loading}
        >
          Submit
        </Button>
      </FormControl>
      </form>
    </div>
  );
};

export default SignUp;
