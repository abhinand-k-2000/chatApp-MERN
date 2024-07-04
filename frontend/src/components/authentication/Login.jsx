import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { API_URL } from '../../utils/constants'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'


const Login = () => {
  const [show, setShow] = useState(false)
  const {register, handleSubmit, formState:{errors}} = useForm()
  const [laoding, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()


  const onsubmit = async (data) => {     
    setLoading(true)
    console.log(data)
    const {email, password} = data

    try {
      const config = {
        headers: {
          'Content-type': "application/json"
        }
      }
      console.log(API_URL + '/user/login')
      const {data} = await axios.post(API_URL + '/user/login', {email, password}, config)
      toast({
        title: "Logged In",
          status: 'success',
          duration: 9000,
          isClosable: true,
      })
      console.log(data)
      localStorage.setItem("userInfo", JSON.stringify(data))
      setLoading(false)
      navigate('/chats')
    } catch (error) {
      console.log(error)
      toast({
        title: "Login Failed",
          status: 'error',
          duration: 9000,
          isClosable: true,
      })

    }

  }
  return (
    <div>
      <form onSubmit={handleSubmit(onsubmit)}>
      <FormControl >  

<FormLabel>Email</FormLabel>
<Input placeholder="Email" {...register("email", {required: "Email is required"})}/> 
{errors.email && <Text fontSize='smaller' m='1' color='red'>{errors.email.message}</Text>}
<FormLabel mt='2'>Password</FormLabel>
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
{errors.password && <Text fontSize='smaller' m='1' color='red'>{errors.password.message}</Text>}
<Button

  mt={4}
  colorScheme="teal"
  width="100%"
  // isLoading={true}
  type="submit"
>
  Login
</Button>
</FormControl>
      </form>
    </div>
  )
}

export default Login