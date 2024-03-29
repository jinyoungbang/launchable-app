import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Input, Textarea, Button, FormControl } from "@chakra-ui/react";
import ContentView from "./comments/ContentView";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";
import { useSWRConfig } from "swr";
import styles from "../../styles/components/posts/Comments.module.css";
import ResizeTextarea from "react-textarea-autosize";
import { useRouter } from "next/router";

const Comments = (props) => {
  const router = useRouter();
  const { userData } = useAuth();
  const { mutate } = useSWRConfig();
  const [comments, setComments] = useState([]);

  const generateAllComments = async (comments) => {
    if (comments.length === 0 || comments === []) return [];
    if (comments[0].comments.length > 0) {
      let left = [comments[0]];
      let middle = await generateAllComments(comments[0].comments);
      let right = await generateAllComments(comments.slice(1));
      let res = left.concat(middle).concat(right);
      return res;
    } else {
      let left = [comments[0]];
      let right = await generateAllComments(comments.slice(1));
      let res = left.concat(right);
      return res;
    }
  };

  useEffect(() => {
    const getComments = async () => {
      const commentsData = await generateAllComments(props.comments);
      setComments(commentsData);
    };
    if (props.comments) {
      getComments();
    }
  }, [props]);

  return (
    <div className={styles.container}>
      <h2> {props.commentsCount}개의 댓글</h2>
      <Formik
        initialValues={{ comment: "" }}
        onSubmit={(values, actions) => {
          if (!userData) router.push("/login");
          axios({
            method: "post",
            url:
              process.env.NEXT_PUBLIC_API_ROUTE +
              "/api/posts/" +
              props.postId +
              "/comments",
            data: JSON.stringify({
              body: values.comment,
              userId: userData.id,
              username: userData.username,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((res) => {
            if (res.status === 201) {
              actions.setSubmitting(false);
              mutate(
                process.env.NEXT_PUBLIC_API_ROUTE + "api/posts/" + props.postId
              );
              actions.resetForm();
            }
          });
        }}
      >
        {(props) => (
          <Form style={{ marginBottom: "2rem" }}>
            <Field name="comment">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.name && form.touched.name}>
                  <Input
                    {...field}
                    placeholder="댓글을 작성하세요"
                    id="title"
                    variant="outline"
                    size="md"
                    style={{ marginBottom: "0.5rem", padding: "0.5rem 1rem" }}
                    resize="none"
                    minRows={3}
                    as={ResizeTextarea}
                  />
                </FormControl>
              )}
            </Field>
            <Button
              variant="solid"
              isDisabled={props.values.comment === ""}
              isLoading={props.isSubmitting}
              type="submit"
            >
              작성하기
            </Button>
          </Form>
        )}
      </Formik>
      {comments.map((comment) => (
        <ContentView
          postId={props.postId}
          commentId={comment.id}
          body={comment.body}
          user={comment.username}
          userId={comment.user_id}
          date={comment.updated_at}
          level={comment.level}
          parents={comment.parents ? comment.parents : []}
          deleted={comment.deleted}
        />
      ))}
    </div>
  );
};

export default Comments;
