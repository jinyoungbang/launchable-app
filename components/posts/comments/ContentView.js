import styles from "../../../styles/components/posts/comments/ContentView.module.css";

import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import axios from "axios";
import { useSWRConfig } from "swr";
import { Formik, Form, Field } from "formik";
import { Input, Button, FormControl } from "@chakra-ui/react";
import ResizeTextarea from "react-textarea-autosize";

const ContentView = (props) => {
  const { userData } = useAuth();
  const { mutate } = useSWRConfig();
  const [isCommentOwner, setIsCommentOwner] = useState(false);
  const [isEditView, setIsEditView] = useState(false);

  const changeDateForView = (unparsedDate) => {
    const currentDate = new Date();
    const parsedDate = new Date(unparsedDate);
    const minutes = ((currentDate.getTime() - parsedDate.getTime()) / 1000)/60;
    const days = minutes/60/24;
    if (minutes < 60) return (Math.trunc(minutes).toString() + "분 전")
    else if (days < 1) return (Math.trunc(minutes/60).toString() + "시간 전")
    else if (days < 30) return (Math.trunc(days).toString() + "일 전")
    else if (days < 365) return (Math.trunc(days/30).toString() + "달 전")
    else return (Math.trunc(days/365).toString() + "년 전")
  };

  useEffect(() => {
    if (userData) {
      if (userData.id === props.userId && userData.username === props.user)
        setIsCommentOwner(true);
    }
  }, [userData]);

  const deleteComment = (postId, commentId) => {
    if (confirm("댓글을 정말로 삭제하시겠습니까?")) {
      axios({
        method: "delete",
        url:
          process.env.NEXT_PUBLIC_API_ROUTE +
          "api/posts/" +
          postId +
          "/comments/" +
          commentId,
      }).then((res) => {
        if (res.status === 200) {
          mutate(
            process.env.NEXT_PUBLIC_API_ROUTE + "api/posts/" + props.postId
          );
          // actions.resetForm();
        }
      });
    }
    return;
  };

  return (
    <div>
      {isEditView ? (
        <Formik
          initialValues={{ comment: props.body }}
          onSubmit={(values, actions) => {
            axios({
              method: "patch",
              url:
                process.env.NEXT_PUBLIC_API_ROUTE +
                "api/posts/" +
                props.postId +
                "/comments/" +
                props.commentId,
              data: JSON.stringify({
                body: values.comment,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }).then((res) => {
              if (res.status === 200) {
                mutate(
                  process.env.NEXT_PUBLIC_API_ROUTE +
                    "api/posts/" +
                    props.postId
                );
                setIsEditView(false);
              } else {
                actions.resetForm();
              }
            });
            return;
          }}
        >
          {(props) => (
            <Form style={{ borderBottom: "0.9px solid gainsboro" }}>
              <Field name="comment" validate={() => console.log("lol")}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.name && form.touched.name}
                  >
                    <Input
                      {...field}
                      placeholder="댓글을 작성하세요"
                      id="title"
                      variant="outline"
                      size="sm"
                      style={{ marginBottom: "0.5rem", padding: "0.5rem 1rem" }}
                      resize="none"
                      minRows={2}
                      as={ResizeTextarea}
                    />
                  </FormControl>
                )}
              </Field>
              <div style={{minWidth: "3rem", marginBottom: "1rem", justifyContent: "flex-end"}}>
                <Button variant="solid" onClick={() => setIsEditView(false)}>
                  취소
                </Button>
                <Button
                  style={{ marginLeft: "0.25rem" }}
                  variant="solid"
                  isDisabled={props.values.comment === ""}
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  수정
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className={styles.viewContainer}>
          <div
            style={{
              width: "-webkit-calc(95% - 200px)",
              width: "-moz-calc(95% - 200px)",
              width: "calc(95% - 200px);",
            }}
          >
            <h3>{props.body}</h3>
            <div className={styles.infoContainer}>
              <h4>{props.user}</h4>
              &nbsp;
              <h4>·</h4>
              &nbsp;
              <h4>{changeDateForView(props.date)}</h4>
            </div>
          </div>
          {isCommentOwner ? (
            <div className={styles.actionsContainer}>
              <h4 onClick={() => setIsEditView(true)}>수정</h4>
              &nbsp;
              <h4 onClick={() => deleteComment(props.postId, props.commentId)}>
                삭제
              </h4>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ContentView;
