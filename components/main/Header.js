import styles from "../../styles/components/main/Header.module.css";
import { Button } from "@chakra-ui/react";
import Link from "next/link";

const Header = () => {
  return (
    <header className={styles.container}>
      <h1>Launchable</h1>
      <Link href="/login">
        <Button variant="solid">로그인</Button>
      </Link>
    </header>
  );
};

export default Header;
