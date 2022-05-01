import styles from "../../styles/components/posts/Preview.module.css";
import { Box } from "@chakra-ui/react";
import { FaRegHeart } from "react-icons/fa";

const Preview = () => {
  return (
    <div className={styles.container}>
      <Box as="article" w="100%" p="2" borderWidth="1px" rounded="md">
        <div className={styles.boxContainer}>
          <div className={styles.iconContainer}>
            <p style={{ fontSize: "13px", marginLeft: "10px" }}>5</p>
            <FaRegHeart style={{ marginLeft: "5px" }} />
          </div>
          <div className={styles.contentContainer}>
            <h1>
              [React] ESLint와 Prettier가 무엇이며 왜 필요하고 어떻게 사용하는지
            </h1>
            <div className={styles.subtitle}>by jinyoungbang · 12개의 댓글</div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default Preview;
