import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestApiWithoutCredentials } from "@/helpers/api";

export default function useServerName() {
  const [name, setName] = useState("");
  const [fetchSuccessful, setFetchSuccessful] = useState(false);
  const [fetchServerError, setFetchServerError] = useState<string | null>(null);

  useEffect(() => {
    fetchServerName();
  }, []);

  const fetchServerName = async () => {
    setFetchSuccessful(false);
    setFetchServerError(null);
    setName("");

    const serverId = await AsyncStorage.getItem("serverId");
    if (serverId == null) return;

    try {
      const res = await requestApiWithoutCredentials(`products/${serverId}`, "GET");

      if (res.success) {
        setName(res.data.name);
        setFetchSuccessful(true);
      } else {
        setFetchServerError(res.data.error);
        setFetchSuccessful(false);
      }
    } catch (e) {
      setFetchServerError(e + "");
      setFetchSuccessful(false);
    }
  };

  return {
    fetchServerName,
    serverName: name,
    fetchSuccessful,
    fetchServerError
  };
}
