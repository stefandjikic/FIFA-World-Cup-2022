import React from "react";
import { getFirestore, collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  Box,
  Container,
  Flex,
} from "@chakra-ui/react";
import Nav from "../components/layout/Nav";
import { getAuth } from "firebase/auth";

const Competition = () => {
  const db = getFirestore();
  const collectionRef = collection(db, "matches");
  const authData = getAuth();
  console.log(authData, 'authdata');

  const [matchesData, matchesLoading, matchesError] =
    useCollection(collectionRef);
  const matches = matchesData?.docs.map((doc) => ({
    data: doc.data(),
    id: doc.id,
  }));

  return (
    <Box bg="#EEEEE4">
      <Nav />
      <Container maxW="container.lg">
        {matchesLoading && <Box>Učitava se...</Box>}
        {matchesError && <Box>Došlo je do grešeke. Pokušajte kasnije.</Box>}
        {!matchesLoading &&
          matches?.length > 0 &&
          matches?.map((doc) => (
            <Flex key={doc.id} justifyContent='space-between' mt="5" bg="#fff" p="4" borderRadius="lg">
              <Flex>
                <Box>{doc.data.teamA}</Box>
                <Box>-</Box>
                <Box>{doc.data.teamB}</Box>
              </Flex>
              <Box>{doc?.data?.voterName}</Box>
              <Box>{doc?.data?.final}</Box>
            </Flex>
          ))}
      </Container>
    </Box>
  );
};

export default Competition;
