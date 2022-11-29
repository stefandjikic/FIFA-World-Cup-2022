import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import Nav from "../components/layout/Nav";

const SponsorPage = () => {
  return (
    <Box bg="#EEEEE4">
      <Nav />
      <Container maxW="container.xl" textAlign='center'>
      <Link style={{display: 'block', marginTop: '20px'}} href="/">⬅ Nazad na mečeve</Link>
        <Heading
          as="h1"
          mt="5"
          fontWeight="bold"
          color="yellow.600"
          textAlign="center"
        >
          Save The Bees - Sačuvajmo Pčele
        </Heading>
        <Flex justifyContent="center" alignItems="center" pt="5">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/qMYnNyPrEBE"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </Flex>
        <Container maxW="container.sm" textAlign="center">
          <Text mt="5">
            Save The Bees - Sačuvajmo Pčele, čuveni Leskovački pčelarksi lanac
            je glavni sponzor ovog takmičenja. Zahvaljujući odličnim poslovnim
            odnosima i višegodišnjom sradnjom sa direktorom firme, uspeli smo da
            obezbedimo vrednu nagradu za najuspešnijeg sportskog prognostičara!
          </Text>
          <Text
            mt='4'
            color="yellow.600"
            fontSize="4xl"
            fontWeight="bold"
          >
            1 KG Najkvalitenijeg Meda!
          </Text>
          <Text mt='4'>Za ostale učesike tu su i brojne utešne nagrade. U ovoj igri svi su dobitnici!</Text>
        </Container>
      </Container>
    </Box>
  );
};

export default SponsorPage;
