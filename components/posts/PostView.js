import styles from "../../styles/components/posts/PostView.module.css";

const PostView = (props) => {
  return (
    <div className={styles.postContainer}>
      <h1>{props.title}</h1>
      <h4 style={{marginTop:"1rem", marginBottom: "2rem"}}>by @{props.user}</h4>
      <p>{props.body}</p>
    </div>
  );
};

export default PostView;
