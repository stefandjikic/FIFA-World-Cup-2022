import { ChakraProvider } from "@chakra-ui/react";
import { initFirebase } from "../firebase/clientApp";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  initFirebase();
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
