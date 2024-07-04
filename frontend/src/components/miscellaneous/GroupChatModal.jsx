import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    useToast,
    FormLabel,
    FormControl,
    Input,
    Box,
  } from '@chakra-ui/react'
import { ChatState } from '../../context/ChatProvider'
import axios from 'axios'
import { API_URL } from '../../utils/constants'
import UserListItem from '../user/UserListItems'
import UserBadgeItem from '../user/UserBadgeItem'

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch ] = useState('');
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const {user, chats, setChats} = ChatState()


    const toast = useToast()

    const handleSearch = async (query) => {
        setSearch(query)
        if(!query) return

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.get(API_URL + `/user?search=${search}`, config)
            console.log(data)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            console.log(error)
            toast({
                title: "Error Occured!",
                duration : 3000,
                position: 'top-left'
            })
        }
    }

    const handleSubmit = async () => {
        if(!groupChatName || !selectedUsers){
            toast({
                title: "Fill the fields",
                status: "warning",
                duration: 3000,
                position: 'top-left'
            })
            return;
        }

        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`
                }
              }

              const {data} = await axios.post(API_URL + `/chat/group`, {name: groupChatName, users: JSON.stringify(selectedUsers.map(u => u._id))}, config)

              setChats([data, ...chats])
              onClose()

              toast({
                title: "New group chat created",
                status: "success",
                duration: 3000,
                position: 'top-left'
            })
         } catch (error) {
            console.log(error)
            toast({
                title: "Error in creating group ",
                status: "error",
                duration: 3000,
                position: 'top-left'
            })
        }
    }

    const handleGroup =(userToAdd) => {
        console.log("handle grou called", selectedUsers)

        if(selectedUsers?.includes(userToAdd)){
            toast({
                title: "User already added",
                status: "warning",
                duration: 3000,
                position: 'top-left'
            })
            return 
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }

    const handleDelete= (deletedUser) => {
        setSelectedUsers(selectedUsers.filter((user) => user._id !== deletedUser._id))
    }



  return (
    <>  
    <span onClick={onOpen}>{children}</span>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize='2xl' display='flex' justifyContent='center' p='5'>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDir='column' alignItems='center' >

          <FormControl >  
  <FormLabel>Group Name</FormLabel>
  <Input type='text' onChange={(e) => setGroupChatName(e.target.value)}/>

  <FormLabel mt='5'>Add Users</FormLabel>
  <Input type='text' onChange={(e) => handleSearch(e.target.value)}/>
</FormControl>

<Box display='flex' mt='3'>
{
    selectedUsers?.map(user => (
        <UserBadgeItem key={user._id} user={user} handleFunction= {() => handleDelete(user)}/>
    ))
}

</Box>
{
    loading ? (<div>loading...</div>) : (
        searchResult?.slice(0, 4).map(user => (
            <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)}/>
        ))
    )
}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>    
    </>
  )
}

export default GroupChatModal