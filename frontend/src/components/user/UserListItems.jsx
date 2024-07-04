import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  console.log("handle funtion; ", handleFunction)
  return (
    <Box
      display={"flex"}
      mt="3"
      alignItems={"center"}
      cursor="pointer"
      _hover={{background: '#38B2AC', color: "white"}}
      px='3'
      py='2'
      rounded="lg"
      onClick={handleFunction}
    >
      <Avatar name={user.name} />
      <Box>
        <Text ml="5">{user.name}</Text>
        <Text ml="5">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
