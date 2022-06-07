import styles from "../../styles/components/main/UserDropdown.module.css";
import { Avatar } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Link from "next/link";
import firebase from "../../config/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../auth/AuthContext";
import { RiArrowDropDownLine } from "react-icons/ri";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
} from "@chakra-ui/react";

const UserDropdown = (props) => {
  const { currentUser, userData } = useAuth();
  const router = useRouter();

  const logout = () => {
    signOut(firebase.auth)
      .then(() => {
        if (router.pathname === "/") {
          router.reload();
        } else {
          router.push("/");
        }
      })
      .catch((error) => {
        router.push("/");
      });
  };

  return (
    <div>
      <Menu>
        <MenuButton>
          <div className={styles.dropdownContainer}>
            {" "}
            <Avatar
              src={userData && userData.profile.avatar_url}
              style={{
                height: "2.5rem",
                width: "2.5rem",
              }}
            />
            <RiArrowDropDownLine style={{ fontSize: "1.5rem" }} />
          </div>
        </MenuButton>
        <MenuList>
          <Link href="/settings">
            <MenuItem>설정</MenuItem>
          </Link>
          <MenuItem onClick={logout}>로그아웃</MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};

export default UserDropdown;
