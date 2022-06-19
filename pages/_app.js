import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "../components/auth/AuthContext";
import Script from "next/script";

// <!-- Global site tag (gtag.js) - Google Analytics -->
// <script async src="https://www.googletagmanager.com/gtag/js?id=G-1Y2HGTYY8Y"></script>
// <script>
//   window.dataLayer = window.dataLayer || [];
//   function gtag(){dataLayer.push(arguments);}
//   gtag('js', new Date());

//   gtag('config', 'G-1Y2HGTYY8Y');
// </script>

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ChakraProvider>
        <AuthProvider>
          <Script
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />
          <Script strategy="lazyOnload">
            {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `}
          </Script>
          <Component {...pageProps} />
        </AuthProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
