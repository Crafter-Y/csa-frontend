import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginScreenProps } from "@/screens/LoginScreen";
import { Platform } from "react-native";
import useApi from "../useApiName";

export default function useAuthentication() {
  const [hasAuthError, setHasAuthError] = useState(false);
  const [authError, setAuthError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const getApi = useApi();

  const login = (
    email: string,
    password: string,
    navigation: LoginScreenProps
  ) => {
    setHasAuthError(false);
    setAuthError("");

    let configServer = getApi();
    AsyncStorage.getItem("serverId").then((serverId) => {
      if (serverId == null) {
        navigation.replace("ServerSelectorScreen");
        return;
      }

      let req = new FormData();
      req.append("email", email);
      req.append("password", password);
      req.append("expiration", Platform.OS == "web" ? "short" : "long");
      fetch(`${configServer}/api/authenticate/${serverId}`, {
        method: "post",
        body: req,
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            AsyncStorage.setItem("token", res.data.token).then(() => {
              populateUserData();
            });
          } else {
            setAuthError(res.error.message);
            setHasAuthError(true);
          }
        })
        .catch(() => {
          setAuthError(
            "Server nicht verfügbar. Bitte später erneut versuchen."
          );
          setHasAuthError(true);
        });
    });
  };

  const populateUserData = () => {
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        return;
      }

      let configServer = getApi();

      fetch(`${configServer}/api/getCurrentUserInfo/`, {
        headers: {
          token,
        },
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            setHasAuthError(false);
            setUser(res.data.user);
          } else {
            setAuthError(res.error.message);
            setHasAuthError(true);
          }
        })
        .catch(() => {
          setAuthError(
            "Server nicht verfügbar. Bitte später erneut versuchen."
          );
          setHasAuthError(true);
        });
    });
  };

  useEffect(() => {
    populateUserData();
  }, []);

  return {
    login,
    hasAuthError,
    authError,
    user,
  };
}
