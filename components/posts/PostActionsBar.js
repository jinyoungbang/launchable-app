import styles from "../../styles/components/posts/PostActionsBar.module.css";
import { FaRegHeart, FaShareAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import { Button, Stack } from "@chakra-ui/react";

const PostActionsBar = (props) => {
  const router = useRouter();
  const [likesCount, setLikesCount] = useState();
  const [postLiked, setPostLiked] = useState();
  useEffect(() => {
    setLikesCount(props.likesCount);
    setPostLiked(props.postLiked);
  }, [props]);

  const likePost = (uid) => {
    if (uid === null) router.push("/login")
    console.log(uid)
    axios({
      method: "post",
      url: process.env.NEXT_PUBLIC_API_ROUTE + "api/posts/like/" + props.postId,
      data: JSON.stringify({
        userId: uid,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 201) {
        setLikesCount(res.data.likesCount);
        setPostLiked(true);
        // Turn off loading for liked button
      }
    });
  };

  const unlikePost = (uid) => {
    axios({
      method: "post",
      url:
        process.env.NEXT_PUBLIC_API_ROUTE + "api/posts/unlike/" + props.postId,
      data: JSON.stringify({
        userId: uid,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 201) {
        setLikesCount(res.data.likesCount);
        setPostLiked(false);
        // Turn off loading for liked button
      }
    });
  };

  return (
    <div className={styles.container}>
      <Stack direction="row" spacing={4}>
        {postLiked ? (
          <Button
            onClick={() => unlikePost(props.userId)}
            style={{ backgroundColor: "#038a64", color: "white" }}
            leftIcon={<FaRegHeart />}
          >
            {likesCount}
          </Button>
        ) : (
          <Button
            onClick={() => likePost(props.userId)}
            leftIcon={<FaRegHeart />}
          >
            {likesCount}
          </Button>
        )}
        {/* <Button>
          <FaShareAlt />
        </Button> */}
      </Stack>
    </div>
  );
};

export default PostActionsBar;
