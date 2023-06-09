import { ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import useAuthentication from "@/hooks/api/useAuthentication";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigator/RootNavigator";
import tw from "@/tailwind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BoardHeader from "@/components/BoardHeader";
import BoardSidebar from "@/components/BoardSidebar";
import Footer from "@/components/Footer";
import Board from "@/components/Board";
import useApi from "@/hooks/useApiName";
import useMediaQueries from "@/hooks/useMediaQueries";

export type BoardScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "BoardScreen"
>;

export type BoardType =
  | "Jahresansicht"
  | "Quartal Ansicht"
  | "Monatsansicht"
  | "Wochenansicht";

const BoardScreen = () => {
  const { isAuthenticating, isAuthenticated, user } = useAuthentication();
  const navigation = useNavigation<BoardScreenProps>();

  const [boardType, setBoardType] = useState<BoardType>("Quartal Ansicht");

  const { height } = useWindowDimensions();
  const { isMd } = useMediaQueries();

  const getApi = useApi();

  useEffect(() => {
    if (!isAuthenticating) {
      if (isAuthenticated) {
        console.log("Authenticated");
      } else {
        navigation.replace("LoginScreen");
      }
    }
  }, [isAuthenticating, isAuthenticated, navigation]);

  const logout = () => {
    let configServer = getApi();

    AsyncStorage.getItem("token").then((token) => {
      if (token != null) {
        fetch(`${configServer}/api/logout/`, {
          headers: {
            token,
          },
        }).finally(() => {
          AsyncStorage.removeItem("token").then(() => {
            navigation.replace("LoginScreen");
          });
        });
      } else {
        navigation.replace("LoginScreen");
      }
    });
  };

  const changePassword = () => {
    navigation.navigate("ChangePasswordScreen");
  };

  const settings = () => {
    navigation.navigate("BaseSettingsScreen");
  };

  return (
    <SafeAreaView
      style={tw.style("m-0 p-0 bg-lightgrayNeutral flex flex-row", {
        height: isMd ? height : undefined,
      })}
    >
      <BoardSidebar
        user={user}
        boardType={boardType}
        setBoardType={setBoardType}
        logout={logout}
        changePassword={changePassword}
        settings={settings}
      />
      <ScrollView>
        <BoardHeader
          user={user}
          setBoardType={setBoardType}
          boardType={boardType}
          logout={logout}
          changePassword={changePassword}
          settings={settings}
        />
        <Board boardType={boardType} />
        <Footer navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BoardScreen;
