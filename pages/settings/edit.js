import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import mainStyles from "../../styles/Main.module.css";
import indexStyles from "../../styles/Settings.module.css";
import styles from "../../styles/settings/Edit.module.css";
import Header from "../../components/main/Header";
import { FaTimes } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import { Input, Button, FormControl, Avatar, Center } from "@chakra-ui/react";
import useSWR from "swr";
import { useSWRConfig } from "swr";
import axios from "axios";
import ResizeTextarea from "react-textarea-autosize";
import firebase from "../../config/firebase";
import LoaderComponent from "../../components/main/LoaderComponent";

import { useAuth } from "../../components/auth/AuthContext";
import { useState, useEffect, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function SettingsEdit() {
  const { currentUser, userData } = useAuth();
  const router = useRouter();
  const { mutate } = useSWRConfig();

  // Hooks for Avatar Image Upload
  const [image, setImage] = useState("");
  const [imageLoading, setImageLoading] = useState(true);
  const inputFile = useRef(null);

  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_API_ROUTE + "api/auth",
    fetcher
  );

  const editUser = (
    id,
    username,
    displayName,
    about,
    twitterUrl,
    githubUrl,
    linkedinUrl
  ) => {
    axios({
      method: "patch",
      url: process.env.NEXT_PUBLIC_API_ROUTE + "api/settings",
      data: JSON.stringify({
        id: id,
        userData: {
          username: username,
          profile: {
            display_name: displayName,
            about: about,
            profile_links: {
              twitter: twitterUrl,
              github: githubUrl,
              linkedin: linkedinUrl,
            },
          },
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) router.push("/settings");
      else console.log("error");
    });
  };

  const mutateFetcher = () => {
    axios({
      method: "post",
      url: process.env.NEXT_PUBLIC_API_ROUTE + "api/auth",
      data: JSON.stringify({
        id: data.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handleFileUpload = async (e) => {
    setImageLoading(true);
    const storageRef = ref(firebase.storage, "avatars/" + data.id);
    const { files } = e.target;

    await uploadBytes(storageRef, files[0]);

    const imageUrl = await getDownloadURL(storageRef);
    setImage(imageUrl);
    axios({
      method: "patch",
      url: process.env.NEXT_PUBLIC_API_ROUTE + "api/settings/avatar",
      data: JSON.stringify({
        id: data.id,
        avatar_url: imageUrl,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      // mutate(process.env.NEXT_PUBLIC_API_ROUTE + "api/auth", mutateFetcher);
      setImageLoading(false);
    });
  };

  const onAvatarClick = () => {
    inputFile.current.click();
  };

  useEffect(() => {
    setImage(data && data.profile.avatar_url);
    setImageLoading(false);
  }, [data]);

  if (currentUser) {
    if (!userData) return "loading";
  } else {
    router.push("/signup");
  }
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
      setImage(res.data.userData.avatarUrl);
      return res.data.userData;
    });

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
        <Formik
          initialValues={{
            username: data && data.username,
            name: data && data.profile.display_name,
            about: data && data.profile.about,
            twitterUrl: data && data.profile.profile_links.twitter,
            githubUrl: data && data.profile.profile_links.github,
            linkedinUrl: data && data.profile.profile_links.linkedin,
          }}
          onSubmit={(values, actions) => {
            const id = userData.id;
            const username = values.username;
            const displayName = values.name;
            const about = values.about;
            const twitterUrl = values.twitterUrl;
            const githubUrl = values.githubUrl;
            const linkedinUrl = values.linkedinUrl;
            editUser(
              id,
              username,
              displayName,
              about,
              twitterUrl,
              githubUrl,
              linkedinUrl
            );
          }}
        >
          {(props) => (
            <Form>
              <div className={styles.headerContainer}>
                {imageLoading ? (
                  <div style={{ height: "10rem", width: "10rem" }}>
                    <LoaderComponent />
                  </div>
                ) : (
                  <Avatar
                    src={image}
                    style={{
                      height: "10rem",
                      width: "10rem",
                    }}
                    onClick={onAvatarClick}
                  />
                )}
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  ref={inputFile}
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
                <div className={styles.usernameContainer}>
                  <div className={styles.usernameEditContainer}>
                    <h2>프로필 수정하기</h2>
                    <Link href="/settings">
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
                          <FaTimes style={{ color: "#ffffff" }} />
                        </Center>
                      </Button>
                    </Link>
                  </div>
                  <p>이미지를 클릭해서 새로운 프로필 사진을 올리세요!</p>
                </div>
              </div>

              <div className={indexStyles.basicInfoContainer}>
                <h2>기본 정보</h2>
                <h3>이름</h3>
                <Field name="name">
                  {({ field, form }) => (
                    <FormControl>
                      <Input {...field} id="name" />
                    </FormControl>
                  )}
                </Field>
                <h3>자기소개</h3>
                <Field name="about">
                  {({ field, form }) => (
                    <FormControl>
                      <Input
                        {...field}
                        as={ResizeTextarea}
                        style={{
                          backgroundColor: "white",
                          padding: "0.5rem 1rem",
                        }}
                        resize="none"
                        minRows={1}
                        id="about"
                      />
                    </FormControl>
                  )}
                </Field>
                <br />
                <h2>연락/소셜 정보</h2>
                <h3>GitHub</h3>
                <Field name="githubUrl">
                  {({ field, form }) => (
                    <FormControl>
                      <Input {...field} id="githubUrl" />
                    </FormControl>
                  )}
                </Field>
                <h3>트위터</h3>
                <Field name="twitterUrl">
                  {({ field, form }) => (
                    <FormControl>
                      <Input {...field} id="twitterUrl" />
                    </FormControl>
                  )}
                </Field>
                <h3>링크드인</h3>
                <Field name="linkedinUrl">
                  {({ field, form }) => (
                    <FormControl>
                      <Input {...field} id="linkedinUrl" />
                    </FormControl>
                  )}
                </Field>
              </div>
              <Button
                type="submit"
                variant="solid"
                style={{
                  backgroundColor: "#038A64",
                  color: "#FFFFFF",
                  marginBottom: "3rem",
                }}
              >
                저장
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
