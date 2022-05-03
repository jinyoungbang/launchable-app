import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css";
import { Formik, Form, Field } from "formik";
import Header from "../components/main/Header";
import { Input, Button, FormControl } from "@chakra-ui/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import auth from "../config/firebase";

function validateName(value) {
  let error;
  if (!value) {
    error = "Name is required";
  }
  return error;
}

export default function Signup() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <title>회원가입</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values, actions) => {
            createUserWithEmailAndPassword(auth, values.email, values.password)
              .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);

                // If signup successful, send user details to database.
                router.push("/");
                // ...
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                actions.setSubmitting(false);
                console.log(errorMessage);
                // ..
              });
          }}
        >
          {(props) => (
            <Form>
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
              <Button
                variant="solid"
                isLoading={props.isSubmitting}
                type="submit"
              >
                회원가입
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
