import Head from "next/head";
import Link from "next/link";
import Nav from "../components/layout/Nav";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  // setDoc,
  // doc,
  addDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { Login } from "../components/auth/Login";
import { useState } from "react";

export default function Home({ scoreResults = [] }) {
  const [activeMatch, setActiveMatch] = useState({});
  const auth = getAuth();
  const db = getFirestore();
  const collectionRef = collection(db, "matches");
  const [user, loading, error] = useAuthState(auth);
  const { displayName = "" } = { ...user };
  const [matches, matchesLoading, matchesError] = useCollection(collectionRef);
  const matchesFromFirebaseCollection = matches?.docs.map((doc) => ({
    data: doc.data(),
    id: doc.id,
  }));


  // console.log(scoreResults, "scoreResults");
  console.log(user?.uid, "user.uid");

  const handleChange = (idMatch, teamA, teamB, final, voterID, voterName) => {
    setActiveMatch({ idMatch, teamA, teamB, final, voterID, voterName });
    // console.log({idMatch, teamA, teamB, final})
  };

  const addVote = async () => {
    console.log(activeMatch, "activeMatch");
    await addDoc(collection(db, "matches"), activeMatch);
    console.log(matchesFromFirebaseCollection, "matchesFromFirebaseCollection");
  };

  return (
    <Box bg="#EEEEE4">
      <Head>
        <title>FIFA World Cup 2022 Competition</title>
        <meta name="description" content="FIFA World Cup Quatar competition" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      {loading ||
        (matchesLoading && (
          <Box textAlign="center" mt="5">
            Učitavanje...
          </Box>
        ))}
      {error && (
        <Box textAlign="center">Desila se greška. Pokušajte kasnije.</Box>
      )}
      {!loading && !user && <Login />}
      {user && matches && (
        <Container maxW="container.lg">
          <Heading mt="5" textAlign="center" as="h1">
            Dobro Došli!
          </Heading>
          {displayName && (
            <Box textAlign="center">{displayName || "Korisniče"}</Box>
          )}
          <Flex>
            <Link href="/competition">Sportska Prognoza</Link>
          </Flex>
          <Grid
            gridTemplateColumns="repeat(2, 1fr)"
            justifyContent="space-between"
            gap="6"
            mt="5"
          >
            {scoreResults?.length > 0 &&
              scoreResults?.map((sc) => (
                <Box key={sc.IdMatch} mb="4" borderRadius="lg" bg="#fff" p="4">
                  <Box fontWeight="bold" mb="3">
                    {new Date(sc?.LocalDate).toLocaleString("de-DE", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
                  <RadioGroup
                    onChange={(value) =>
                      handleChange(
                        sc?.IdMatch,
                        sc?.Home?.ShortClubName,
                        sc?.Away?.ShortClubName,
                        value,
                        user?.uid,
                        user?.displayName
                      )
                    }
                    isDisabled={
                      matchesFromFirebaseCollection
                        ?.find((m) => m?.data?.idMatch === sc?.IdMatch && m?.data?.voterID === user?.uid)
                    }
                    //  value={matchesFromFirebaseCollection?.find((m) => m?.data?.IdMatch === sc?.idMatch).data.final || ''}
                  >
                    <Flex
                      mt="5"
                      flexDirection="row"
                      justifyContent="space-between"
                    >
                      <Radio value={sc?.Home?.ShortClubName}>
                        {sc?.Home?.ShortClubName}
                      </Radio>
                      <Radio value="Nereseno">Nerešeno</Radio>
                      <Radio value={sc?.Away?.ShortClubName}>
                        {sc?.Away?.ShortClubName}
                      </Radio>
                      <Button
                        disabled={
                          matchesFromFirebaseCollection
                        ?.find((m) => m?.data?.idMatch === sc?.IdMatch && m?.data?.voterID === user?.uid)
                        }
                        onClick={addVote}
                        borderRadius="2xl"
                        size="sm"
                      >
                        Glasaj
                      </Button>
                    </Flex>
                  </RadioGroup>
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
