import React, { useCallback, useMemo, useEffect } from "react";
import { getFirestore, collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  Box,
  Container,
  Grid,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import Nav from "../components/layout/Nav";
import { getAuth } from "firebase/auth";
import Link from "next/link";
import { Login } from "../components/auth/Login";
import { useAuthState } from "react-firebase-hooks/auth";
import UserMatchesCard from "../components/matches/UserMatchesCard";
import { SponsorModal } from "../components/sponsor/SponsorModal";

const Competition = ({ scoreResults = [] }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  useEffect(() => {
    const consent = localStorage.getItem("consent");
    if (!consent) {
      onOpen();
    }
  }, [onOpen]);

  const closeModal = () => {
    localStorage.setItem("consent", "FIFA 2022 competition - novi sponzor");
    onClose();
  };

  const calculatePlayerPointPerGame = (selectedMatch, playersAnswer) => {
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
    } else if (selectedMatch?.Home?.Score === selectedMatch.Away?.Score) {
      if (
        selectedMatch?.StageName[0]?.Description?.toLowerCase() ===
        "first stage"
      ) {
        matchResult = "Nereseno";
      } else {
        matchResult = "Produzeci";
      }
    }
    if (matchResult === "NOT_PLAYED") {
      return null;
    } else if (playersAnswer !== matchResult) {
      return 0;
    } else if (playersAnswer === matchResult) {
      return 1;
    }
  };

  const returnUsersVotesData = useMemo(() => {
    let matchesPlayedbyUSers = [];
    scoreResults?.forEach((sr) => {
      matches?.forEach((doc) => {
        if (sr?.IdMatch === doc?.data?.idMatch) {
          const userObject = {
            id: doc?.id,
            user: doc?.data?.voterName,
            userID: doc?.data?.voterID,
            matchDate: doc?.data?.matchDate,
            matchID: doc?.data?.idMatch,
            match: doc?.data?.teamA + "-" + doc?.data?.teamB,
            userVoted: doc?.data?.final,
            gameScore:
              sr?.Home?.Score !== null && sr?.Away?.Score !== null
                ? sr?.Home?.Score + ":" + sr.Away?.Score
                : "/",
            userScore: calculatePlayerPointPerGame(sr, doc?.data?.final),
          };
          matchesPlayedbyUSers.push(userObject);
        }
      });
    });
    return matchesPlayedbyUSers?.sort((a, b) => a?.matchDate < b?.matchDate);
  }, [matches, scoreResults]);

  const claculateTotalPointsPerUser = useCallback(
    (userID) => {
      let arrayOfUserPoint = [];
      returnUsersVotesData?.forEach((user) => {
        if (user?.userID === userID) {
          arrayOfUserPoint = [...arrayOfUserPoint, user?.userScore];
        }
      });
      const totalScore = arrayOfUserPoint.reduce((prevValue, currentValue) => {
        return prevValue + currentValue;
      }, 0);
      return totalScore;
    },
    [returnUsersVotesData]
  );

  const returnAllMatchesPerUser = useCallback(
    (userID) => {
      let arrayOfUserMatches = [];
      returnUsersVotesData?.forEach((user) => {
        if (user?.userID === userID) {
          arrayOfUserMatches = [...arrayOfUserMatches, user];
        }
      });
      return arrayOfUserMatches;
    },
    [returnUsersVotesData]
  );

  const parsedUsers = useMemo(() => {
    if (returnUsersVotesData?.length > 0) {
      const filteredMathcesByUserId = returnUsersVotesData?.reduce(function (
        p,
        c
      ) {
        if (
          !p.some(function (el) {
            return el?.userID === c?.userID;
          })
        )
          p.push(c);
        return p;
      },
      []);
      const uniqueUsers = filteredMathcesByUserId?.map((userDoc) => ({
        user: userDoc?.user,
        id: userDoc?.userID,
        totalScore: claculateTotalPointsPerUser(userDoc?.userID),
        matchesPerUser: returnAllMatchesPerUser(userDoc?.userID),
      }));
      return uniqueUsers?.sort((a, b) => b?.totalScore - a?.totalScore);
    }
  }, [
    claculateTotalPointsPerUser,
    returnAllMatchesPerUser,
    returnUsersVotesData,
  ]);

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
          <Tabs
            variant="soft-rounded"
            colorScheme="purple"
            mt="5"
            size={{ base: "sm", md: "md" }}
          >
            <Link href="/">⬅ Nazad na mečeve</Link>
            <TabList mt="5">
              <Tab>Glasanja</Tab>
              <Tab>Rang Lista</Tab>
              <Tab>Poslednje</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p="0">
                <TableContainer>
                  <Table
                    size={{ base: "sm", md: "md" }}
                    mt="5"
                    variant="simple"
                    bg="#fff"
                  >
                    <Thead>
                      <Tr>
                        <Th>Datum</Th>
                        <Th>Utakmica</Th>
                        <Th>Takmičar</Th>
                        <Th>Glasao</Th>
                        <Th>Ishod</Th>
                        <Th textAlign="center">Poeni</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {returnUsersVotesData?.map((doc) => (
                        <Tr key={doc?.id}>
                          <Td>
                            {new Date(doc?.matchDate).toLocaleString("de-DE", {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                            })}
                          </Td>
                          <Td>{doc?.match}</Td>
                          <Td>{doc?.user}</Td>
                          <Td>{doc?.userVoted}</Td>
                          <Td>{doc?.gameScore}</Td>
                          <Td>{doc?.userScore}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>
              <TabPanel>
                <TableContainer>
                  <Table
                    size={{ base: "sm", md: "md" }}
                    mt="5"
                    variant="simple"
                    bg="#fff"
                  >
                    <Thead>
                      <Tr>
                        <Th color="gray.500">#</Th>
                        <Th>Takmičar</Th>
                        <Th isNumeric>Rezultat</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {parsedUsers?.map((userDoc, index) => (
                        <Tr key={userDoc?.id}>
                          <Td fontSize="sm" color="gray.500">
                            {index + 1}
                          </Td>
                          <Td>
                            <Text as="span" mr="2">
                              {userDoc?.user}
                            </Text>
                            <Text
                              as="span"
                              display={{ base: "none", md: "inline-block" }}
                              color="gray.300"
                              fontSize="sm"
                            >
                              #{userDoc?.id?.slice(0, 8)}
                            </Text>
                          </Td>
                          <Td isNumeric>{userDoc?.totalScore}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>
              <TabPanel>
                <Grid
                  gridTemplateColumns={{
                    base: "1fr",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  }}
                  gap="2"
                >
                  {parsedUsers?.map((userDoc) => (
                    <UserMatchesCard
                      key={userDoc?.id}
                      user={userDoc?.user}
                      matchesPerUser={userDoc?.matchesPerUser}
                      totalScore={userDoc?.totalScore}
                    />
                  ))}
                </Grid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
        <SponsorModal
          isOpen={isOpen}
          onClose={onClose}
          closeModal={closeModal}
        />
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
