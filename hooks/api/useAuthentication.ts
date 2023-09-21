import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import decode from "jwt-decode";
import { requestApi, requestApiWithoutCredentials } from "@/helpers/api";
import { Router } from "expo-router/build/types";

export default function useAuthentication() {
  const [hasAuthError, setHasAuthError] = useState(false);
  const [authError, setAuthError] = useState("");

  const [user, setUser] = useState<User | null>(null);

  const logout = async (router: Router) => {
    await AsyncStorage.removeItem("token")
    setUser(null);
    router.replace("/login");
  };

  const login = async (
    email: string,
    password: string,
    router: Router
  ) => {
    setHasAuthError(false);
    setAuthError("");

    let serverId = await AsyncStorage.getItem("serverId");
    if (serverId == null) {
      router.replace("/");
      return;
    }

    let res = await requestApiWithoutCredentials(`auth/${serverId}`, "POST", {
      email,
      password,
      expiration: Platform.OS == "web" ? "short" : "long"
    })

    if (res == null) {
      setAuthError("Server nicht verfügbar. Bitte später erneut versuchen.");
      setHasAuthError(true);
      return;
    }

    if (res.success) {
      AsyncStorage.setItem("token", res.data.token).then(() => {
        populateUserData();
      });
    } else {
      setAuthError(res.data.error);
      setHasAuthError(true);
    }
  };

  const populateUserData = async () => {
    let token = await AsyncStorage.getItem("token");

    if (token == null || token == undefined) {
      return;
    }

    let tokenContents: {
      productId: number,
      userId: number,
      email: string,
      firstname: string,
      lastname: string,
      role: Role,
      exp: number
    } = decode(token)

    if (new Date().getTime() / 1000 > tokenContents.exp) {
      AsyncStorage.removeItem("token");
      return;
    }

    let res = await requestApi("auth/validate", "GET");
    if (!res || !res.success) return;

    setUser({
      id: tokenContents.userId,
      firstname: tokenContents.firstname,
      lastname: tokenContents.lastname,
      email: tokenContents.email,
      role: tokenContents.role
    })
    setHasAuthError(false);
  };

  useEffect(() => {
    populateUserData();
  }, []);

  return {
    login,
    logout,
    hasAuthError,
    authError,
    user,
  };
}
