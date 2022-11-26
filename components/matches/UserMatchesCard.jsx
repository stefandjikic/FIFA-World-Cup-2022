import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";

const UserMatchesCard = ({
  user = "",
  matchesPerUser = [],
  totalScore = 0,
}) => {
  return (
    <Card bg="#fff">
      <CardHeader
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p="4"
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="bold"
      >
        {user}
        <Badge colorScheme="purple" px='2' rounded='md'>{totalScore}</Badge>
      </CardHeader>
      <CardBody>
        <Flex
          justifyContent="space-between"
          borderBottom="1px"
          borderColor="gray.100"
          mb="2"
          fontSize="xs"
        >
          <Box>Datum</Box>
          <Box>Meč</Box>
          <Box>Glas</Box>
        </Flex>
        {matchesPerUser?.length > 0 &&
          matchesPerUser?.slice(0, 4)?.map((match) => (
            <Flex key={match?.id} justifyContent="space-between" fontSize="xs">
              <Box>
                {new Date(match?.matchDate).toLocaleString("de-DE", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </Box>
              <Box>{match?.match}</Box>
              <Box>{match?.userVoted}</Box>
            </Flex>
          ))}
      </CardBody>
    </Card>
  );
};

export default UserMatchesCard;
