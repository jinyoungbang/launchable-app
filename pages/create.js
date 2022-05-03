import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Create.module.css";
import { Input, Textarea, Button } from "@chakra-ui/react";
import Header from "../components/main/Header";
import { Formik, Form, Field } from "formik";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";

function validateName(value) {
  let error;
  if (!value) {
    error = "Name is required";
  }
  return error;
}

export default function Create() {
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
          initialValues={{ title: "", content: "" }}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              actions.setSubmitting(false);
            }, 1000);
          }}
        >
          {(props) => (
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
                    {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
                  </FormControl>
                )}
              </Field>
              <Field name="content" validate={validateName}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.name && form.touched.name}
                  >
                    <Textarea
                      {...field}
                      placeholder="글을 작성해보세요..."
                      id="content"
                    />
                    {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
                  </FormControl>
                )}
              </Field>
                {console.log(props)}
              <Button
                variant="solid"
                isDisabled={props.values.title === "" || props.values.content === ""}
                isLoading={props.isSubmitting}
                type="submit"
              >
                출간하기
              </Button>
              {/* <Button variant="solid" style={{ marginLeft: "5px" }}>
                임시저장
              </Button> */}
              <Button variant="solid" style={{ marginLeft: "5px" }}>
                프리뷰 보기
              </Button>
            </Form>
          )}
        </Formik>
        <br />
      </div>
      <br />
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
