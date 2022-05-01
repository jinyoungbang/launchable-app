import styles from "../../styles/components/main/Header.module.css";
import { Button } from "@chakra-ui/react";

const Header = () => {
  return (
    <header className={styles.container}>
      <h1>Launchable</h1>
      <Button variant="solid">
        로그인
      </Button>
    </header>
  );
};

export default Header;
