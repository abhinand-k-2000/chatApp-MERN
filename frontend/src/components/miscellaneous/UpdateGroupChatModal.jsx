import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useDisclosure,
  Button,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  useToast,
  Spinner
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../user/UserBadgeItem";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import UserListItem from "../user/UserListItems";

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast()

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRename = async () => {
    if (!groupChatName) return;
    setRenameLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        API_URL + "/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setRenameLoading(false)


    } catch (error) {
      console.log(error);
      toast({
        title: "Error occured",
        description: error.response.data.message,
        status: 'error',
        duration: 3000
      })
      setRenameLoading(false)

      setGroupChatName("")
      
    }
  };

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

  const handleAddUser = async (user1) => {

    if(selectedChat.users.find((u) => u._id === user1._id)) {
        toast({
            title: "User already in group",
            status: 'error',
            duration: 3000,
            isClosable: true
        })
        return 
    }
    if(selectedChat.groupAdmin !== user1._id) {
        toast({
            title: "Only admins can add someone",
            status: 'error',
            duration: 3000,
            isClosable: true
        })
        return 
    }

    try {
        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }

        const {data} = await axios.put(API_URL + `/chat/groupadd`,{chatId: selectedChat._id, userId: user1._id}, config)
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false)

    } catch (error) {
        console.log(error)
        toast({
            title: "Error Occured",
            status: 'error',
            duration: 3000,
            isClosable: true
        })
    }
  };



  const handleRemove = async (user1) => {

    console.log('sdjfJ: ', selectedChat.groupAdmin )

    console.log('user1: ', user1 )
    
    
    if(selectedChat.groupAdmin !== user._id && user1._id !== user._id) {
        toast({
            title: "Only admins can add someone",
            status: 'error',
            duration: 3000,
            isClosable: true
        })
        return 
    }

    try {
        setLoading(true);

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }

        const {data} = await axios.put(API_URL + `/chat/groupremove`,{chatId: selectedChat._id, userId: user1._id}, config)

        user1._id === user._id ? setSelectedChat() : setSelectedChat(data)

        setFetchAgain(!fetchAgain);
        fetchMessages()
        setLoading(false)

    } catch (error) {
        console.log(error)
        toast({
            title: "Error Occured",
            status: 'error',
            duration: 3000,
            isClosable: true
        })
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="xx-large"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb="3">
              {selectedChat.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemove(user)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb="3"
                mr="3"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button variant="solid" onClick={handleRename}>
                Update
              </Button>
            </FormControl>

            <FormControl display="flex" flexDir='column'>
              <Input
                placeholder="Add users"
                mb="3"
                mr="3"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Box>
              {
                loading ? (<Spinner size={'lg'} />) : (
                    searchResult?.map(user => (
                        <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)}/>
                    ))
                )
              }
              </Box>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={()=>handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
