import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
  Input,
  useToast, 
  Spinner
} from "@chakra-ui/react";
import { ArrowDownIcon, BellIcon, SearchIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/constants";
import ChatLoading from "../ChatLoading";
import UserListItem from "../user/UserListItems";
import axios from  'axios'

const SideDrawer = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast()

  const { user, setSelectedChat, chats, setChats } = ChatState();


  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState()
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)

  const handleSearch = async() => {
    if(!search){
      toast({
        title: 'Please enter something in the search',
        status: 'warning',
        duration: 3000,
        position: "top-left"
      })
      return 
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const {data} = await axios.get(API_URL + `/user?search=${search}`, config)

      console.log("seracahed data: ", data)
      setLoading(false)
      setSearchResult(data)
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast({
        title: 'Error occured!',
        description: "Failed to load the search result",
        status: 'error',
        duration: 3000,
        position: "top-left"
      })
    }
  }

  const accessChat = async (userId) => {
    setLoading(false)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const {data} = await axios.post(API_URL+'/chat', {userId}, config)

      if(!chats.find((c) => c._id === data._id)){
        setChats([data, ...chats])
      }

      setSelectedChat(data);
      setLoadingChat(false);
      onClose()
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error fetching the chat',
        description: error.message,
        status: 'error',
        duration: 3000,
        position: "top-left"
      })
    }
  }



  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  return (
    <>
      <Box
        display={"flex"}
        w={"100%"}
        bg={"white"}
        alignItems={"center"}
        p="5px 10px 5px 10px"
        borderWidth={"5px"}
        justifyContent={"space-between"}
      >
        <Tooltip label="Search Users to chat" hasArrow>
          <Button variant="ghost" onClick={onOpen}>
            <SearchIcon />
            <Text display={{ base: "none", md: "flex" }} ml='4'>Search User</Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl">Talkative</Text>

        <div>
          <Menu>
            <MenuButton>
              <BellIcon fontSize={"2xl"} m="1" /> 
            </MenuButton>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ArrowDownIcon fontSize={"larger"} />}
            >
              <Avatar name={user.name} size={"sm"} cursor="pointer" />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>    
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Type here..."
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} isLoading={loading}>GO</Button>
            </Box>
            {
              loading ? (
                <ChatLoading />
              ) : (
                
                  searchResult?.map(user => (
                    <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)}/>
                  ))
                
              )
            }

            {
              loadingChat && <Spinner ml='auto' display='flex'/>
            }
          </DrawerBody>

          
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
