import React, { useContext, useEffect, useState } from 'react'
import axios from "axios";
import ChatProvider, { ChatState } from '../context/ChatProvider';
import { Box } from '@chakra-ui/react';
import MyChat from '../components/MyChat';
import ChatBox from '../components/ChatBox';
import SideDrawer from '../components/miscellaneous/SideDrawer';


const Chat = () => {

  const {user} = ChatState()
  const [fetchAgain, setFetchAgain] = useState(false)

  
  
  
  
  useEffect(() => {
  }, [user]);
  
  
  if (!user) return <div>Loading...</div>;

  return (     
    <div style={{width: '100%'}}>
      {user && <SideDrawer/>}
      <Box display='flex' justifyContent='space-between' w='100%' h='91.5vh' p='10px'>
        {user && <MyChat fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/> }
      </Box>
    </div>
  )
}

export default Chat