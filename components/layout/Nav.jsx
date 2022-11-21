import React from "react";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Box, Container, Flex } from "@chakra-ui/react";

const Nav = () => {
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  return (
    <Box bg="#550265" color="#fff" as="nav" py="4">
      <Container maxW="container.xl">
        <Flex justifyContent="space-between">
          <Box>FIFA World Cup Competition</Box>
          {user && (
            <Box cursor="pointer" onClick={() => auth.signOut()}>
              Izloguj se
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default Nav;
