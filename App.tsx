import React, { useState } from "react";
import { TailwindProvider } from "tailwind-rn";
import RootNavigator from "./navigator/RootNavigator";
import utilities from "./tailwind.json";

import { de, registerTranslation } from "react-native-paper-dates";
import { AppContext } from "./helpers/AppContext";
registerTranslation("de", de);

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    // @ts-ignore - type wrong somehow
    <TailwindProvider utilities={utilities}>
      <AppContext.Provider value={{ currentUser: currentUser, setCurrentUser }}>
        <RootNavigator />
      </AppContext.Provider>
    </TailwindProvider>
  );
}
