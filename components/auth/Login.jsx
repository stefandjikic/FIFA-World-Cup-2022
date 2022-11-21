import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";

export const Login = () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const signIn = async () => {
    await signInWithPopup(auth, provider).then(() => {
      console.log('success');
    }).catch((err) => {
      console.log('err', err)
    })
  };

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <Box maxW="340px" mt='5' textAlign='center'>
        <Heading mb='4'>FIFA World Cup 2022 Competition</Heading>
        <Button onClick={signIn}>Uloguj se</Button>
      </Box>
    </Flex>
  );
};
