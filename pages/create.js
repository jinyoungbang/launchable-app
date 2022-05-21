import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/Create.module.css";
import { Input, Textarea, Button, FormControl } from "@chakra-ui/react";
import Header from "../components/main/Header";
import { Formik, Form, Field } from "formik";
import Link from "next/link";
import { useAuth } from "../components/auth/AuthContext";
import axios from "axios";
import PostView from "../components/posts/PostView";
import ResizeTextarea from "react-textarea-autosize";

function validateName(value) {
  let error;
  if (!value) {
    error = "Name is required";
  }
  return error;
}

export default function Create() {
  const { currentUser, loading, userData } = useAuth();
  const router = useRouter();


  if (loading) {
    return <p>lol</p>;
  }

  if (!currentUser) router.push("/signup");

  return (
    <div className={styles.container}>
      <Head>
        <title>새 글 작성</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={styles.createContainer}>
        <Formik
          initialValues={{ title: "", body: "" }}
          onSubmit={(values, actions) => {
            axios({
              method: "post",
              url: process.env.NEXT_PUBLIC_API_ROUTE + "/api/posts",
              data: JSON.stringify({
                title: values.title,
                body: values.body,
                user: userData.username,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }).then((res) => {
              if (res.status === 201) router.push("/");
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
                  <Link href="/create">
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
                        style={{height: "150px"}}
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
                  href={{ pathname: "/create", query: { previewing: true } }}
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
