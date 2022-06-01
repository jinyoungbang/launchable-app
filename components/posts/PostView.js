import styles from "../../styles/components/posts/PostView.module.css";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import Link from "next/link";
// import PostActions from "./PostActions";
import { useRouter } from "next/router";
import axios from "axios";

const PostView = (props) => {
  const { userData } = useAuth();
  const router = useRouter();
  //choose the screen size
  const handleScrollSize = () => {
    if (window.scrollY > 170) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsWidthMinimized(true);
    } else {
      setIsWidthMinimized(false);
    }
  };

  const deletePost = (postId) => {
    if (confirm("포스트를 정말로 삭제하시겠습니까?")) {
      axios({
        method: "delete",
        url:
          process.env.NEXT_PUBLIC_API_ROUTE +
          "api/posts/" +
          postId
      }).then((res) => {
        if (res.status === 200) {
          router.push("/")
        }
      });
    }
    return;
  };

  const [isPostOwner, setIsPostOwner] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWidthMinimized, setIsWidthMinimized] = useState(false);

  // create an event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScrollSize);
    window.addEventListener("resize", handleResize);
  });

  useEffect(() => {
    if (userData) {
      console.log(props);
      if (userData.username === props.user) setIsPostOwner(true);
    }
  }, [userData]);

  return (
    <div>
      <div className={styles.postContainer}>
        <h1>{props.title}</h1>
        <div
          style={
            isWidthMinimized
              ? {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "1rem",
                  marginBottom: "2rem",
                }
              : { marginTop: "2rem", marginBottom: "2rem" }
          }
        >
          <div className={styles.subtitleContainer}>
            <h4 className={styles.usernameLink}>
              by&nbsp;
              <Link href={"/user/" + props.user}>
                <a>@{props.user}</a>
              </Link>
            </h4>
            {(isPostOwner && !props.isPreview) ? (
              <div className={styles.actionsContainer}>
                {/* <h4 onClick={() => setIsEditView(true)}>수정</h4> */}
                &nbsp;
                <h4
                  onClick={() => deletePost(props.postId)}
                >
                  삭제
                </h4>
              </div>
            ) : null}
          </div>
          {/* <PostActions
            isScrolled={isScrolled}
            isWidthMinimized={isWidthMinimized}
            likes={props.likes}
          /> */}
        </div>
        <p>{props.body}</p>
      </div>
    </div>
  );
};

export default PostView;
