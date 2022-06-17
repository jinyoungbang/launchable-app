import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from 'next/script'


class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          {/* <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin /> */}
          <link href="https://fonts.googleapis.com/css2?family=Alata&display=swap" rel="stylesheet" />
          {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-1Y2HGTYY8Y" strategy="afterInteractive"></Script>
          <Script strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1Y2HGTYY8Y');
          `
          }
          </Script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;