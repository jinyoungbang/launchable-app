import styles from "../../styles/components/posts/PostActions.module.css";
import { FaRegHeart } from "react-icons/fa";
import Link from "next/link";

const PostActions = (props) => {
  if (props.isWidthMinimized) {
    return (
      <div className={styles.widthMinimizedActionsContainer}>
        <FaRegHeart /> Likes
      </div>
    );
  }
  return (
    <div>
      <div
        className={
          props.isScrolled
            ? styles.actionsContainerSticky
            : styles.actionsContainer
        }
      >
        <div className={styles.actionsBorder}>
          <div
            className={styles.actionsClickable}
            style={{ display: "flex", alignItems: "center" }}
          >
            <button className={styles.likeButton}>
              <FaRegHeart />
            </button>
            <p style={{ marginLeft: "1px" }}>{props.likes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostActions;
