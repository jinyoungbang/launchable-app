import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "../../styles/Home.module.css";
import mainStyles from "../../styles/Main.module.css";
import Header from "../../components/main/Header";
import useSWR from "swr";
import axios from "axios";
import PostView from "../../components/posts/PostView";
import PostActionsBar from "../../components/posts/PostActionsBar";
import Comments from "../../components/posts/Comments";
import Loader from "../../components/main/Loader";

import { useAuth } from "../../components/auth/AuthContext";

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const fetcher = (url) =>
    axios({
      method: "get",
      url: url,
    }).then((res) => {
      return res.data.data;
    });

  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_API_ROUTE + "api/posts/" + id,
    fetcher
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);

  if (isLoading) return <Loader />

  return (
    <div>
      <Head>
        <title>{data && data.title}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={mainStyles.container}>
        <PostView
          user={data && data.user}
          postId={data && data.id}
          title={data && data.title}
          body={data && data.body}
          likes={data && data.likes_count}
          isPreview={false}
        />
        <PostActionsBar
          likesCount={data && data.likes_count}
          postLiked={
            currentUser && data && data.likes.includes(currentUser.uid)
          }
          userId={currentUser && currentUser.uid}
          postId={id}
        />
        <Comments
          postId={id}
          comments={data && data.comments}
          commentsCount={data && data.comments_count}
        />
      </div>
      <br />
      <br />
    </div>
  );
}
