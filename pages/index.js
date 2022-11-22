import Head from "next/head";
import Link from "next/link";
import Nav from "../components/layout/Nav";
import { getAuth } from "firebase/auth";
// import { getFirestore, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
// import {useCollection } from "react-firebase-hooks/firestore"
import { Box, Button, Container, Flex, Grid, Heading } from "@chakra-ui/react";
import { initFirebase } from "../firebase/clientApp";
import { Login } from "../components/auth/Login";

export default function Home({ scoreResults = [] }) {
  // initFirebase();
  const auth = getAuth();
  // const db = getFirestore();
  // const collectionRef = collection(db, 'matches');
  const [user, loading, error] = useAuthState(auth);
  const { displayName = "" } = { ...user };
  // const [ matches, matchesLoading, matchesError ] = useCollection(collectionRef);
  // console.log(matches, 'matches');

  // const { docs = [] } = matches;
  // console.log(docs, 'matchesData')
  
  return (
    <Box bg="#EEEEE4">
      <Head>
        <title>FIFA World Cup 2022 Competition</title>
        <meta name="description" content="FIFA World Cup Quatar competition" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      {loading && <Box textAlign="center" mt='5'>Učitavanje...</Box>}
      {error && (
        <Box textAlign="center">Desila se greška. Pokušajte kasnije.</Box>
      )}
      {!loading && !user && <Login />}
      {user && (
        <Container maxW='container.lg'>
          <Heading mt="5" textAlign="center" as="h1">
            Dobro Došli!
          </Heading>
          {displayName && (
            <Box textAlign="center">{displayName || "Korisniče"}</Box>
          )}
          <Flex>
            <Link href='/competition'>Sportska Prognoza</Link>
          </Flex>
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
                  <Box fontWeight="bold" mb='3'>
                    {new Date(sc?.LocalDate).toLocaleDateString("de-DE")}
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
      scoreResults: scores?.Results,
    },
  };
};
