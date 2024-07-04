import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({handleFunction, user}) => {
  return (
    <Box px='2' display='flex' alignItems='center' justifyContent='space-between' bg="#a892c7" py='1' borderRadius='lg' m='1' variant='solid' fontSize='12' cursor='pointer' onClick={handleFunction}>  
    {
        user.name
    }

    <CloseIcon ml='4'/>
    </Box>
  )
}

export default UserBadgeItem   