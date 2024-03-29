import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="description" content="1인 창업가/부트스트래퍼들 위한 커뮤니티. 투명하게 경험을 공유해고 서로 배우세요!"></meta>
          <meta property="og:type" content="website"></meta>
          <meta property="og:title" content="Launchable"></meta>
          <meta property="og:description" content="1인 창업가/부트스트래퍼들 위한 커뮤니티. 투명하게 경험을 공유해고 서로 배우세요!"></meta>
          <meta property="og:image" content="https://www.launchable.kr/favicon.ico"></meta>
          <meta property="og:url" content="https://launchable.kr/"></meta>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          {/* <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin /> */}
          <link
            href="https://fonts.googleapis.com/css2?family=Alata&display=swap"
            rel="stylesheet"
          />
          <meta
            name="naver-site-verification"
            content="a21d3b808904975c71d62048d07a55a95505bfcb"
          />
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
