import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { API_URL } from '../utils/constants'
import { AddIcon } from '@chakra-ui/icons'
import {getSender} from '../config/ChatLogic'    
import GroupChatModal from './miscellaneous/GroupChatModal'

const MyChat = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState()    
  
  const {selectedChat, setSelectedChat, user, chats, setChats} = ChatState()

  console.log("Chats: ", chats)

  const toast = useToast()

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const {data} = await axios.get(API_URL+'/chat', config)
      console.log('charssss: ', data)
      setChats(data)
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error Loading the chat',
        description: error.message,
        status: 'error',
        duration: 3000,
        position: "top-left"
      })
    }
  }

  useEffect(()=> {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats()
  }, [fetchAgain])


  return (
    <Box
    display={{base: selectedChat ? "none" : "flex", md: "flex"}}
    flexDir="column"
    alignItems="center"
    p='3'
    bg='white'
    w={{base: '100%', md: '30%'}}
    borderRadius='lg'
    borderWidth='1px'
    >
      <Box
      pb='3' px='3' fontSize={{base: '28px', md: '30px'}}
      display='flex' w='100%' justifyContent='space-between' alignItems='center'
      >
        My Chats
        <GroupChatModal>   
        <Button
        display='flex' fontSize={{base: '17px', md: '10px', lg: '17px'}}
        rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
        </GroupChatModal>
      </Box>

      <Box
      display='flex' flexDir='column' p='3' bg='#F8F8F8' w='100%' h='100%'
      borderRadius='lg' overflow='hidden'
      >
        {
          chats ? (
            <Stack overflowY = 'scroll'>
              {chats.map((chat) => (
                <Box
                onClick={() => setSelectedChat(chat)}
                cursor='pointer'
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3} py={2}
                borderRadius='lg' key={chat._id}
                >

                  <Text>
                    {!chat.isGroupChat ? (getSender(loggedUser, chat.users)) : (chat.chatName)}
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )
        }
      </Box>

    </Box>
  )
}

export default MyChat