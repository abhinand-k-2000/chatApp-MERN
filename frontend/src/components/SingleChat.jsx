import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import {
  Box,
  Flex,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import { API_URL } from "../utils/constants";
import "./style.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import animationData from "../animation/typing.json";
import Lottie from "react-lottie";

const ENDPOINT = "http://localhost:3001";
let socket, selectedChatCompare;

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();

  const [socketConnected, setSocketConnected] = useState(false);

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        API_URL + `/message/${selectedChat._id}`,
        config
      );
      console.log("data fetched: ", data);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error occured!",
        description: "Failed to send the message",
        status: "error",
        duration: 3000,
      });
    }
  };

  console.log("messages: ", messages);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    socket.on("message recieved", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        //give ontification
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
        // setMessages([...messages, newMessageRecieved])
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // useEffect(() => {
  //   socket.on("message recieved" ,(newMessageRecieved) => {
  //     if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
  //       //give ontification
  //     }else {
  //       setMessages([...messages, newMessageRecieved])
  //     }
  //   })
  // }, [])

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");

        const { data } = await axios.post(
          API_URL + "/message",
          { content: newMessage, chatId: selectedChat._id },
          config
        );

        console.log("data: ", data);

        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]);

        // setMessages([...messages, data]);

        // setNewMessage("");
        // fetchMessages()
      } catch (error) {
        console.log(error);
        toast({
          title: "Error occured!",
          description: "Failed to send the message",
          status: "error",
          duration: 3000,
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    //Typing indicator logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 2000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb="4"
            px="2"
            width="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p="3"
            bg="#E8E8E8"
            width="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="lg"
                w="20"
                h="20"
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

<FormControl onKeyDown={sendMessage} isRequired mt="3">
  <VStack spacing={2} > 
    {isTyping && (
      <Box height="3rem" mr='auto'  width="10rem">
        <Lottie options={defaultOptions} height="2rem" width="7rem"/>
      </Box>
    )}
    <Input
      placeholder="Enter a message"
      bg="#E0E0E0"
      variant="filled"
      onChange={typingHandler}
      value={newMessage}
    />
  </VStack>
</FormControl>

          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent={"center"}
          h="100%"
        >
          <Text fontSize="lg" pb="4" as="cite">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
