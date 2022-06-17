import styles from "../../styles/components/main/Header.module.css";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import { useAuth } from "../auth/AuthContext";
import UserDropdown from "./UserDropdown";
import { useEffect, useState } from "react";
import LoaderComponent from "./LoaderComponent";

const Header = (props) => {
  const { currentUser, userData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userData) setIsLoading(false);
    else setIsLoading(false);
  }, [userData]);

  if (isLoading) return <LoaderComponent size="lg" />;

  return (
    <header className={styles.container}>
      <Link href="/">
        <h1 style={{ fontFamily: "Alata", fontSize: "larger" }}>launchable</h1>
      </Link>
      {userData ? (
        <UserDropdown />
      ) : (
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
      )}
    </header>
  );
};

export default Header;
