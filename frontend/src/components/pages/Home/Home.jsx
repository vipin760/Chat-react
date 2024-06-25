import React from 'react'
import { Container,Box, Text, Button, TabList,Tab, TabPanels,TabPanel,Tabs } from "@chakra-ui/react"
import Login from '../Login/Login';
import Register from '../Register/Register';

const Home = () => {
  return (
    <Container maxW="xl" marginTop="4rem" centerContent >
        <Box d="flex" justifyContent="center" p={3} bg="#FEEBC8" w="100%" m="40px 0 45x 10px" borderRadius={'lg'} borderWidth={'5px'} marginTop={"1%"}>
        <Text textAlign={"center"} fontSize={"4xl"}>FreeChat</Text>
        </Box>
        <Box bg="white" w="100%" p={4} borderRadius={"lg"} borderWidth={"1px"} margin={"5px"} color={"black"} >
        <Tabs isFitted variant='enclosed'>
  <TabList mb='1em' >
    <Tab>Login</Tab>
    <Tab>Signup</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
     <Register/>
    </TabPanel>
  </TabPanels>
</Tabs>
        </Box>
    </Container>
  )
}

export default Home
