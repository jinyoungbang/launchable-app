import styles from "../../styles/components/posts/PostView.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import PostActions from "./PostActions";

const PostView = (props) => {
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

  const [isScrolled, setIsScrolled] = useState(false);
  const [isWidthMinimized, setIsWidthMinimized] = useState(false);

  // create an event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScrollSize);
    window.addEventListener("resize", handleResize);
  });

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
              : { marginTop: "1rem", marginBottom: "2rem" }
          }
        >
          <h4 className={styles.usernameLink}>
            by&nbsp;
            <Link href={"/user/" + props.user}>
              <a>@{props.user}</a>
            </Link>
          </h4>
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
