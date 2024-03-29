import styles from "../../styles/components/posts/PostView.module.css";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import Link from "next/link";
// import PostActions from "./PostActions";
import { useRouter } from "next/router";
import axios from "axios";
import parse from 'html-react-parser'

const PostView = (props) => {
  const { userData } = useAuth();
  const router = useRouter();

  const changeDateForView = (unparsedDate) => {
    const currentDate = new Date();
    const parsedDate = new Date(unparsedDate);
    const minutes = (currentDate.getTime() - parsedDate.getTime()) / 1000 / 60;
    const days = minutes / 60 / 24;
    if (minutes < 60) return Math.trunc(minutes).toString() + "분 전";
    else if (days < 1) return Math.trunc(minutes / 60).toString() + "시간 전";
    else if (days < 30) return Math.trunc(days).toString() + "일 전";
    else if (days < 365) return Math.trunc(days / 30).toString() + "달 전";
    else return Math.trunc(days / 365).toString() + "년 전";
  };
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
        url: process.env.NEXT_PUBLIC_API_ROUTE + "api/posts/" + postId,
      }).then((res) => {
        if (res.status === 200) {
          router.push("/");
        }
      });
    }
    return;
  };

  const generateAnchor = (body) => {
    console.log(body)
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return body.replace(urlRegex, function(url) {
        return '<a style="color: #02503A; font-weight: 500;" href="' + url + '" >' + url + '</a>';
    });
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
                  // display: "flex",
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
              {"  "}·{"  "}
              {changeDateForView(props.created_at)}
            </h4>
            {isPostOwner && !props.isPreview ? (
              <div className={styles.actionsContainer}>
                <h4
                  style={{ marginRight: "0.25rem" }}
                  onClick={() => router.push("/edit?id=" + props.postId)}
                >
                  수정
                </h4>
                &nbsp;
                <h4 onClick={() => deletePost(props.postId)}>삭제</h4>
              </div>
            ) : null}
          </div>
          {/* <PostActions
            isScrolled={isScrolled}
            isWidthMinimized={isWidthMinimized}
            likes={props.likes}
          /> */}
        </div>
        <p>{parse(generateAnchor(props.body))}</p>
      </div>
    </div>
  );
};

export default PostView;
