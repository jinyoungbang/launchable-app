import { Button } from "@chakra-ui/react";
import styles from "../../styles/assets/Button.module.css";

const MainButton = (props) => {
  return (
    <div className={styles.container}>
      <Button
        style={props.style}
        variant="solid"
        type={props.type}
        isLoading={props.isLoading}
        isDisabled={props.isDisabled}
      >
        {props.text}
      </Button>
    </div>
  );
};

export default MainButton;
