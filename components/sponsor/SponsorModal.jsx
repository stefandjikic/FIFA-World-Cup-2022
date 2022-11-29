import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import dresImg from "../../public/img/dres-srbija.jpg";

export const SponsorModal = ({ isOpen, onClose, closeModal }) => {
  return (
    <Modal
      isOpen={isOpen}
      size="full"
      scrollBehavior="inside"
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>OBAVEŠTENJE - Promene u sponzorstvu!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="bold">Poštovani takmičari,</Text>
          <Text>
            Usled politički obojenih insinuacija i nedoličnog rečnika u
            zvaničnim kanalima komunikacije, trenutni sponzor - Sačuvajmo pčele
            - Save the Bees je odlučio da prekine saradnju sa našom aplikacijom.
            Nakon višesatnih pregovora našeg tima sa sponzorom, ipak je odlučeno
            da se nastavi saradnja, ali sa znatno manjim nagradnim fondom. Tako
            da je dogovoreno da prvo mesto umesto nekadašnjih
            <Text as="span" fontWeight="bold">
              {" "}
              10kg, dobije 1kg meda
            </Text>
            .
          </Text>
          <Text>
            Pored toga, naš tim je u pregovorima sa još jedim manjim, ali ništa
            bitnijim sponozorm -{" "}
            <Text as="span" fontWeight="bold">
              {" "}
              Fudbalski Savez Srbije!
            </Text>
          </Text>
          <Text>
            Ukoliko fudbalska reprezentacija Srbije prođe u nokaut fazu
            takmičenja, FSS će obezbediti DRES SRBIJE najboljem prognostičaru!
          </Text>
          <Flex justifyContent="center" mt="4">
            <Image src={dresImg} alt="dres srbije" width="150" height="150" />
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button onClick={closeModal} colorScheme="purple">
            U redu
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
