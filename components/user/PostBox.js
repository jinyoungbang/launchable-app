import { Box } from "@chakra-ui/react";
import styles from "../../styles/components/user/Postbox.module.css";
import { useRouter } from "next/router";

const changeDateForView = (unparsedDate) => {
  const parsedDate = new Date(unparsedDate);
  const year = parsedDate.getFullYear().toString();
  const month = (parsedDate.getMonth() + 1).toString();
  const date = parsedDate.getDate().toString();
  return year + "년 " + month + "월 " + date + "일";
};

const PostBox = (props) => {
  const router = useRouter();
  return (
    <div className={styles.boxContainer}>
      <Box
        as="article"
        w="100%"
        p="2"
        borderWidth="1px"
        rounded="md"
        onClick={() => router.push("/post/" + props.id)}
      >
        <div>
          <div className={styles.topHeader}>
            <h3 style={{marginRight: "0.4rem"}}>
              {changeDateForView(props.created_at)}
            </h3>
            {" "}·{" "}
            <h3 style={{marginRight: "0.4rem", marginLeft: "0.4rem"}}>{props.likes_count} 좋아요</h3>
            {" "}·{" "}
            <h3 style={{ marginLeft: "0.4rem"}}>{props.comments_count} 댓글</h3>
          </div>
          <h1>{props.title}</h1>
          <h2>{props.body.slice(0, 170) + "..."}</h2>
        </div>
      </Box>
    </div>
  );
};

export default PostBox;
