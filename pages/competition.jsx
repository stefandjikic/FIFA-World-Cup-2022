import React, { useMemo } from "react";
import { getFirestore, collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  Box,
  Container,
  Flex,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Nav from "../components/layout/Nav";
import { getAuth } from "firebase/auth";
import Link from "next/link";
import { Login } from "../components/auth/Login";
import { useAuthState } from "react-firebase-hooks/auth";

const Competition = ({ scoreResults = [] }) => {
  const db = getFirestore();
  const collectionRef = collection(db, "matches");
  const authData = getAuth();
  // console.log(authData, "authdata");

  const [user] = useAuthState(authData);

  const [matchesData, matchesLoading, matchesError] =
    useCollection(collectionRef);
  const matches = matchesData?.docs.map((doc) => ({
    data: doc.data(),
    id: doc.id,
  }));
  // console.log(matches, "matches");
  // console.log(scoreResults, "scoreResults");

  const calculateResult = (id) => {
    const selectedMatch = scoreResults?.find((sr) => sr?.IdMatch === id);
    if (
      selectedMatch?.Home?.Score !== null &&
      selectedMatch?.Away?.Score !== null
    ) {
      return selectedMatch?.Home?.Score + ":" + selectedMatch.Away?.Score;
    }
  };

  const calculatePlayerPoints = (id, playersAnswer) => {
    const selectedMatch = scoreResults?.find((sr) => sr?.IdMatch === id);
    let matchResult = "";
    if (
      selectedMatch?.Home?.Score === null &&
      selectedMatch?.Home?.Score === null
    ) {
      matchResult = "NOT_PLAYED";
    } else if (selectedMatch?.Home?.Score < selectedMatch.Away?.Score) {
      matchResult = selectedMatch.Away?.ShortClubName;
    } else if (selectedMatch?.Home?.Score > selectedMatch.Away?.Score) {
      matchResult = selectedMatch.Home?.ShortClubName;
    } else matchResult === "Nereseno";
    if (matchResult === "NOT_PLAYED") {
      return "";
    } else if (playersAnswer !== matchResult) {
      return 0;
    } else if (playersAnswer === matchResult) {
      return 1;
    }
  };

  return (
    <Box bg="#EEEEE4">
      <Nav />
      <Container maxW="container.lg">
        {matchesLoading && (
          <Box textAlign="center" mt="10">
            Učitava se...
          </Box>
        )}
        {matchesError && (
          <Box mt="10">Došlo je do grešeke. Pokušajte kasnije.</Box>
        )}
        {!matchesLoading && !user && <Login />}
        {!matchesLoading && user && matches?.length > 0 && (
          <TableContainer mt="10">
            <Link href="/">⬅ Nazad na mečeve</Link>
            <Table
              size={{ base: "sm", md: "md" }}
              mt="5"
              variant="simple"
              bg="#fff"
            >
              <TableCaption>Tabela glasova</TableCaption>
              <Thead>
                <Tr>
                  <Th>Utakmica</Th>
                  <Th>Datum</Th>
                  <Th>Takmičar</Th>
                  <Th>Glasao</Th>
                  <Th>Ishod</Th>
                  <Th textAlign="center">Poeni</Th>
                </Tr>
              </Thead>
              <Tbody>
                {matches?.map((doc) => (
                  <Tr key={doc?.id}>
                    <Td>
                      {doc?.data.teamA} - {doc?.data?.teamB}
                    </Td>
                    <Td>
                      {new Date(doc?.data?.matchDate).toLocaleString("de-DE", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        // hour: "2-digit",
                        // minute: "numeric",
                      })}
                    </Td>
                    <Td>{doc?.data?.voterName}</Td>
                    <Td>{doc?.data?.final}</Td>
                    <Td>{calculateResult(doc?.data?.idMatch) || "/"}</Td>
                    <Td textAlign="center">
                      {calculatePlayerPoints(
                        doc?.data?.idMatch,
                        doc?.data?.final
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default Competition;

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
