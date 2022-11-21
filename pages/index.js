import Head from "next/head";
import Nav from "../components/layout/Nav";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Box, Container, Flex, Grid, Heading } from "@chakra-ui/react";
import { initFirebase } from "../firebase/clientApp";
import { Login } from "../components/auth/Login";

export default function Home({ scoreResults = [] }) {
  initFirebase();
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const { displayName = "" } = { ...user };

  return (
    <Box bg="#EEEEE4">
      <Head>
        <title>FIFA World Cup 2022 Competition</title>
        <meta name="description" content="FIFA World Cup Quatar competition" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      {loading && <Box textAlign="center">Učitavanje...</Box>}
      {error && (
        <Box textAlign="center">Desila se greška. Pokušajte kasnije.</Box>
      )}
      {!user && <Login />}
      {user && (
        <Container maxW='container.lg'>
          <Heading mt="5" textAlign="center" as="h1">
            Dobro Došli!
          </Heading>
          {displayName && (
            <Box textAlign="center">{displayName || "Korisniče"}</Box>
          )}
          <Grid gridTemplateColumns='repeat(2, 1fr)' justifyContent='space-between' gap='6' mt='5'>
            {scoreResults?.length > 0 &&
              scoreResults?.map((sc) => (
                <Box
                  key={sc.IdMatch}
                  mb="4"
                  borderRadius="lg"
                  bg="#fff"
                  p="4"
                >
                  <Box fontWeight="bold">
                    {new Date(sc.LocalDate).toLocaleDateString("de-DE")}
                  </Box>
                  <Box>
                    <Flex justifyContent="space-between">
                      <Box>{sc?.Home?.Abbreviation}</Box>
                      <Box>{sc?.Home?.Score}</Box>
                    </Flex>
                    <Flex justifyContent="space-between">
                      <Box>{sc?.Away?.Abbreviation}</Box>
                      <Box>{sc?.Away?.Score}</Box>
                    </Flex>
                  </Box>
                </Box>
              ))}
          </Grid>
        </Container>
      )}
    </Box>
  );
}

export const getServerSideProps = async () => {
  const res = await fetch(
    "https://api.fifa.com/api/v3/calendar/matches?language=en&count=500&idSeason=255711"
  );
  const scores = await res.json();

  return {
    props: {
      scoreResults: scores.Results,
    },
  };
};
