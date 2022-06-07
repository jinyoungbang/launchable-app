import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import styles from "../../styles/Settings.module.css";
import mainStyles from "../../styles/Main.module.css";
import Header from "../../components/main/Header";
import { MdOutlineEdit } from "react-icons/md";
import { Button, Avatar, Center } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import Loader from "../../components/main/Loader";
import firebase from "../../config/firebase";
import { signOut } from "firebase/auth";

import { useAuth } from "../../components/auth/AuthContext";

export default function Settings() {
  const { currentUser, userData } = useAuth();
  const router = useRouter();
  if (!currentUser) router.push("/signup");

  const [isLoading, setIsLoading] = useState(true);

  const deleteUser = (id) => {
    axios({
      method: "delete",
      url: process.env.NEXT_PUBLIC_API_ROUTE + "api/auth/" + id,
    }).then((res) => {
      if (res.status === 200) {
        signOut(firebase.auth);
        router.push("/");
      } else console.log("error");
    });
  };

  const fetcher = (url) =>
    axios({
      method: "post",
      url: url,
      data: JSON.stringify({
        id: userData.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      return res.data.userData;
    });

  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_API_ROUTE + "api/auth",
    fetcher
  );

  useEffect(() => {
    if (data) setIsLoading(false);
  }, [data]);

  if (isLoading) return <Loader />;

  return (
    <div>
      <Head>
        <title>Launchable</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={mainStyles.container}>
        <div className={styles.headerContainer}>
          <Avatar
            src={
              data.profile.avatar_url
            }
            style={{
              height: "10rem",
              width: "10rem",
            }}
          />
          <div className={styles.usernameContainer}>
            <div className={styles.usernameEditContainer}>
              <h2>@{data && data.username}</h2>
              <Link href="/settings/edit">
                <Button
                  variant="solid"
                  style={{
                    backgroundColor: "#038A64",
                    color: "#FFFFFF",
                    marginLeft: "1rem",
                    height: "2.5rem",
                    width: "2.5rem",
                  }}
                >
                  <Center>
                    <MdOutlineEdit style={{ color: "#ffffff" }} />
                  </Center>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.basicInfoContainer}>
          <h2>기본 정보</h2>
          <div>
            <h3>이메일</h3>
            <p>{data && data.email}</p>
          </div>
          <hr />
          <div>
            <h3>이름</h3>
            <p>
              {""}
              {data && data.profile.display_name ? (
                <p>{data.profile.display_name}</p>
              ) : (
                <p style={{ fontWeight: 300, color: "grey" }}>없음</p>
              )}
            </p>
          </div>
          <hr />
          <div>
            <h3>자기소개</h3>
            {data && data.profile.about ? (
              <p style={{ whiteSpace: "pre-line" }}>{data.profile.about}</p>
            ) : (
              <p style={{ fontWeight: 300, color: "grey" }}>없음</p>
            )}
          </div>
          <hr />
        </div>

        <div className={styles.basicInfoContainer}>
          <h2>연락/소셜 정보</h2>
          <div>
            <h3>GitHub</h3>
            <p>{data && data.profile.profile_links.github}</p>
          </div>
          <hr />
          <div>
            <h3>트위터</h3>
            <p>
              {""}
              {data && data.profile.profile_links.twitter}
            </p>
          </div>
          <hr />
          <div>
            <h3>링크드인</h3>
            {data && data.profile.profile_links.linkedin}
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <Button onClick={() => deleteUser(userData.id)} colorScheme="red">
            계정 탈퇴
          </Button>
        </div>
      </div>

      <br />
    </div>
  );
}
