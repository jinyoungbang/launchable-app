import { Box } from "@chakra-ui/react";
import styles from "../../styles/components/user/UserInfoBox.module.css";

const UserInfoBox = (props) => {
  return (
    <div className={styles.boxContainer}>
      <Box as="article" w="100%" p="2" borderWidth="1px" rounded="md">
        <div>
          <h1>자기소개</h1>
          {props.about ? <h2>{ props.about}</h2> : <h2>아직 자기소개 작성을 안했습니다...</h2>}
        </div>
      </Box>
    </div>
  );
};

export default UserInfoBox;
