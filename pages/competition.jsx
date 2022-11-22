import React from "react";
import { getFirestore, collection, addDoc, doc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  Box,
  Container,
  Flex,
  Radio,
  RadioGroup,
  Stack,
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

// const addVote  = async (vote, teamA, teamB) => {
//   await addDoc(doc(db, collectionRef, authData.currentUser.uid ), {
//     result: vote,
//     teamA,
//     teamB
//   })
// }

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
              <RadioGroup id={doc.id}>
                <Stack direction="row">
                  <Radio value={doc.data.teamA}>{doc.data.teamA}</Radio>
                  <Radio value="Nereseno">Nerešeno</Radio>
                  <Radio value={doc.data.teamB}>{doc.data.teamB}</Radio>
                </Stack>
              </RadioGroup>
            </Flex>
          ))}
      </Container>
    </Box>
  );
};

export default Competition;
