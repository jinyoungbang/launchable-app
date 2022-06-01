import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import mainStyles from "../styles/Main.module.css";
import Header from "../components/main/Header";
import PostsHeader from "../components/posts/PostsHeader";
import Preview from "../components/posts/Preview";
import useSWR from "swr";
import axios from "axios";
import LoaderComponent from "../components/main/LoaderComponent";

export default function Home() {
  const router = useRouter();

  const fetcher = (url) =>
    axios({
      method: "get",
      url: url,
    }).then((res) => {
      return res.data;
    });

  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_API_ROUTE + "api/posts/recent",
    fetcher
  );


  return (
    <div>
      <Head>
        <title>Launchable</title>
        <meta name="description" content="Launchable, 론쳐블" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={mainStyles.homeContainer}>
        <PostsHeader />
        {data ? (data.data.map((post) => (
            <div onClick={() => router.push("/post/" + post.id)}>
              <Preview
                title={post.title}
                user={post.user}
                likes={post.likes_count}
                commentsCount={post.comments_count}
              />
            </div>
          ))): <LoaderComponent />}
      </div>
      <br />
    </div>
  );
}
