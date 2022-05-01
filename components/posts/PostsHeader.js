import styles from "../../styles/components/posts/PostsHeader.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";

const PostsHeader = () => {
  const router = useRouter();
  // const { pathName } = router.pathname;

  return (
    <div className={styles.container}>
      {router.pathname === "/recent" ? (
        <div className={styles.titleContainer}>
          <Link href="/">
            <div className={styles.categoryTitleMain}>트렌딩</div>
          </Link>
          <Link href="/recent">
            <div className={styles.categoryTitleClicked}>최신</div>
          </Link>
        </div>
      ) : (
        <div className={styles.titleContainer}>
          <Link href="/">
            <div className={styles.categoryTitleMainClicked}>트렌딩</div>
          </Link>
          <Link href="/recent">
            <div className={styles.categoryTitle}>최신</div>
          </Link>
        </div>
      )}
      <Link href="/create">
        <Button
          leftIcon={<MdAdd />}
          variant="solid"
          style={{ backgroundColor: "#038A64", color: "#FFFFFF" }}
        >
          새 글 작성
        </Button>
      </Link>
    </div>
  );
};

export default PostsHeader;
