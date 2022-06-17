import styles from "../../styles/components/main/Header.module.css";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import { useAuth } from "../auth/AuthContext";
import UserDropdown from "./UserDropdown";
import { useEffect } from "react";

const Header = (props) => {
  const { currentUser, userData } = useAuth();
  useEffect(() => {
    console.log(currentUser);
    console.log(userData);
  }, [currentUser]);
  if (currentUser) {
    return (
      <header className={styles.container}>
        <Link href="/">
          <h1 style={{ fontFamily: "Alata", fontSize: "larger" }}>
            launchable
          </h1>
        </Link>
        <UserDropdown />
      </header>
    );
  } else {
    return (
      <header className={styles.container}>
        <Link href="/">
          <h1 style={{ fontFamily: "Alata", fontSize: "larger" }}>
            launchable
          </h1>
        </Link>
        <div>
          <Link href="/login">
            <Button variant="solid">로그인</Button>
          </Link>
          <Link href="/signup">
            <Button variant="solid" style={{ marginLeft: "5px" }}>
              회원가입
            </Button>
          </Link>
        </div>
      </header>
    );
  }
};

export default Header;
