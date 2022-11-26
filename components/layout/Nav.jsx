import React from "react";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Box, Container, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

const Nav = () => {
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  return (
    <>
      <Box bg="#550265" color="#fff" as="nav" py="4">
        <Container maxW="container.xl">
          <Flex justifyContent="space-between" alignItems='center'>
            <Box><Link href='/'>FIFA World Cup Competition</Link></Box>
            {user && (
              <Box cursor="pointer" onClick={() => auth.signOut()}>
                Izloguj se
              </Box>
            )}
          </Flex>
        </Container>
      </Box>
      <Link href="/sponsor">
        <Flex
          p="1"
          bg="purple.100"
          alignItems="center"
          justifyContent="center"
          flexDir={{ base: "column", md: "row" }}
        >
          <Box
            textAlign="center"
            mr="2"
            mb={{ base: "2", md: "0" }}
            fontSize='xs'
          >
            Sponzor takmičenja:{" "}
            <Text as="span" fontWeight="bold" color="yellow.600">
              {" "}
              Save The Bees - Sačuvajmo Pčele
            </Text>
          </Box>
          <Image
            alt="logo"
            width="25"
            height="25"
            src="https://yt3.ggpht.com/zqQoHRBoNQN8S2Rpotuqj3hihtKMYz0rsGozNXkNXhMkXpRXTbmj4xF31UraCMi_jca0bHYJ=s88-c-k-c0x00ffffff-no-rj"
          />
        </Flex>
      </Link>
    </>
  );
};

export default Nav;
