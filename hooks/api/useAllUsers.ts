import { useEffect, useState } from "react";
import useApi from "../useApiName";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useAllUsers() {
  const [allUsers, setAllUsers] = useState<APIFullResponseUser[]>([]);

  const getApi = useApi();

  const queryUsers = () => {
    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        return;
      }

      fetch(`${configServer}/api/v1/users/full`, {
        headers: {
          'Authorization': "Bearer " + token,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            setAllUsers(res.data.users);
          }
        })
        .catch(() => { });
    });
  };

  useEffect(() => {
    queryUsers();
  }, []);

  return { allUsers, queryUsers };
}
