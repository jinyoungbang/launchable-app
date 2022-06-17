import Head from "next/head";
import Router from "next/router";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Input, Button, FormControl } from "@chakra-ui/react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { FaTwitter, FaFacebookSquare } from "react-icons/fa";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signOut,
} from "firebase/auth";

import styles from "../styles/Login.module.css";
import Header from "../components/main/Header";
import MainButton from "../components/assets/MainButton";
import firebase from "../config/firebase";
import { useAuth } from "../components/auth/AuthContext";

const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();

function validateName(value) {
  let error;
  if (!value) {
    error = "Name is required";
  }
  return error;
}

export default function Signup() {
  const { currentUser } = useAuth();
  const router = useRouter();

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isWidthMinimized, setIsWidthMinimized] = useState(false);
  const [usernameFilled, setUsernameFilled] = useState(false);
  const [usernameFilledLoader, setUsernameFilledLoader] = useState(false);
  const [usernameFilledError, setUsernameFilledError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);

  if (currentUser && !isSigningUp) {
    router.push("/");
  }

  const handleResize = () => {
    if (window.innerWidth < 544) {
      setIsWidthMinimized(true);
    } else {
      setIsWidthMinimized(false);
    }
  };

  useEffect(() => {
    if (window.innerWidth < 544) {
      setIsWidthMinimized(true);
    } else {
      setIsWidthMinimized(false);
    }
    window.addEventListener("resize", handleResize);
  });

  const checkUsernameExists = (username) => {
    setUsernameFilledLoader(true);
    setUsernameFilledError("");

    if (username === "") {
      setUsernameFilledError("It is blank.");
      setUsernameFilledLoader(false);
      return;
    }

    var re = /^\w+$/;
    if (!re.test(username)) {
      setUsernameFilledError(
        "Username can only contain letters, numbers and underscores."
      );
      setUsernameFilledLoader(false);
      return;
    }

    if (username.length <= 2) {
      setUsernameFilledError("Username needs to be longer than 2 characters.");
      setUsernameFilledLoader(false);
      return;
    }

    axios({
      method: "post",
      url: process.env.NEXT_PUBLIC_API_ROUTE + "api/auth/check-username",
      data: JSON.stringify({
        username: username,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.data.usernameExists) {
        setUsernameFilledError("아이디가 존재합니다.");
        setUsernameFilledLoader(false);
      } else {
        setUsernameFilled(true);
      }
    });
  };

  const createUserInstance = (id, email, username) => {
    axios({
      method: "post",
      url: process.env.NEXT_PUBLIC_API_ROUTE + "api/auth/create",
      data: JSON.stringify({
        id: id,
        email: email,
        username: username,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    Router.reload("/");
  };

  const socialLoginUserExists = async (uid) => {
    return axios({
      method: "get",
      url: process.env.NEXT_PUBLIC_API_ROUTE + "api/auth/" + uid,
    }).then((res) => {
      return res.data.userExists;
    });
  };

  const googleSignin = (username) => {
    setIsSigningUp(true);
    signInWithPopup(firebase.auth, googleProvider)
      .then((result) => {
        const uid = result.user.uid;
        socialLoginUserExists(uid).then((userExists) => {
          if (userExists) {
            signOut(firebase.auth).then(() => {
              setIsSigningUp(false);
            });
            setErrorMessage("소셜 로그인 아이디가 존재합니다. 다른 계정을 사용해주세요.");
            setIsError(true);
          } else {
            const user = result.user;
            createUserInstance(user.uid, user.email, username);
          }
        });
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/account-exists-with-different-credential":
            break;
          default:
            console.log(error.message);
            break;
        }
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const twitterSignin = (username) => {
    signInWithPopup(firebase.auth, twitterProvider)
      .then((result) => {
        const uid = result.user.uid;
        socialLoginUserExists(uid).then((userExists) => {
          if (userExists) {
            signOut(firebase.auth).then(() => {
              setIsSigningUp(false);
            });
            setErrorMessage("소셜 로그인 아이디가 존재합니다. 다른 계정을 사용해주세요.");
            setIsError(true);
          } else {
            const user = result.user;
            createUserInstance(user.uid, user.email, username);
          }
        });
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/account-exists-with-different-credential":
            break;
          default:
            console.log(error.message);
            break;
        }
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = TwitterAuthProvider.credentialFromError(error);
        console.log(errorMessage);
        // ...
      });
  };

  return (
    <div>
      <Head>
        <title>회원가입</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className={styles.formContainer}>
        <Formik
          initialValues={{ username: "", email: "", password: "" }}
          onSubmit={(values, actions) => {
            if (!usernameFilled) {
              actions.setSubmitting(false);
              return;
            }
            createUserWithEmailAndPassword(
              firebase.auth,
              values.email,
              values.password
            )
              .then((userCredential) => {
                return userCredential.user;
              })
              .then((user) => {
                createUserInstance(user.uid, user.email, values.username);
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === "auth/email-already-in-use") {
                  console.log("Email already in use.");
                  setErrorMessage("이메일이 존재합니다. 다른 이메일을 사용해주세요.");
                  setIsError(true);
                }
                actions.setSubmitting(false);
                // ..
              });
          }}
        >
          {usernameFilled
            ? (props) => (
                <Form
                  style={
                    isWidthMinimized ? { width: "100%" } : { width: "49%" }
                  }
                >
                  <h1 style={{ fontWeight: 600, fontSize: "1.2rem" }}>
                    {props.values.username}님, 안녕하세요!
                  </h1>
                  <p
                    style={{
                      fontWeight: 300,
                      fontSize: "0.8rem",
                      marginTop: "0.2rem",
                    }}
                  >
                    이메일 아니면 소셜계정을 사용해서 회원가입을 해주세요.
                  </p>
                  <br></br>
                  <Field name="email" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <h3>이메일</h3>
                        <Input
                          {...field}
                          type={"email"}
                          placeholder="이메일"
                          id="email"
                        />
                        {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
                      </FormControl>
                    )}
                  </Field>
                  <Field name="password" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <h3>비밀번호</h3>
                        <Input
                          {...field}
                          type={"password"}
                          placeholder="비밀번호"
                          id="password"
                        />
                        {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
                      </FormControl>
                    )}
                  </Field>
                  {isError ? (
                    <p
                      style={{
                        color: "#F56565",
                        fontSize: "0.8rem",
                        fontWeight: "500",
                        marginTop: "0.5rem",
                      }}
                    >
                      {errorMessage}
                    </p>
                  ) : null}
                  <div className={styles.buttonContainer}>
                    <MainButton
                      isLoading={props.isSubmitting}
                      type="submit"
                      text="회원가입"
                    />
                    <p style={{ margin: "0 1rem" }}>또는</p>
                    <button
                      className={styles.iconButton}
                      style={{ border: "1px solid #DEE2E6" }}
                      onClick={() => googleSignin(props.values.username)}
                      type="button"
                    >
                      <FcGoogle className={styles.socialIcon} />
                    </button>
                    <button
                      className={styles.iconButton}
                      style={{
                        backgroundColor: "#1e99e6",
                        marginLeft: "0.25rem",
                      }}
                      onClick={() => twitterSignin(props.values.username)}
                      type="button"
                    >
                      <FaTwitter
                        className={styles.socialIcon}
                        style={{ color: "white" }}
                      />
                    </button>
                    {/* <button
                      className={styles.iconButton}
                      style={{ backgroundColor: "#3b5897", marginLeft: "0.25rem" }}
                      type="button"
                    >
                      <FaFacebookSquare
                        className={styles.socialIcon}
                        style={{ color: "white" }}
                      />
                    </button> */}
                  </div>
                </Form>
              )
            : (props) => (
                <Form
                  style={
                    isWidthMinimized ? { width: "100%" } : { width: "49%" }
                  }
                  className={styles.usernameFieldContainer}
                >
                  <Field name="username">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <h3>아이디</h3>
                        <Input
                          {...field}
                          placeholder="아이디를 입력하세요"
                          id="username"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <p>{usernameFilledError}</p>
                  <Button
                    isLoading={usernameFilledLoader}
                    isDisabled={usernameFilledLoader}
                    onClick={() => checkUsernameExists(props.values.username)}
                    style={{
                      marginTop: "1rem",
                    }}
                  >
                    다음
                  </Button>
                </Form>
              )}
        </Formik>

        {isWidthMinimized ? null : (
          <div style={{ width: "49%" }} className={styles.contentContainer}>
            <h1 style={{ fontWeight: 600 }}>
              Launchable에서 새로운 계정을 만드세요!
            </h1>
            <br></br>
            <h1>개인 사업를 운영하는 다른 파운더들과 소통하세요.</h1>
            <br></br>
            <h1>아이디어, 랜딩 페이지 등에 대한 피드백을 받으십시오.</h1>
            <br />
            <h1>Get the best new stories from founders in your inbox.</h1>
          </div>
        )}
      </div>
    </div>
  );
}
