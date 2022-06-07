import { createContext, useContext, useEffect, useState } from "react";
import firebase from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";


export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);

  const setUserDataFromServer = (id) => {
    axios({
      method: "post",
      url: process.env.NEXT_PUBLIC_API_ROUTE + "api/auth",
      data: JSON.stringify({
        id: id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.data.userExists) setUserData(res.data.userData);
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase.auth, (user) => {
      setCurrentUser(user);
      if (user) setUserDataFromServer(user.uid);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
