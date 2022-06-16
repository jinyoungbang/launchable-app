import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/Create.module.css";
import { Input, Textarea, Button, FormControl } from "@chakra-ui/react";
import Header from "../components/main/Header";
import { Formik, Form, Field } from "formik";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../components/auth/AuthContext";
import axios from "axios";
import PostView from "../components/posts/PostView";
import ResizeTextarea from "react-textarea-autosize";
import Loader from "../components/main/Loader";
import useSWR from "swr";

function validateName(value) {
  let error;
  if (!value) {
    error = "Name is required";
  }
  return error;
}

export default function Edit() {
  const { currentUser, userData } = useAuth();
  const router = useRouter();
  const postId = router.query.id;
  const [isLoading, setIsLoading] = useState(true);

  if (!currentUser) router.push("/signup");

  const fetcher = (url) =>
    axios({
      method: "get",
      url: url,
    }).then((res) => {
      return res.data.data;
    });

  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_API_ROUTE + "api/posts/" + postId,
    fetcher
  );

  useEffect(() => {
    if (data) {
      if (data.user_id !== userData.id) router.push("/");
      else setIsLoading(false);
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>글 수정하기</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={styles.createContainer}>
        <Formik
          initialValues={{ title: data.title, body: data.body }}
          onSubmit={(values, actions) => {
            axios({
              method: "patch",
              url: process.env.NEXT_PUBLIC_API_ROUTE + "api/posts/" + postId,
              data: JSON.stringify({
                title: values.title,
                body: values.body,
                user_id: userData.id,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }).then((res) => {
              if (res.status === 200) router.push("/post/" + postId);
              else actions.setSubmitting(false);
            });
          }}
        >
          {(props) =>
            router.query.previewing ? (
              <Form>
                <PostView
                  title={props.values.title}
                  body={props.values.body}
                  user={userData && userData.username}
                  isPreview={true}
                />
                <div style={{ marginTop: "2rem" }}>
                  <Button
                    variant="solid"
                    isDisabled={
                      props.values.title === "" || props.values.body === ""
                    }
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    출간하기
                  </Button>
                  <Link
                    href={{
                      pathname: "/edit",
                      query: { id: postId },
                    }}
                  >
                    <Button variant="solid" style={{ marginLeft: "5px" }}>
                      수정하기
                    </Button>
                  </Link>
                </div>
              </Form>
            ) : (
              <Form>
                <Field name="title" validate={validateName}>
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <Input
                        {...field}
                        placeholder="제목을 입력하세요"
                        id="title"
                        variant="flushed"
                        size="lg"
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="body" validate={validateName}>
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <Textarea
                        {...field}
                        placeholder="글을 작성해보세요..."
                        id="body"
                        resize="none"
                        minRows={8}
                        as={ResizeTextarea}
                      />
                    </FormControl>
                  )}
                </Field>
                <Button
                  variant="solid"
                  isDisabled={
                    props.values.title === "" || props.values.body === ""
                  }
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  출간하기
                </Button>
                {/* <Button variant="solid" style={{ marginLeft: "5px" }}>
                임시저장
              </Button> */}
                <Link
                  href={{
                    pathname: "/edit",
                    query: { id: postId, previewing: true },
                  }}
                >
                  <Button variant="solid" style={{ marginLeft: "5px" }}>
                    프리뷰 보기
                  </Button>
                </Link>
              </Form>
            )
          }
        </Formik>
        <br />
      </div>
      <br />
      {/* <footer className={styles.footer}>Launchable 2022</footer> */}
    </div>
  );
}
